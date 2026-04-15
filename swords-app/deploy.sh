#!/bin/sh
set -e

# Usage: ./deploy.sh yourdomain.com your@email.com
DOMAIN=${1:?Usage: ./deploy.sh <domain> <email>}
EMAIL=${2:?Usage: ./deploy.sh <domain> <email>}

if [ ! -f .env ]; then
  echo "ERROR: .env file not found. Copy .env.example and fill in values."
  exit 1
fi

echo "==> Building and starting db + api..."
docker compose -f docker-compose.prod.yml up -d --build db api

echo "==> Waiting for db to be healthy..."
until docker compose -f docker-compose.prod.yml exec db pg_isready -U postgres 2>/dev/null; do
  sleep 2
done

echo "==> Obtaining SSL certificate for $DOMAIN..."
docker run --rm \
  -p 80:80 \
  -v "$(docker volume inspect swords-app_certbot_conf --format '{{.Mountpoint}}' 2>/dev/null || echo swords-app_certbot_conf)":/etc/letsencrypt \
  certbot/certbot certonly \
  --standalone \
  --agree-tos \
  --non-interactive \
  --email "$EMAIL" \
  -d "$DOMAIN"

echo "==> Starting all services (nginx + certbot)..."
docker compose -f docker-compose.prod.yml up -d --build

echo "==> Done. Checking health..."
sleep 3
curl -sf "https://$DOMAIN/api/health" && echo "API is up!" || echo "WARNING: health check failed, check logs with: docker compose -f docker-compose.prod.yml logs"
