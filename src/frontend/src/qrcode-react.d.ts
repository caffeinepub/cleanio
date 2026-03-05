declare module "qrcode.react" {
  import type * as React from "react";

  export interface QRCodeCanvasProps {
    value: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    level?: "L" | "M" | "Q" | "H";
    includeMargin?: boolean;
    marginSize?: number;
    imageSettings?: {
      src: string;
      height?: number;
      width?: number;
      excavate?: boolean;
      x?: number;
      y?: number;
    };
    style?: React.CSSProperties;
    className?: string;
    id?: string;
  }

  export interface QRCodeSVGProps extends QRCodeCanvasProps {}

  export const QRCodeCanvas: React.FC<QRCodeCanvasProps>;
  export const QRCodeSVG: React.FC<QRCodeSVGProps>;
}
