
/**
 * Convertit un Blob en Base64
 * @param blob Blob à convertir
 * @returns Chaîne Base64
 */
export async function blobToBase64(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const base64 = btoa(String.fromCharCode(...uint8Array));
  return base64;
}
