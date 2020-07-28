#!/bin/bash

sh ./bin/start.sh

echo "starting backend tests..."

docker-compose exec api pip install '.[test]'
docker-compose exec api pytest -v

sh ./bin/stop.sh

echo "----------------------------------"
echo "backend test successfully executed"