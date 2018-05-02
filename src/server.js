"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const nodeauth = require("nodeauth");

//classes for Tipasa
const ILLRequest = require("./ILLRequest.js")
const ILLRequestError = require("./ILLRequestError.js")

const options = {
	    services: ["tipasa", "refresh_token"],
	    redirectUri: "http://localhost:8000/request"
	};

const wskey = new nodeauth.Wskey(config['wskey'], config['secret'], options);

const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', 'views'); 
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

function getAccessToken (req, res, next){
	if (req.query['error']){
		res.render('display-error', {error: req.query['error'], error_message: req.query['error_description'], error_detail: ""});
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
	        	res.render('display-error', {error: error.getCode(), error_message: error.getMessage(), error_detail: error.getDetail()});
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
        	"userID": req.body.userID,
        	"ItemOCLCNumber": req.body.ItemOCLCNumber,
        	"ItemTitle": req.body.ItemTitle,
        	"ItemAuthor": req.body.ItemAuthor,
        	"ItemMediaType": req.body.ItemMediaType,
        };
    
	ILLRequest.add(config['institution'], app.get('accessToken').getAccessTokenString(), fields)
		.then(ill_request => {
			res.render('display-request', {request: ill_request});
		})
		.catch (error => {
			res.render('display-error', {error: error.getCode(), error_message: error.getMessage(), error_detail: error.getDetail()});
		})
});

app.get('/request/:id', (req, res) => {  
	let id = req.params['id'];
    
	ILLRequest.get(config['institution'], app.get('accessToken').getAccessTokenString(), id)
		.then(ill_request => {
			res.render('display-request', {request: ill_request});
		})
		.catch (error => {
			res.render('display-error', {error: error.getCode(), error_message: error.getMessage(), error_detail: error.getDetail()});
		})
});


//Server
module.exports = app;