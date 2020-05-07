# Wlog

Wir verwenden Docker. Stelle bitte sicher, dass Docker erfolgreich installiert ist.<br>
Um unser geniales Projekt zu starten klone dir das Projekt in deinen Wunschordner.

```bash
$ cd <mein_wunschordner>
$ git clone git@gitlab.mi.hdm-stuttgart.de:ss486/wlog.git
```

Öffne das Projekt in Visual Studio Code

```bash
$ cd wlog
$ code .
```

Um die Container zu starten gehe in den Projektordner und führe `docker-compose up` aus. Dadurch started die **api** und das **frontend**.
Die Konsole einfach offen lassen und zum beenden `Ctrl + C` drücken.

```bash
$ cd wlog
$ docker-compose up
```

Das **frontend** ist auf Port `3000` gemappt. Die **api** befindet sich auf Port `5000`. Um das entsprechende Projekt anzuschauen öffne einen Browser deiner Wahl und gebe `http://localhost:<PORT>/` ein.

## Development

Die Projekte sind gemoutet. Das bedeutet, dass die Änderungen die wir Lokal auf unsererm Rechner machen automatisch in den Container übernommen werden. Man muss den Browser Tab nur neu laden `F5` und sieht sofort seine Änderungen.

Für den Fall, dass man in den Container schauen muss kann man eine Shell `sh` öffnen. Für die api ist auch die Bash `bash` verfügbar. Um aus der Shell zu gelangen einfach `exit` eingeben.

```bash
$ docker-compose exec [frontend|api] sh
# exit
```

**LLLLLLLets GO!!**
