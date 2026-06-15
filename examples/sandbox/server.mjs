// Sandbox local para probar @fmcoldays/post-action y @fmcoldays/modal en el
// navegador, sirviendo el dist/ ya compilado + jquery/notiflix desde
// node_modules + endpoints mock. Sin dependencias externas.
//
//   node examples/sandbox/server.mjs   →  http://localhost:5173

import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { extname, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..', '..')

const requireFromModal = createRequire(join(root, 'packages', 'modal', 'package.json'))
const requireFromPostAction = createRequire(join(root, 'packages', 'post-action', 'package.json'))
const jqueryPath = requireFromModal.resolve('jquery')
const notiflixPath = requireFromPostAction.resolve('notiflix')

const MIME = {
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.map': 'application/json',
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
}

// Puente ESM: notiflix solo trae UMD, así que el AIO se carga como <script>
// clásico (setea window.Notiflix) y este módulo re-exporta sus named exports.
const NOTIFLIX_SHIM = `const N = window.Notiflix;
export const Notify = N.Notify;
export const Confirm = N.Confirm;
export default N;`

// Vista parcial de ejemplo para el modal (header + form + footer).
const PARTIAL = `
<div class="p-1">
  <div data-modal-header><h2 style="margin:0">Editar item (modal de prueba)</h2></div>
  <form id="demo-form" onsubmit="event.preventDefault(); window.Notiflix.Notify.success('Form enviado (mock)'); document.getElementById('dialog-form').close()">
    <label>Nombre<br><input name="nombre" placeholder="Escribe algo" style="padding:.4rem;width:100%"></label>
  </form>
  <div data-modal-footer style="margin-top:1rem">
    <button type="submit" form="demo-form">Guardar</button>
  </div>
</div>`

function send(res, status, body, type = 'text/plain') {
  res.writeHead(status, { 'Content-Type': type })
  res.end(body)
}

async function sendFile(res, path) {
  try {
    const buf = await readFile(path)
    res.writeHead(200, { 'Content-Type': MIME[extname(path)] ?? 'application/octet-stream' })
    res.end(buf)
  } catch {
    send(res, 404, 'not found')
  }
}

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? '/', 'http://localhost')

  if (pathname === '/') return sendFile(res, join(here, 'index.html'))

  // Dist compilado de cada paquete.
  if (pathname.startsWith('/pkg/shared/')) return sendFile(res, join(root, 'packages/shared/dist', pathname.slice(12)))
  if (pathname.startsWith('/pkg/post-action/')) return sendFile(res, join(root, 'packages/post-action/dist', pathname.slice(17)))
  if (pathname.startsWith('/pkg/modal/')) return sendFile(res, join(root, 'packages/modal/dist', pathname.slice(11)))

  // Vendor (peer deps) desde node_modules.
  if (pathname === '/vendor/jquery.js') return sendFile(res, jqueryPath)
  if (pathname === '/vendor/notiflix-aio.js') return sendFile(res, notiflixPath)
  if (pathname === '/vendor/notiflix.js') return send(res, 200, NOTIFLIX_SHIM, 'text/javascript')

  // Endpoints mock.
  if (pathname === '/api/echo') return send(res, 200, JSON.stringify({ success: true, message: `Operación OK (${req.method})` }), 'application/json')
  if (pathname === '/api/fail') return send(res, 400, JSON.stringify({ message: 'Algo salió mal (mock 400)' }), 'application/json')
  if (pathname === '/api/badge') return send(res, 200, '<span style="color:green;font-weight:600">ACTIVO ✓</span>', 'text/html')
  if (pathname === '/api/file') {
    res.writeHead(200, { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="reporte.csv"' })
    return res.end('col1,col2\n1,2\n3,4\n')
  }
  if (pathname === '/partial') return send(res, 200, PARTIAL, 'text/html; charset=utf-8')

  send(res, 404, 'not found')
})

server.listen(5173, () => {
  console.log('Sandbox  →  http://localhost:5173')
  console.log('jquery   →', jqueryPath)
  console.log('notiflix →', notiflixPath)
})
