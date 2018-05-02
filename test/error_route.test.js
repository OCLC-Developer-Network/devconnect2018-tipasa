const request = require('supertest');
const expect = require('chai').expect;
const cheerio = require('cheerio');
let helper = require('./testHelper');

describe.only("Error routes", function(){
	before(() => {
		helper.moxios.install()
	})
	
	after(() => {
		helper.moxios.uninstall()
	})

  describe("#Tipasa Error", function(){  
		helper.moxios.stubOnce('POST', 'https://128807.share.worldcat.org/ILL/request/data', {
			status: 401,
			responseText: helper.error_response
		}); 
	  
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
            expect($('div#content h1').text()).to.have.string("System Error");
			expect($('div#error_content > p#status').text()).to.have.string("Status - 401");
            expect($('div#error_content > p#message').text()).to.have.string("Message - Authentication failure. Missing or invalid authorization token.");
	    });
  });	
 
});
