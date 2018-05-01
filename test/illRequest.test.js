const expect = require('chai').expect;
const moxios = require('moxios');
const fs = require('fs');

const ILLRequest = require('../src/ILLRequest');
const ill_request_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/illRequestResponse.json')).toString();

describe('Create ILL Request test', () => {
	let my_request;
	  before(() => {
		  my_request = new ILLRequest(JSON.parse(ill_request_response));
		  });
	  
	  it('Creates an ILL Request object', () => {
		  expect(my_request).to.be.an.instanceof(ILLRequest);
	  });
	  
	  it('Sets the ILL Request properties', () => {
        expect(my_request.doc).to.be.an("object");
	  });
	  
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

        expect(response.getID()).to.equal(166917929);
        expect(response.getStatus()).to.equal('CREATED');
        expect(response.dateNeededBy()).to.equal('2018-06-30T20:00:00.000-04:00');
        expect(response.getItemTitle()).to.equal('Simon\'s Cat');
        expect(response.getItemAuthor()).to.equal('Tofield, Simon');
        expect(response.getItemOCLCNumber()).to.equal(780941515);
        expect(response.getUserID()).to.equal('jkdjfldjfdlj');

      });
  });
});
