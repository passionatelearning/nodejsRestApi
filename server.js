var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var RESTAURANTS_COLLECTION = "restaurants";
var SEARCHRESULT_COLLECTION = "searchResult";

var app = express();
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
var url = 'mongodb://localhost:27017/test';
mongodb.MongoClient.connect(url, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// RESTAURANTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/api/restaurants"
 *    GET: finds all restaurants
 *    POST: creates a new restaurant
 */

//  * list all restaurants
app.get("/api/restaurants", function(req, res) {
  db.collection(RESTAURANTS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get restaurants.");
    } else {
      res.status(200).json(docs);
    }
  });
});

//  * add a new restaurant
app.post("/api/restaurants", function(req, res) {
  var newrestaurant = req.body;

  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  }

  db.collection(RESTAURANTS_COLLECTION).insertOne(newrestaurant, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new restaurant.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/api/restaurants/:id"
 *    GET: find restaurant by id
 *    PUT: update restaurant by id
 *    DELETE: deletes restaurant by id
 */

//  * get specific restaurant
app.get("/api/restaurants/:id", function(req, res) {
  db.collection(RESTAURANTS_COLLECTION).findOne({ "_id": ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get restaurant");
    } else {
      res.status(200).json(doc);
    }
  });
});

//  * update restaurant details
app.put("/api/restaurants/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(RESTAURANTS_COLLECTION).updateOne({"_id": ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update restaurant");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

//  * delete specific restaurant
app.delete("/api/restaurants/:id", function(req, res) {
  db.collection(RESTAURANTS_COLLECTION).deleteOne({"_id": ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete restaurant");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});

//  * list all pizzas of specific restaurant
app.get("/api/restaurants/:id/pizzas", function(req, res) {
  db.collection(RESTAURANTS_COLLECTION).findOne({ "_id": ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get restaurant");
    } else {
        res.status(200).json(doc.pizza);
    }
  });
});

//  * add new pizza to specific restaurant
app.post("/api/restaurants/:id/pizzas", function(req, res) {
  var newPizza = req.body;

  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  }

  db.collection(RESTAURANTS_COLLECTION).update({ "_id": ObjectID(req.params.id) }, { $addToSet: { "pizza": newPizza } },function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to add new pizza.");
    } else {
      res.status(200).json(doc);
    }
  });
});

//  * get specific pizza details
app.get("/api/restaurants/:id/pizzas/:name", function(req, res) {
  db.collection(RESTAURANTS_COLLECTION).findOne({ "_id": ObjectID(req.params.id) },{pizza: {$elemMatch: {name: req.params.name}}}, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get restaurant");
    } else {
      res.status(200).json(doc.pizza);
    }
  });
});

//  * update pizza details
app.patch("/api/restaurants/:id/pizzas/:name", function(req, res) {
  var newPizza = req.body;
  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a pizza name.", 400);
  }

  if (!req.params.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  }

  db.collection(RESTAURANTS_COLLECTION).update({ "_id": ObjectID(req.params.id) }, {$pull: {"pizza":{"name": req.params.name}}},function(err, doc) {
    if(err) {
      handleError(res, err.message, "Failed to remove pizza.");
    }
    else {
      db.collection(RESTAURANTS_COLLECTION).update({ "_id": ObjectID(req.params.id) }, { $addToSet: { "pizza": newPizza } },function(err, doc) {
        if (err) {
          handleError(res, err.message, "Failed to add new details of pizza.");
        } else {
          res.status(200).json(doc);
        }
      });
    }
  });
});

//  * delete specific pizza
app.delete("/api/restaurants/:id/pizzas/:name", function(req, res) {
  if (!req.params.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  }

  db.collection(RESTAURANTS_COLLECTION).update({ "_id": ObjectID(req.params.id) }, {$pull: {"pizza":{"name": req.params.name}}},function(err, doc) {
    if(err) {
      handleError(res, err.message, "Failed to remove pizza.");
    }
    else {
          res.status(200).json(doc);
        }
  });
});

//  * list all pizzas of your web store ---- Not working
app.get("/api/pizzas", function(req, res) {
  db.collection(RESTAURANTS_COLLECTION).find({},{"_id":0, "pizza":1}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get pizzas from restaurants");
    } else {
      res.status(200).json(docs);
    }
  });
});

//  * basic search by pizza name (should return all pizzas whose name contains search term)
app.get("/api/pizzas/:name", function(req, res) {
  db.collection(RESTAURANTS_COLLECTION).aggregate([{$project:{"_id":0,"pizza":1}},{$unwind: "$pizza"}, {$out: "searchResult"}], function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get pizzas from restaurants");
    } else {
      db.collection(SEARCHRESULT_COLLECTION).createIndex({"pizza.name":"text"}, function(err, doc) {
        if (err) {
          handleError(res, err.message, "Failed to create index on pizza name");
        } else {
        db.collection(SEARCHRESULT_COLLECTION).aggregate([{$match: {$text: {$search: "Pollo"}}},{$project:{"_id":0,"pizza":1}}], function(err, doc) {
          if (err) {
            handleError(res, err.message, "Failed to find pizza");
          } else {
            res.status(200).json(doc);
          }
        });
      }
    });
    }
  });
});
