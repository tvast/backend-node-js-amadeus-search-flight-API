var express = require('express')
var glob = require("glob")
const bodyParser = require('body-parser');

const fetch = require('node-fetch');

 app = express(),
  port = process.env.PORT || 3000;
// const dree = require('dree');
 
// const options = {
//   stat: false,
//   normalize: true,
//   followLinks: true,
//   size: true,
//   hash: true,
//   depth: 5,
//   exclude: /dir_to_exclude/
// };
 
// const tree = dree.scan('../board_ftp/Ctrl_Gestion', options);

//initialize client

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

  
  // Do something with the returned data.
});


//get token


 // amadeus.referenceData.locations.get({
 //      keyword: 'PAR',
 //      subType: 'AIRPORT,CITY',
 //      page: { offset: 2 }
 //   }).then(function(response){
 //      console.log(response);
 //      return amadeus.first(response);
 //    }).then(function(firstPage){
 //      console.log(firstPage);
 //    });

//UTilities test



let originTravel="MAD";
let destinationTravel ="MUC";
// app.use(bodyParser.urlencoded({ extended: true })); 

// app.post('/example', (req, res) => {
//   res.send(`origin':${req.body.origin} ${req.body.destination}.`);
//   originTravel=req.body.origin;
//   destinationTravel=req.body.destination;
// });


 let responseData="";
 let page2="";

 amadeus.shopping.flightDates.get({
  origin : originTravel,
  destination : destinationTravel
}).then(function(response){
  // console.log(response.data);      
  responseData=response.data;

}).catch(function(responseError){
  // console.log(responseError.code);
});


let responseData2 = "";
amadeus.shopping.flightDestinations.get({
  origin : 'MAD'
}).then(function(response){
  // console.log(response.data);
  responseData2=response.data;

}).catch(function(responseError){
  // console.log(responseError.code);
});




// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

 // app.route('/')
 //    .get(function (){return JSON.stringify(tree).})

//  app.use('*/file',express.static('img2'));

//  app.use("/files",express.static('img2'));

app.get('/', function(req, res) {
  res.send(JSON.stringify(responseData));
});

app.get('/flight', function(req, res) {
  res.send(JSON.stringify(responseData2));
});

app.get('/token', function(req, res) {
  res.send(JSON.stringify(token));
});

// app.get('/test/*', function(req, res){
//     var uid = req.params.uid,
//         path = req.params[0] ? req.params[0] : '*.xlsx';
//     res.sendFile(path, {root: '../board_ftp/Ctrl_Gestion/'});
// });

// app.get('/fileExcel', function (req, res) {

//EDIT: USE WALK INSTEAD OF WALK TO GO UNDER CHILD DIRS
// glob("*", options, function (er, files) {
//   res.send(savePath);
// });
// res.send(savePath);

// });

app.listen(port);
// console.log(tree)
console.log('Amadeus RESTful API server started on: ' + port);