
import express from 'express';
import httpProxy from 'http-proxy';
import 'dotenv/config';

const app = express();
const proxy = httpProxy.createProxyServer({});

const PORT = Number(process.env.PORT) || 8000;
const REGION = process.env.AWS_REGION || 'ap-southeast-2';
const BUCKET = process.env.S3_BUCKET_NAME || 'ketan-deployment-builds';

const S3_BASE_URL =
  `https://${BUCKET}.s3.${REGION}.amazonaws.com`;

app.use((req, res) => {
  const hostname = req.hostname;
  const subdomain = hostname.split('.')[0];

  if (!subdomain || subdomain === 'localhost') {
    res.status(404).send('Project not found');
    return;
  }

  const requestedPath = req.url === '/' ? '/index.html' : req.url;

  const targetPath =
    `/deployments/${subdomain}${requestedPath}`;

  console.log(`[${subdomain}] ${targetPath}`);

  proxy.web(req, res, {
    target: S3_BASE_URL,
    changeOrigin: true,
    selfHandleResponse: false,
    headers: {},
  });
});

proxy.on('proxyReq', (proxyReq, req) => {
  const hostname = req.headers.host || '';
  const subdomain = hostname.split('.')[0];

  const requestedPath = req.url === '/' ? '/index.html' : req.url;

  proxyReq.path =
    `/deployments/${subdomain}${requestedPath}`;
});

proxy.on('error', (error, _req, res) => {
  console.error('Proxy error:', error);

  if ('writeHead' in res && !res.headersSent) {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Deployment unavailable');
  }
});

app.listen(PORT, () => {
  console.log(`S3 reverse proxy running on port ${PORT}`);
});
