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

let departure ="2020-04-27";
let arrival="2020-03-30";
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

let header= {'content-type': 'application/json', authorization: 'Bearer '+token}

// var options = {
//   method: 'GET',
//   url: 'https://test.api.amadeus.com/v2/shopping/flight-offers?',
//   origin :"originLocationCode=MAD",
//   destination:"&destinationLocationCode=PAR",
//   departure :"&departureDate=2020-02-25",
//   return:"&returnDate=2020-01-27",
//   passenger :"&adults=1",
//   max :"&max=250",
//   headers: header
// };

//GET flight search
// let urlFO = options.url+options.origin+options.destination+options.departure+options.return+ options.passenger+options.max
// console.log(urlFO);

// fetch(urlFO, { method: 'GET', 
//   headers: header, 
// })
//   .then((res) => {
//      return res.json()
// })
// .then((json) => {
// flightfrommadrid=json;
// console.log(flightfrommadrid);

// })

//POST flight search 




app.post('/date', function(req, res) {
  console.log(req)
    departure = req.body.departure;
    arrival = req.body.arrival;
    console.log(departure+" "+arrival)
    res.send(departure + ' ' + arrival);

}); 

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
});

let updateFlightSearch = function () {


let uriFlightOffer = "https://test.api.amadeus.com/v2/shopping/flight-offers"
// console.log(request);
fetch(uriFlightOffer, { method: 'POST', 
  headers: this.header, 
  body: JSON.stringify(this.request)
})
  .then((res) => {
     return res.json()
})
.then((json) => {
  // console.log(json);
  flightfrommadrid2=json.data;
  return flightfrommadrid2;
  // Do something with the returned data.
});  
}


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/flight', function(req, res) {
  res.send(JSON.stringify(flightfrommadrid));
});

app.get('/flightSearch', function(req, res) {
  res.send(JSON.stringify(updateFlightSearch()));
});

app.get('/token', function(req, res) {
  res.send(JSON.stringify(token));
});


app.listen(port);
// console.log(tree)
console.log('Amadeus RESTful API server started on: ' + port);