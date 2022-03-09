const express = require("express");
var forceSsl = require("force-ssl-heroku");
const path = require("path");
const app = express();

app.use(forceSsl);
app.use(express.static(__dirname + "/dist/periodic-wordle"));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/periodic-wordle/index.html"));
});
app.listen(process.env.PORT || 8080);
