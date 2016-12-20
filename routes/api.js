/*******************************************************************************
* Copyright (c) 2014 IBM Corporation and other Contributors.
*
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the Eclipse Public License v1.0
* which accompanies this distribution, and is available at
* http://www.eclipse.org/legal/epl-v10.html
*
* Contributors:
* IBM - Initial Contribution
*******************************************************************************/

var express = require('express');
var router = express.Router();

var util = require('../utils/util');

var pathSeperator ='/';
var base_path='/api/v0002';
var historian_path =  base_path + pathSeperator + 'historian';
var types_path = "types";
var devices_path = "devices";

//Org APIs
// api to get info of a org
router.get('/organization', function(req, res) {

  var orgId = req.session.api_key.split('-')[1];
  console.log("Info for orgId "+orgId);

  var uri= base_path;

  util.orgId = orgId;
  util.iot_httpCall(uri, req.session.api_key, req.session.auth_token, res, null, true);

});

// api to get devices of a org
router.get('/organization/getdevices', function(req, res) {

  var orgId = req.session.api_key.split('-')[1];
  console.log("Fetching the devices for orgId "+orgId);

  util.orgId = orgId;
  console.log("Calling get");
  util.getDevices(req.session.api_key, req.session.auth_token, res);

});

//Historian APIs

//get historical data of a org
router.get('/historian/:orgId', function(req, res) {// TODO: modify command for cloudant DB

  var orgId = req.params.orgId;

  console.log("Fetching the historian data for orgId "+orgId);

  var uri= historian_path;

  util.orgId = orgId;
  util.iot_httpCall(uri, req.session.api_key, req.session.auth_token, res, req.query);

});

//get historical data of a deviceType of a org
router.get('/historian/:orgId/types/:deviceType', function(req, res) { // TODO: modify command for cloudant DB

  var orgId = req.params.orgId;
  var deviceType = req.params.deviceType;

  console.log("Fetching the historian data for orgId "+orgId+" for deviceType : "+deviceType);

  var uri= historian_path + pathSeperator + types_path + pathSeperator + deviceType;//  /api/v0002/historian/types/<deviceType>

  util.orgId = orgId;
  util.iot_httpCall(uri, req.session.api_key, req.session.auth_token, res, req.query);

});

//get historical data of a device of particular deviceType
router.get('/historian/:orgId/types/:deviceType/devices/:deviceId', function(req, res) {// TODO: modify command for cloudant DB

  var orgId = req.params.orgId;
  var deviceType = req.params.deviceType;
  var deviceId= req.params.deviceId;

  console.log("Fetching the historian data  for orgId "+orgId+" for device : "+deviceId);

  var uri= historian_path + pathSeperator + types_path + pathSeperator + deviceType +pathSeperator + devices_path + pathSeperator + deviceId ;
  //  /api/v0002/historian/types/<deviceType>/devices/<deviceId>

  util.orgId = orgId;
  //util.iot_httpCall(uri, req.session.api_key, req.session.auth_token, res, req.query);

  require('dotenv').load();
  // Load the Cloudant library.
  var Cloudant = require('cloudant');

  var username = process.env.cloudant_username || "nodejs";
  var password = process.env.cloudant_password;

  // Initialize the library with my account.
  var cloudant = Cloudant({account:username, password:password});
  var testdata = cloudant.db.use('test-data');
  var total_rows = 0;

  console.log("query top num: %s", req.query.top);

  testdata.view('design_doc', 'by-date',{limit:1, descending:false} , function(err, body) {
    if (!err) {
      total_rows = body.total_rows;
      console.log("no error");
      console.log("total_rows = %d", total_rows)
      body.rows.forEach(function(doc) {
        //console.log(doc.value);
      });
      //console.log("body.rows:");
      console.log(body);

      var rowsToRequest = req.query.top;
      var skipnum = 0;
      skipnum = total_rows-rowsToRequest;
      console.log("Number to skip:%d", skipnum);

      testdata.view('design_doc', 'by-date',{skip:skipnum, descending:false} , function(err, body) {
        if (!err) {
          console.log("no error");
          body.rows.forEach(function(doc) {
            //console.log(doc.value);
          });
          //console.log("body.rows:");
          //console.log(body.rows);
          res.status(200).json(body.rows);
          res.end();
        }
        if (err){
          console.log("error");
        }
      });
    }
    if (err){
      console.log("error");
    }
  });
});


module.exports = router;
