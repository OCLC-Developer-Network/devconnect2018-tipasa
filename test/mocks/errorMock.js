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
        "data": { "code": { "type": "http", "value": "401" }, "details": "Authorization header: http://www.worldcat.org/wskey/v2/hmac/v1 clientId=\"test\", timestamp=\"1525205192\", nonce=\"2f33d4fb3c483f99\", signature=\"k7svWPSwMA1qTmwnePoRIlpvcCQNUf8S5/FWTjVbT38=\", principalID=\"8eaggf92-3951-431c-975a-d7rf26b8d131\", principalIDNS=\"urn:oclc:wms:da\"", "message": "WSKey 'test' is invalid"},
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