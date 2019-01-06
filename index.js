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
            //we will recieve all the data as a JSON object
            //so first we have to converte the json object to readable string
          let weather = JSON.parse(body)


          if(weather.main == undefined){
            res.render('index', {weather: null, error: 'Error, please try again'});
          } else {
              //weather.main.temp will show the temp in farenheit
              //so we have to change the farenheit into celcius
            let weatherTemp = (weather.main.temp-32) * 0.55; 
            
            //Since we used mathemetical equation on the weatherTemp, we are going to get 4 to 8 digits after the
            //decimal point....but we just need two digit after the decimal point so we will use 'toFixed(2)' 
            let weatherTempSliced = weatherTemp.toFixed(2);

            //update the weather text
            let weatherText = `It's ${weatherTempSliced} degrees Ferenheit in ${weather.name}!`;

            //render the data and show it on the browser
            res.render('index', {weather: weatherText, error: null});
          }
        }
      });
    })


app.listen(HTTP_PORT, onHttpStart);