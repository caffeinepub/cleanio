import { useEffect, useRef, useState } from "react";

interface QRCodeCanvasProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Load qrcodejs from CDN and render QR code onto a canvas
function loadQRLib(): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const scriptId = "qrcodejs-cdn";
    const existing = document.getElementById(scriptId);
    const win = window as Window & { QRCode?: unknown };

    if (existing) {
      if (win.QRCode) {
        resolve(win.QRCode);
      } else {
        existing.addEventListener("load", () => resolve(win.QRCode));
        existing.addEventListener("error", reject);
      }
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    script.onload = () => resolve(win.QRCode);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function QRCodeCanvas({
  value,
  size = 200,
  bgColor = "#ffffff",
  fgColor = "#000000",
  className,
  style,
}: QRCodeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!value || !containerRef.current) return;

    const container = containerRef.current;
    // Clear previous QR
    container.innerHTML = "";

    loadQRLib()
      .then((QRLib) => {
        if (!container) return;
        container.innerHTML = "";
        // biome-ignore lint/suspicious/noExplicitAny: external CDN library
        new (QRLib as any)(container, {
          text: value,
          width: size,
          height: size,
          colorDark: fgColor,
          colorLight: bgColor,
          correctLevel: 1, // M
        });
        setError(null);
      })
      .catch((err) => {
        console.error("QR Code error:", err);
        setError("QR generation failed");
      });
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
          border: "1px solid #ccc",
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
    <div
      ref={containerRef}
      className={className}
      style={{ width: size, height: size, lineHeight: 0, ...style }}
      aria-label="QR Code"
    />
  );
}
