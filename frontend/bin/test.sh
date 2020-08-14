#!/bin/bash

sh ./bin/start.sh

echo "starting frontend tests..."

docker-compose exec frontend npm run test

sh ./bin/stop.sh

echo "----------------------------------"
echo "frontend test successfully executed"