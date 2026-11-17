import express, { Request, Response } from 'express';
import httpProxy from 'http-proxy';
import http from 'http';
import net from 'net';

const app = express();
const proxy = httpProxy.createProxyServer({});
const PORT = 8000;

const BASE_PATH = 'https://ketanblob1317.z29.web.core.windows.net/__outputs';

app.use((req: Request, res: Response) => {
  try {
    const hostname = req.hostname;

    // project123.localhost
    const subdomain = hostname.split('.')[0];

    if (!subdomain || subdomain === 'localhost') {
      res.send('No project found');
      return;
    }

    const target = `${BASE_PATH}/${subdomain}`;

    console.log('Target:', target);

    proxy.web(req, res, {
      target,
      changeOrigin: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Proxy Error');
  }
});

proxy.on('proxyReq', (proxyReq: http.ClientRequest, req: http.IncomingMessage) => {
  const host = req.headers.host || '';
  const subdomain = host.split('.')[0];

  if (req.url === '/') {
    proxyReq.path = `/__outputs/${subdomain}/index.html`;
  } else {
    proxyReq.path = `/__outputs/${subdomain}${req.url}`;
  }
});

proxy.on('error', (err: Error, _req: http.IncomingMessage, res: http.ServerResponse | net.Socket) => {
  console.error(err);

  if ('writeHead' in res && typeof res.writeHead === 'function') {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Deployment not found');
  }
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Proxy running on port ${PORT}`);
});

export default server;
