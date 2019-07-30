const axios = require("axios");

const serviceUrl = 'worldcat.org/ill/request/data';

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
    	
    	let url = 'https://' + serviceUrl + "/" + id;
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
    	
    	let url = 'https://' + serviceUrl;
    	
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
    		
    		let deliveryOptions = [];
    		if (fields['deliveryOptionType']){
    				deliveryOptions.push({
                    "deliveryType": fields['deliveryOptionType'],
                    "deliveryDetail": fields['deliveryOptionDetail']
                });
    		}
    		
    		let requester = {
    				"institution":{
    					"institutionId": Number(fields['requester'])
    				},
    				"serviceType": "COPY",
    	            "supplierInfo": {
    	                "institutions": suppliers
    	            }    	                	            
    			}
    		if ((Array.isArray(deliveryOptions) && deliveryOptions.length > 0) || fields['deliveryOptionAddress']) {
    			requester["requesterDelivery"] = {};
    			if (Array.isArray(deliveryOptions) && deliveryOptions.length > 0){
    				requester["requesterDelivery"]["deliveryOptions"] = deliveryOptions
    			}
    			if (fields['deliveryOptionAddress']){
    				requester["requesterDelivery"]["address"] = {"address1": fields['deliveryOptionAddress']}
    			}
    		}
    		if (fields['billingAddress']) {
          requester["requesterBilling"] = {
                   "billingTypes": [],
                   "address": {"address1": fields['billingAddress']}
                }
    		}
    		
    		let patron = {};    		
    		patron['ppid'] = fields['ppid'];
    		if (fields['userId']){	    		
	    		patron["userId"] = fields['userId'];	                
    		}
    		
    		if (fields['pickupRegistryId'] && fields['pickupName']){
    			patron["pickupLocationInfo"] = {
                    "registryId": Number(fields['pickupRegistryId']),
                    "name": fields['pickupName']
                }
    		}
    		
    		if (fields['user_name']) {
			patron["name"] = fields['user_name'];
    		}
    		
    		if (fields['department']) {
    			patron["department"] = fields['department'];
    		}
    		
    		if (fields['patron_type']){
    			patron["patronType"] = fields['patron_type'];
    		}
    		
    		if (fields['user_email']){
			patron["email"] = fields['user_email'];
    		}
    		
    		let data = {
    			"illRequest": {
        			"item":{
        			    "title": fields['ItemTitle'],
        			    "verification": "OCLC",
        			    "oclcNumber": Number(fields['ItemOCLCNumber'])
        			},
    				"needed": fields['needed'],
    				"requestStatus": "SUBMITTING",
    				"requester": requester,
    				"patron": patron
    			}
    		}
    		
    		return JSON.stringify(data);
    }
};
