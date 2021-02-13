console.info("Server starting....");
import express from "express";
const app = express();

app.set('view engine', 'pug');

app.get("/", (res, req) => {
  req.render("login");
});

app.listen(80, () =>
  console.info("Server serving.")
);