module.exports = Object.assign(new Error, {
    "config": {
        "transformRequest": {},
        "transformResponse": {},
        "timeout": 0,
        "xsrfCookieName": "XSRF-TOKEN",
        "xsrfHeaderName": "X-XSRF-TOKEN",
        "maxContentLength": -1,
        "headers": {"Accept": "application/atom+xml"},
        "method": "post",
        "url": "https://128807.share.worldcat.org/ILL/request/data"
    },
    "response": {
        "config": {
            "transformRequest": {},
            "transformResponse": {},
            "timeout": 0,
            "xsrfCookieName": "XSRF-TOKEN",
            "xsrfHeaderName": "X-XSRF-TOKEN",
            "maxContentLength": -1,
            "headers": {"Accept": "application/atom+xml"},
            "method": "get",
            "url": "https://128807.share.worldcat.org/ILL/request/data"
        },
        "data": {
            "code": {
                "type": "http",
                "value": "401"
            },
            "message": "No valid authentication credentials found in request"
        },
        "status": 401,
        "request": {
            "config": {
                "transformRequest": {},
                "transformResponse": {},
                "timeout": 0,
                "xsrfCookieName": "XSRF-TOKEN",
                "xsrfHeaderName": "X-XSRF-TOKEN",
                "maxContentLength": -1,
                "headers": {"Accept": "application/atom+xml"},
                "method": "post",
                "url": "https://128807.share.worldcat.org/ILL/request/data"
            },
            "headers": {"Accept": "application/atom+xml"},
            "url": "https://128807.share.worldcat.org/ILL/request/data",
            "timeout": 0,
            "withCredentials": false
        }
    }
});