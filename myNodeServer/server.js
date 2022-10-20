//var express = require('express');
import express from 'express';
//var produitApiRoutes = require('./produit-api-routes-memory')
import produitApiRoutes from './produit-api-routes-memory.js';

import formApiRoutes from './api-form.js'

//var deviseApiRoutes = require('./devise-api-routes-memory')
//import deviseApiRoutes from './devise-api-routes-memory.js';
//var deviseApiRoutes = require('./devise-api-routes-mongoose-cb')
import deviseApiRoutes from './devise-api-routes-mongoose-cb.js';


import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

var app = express();

//support parsing of JSON post data
var jsonParser = express.json({ extended: true });
app.use(jsonParser);


// CORS enabled with express/node-js :
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  //ou avec "www.xyz.com" à la place de "*" en production
  res.header("Access-Control-Allow-Methods",
    "POST, GET, PUT, DELETE, PATCH"); //default: GET, ...
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE');
    //to give access to all the methods provided
    return res.status(200).json({});
  }
  next();
});


//les routes en /html/... seront gérées par express par
//de simples renvois des fichiers statiques
//du répertoire "./html"
app.use('/html', express.static(__dirname + "/html"));
app.get('/', function (req, res) {
  //res.redirect('/html/index.html');
  res.redirect('/html/form.html');
});

// delegate REST API routes to apiRouter(s)
app.use(produitApiRoutes.apiRouter);
app.use(deviseApiRoutes.apiRouter);
app.use(formApiRoutes.apiRouter)

app.listen(8282, function () {
  console.log("http://localhost:8282");
});