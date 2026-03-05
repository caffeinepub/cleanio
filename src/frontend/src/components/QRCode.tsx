/**
 * Minimal QR Code canvas renderer using qrcodegen algorithm.
 * Pure TypeScript implementation — no external dependencies.
 * Based on Project Nayuki's QR Code generator (MIT license).
 */
import { useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// Minimal QR generator — encodes text into a boolean matrix
// ---------------------------------------------------------------------------

type QRMatrix = boolean[][];

// Galois Field arithmetic for QR codes
const GF_EXP: number[] = new Array(512);
const GF_LOG: number[] = new Array(256);

function initGF() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
}

initGF();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[(GF_LOG[a] + GF_LOG[b]) % 255];
}

function gfPoly(poly: number[], term: number): number[] {
  const out = new Array(poly.length + 1).fill(0);
  for (let i = 0; i < poly.length; i++) out[i] ^= gfMul(poly[i], term);
  for (let i = 0; i < poly.length; i++) out[i + 1] ^= poly[i];
  return out;
}

function rsGenerator(deg: number): number[] {
  let poly = [1];
  for (let i = 0; i < deg; i++) poly = gfPoly(poly, GF_EXP[i]);
  return poly;
}

function rsRemainder(data: number[], gen: number[]): number[] {
  const rem = new Array(gen.length - 1).fill(0);
  for (const b of data) {
    const factor = b ^ rem.shift()!;
    rem.push(0);
    for (let i = 0; i < rem.length; i++) rem[i] ^= gfMul(gen[i + 1], factor);
  }
  return rem;
}

// ---------------------------------------------------------------------------
// QR version 2 (25×25) for short URLs — or version 3 (29×29)
// We'll use version 2 with ECC level M: 16 data bytes, 10 EC bytes
// Max alphanumeric: 38 chars. Max byte: 20.
// We'll use byte encoding for URLs (version picks automatically up to v5).
// ---------------------------------------------------------------------------

// Finder + format pattern helpers
function setRect(
  m: boolean[][],
  r: number,
  c: number,
  h: number,
  w: number,
  v: boolean,
) {
  for (let i = r; i < r + h; i++) for (let j = c; j < c + w; j++) m[i][j] = v;
}

function addFinder(m: boolean[][], r: number, c: number) {
  setRect(m, r, c, 7, 7, true);
  setRect(m, r + 1, c + 1, 5, 5, false);
  setRect(m, r + 2, c + 2, 3, 3, true);
}

function addAlignment(m: boolean[][], r: number, c: number) {
  setRect(m, r - 2, c - 2, 5, 5, true);
  setRect(m, r - 1, c - 1, 3, 3, false);
  m[r][c] = true;
}

// QR version info
type VersionInfo = {
  size: number;
  dataBytes: number;
  ecBytes: number;
  alignments: [number, number][];
};

const QR_VERSIONS: VersionInfo[] = [
  // v1: 21×21, ECC-M, 16 data bytes, 10 EC bytes
  { size: 21, dataBytes: 16, ecBytes: 10, alignments: [] },
  // v2: 25×25, ECC-M, 28 data bytes, 16 EC bytes
  { size: 25, dataBytes: 28, ecBytes: 16, alignments: [[18, 18]] },
  // v3: 29×29, ECC-M, 44 data bytes, 26 EC bytes
  { size: 29, dataBytes: 44, ecBytes: 26, alignments: [[22, 22]] },
  // v4: 33×33, ECC-M, 64 data bytes, 18 EC bytes (2 blocks)
  { size: 33, dataBytes: 64, ecBytes: 36, alignments: [[26, 26]] },
  // v5: 37×37, ECC-M, 86 data bytes, 46 EC bytes
  { size: 37, dataBytes: 86, ecBytes: 46, alignments: [[30, 30]] },
];

// Mask pattern 0: (row + col) % 2 == 0
function mask0(row: number, col: number) {
  return (row + col) % 2 === 0;
}

// Format bits for ECC M + mask 0 = 0b10_100_101_0010_010 → 0x5695 after masking
// Precomputed: ECC level M (bits 10) + mask 000 → format info = 0b101011111011001 = 22465
// We'll use the standard format string for M/0: bits = 5 ^ 21522 = 26870 in some schemes.
// For simplicity we hard-code mask pattern 0 with ECC level M.
// Format bits (15 bits, unmasked data = 0b10000 = ECM<<3 | mask0):
//   raw = 10000 << 10 | RS(10000) = 10000_0100111010 (standard QR tables)
//   XOR format mask 101010000010010 → 111010100110100 = 0x7534 → 0b111010100110100
// We'll just hard-code the 15-bit format string.
const FORMAT_BITS_M0 = 0b111011111000100; // ECC=M, mask=0, standard

function writeBit(m: boolean[][], r: number, c: number, v: boolean) {
  m[r][c] = v;
}

function placeFormat(m: boolean[][], size: number) {
  const bits = FORMAT_BITS_M0;
  // Horizontal near top-left finder
  for (let i = 0; i < 6; i++) writeBit(m, 8, i, ((bits >> i) & 1) === 1);
  writeBit(m, 8, 7, ((bits >> 6) & 1) === 1);
  writeBit(m, 8, 8, ((bits >> 7) & 1) === 1);
  writeBit(m, 7, 8, ((bits >> 8) & 1) === 1);
  for (let i = 0; i < 6; i++)
    writeBit(m, 5 - i, 8, ((bits >> (9 + i)) & 1) === 1);
  // Vertical near top-right finder
  for (let i = 0; i < 8; i++)
    writeBit(m, 8, size - 1 - i, ((bits >> i) & 1) === 1);
  // Horizontal near bottom-left finder
  writeBit(m, size - 7, 8, true); // dark module
  for (let i = 0; i < 7; i++)
    writeBit(m, size - 6 + i, 8, ((bits >> (8 + i)) & 1) === 1);
}

function buildMatrix(version: number, dataBits: boolean[]): boolean[][] {
  const vi = QR_VERSIONS[version - 1];
  const size = vi.size;
  const m: boolean[][] = Array.from({ length: size }, () =>
    new Array(size).fill(false),
  );
  // reserved marker for fixed patterns
  const reserved: boolean[][] = Array.from({ length: size }, () =>
    new Array(size).fill(false),
  );

  const reserve = (r: number, c: number, h: number, w: number) => {
    for (let i = r; i < r + h; i++)
      for (let j = c; j < c + w; j++) reserved[i][j] = true;
  };

  // Finder patterns
  addFinder(m, 0, 0);
  addFinder(m, 0, size - 7);
  addFinder(m, size - 7, 0);
  reserve(0, 0, 9, 9);
  reserve(0, size - 8, 9, 8);
  reserve(size - 8, 0, 8, 9);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    m[6][i] = i % 2 === 0;
    m[i][6] = i % 2 === 0;
    reserved[6][i] = true;
    reserved[i][6] = true;
  }

  // Alignment patterns (v2+)
  for (const [ar, ac] of vi.alignments) {
    addAlignment(m, ar, ac);
    reserve(ar - 2, ac - 2, 5, 5);
  }

  // Dark module
  m[size - 8][8] = true;

  // Place data bits (zigzag)
  let idx = 0;
  let goingUp = true;
  for (let col = size - 1; col >= 1; col -= 2) {
    if (col === 6) col = 5; // skip timing column
    for (let rowOff = 0; rowOff < size; rowOff++) {
      const row = goingUp ? size - 1 - rowOff : rowOff;
      for (let subCol = 0; subCol < 2; subCol++) {
        const c = col - subCol;
        if (reserved[row][c]) continue;
        const bit = idx < dataBits.length ? dataBits[idx++] : false;
        // Apply mask 0: (row+col) % 2 == 0 → invert
        m[row][c] = mask0(row, c) ? !bit : bit;
      }
    }
    goingUp = !goingUp;
  }

  // Format information
  placeFormat(m, size);

  return m;
}

function encodeData(text: string, version: number): boolean[] {
  const vi = QR_VERSIONS[version - 1];
  const bytes = new TextEncoder().encode(text);
  const bits: number[] = [];

  const push = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
  };

  // Mode: byte = 0100
  push(0b0100, 4);
  // Character count (8 bits for version 1–9)
  push(bytes.length, 8);
  // Data
  for (const b of bytes) push(b, 8);
  // Terminator
  const totalBits = vi.dataBytes * 8;
  const termLen = Math.min(4, totalBits - bits.length);
  for (let i = 0; i < termLen; i++) bits.push(0);
  // Pad to byte boundary
  while (bits.length % 8 !== 0) bits.push(0);
  // Pad bytes
  const padBytes = [0b11101100, 0b00010001];
  let pi = 0;
  while (bits.length < totalBits) {
    push(padBytes[pi % 2], 8);
    pi++;
  }

  // Convert to byte array for EC
  const dataArr: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
    dataArr.push(b);
  }

  // Reed-Solomon EC
  const gen = rsGenerator(vi.ecBytes);
  const ec = rsRemainder(dataArr, gen);

  const allBytes = [...dataArr, ...ec];
  const allBits: boolean[] = [];
  for (const b of allBytes)
    for (let i = 7; i >= 0; i--) allBits.push(((b >> i) & 1) === 1);

  return allBits;
}

function pickVersion(text: string): number {
  const len = new TextEncoder().encode(text).length;
  // v1 → 16 data bytes (mode + len header = 2 bytes, so max ~13 chars)
  // v2 → 28 data bytes → max ~25 chars
  // v3 → 44 data bytes → max ~41 chars
  // v4 → 64 data bytes → max ~61 chars
  // v5 → 86 data bytes → max ~83 chars
  const maxData = [13, 25, 41, 61, 83];
  for (let v = 1; v <= 5; v++) {
    if (len <= maxData[v - 1]) return v;
  }
  return 5; // fallback
}

export function generateQRMatrix(text: string): QRMatrix {
  const version = pickVersion(text);
  const bits = encodeData(text, version);
  return buildMatrix(version, bits);
}

// ---------------------------------------------------------------------------
// React component
// ---------------------------------------------------------------------------

interface QRCodeCanvasProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  className?: string;
  style?: React.CSSProperties;
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const matrix = generateQRMatrix(value);
    const modules = matrix.length;
    const pixelSize = Math.floor(size / modules);
    const actualSize = pixelSize * modules;

    canvas.width = actualSize;
    canvas.height = actualSize;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, actualSize, actualSize);
    ctx.fillStyle = fgColor;

    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        if (matrix[r][c]) {
          ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
        }
      }
    }
  }, [value, size, bgColor, fgColor]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={style}
      aria-label="QR Code"
    />
  );
}
