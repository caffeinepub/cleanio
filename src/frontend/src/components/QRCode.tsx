import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setError(null);
    QRCode.toCanvas(canvas, value, {
      width: size,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
    }).catch((err: unknown) => {
      console.error("[QRCodeCanvas] Failed to generate QR code:", err);
      setError("QR Error");
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
