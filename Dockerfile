FROM node:18.16.0-alpine3.16 as base
RUN corepack enable && \
    corepack prepare yarn@stable --activate
WORKDIR /app
COPY package.json .
COPY .yarn/ ./.yarn
COPY yarn.lock .
COPY .pnp.cjs .
COPY .pnp.loader.mjs .

FROM base as backend_builder
COPY ./backend ./backend
COPY ./types ./types
WORKDIR ./backend
RUN yarn prettier
RUN yarn lint
# RUN yarn test
RUN yarn build

FROM base AS frontend_builder
COPY ./frontend ./frontend
COPY ./types ./types
WORKDIR ./frontend
RUN yarn prettier
RUN yarn lint
RUN yarn build

FROM base
ENV DOCKER=true \
    NODE_ENV=production
COPY --from=backend_builder /app/backend/src/server/images ./backend/dist/server/images
COPY --from=backend_builder /app/backend/dist ./backend/dist
COPY --from=frontend_builder /app/frontend/dist ./frontend/dist

EXPOSE 3000

ENTRYPOINT ["node", "-r", "./.pnp.cjs", "/app/backend/dist/index.js"]
