const express = require("express");
const httpProxy = require("http-proxy");

const app = express();

const proxy = httpProxy.createProxyServer({});

const PORT = 8000;

const BASE_PATH =
  "https://ketanblob1317.z29.web.core.windows.net/__outputs";

app.use((req, res) => {
  try {
    const hostname = req.hostname;

    // project123.localhost
    const subdomain = hostname.split(".")[0];

    if (
      !subdomain ||
      subdomain === "localhost"
    ) {
      return res.send("No project found");
    }

    const target =
      `${BASE_PATH}/${subdomain}`;

    console.log("Target:", target);

    proxy.web(req, res, {
      target,
      changeOrigin: true,
    });

  } catch (error) {
    console.error(error);

    res.status(500).send("Proxy Error");
  }
});

proxy.on("proxyReq", (proxyReq, req) => {

  if (req.url === "/") {
    proxyReq.path =
      `/__outputs/${req.hostname.split(".")[0]}/index.html`;
  }

  else {
    proxyReq.path =
      `/__outputs/${req.hostname.split(".")[0]}${req.url}`;
  }
});

proxy.on("error", (err, req, res) => {
  console.error(err);

  res.status(500).send("Deployment not found");
});

app.listen(PORT, () => {
  console.log(
    `🚀 Proxy running on port ${PORT}`
  );
});