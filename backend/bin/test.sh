#!/bin/bash

docker-compose up --build -d

echo "starting backend tests..."

docker-compose exec api pip install '.[test]'
docker-compose exec api pytest -v

docker-compose down

echo "----------------------------------"
echo "backend test successfully executed"