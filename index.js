const express = require("express");
const cors = require("cors");
const bparser = require("body-parser");
const jwt = require("jsonwebtoken");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const lodashId = require("lodash-id");

const adapter = new FileSync("db.json");
const db = low(adapter);
const app = express();
const port = 5555;

db._.mixin(lodashId);

app.use(cors());
app.use(bparser.urlencoded({ extended: true }));
app.use(bparser.json());

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/products", (request, response) => {
  const products = db.get("products").value();

  return response
    .json({
      products,
    })
    .status(200);
});

app.post("/delete", (request, response) => {
  const { id } = request.body;
  console.log("id");
  console.log(id);
  const collection = db.get("products");
  const result = collection.removeById(id).write();
  console.log("result");
  console.log(result);

  return response
    .json({
      result,
    })
    .status(200);
});

app.post("/add-product", (request, response) => {
  const { name, price, imgUrl } = request.body;
  const collection = db.get("products");
  // .push()
  // .write();
  const newItem = collection
    .insert({
      name,
      price,
      imgUrl,
    })
    .write();

  return response
    .json({
      result: newItem,
    })
    .status(200);
});

app.post("/login", (request, response) => {
  const user = db
    .get("users")
    .find({
      id: request.body.id,
    })
    .value();

  if (user) {
    if (user.password === request.body.password) {
      const token = jwt.sign({ foo: "bar" }, "scretKey");
      return response.json({ token }).status(200);
    }

    return response.json({ error: "Invalid password" }).status(200);
  }

  return response.json({ error: "Login failed" }).status(200);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
