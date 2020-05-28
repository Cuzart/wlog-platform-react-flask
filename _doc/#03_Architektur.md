# Stack
wir verwenden fürs Frontend HTML, CSS, Javascript mit dem Framework React und für die Api Python mit dem Framework Flask. Zudem verwenden wir MariaDB.  

# Docker
wir haben uns dazu entschieden Docker zu verwenden, damit jeder die gleiche Entwicklungsumgebung hat und keine lästigen Installationen auf dem eigenen OS durchführen muss.
## Aufbau
Es gibt 4 Container:
*  **Frontend** mit einem *node:14-alpine* Image
*  **Api** mit einem *python:3.7-alpine* Image
*  eine **MariaDB** mit dem *offiziellen mariadb:10.4* Image
*  um die Datenbank effektiv zu Managen verwenden wir **PhpMyAdmin**: *phpmyadmin/phpmyadmin:latest*

# Anfangsschwierigkeiten
gab keine xD