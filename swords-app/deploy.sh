#!/bin/sh
set -e

echo "==> Building and starting all services..."
docker compose -f docker-compose.prod.yml up -d --build

echo "==> Waiting for api to be ready..."
sleep 5
curl -sf "http://localhost/api/health" && echo "API is up!" || echo "WARNING: health check failed — check logs with: docker compose -f docker-compose.prod.yml logs"
