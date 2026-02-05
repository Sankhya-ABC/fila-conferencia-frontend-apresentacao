export function hexToImageBlob(hex: string, mimeType = 'image/png'): string {
  const bytes = new Uint8Array(
    hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
  );

  const blob = new Blob([bytes], { type: mimeType });
  return URL.createObjectURL(blob);
}
