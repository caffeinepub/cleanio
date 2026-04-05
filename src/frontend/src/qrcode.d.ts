declare module "qrcode" {
  interface QRCodeOptions {
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }

  function toCanvas(
    canvas: HTMLCanvasElement,
    text: string,
    options?: QRCodeOptions,
  ): Promise<void>;

  function toDataURL(text: string, options?: QRCodeOptions): Promise<string>;

  const QRCode: {
    toCanvas: typeof toCanvas;
    toDataURL: typeof toDataURL;
  };

  export default QRCode;
  export { toCanvas, toDataURL };
}
