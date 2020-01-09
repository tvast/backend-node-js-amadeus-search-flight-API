var express = require('express')
var glob = require("glob")
const bodyParser = require('body-parser');

const fetch = require('node-fetch');
var stringify = require('json-stringify-safe');
app = express(),
port = process.env.PORT || 3000;


let allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  next();
}
app.use(allowCrossDomain);

const uriAuth ="https://test.api.amadeus.com/v1/security/oauth2/token" 
//initialize variable
let departure ="2020-02-01";
let arrival="2020-03-30";
let locationDeparture="MAD";
let locationArrival="PAR";
let flightfrommadrid="";
let flightfrommadrid2="";
let flightfrommadrid3="";
let inputFlight="";
let cretateOrder ="";
let data="";
//get grant
let headers= {  
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    let body = {
     "grant_type": "client_credentials",
     "client_id": "qztkbf5XWjNSGkXRF9bfAwNg6bELWvVD",
     "client_secret": "w9mJ7ZJzlEGNffut",

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
    console.log(json);
    token=json.access_token;
    console.log(token);


//POST flight search 

});

let header= {'content-type': 'application/json', authorization: 'Bearer '+token}
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

//get flight offer
app.post('/date', function(req, res) {
  departure = req.body.departure;
  arrival = req.body.arrival;
  locationDeparture = req.body.locationDeparture;
  locationArrival =req.body.locationArrival;
  updateFlightSearch(departure, arrival, locationArrival,locationDeparture);
  }); 
//get flight offer price

app.post('/flightprice', function(req, res) {
  res.json(req.body);
// console.log("request :"+JSON.stringify(req.body))
  inputFlight = req.body;
  console.log(inputFlight)
   // res.send(req.body);
  flifghtPrice(inputFlight);
    }); 

app.post('/flightCreateOrder', function(req, res) {
  res.json(req.body);
// console.log("request :"+JSON.stringify(req.body))
  inputFlightCreateOrder = req.body;
  console.log(inputFlightCreateOrder)
   // res.send(req.body);
  CreateOrder(inputFlightCreateOrder)
  .then((data) => {
    console.log(data);
    cretateOrder=data // JSON data parsed by `response.json()` call
  });;
    }); 


//flight search
 // let header= {'Content-Type': 'application/json', authorization: 'Bearer '+token}
let updateFlightSearch = function (departure, arrival, locationArrival,locationDeparture) {
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


// async function getUserAsync(name) 
// {
//   let response = await fetch(`https://api.github.com/users/${name}`);
//   let data = await response.json()
//   return data;
// }

// getUserAsync('yourUsernameHere')
//   .then(data => console.log(data)); 

let flifghtPrice = async function flightPrice (inputFlightOffer) {
 
let header= {'Content-Type': 'application/json', authorization: 'Bearer '+token}

  let uriFlightOffer2 = "https://test.api.amadeus.com/v2/shopping/flight-offers/pricing"
  let bodyChunk = {"data": {    
          "type": "flight-offers-pricing",
          "flightOffers": [inputFlightOffer]}
    };

    // var body = {"data":{"type":"flight-offers-pricing","flightOffers":[{"type":"flight-offer","id":"5","source":"GDS","instantTicketingRequired":false,"nonHomogeneous":false,"oneWay":false,"lastTicketingDate":"2020-01-09","numberOfBookableSeats":7,"itineraries":[{"duration":"PT32H15M","segments":[{"departure":{"iataCode":"SYD","terminal":"1","at":"2020-02-01T19:15:00"},"arrival":{"iataCode":"SIN","terminal":"1","at":"2020-02-02T01:00:00"},"carrierCode":"TR","number":"13","aircraft":{"code":"788"},"operating":{"carrierCode":"TR"},"duration":"PT8H45M","id":"35","numberOfStops":0,"blacklistedInEU":false},{"departure":{"iataCode":"SIN","terminal":"1","at":"2020-02-02T22:05:00"},"arrival":{"iataCode":"DMK","terminal":"1","at":"2020-02-02T23:30:00"},"carrierCode":"TR","number":"868","aircraft":{"code":"788"},"operating":{"carrierCode":"TR"},"duration":"PT2H25M","id":"36","numberOfStops":0,"blacklistedInEU":false}]}],"price":{"currency":"USD","total":"574.17","base":"446.00","fees":[{"amount":"0.00","type":"SUPPLIER"},{"amount":"0.00","type":"TICKETING"}],"grandTotal":"574.17"},"pricingOptions":{"fareType":["PUBLISHED"],"includedCheckedBagsOnly":true},"validatingAirlineCodes":["HR"],"travelerPricings":[{"travelerId":"1","fareOption":"STANDARD","travelerType":"ADULT","price":{"currency":"USD","total":"574.17","base":"446.00"},"fareDetailsBySegment":[{"segmentId":"35","cabin":"BUSINESS","fareBasis":"D0TR24","class":"D","includedCheckedBags":{"weight":20,"weightUnit":"KG"}},{"segmentId":"36","cabin":"BUSINESS","fareBasis":"J0TR24","class":"J","includedCheckedBags":{"weight":20,"weightUnit":"KG"}}]}]}]}}
  console.log("reeq"+JSON.stringify(bodyChunk));
  let response = await fetch(uriFlightOffer2, {
        method: 'post',
        body:   bodyChunk,
        headers: header,
    });
  console.log(response)
  data = await response.json()
  return console.log(data)
  }

  async function CreateOrder(inputFlightCreateOrder) {
  // Default options are marked with *
  const response = await fetch("https://test.api.amadeus.com/v1/booking/flight-orders", {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',authorization: 'Bearer '+token
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(inputFlightCreateOrder) // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}





//   let flifghtCreateOrder = async function flightPrice (inputCreateOrder) {
 
// let header= {'Content-Type': 'application/json', authorization: 'Bearer '+token}

//   let uriFlightOffer3 = "https://test.api.amadeus.com/v1/booking/flight-orders"
//   let bodyChunk2 = inputCreateOrder;

//     // var body = {"data":{"type":"flight-offers-pricing","flightOffers":[{"type":"flight-offer","id":"5","source":"GDS","instantTicketingRequired":false,"nonHomogeneous":false,"oneWay":false,"lastTicketingDate":"2020-01-09","numberOfBookableSeats":7,"itineraries":[{"duration":"PT32H15M","segments":[{"departure":{"iataCode":"SYD","terminal":"1","at":"2020-02-01T19:15:00"},"arrival":{"iataCode":"SIN","terminal":"1","at":"2020-02-02T01:00:00"},"carrierCode":"TR","number":"13","aircraft":{"code":"788"},"operating":{"carrierCode":"TR"},"duration":"PT8H45M","id":"35","numberOfStops":0,"blacklistedInEU":false},{"departure":{"iataCode":"SIN","terminal":"1","at":"2020-02-02T22:05:00"},"arrival":{"iataCode":"DMK","terminal":"1","at":"2020-02-02T23:30:00"},"carrierCode":"TR","number":"868","aircraft":{"code":"788"},"operating":{"carrierCode":"TR"},"duration":"PT2H25M","id":"36","numberOfStops":0,"blacklistedInEU":false}]}],"price":{"currency":"USD","total":"574.17","base":"446.00","fees":[{"amount":"0.00","type":"SUPPLIER"},{"amount":"0.00","type":"TICKETING"}],"grandTotal":"574.17"},"pricingOptions":{"fareType":["PUBLISHED"],"includedCheckedBagsOnly":true},"validatingAirlineCodes":["HR"],"travelerPricings":[{"travelerId":"1","fareOption":"STANDARD","travelerType":"ADULT","price":{"currency":"USD","total":"574.17","base":"446.00"},"fareDetailsBySegment":[{"segmentId":"35","cabin":"BUSINESS","fareBasis":"D0TR24","class":"D","includedCheckedBags":{"weight":20,"weightUnit":"KG"}},{"segmentId":"36","cabin":"BUSINESS","fareBasis":"J0TR24","class":"J","includedCheckedBags":{"weight":20,"weightUnit":"KG"}}]}]}]}}
//   console.log("reeq"+JSON.stringify(bodyChunk2));
//   let response = await fetch(uriFlightOffer3, {
//         method: 'post',
//         body:   bodyChunk2,
//         headers: header,
//     });
//   console.log(response)
//   data = await response.json()
//   return console.log(data)
//   }



app.get('/flight', function(req, res) {
  res.send(JSON.stringify(flightfrommadrid));
});

app.get('/flightSearch', function(req, res) {
  res.send(JSON.stringify(flightfrommadrid2));
  console.log(flightfrommadrid2)
});

app.get('/flightPriceget', function(req, res) {
  res.send(JSON.stringify(data));
  console.log(data)
});
app.get('/flightcretaeorderget', function(req, res) {
  res.send(JSON.stringify(cretateOrder));
  console.log(data)
});


app.get('/token', function(req, res) {
  res.send(JSON.stringify(token));
});


app.listen(port);
// console.log(tree)
console.log('Amadeus RESTful API server started on: ' + port);