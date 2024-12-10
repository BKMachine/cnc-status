FROM node:20.11.1-alpine3.18 as builder
RUN apk add --update git python3 make gcc g++
RUN corepack enable && \
    corepack prepare yarn@4.1.0 --activate
WORKDIR /app
COPY . .
RUN yarn

RUN cd /app/backend && \
    yarn prettier && \
    yarn lint && \
    yarn build

RUN cd /app/frontend && \
    yarn prettier && \
    yarn lint && \
    yarn build

ENV NODE_ENV=production
EXPOSE 3000
ENTRYPOINT ["node", "-r", "/app/.pnp.cjs", "/app/backend/dist/index.js"]
