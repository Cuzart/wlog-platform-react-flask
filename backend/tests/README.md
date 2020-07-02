# Setup zum Testen
Da die Tests auf keinen Fall auf der richtigen Datenbank ausgeführt werden dürfen, benötigt man eine zusätzliche Test-Datenbank.
## Einrichten der Test-Datenbank
Zuerst starten wir das Projekt.
```bash
$ docker-compose up --build
```
In einem zweiten Konsolenfenster verbindet man sich nun als root User zur MariaDB Konsole.
 ```bash
$ docker-compose exec mariadb mysql -u root -p
Enter password: iamroot 
```
Zuerst legen wir die neue Datenbank an.
```sql
CREATE DATABASE `test_wlog`;
COMMIT;
```
Jetzt müssen wir nur noch unserem 'admin' User die Rechte für die Datenbank geben. 
```sql
GRANT ALL PRIVILEGES ON `test_wlog`.* TO 'admin'@'%'; 
FLUSH PRIVILEGES;
```
## Testen der API
Um die Api zu testen öffnen wir eine Shell des Containers.
 ```bash
$ docker-compose exec api sh
```
Die benötigten Dependencies und vorallem unser eigenes Packet installieren.
 ```bash
$ pip install '.[test]'
```
Jetzt können die Tests einfach ausgeführt werden:
 ```bash
$ pytest -v
```
