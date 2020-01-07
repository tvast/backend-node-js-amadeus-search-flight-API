---
title: Node JS app for amadeus API
date: 2019-01-07
---


## NodeJS app for working with anadeus app

Hello folks. Today we'll learn how to start your proof of concept for a disruptive travel agency with the self service Amadeus API.

The architecture is pretty simple. You get the token from the amadeus API with your credentials given with you opened account at <a href="https://developers.amadeus.com/register">Amadeus</a>. ANd then you can ask the api to give you flight offers, inspiration travels and many other content from the Amadeus API.

FIrst thing first we need a simple Node js server to get it running 

```javascript
var express = require('express')

const bodyParser = require('body-parser');

const fetch = require('node-fetch');

 app = express(),
 port = process.env.PORT || 3000;

app.use(allowCrossDomain);

app.listen(port);
// console.log(tree)
console.log('Amadeus RESTful API server started on: ' + port);
```

This code is an instance of an express server. Who listen on the port 3000. Here is the package json to install the depedencies :
```javascript
{
  "name": "Amadeus",
  "version": "1.0.0",
  "description": "parse folder of ventyas to generate jSon",
  "main": "server.js",
  "scripts": {
    "start": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "theophile vast",
  "license": "ISC",
  "devDependencies": {
    "express": "^4.17.1",
    "nodemon": "^1.19.4"
  },
  "dependencies": {
    "amadeus": "^3.2.0",
    "dree": "^2.1.11",
    "glob": "^7.1.4",
    "node-fetch": "^2.6.0",
    "node-static": "^0.7.11",
    "request": "^2.88.0",
    "serve-index": "^1.9.1"
  }
}
```

## First call to the API get the token

If you are familiar with Oauth it will be easy for you to navigat into the API of Amadeus. To get the token we add our url to the API, and we will fetch it to get the token.

```javascript
const uriAuth ="https://test.api.amadeus.com/v1/security/oauth2/token" 


//get grant
let headers= {
      // 'Content-Type': 'application/json'   
      'Content-Type': 'application/x-www-form-urlencoded',
     };

let body = {
   "grant_type": "client_credentials",
   "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  
}

let token="";

fetch(uriAuth, { method: 'POST', 
  headers: headers, 
  body: 'grant_type=client_credentials&client_id=' + body.client_id + '&client_secret=' + body.client_secret
})
  .then((res) => {
     return res.json()
})
.then((json) => {
  token=json.access_token;
  console.log(token);
  // Do something with the returned data.
});

```

Here we fetch the url passing the credentials into the body of the request as a string. And we save the token into a variable.

You can check the documentation if you get any error.



## Ask the API : Flight offer search

IF you are here it means that you got the precious token. Congratulations ! Now its time to build your request to post it and retrieve data from the AMadeus flight offer search endpoint.


```javascript
let request = {
  "currencyCode": "USD",
  "originDestinations": [
    {
      "id": "1",
      "originLocationCode": "MAD",
      "destinationLocationCode": "PAR",
      "departureDateTimeRange": {
        "date": departure,
        "time": "10:00:00"
      }
    },
   ],
  "travelers": [
    {
      "id": "1",
      "travelerType": "ADULT",
      "fareOptions": [
        "STANDARD"
      ]
    },
  ],
  "sources": [
    "GDS"
  ],
  "searchCriteria": {
    "maxFlightOffers": 50,
    "flightFilters": {
      "cabinRestrictions": [
        {
          "cabin": "BUSINESS",
          "coverage": "MOST_SEGMENTS",
          "originDestinationIds": [
            "1"
          ]
        }
      ],
     }
  }
}

```

Where departure is the value desired for your search. It can come from a post from any frontend framework with the next code snippets : 

```javascript
app.post('/date', function(req, res) {
  console.log(req)
    departure = req.body.departure;
    arrival = req.body.arrival;
    console.log(departure+" "+arrival)
    res.send(departure + ' ' + arrival);

}); 
```
Now you can post your json variable to the api and get some data : 

```javascript
let uriFlightOffer = "https://test.api.amadeus.com/v2/shopping/flight-offers"
// console.log(request);
fetch(uriFlightOffer, { method: 'POST', 
  headers: header, 
  body: JSON.stringify(request)
})
  .then((res) => {
     return res.json()
})
.then((json) => {
  // console.log(json);
  flightfrommadrid=json.data;
  // Do something with the returned data.
}); 
```
And if you want to serve your result to a route here is the snippets :
```javascript
app.get('/flight', function(req, res) {
  res.send(JSON.stringify(flightfrommadrid));
});
```
the complete code is available on github <a href="https://github.com/tvast/parser-amadeus-test">complete code</a>



## Ask the API : Flight offer prices

## Ask the API flight create order
