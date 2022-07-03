// const http = require('http') //commonJs (CJS) sino podria ser ES modules (ESM) que es cuando declaro import http from 'http'por ejemplo
const express = require("express");

const app = express();

app.use(express.json());

app.use((request, response, next) => {
  console.log(request.method);
  console.log(request.path);
  console.log(request.body);
  console.log("-------------");
  next();
});

let notes = [
  {
    id: 1,
    content: "Tengo que acomodar los muebles para la tarde",
    date: "2022-06-23",
    important: true,
  },
  {
    id: 2,
    content: "ahora seria la cocina",
    date: "2022-06-23",
    important: false,
  },
  {
    id: 3,
    content: "y listo todo",
    date: "2022-06-23",
    important: true,
  },
];

// const app = http.createServer((request, response) => {
//  // esto es un callback de nodeJs
//   response.writeHead(200, { "Content-Type": "application/json" });
//   response.end(JSON.stringify(notes));
// });

app.get("/", (request, response) => {
  response.send("<h1>Hello Jupiter Word</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);

  if (note) {
    response.send(note);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end();
});

app.post("/api/notes", (request, response) => {
  const note = request.body;

  if (!note || !note.content) {
    return response.status(400).json({
      error: "note.content is missing",
    });
  }

  const ids = notes.map((note) => note.id);
  const maxId = Math.max(...ids);

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== "undefined" ? note.important : false,
    date: new Date().toISOString(),
  };

  notes = [...notes, newNote];

  response.status.apply(201).json(newNote);
});

app.use((request, response) => {
  console.log(request.path);
  response.status(404).json({
    error: "Not found",
  });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
