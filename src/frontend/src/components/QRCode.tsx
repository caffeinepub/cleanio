import { useEffect, useRef, useState } from "react";

interface QRCodeCanvasProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Minimal QR Code generator using a simple library-free approach
// Uses the qrcode-generator algorithm embedded inline

// Reed-Solomon GF(256) tables
function buildGFTables(): { exp: number[]; log: number[] } {
  const exp = new Array<number>(512);
  const log = new Array<number>(256);
  let x = 1;
  for (let i = 0; i < 255; i++) {
    exp[i] = x;
    log[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) {
    exp[i] = exp[i - 255];
  }
  return { exp, log };
}

const { exp: GF_EXP, log: GF_LOG } = buildGFTables();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[(GF_LOG[a] + GF_LOG[b]) % 255];
}

function rsGeneratorPoly(ecCount: number): number[] {
  let g = [1];
  for (let i = 0; i < ecCount; i++) {
    const newG = new Array<number>(g.length + 1).fill(0);
    for (let j = 0; j < g.length; j++) {
      newG[j] ^= gfMul(g[j], GF_EXP[i]);
      newG[j + 1] ^= g[j];
    }
    g = newG;
  }
  return g;
}

function rsEncode(data: number[], ecCount: number): number[] {
  const gen = rsGeneratorPoly(ecCount);
  const msg = [...data, ...new Array<number>(ecCount).fill(0)];
  for (let i = 0; i < data.length; i++) {
    const coeff = msg[i];
    if (coeff !== 0) {
      for (let j = 0; j < gen.length; j++) {
        msg[i + j] ^= gfMul(gen[j], coeff);
      }
    }
  }
  return msg.slice(data.length);
}

// QR code Version 1, ECC level M, byte mode
// Capacity: up to 16 bytes
function buildQRMatrix(text: string): boolean[][] | null {
  // We'll use Version 2 (25x25) for up to ~32 chars byte mode ECC M
  // For simplicity let's embed a URL using Version 3 (29x29), ECC M
  // Actually let's use a well-known minimal approach for short URLs
  // We'll target Version 3 (29x29) with 22 EC codewords, 28 data codewords

  const encoded: number[] = [];
  for (let i = 0; i < text.length; i++) {
    encoded.push(text.charCodeAt(i));
  }

  // Version 3 ECC M: 28 data codewords, 22 EC codewords
  const version = 3;
  const size = version * 4 + 17; // 29
  const totalData = 28;
  const ecCount = 22;

  if (encoded.length > totalData - 3) return null; // too long

  // Build data codewords
  const data: number[] = [];
  // Mode indicator: byte = 0100
  // Character count: 8 bits for version <=9
  let bits = "";
  bits += "0100"; // byte mode
  bits += encoded.length.toString(2).padStart(8, "0");
  for (const b of encoded as number[]) {
    bits += (b as number).toString(2).padStart(8, "0");
  }
  // Terminator
  bits += "0000";
  // Pad to multiple of 8
  while (bits.length % 8 !== 0) bits += "0";
  // Convert to codewords
  for (let i = 0; i < bits.length; i += 8) {
    data.push(Number.parseInt(bits.slice(i, i + 8), 2));
  }
  // Pad to totalData
  const padBytes = [0xec, 0x11];
  let pi = 0;
  while (data.length < totalData) {
    data.push(padBytes[pi % 2]);
    pi++;
  }

  const ec = rsEncode(data, ecCount);
  const allCW = [...data, ...ec];

  // Place into matrix
  const N = size;
  const matrix: (boolean | null)[][] = Array.from({ length: N }, () =>
    new Array<boolean | null>(N).fill(null),
  );
  const isFunc: boolean[][] = Array.from({ length: N }, () =>
    new Array<boolean>(N).fill(false),
  );

  function setFunc(r: number, c: number, v: boolean) {
    matrix[r][c] = v;
    isFunc[r][c] = true;
  }

  // Finder pattern
  function addFinder(row: number, col: number) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const pr = row + r;
        const pc = col + c;
        if (pr < 0 || pr >= N || pc < 0 || pc >= N) continue;
        const onBorder =
          r === -1 || r === 7 || c === -1 || c === 7 || r === 0 || c === 0;
        const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        setFunc(pr, pc, onBorder || inner);
      }
    }
  }

  addFinder(0, 0);
  addFinder(0, N - 7);
  addFinder(N - 7, 0);

  // Separators (already covered by finder border above as false, just ensure)

  // Timing patterns
  for (let i = 8; i < N - 8; i++) {
    setFunc(6, i, i % 2 === 0);
    setFunc(i, 6, i % 2 === 0);
  }

  // Dark module
  setFunc(4 * version + 9, 8, true);

  // Format info (ECC M, mask 2 = 010)
  // Precomputed for Version 3, ECC M (01), mask 2 (010): format string
  // Format data: ECC (2 bits) + mask (3 bits) = 01 010 = binary 01010
  // BCH code for 01010: Let's compute
  // format = ECC_level << 13 | mask << 10
  // ECC M = 00 (not 01 — QR spec: M=00, L=01, H=10, Q=11) wait
  // QR ECC: L=01, M=00, Q=11, H=10
  // We're using M, so ECC bits = 00
  // mask pattern 2 (010): format_data = 00_010 << 10 = 0b00010_0000000000 = 0x0400
  // BCH(15,5) generator: x^10 + x^8 + x^5 + x^4 + x^2 + x + 1 = 0x537
  // XOR with mask 101010000010010 = 0x5412
  let fmt = (0b00 << 3) | 0b010; // 5 bits: 00010
  fmt = fmt << 10;
  let rem = fmt;
  for (let i = 14; i >= 10; i--) {
    if (rem & (1 << i)) rem ^= 0x537 << (i - 10);
  }
  const fmtFull = ((fmt | rem) ^ 0x5412) & 0x7fff;

  // Format bits around top-left finder
  const fmtBits: boolean[] = [];
  for (let i = 14; i >= 0; i--) {
    fmtBits.push(((fmtFull >> i) & 1) === 1);
  }

  // Place format bits top-left area
  let fi = 0;
  for (let c = 0; c <= 5; c++) {
    setFunc(8, c, fmtBits[fi++]);
  }
  setFunc(8, 7, fmtBits[fi++]);
  setFunc(8, 8, fmtBits[fi++]);
  setFunc(7, 8, fmtBits[fi++]);
  for (let r = 5; r >= 0; r--) {
    setFunc(r, 8, fmtBits[fi++]);
  }

  // Format bits top-right and bottom-left
  fi = 0;
  for (let r = N - 1; r >= N - 7; r--) {
    setFunc(r, 8, fmtBits[fi++]);
  }
  fi = 7;
  for (let c = N - 8; c < N; c++) {
    setFunc(8, c, fmtBits[fi++]);
  }

  // Data placement
  let bitIdx = 0;
  const allBits: boolean[] = [];
  for (const cw of allCW) {
    for (let b = 7; b >= 0; b--) {
      allBits.push(((cw >> b) & 1) === 1);
    }
  }

  // Zigzag placement (mask 2: (row/2 + col/3) % 2 === 0)
  let col = N - 1;
  let goUp = true;
  while (col >= 1) {
    if (col === 6) col--;
    for (let rowOffset = 0; rowOffset < N; rowOffset++) {
      const row = goUp ? N - 1 - rowOffset : rowOffset;
      for (let cx = 0; cx <= 1; cx++) {
        const c = col - cx;
        if (!isFunc[row][c]) {
          const bit = bitIdx < allBits.length ? allBits[bitIdx++] : false;
          // Apply mask 2: (row/2 + col/3) % 2 === 0
          const masked =
            (Math.floor(row / 2) + Math.floor(c / 3)) % 2 === 0 ? !bit : bit;
          matrix[row][c] = masked;
        }
      }
    }
    col -= 2;
    goUp = !goUp;
  }

  // Fill any remaining nulls
  return matrix.map((row) => row.map((cell) => cell === true));
}

export function QRCodeCanvas({
  value,
  size = 200,
  bgColor = "#ffffff",
  fgColor = "#000000",
  className,
  style,
}: QRCodeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const matrix = buildQRMatrix(value);
    if (!matrix) {
      setError("URL too long for QR code");
      return;
    }

    const N = matrix.length;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    const cellSize = size / (N + 4); // 2 modules quiet zone each side
    const offset = cellSize * 2;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = fgColor;
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (matrix[r][c]) {
          ctx.fillRect(
            offset + c * cellSize,
            offset + r * cellSize,
            cellSize,
            cellSize,
          );
        }
      }
    }
    setError(null);
  }, [value, size, bgColor, fgColor]);

  if (error) {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: bgColor,
          ...style,
        }}
      >
        <span
          style={{
            color: fgColor,
            fontSize: 12,
            textAlign: "center",
            padding: 8,
          }}
        >
          QR Error
        </span>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={style}
      aria-label="QR Code"
    />
  );
}
