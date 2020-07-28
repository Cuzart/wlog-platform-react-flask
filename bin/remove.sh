#!/bin/bash

docker system prune --force
docker volume rm wlog_mariadb-data