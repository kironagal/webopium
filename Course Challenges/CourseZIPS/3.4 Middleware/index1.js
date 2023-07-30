import express from "express";
import bodyParser from "body-parser";
//these three lines help in finding out the path where the index/any other files is present when it is hosted on to cloud
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  console.log(__dirname, "/public/index.html")
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
