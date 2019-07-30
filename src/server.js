"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const nodeauth = require("nodeauth");

//classes for Tipasa
const ILLRequest = require("./ILLRequest.js")
const ILLRequestError = require("./ILLRequestError.js")

const options = {
	    services: ["ILL:request", "SCIM", "refresh_token"],
	    redirectUri: "http://localhost:8000/"
	};

if (typeof API_URL_OVERRIDE !== "undefined") {
	ILLRequest.serviceUrl = API_URL_OVERRIDE;
}

const wskey = new nodeauth.Wskey(config['wskey'], config['secret'], options);

const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', 'views'); 
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

function getAccessToken (req, res, next){
	if (req.query['error']){
		res.render('display-error', {error: req.query['error'], error_message: req.query['error_description'], detail: ""});
	} else if (app.get('accessToken') && app.get('accessToken').getAccessTokenString() && !app.get('accessToken').isExpired()){
		next()
	} else if (app.get('accessToken') && !app.get('accessToken').refreshToken.isExpired()) {	
		app.get('accessToken').refresh();
        next();
	} else if (req.query['code']) {	
		// request an Access Token
		wskey.getAccessTokenWithAuthCode(req.query['code'], config['institution'], config['institution'])
	        .then(function (accessToken) {
	        	app.set('accessToken', accessToken);
	            //redirect to the state parameter
	            let state = decodeURIComponent(req.query['state']);
	            res.redirect(state);
	        })
	        .catch(function (err) {
	            //catch the error
	        	let error = new ILLRequestError(err);
	        	res.render('display-error', {error: error.getCode(), error_message: error.getMessage(), detail: error.getDetails()});
	        })
	}else {	
		// redirect to login + state parameter
		res.redirect(wskey.getLoginURL(config['institution'], config['institution']) + "&state=" + encodeURIComponent(req.originalUrl));
	}
}

app.use(function (req, res, next) {
	getAccessToken(req, res, next);
});

app.get('/', (req, res) => {
	res.render('index', {user_id: app.get('accessToken').getUser().principalID});
});
 
app.post('/request', (req, res) => {
    let fields = {
        	"needed": req.body.needed,
        	"userId": req.body.userId,
        	"user_name": req.body.user_name,
        	"user_email": req.body.user_email,
        "department": req.body.department,
        "patron_type": req.body.patron_type,
        "ppid": "junk",
        "pickupRegistryId": req.body.pickupRegistryId,
        "pickupName": req.body.pickupName,
        "requester": req.body.requester,
        "deliveryOptionAddress": req.body.requester_delivery_address,
        "billingAddress": req.body.requester_billing_address,
        "suppliers": req.body.suppliers,
        	"ItemOCLCNumber": req.body.ItemOCLCNumber,
        	"ItemTitle": req.body.ItemTitle
        };
    
	ILLRequest.add(config['institution'], app.get('accessToken').getAccessTokenString(), fields)
		.then(ill_request => {
			res.render('display-request', {request: ill_request});
		})
		.catch (error => {
			res.render('display-error', {error: error.getCode(), error_message: error.getMessage(), detail: error.getDetails(), failure_code: error.getFailureCode(), debug_message: error.getDebugMessage()});
		})
});

/*app.get('/request/:id', (req, res) => {  
	let id = req.params['id'];
    
	ILLRequest.get(config['institution'], app.get('accessToken').getAccessTokenString(), id)
		.then(ill_request => {
			res.render('display-request', {request: ill_request});
		})
		.catch (error => {
			res.render('display-error', {error: error.getCode(), error_message: error.getMessage(), detail: error.getDetail()});
		})
});*/


//Server
module.exports = app;