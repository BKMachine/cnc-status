FROM node:16.13.2-alpine3.15 as base
WORKDIR /app

FROM base AS backend_prod_dependencies
COPY ./backend/package.json ./backend/yarn.lock ./
RUN yarn --production=true

FROM backend_prod_dependencies as backend_dev_dependencies
RUN yarn --production=false

FROM base as frontend_dependencies
COPY ./frontend/package.json ./frontend/yarn.lock ./
RUN yarn --production=false

FROM backend_dev_dependencies as backend_builder
COPY ./backend .
RUN yarn prettier
RUN yarn lint
#RUN yarn test
RUN yarn build

FROM frontend_dependencies AS frontend_builder
COPY ./frontend .
RUN yarn prettier
RUN yarn lint
RUN yarn build

FROM base
ENV DOCKER=true \
    NODE_ENV=production
COPY --from=backend_prod_dependencies /app/node_modules ./backend/node_modules
COPY --from=backend_builder /app/src/server/images ./backend/dist/server/images
COPY --from=backend_builder /app/dist ./backend/dist
COPY --from=frontend_builder /app/dist ./frontend/dist

EXPOSE 3000

ENTRYPOINT ["node", "/app/backend/dist/index.js"]
