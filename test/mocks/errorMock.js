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
        "data": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<error>\n<code type=\"http\">401<\/code>\n<message>AccessToken {tk_12345} is invalid<\/message>\n<detail>Authorization header: Bearer tk_12345<\/detail>\n<\/error>",
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