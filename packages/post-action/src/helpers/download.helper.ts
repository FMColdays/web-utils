/**
 * Trata la respuesta como archivo descargable: crea un blob URL y dispara la
 * descarga del navegador. El nombre se toma del header `Content-Disposition`,
 * con fallback a `'descarga'`.
 */
export async function triggerDownload(res: Response): Promise<void> {
  const disposition = res.headers.get('Content-Disposition') ?? ''
  const match = disposition.match(/filename[^;=\n]*=(['"]?)([^'";\n]+)\1/)
  const filename = match?.[2]?.trim() ?? 'descarga'

  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
