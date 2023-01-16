// Require the express module
const express = require("express");
const bodyParser = require("body-parser");

// Require the native https node module
const https = require("https");

// Initialize app, a new instance of express.
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

// Create a port
const port = 3000;

// Responding to a get request by client to the root route
app.get("/", function(req, res) {

  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {

  const query = req.body.cityName;
  const appKey = "49e205f930d7ee2e4495ef4240371134";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + appKey + "&units=" + unit;

  https.get(url, function(response){
    console.log(response.statusCode);

    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      // sending data back to the client.
      // For this we need to use res.send
      // Can only have one send method.
      // So, use multiple res.write to overcome this.

      res.write("<h1>The temperature in " + query + " is " + temp + " degrees.</h1>");
      res.write("<h2>The weather is currently " + weatherDescription + ".</h2>");
      res.write("<img src=" + imageURL + ">");
      res.send();
    });

  });

});

// listen on the port
app.listen(port, function() {
  console.log("The server is running on port " + port + ".");
});
