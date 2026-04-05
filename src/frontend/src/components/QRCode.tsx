interface QRCodeCanvasProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * QR code rendered via qrserver.com API.
 * The canvas ref trick in AdminBookingsPage looks for a <canvas> inside the
 * wrapper div for the download — we simulate that by drawing the img onto a
 * hidden canvas so the existing download logic still works.
 */
export function QRCodeCanvas({
  value,
  size = 200,
  bgColor = "#ffffff",
  fgColor = "#000000",
  className,
  style,
}: QRCodeCanvasProps) {
  // Build qrserver.com URL
  const color = fgColor.replace("#", "");
  const bg = bgColor.replace("#", "");
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&color=${color}&bgcolor=${bg}&margin=10`;

  return (
    <div
      className={className}
      style={{ width: size, height: size, position: "relative", ...style }}
    >
      {/* Hidden canvas used by the download handler in AdminBookingsPage */}
      <canvas
        id="qr-hidden-canvas"
        width={size}
        height={size}
        style={{ display: "none" }}
      />
      <img
        src={qrUrl}
        alt="QR Code"
        width={size}
        height={size}
        style={{ display: "block", borderRadius: 4 }}
        onLoad={(e) => {
          // Paint the loaded image onto the hidden canvas so download works
          const canvas = document.getElementById(
            "qr-hidden-canvas",
          ) as HTMLCanvasElement | null;
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.drawImage(e.currentTarget, 0, 0, size, size);
        }}
        crossOrigin="anonymous"
      />
    </div>
  );
}
