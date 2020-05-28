Wir benötigen eine User Tabelle diese könnte so aussehen:

Tabellenname: **users**

| name | type | attribute |
|---|---|---|
| **id** | int | primary key |
| **username** | varchar | not null|
| **email** | varchar | not null |
| **password** | varchar | not null |
| **name** | varchar | not null|
| **surname** | varchar | not null|
| **description** | text | null |
| **profilpicture** | varchar | null |
| **created_at** | timestamp | not null |
 
Zusätzlich benötigen wir eine Tabelle für die Blogeinträge.

Tabellenname: **posts**

| name | type | attribute |
|---|---|---|
| **id** | int | primary key |
| **user_id** | varchar | foreign key|
| **title** | varchar | not null |
| **abstract?** | varchar | not null |
| **location** | varchar | not null|
| **main_picture?** | varchar | not null |
| **text** | text | not null|
| **gallery** | varchar| not null |
| **created_at** | timestamp | not null |


Beispiel für gallery JSON:

`gallery = {
  [{id: 1,
  caption: "Leuchturm",
  uri: "/img/posts/username_postId_pictureID"
  },
  {pictureObject},
  ...
 ]
}`
