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
        expect(my_request.getID()).to.equal(167513532);
        expect(my_request.getCreated()).to.equal('2019-07-17T00:00:00.000+0000');
        expect(my_request.getUpdated()).to.equal('2019-07-17T21:21:45.943+0000');
        expect(my_request.getStatus()).to.equal('SUBMITTING');
        expect(my_request.dateNeededBy()).to.equal('2019-08-31T00:00:00.000+0000');
        expect(my_request.getItemTitle()).to.equal('Simon\'s Cat');
        expect(my_request.getItemOCLCNumber()).to.equal(780941515);
        expect(my_request.getPatron().userId).to.equal('jkdjfldjfdlj');
        expect(my_request.getPatron().name).to.equal('Stacy Smith');
        expect(my_request.getPatron().department).to.equal('Library');
        expect(my_request.getPatron().patronType).to.equal('ADULT');
        expect(my_request.getPatron().phone).to.equal('111-222-3456');
        expect(my_request.getPatron().email).to.equal('someemail.somewhere.org');
        expect(my_request.getPatron().pickupLocationInfo.registryId).to.equal(128807);
        expect(my_request.getPatron().pickupLocationInfo.name).to.equal('Main Library');
        expect(my_request.getRequesterId()).to.equal(128807);    
        expect(my_request.getFulfillmentType()).to.equal('OCLC_ILL');    
        expect(my_request.getServiceType()).to.equal('COPY');        
        expect(my_request.getRequesterDelivery().deliveryOptions[0].deliveryType).to.equal('Library Mail');   
        expect(my_request.getRequesterDelivery().deliveryOptions[0].deliveryDetail).to.equal('Library Mail');
        expect(my_request.getRequesterDelivery().address.address1).to.equal('main street');
        expect(my_request.getRequesterBilling().billingTypes).to.be.an("array");
        expect(my_request.getRequesterBilling().address.address1).to.equal('main street');    
        expect(my_request.getSupplierIds()).to.be.an("array");
        expect(my_request.getSupplierIds()[0]).to.equal(148456);	  
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
    	"needed": "2019-08-31T00:00:00.000+0000",
    	"userID": "jkdjfldjfdlj",
    	"ItemOCLCNumber": "780941515",
    	"ItemTitle": "Simon's Cat",
    	"requester": "128807",
    	"suppliers" : [
            {"institutionId": 148456},
            {"institutionId": 116402}
        ]
    };
    
    return ILLRequest.add(128807, 'tk_12345', fields)
      .then(response => {
        //expect an ILLRequest object back
    	  	expect(response).to.be.an.instanceof(ILLRequest);
        expect(response.getID()).to.equal(167513532);
        expect(response.getCreated()).to.equal('2019-07-17T00:00:00.000+0000');
        expect(response.getUpdated()).to.equal('2019-07-17T21:21:45.943+0000');
        expect(response.getStatus()).to.equal('SUBMITTING');
        expect(response.dateNeededBy()).to.equal('2019-08-31T00:00:00.000+0000');
        expect(response.getItemTitle()).to.equal('Simon\'s Cat');
        expect(response.getItemOCLCNumber()).to.equal(780941515);
        expect(response.getPatron().userId).to.equal('jkdjfldjfdlj');
        expect(response.getPatron().name).to.equal('Stacy Smith');
        expect(response.getPatron().department).to.equal('Library');
        expect(response.getPatron().patronType).to.equal('ADULT');
        expect(response.getPatron().phone).to.equal('111-222-3456');
        expect(response.getPatron().email).to.equal('someemail.somewhere.org');
        expect(response.getPatron().pickupLocationInfo.registryId).to.equal(128807);
        expect(response.getPatron().pickupLocationInfo.name).to.equal('Main Library');
        expect(response.getRequesterId()).to.equal(128807);    
        expect(response.getFulfillmentType()).to.equal('OCLC_ILL');    
        expect(response.getServiceType()).to.equal('COPY');        
        expect(response.getRequesterDelivery().deliveryOptions[0].deliveryType).to.equal('Library Mail');   
        expect(response.getRequesterDelivery().deliveryOptions[0].deliveryDetail).to.equal('Library Mail');
        expect(response.getRequesterDelivery().address.address1).to.equal('main street');
        expect(response.getRequesterBilling().billingTypes).to.be.an("array");
        expect(response.getRequesterBilling().address.address1).to.equal('main street');    
        expect(response.getSupplierIds()).to.be.an("array");
        expect(my_request.getSupplierIds()[0]).to.equal(148456);

      });
  });
});

describe('Get ILL Request tests', () => {
  beforeEach(() => {
	  moxios.install();
  });
  
  afterEach(() => {
	  moxios.uninstall();
  });  
  
  it('Get ILL Request by Access Token', () => {
      moxios.stubOnce('GET', 'https://128807.share.worldcat.org/ILL/request/data/166917929', {
          status: 200,
          responseText: ill_request_response
        });  
    
    return ILLRequest.get(128807, 'tk_12345', 167513532)
      .then(response => {
        //expect an ILLRequest object back
    	  	expect(response).to.be.an.instanceof(ILLRequest);
        expect(response.getID()).to.equal(167513532);
        expect(response.getCreated()).to.equal('2019-07-17T00:00:00.000+0000');
        expect(response.getUpdated()).to.equal('2019-07-17T21:21:45.943+0000');
        expect(response.getStatus()).to.equal('SUBMITTING');
        expect(response.dateNeededBy()).to.equal('2019-08-31T00:00:00.000+0000');
        expect(response.getItemTitle()).to.equal('Simon\'s Cat');
        expect(response.getItemOCLCNumber()).to.equal(780941515);
        expect(response.getPatron().userId).to.equal('jkdjfldjfdlj');
        expect(response.getPatron().name).to.equal('Stacy Smith');
        expect(response.getPatron().department).to.equal('Library');
        expect(response.getPatron().patronType).to.equal('ADULT');
        expect(response.getPatron().phone).to.equal('111-222-3456');
        expect(response.getPatron().email).to.equal('someemail.somewhere.org');
        expect(response.getPatron().pickupLocationInfo.registryId).to.equal('128807');
        expect(response.getPatron().pickupLocationInfo.registryId).to.equal('Main Library');
        expect(response.getRequesterId()).to.equal(128807);    
        expect(response.getFulfillmentType()).to.equal('OCLC_ILL');    
        expect(response.getServiceType()).to.equal('COPY');        
        expect(response.getRequesterDelivery().deliveryOptions[0].deliveryType).to.equal('Library Mail');   
        expect(response.getRequesterDelivery().deliveryOptions[0].deliveryDetail).to.equal('Library Mail');
        expect(response.getRequesterDelivery().address.address1).to.equal('main street');
        expect(response.getRequesterBilling().billingTypes).to.be.an("array");
        expect(response.getRequesterBilling().address.address1).to.equal('main street');    
        expect(response.getSupplierIds()).to.be.an("array");
        expect(response.getSupplierIds()[0]).to.equal("148456");
      });
  });
});
