import express, { request } from "express";

const app = express();
const port = 3000;

function logger(req, res, next) {

  console.log("Request data", req.method, req.url);
  next();
}

app.use(logger);

app.get("/", (req, res) => {
  res.send("Hello this is custom middleware");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
