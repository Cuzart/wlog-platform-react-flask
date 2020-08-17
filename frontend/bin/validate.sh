#!/bin/bash

sh ./bin/start.sh

echo "starting to validate frontend ..."

echo "------------VALIDATION------------"

docker-compose exec frontend npx eslint --ext .js --ext .jsx src/

if [[ $(docker-compose exec frontend npx eslint --ext .js --ext .jsx src/) ]]; then
    echo ""
else
    echo "Code is all valid"
fi

echo "----------------------------------"

sh ./bin/stop.sh

