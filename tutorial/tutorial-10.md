# Test driving OCLC’s new resource sharing API
## OCLC DEVCONNECT 2018
### Tutorial Part 10 - Dynamic Views
Views can be use content to be dynamically generated. Data is passed into the view via an associative array.
The key of the array is the name of the variable in the view.

Example:
```
res.render('display-request', {request: ill_request});
```
#### Make the Request View Dynamic

1. Open display-request.html
2. Use request variable passed from route and ILLRequest object methods to fill in fields in display-request.html

```
<%- include('header.html') -%>
<div id="request">
<p id="request_id">Request ID: <%= request.getID()%></p>
<p id="status">Status: <%= request.getStatus()%></p>
<p id="needed_by">Needed By: <%= request.dateNeededBy()%></p>
<p id="user_id">User ID: <%= request.getUserID()%></p>
<div id="item">
    <p id="title">Title: <%= request.getItemTitle()%></p>
    <p id="author">Author: <%= request.getItemAuthor()%></p>
    <p id="oclcnumber">OCLC Number: <%= request.getItemOCLCNumber()%></p>
</div>
<%- include('footer.html') -%>
```

**[on to Part 11](tutorial-11.md)**

**[back to Part 9](tutorial-09.md)**