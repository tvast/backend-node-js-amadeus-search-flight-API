var express = require('express')
var glob = require("glob")
const bodyParser = require('body-parser');

const fetch = require('node-fetch');

 app = express(),
 port = process.env.PORT || 3000;


let allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  next();
}
app.use(allowCrossDomain);
let Amadeus = require('amadeus');

let amadeus = new Amadeus({
  clientId: 'qztkbf5XWjNSGkXRF9bfAwNg6bELWvVD',
  clientSecret: 'w9mJ7ZJzlEGNffut'
});

const uriAuth ="https://test.api.amadeus.com/v1/security/oauth2/token" 

let departure ="2020-02-01";
let arrival="2020-03-30";
let locationDeparture="MAD"
let locationArrival="PAR"
//get grant
let headers= {
      // 'Content-Type': 'application/json'   
      'Content-Type': 'application/x-www-form-urlencoded',
     };

let body = {
   "grant_type": "client_credentials",
   "client_id": "qztkbf5XWjNSGkXRF9bfAwNg6bELWvVD",
  "client_secret": "w9mJ7ZJzlEGNffut",
  
}

let token="";
let flightfrommadrid ="";
fetch(uriAuth, { method: 'POST', 
  headers: headers, 
  body: 'grant_type=client_credentials&client_id=' + body.client_id + '&client_secret=' + body.client_secret
})
  .then((res) => {
     return res.json()
})
.then((json) => {
  console.log(json);
  token=json.access_token;
  console.log(token);


//POST flight search 

});
let header= {'content-type': 'application/json', authorization: 'Bearer '+token}

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/date', function(req, res) {
  
    departure = req.body.departure;
    arrival = req.body.arrival;
    locationDeparture = req.body.locationDeparture;
    locationArrival =req.body.locationArrival;
    
    updateFlightSearch(departure, arrival, locationArrival,locationDeparture);
    console.log(departure, arrival, locationArrival,locationDeparture);
    // console.log(departure+" "+arrival)
    // res.send(departure + ' ' + arrival);

}); 



// let uriFlightOffer = "https://test.api.amadeus.com/v2/shopping/flight-offers"
// // console.log(request);
// fetch(uriFlightOffer, { method: 'POST', 
//   headers: header, 
//   body: JSON.stringify(request)
// })
//   .then((res) => {
//      return res.json()
// })
// .then((json) => {
//   // console.log(json);
//   flightfrommadrid=json.data;
//   // Do something with the returned data.
// });

let updateFlightSearch = function (departure, arrival, locationArrival,locationDeparture) {
// flightfrommadrid2="";
let header= {'content-type': 'application/json', authorization: 'Bearer '+token}

let request = {
  "currencyCode": "USD",
  "originDestinations": [
    {
      "id": "1",
      "originLocationCode": locationDeparture,
      "destinationLocationCode": locationArrival,
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
  console.log(json);
  flightfrommadrid2=json.data;
  return flightfrommadrid2;
  // Do something with the returned data.
});  
}



app.get('/flight', function(req, res) {
  res.send(JSON.stringify(flightfrommadrid));
});

app.get('/flightSearch', function(req, res) {
  res.send(JSON.stringify(flightfrommadrid2));
  console.log(flightfrommadrid2)
});

app.get('/token', function(req, res) {
  res.send(JSON.stringify(token));
});


app.listen(port);
// console.log(tree)
console.log('Amadeus RESTful API server started on: ' + port);