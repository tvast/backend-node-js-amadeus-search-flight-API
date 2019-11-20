var express = require('express')
var glob = require("glob")
const bodyParser = require('body-parser');

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


let allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  next();
}
app.use(allowCrossDomain);
var Amadeus = require('amadeus');

var amadeus = new Amadeus({
  clientId: 'qztkbf5XWjNSGkXRF9bfAwNg6bELWvVD',
  clientSecret: 'w9mJ7ZJzlEGNffut'
});


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

let originTravel="MAD";
let destinationTravel ="MUC";
app.use(bodyParser.urlencoded({ extended: true })); 

app.post('/example', (req, res) => {
  res.send(`origin':${req.body.origin} ${req.body.destination}.`);
  originTravel=req.body.origin;
  destinationTravel=req.body.destination;
});


 let responseData="";

 amadeus.shopping.flightDates.get({
  origin : originTravel,
  destination : destinationTravel
}).then(function(response){
  console.log(response.data);
  responseData=response.data;

}).catch(function(responseError){
  console.log(responseError.code);
});


amadeus.referenceData.airlines.get({
  airlineCodes : "IB"
}).then(function(response){
  // console.log(response.data);
  // responseData=response.data[0].href;
}).catch(function(responseError){
  console.log(responseError.code);
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
console.log('todo list RESTful API server started on: ' + port);