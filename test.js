const fs = require('fs');
const yaml = require('js-yaml');
const get_config = require("./src/config.js");
const moxios = require('moxios');
const accessToken = require('./test/mocks/AccessTokenMock');
const ill_request_response = fs.readFileSync(require('path').resolve(__dirname, 'test/mocks/illRequestResponse.json')).toString();
const error_response = fs.readFileSync(require('path').resolve(__dirname, 'test/mocks/errorResponse.json')).toString();

moxios.install();

moxios.stubOnce('POST', 'https://128807.share.worldcat.org/ILL/request/data', {
	status: 200,
	responseText: ill_request_response
}); 
moxios.stubOnce('GET', 'https://128807.share.worldcat.org/ILL/request/data/166917929', {
	status: 200,
	responseText: ill_request_response
});

let environment = "test";

global.config = "";

global.config = yaml.load(get_config(environment));
let app = require('./src/server.js');

app.set('accessToken', accessToken);
let port = process.env.PORT || 8000;

// Server
app.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`);
});