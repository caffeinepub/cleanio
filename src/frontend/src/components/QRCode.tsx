import QRCodeLib from "qrcode";
import { useEffect, useRef } from "react";

interface QRCodeCanvasProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * QR code rendered locally using the qrcode npm library.
 * Draws directly onto a <canvas> element — no external requests needed.
 * The download handler in AdminBookingsPage can read this canvas directly.
 */
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
    if (!canvasRef.current || !value) return;

    QRCodeLib.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
    }).catch((err: Error) => {
      console.error("[QRCodeCanvas] Failed to generate QR code:", err);
    });
  }, [value, size, fgColor, bgColor]);

  return (
    <div className={className} style={{ width: size, height: size, ...style }}>
      <canvas
        ref={canvasRef}
        id="qr-hidden-canvas"
        width={size}
        height={size}
        style={{ display: "block", borderRadius: 4 }}
      />
    </div>
  );
}
