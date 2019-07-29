const request = require('supertest');
const expect = require('chai').expect;
const cheerio = require('cheerio');
let helper = require('./testHelper');

describe("routes", function(){
	before(() => {
		helper.moxios.install()
		helper.moxios.stubOnce('POST', 'https://128807.share.worldcat.org/ILL/request/data', {
			status: 200,
			responseText: helper.ill_request_response
		}); 
		helper.moxios.stubOnce('GET', 'https://128807.share.worldcat.org/ILL/request/data/167513532', {
			status: 200,
			responseText: helper.ill_request_response
		}); 
	})
	
	after(() => {
		helper.moxios.uninstall()
	})
	
  describe("#index", function(){
	    it('It should response the GET method', () => {
	        return request(helper.app).get("/").then(response => {
	            expect(response.statusCode).to.equal(200);
	            let $ = cheerio.load(response.text);
	            expect($('h1').text()).to.have.string("Add New Request");
	            expect($('fieldset#patron_info legend').text()).to.have.string("Patron Info");
	            expect($('label#userID').text()).to.have.string("ID");
	            expect($('label#user_name').text()).to.have.string("Name");
	            expect($('label#user_email').text()).to.have.string("Email");
	            expect($('label#department').text()).to.have.string("Department");
	            expect($('label#patron_type').text()).to.have.string("Patron Type");
	            // hidden fields
	            expect($('input[name="pickupRegistryId"]').val()).to.have.string("128807");
	            expect($('input[name="pickupName"]').val()).to.have.string("Main Library");
	            expect($('input[name="requester"]').val()).to.have.string("128807");
	            expect($('input[name="suppliers"]').val()).to.have.string("148456,116402");
	            expect($('label#oclcnumber').text()).to.have.string("OCLC Number");
	            expect($('label#title').text()).to.have.string("Title");
	            expect($('label#needed_by').text()).to.have.string("Needed By");	            
	        })
	    });
  });
  
  describe("#requestPost", function(){ 
	  it('It should response the POST method', async() => {
	    	let response = await request(helper.app).post("/request").type("form").send({
	    			userID: "jkdjfldjfdlj",	    			
	    			user_name: "Stacy Smith",
	    			user_email: "someemail.somewhere.org",
	    			department: "Library",
	    			patron_type: "ADULT",
	    			pickupRegistryId: "128807",
	    			pickupName: "Main Library",
	    			requester: "128807",
	    			suppliers: "148456,116402",
		        ItemOCLCNumber: "780941515",
		        ItemTitle: "Simon's Cat",
		        needed: "2019-08-31T00:00:00.000+0000"
	    	});
	    	let $ = cheerio.load(response.text);
            expect(response.statusCode).to.equal(200);
            expect($('p#request_id').text()).to.have.string("Request ID: 167513532");
            expect($('p#created').text()).to.have.string("Created: 2019-07-17T00:00:00.000+0000");
            expect($('p#updated').text()).to.have.string("Updated: 2019-07-17T21:21:45.943+0000");
            expect($('p#status').text()).to.have.string("Status: SUBMITTING");
            expect($('p#needed_by').text()).to.have.string("Needed By: 2019-08-31T00:00:00.000+0000");
            expect($('p#requester_id').text()).to.have.string("Requesting Institution ID: 128807");
            expect($('p#fulfillmentType').text()).to.have.string("Fulfillment Type: OCLC_ILL");
            expect($('p#serviceType').text()).to.have.string("Service Type: COPY");
            
            expect($('p#user_id').text()).to.have.string("User ID: jkdjfldjfdlj");
            expect($('p#department').text()).to.have.string("Department: Library")
            expect($('p#patronType').text()).to.have.string("Patron Type: ADULT")
            expect($('p#phone').text()).to.have.string("Phone: 111-222-3456")
            	expect($('p#email').text()).to.have.string("Email: someemail.somewhere.org")
            	expect($('p#pickup').text()).to.have.string("Pickup Location:") 
            	expect($('p#pickup span#name').text()).to.have.string("Name: Main Library") 
            	expect($('p#pickup span#registryId').text()).to.have.string("RegistryId: 128807")	
            
            expect($('div#item p#title').text()).to.have.string("Title: Simon's Cat");
            expect($('div#item p#oclcnumber').text()).to.have.string("OCLC Number: 780941515");
            
            expect($('div#suppliers ul li').eq(0).text()).to.have.string("148456");
            
            	expect($('div#requester_delivery ul li span#type').text()).to.have.string("Library Mail");
            	expect($('div#requester_delivery ul li span#detail').text()).to.have.string("Library Mail");
            	expect($('div#requester_delivery p#address').text()).to.have.string("Address: main street");
       
            	expect($('div#requester_billing p#address').text()).to.have.string("Address: main street");
            
	    });
	  });
  
  describe.skip("#requestGet", function(){ 
	  it('It should response the GET method', async() => {
	    	let response = await request(helper.app).get("/request/167513532");
	    	let $ = cheerio.load(response.text);
            expect(response.statusCode).to.equal(200)
            expect($('p#request_id').text()).to.have.string("Request ID: 167513532");
            expect($('p#status').text()).to.have.string("Status: CREATED");
            expect($('p#needed_by').text()).to.have.string("Needed By: 2018-06-30T20:00:00.000-04:00");
            expect($('div#item p#title').text()).to.have.string("Title: Simon's Cat");
            expect($('div#item p#oclcnumber').text()).to.have.string("OCLC Number: 780941515");
            expect($('p#user_id').text()).to.have.string("User ID: jkdjfldjfdlj");
	    });
	  });  
});
