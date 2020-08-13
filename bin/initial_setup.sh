#!/bin/bash

sh ./bin/start.sh

echo "setting up the database.."

docker-compose exec mariadb sh -c "mysql -u root -p'iamroot' wlog < /sql_dump/wlog.sql"


sh ./bin/stop.sh
echo "--------------------------------"
echo "Wlog is ready to use!"