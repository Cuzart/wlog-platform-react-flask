#!/bin/bash

sh ./bin/start.sh

echo "starting to validate backend ..."

docker-compose exec api pip install flake8
echo "------------VALIDATION------------"
docker-compose exec api flake8 --ignore=E402,E266,E121,W605,W291

if [[ $(docker-compose exec api flake8 --ignore=E402,E266,E121,W605,W291) ]]; then
    echo ""
else
    echo "Code is all valid"
fi
echo "----------------------------------"

sh ./bin/stop.sh
