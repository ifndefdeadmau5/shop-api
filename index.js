const express = require("express");
const cors = require("cors");
const bparser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const port = 5555;

app.use(cors());
app.use(bparser.urlencoded({ extended: true }));
app.use(bparser.json());

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/login", (request, response) => {
  console.log(request.body.id);
  console.log(request.body.password);

  // id, password check
  const token = jwt.sign({ foo: "bar" }, "scretKey");
  console.log("token");
  console.log(token);
  return response.json({ token }).status(200);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
