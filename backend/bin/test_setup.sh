#!/bin/bash

docker-compose up --build -d

echo "starting the configuration for backend testing..."

docker-compose exec mariadb mysql -u root -p'iamroot' \
 -e "CREATE DATABASE IF NOT EXISTS test_wlog; 
     COMMIT;
     GRANT ALL PRIVILEGES ON test_wlog.* TO 'admin'@'%'; 
     FLUSH PRIVILEGES;"


docker-compose down
echo "--------------------------------"
echo "test setup successfully executed"