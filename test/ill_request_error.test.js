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
        expect(error.message).to.equal('WSKey \'test\' is invalid');
        expect(error.detail).to.equal('Authorization header: http://www.worldcat.org/wskey/v2/hmac/v1 clientId=\"test\", timestamp=\"1525205192\", nonce=\"2f33d4fb3c483f99\", signature=\"k7svWPSwMA1qTmwnePoRIlpvcCQNUf8S5/FWTjVbT38=\", principalID=\"8eaggf92-3951-431c-975a-d7rf26b8d131\", principalIDNS=\"urn:oclc:wms:da\"')
	  });
	  
	  it('Has functioning getters', () => {
        expect(error.getRequestError()).to.be.an.instanceof(Error);
        expect(error.getCode()).to.equal(401)
        expect(error.getMessage()).to.equal('WSKey \'test\' is invalid');
        expect(error.getDetail()).to.equal('Authorization header: http://www.worldcat.org/wskey/v2/hmac/v1 clientId=\"test\", timestamp=\"1525205192\", nonce=\"2f33d4fb3c483f99\", signature=\"k7svWPSwMA1qTmwnePoRIlpvcCQNUf8S5/FWTjVbT38=\", principalID=\"8eaggf92-3951-431c-975a-d7rf26b8d131\", principalIDNS=\"urn:oclc:wms:da\"')
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
        expect(error.message).to.equal('WSKey \'test\' is invalid')
        expect(error.detail).to.equal('Authorization header: http://www.worldcat.org/wskey/v2/hmac/v1 clientId="test", timestamp="1524513365", nonce="a2b79385", signature="yS+aKqSbJ2PjL9S5AuA5zqo+t2QfWLl8W9wWbACnFMk=", principalID="id", principalIDNS="namespace"')
	  });
	  
	  it('Has functioning getters', () => {
        expect(error.getRequestError()).to.be.an.instanceof(Error);
        expect(error.getCode()).to.equal(401)
        expect(error.getMessage()).to.equal("WSKey 'test' is invalid")
        expect(error.getDetail()).to.equal('Authorization header: http://www.worldcat.org/wskey/v2/hmac/v1 clientId="test", timestamp="1524513365", nonce="a2b79385", signature="yS+aKqSbJ2PjL9S5AuA5zqo+t2QfWLl8W9wWbACnFMk=", principalID="id", principalIDNS="namespace"')
	  });
	  
	});


describe('API Error tests', () => {
  beforeEach(() => {
	  moxios.install();
  });
  
  afterEach(() => {
	  moxios.uninstall();
  });

  it('Returns a 401 Error from an HTTP request', () => {
      moxios.stubOnce('POST', 'https://128807.share.worldcat.org/ILL/request/data', {
          status: 401,
          responseText: error_response
      });  
	
	// set the fields
    let fields = {
        	"needed": "2018-06-30T20:00:00.000-04:00",
        	"userID": "jkdjfldjfdlj",
        	"ItemOCLCNumber": "780941515",
        	"ItemTitle": "Simon's Cat",
        	"ItemAuthor": "Tofield, Simon",
        	"ItemMediaType": "BOOK"
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
      .post('/accessToken?grant_type=code&code=auth_12345&authenticatingInstitutionId=128807&contextInstitutionId=128807&redirect_uri=http://localhost:8000/request')
      .replyWithFile(401, __dirname + '/mocks/access_token_error.json', { 'Content-Type': 'application/json' });	  

	const nodeauth = require("nodeauth");
	const options = {
		    services: ["tipasa"],
		    redirectUri: "http://localhost:8000/request"
		};	
	const user = new nodeauth.User(config['institution'], config['principalID'], config['principalIDNS']);
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
