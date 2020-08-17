#!/bin/bash

echo '----------Test Backend----------'
sh ./backend/bin/test.sh
echo '----------Test Frontend----------'
sh ./frontend/bin/test.sh