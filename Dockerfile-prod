FROM node:20.10.0-slim

WORKDIR /app

COPY . .

RUN npm i -g bun
RUN bun i

EXPOSE 3000

RUN bun run build

CMD ["bun", "start"]