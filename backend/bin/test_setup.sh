#!/bin/bash

sh ./bin/start.sh

echo "starting the configuration for backend testing..."

docker-compose exec mariadb mysql -u root -p'iamroot' \
 -e "CREATE DATABASE IF NOT EXISTS test_wlog; 
     COMMIT;
     GRANT ALL PRIVILEGES ON test_wlog.* TO 'admin'@'%'; 
     FLUSH PRIVILEGES;"


sh ./bin/stop.sh
echo "--------------------------------"
echo "test setup successfully executed"