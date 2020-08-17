# Wlog

„Wlog – World Log, erstelle deinen individuellen Reiseblog und teile diesen in einer interaktiven Karte mit anderen Nutzern. Verfolge die Reisen anderer und lasse dich von ihren Erlebnissen inspirieren.“

## Getting Started

Um das Projekt erfolgreich starten zu können muss Docker installiert sein, da Container-Virtualisierung verwendet wird.

Das Wlog Projekt zuerst vom GitLab Repository auf den lokalen Rechner klonen:
```bash
$ cd <mein_wunschordner>
$ git clone git@gitlab.mi.hdm-stuttgart.de:ss486/wlog.git
```

Mithilfe von docker-compose ist es nun bereits möglich das Projekt mit allen benötigten Containern zu starten. Hierbei werden alle benötigten Images und benötigten Packages automatisch heruntergeladen und installiert. Beim ersten Mal ausführen wird zudem die MariaDB automatisch neu aufgesetzt.
```bash
$ cd wlog
$ docker-compose up
```

Jetzt ist bereits das **frontend** über Port `3000` zu erreichen. Die **api** hört auf Port `5000`. **PhpMyAdmin** zur Datenbankverwaltung kann über den Browser auf Port `8000` geöffnet werden. 
Einfach im Browser in die Suchleiste `http://localhost:<PORT>/` mit dem gewünschten Port eingeben. 

Um Wlog vollständig einsatzbereit zu machen, muss die Datenbank noch mit der benötigten Struktur initialisiert werden.
Dieser Prozess ist aber mit Hilfe eines Shell Skriptes leicht möglich. 

Anmerkung: Alle Skripte des Projektes müssen immer auf Top-Level im wlog Ordner ausgeführt werden.
```bash
$ cd wlog
$ sh ./bin/initial_setup.sh
```

Das Projekt ist nun erfolgreich mit einer leeren Datenbank aufgesetzt und kann nun über `http://localhost:3000/` verwendet werden. Es ist allerdings auch möglich, die Datenbank mit Beispieldaten zu befüllen, um direkt einen guten Eindruck über Wlog zu gewinnen.
```bash
$ sh ./bin/insert_example_data.sh
```

Desweiteren gibt es ein *./bin/start.sh* und ein *./bin/stop.sh* Skript. Mithilfe von diesen, kann das Projekt im Hintergrund gestartet und auch wieder gestoppt werden.
Für den Fall, dass man während der Benutzung auch Logs sehen möchte, startet man wie bereits verwendet `docker-compose up`. Zum Beenden kann in der Konsole einfach `Ctrl + C` gedrückt werden. Dies ist vor allem für die Entwicklung relevant.

Um die Docker Container und das erstellte Docker Volume für die Datenbank wieder zu entfernen, gibt es ein remove Skript. Hiermit erhält man wieder den Anfangszustand.
```bash
$ sh ./bin/remove.sh
```

## Testing

Gerade in der Entwicklung ist es enorm wichtig regelmäßig die einzelnen Units auf ihre Funktionstüchtigkeit zu testen.
Um das Ausführen so einfach wie möglich zu gestalten, wurden hiefür ebenfalls zu den entsprechenden Unterprojekten **frontend** und **backend** Skripte erstellt.

### Frontend

Um das Frontend zu validieren wird eslint verwendet. Zur Ausführung muss lediglich das Skript aufgerufen werden.
```bash
$ sh ./frontend/bin/validate.sh
```

Um die implementierten Unit Tests auszuführen gibt es das *test.sh* Skript:
```bash
$ sh ./frontend/bin/test.sh
```

### Backend

Zur Validierung des Backends wird flake8 verwendet: 
```bash
$ sh ./backend/bin/validate.sh
```

Um das Backend erfolgreich zu testen, muss zuerst eine Testdatenbank aufgesetzt werden, da nicht auf der 'echten' Datenbank getestet werden kann. Dies ist mit dem *test_setup.sh* Skript allerdings leicht möglich.
```bash
$ sh ./backend/bin/test_setup.sh
```

Jetzt können die mit pytest implementierten Unit Tests erfolgreich gestartet werden:
```bash
$ sh ./backend/bin/test.sh
```

Für den Fall, dass die Tests für das komplette Projekt ausgeführt werden sollen:
```bash
$ sh ./bin/test.sh
```