FROM oven/bun
WORKDIR /usr/src/app
COPY . .

ENTRYPOINT [ "bun", "run", "src/server.ts" ]

