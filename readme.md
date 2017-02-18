Type the command in the terminal
node server.js
If you encounter any missing node modules, you need to install them locally. For example
npm install express
npm install body-parser
npm install mongdb

Server will be running on port 8080

Please define and implement a simple JSON REST API for a Web store. Your Web store consists of many restaurants.

-          Every restaurant should have some attributes like name, city, street address, email address, phone number, opening time, closing time.
-          Each restaurant has multiple PizzasEvery
-          Pizza should have some attributes like name, size (e.g. "S","M" or "L"), key ingredients (e.g. "Ham, Tomato, Cheese"), and price.

Your REST API should provide following operations:
  * list all restaurants
    API structure: GET request for http://localhost:8080/api/restaurants
    Example:
    curl -X GET http://localhost:8080/api/restaurants --header "Content-Type:application/json"

  * add a new restaurant
    API structure: POST request for http://localhost:8080/api/restaurants
    doc.txt contains the restaurant's json document
    Example:  
    curl -X POST -d @doc.txt http://localhost:8080/api/restaurants --header "Content-Type:application/json"

  * get specific restaurant
    API structure: GET request for http://localhost:8080/api/restaurants/:id
    Passed argument :id must be a single String of 12 bytes or a string of 24 hex characters
    Example:  
    curl -X GET http://localhost:8080/api/restaurants/58a55583150ce779e10bcddf --header "Content-Type:application/json"

  * update restaurant details
    API structure: PUT request for http://localhost:8080/api/restaurants/:id
    Passed argument :id must be a single String of 12 bytes or a string of 24 hex characters
    Example:
    curl -i -X PUT -d @doc.txt http://localhost:8080/api/restaurants/58a55287c659b27936b4fbc1 --header "Content-Type:application/json"

  * delete specific restaurant
    API structure: DELETE request for http://localhost:8080/api/restaurants/:id
    Passed argument :id must be a single String of 12 bytes or a string of 24 hex characters
    Example:
    curl -i -X DELETE http://localhost:8080/api/restaurants/58a55583150ce779e10bcddf --header "Content-Type:application/json"

  * list all pizzas of specific restaurant
    API structure: GET request for http://localhost:8080/api/restaurants/:id/pizzas
    Passed argument :id must be a single String of 12 bytes or a string of 24 hex characters
    Example:  
    curl -X GET http://localhost:8080/api/restaurants/58a55287c659b27936b4fbc1/pizzas --header "Content-Type:application/json"

  * add new pizza to specific restaurant
    API structure: POST request for http://localhost:8080/api/restaurants/:id/pizzas
    Passed argument :id must be a single String of 12 bytes or a string of 24 hex characters
    newPizza.txt contains the pizza json document
    Example:
    curl -X POST -d @newPizza.txt http://localhost:8080/api/restaurants/58a5a22ff183900e5952c5b6/pizzas --header "Content-Type:application/json"

  * get specific pizza details
    API structure: GET request for http://localhost:8080/api/restaurants/:id/pizzas/:name
    Passed argument :id must be a single String of 12 bytes or a string of 24 hex characters
    Passed argument :name can be string (Please note: if string contains spaces, replace it with %20 character)
    Example:
    curl -X GET http://localhost:8080/api/restaurants/58a5a23af183900e5952c5b7/pizzas/Pollo%20alla%20Sparago --header "Content-Type:application/json"

  * update pizza details
    API structure: PATCH request for http://localhost:8080/api/restaurants/:id/pizzas/:name
    Passed argument :id must be a single String of 12 bytes or a string of 24 hex characters
    Passed argument :name can be string (Please note: if string contains spaces, replace it with %20 character)
    Example:
    curl -X PATCH -d @newPizza.txt http://localhost:8080/api/restaurants/58a739753b191171ced753c6/pizzas/Pollo%20Greco --header "Content-Type:application/json"

  * delete specific pizza
    API structure: DELETE request for http://localhost:8080/api/restaurants/:id/pizzas/:name
    Passed argument :id must be a single String of 12 bytes or a string of 24 hex characters
    Passed argument :name can be string (Please note: if string contains spaces, replace it with %20 character)
    Example:
    curl -X DELETE http://localhost:8080/api/restaurants/58a739753b191171ced753c6/pizzas/Pollo%20Greco --header "Content-Type:application/json"

  * list all pizzas of your web store
    API structure: GET request for http://localhost:8080/api/pizzas  
    Example:  
    curl -X GET http://localhost:8080/api/pizzas --header "Content-Type:application/json"

  * basic search by pizza name (should return all pizzas whose name contains search term)
    API structure: GET request for http://localhost:8080/api/pizzas/:searchterm  
    Example:
    curl -X GET http://localhost:8080/api/pizzas/Pollo --header "Content-Type:application/json"

    In mongodb shell:
    db.restaurants.aggregate([{$project:{"_id":0,"pizza":1}},{$unwind: "$pizza"}, {$out: "searchResult"}])
    db.searchResult.createIndex({"pizza.name": "text"})
    db.searchResult.aggregate([{$match: {$text: {$search: "Pollo"}}},{$project:{"_id":0,"pizza":1}}])


All request payloads and responses should be in JSON format.

For an inspiration you can use https://pizza-online.fi/ web store.
