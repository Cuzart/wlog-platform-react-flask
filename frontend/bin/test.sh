#!/bin/bash

sh ./bin/start.sh

echo "starting frontend tests..."

docker-compose exec frontend npm test

sh ./bin/stop.sh

echo "----------------------------------"
echo "frontend test successfully executed"