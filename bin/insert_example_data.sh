#!/bin/bash

sh ./bin/start.sh

echo "setting up DB with example data"

docker-compose exec mariadb sh -c "mysql -u root -p'iamroot' wlog < /sql_dump/wlog_dummy_data.sql"


sh ./bin/stop.sh
echo "--------------------------------"