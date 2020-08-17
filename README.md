# Wlog

„Wlog – World Log, erstelle deinen individuellen Reiseblog und teile diesen in einer interaktiven Karte mit anderen Nutzern. Verfolge die Reisen anderer und lasse dich von ihren Erlebnissen inspirieren.“

## Getting Started

Um das Projekt erfolgreich starten zu können muss Docker vorinstalliert sein, da Container-Virtualisierung verwendet wird.

Das Wlog Projekt zuerst vom GitLab Repository auf den lokalen Rechner klonen:
```bash
$ cd <mein_wunschordner>
$ git clone git@gitlab.mi.hdm-stuttgart.de:ss486/wlog.git
```

Mit Hilfe von docker-compose ist es bereits möglich das Projekt und dessen Containern zu starten. Hierbei werden alle benötigten Images und  Packages automatisch heruntergeladen und installiert. Bei der ersten Ausführung wird zudem die MariaDB automatisch neu aufgesetzt.
```bash
$ cd wlog
$ docker-compose up
```

Das **frontend** ist nun über Port `3000` erreichbar, während die **api**  auf Port `5000` hört. **PhpMyAdmin** zur Datenbankverwaltung kann über den Browser auf Port `8000` geöffnet werden. 
Dafür muss man `http://localhost:<PORT>/` mit dem gewünschten Port im Browser aufrufen. 

Um Wlog vollständig einsatzbereit zu machen, muss die Datenbank noch mit der benötigten Struktur initialisiert werden.
Dies lässt sich mit Hilfe eines Shell Skriptes leicht umsetzten.

Anmerkung: Alle Skripte des Projektes müssen immer auf Top-Level im wlog Ordner ausgeführt werden.
```bash
$ cd wlog
$ sh ./bin/initial_setup.sh
```

Das Projekt ist nun erfolgreich mit einer leeren Datenbank aufgesetzt und kann nun über `http://localhost:3000/` verwendet werden. Es ist ebenfalls möglich, die Datenbank mit Beispieldaten zu befüllen, um direkt einen guten Eindruck über Wlog zu gewinnen.
```bash
$ sh ./bin/insert_example_data.sh
```

Desweiteren gibt es ein *./bin/start.sh* und ein *./bin/stop.sh* Skript. Womit das Projekt im Hintergrund gestartet und auch wieder gestoppt werden kann.
Für den Fall, dass man während der Benutzung auch Logs sehen möchte, startet man wie bereits verwendet `docker-compose up`. Zum Beenden kann in der Konsole einfach `Ctrl + C` gedrückt werden. Dies ist vor allem bei der Entwicklung relevant.

Um die Docker Container und das erstellte Docker Volume für die Datenbank wieder zu entfernen, gibt es ein remove Skript. Hiermit erhält man wieder den Anfangszustand.
```bash
$ sh ./bin/remove.sh
```

## Testing

Gerade in der Entwicklung ist es enorm wichtig, regelmäßig die einzelnen Units auf ihre Funktionstüchtigkeit zu testen.
Um das Ausführen so einfach wie möglich zu gestalten, wurden hiefür ebenfalls Skripte zu den entsprechenden Unterprojekten **frontend** und **backend** erstellt.

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

Zur Validierung des Backends wird analog flake8 verwendet: 
```bash
$ sh ./backend/bin/validate.sh
```

Um das Backend erfolgreich zu testen, muss zuerst eine Testdatenbank aufgesetzt werden, da nicht auf der 'echten' Datenbank getestet werden kann. Dies lässt sich mit dem *test_setup.sh* Skript leicht umsetzen.
```bash
$ sh ./backend/bin/test_setup.sh
```

Jetzt können die mit pytest implementierten Unit Tests erfolgreich gestartet werden:
```bash
$ sh ./backend/bin/test.sh
```

Um alle Tests zusammen auszuführen, gibt es noch das folgende Skript.
```bash
$ sh ./bin/test.sh
```
