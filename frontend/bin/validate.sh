#!/bin/bash

sh ./bin/start.sh

echo "starting to validate frontend ..."

echo "------------VALIDATION------------"

docker-compose exec frontend [ $(node -p "try{require('eslint/package.json').version}catch(e){}") != "7.6.0" ]  &&  npm install eslint --save-dev
docker-compose exec frontend npx eslint --ext .js --ext .jsx src/

if [[ $(docker-compose exec frontend npx eslint --ext .js --ext .jsx src/) ]]; then
    echo ""
else
    echo "Code is all valid"
fi

echo "----------------------------------"


