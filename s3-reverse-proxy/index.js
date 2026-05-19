const express = require("express");
const httpProxy = require("http-proxy");

const app = express();

const PORT = 8000;

const proxy = httpProxy.createProxyServer({});

const BASE_PATH =
  "https://ketanblob1317.z29.web.core.windows.net/__outputs";

let currentProject = null;

app.use((req, res) => {
  try {
   
    const parts = req.url.split("/").filter(Boolean);

    if (parts.length > 0 && !req.url.startsWith("/assets")) {
      currentProject = parts[0];
    }

    if (!currentProject) {
      return res.send("Project not found");
    }

    let target = "";

    if (req.url.startsWith("/assets")) {
      target =
        `${BASE_PATH}/${currentProject}`;
    }

    else {
      target =
        `${BASE_PATH}/${currentProject}`;
    }

    console.log("Proxy Target:", target);

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
  const parts = req.url.split("/").filter(Boolean);

  if (parts.length === 1 && !req.url.startsWith("/assets")) {
    proxyReq.path =
      `/__outputs/${currentProject}/index.html`;
  }

  else if (req.url.startsWith("/assets")) {
    proxyReq.path =
      `/__outputs/${currentProject}${req.url}`;
  }
});

proxy.on("error", (err, req, res) => {
  console.error(err);

  res.status(500).send("Deployment not found");
});

app.listen(PORT, () => {
  console.log(
    `🚀 Proxy running on http://localhost:${PORT}`
  );
});