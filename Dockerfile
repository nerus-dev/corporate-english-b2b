FROM node:24-alpine AS build
WORKDIR /presentation
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY index.html ./
COPY src ./src
COPY public ./public
COPY scripts ./scripts
RUN npm run build

FROM node:24-alpine
WORKDIR /presentation
ENV NODE_ENV=production
COPY --from=build /presentation/dist ./dist
COPY scripts/serve.mjs ./scripts/serve.mjs
EXPOSE 4173
CMD ["node", "scripts/serve.mjs"]
