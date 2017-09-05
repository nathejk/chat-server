FROM node:8-alpine
WORKDIR /app
COPY package.json ./
RUN npm install

COPY . .

ENV NODE_ENV production
# RUN npm run build:prod

# FROM mhart/alpine-node:base-8
# WORKDIR /app
# COPY --from=0 /app .


# ENV NODE_ENV production
EXPOSE 3002

CMD [ "node", "index.js" ]
