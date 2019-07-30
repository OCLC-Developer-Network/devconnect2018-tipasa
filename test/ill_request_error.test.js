const expect = require('chai').expect;
const nock = require('nock');
const moxios = require('moxios');
const fs = require('fs');
const yaml = require('js-yaml');
const get_config = require("../src/config.js");

global.config = yaml.load(get_config("test"));

const ILLRequestError = require('../src/ILLRequestError');
const error_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/errorResponse.json')).toString();
const ILLRequest = require('../src/ILLRequest');

const error_mock = require('./mocks/errorMock')
const accesstoken_error_mock = require('./mocks/accessTokenErrorMock')

describe('Create Error test', () => {
	var error;
	  before(() => {
		  	error = new ILLRequestError(error_mock);
		  });
	  
	  it('Creates an Error object', () => {
		  expect(error).to.be.an.instanceof(ILLRequestError);
	  });
	  
	  it('Sets the Error properties', () => {
        expect(error.error).to.be.an.instanceof(Error);
        expect(error.code).to.equal(401)        
	  });
	  
	  it('Has functioning getters', () => {
        expect(error.getRequestError()).to.be.an.instanceof(Error);
        expect(error.getCode()).to.equal(401)
        expect(error.getMessage()).to.equal('No valid authentication credentials found in request');
	  });
	  
	});

describe('Create Error from Access Token Error test', () => {
	var error;
	  before(() => {
		  	error = new ILLRequestError(accesstoken_error_mock);
		  });
	  
	  it('Creates an Error object', () => {
		  expect(error).to.be.an.instanceof(ILLRequestError);
	  });
	  
	  it('Sets the Error properties', () => {
        expect(error.error).to.be.an.instanceof(Error);
        expect(error.code).to.equal(401)
	  });
	  
	  it('Has functioning getters', () => {
        expect(error.getRequestError()).to.be.an.instanceof(Error);
        expect(error.getCode()).to.equal(401)
        expect(error.getMessage()).to.equal("WSKey 'test' is invalid")
        expect(error.getDetails()).to.equal('Authorization header: http://www.worldcat.org/wskey/v2/hmac/v1 clientId="test", timestamp="1524513365", nonce="a2b79385", signature="yS+aKqSbJ2PjL9S5AuA5zqo+t2QfWLl8W9wWbACnFMk=", principalID="id", principalIDNS="namespace"')
	  });
	  
	});


describe.skip('API Error tests', () => {
  beforeEach(() => {
	  moxios.install();
  });
  
  afterEach(() => {
	  moxios.uninstall();
  });

  it('Returns a 401 Error from an HTTP request', () => {
      moxios.stubOnce('POST', 'https://worldcat.org/ill/request/data', {
          status: 401,
          responseText: error_response
      });  
	
	// set the fields
      let fields = {
      		"needed": "2019-08-31T00:00:00.000+0000",
      		"userID": "jkdjfldjfdlj",
      		"user_name":	 "Stacy Smith",
      		"user_email": "someemail.somewhere.org",
  		"department": "Library",
  		"patron_type": "ADULT",
  		"pickupRegistryId": "128807",
  		"pickupName": "Main Library",
      		"requester": "128807",
      		"suppliers" : "148456, 116402",
      		"ItemOCLCNumber": "780941515",
      		"ItemTitle": "Simon's Cat"
      };
	  
    return ILLRequest.add(128807, 'tk_12345', fields)
      .catch(error => {
        //expect an Error object back
        expect(error).to.be.an.instanceof(ILLRequestError);
        expect(error.getRequestError()).to.be.an.instanceof(Error);
        expect(error.getCode()).to.equal(401);
        expect(error.getMessage()).to.equal('Authentication failure. Missing or invalid authorization token.')
        
      });
  }); 
  
  it('Returns a 401 Error from an Access Token request', () => {
	  nock('https://authn.sd00.worldcat.org/oauth2')
      .post('/accessToken?grant_type=authorization_code&code=auth_12345&authenticatingInstitutionId=128807&contextInstitutionId=128807&redirect_uri=http://localhost:8000/')
      .replyWithFile(401, __dirname + '/mocks/access_token_error.json', { 'Content-Type': 'application/json' });	  

	const nodeauth = require("nodeauth");
	const options = {
		    services: ["ILL:request", "SCIM", 'refresh_token'],
		    redirectUri: "http://localhost:8000/"
		};	
	const wskey = new nodeauth.Wskey(config['wskey'], config['secret'], options);	  
	  
	return wskey.getAccessTokenWithAuthCode("auth_12345", config['institution'], config['institution'])
      .catch(error => {
        //expect an Error object back
    	let atError = new ILLRequestError(error);
        expect(atError).to.be.an.instanceof(ILLRequestError);
        expect(atError.getRequestError()).to.be.an.instanceof(Error);
        expect(atError.getCode()).to.equal(401);
        expect(atError.getMessage()).to.equal("WSKey 'test' is invalid")
        expect(atError.getDetail()).to.equal('Authorization header: http://www.worldcat.org/wskey/v2/hmac/v1 clientId="test", timestamp="1524513365", nonce="a2b79385", signature="yS+aKqSbJ2PjL9S5AuA5zqo+t2QfWLl8W9wWbACnFMk=", principalID="id", principalIDNS="namespace"')
        
      });
  });   
    
});
