const axios = require("axios");

const serviceUrl = '.share.worldcat.org/ILL/request/data';

const ILLRequestError = require('../src/ILLRequestError');

module.exports = class ILLRequest {
    constructor(doc) {
    	this.doc = doc;
    } 
    
    getID(){
    	return this.doc.requestId;
    }
    
    getStatus(){
    	return this.doc.requestStatus;
    }
    
    dateNeededBy(){
    	return this.doc.needed;
    }
    
    getItemTitle(){
    	return this.doc.item.title;
    }
    
    getItemAuthor(){
    	return this.doc.item.author
    }
    
    getItemOCLCNumber(){
    	return this.doc.item.oclcNumber;
    }
    
    getUserID(){
    	return this.doc.patron.ppid;
    }
    
    static get(institution, accessToken, id) {
    	var config = {
    			  headers: {
    				  'Authorization': 'Bearer ' + accessToken,
    				  'User-Agent': 'node.js KAC client',
    				  'Accept': 'application/json'
    			  }
    			};
    	
    	let url = 'https://' + institution + serviceUrl + "/" + id;
        return new Promise(function (resolve, reject) {
            axios.get(url, config)
          		.then(response => {
          			// parse out the ILL Request
        			resolve(new ILLRequest(response.data));	    	
          	    })
          		.catch (error => {
          			reject(new ILLRequestError(error));
          		});
        });
    }
    
    static add(institution, accessToken, fields) {
    	var config = {
    			  headers: {
    				  'Authorization': 'Bearer ' + accessToken,
    				  'User-Agent': 'node.js KAC client',
    				  'Accept': 'application/json'
    			  }
    			};
    	
    	let url = 'https://' + institution + serviceUrl;
    	
    	// create the necessary XML
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
};
