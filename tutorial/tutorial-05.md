# Test driving OCLC’s new resource sharing API
## OCLC DEVCONNECT 2018
### Tutorial Part 5 - Creating Models Using Test Driven Development

#### Test Setup
1. Open package.json
2. Add line to scripts section to run tests
```
    "test": "mocha"
```

3. Create a directory within `tests` called `mocks`
    1. Add the following files to `mocks` containing the linked code
        1. [illRequestResponse](https://raw.githubusercontent.com/OCLC-Developer-Network/devconnect2018-tipasa/master/tests/mocks/illRequestResponse.json)
        2. [errorMock](https://raw.githubusercontent.com/OCLC-Developer-Network/devconnect2018-tipasa/master/tests/mocks/errorMock.js)
        3. [errorResponse](https://raw.githubusercontent.com/OCLC-Developer-Network/devconnect2018-tipasa/master/tests/mocks/errorResponse.json)
        4. [AccessTokenMock.js](https://raw.githubusercontent.com/OCLC-Developer-Network/devconnect2018-tipasa/master/tests/mocks/AccessTokenMock.js)
        5. [AccessTokenMock.js](https://raw.githubusercontent.com/OCLC-Developer-Network/devconnect2018-tipasa/master/tests/mocks/accessTokenErrorMock.js)
        6. [access_token_response](https://raw.githubusercontent.com/OCLC-Developer-Network/devconnect2018-tipasa/master/tests/mocks/access_token.json)

#### Write your first test

1. In tests directory create a file named illRequest.test.js to test your ILLRequest Class 
2. Open illRequest.test.js and add constants for classes you want to use (WSKey and Access Token)
```
const expect = require('chai').expect;
const moxios = require('moxios');
const fs = require('fs');

const ILLRequest = require('../src/ILLRequest');
const ill_request_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/illRequestResponse.json')).toString();

``` 

3. Write for Test creating an ILL Request
    1. Create a new ILLRequest object
        a. load API response
    2. Test that it is an instance of a ILLRequest object
    
```
describe('Create ILL Request test', () => {
    let my_request;
      before(() => {
          my_request = new ILLRequest(JSON.parse(ill_request_response));
          });
      
      it('Creates an ILL Request object', () => {
          expect(my_request).to.be.an.instanceof(ILLRequest);
      });
});      
```

4. Make the test pass by creating ILLRequest class and constructor
    1. In the src directory create a file named ILLRequest.js to represent the ILLRequest Class
    2. Open ILLRequest.js, declare ILLRequest class and add use constants for classes you want to use
    ```
    const serviceUrl = '.share.worldcat.org/ILL/request/data';
    
    const ILLRequestError = require('../src/ILLRequestError');
    
    module.exports = class ILLRequest {
    // the constructor and other methods
    }
    ```
     
    3. Create a constructor for the ILLRequest class
    ```
    constructor(doc) {
        this.doc = doc;
    }
    ```   
5. Run tests
```bash
npm test
```

6. Write a test for making sure a doc property is set
    1. Make sure "Creates an ILLRequest object" passes
    2. Test that it is an instance of a JSON object
```
      it('Sets the ILL Request properties', () => {
        expect(my_request.doc).to.be.an("object");
      });
```

7. Run tests
```bash
npm test
```

#### Getters
1. Write a test to ensure "getter" functions are returning values
    1. Make sure "Sets the ILLRequest properties" passes
    2. Test each "getter" method returns appropriate value.
```
      it('Has functioning getters', () => {
        expect(my_request.getID()).to.equal(166917929);
        expect(my_request.getStatus()).to.equal('CREATED');
        expect(my_request.dateNeededBy()).to.equal('2018-06-30T20:00:00.000-04:00');
        expect(my_request.getItemTitle()).to.equal('Simon\'s Cat');
        expect(my_request.getItemAuthor()).to.equal('Tofield, Simon');
        expect(my_request.getItemOCLCNumber()).to.equal(780941515);
        expect(my_request.getUserID()).to.equal('jkdjfldjfdlj');
      });
      });
```
2. Write function to get the ID in ILLRequest class
    ```
    getID(){
        return this.doc.requestId;
    }
    ```

3. Run tests
```bash
npm test
```

4. Write function to get a Status in ILLRequest class

    ```
    getStatus(){
        return this.doc.requestStatus;
    }
    ```

5. Run tests
```bash
npm test
```

6. Write function to get the NeededBy in the ILLRequest class
```    
    dateNeededBy(){
        return this.doc.needed;
    }
```

7. Run tests
```bash
npm test
```

8. Write function to get the ItemTitle in ILLRequest class
```
    getItemTitle(){
        return this.doc.item.title;
    }
```
9. Run tests
```bash
npm test
```

10. Write function to get the ItemAuthor in the ILLRequest Class

```
    getItemAuthor(){
        return this.doc.item.author
    }
```

11. Run tests
```bash
npm test
```

12. Write function to get the ItemOCLCNumber in the ILLRequest Class

```
    getItemOCLCNumber(){
        return this.doc.item.oclcNumber;
    }
```

13. Run tests
```bash
npm test
```

14. Write function to get the UserID in the ILLRequest Class

```
    getUserID(){
        return this.doc.patron.ppid;
    }
```

15. Run tests
```bash
npm test
```

#### Add an ILLRequest from the API
1. Tell tests what file to use for mocks

```
describe('Add ILL Request tests', () => {
  beforeEach(() => {
      moxios.install();
  });
  
  afterEach(() => {
      moxios.uninstall();
  });

  it('Post ILL Request by Access Token', () => {
      moxios.stubOnce('POST', 'https://128807.share.worldcat.org/ILL/request/data', {
          status: 200,
          responseText: ill_request_response
        });  
        // Test expects go here
  });
});        
```        

2. Add ILL Request
3. Test that object returned is an instance of a ILLRequest
```
    let fields = {
        "needed": "2018-06-30T20:00:00.000-04:00",
        "userID": "jkdjfldjfdlj",
        "ItemOCLCNumber": "780941515",
        "ItemTitle": "Simon's Cat",
        "ItemAuthor": "Tofield, Simon",
        "ItemMediaType": "BOOK"
    };
    return ILLRequest.add(128807, 'tk_12345', fields)
      .then(response => {
        //expect an ILLRequest object back
        expect(response).to.be.an.instanceof(ILLRequest);
      });
  });
```

5. Make test pass by creating a static "add" function for the ILLRequest
    1. Make function take to variables
        1. institution
        2. access token 
        3. fields
    2. Create a url for the request
    3. Create an HTTP client
    4. Create a set of headers
        - Authorization
        - User-Agent
        - Content-Type
        - Accept
    5. Create a JSON document of the fields to pass as the request body
    6. try to make the HTTP request
        1. If successful
            1. Pass response to create a new ILLRequest
        2. If fails
            1. Pass response off to ILLRequestError to handle
```    
    static add(institution, accessToken, fields) {
        var config = {
                  headers: {
                      'Authorization': 'Bearer ' + accessToken,
                      'User-Agent': 'node.js KAC client',
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                  }
                };
        
        let url = 'https://' + institution + serviceUrl;
        
        // create the necessary JSON
        let data = {
                "needed": fields['needed'],
                "patron":{
                    "ppid" : fields['user_id']
                },
                "item":{
                    "title": fields['title'],
                    "author": ['author'],
                    "mediaType":{
                        "definedValue": ['mediaType']
                    },
                    "oclcNumber": ['oclcnumber']
                }
                }
        
        return new Promise(function (resolve, reject) {
            axios.post(url, data, config)
                .then(response => {
                    // parse out the ILL Request
                    resolve(new ILLRequest(response.data));         
                })
                .catch (error => {
                    reject(new ILLRequestError(error));
                });
        });
    }
```

9. Run tests
```bash
npm test
```
    
#### Write test for getting data from User
1. Test that getID method returns a value of 166917929 
2. Test that getStatus method returns a value of CREATED
3. Test that dateNeededBy method returns a value of 2018-06-30T20:00:00.000-04:00
4. Test that getItemTitle method returns a value of Simon\'s Cat
5. Test that getItemAuthor method returns a value of Tofield, Simon
6. Test that getItemOCLCNumber method returns a value of 780941515
7. Test that getUserID method returns a value of jkdjfldjfdlj

```        
    expect(response.getID()).to.equal(166917929);
    expect(response.getStatus()).to.equal('CREATED');
    expect(response.dateNeededBy()).to.equal('2018-06-30T20:00:00.000-04:00');
    expect(response.getItemTitle()).to.equal('Simon\'s Cat');
    expect(response.getItemAuthor()).to.equal('Tofield, Simon');
    expect(response.getItemOCLCNumber()).to.equal(780941515);
    expect(response.getUserID()).to.equal('jkdjfldjfdlj');
```

6. Run tests
```bash
npm test
```       

#### Write the first test for the ILLRequestError Class
1. In tests directory create a file named ill_request_error.test.js to test your ILLRequestError Class 
2. Open ill_request_error.test.js and add constants for classes you want to use (WSKey and Access Token)

```
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

const error_mock = require('./mocks/errorMock');
```
 
3. Write for Test creating a ILLRequestError
    1. Create a new ILLRequestError object
    2. Test that it is an instance of a ILLRequestError object

```
describe('Create Error test', () => {
    var error;
      before(() => {
            error = new ILLRequestError(error_mock);
          });
      
      it('Creates an Error object', () => {
          expect(error).to.be.an.instanceof(ILLRequestError);
      });
});      
```

6. Make the test pass by creating ILLRequestError class and constructor
    1. In the src directory create a file named ILLRequestError.js to represent the ILLRequestError Class
    2. Open ILLRequestError.js and declare ILLRequestError class
    ```

    module.exports = class ILLRequestError {
    }
    
    ```
    
    3. Create a constructor for the ILLRequestError class
    ```
    constructor(error) {
        this.error = error;
        if (this.error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (this.error.response.status) {
                this.code = this.error.response.status;
            } else {
                this.code = this.error.response.statusCode;
            }
            
            this.request = this.error.request;
            if (this.error.response.data){
                if (typeof this.error.response.data === 'string') {
                    this.doc = JSON.parse(this.error.response.data);
                } else {
                    this.doc = this.error.response.data;
                }
                if (this.doc.message){
                    this.message = this.doc.message;
                    this.detail = this.doc.details;
                } else {
                    this.message = this.doc.detail;
                    this.detail = null;
                }
            } else {
                if (typeof this.error.response.body === 'string') {
                    this.doc = JSON.parse(this.error.response.body);
                } else {
                    this.doc = this.error.response.body;
                }
                this.message = this.doc.message;
                if (this.doc.detail) {
                    this.detail = this.doc.detail;
                } else {
                    this.detail = this.doc.details;
                }
            }
          } else if (this.error.request) {
            // The request was made but no response was received
            this.request = this.error.request;
            
            this.code = null;
            this.message = null;
            this.detail = null;
          } else {
            // Something happened in setting up the request that triggered an Error
            this.code = null;  
            this.message = this.error.message;
            this.detail = null;
          }
    }
    ```   
    
7. Run tests
```bash
npm test
```

#### Properties set
1. Write code to ensure error properties are set
```
      it('Sets the Error properties', () => {
        expect(error.error).to.be.an.instanceof(Error);
        expect(error.code).to.equal(401)
        expect(error.message).to.equal('WSKey \'test\' is invalid');
        expect(error.detail).to.equal('Authorization header: http://www.worldcat.org/wskey/v2/hmac/v1 clientId=\"test\", timestamp=\"1525205192\", nonce=\"2f33d4fb3c483f99\", signature=\"k7svWPSwMA1qTmwnePoRIlpvcCQNUf8S5/FWTjVbT38=\", principalID=\"8eaggf92-3951-431c-975a-d7rf26b8d131\", principalIDNS=\"urn:oclc:wms:da\"')
      });
```

2. Run tests
```bash
npm test
```   

#### Getters
1. Write a test to ensure "getter" functions are returning values
```
      it('Has functioning getters', () => {
        expect(error.getRequestError()).to.be.an.instanceof(Error);
        expect(error.getCode()).to.equal(401)
        expect(error.getMessage()).to.equal('WSKey \'test\' is invalid');
        expect(error.getDetail()).to.equal('Authorization header: http://www.worldcat.org/wskey/v2/hmac/v1 clientId=\"test\", timestamp=\"1525205192\", nonce=\"2f33d4fb3c483f99\", signature=\"k7svWPSwMA1qTmwnePoRIlpvcCQNUf8S5/FWTjVbT38=\", principalID=\"8eaggf92-3951-431c-975a-d7rf26b8d131\", principalIDNS=\"urn:oclc:wms:da\"')
      });
```

2. Write code for getting a request error
```
    getRequestError()
    {
        return this.requestError;
    }
```

3. Run tests
```bash
npm test
``` 

4. Create function to retrieve error code
    ```
    getCode(){
        return this.code;
    }
    ```
5. Run tests
```bash
npm test
```       

6. Create function to retrieve error message
    ```
    getMessage(){
        return this.message
    }
    ```
7. Run tests
```bash
npm test
```

8. Create function to retrieve error detail
    ```
    getDetail(){
        return this.detail;
    }
    ```
9. Run tests
```bash
npm test
```

### Test that Access Token error can be properly parsed
1. Add mock for Access token error
```
const accesstoken_error_mock = require('./mocks/accessTokenErrorMock')
```

2. Pass the ILLRequstError class the Access Token error mock
3. Check the object is instantiated
4. Test the properties are set
5. Test the getters work

```
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
```
            
2. Run tests
```bash
npm test
```

#### Test that an API error can be properly parsed
1. Create tests for parsing API errors
    1. Tell tests what file to use for mocks
    2. Call ILLRequest.add in a failed fashion
    3. Test error is an instance of ILLRequestError
    4. Test the getCode() method returns 401
    5. Test the getMessage() method returns Authentication failure. Missing or invalid authorization token.

```
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
```

2. Run tests
```bash
npm test
```  

#### Test that an Access Token API request error can be properly parsed
1. Create tests for parsing Access Token request errors
    1. Tell tests what file to use for mocks
    2. Call wskey.getAccessTokenWithAuthCode in a failed fashion
    3. Test error is an instance of ILLRequestError
    4. Test the getCode() method returns 401
    5. Test the getMessage() method returns WSKey 'test' is invalid
    6. Test the getDetail() method returns Authorization header: http://www.worldcat.org/wskey/v2/hmac/v1 clientId="test", timestamp="1524513365", nonce="a2b79385", signature="yS+aKqSbJ2PjL9S5AuA5zqo+t2QfWLl8W9wWbACnFMk=", principalID="id", principalIDNS="namespace"
    
```
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

```

**[on to Part 6](tutorial-06.md)**

**[back to Part 4](tutorial-04.md)**