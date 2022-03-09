const express = require("express");
import sslRedirect from "heroku-ssl-redirect";
const path = require("path");
const app = express();
app.use(express.static(__dirname + "/dist/periodic-wordle"));
app.use(sslRedirect());
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/periodic-wordle/index.html"));
});
app.listen(process.env.PORT || 8080);
