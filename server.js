var app = require('express')();
var http = require('http').createServer(app);

const cors = require('cors')
var express = require('express')

var { token, flightSearch, createOrder, confirmPrice, endpoints } = require('plume')

let allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  next();
}
app.use(allowCrossDomain);
var tokenAccess= ""
try 
{
  token("qztkbf5XWjNSGkXRF9bfAwNg6bELWvVD","w9mJ7ZJzlEGNffut").then(function(x){
  var NaseUrl = "https://test.api.amadeus.com"

    try {
      flightSearch(endpoints.searchFlight, NaseUrl,"BKK", "SYD", "2020-03-16", x.access_token).then(function(y){
      console.log(y)
  
          try {
            createOrder("https://test.api.amadeus.com",endpoints.createOrder,y.data[3], "a@gmail.com", x.access_token).then(z=>console.log(z))
          }
          catch(error) {
            console.error(error);
          }
          })
        }
        catch(error) {
          console.error(error);
        }

}
  ).catch(error=>console.log(error))
} 

catch(error) {
  console.error(error);
}

var server = app.listen(process.env.PORT || 9000,()=>{
  console.log("Howdy, I am running at PORT 9000")
})
