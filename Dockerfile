FROM node:20-slim

WORKDIR /app

# Copy only the built output (from your local build)
COPY .output ./.output

ENV HOST=0.0.0.0
ENV PORT=80
EXPOSE 80

# Default command: start Nuxt server
CMD ["node", ".output/server/index.mjs"]
