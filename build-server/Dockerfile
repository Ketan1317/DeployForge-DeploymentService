FROM node:20-bookworm-slim

WORKDIR /home/app

RUN apt-get update && \
    apt-get install -y --no-install-recommends git ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/
COPY main.sh ./

RUN npm run build

RUN chmod +x main.sh

ENTRYPOINT ["/bin/sh", "/home/app/main.sh"]
