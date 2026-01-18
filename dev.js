const http = require('http');

const PORT = 8000;

const handler = async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const timestamp = new Date().toISOString();

  let body = null;
  const contentType = req.headers['content-type'];
  if (contentType && contentType.includes('application/json')) {
    body = await new Promise((resolve) => {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(null);
        }
      });
    });
  }

  const responseBody = {
    message: 'Hello from Supabase Edge Function! (Dev Mode)',
    timestamp,
    method: req.method,
    path: url.pathname,
    debug: true,
    body: body || undefined,
  };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(responseBody, null, 2));
};

const server = http.createServer(handler);

server.listen(PORT, () => {
  console.log(`🚀 Servidor de desenvolvimento iniciado em http://localhost:${PORT}`);
  console.log(`📁 Função: hello-world`);
  console.log(`🔍 Debug: Anexe o debugger na porta 9229\n`);
});
