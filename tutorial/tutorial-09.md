# Test driving OCLC’s new resource sharing API
## OCLC DEVCONNECT 2018
### Tutorial Part 9 - Route using a Model 

#### Displaying the Request information
In order to display the actual ILL Request data we have to retrieve it from the API and pass it to our view.
1. Open server.js
2. Find HTTP POST request route
```
app.get('/request', (req, res) => {
```
3. Remove line
```
res.render('display-request'); 
``` 
4. Use the ILLRequest class to create an ILLRequest and display the associated information

```
    ILLRequest.add(config['institution'], app.get('accessToken').getAccessTokenString(), fields)
        .then(ill_request => {
            res.render('display-request', {request: ill_request});
        })
        .catch (error => {
            // catch the error
        })
```

**[on to Part 10](tutorial-10.md)**

**[back to Part 8](tutorial-08.md)**