const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const apiKey = '52047378f662735ac68a63080ec6afb7' 

const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart(){
    console.log("Express server is listening on " + HTTP_PORT);
}

app.set('view engine', '.ejs');

//using body parser middleware
app.use(bodyParser.urlencoded({extended: true}));

//setting the route for homepage
app.get("/", function(req,res){
    res.render('index');
});

app.post("/", function(req,res){
    /* res.render('index');
    console.log(req.body.city); */
    let city = req.body.city;
    //now we'll set the url to access the api data
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    request(url, function (err, response, body) {
        if(err){
          res.render('index', {weather: null, error: 'Error, please try again'});
        } else {
          let weather = JSON.parse(body)
          if(weather.main == undefined){
            res.render('index', {weather: null, error: 'Error, please try again'});
          } else {
            let weatherTemp = (weather.main.temp-32) * 0.55; 
            let weatherTempSliced = weatherTemp.toFixed(2);
            let weatherText = `It's ${weatherTempSliced} degrees Ferenheit in ${weather.name}!`;
            res.render('index', {weather: weatherText, error: null});
          }
        }
      });
    })


app.listen(HTTP_PORT, onHttpStart);