const axios = require("axios");

const serviceUrl = '.share.worldcat.org/ILL/request/data';

const ILLRequestError = require('../src/ILLRequestError');

module.exports = class ILLRequest {
    constructor(doc) {
    		this.doc = doc.response.illRequest;
    } 
    
    getID(){
    		return this.doc.requestId;
    }
 
    getCreated(){
		return this.doc.created;
    }
    
    getUpdated(){
		return this.doc.edited;
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
    
    getItemOCLCNumber(){
    		return this.doc.item.oclcNumber;
    }
    
    getPatron(){
    		return this.doc.patron;
    }
    
    getRequesterId(){
    		return this.doc.requester.institution.institutionId;
    }
    
    getFulfillmentType(){
    		return this.doc.requester.fulfillmentType;
    }
    
    getServiceType(){
		return this.doc.requester.serviceType;
    }
        
    getRequesterDelivery(){
    		return this.doc.requester.requesterDelivery;
    }
    
    getRequesterBilling(){
    		return this.doc.requester.requesterBilling;
    }
    
    getSupplierIds(){
    		let supplierIds = [];
    		this.doc.requester.supplierInfo.institutions.forEach(function(institution){
    			supplierIds.push(institution.institutionId);
    		})
		return supplierIds;
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
    				  'Content-Type': 'application/json',
    				  'Accept': 'application/json'
    			  }
    			};
    	
    	let url = 'https://' + institution + serviceUrl;
    	
    	// create the necessary XML
    	let data = this.buildJSON(fields);
    	
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
    static buildJSON(fields) {
    		let supplier_list = fields['suppliers'].split(",");
    		let suppliers = supplier_list.map(function(supplier){ 
    			return {"institutionId": Number(supplier)};
    		});

    		let data = {
    			"needed": fields['needed'],
    			"item":{
    			    "title": fields['ItemTitle'],
    			    "verification": "OCLC",
    			    "oclcNumber": fields['ItemOCLCNumber']
    			},
    			"requester":{
    				"institution":{
    					"institutionId": fields['requester']
    				},
    	            "supplierInfo": {
    	                "institutions": suppliers
    	            },
    	            "requesterDelivery": {
                     "deliveryOptions": [{
                            "deliveryType": fields['deliveryOptionType'],
                            "deliveryDetail": fields['deliveryOptionType']
                        }],
                     "address": {"address1": fields['deliveryOptionAddress']}
                    },
                 "requesterBilling": {
                    "billingTypes": [],
                    "address": {"address1": fields['billingAddress']}
                 }    	            
    			},
    			"patron": {
    				"userId": fields['userId'],
    				"name": fields['user_name'],
                "department": fields['department'],
                "patronType": fields['patron_type'],
    				"email": fields['user_email'],
                "pickupLocationInfo": {
                    "registryId": fields['pickupRegistryId'],
                    "name": fields['pickupName']
                }
    			}
    			}
    	return data;
    }
};
