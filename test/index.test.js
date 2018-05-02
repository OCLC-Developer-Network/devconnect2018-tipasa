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
		helper.moxios.stubOnce('GET', 'https://128807.share.worldcat.org/ILL/request/data/166917929', {
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
	            expect($('label#oclcnumber').text()).to.have.string("OCLC Number");
	            expect($('label#title').text()).to.have.string("Title");
	            expect($('label#author').text()).to.have.string("Author");
	            expect($('label#needed_by').text()).to.have.string("Needed By");
	            expect($('label#media_type').text()).to.have.string("Media Type");
	            // check hidden field
	            // check select option values
	            
	        })
	    });
  });
  
  describe("#requestPost", function(){ 
	  it('It should response the POST method', async() => {
	    	let response = await request(helper.app).post("/request").type("form").send({
		        needed: "2018-06-30T20:00:00.000-04:00",
		        userID: "jkdjfldjfdlj",
		        ItemOCLCNumber: "780941515",
		        ItemTitle: "Simon's Cat",
		        ItemAuthor: "Tofield, Simon",
		        ItemMediaType: "BOOK"
	    	});
	    	let $ = cheerio.load(response.text);
            expect(response.statusCode).to.equal(200);
            expect($('p#request_id').text()).to.have.string("Request ID: 166917929");
            expect($('p#status').text()).to.have.string("Status: CREATED");
            expect($('p#needed_by').text()).to.have.string("Needed By: 2018-06-30T20:00:00.000-04:00");
            expect($('div#item p#title').text()).to.have.string("Title: Simon's Cat");
            expect($('div#item p#author').text()).to.have.string("Author: Tofield, Simon");
            expect($('div#item p#oclcnumber').text()).to.have.string("OCLC Number: 780941515");
            expect($('p#user_id').text()).to.have.string("User ID: jkdjfldjfdlj");
	    });
	  });
  
  describe("#requestGet", function(){ 
	  it('It should response the GET method', async() => {
	    	let response = await request(helper.app).get("/request/166917929");
	    	let $ = cheerio.load(response.text);
            expect(response.statusCode).to.equal(200)
            expect($('p#request_id').text()).to.have.string("Request ID: 166917929");
            expect($('p#status').text()).to.have.string("Status: CREATED");
            expect($('p#needed_by').text()).to.have.string("Needed By: 2018-06-30T20:00:00.000-04:00");
            expect($('div#item p#title').text()).to.have.string("Title: Simon's Cat");
            expect($('div#item p#author').text()).to.have.string("Author: Tofield, Simon");
            expect($('div#item p#oclcnumber').text()).to.have.string("OCLC Number: 780941515");
            expect($('p#user_id').text()).to.have.string("User ID: jkdjfldjfdlj");
	    });
	  });  
});
