#!/bin/bash
echo "Starting SiPelKa Backend in Development Mode..."
docker compose -f docker-compose.dev.yml up --build
