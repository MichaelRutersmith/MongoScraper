//use express
var express = require("express");
// hey look a port
var PORT = process.env.PORT || 3000;
// declare app
var app = express();
//have app use public folder
app.use(express.static("public"));
// this stuff is needed or it doesnt work
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// I can write my code with handlebars, with handlebars, with handlebaaaaarrss
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
//bring in the routes
var routes = require("./controllers/Controller.js");
//use the routes
app.use(routes);

//listen on the port
app.listen(PORT, function() {
    console.log("Server listening on: http://localhost:" + PORT);
})