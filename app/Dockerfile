FROM oven/bun

WORKDIR /app

COPY index.ts .

RUN bun add hono redis

EXPOSE 3000
CMD ["bun", "index.ts"]
