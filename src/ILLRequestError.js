module.exports = class ILLRequestError {
    constructor(error) {
	    	this.error = error;
	    if (this.error.response) {
	        // The request was made and the server responded with a status code
	        // that falls out of the range of 2xx
		    	if (typeof this.error.response.status === 'number') {
		    		this.code = this.error.response.status;
		    	} else {
		    		this.code = this.error.response.statusCode;
		    	}
	    }
    		
	    if (typeof this.error.request === 'object') {
	    		this.request = this.error.request;
	    		this.requestData = this.request.data
	    }
	    	if (typeof this.error.response.data === 'string' || typeof this.error.response.data === 'object'){
        		if (typeof this.error.response.data === 'string') {
        			
        			this.doc = JSON.parse(this.error.response.data);
	        	} else {
	        		this.doc = this.error.response.data;
	        	}
        	} else if (typeof this.error.response.body === 'string' || typeof this.error.response.body === 'object') {        		
        		if (typeof this.error.response.body === 'string') {
        			this.doc = JSON.parse(this.error.response.body);
	        	} else {
	        		this.doc = this.error.response.body;
	        	}        		
        		
        	} else if (typeof this.request === 'object') {
            // The request was made but no response was received            
            this.code = null;
            this.doc = null;
         } else {
            // Something happened in setting up the request that triggered an Error
        	  	this.code = null;  
        	  	this.doc = null;
         }
    }
	getRequestError(){
		return this.error;
	}
	
	getCode(){
		return this.code;
	}
	
	getMessage(){
		return this.doc.response.error.message;
	}
	
	getDetails(){
		return this.doc.response.error.detail;
	}
	
	getFailureCode(){
		return this.doc.response.error.detail[0].failureCode;
	}
	
	getDebugMessage(){
		return this.doc.response.error.detail[0].debugMessage;
	}
	
	getRequestData(){
		return this.requestData;
	}

};