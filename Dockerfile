    # Stage 1: Build the React application
    FROM node:latest as builder
    WORKDIR /app
    COPY package.json yarn.lock ./
    RUN yarn install --frozen-lockfile
    COPY . .
    RUN yarn build

    # Stage 2: Serve the static files with Nginx
    FROM nginx:stable-alpine
    COPY --from=builder /app/build /usr/share/nginx/html
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
