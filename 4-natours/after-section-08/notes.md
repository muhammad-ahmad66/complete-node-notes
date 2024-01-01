# Introduction to MongoDB

## Table of Contents

1. [MongoDB_Fundamentals](#mongodb_fundamentals)
    1. [What_is_MongoDB](#what_is_mongodb)
    2. [Installing_MongoDB_on_Windows](#installing_mongodb_on_windows)
    3. [Creating_A_Local_Database](#creating_a_local_database)
    4. [CRUD_Operations](#crud_operations)
        1. [Creating_Documents](#creating_documents)
        2. [Querying-Reading_Documents](#querying-reading_documents)
        3. [Updating_Documents](#updating_documents)
        4. [Deleting_Documents](#deleting_documents)
    5. [Creating_Hosted_Database_with_Atlas](#creating_hosted_database_with_atlas)
2. [Using_MongoDB_With_Mongoose](#mongodb_fundamentals)
    1. [Connecting_Our_Database_with_the_Express_App](#connecting_our_database_with_the_express_app)
    2. [Mongoose_Introduction](#mongoose_introduction)
    3. [Creating_A_Simple_Tour_Model](#creating_a_simple_tour_model)
    4. [Creating_Documents_And_Testing_The_Model](#creating_documents_and_testing_the_model)
    5. [MVC_Architecture](#mvc_architecture)

## MongoDB_Fundamentals

## What_is_MongoDB

**What MongoDB is actually is? How it works? and Quick Overview of how it compares to more traditional databases.**

MongoDB is obviously a database and it's a so-called **NoSQL database.**  
More traditional, is the **Relational Database**, which NoSQL is often compared to.  
In Mongo, which we can say instead of MongoDB, each database can contain one or more **collections**. we can then these **collections as a table of data.**  
Then **each collection can contain one or more data structures called documents,** in a relational database a document would be a **row in a table**.  
Each document contains the data about one single entity, for example one blog post or one user etc.  
Now the collection is like the parent structure that contains all these entities. for example a blog collection for all posts, a user collection or review collection etc.  
The document has data format that looks a lot like JSON, which will make our work a lot easier when we start dealing with these documents.  

### Mongo's main features

"According to MongoDB's website, MongoDB is a document database with the scalability and flexibility that you want and with querying and indexing that you need."

MongoDB is document bases which stores data in documents **which are field-value paired data structures** like JSON. Again it stores these data in documents instead of rows in a table.  
MongoDB has built-in **scalability**, making it very easy to distribute data across multiple machines as our apps get more and more users.  
**Flexibility**: So, there is no need to define a document data schema before filling it with data, meaning that each document can have different number and type of fields. And we can also change these fields all the time. And all this is really in line with some real-world business situations and therefor can become pretty useful.  
MongoDB is also a very **performant** by using these database system features like data model, indexing, sharding, the flexible documents, native duplication and so much more.  
MongoDB is a free and open-source database, published under the SSPL license

#### Let's talk about documents

!(see pdf file)

MongoDB uses a data format similar to JSON for data storage called **BSON**. It looks basically the same as JSON but it's typed, meaning that all values will have a datatype such as string, boolean, date, integer, double, object etc.  
Just like **JSON**, these **BSON** documents will also have fields and data is stored in key value pairs. On the other hand in a relational database each **filed(key) is called a column**. We can have multiple values for a single field. like tags: ['value1', 'value2].  here we have an array -multiple values, this shows flexibility of mongoDB.  

**Embedded documents:** which is not present in relational databases, so, we may have one field with array, and that array may contains multiple objects -That objects could have it's own document. SEE COMMENT FIELD IN PDF FILE. We can also call embedded as de-normalizing. It allow us to include(to embed) some related data all into one single document. This makes a database more performant in some situations.  
**The opposite of embedding or de-normalizing is normalizing, and that's how the data is always modeled in relational databases.** So in that case, it's not possible to embed data and so the solution is to create whole new table for embedded data in this example for comments. and  then join the tables by referencing to the id field of the comments table.

#### Two more things about BSON documents

1) The maximum size of each document is currently 16MB, but this might increase in the future
2) Each document contains a unique id,  which acts as a primary key of that document. It's automatically generated with the **Object id datatype** each time there is a new document, so we don't have to worry about it.

---

## Installing_MongoDB_on_Windows

Download from here: <https://www.mongodb.com/try/download/community>  
After installation we have 2 more things to do:  
First we need to create a directory in which mongoDB will store our data. open c disk and create a directory called data. And inside that data folder create another one called db. this is the place where mongoDB will store our data. In this path C:\Program Files\MongoDB\Server\7.0\bin we have mongod.exe file which is mongo server, and mongo.exe file which is mongo shell. from cmd run mongod file. by doing this we basically started a server, and now we need a shell to connect to the server to be able to manipulate our database.

**What if we want to run this mongo server from another directory?**  
Right now if want to run mongod.exe from any other directory it giving us an error.

We can do this using system variables. add the path(C:\Program Files\MongoDB\Server\7.0\bin) to mongod file to system variables by using path.

---

## Creating_A_Local_Database

We'll now create our first local database, using the Mongo shell. -Mongo shell is a terminal application

**use command**  
To create a database we use a '**use**' command inside the mongo shell, and then the name of the database. this command is also use to switch between databases. If not exist then it will create a new one. use natours-test,

Remember inside the database we've collections and then each collection has documents in it. And the data that we create in the Mongo Shell is always documents. And so of course we have to create the document inside of a collection, and so we specify that collection before we insert a document.  
It works like this: db.(which sands for the current/active database -in this case natours-test) then we specify the name of collection, which is tours and then we use the insertMany function. like this: **db.tours.insertMany().**  
Later on we'll then have to collection for users, for reviews, so basically for all the resources.  
**db.collectionName.insertMany()**  

_db.tours.insertMany();_ Here we'll pass a javascript object into this insertMany function, and then it'll convert it into JSON and BSON.

Here in this database now we inserting only one document so we'll use **insertOne()** function, Instead of insertMany().  
**db.collectionName.insertOne()**  
Like this:

```mongodb
db.tours.insertOne({ name: "The Forest Hiker", price: 297, rating: 4.7})
```

Just like this we created our first document in our database.  
db.collectionName.find()  
Just to check lets use db.tours.find() . Notice in the document it also automatically created id which is the unique identifier.  

**show dbs command:**  
Another very useful command is show dbs -which will show all the databases that we have in mongodb,  

**show collections command:**  
Another one is show collections -It will show collections that we've in that database.

_to quite from mongo shell, just type **quite()**_

---

**db.createCollection("students")**  
use to create a collections in active database.

**db.dropDatabase("students")** -to drop a collection

**db.students.insertOne({name: "Muhammad", age: 30, gpa: 3.2})**  
**db.students.insertMany([{}, {}])**

**To sort documents**  
db.students.find().sort()  
The sort method takes a documents by which fields we like to sort. let's say we sort the name by alphabetic order, we use 1 for alphabetical order and -1 for reverse order.  
**Alphabetical order:** db.students.find().sort({name: 1})  
**Sort by using gpa:** db.students.find().sort({gpa: 1}) -Lowest to upper  
**db.students.find().sort({gpa: -1})** -descending order  

**limit method:**  
We can limit the amount the document that're return to us. db.students.find().limit(1) // for returning 1 document only.

**We can combine both limit and sort**  
db.students.find().sort({gpa: -1}).limit(1) // to find how has the highest gpa

**Find method:**  
db.students.find() // will return all documents

**For a specific documents:**  
**.find({query}, {projection})**  
db.students.find({name: "Muhammad"}) // will return all students with named Muhammad  
db.students.find({name: "Muhammad", gpa: 3.2}) // search for more then one filter,  
In find method there is a second parameter that is **projection**. we can pass another document body  
db.students.find({}, {name: true}) // **Return every document, but only give there name.** mongodb by default returning id too, but we set {_id:false, name:true} in projection.  
db.students.find({}, {_id: false, name: true, gpa: true})  
These two parameters in find method ({query}, {projection}), **Query works just like a where clause in SQL**, & **Projection works just like a selecting specified columns**.

---

## CRUD_Operations

### Creating_Documents

**Why we are doing all this stuff in a terminal? And how does this relate to our Express application?**  
Right now we'll learn the absolute fundamentals of MongoDB, without the context of any application. So completely outside of Nodejs. Because in theory we could use mongodb with any other language or any other framework. It doesn't have to be with Node.js always. So for that it's good idea to learn mongodb standing completely on its own, without the context of any other language. In next section we start working on databases inside of our express application. By then we'll use a MongoDB driver just for node-express, so that we can use our javascript language to interact with MongoDB databases.

In previous lecture we create a document in tour collection by using insertOne() method. Now we lets create two documents at the same time. like this:  

**currentDatabase.collectionName.insertMany()**  
insertMany will accept an array of multiple objects.  

```mongodb
db.tours.insertMany([{name: "The Sea Explorer", price: 497, rating:4.8}, {name: "The Snow Adventurer", price: 997, rating: 4.9, difficulty:"easy"}])
```

Mongodb are flexible and so do not all collections should have the same structure. We can have different fields in different documents

---

### Querying-Reading_Documents

Querying for data in a database is one of the most important operations that we have in database. Let's now take a look at a couple of query operators in mongodb, starting with some simple ones.  
Let's say we want only one tour and we already its name, for that we'll pass in a filter object, inside that object we pass the search criteria. **db.tours.find({name: "The Forest Hiker" })**

Search for tours which have a price below 500.  
**db.tours.find({price: {$lte: 500}})**  
$ **Dollar sign is reserved in mongodb for it's operators.** All Mongo operators start with $(dollar) sign.

Search for two criteria at the same time.  
**AND Querying:** Both should be true
search for documents which have the price less or equal than 500, and also rating greater or equal to 4.8  
**db.tours.find({price: {$lte: 500}, rating:{$gte: 4.8}})**  

**OR Querying:** One part is true  
db.tours.find({$or: [{price: {$lt: 500}}, {rating: {gte: 4.8}}]}) // in this array we will put our conditions.
! OR operators will accepts an array of conditions. This array will contains one object for each condition

Besides our filter object, we can also pass in an object for projection. **Projection means we simple want to select some of the fields in the output.**  
db.tours.find({$or: [{price: {$gt:500}}, {rating: {$gte:4.8}}]},{name: 1} ) // this means we only wants name filed to be output. 1 to show, and 0 for not showing.

---

### Updating_Documents

**.updateOne() AND .updateMany()**  
db.tours.updateOne()  

**How these methods Works?**  
First we need to select which documents we actually want to update and, second we need to pass in the data that should be updated. So the first argument is basically a filter object.

```mongodb
db.tours.updateOne({ name: "The Snow Adventurer"}, {$set: {price: 597}}); 
```  

**To update we use set operator in second parameter**  
If our query matched with several properties in different documents then there will be only first one changed, because we used updateOne() method.

Here we updated a property that already existed, but we can also create a new properties.  
We set premium field, and will set true for premium fields. premium tours should have price greater than 500 and rating greater or equal to 4.8  

```mongodb
db.tours.updateMany({price: {$gt: 500}, rating: {$gte: 4.8}}, $set:{premium: true} )
```

With this updateOne and updateMany we usually only update parts of the document, but we can also completely replace the content of the document. for that we use .replaceOne()

---

### Deleting_Documents

Just like before we have **deleteOne** to delete a single document and we have **deleteMany** to delete multiple documents at once.  

lets do delete all the tours which has rating 4.8

```js
db.tours.deleteMany({rating: {$lt:4.8}});
```

To delete all the Documents in a collection:

```mongodb
db.deleteMany({})
```

Because the empty object is basically a condition that all of the documents always match

---

## Creating_Hosted_Database_with_Atlas

Let's now create a remote database hosted on MongoDB Atlas. So, for developing our project we will actually not use a local database on our computer, like we've been doing now. So, instead we're gonna use a remote database hosted on a service called Atlas, which is actually owned by the same company that develops mongoDB

Atlas is a so-called database as a service provider which takes all the pain of managing and scaling database away from us. And also extremely useful to always have our data on cloud, because this way we can develop our application from everywhere and even more importantly we don't have to export data from the local database and then upload it to a hosted database, once we are ready to deploy our application. So, instead we simply use this hosted database right from the beginning.

Cluster is basically like an instance of our database.

### Connecting to our Hosted Database

Let's now connect our remote hosted database with our Compass app and also with Mongo shell.

### SECTION END #07

---

## Using_MongoDB_With_Mongoose

### NEW_SECTION

## Connecting_Our_Database_with_the_Express_App

Now it's time to connect the mongoDB database with our express application.

- 1st step is to actually get our connection string from Atlas just like we did before when connected the database to compass and to the mongo shell.
- Next we need to install **Mongodb Driver**. -**A software that allows node codes to access and interact with MongoDB database**. And there are couple of different mongodb drivers, but we're gonna use the one that is the most popular one, which is **Mongoose**, which adds a couple of features to the native mongodb driver. ***npm i mongoose@5***
- After installation we need to require mongoose in server.js, here we will establish our connection. And after requiring we will use connect method which is available on mongoose, Into this connect method we need to pass in our database connection string. the string is we stored in config.env file in DATABASE variable. And a second argument we pass in an object with some options and these are just some options that we need to specify in order to deal with some deprecation warnings.

```js
const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}) // These option will be exactly same in different apps.  
```

**This connect method will return a promise**, so handle that promise by using then(), and this promise will get access to connection object.  

### Connecting with Atlas (Remote)

```js
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).then(con => {
  // console.log(con.connections);
  
  console.log('DB connection Successful');
})
```

### Connecting with Localhost

```js
mongoose.connect(process.env.DATABASE_LOCAL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con => {
  // console.log(con.connections);
  
  console.log('DB connection Successful');
})
```

---

## Mongoose_Introduction

**What is Mongoose?**  
**Mongoose** is an object data modeling library for MongoDB and NodeJs, providing a higher level of abstraction. It's is bit like the relationship between express and node, So, express is a layer of abstraction over regular node, while mongoose is a layer of abstraction over regular MongoDB driver. By the way, an object data modeling library is just a way for us to write javascript code that will then interact with a database. So, we could just use a regular MongoDB driver to access our database, and it would work just fine. But instead we use mongoose because it gives us a lot more functionality, allowing for faster and simpler development of our applications. So, some of the features mongoose give us is **schemas to model our data and relationship**, **easy data validation**, a **simple query API**, **middleware**, and much more.

**In mongoose a schema is where we model our data, so where we describe the structure of the data, default values and validations.** We then take that schema and create a model out of it.  
**And model is basically a wrapper around the schema**, which allows us to actually interface with the database in order to create, delete, update, and read documents.

---

## Creating_A_Simple_Tour_Model

Let's now **Implement a very simple schema and model for our application.** We do that in server.js file.
Mongoose is all about models, And **model is like a blueprint** that we use to create documents. So, it's a bit like classes in javascript.  
**We create a model in order to create documents and also to query, update, delete these documents.** so basically to perform each of the CRUD operations, we need a mongoose model.

And in order to create a **model** we actually need a **schema**. So we actually create **models** out of **mongoose schema**. And we use the schema to describe our data, to set default values, to validate the data, and all kinds of stuff like that.  
For schema we use _**const tourSchema = new mongoose.Schema({})**_. And in **Schema** we pass our **schema as an object**. We can also pass in some options, into the schema, but we leaving that for future.

```js
const tourSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  price: Number,
})
```

We have a name, rating, and price and we specified the datatype that we expect for each of these fields. This is the most basic way of describing a schema, but we can take it one step further by defining something called schema type options for each field or for only some specific field.

In name instead of just specifying it as a string, we can pass another object. In this object with type property we can define couple of more options. For example, we can say that field is required,  And we can specify the error when any required field is missing. In order to that we just have to pass an array and the first one is true and second will be error string. example ⬇. Also we can set default values. also say name should be unique. practical ⬇

```js

const tourSchema = new Schema({
  name: {
    type: String,
    // required: true,
    required: [true, 'A tour must have a name']

  },
  rating: {
    type: Number,
    default: 4.5
  }
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
})
```

**Lets now create a model of it.**

```js
const Tour = mongoose.model('Tour', tourSchema)
```

Always use Uppercase first letter for model name and model variable.  
**In mongoose.model() method, we pass name of the model and then the schema.**

In next lecture we use our model to create a very first tour document.  
Remember: **In schema we use required: true, This is a something called a validator**, because it's used to validate our data. There are lot of validators in mongoose, and we can create our own validators.

---

## Creating_Documents_And_Testing_The_Model

Lets now start creating documents, testing the model, and really start using Mongoose.

We will create a new variable(testTour) this will be a new document created out of the Tour model that we created in last lecture. And in that we will pass an object with the data.

```js
const testTour = new Tour({
  name: 'The Forest Hiker',
  rating: 4.7,
  price: 497
})
```

This⤴ is a new document out of Tour model or function constructor, This is kind of using javascript function constructors or javascript classes. basically creating a new object out of class.

Now testTour is an instance of the Tour model, and so now it has a couple of methods on it that we can use in order to interact with the database. Like these:  

```js
testTour.save();
```

This will save it to the tour collection in the database. Now this **save method** will return a promise that we can then consume. And in here(in this case callback of then method), we get **access to the document that was just saved to the database**.

```js
testTour.save().then(doc => {
  console.log(doc)
}).catch(err => {
  console.log('Error!!!', err);
})
```

One thing here, that saving this document to the database might go wrong so let's catch error.  
Now if we run it, then it will execute the code that are in instance(testTour) of Tour model, basically create a new tour and try to save it into database.  

**In database we've tours collection. From where it's coming?** we've not created any collection.
Basically it's coming from the model, by using that we create documents, **But model name is Tour, not tours?** Mongoose automatically created that collection name according to model as soon as we created the first document using the tour model and gives plural name automatically.

**Here one thing!** if we reload/save this page, all the code will run and then it'll try to save this document again in collection as we save the file. We get and error here, the Error is 'duplicate key error collection', This is because we already have a tour with name of Forest Hiker and now we were trying to create another one, and since in our schema we have unique property: true for name.

---

## MVC_Architecture

**Intro to Back-End Architecture:** MVC, Types of Logic and More...

**MVC ARCHITECTURE:**  
MVC stands for **Model**, **View**, and **Controller**. There are different ways to implementing the **MVC Architecture**

The Model layer is concerned with everything about applications data, and the business logic.  
The function of **Controllers layer** is to handle the application's request, interact with models, and send back responses to the client, and all that is called the application logic.  
The **View layer** is necessary if we have a graphical interface in our app. Or in other words if we're building a server-side rendered websites. The view layer consist of the templates used to generate the view. And that's the presentation layer.  
!So,  
**Model**       => Business Logic  
**Controller**  => Application Logic  
**View**        => Presentation Logic  

Using a pattern or an architecture like this allows modular applications which is going to be way easier to maintain and scale as necessary.

And we could take it even further, and add more layers of abstraction here

Let's take a look at MVC in the context of our app, and the request-response cycle.  
So, as always; Start with a request, that request will hit one of our routers, remember we have multiple routers, one for each resource,  Now the goal of the router is to delegate the request to the correct handler function, which will be in one of the controllers. There will be one controller for each of resources to keep these different parts of the app nicely separated. Then depending on the incoming request, the controller might need to interact with one of the models, for example to retrieve a certain document from the database or to create a new one, And there is one model file for each resource. After getting the data from the model, the controller might then be ready to send back a response to the client, for example, containing that data. Now in case we want to actually render a website there is one more step involved. In this case, after getting the data from the model the controller will then select one of the view templates and inject the data into it. That render website will then be send back as the response. In the View layer in an express app there is usually one view template for each page. like a tour overview page, a tour detail page, or a login page.  
More detail about the Model and Controller.

One of the big goal of MVC is to separate business logic from application logic. And What are these types of Logic actually?

**Application logic** is all the code that is only concerned about the application's implementation and not the underlying business problem that we're actually trying to solve with tha application, like showing and selling tours, managing stock in supermarket, or organizing a library. Application logic makes the app actually work. A big part of app logic in express is about managing requests and responses. Application logic serves a bridge between model and view layer.  

**Business logic** is all the code that actually solves the business problem that we set out to solve. Let's say that our goal is to show tours to customers and sell them. The code that is directly related to the business rules, to how the business works and the business needs, is business logic. examples: creating new tours, validating user inputs, checking user's password.

The Application login and Business logic are almost impossible to completely separate, But we should do our best efforts to keep the application logic in our controllers and business logic in our models.

And there is this Philosophy of **'Fat Models/Thin Controllers'**: which says we should offload  as much logic as possible into the models to keep the controllers as simple and lean as possible.

---

## Refactoring for MVC

Now no longer depend on json file  
No need of importing from the file. So delete this⤵

```js
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);
```

```js
const testTour = new Tour({
  name: 'The Park Camper',
  price: 997,
});
// testTour.save(); // to save in DB
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('Error!!!', err);
  });
```

```js
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId, ratingsAverage: 5.0 }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {

    },
  );
```

These codes are completely deleted ⤴⤴

---

No need of Check id function. Because from now on we're gonna start working with the IDs that are coming from MongoDB, and Mongo itself will give us an error if we use an invalid id.

```js
exports.checkId = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }
  next();
};

// !Also Deleted
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }

  next(); // next middleware will be create tour.
};

```

---

## Another Way of Creating Documents

We'll implement the createTour function, which is the handler function that is called as soon as there is a post request to the /tours route.

- We are going to to implement this createTour ⬇ function based on the data that comes in from the body.
- const newTour = new Tour({}) And then
newTour.save(); // This will work finely. But we can do it in an even easier way.
Tour.create({

}).then()
Pass the data here, that will do exact same thing. The main difference is that in this version(Tour.create({})), we basically call the method directly on the tour ie on model itself, while in first one we called the method on the new document. As save method return promise this create method also return promise as well. Instead of using then method we'll start using async-await. so we convert our function to async function. and make Tour.create await and store in a variable.

- We pass request.body in Tour.create method, because that's the data that comes with the post request.
! Remember: In post method the data will always comes from the request body
- As we doing with async/await, so we use try/catch block to catch errors.
? What do we put in catch block as an error?
So, for that we need to think about when exactly an error can happen. If we try to post without filling any required fields, then it will give us validation errors. and it's one of the errors that would get catched here. because if we try to create a document, without one of the require fields, then this promise(return of tour.create()) would be rejected. And so if we have a rejected promise then it'll enter in the catch block. So, therefor in this catch block we want to send back a response saying that there was an error.

We put these in body in Postman:
{
    "name": "Test Tour",
    "duration": 10,
    "difficulty": "easy",
    "price": 300,
    "rating": 4.7
}
?But difficulty and duration are not included, although we specify in body. This is because these two fields are not in our schema. and so therefor they are not put in the database.

- So everything else that is not in our schema is simply ignored. THAT'S THE POWER OF OUR SCHEMA.
- And if we send this data again it's giving an error. Why is that? because we defined the the name should be unique.

*/

exports.createTour = async (req, res) => {
  try{

    // Creating a documents:
    // const newTour = new Tour({})
    // newTour.save(); Instead of this:
    const newTour = await Tour.create(req.body);
    
    
    res.status(201).json({
      status: 'success',
      // data: {
        //   tour: newTour,
        // },
      });
    } catch(err){
      // 400 stands for bad request
      res.status(400).json({
        status: 'fail',
        message: err,
      })
    }
};

/*

- lecture 089
- Reading Documents

Let's now learn how to read documents with Mongoose in order to implement our getTour and getAllTours route handlers. Starting with getAllTours handler.

- Remember we learn from intro section, to query for all the documents we simply used find(). If we don't pass anything into it, then it'll return all the documents in that collection, in this case in tour collection.
- Just like before, this is(find method) gonna return a promise that we'll await.

? Next up lets implement the getTour handler.

- Here we use findById instead of just find.
? But were from that id coming from? So, let's take a look at the route. 127.0.0.1:3000/api/v1/tours/2 like this we call endpoint. Or by real id like this: 127.0.0.1:3000/api/v1/tours/6535233aa57a9f3860f97897
So, here we have the id right in our route. Remember like this '/:id' specified id in url. So, this id is gonna be part of request obviously. To how do we get access to that id here in getTour handler?
We do req.params.id
- Here this findById() method, is really just a short-hand -so a helper function- for findOne({_id:req.params.id }) with filter object. So
?findOne({_id:req.params.id}) is exact same as findById(req.params.id)

*/

// * getAllTours() Handler [code]
exports.getAllTours = async (req, res) => {
try{

  const tours = await Tour.find();
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
} catch(err){
  res.status(404).json({
    status: 'fail',
    message: err
  })
}
};

// * getTour Handler  [code]
exports.getTour = (req, res) => {
  try{
   const tour = await Tour.findById(req.params.id)
  //  const tour1 = await Tour.findOne({_id:req.params.id});

   res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });

  } catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
};

/*

- lecture 090
- Updating Documents

? Now let's implement document updating.
So, here in our update tour handler, let's start by making it async func.

- then we need to query/get that document that we want to update and update it.
We can actually do all in one command in mongoose. and remember we gonna update based on id. We just use findByIdAndUpdate() method, here we'll pass the id, and then the data that we want to change. and that date will be in the body just like in the post request, here actually a third argument, we can pass some options in object. some options are:
- new: true, This way the new updated documented will be returned, since we want to send back that updated document.
- runValidators: true, Each time that we update a certain a document, then the validators that we specified in the schema will run again.

const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
  new: true,
});

! REMEMBER: All of the method(find, findById...) that we are using will returns queries.

! CHECK MONGOOSE DOC <https://mongoosejs.com/docs/api/model.html>
In documentation of Mongoose, In model section, we see list of methods, and some of them are with just model like model.findOne() and some with model.prototype like Model.prototype.save(), When we see model.prototype then it means that method is available on all the instances created through a model, not the model itself. Example:
const newTour = new Tour({})// Here newTour is and instance of Tour model
newTour.save() // here save is only available on newTour not on Tour.

*/

exports.updateTour =async (req, res) => {
  try{
    const tour = Tour.findByIdAndModify(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  }catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
};
// !Here one thing remember: we are using patch method, so the only that field will change. And if we doing put request, the entire original object will be completely replaced with modified one, that is sending in body.

/*

- lecture 091
- Deleting Documents

*/
exports.deleteTour = async (req, res) => {
  try{

    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    })
  } catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }

}

/*

- lecture 092
- Modelling the Tours

It's now time to finally Model our tour data a bit better in order to make the tours more complete. At this point, our tour documents only have a name, a rating, and a price. But we need so much more data here.

maxGroupSize: how many people at most take part of one tour.
ratingAverage and ratingQuality will be calculated based on the on reviews, So, there should not be required.

One new schema type, not used yet:
trim: true, Trim only works for strings, which'll remove all the white space in the beginning and in the end of the string.

imageCover: {
    type: String,

}

- Here type: String, because this will simply be the name of the image, which then later, we'll be able to read from the file system. -We want just the name of image, basically a reference will be stored in the database. We could store an entire image in a database but that's usually not a good idea. we simply leave the images somewhere in the file system and put the name of the image itself in the database as a field.

images: [Strings],

- Rest of the images, because we have multiple images, and want to save those images as an array, as an array of strings. And so the way to do it is to simply specify here.
images: [Strings] -It means an array which we have a number of strings.

createdAt: {
  type: Date,
  default: Date.now()
}
createdAt field should basically be a timestamp that is set by the time that thw user gets a new tour.

- Date is yet another javascript built-in datatype, and so we can use that here.
- default will be the javascript built-in function Date.now(), this will simply give us a timestamp in milliseconds, which basically represents the current millisecond. Now in mongo this is now immediately converted to today's data,

An array of start dates. startDates are basically different dates at which a tour starts. For example, we have a tour starting in december and then in february and then another one in the summer. So, different dates for the same tour.
Mongo will automatically try to parse the string that we passed in as the date into a real javascript data.

*/
const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const tourSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, 'A tour mush have a name'],
    unique: true,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty']
  },
  ratingAverage:{
    type: Number,
    defaultValue: 4.5
  },
  ratingQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description']
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image.']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDates: [Date],

})

const Tour = mongoose.model('Tour', tourSchema);

/*

- lecture 093
- Importing Development Data

? We'll build a little script that will import the tour data from our JSON file into the MongoDB database.
We'll gonna script that will simply load the data from the JSON file into the database. This script is completely independent from our express application. It only gonna run once in the beginning.

- Will add a new file named as import-dev-data.js in data folder.
- We need mongoose, and connection.  See import-dev-data.js file.
- we'll also access to tour module, where we want to write the tours.  

- Let's now learn a tiny little bit about interacting with the command line.
- We'll run functions that are in import-dev-data.js file, without calling any of these functions.

! Always remember './' in any path dot is always relative from the folder where the node application was actually started and `${__dirname}/` is relative to the current folder where current script is.

! SEE import-dev-data.js FILE

*/

/*

- lecture 094
- Making the API Better_Filtering

Now we'll implement couple of common API features that make an API easier and more pleasant to use for users.

- In this lecture we'll start form Filtering
The first feature that we're gonna implement is to allow the user to basically filter data using a query string.
From get all the tours routes, we want to allow the user to filter the data, so that instead of getting all the data, the user only gets the data that matches the filter. Like this, we can basically allow the user to query the data in a very easy way using the query string.
? What a query string is?
A query string looks a bit like this: after a url, question mark(?)and then we can simply specify some field value pairs. like this: 127.0.0.1:3000/api/v1/tours?duration=5&difficulty=easy -We've build a query string like this.
? A query string start with question mark and then specify as many as key value pairs using this format: ?duration=5&difficulty=easy

- if we write in postman, the postman recognizes this and basically parses this string and puts the key and value down in Params tab. TEST IN POSTMAN

? Now we need a way of accessing that data in a query string, from our express application.
THAT'S VERY EASY! because Express already took care of that. That's just one of the many many things that express does for us in order to really make NodeJS development a lot faster. just see using this code in getAllTour handler because we do this kind of filtering in the route where we want to get all the tours.
console.log(req.query);
req.query should give us an object nicely formatted with the data from the query string.

- After consoling req.query we got the object { duration: '5', difficulty: 'easy' }
- Now use this data to implement our filtering.
- In Mongoose there are actually two ways of writing database queries.
1- First one is to just use filter object just like we did in MongoDB introduction section.
const tours = await Tour.find({
  duration: 5,
  difficulty: 'easy'
})
2- Second way is to use some special mongoose methods.
We'll chain some special Mongoose method to basically build the query similar to the first one.
const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
There are tons of other methods like. Instead of equals(), lt(), lte() sort results, or limit the number of results etc...
? In our application we're gonna use 1st approach.

! We see filter object in find method that is very similar to the returning req.query, So we can just pass req.query into find method. Just like this:
const tours = await Tour.find(req.query);
? Now problem with this implementation is that it's actually way too simple and tha's because, later on we will have other query parameters, for example sort, for sorting functionality, or page for pagination, And so we need to make sure that we are not querying for these in our database. If we search page=2 then we will not get any results. Because there is no document in this collection where page is set to two. So, we only want to use this parameter(page=2) to implement pagination and not to actually query in the database.
So, we'll have to do is, to basically exclude these special field names from our query string before we actually do the filtering.
What we'll do for that:

- First will create a shallow copy of the request.query object. Here to copy we need really a hard copy. We could just do like this const queryObj = req.query. Then if we would delete something from copied object(queryObj), we would also delete it from the request.query object. that's because in javascript we set a variable to another object, then that new variable will basically just be a reference to that original object. So we really need a hard copy here.
In javascript, there's not really a built-in way of doing this, but a very nice trick that we can use, since ES6, is to use first destructuring  and then we can simply create a new object out of that. Destructuring will basically take all the fields out of the object, and with the curly braces we simply create a new object like this: const queryObj = {...req.query
const queryObj = {...req.query}; that's the copy
- Than we have to create an array of all the fields that we want to exclude.
const excludedFields = ['page', 'sort', 'limit', 'fields'];
- Next we need to remove all of these fields from our query object. in order to do that we'll loop over these fields and use delete operator and from the queryObj we want to delete the field with the name of element, if it exist in queryObj.
- As we excluded all of things that are in excludedFields, so instead of using req.query object we will use our queryObj.
Nor for this url:
127.0.0.1:3000/api/v1/tours?difficulty=easy&page=2&sort=1&limit=10
We are querying for all the documents that have a difficulty set to easy and ignoring all of other fields.

- But here's actually something more that we need to do in our code, in order to basically be able to implement these features in future videos. So, let's now learn about how queries actually work in Mongoose.
This find method is going to return a query, So, Tour.find(queyObj); will return a query, and that's the reason why we can then chain other methods like we did in 2nd method to query like we chain where, equals etc.  
?Now comes the import part:
As soon as we actually await the result of the query, the query will then execute and comeback with the documents that actually match our query. So if we do like this:     const tours = await Tour.find(queryObj);
Then there is no way to implementing sorting, or pagination, or all of other features, So, instead we'll have to do is to save this part hereTour.find(queryObj) into a query and then in the end, as soon as we chained all the methods to the query that we need to, only then by the end we can await that query. For example we're going to use the sort method, limit method and chain to that query. And that will be impossible to do if we await the result of the initial query right there. So, the way that we do is:
query query = Tour.find(queryObj);
const tours = await query

! delete queryObj[field]) // To access an object's property we always use square brackets. her dot operator will not work

-

*/
exports.getAllTours = async (req, res) => {
  // BUILDING QUERY
  // 1-A) Filtering
  const queryObj = {...req.query};
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(field => {
    delete queryObj[field];
  })

  // 1-B) Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  
  // const query = Tour.find(queryObj);
  let query = Tour.find(JSON.parse(queryStr));

  // 2) Sorting
  // check for is they sort in query
  if(req.query.sort) {
    // const sortBy = req.query.sort.split(','); // it'll return an array of all the string, than we have to put it back together using join
    const sortBy = req.query.sort.split(',').join(' ');
    console.log(sortBy);
    query = query.sort(sortBy)
  } else{
    query = query.sort('-createdAt');
  }

// EXECUTING QUERY
// const tours = await Tour.find(req.query)
const tours = await query;
}

/*

- lecture 095
- Making the API Better_Advanced Filtering

- The filter feature that we have implemented right now already works great. In in this lecture we wanna take it to the next level by allowing some even more complex queries.
- Right now a user can only filter the documents by setting one key equal to a value, right??? But now, we actually want to also implement the greater than, the >=, the >, the >= operators, instead of just having equal,

? So what would the filter object would look like?
{
  difficulty: 'easy',
  duration: {$gte: 5}
}; So, this is how we would manually write the filter object for the query that we just specified.
A standard way of writing a query string including these operators: 127.0.0.1:3000/api/v1/tours?difficulty=easy&duration[gte]=5
So, basically like this we have a third part to the key value pair, so we have the key, the value and also the operator. we use [] brackets in order to specify the operator. this is standard way.
console.log(req.query);
Now log look like:
{
  difficulty: 'easy',
  duration: { gte: '5' },
}
So, object the given by req.query is almost looks identical to the filter object that we wrote manually(few line above). the only difference in the filter object that we wrote manually have the mongodb operator sign($), So that's only thing that's missing in the object that's given by request.query. The solution for this is basically replace all the operator like gte, gt... with their correspondent mongodb operators, so basically adding dollar sign. Lets now implement that.

- fist we convert object into a string
const queryStr = JSON.stringify(queryObj);
- The once we want to replace: gte, gt, lte, lt,
- There are couple of ways to replace but we gonna use regular expression here.
queryStr = queryStr.replace(/\b(gte|gt|lte|lt\b/g, match => `$match`);  here back-slash b is because we only want to match these exact words, Imagine a word in which lt in it, we of curse don't want in that case. And at the end g flag means that it'll actually happen multiple times. so if we have tow, three operators.
And a replace method also can accepts a callback which is very powerful, and this callback has as a first argument the matched word, or matched string, And we want to return from that callback the match string with $matched string. Code⬆⬆
- Now finally set find method should not use th query object, instead JSON.parse(queryStr)
const query = Tour.find(JSON.parse(queryStr));
- if we do not have any operator in the query string then everything will work just fine. because if not find any operator there will be no replacement.

*/

/*

- lecture 096
- Making the API better_ SORTING

Let's now implement result sorting in order to enable our users to sort result based on a certain field that can be passed using the query string.
? Remember, How we created queryObj and then excluded fields like sort, limits, page etc.
! code ⬆⬆

- First will check for is they sort in query, If there is, then we want to actually sort the results based on the value.
- One quick thing that we need to do, is to change this query of variable(query) from const to let
- We want to sort on: req.query.sort because  we want to sort  based on value of sort, that will be in query.
Remember: Tour.find() method will return a query. So, we stored that query object in query variable and then we can keep chaining more methods to it like we did sort here. - All methods that are available on documents created through the query class.
if(req.query.sort) {
    query = query.sort(req.query.sort)
} // Just using these codes we sorted them by the price in an ascending order, but we also sort them in descending order, just using ?sort=-price in url.
- We can take it one step further, because we have many cases here which have the same price. But how are these results with the same price then order within them?
In this case we want to rank them according to second criteria. So in case there is a tie, then we want to have a second field by which we can then sort where the first one is same.
In Mongoose that's quite easy.
sort{'price ratingsAverage'} - We want sort first by price and then as a second criteria we use rating average. Now we replace comma, which is  in url, with space like this: ?sort=-price,ratingAverage
const sortBy = req.query.sort.split(',').join(' ');
query = query.sort(sortBy); First we have to split the sort value, from the url, by comma, This split method will give us an array of elements of string splitted with comma, and then we to join the array into string by space.  because here we want space.  
- Just to finish let's add a default one. we do that by adding an else block. -In case the user doesn't specify any sort field in the url query string, we're still gonna add a sort to the query. By default we'll sort on base on created At field in descending order, so that the newest ones appear first.

*/

/*

- lecture 097
- Making the API Better_ LIMITING FIELDS

Next feature in our API, we have field limiting, so basically, in order to allow clients to choose which fields they want to get back inn the response. So, for a client, it's always ideal to receive as little data as possible, in order to reduce the bandwidth that is consumed with each request. And that's of course especially true, when we have really data-heavy data sets. It's very nice feature to allow the API users to only request some of the fields.
We specify limits like this in url:
tours?fields=name,duration,difficulty,price
We only want name,duration,difficulty,price
Just like in sort mongoose, actually request a string with the field name separated by spaces. Mongoose'll accept a string like this:  query = query.select('name duration price').
This operation, selecting a certain field names is called projecting.
Here we also want default in case user does not specify the fields, In that case we'll just remove something. Down in getAll we always have __v field set to zero, Mongodb just created these fields because it uses them internally. We could disable them, but that's not a good practice because mongoose actually uses them, But we can do is to never send them to the client, so we exclude them.
We just prefix__v with minus in select method. like this:
With the minus(-) we have everything except that field.

?- We can also exclude fields from the schema.
this can be very useful for example when we have sensitive data that should only be used internally.
in our example we might not want the user to see when exactly each tour was created. We want to always hide this createdAt field.
for tht go to schema(tourModel file) and then at createAt filed, simply set the select property to false.

*/

exports.getAllTours = async (req, res) => {
  // BUILDING QUERY
  // 1-A) Filtering
  const queryObj = {...req.query};
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(field => {
    delete queryObj[field];
  })

  // 1-B) Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  
  // const query = Tour.find(queryObj);
  let query = Tour.find(JSON.parse(queryStr));

  // 2) Sorting
  if(req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    console.log(sortBy);
    query = query.sort(sortBy)
  } else{
    query = query.sort('-createdAt');
  }

  // 3) Field Limiting
  if(req.query.fields){
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);

  }else {
    query = query.select('-__v')
  }

  // 4) Pagination
  const page = req.query.page _1 || 1;
  const limit = req.query.limit_ 1 || 100;
  const skip = (page - 1)*limit;
  query = query.skip(skip).limit(limit);

  if(req.query.page){
    const numberTour = await Tour.countDocuments();
    if(skip > numberTour){
      throw new Error('This page does not exist');
    }

  }
  
// EXECUTING QUERY
const tours = await query;
}

/*

- lecture 098
- Making the API Better_ PAGINATION

Another extremely important feature of a good API is to provide pagination. So, basically allow the user to only select a certain page of our results in case we have a lot of results.
Let's say we've 1000 of documents in a certain collection and we say that on each page we have 100 documents. So that would mean that we'd have 100 pages.
? So based on that, how we are gonna implement pagination using our query string.
Well, we'll use the page and the limit fields. there'll be page and limit field in url: v1/tours?page=2&limit=10, And this limit here, basically means amount of results that we want per page.
Now, we need a way of implementing this using Mongoose.
! CODE ⬆⬆
Example query would be like this:
The most useful method to implement pagination is skip(2) and limit(10) methods.

- limit method is exactly the same as the limit that we defined in the query string. So, basically the amount of results that we want in the query.  
- skip method is the amount of results that should be skipped before actually querying data.
?page=2&limit=10. let say the user want page no 2 with 10 results per page. that means that results 1 to 10 are on page one and 11 to 20 are on page two. So, it means we want to skip to results before we actually querying. here we need to skip 10 results in order to get 11, which'll be the first one on page 2.  If we want page 3 then 20 results must be skip.
So, we'll need some way of calculating this skip value based on the page and the limit.  
Before calculating we need first the page# and limit value from the query string. and we should also define some default values, that's because we still want to pagination even if the suer does not specify any page. We will define default page number one and a limit 100, when user request all of the tours.
const page = req.query.page _1 || 1; first we've converted page string to number and then set the default value to 1.
The formula we get for skip is:
const skip = (page -1)_ limit;

const page = req.query.page _1 || 1;
const limit = req.query.limit_ 1 || 100;
const skip = (page - 1) * limit;
query = query.skip(skip).limit(limit);
?Working!!, But what if try to go the page, in that no documents. like if we try to go page#4, while our documents finishes on page#3. So on page#4 there should be nothing.
In those case we want to throw an error, each time when the user selects a page that doesn't exist. we don't have enough results to have that page.
this will only happen when there is a page selected on a query. so use if block.
Here we gonna use a new method that is available on model. that's Tour.countDocuments(). As name says it'll return a promise, which then comeback with number of documents.
If number of documents that we skipped is greater than the number of documents that actually exists, then that means that the page does not exist.
If it's greater then we'll throw an error, because if we throw an error in try block, where we're currently in, it will then automatically move to the catch block. then it'll send back 404 message.

? At this pont our query might look something like this:
query.sort().select().skip().limit() All of these methods will always returns a new query.

*/

/*

- lecture 099
- Making our API Better_ Aliasing

Another nice feature that we can add to an API is to provide an alias route to a request that might be very popular, -so it might be requested all the time. For example, we might want to provide a route specifically for the five best cheap tours. So, if we'd use our regular route here with the filters and with all the features that we already have, the request would look a little bit like this. for five best and cheapest tours. /api/v1/tours?limit=5&sort=-ratingsAverage,price
Let's say this is the request that is done all the time and we want to provide a route that is simple and easy to memorize for the user. Let's try to implement that

First we will create a new route on tour router.
router.route('/top-5-cheap').get(tourController.getAllTour);
? How we implement this functionality?

- Here we still use getAllTours router, But before we call this route handler we basically want to prefill some of the fields in the query string. We already know the query string should look something like this: ?limit=5&sort=-ratingsAverage,price
- And so, for that we will run a middleware before we run getAllTour handler. That middleware function is then gonna manipulate the query object that's coming in. We really need to get familiar and used to this concept of using middleware in order to change the request object as we need it.

As soon as someone hits the top-5-cheap routes, the first middleware that's gonna be run is aliasTopTours, and this function will set these properties of the query object to it's values that we set in the function, basically prefilling parts of the query object before we then reach the getAllTours handler. A soon as we get to getAllTours function the query object is already prefilled, even if the user didn't put any of these parameters in the query string.
*/
router.route('/top-5-cheap')
.get(tourController.aliasTopTours,tourController.getAllTours);

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

/*

- lecture 100
- Refactoring API Features

We'll very quickly refactor the API features that we've implemented.
Now this is not only to make our code a bit cleaner, it also to make it more modular and more reusable in the future.
Right now we've all of codes for the features that we built for the getAllTours function. If we want these same features for other resources, for example for the users, or reviews, it would be not very practical to copy the code and use it. Now we create a class in which we going to add one method for each of these API features or functionalities.

- first we will build a class with name APIFeatures
- The the constructor function. And remember that this is the function that gets automatically called as soon as we create a new object out of this class.
- We'll pass two variables here in constructor, 1- Mongoose query and 2- querySting that we get from express, coming from the routes(url).
- We are building this class as generalize for all routes, for that we are passing the query, and the query will get outside of the class. If we take the query inside of the class then this class will bound to tour resource.
- Then we'll create one method for each functionality, starting with filter.
- Cut the code of filter to the filter method. and here we've to change couple of things. first req.query to querySting,
- After creating a methods will will create an instance/object of APIFeatures class and will store into a variable called features. and this features will have access to all the methods are that we defined in the class definition. And remember in here we need to provide a query and queryString,
In this case query will be: Tours.find(), and the queryString will be: req.query
-And now in the features variable we have all the methods, -we get access to any class method.
- We want chain all of method like features.filter().sort().limit(), To allow chaining we should return 'this' from all methods. And 'this' is simply the entire object.
Chaining will only works, because after calling each methods, we always return this. and 'this' is the object itself which has access to each of these methods.

Next we'll put this class into a new file, so a new module.
will make a folder utils(utility), and will add a file APIfeatures.js file into it.

*/

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    // 1-A) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = req.query.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page _1 || 1;
    const limit = this.queryString.limit_ 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

const features = new APIFeatures(Tour.find(), req.query);

/*

- lecture 101
- Aggregation Pipeline_Matching and Grouping

! CODE ⬇🔽⬇

THE MONGODB AGGREGATION PIPELINE:
the mongodb aggregation pipeline is an extremely powerful and useful MongoDB framework for data aggregation.

- The idea is that we basically define a pipeline that all documents from a certain collection go through where they are processed step by step in order to transform them into aggregated results. For example we can use the aggregation pipeline in order to calculate averages or calculating minimum and maximum values or we can calculate distance, and we can really do all kinds of stuff. It's really amazing and really powerful.

? let's now start using aggregation pipeline, will create new handler function. In tourController.js
we're gonna create functions that will calculate couple of statistics about our tours.

- The aggregation pipeline is a MongoDB feature But mongoose gives us access to it, so that we can use it in the mongoose driver.
- The aggregation pipeline is bit like a regular query and so using the aggregation pipeline it's just a like doing a regular query. The difference is in aggregation we can manipulate the data in a couple of different steps. So lets's now actually define these steps.
For that we pass an array of so-called stages. -An array with lot of stages
And then the documents passes though these stages one by one, step by step in the defined sequence. So, each of the element in this array will be one of the stages. and there are ton of different stages that we can choose from, but we'll use most common ones.
? How we define stages?
will start with match. Match is basically to select or to filter certain documents. It's very simple, it's just like a filter object in MongoDB.
- Each of stages is an object and then in array comes the name of the stage.
lets say we only want to select documents which have a ratings average greater or equal then 4.5.
const stats = Tour.aggregate([
      {
        $match: {ratingsAverage: {$gte: 4.5}}
      }
    ])
That's the first stage, And usually this match stage is just a preliminary/initial stage to then prepare for the next stages which is ahead.

- Next one is the group stage. As the names says this group allows us to group documents together, basically using accumulators. And an accumulator is for example calculating an average If we've five tours, each of them has a rating we can then calculate the average rating using group. let's do that>
First thing that we need to always specify is the _id, because this is where we're gonna specify what we want to group by. Now we specify null, because we want to have everything in one group, so that we can calculate the statistics for all of the tours together and not separate it by groups. later we'll group, for example we can group the difficulty, and the calculate the average for the easy tours, medium tours, and hard tours. We can group by one of our fields, that field we gonna specify here in place of id.
- Now simply calculate average rating. For average we'll use $avg, which is yet another mongodb operator. avgRating: {$avg: '$ratingsAverage'} as a value of $avg we need to specify the field, for which we want want to calculate the average. Also we'll find averagePrice, and also min and max price using $min & $max operator.
Now we want to check for all of these things that we done here. so for that we need to send a response. And the we need to add new route in our tour routes, just like this: router.route('/tour-stats').get(tourController.getTourStats);
Now we've an output:
{
    "status": "success",
    "data": {
        "stats": [
            {
                "_id": null,
                "numTours": 9,
                "numRatings": 270,
                "avgRating": 4.722222222222222,
                "avgPrice": 1563.6666666666667,
                "minPrice": 397,
                "maxPrice": 2997
            }
        ]
    }
}

Now we calculate the total number of ratings and also the total number of tours.
No of Ratings:: numRatings: {$sum: '$ratingsQuantity'},
No of Tours:: numTours: {$sum: 1}, Here each of document the sum operator will add 1 to the numTours variable.

- Let's now take it to the next level, by grouping our results for different fields. Let's start with difficulty. we simply put the name of the field as a value of _id: '$difficulty', with dollar sign.
Now we have a 3 results for each of tree difficulties. Like this:
"stats": [
            {
                "_id": "medium",
                "numTours": 3,
                "numRatings": 70,
                "avgRating": 4.8,
                "avgPrice": 1663.6666666666667,
                "minPrice": 497,
                "maxPrice": 2997
            },
            {
                "_id": "difficult",
                "numTours": 2,
                "numRatings": 41,
                "avgRating": 4.7,
                "avgPrice": 1997,
                "minPrice": 997,
                "maxPrice": 2997
            },
            {
                "_id": "easy",
                "numTours": 4,
                "numRatings": 159,
                "avgRating": 4.675,
                "avgPrice": 1272,
                "minPrice": 397,
                "maxPrice": 1997
            }
        ]

Lets group by ratingsAverage.
Let's do some operations with difficulty field:

- lets put difficulty to uppercase
! Remember we should pass the field name with dollar sign in _id like this:_id: '$difficulty',

Now Let's add another stage which is sort stage. In the object we have to specify which field, by we want to sort. let's sort on based on averagePrice, And remember in sorting we actually need to use the field names that we specified up in the group stage, because at this point we only have the results that given by group stage, we cannot use any fields out of that one.
      {
        $sort : {
        avgPrice:1,
        }
      }
      here 1 for ascending order.

We can also repeat stages. lets do another matching.
      {
        $match:{_id: {$ne: 'EASY'}}
      }
In this example we repeat match stage, and here _id is difficulty, because we already set id in group stage, and $ne operator means not-equal.
! CODE ⬇🔽⬇

*/

exports.getTourStats = async (req, res) => {
  try{
    const stats = Tour.aggregate([
      {
        $match: {ratingsAverage: {$gte: 4.5}}
      },
      {
        $group: {
          // _id: null,
          // _id: '$difficulty',
          // _id: '$ratingsAverage',
          _id: {$toUpper: '$difficulty'},
          num: {$sum: 1},
          numRatings: {$sum:  '$ratingsQuantity'},
          avgRating: {$avg: '$ratingsAverage'},
          avgPrice: {$avg: '$price'},
          minPrice: {$min: '$price'},
          maxPrice: {$max: '$price'},
        }
      },
      {
        $sort : {
        avgPrice:1,
        }
      },
      {
        $match:{_id: {$ne: 'EASY'}}
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });

  } catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

/*

- lecture 102
- Aggregation Pipeline_ Unwinding and Projection

? In this lecture we are gonna solve real business problem using aggregation.
let's imagine that we're really developing this application for the Natours company, and they ask us to implement a function to calculate the busiest month of a given year. So, basically by calculating how many tours start in each of the month of the given year. And the company really needs this function to prepare accordingly for these tours, like to hire tour guides or to buy the equipment and handle all the stuff like that. This is gonna be a real challenge.

- let's start by creating the function getMonthlyPlan
- Also implement the route in tourRoutes file.
- Enabling to pass a year in the url, let's use a url parameter for that.:

- All of tours(documents) have a starting dates, So, these dates is actually need as a starting point to create this function(aggregation pipeline). Because remember, we want to count how many tours there are for each of the months in a given year. Let's say that we're analyzing 2021, So, if we want to add all of these tours together the easiest way would basically be to have one tour for each dates, Right now we've multiple tours in same document. We can do that using aggregation pipeline. There is stage for doing exactly want we want, and that is called unwind.
- $unwind will do basically deconstruct an array field from the input documents and then output one document for each element of the array. Basically we want to have one tour for each of these dates in the array. This stage can be really useful for so many cases.
- The field with the array that we want to unwind is start dates.
- Now we have one document for each date. as we specify here. Instead of nine now we have 27 documents, because we every document had 3 documents. THAT'S THE FIRST STAGE

- NOW let's actually go ahead and select the documents for the year that was passed in the url. like: /api/v1/tours/monthly-plan/2021
- For that we use match stage. Remember match is basically to select documents.
- on startDates field, we want the date, basically greater than january 1st of the selected year(2021), and less than january 1st of next year(2022).
- In mongoDB compression between dates will works perfectly fine.
- To compare we built two new Dates, and compare them.

- NEXT UP, We have group stage.
- We want to group them by the months, But currently we simply have the entire date, with the year, month and date, and even the hour. We only want month.
- Let's use just another magical mongoDB operator. which is
? $month
Returns the month of a date as a number between 1 and 12. It'll basically extract the month out of our date. And there are lots of of other operators. SEE MONGODB DOCS.

! <https://www.mongodb.com/docs/manual/reference/operator/aggregation/month/> VISIT THIS MONGODB DOCS, TO READ MORE ABOUT OPERATORS.

- We are grouping it by month. And now the real information for for each of the month is how many tours start in that month. For that all we're gonna do is basically count the amount of tours that have a certain month.
- We not only require how many tours but also which tours?
- if we want information about which tours that should be an array. Because how else would we specify two or three different tours in one field, And so basically we want to create an array, and we do that by using push operator and then we're gonna push into that array as each document goes through this pipeline is simply the name of the field.  
- Now we'll add new field for the month as value id, using $addFields stage. Because before we have like this:
{
  "_id": 10,
  "numTourStarts": 2,
  "tours": [
    "The Forest Hiker",
    "The Star Gazer"
    ],
}, WE want month field as well with the value of_id, because here the value of _id is actual number of month.
NOW WE HAVE LIKE THIS:
{
  "_id": 10,
  "numTourStarts": 2,
  "tours": [
    "The Forest Hiker",
    "The Star Gazer"
    ],
  "month": 10
},

- NEXT UP, Let's get rid of _id field. as we copied it's value to month's field. so need of_id more. For that we use $project stage. We simply give each of the field names a zero or a one. If we give any field zero then that one no longer shows up. If we put one then it would show up.
$project: {
          _id: 0
        }

- Now we sort the documents by the number of tours. corresponding to intended field we put 1 for ascending and -1 to descending.

- Finally we use limit stage, and this one is exactly the same as limit in the query. So basically gonna allow us to only have six documents.

*/

exports.getMonthlyPlan = async (req, res) => {
  try{
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`), 
            $lte: new Date(`${year}-12-31`)
          }
        }
      }, 
      {
        $group: {
          _id: { $month: '$startDates'},
          numTourStarts: {$sum: 1}, 
          tours: {$push: '$name'}
        }
      },
      {
        $addFields:{month: '$_id'}
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: {
          numTourStarts: 1
        }
      },
      {
        $limit: 6
      }

    ])

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    })

  }catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
}

/*

- lecture 103
- Virtual Properties

Let's return to our data model and learn some super useful features that Mongoose offers us in order to model our data. And the first one we're gonna talk about are virtual properties.
let's open up tour model file.

- Virtual properties are basically fields that we can define on our schema but that will be persisted. So, they will not be saved into the database in order to save us some space there. And most of the time we want to really save our data to the database, but virtual properties make a lot of sense for fields that can be derived from one another. For example a conversion from miles to kilometers, it doesn't make sense to store these two fields in a database if we can easily convert one to the other.
Let's now define a virtual property that contains the tour duration in weeks. So, that's a field that we can very easily convert from the duration that we already have in days.
so here how it works also in tourModel.js file.
SchemaName.virtual(), and in virtual we pass a virtual property in string. and then on there we need to define get() method, that's just because this virtual property will be created each time that we get some data out of database. So this get function is called a getter. Now in here we pass a function, actually a callback function, which should not be arrow function,   We use here regular function here because remember, an arrow function does not get it's own this keyword. In here we need this keyword. The this keyword in this case is gonna be pointing to the current document.
duration / 7  By using this we convert duration(days) into weeks.
- Now we need to explicitly define virtual properties in our schema. In mongoose.Schema() we can pass in not only the object with the schema definition itself, but also an object for the schema options. So, let's add that in mongoose.Schema().
We need to specify here {toJSON: { virtual: true}, toObject: {virtual: true}}
It means each time the data output as a json we want virtual to be true, basically virtual should be part of the output. Also for data outputs as an object.
- One thing should keep in mind that we cannot use virtual properties in a query, because they are technically not a part of the database. So, we can not say tour.find(durationWeeks === 1 );

*/

const tourSchema = new mongoose.Schema({
  // Schema definitions....
}, {
  // object of options
  toJSON: {virtual: true},
  toObject: {virtual: true}
})

tourSchema.virtual('durationWeeks').get(function(){
  return this.duration / 7;
})

/*

- lecture 104
- Document Middleware

Just like Express, Mongoose also has the concept of middleware. So, let's now learn about the first type middleware, which is document middleware.
Like express we can use mongoose middleware to make something happen between two events. For example Each time a new document is saved to the database, we can run a function between the save command is issued and the actual saving of the document, or also after the actual saving. And that's the reason why Mongoose middleware also called pre and post hooks. So again, because we can define functions to run before or after a certain event, like saving a document to database. So middleware is an absolutely fundamental concept in Mongoose, just like in Express. And there are tons of possibilities, and use cases for middleware, and we're gonna be using middleware all the time in this project.
There are four types of middleware in Mongoose: document, query, aggregation and model middleware.
In this lecture we are gonna learn about document middleware. Which is middleware that can act on the currently processed document. Just like the virtual properties we define a middleware on the schema, [In tourModel file]
tourSchema.pre('save', function(){
  console.log(this);
})
This is pre middleware, which gonna run before an actual event. and that event in this case is the save event.  And so this callback function that we're gonna define here next, to the 'save', will be called before an actual document is saved to the database.
! This code runs before the .save() command and the .create() command, but not on .insertMany() command. Insert many will not trigger the save middleware.

- In a save middleware the 'this' keyword is gonna point to the currently processed document. And that is the reason it's called document middleware. In this function we have access to the document that is being processed, in this case the document that is being saved.
- let's check by creating a new tour by post method, remember it only trigger with create document or save.
- yeah we logged the document. This is right before actually saving the data. So we can act to the data before save into the database. So, let's perform some actions.
- We'll create a slug for each of these documents. So, remember how we created a slug for each of the products that we had in the store. We used slugify package.  So, slug is basically just a string, that we can put in the url, usually based on some string like the name. In this we will create a slug based on the tour name.
?- install slugify package npm i slugify, and then require it in tourModel.js file.

this.slug = slugify(this.name, {lower: true})

here we added a slug to that particular document with it's name, and as a second parameter we passed an options like every letter should be in lowercase.

? Just like in express we also has the next function in mongoose middleware, basically to call the next in the stack.

- We have to put the slug property in the schema.

*/

// pre save hook
tourSchema.pre('save', function (next) {
  // console.log(this); // Remember 'this' is the currently processed document.

  this.slug = slugify(this.name, {lower: true})
  next();
})

/*
Let's now very quickly experiment, with a post middleware.

- In the post middleware, has access not only to next, but also to the document that was just saved to the database, in the callback function.
- post middleware functions are executed after all the pre middleware functions have completed, So, in here we actually no longer have the 'this' keyword, but instead we have the basically finished document in callback function as a parameter.
- Although here we've only one post middleware so need of next(), but it's best practice to always use next()

- We can have multiple pre or post middlewares for the same hook, And hook in this case is this 'save' post/pre middlewares as a parameter, - We call first one pre save hook and now second one post save hook. this is terminology. Some call it middleware can some call it hooks.

Conclusion: We can have middleware running before and after a certain event. And in the case of document middleware, that event is usually the save event. And then in the middleware function itself, we have access to the this keyword, which is gonna point at the currently being saved document. And that this save middleware only runs for the save, and create mongoose methods. It not gonna run for insertMany and also for findOne and update or findById and also for findByIdAndUpdate,

*/
// PRE SAVE HOOK / MIDDLEWARE
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {lower: true})
  next();
})

tourSchema.pre('save', function (next) {
  console.log('Will save document...');
  next();
});

// POST SAVE HOOK / MIDDLEWARE
tourSchema.post('save', function(doc, next) {
  console.log(doc); // Finished document.
  next();  
})

/*

- lecture 105
- Query Middleware
let's take about second type of mongoose middleware, which is query middleware.

- As the name says, query middleware query middleware allows us to run functions before or after a certain query is executed.
So let's now add a pre-find hook, So basically a middleware that is gonna run before any find query is executed.
- It looks exactly like the other middlewares or the other pre hooks, The only difference is really this 'find' hook, which will make this query middleware and not document middleware. And the big difference here that the this keyword will no point at the current query, not at the current document, because we're not really processing any documents here.
- The use case / action that we're gonna do here is: let's suppose that we can have  secret tours in our database, like for tours that are only offered internally, or for a very small, like for VIP group of people, and the public shouldn't know about. Since these tours are secret tours we don not want the secret tours to ever appear in the result outputs. We're gonna to create a secret tour field and then query only for tours that are not secret.
- we added secretTour field in the schema. and type will be Boolean, true if it secret and false if it not.
secretTour: {
  type: Boolean,
  default: false
}

- Next up create a secret tour with post method.
- Let's now execute the query, keep in mind 'this' keyword here is now a query object. So we can chain all of the methods that we have for queries.
- lets chain find method and select all the documents where secretTour is not true,
- Now we have all the tours that are not secret,  Why? What's happening?
We create a query using tour.find then we chain all the methods and then execute that query, all of these are in tourController.js file, But before it actually is executed, our pre-find middleware is executed, it's executed because it is find just like there in the tourController.js file(Tour.find()), So, we're creating a find query, and so therefor the find hook is then executed. Since it's query middleware the 'this' keyword points to the query. And so, to that query we can then chain yet another find method, and in there, we filter out the secretTour using filtering object that's available for every find method.
- Now there is one thing, need to fix here, Because right now this middleware is running for find() only, but not for findOne. If we get by getTour method using it's(secretTour) id, then it's giving the secret tour. It means our middleware is not running on findOne command.  That's because the handler function for this(getTour) route is by using findById, which behind the scene is findOne(), and so it's different from find(). So, we need to specify the same middleware also for findOne.
There are two ways of doing that. The first one is simply go ahead, copy the code and then put define pre-hook for findOne also. but that's not really good. So Instead we're gonna use regular expression. and that's quite easy.
Remember a regular expression starts and ends with a slash. We'll say in regular function that the middleware should be executed not only for find, but all the commands that start with the name find. like for findOne, findOneAndDelete, findOneAndUpdate, etc

*/

tourSchema.pre('find', function(next){
  this.find({secretTour: {$ne: true}})
  next();
})

// FIRST WAY:
tourSchema.pre('findOne', function(next){
  this.find({secretTour: {$ne: true}})
  next();
})

// SECOND WAY:
tourSchema.pre(/^find/, function(next){
  this.find({secretTour: {$ne: true}})
  this.start = Data.now();
  next();
})

// ! SEE MONGOOSE DOCUMENTATION ABOUT MIDDLEWARE AND IT'S TYPES
// Because document middleware runs not only for save but  in fact it can also run for others like remove, or for validate, BUT usually we use only save.
// Now query Middleware can run for all of these query function: count, deleteMany, deleteOne, find, findOne, findOneAndDelete/Remove/Update, remove, update, updateOne, updateMany

/*
Let's now also set a post middleware for find. Remember this middleware will run after the query has already executed. So, therefor it can have access to the document that were returned.

- lets create a clock to measure how long it takes to execute the current query.
?How we do that?
It's quite simple, we'll set a property onto the 'this' object in pre middleware. because this query object is really just a regular object, because this query in pre middleware function is just a regular object. we can set any object property on it. So here we can say this.start = Data.now(); // will set current time in milliseconds.
And in the post middleware, we gonna run after the query has executed, we can then subtract the current time minus start time.

*/
tourSchema.post(/^find/, function(docs, next){
  console.log(`Query took ${Date.now() - docs.start} milliseconds!`)
  console.log(docs);
  next()
})

/*

- lecture 106
- Aggregation Middleware

The last middleware that we're gonna talk about is aggregation middleware, Aggregation middleware allows us to add hooks before and after an aggregation happens. So let's now continue with our previous example where we did hide the secret tours from the queries, now in an aggregation the secret tours are still being used, We also want to exclude the secret tour in the aggregation.
See getTourStats in tourController.js, where we first used aggregation. We could do here, in the $match state simple exclude the secret tours that are true. And then we also will do same thing in other aggregation that we have, in all the aggregations. that's not a good idea.
Let's simply exclude it right at the model level, So,lets add aggregation middleware. we want to happen this before the execution of middleware so we use pre.

! REMEMBER:
In query middleware the this keyword will point to the current query, and In document middleware the this keyword points to the current document. And in Aggregation object the this keyword going to point to the current aggregation object.

tourSchema.pre('aggregate', function (next) {
  console.log(this.pipeline()); // this'll log pipeline of current aggregation. which is an array.
  next();
});

- Now in order to filter out the secret tours, we have to add another match stage at the beginning of this pipeline array.
As aggregation.pipeline() gives an array, So, how we add and element at beginning of an array. for that we use unshift.
We want to add just another stage($match) at the beginning of the array
this.pipeline().unshift({$match: {secretTour: {$ne: true}}}); // It'll remove all the document all the tours which has secretTour to true.

? We are not talking about model middleware, because it's really not that important.
There is indeed other cool stuff that we can do with models, for example implementing instance methods which are methods that will be available on every document after being queried, and that again can be quite handy, will do that later.
*/

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({$match: {secretTour: {$ne: true}}});

  console.log(this.pipeline()); // this'll log pipeline of current aggregation, which is an array
  next();
});

/*

- lecture 107
- Data Validation Built-In-Validators

Mongoose offers us very powerful ways of validating data that's coming into our model. In this video we gonna learn all about data validation with mongoose.  
? What exactly does validation actually mean?
Validation is basically checking, if the entered values are in the right format for each field in our document schema, and also that values have been actually been entered for all of the required fields. Now on the other hand, we also have sanitization, which is to ensure that the inputted data is basically clean, so that is no malicious code being injected into our database or into the application itself. So, in that step we remove unwanted characters, or code from the input data. And this is actually a crucial step, like a golden standard in back-end development. To never ever accept input data coming from a user as it is. So we always need to sanitize that incoming data. But anyway, we'll leave data sanitization for the security section of the course, So, in this lecture we can focus entirely on the data validation. And we are doing this validation right on the model, it's because of the fat model and this controller philosophy, which makes the model the perfect place to perform validation.
In fact, Mongoose already comes with a bunch of validation tools out of the box. We already did some validation, like required, that is built in validator. unique is not really a validator.

- maxlength and minlength:
max and min length are specific to the string datatype. It an input string is longer than maxlength then it produce an error. We specify an array and then set the value, and then we add an error as a second array element.
? - What about in updating an existing one? is it works on updating.

- Yes, we get the same error, Now this only works because of the setting that we set way back, when we implemented this updating handler. there we set a an option {runValidators: true}, and if we set that to false then mongoose will accept this name without any error, even if the length not validate the maxlenght or minlength.

- min and max

- We know that the rating must be between one and five, So very similar to the min and max length, on numbers we simply have min and max
min and max are not only for numbers but it also gonna works with dates.

- enum:

- Next we want o restrict difficulty value to only three difficulties(easy, medium, and difficult), If the user puts in something else, then it not gonna work. we set an array of values to the enum property. The array values must be the values that are allowed.
enum: ['easy', 'medium', 'difficult'],
We also want to specify error message here, but right now that's not really possible. So the solution we need to do here is to create yet another object here and then specify, the values property and  message property. like this:
enum: {
  values: ['easy', 'medium', 'difficult'];
  message: 'Difficulty is either: easy, medium, or difficult.
}
enum is only available on strings.

THAT'S ALL FOR NOW, BUT there are actually a bunch of other validators. for example, on stings we have match validator to check if the inputs match a given regular expression.
THESE ARE MOST IMPORTANT BUILT-IN VALIDATORS. FOR COMPLETE LIST OF ALL OF THEM ALWAY CHECK OUT THE DOCUMENTATION

*/
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour mush have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']

    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'];
        message: 'Difficulty is either: easy, medium, or difficult. 
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      min: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      // default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
      summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image.'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/*

- lecture 108
- Data Validating_ Custom Validators

! CODE ⬆⬆
Sometime the built-in validators are simply not enough. And in that case, we can also build our own custom validators. And a validator is actually really just a simple function which should return either true or false. If it returns false, then it means there is an error, on the other hand when return true then the validation is correct and the input can be accepted. LET'S NOW BUILD OWN VALIDATORS:

We want to validate is if the price discount is lower than the price itself. That's something that we cannot do using the built-in validators.
We need to now specify here an object for the SchemaType options, just like this:
priceDiscount: {
  type: Number,
  validate: function(val){
     return val < this.price;
  }
}
To specify a validator we use the validate property. and as a value we put a callback regular function -not arrow because we'll use this keyword, which will points to the current document. This callback function actually has access to the inputted value, in this case the price discount that the user specified.  And remember we need to return a true or false from the validator
? When do we want return true and when false?
We want an error when the price discount is greater or equal than the actual price
it return true if priceDiscount is < price and false for priceDiscount > price.
priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
We do not have any custom message here. So let's add that.
We'll add error in a very similar way as we did with the enum. We need to actually specify another object and set the message property. And also add  a validator property and the callback function will be the value of that property.

Actually one very nice trick is that the message property also has access to the value. VALUE inside curly braces
message: 'Discount price ({VALUE}) should be below regular price'

! CAUTION: Now there is one very important caveat/warning is that inside a validator function the 'this' keyword is only gonna point to the current document when we are creating a new document. So this function is not going to work on update.
There are a ways to fixing this but they're very complicated and not really worth pursuing. And we could of course write validator functions that do not rely on a this keyword.

- There are couple of libraries on npm for data validation that we can simply plug in here as custom validators that we do not have to write ourselves.
! The most popular library is called validator and so let's actually take a look at that one.
Validator: A library of string validators and sanitizers. link:<https://github.com/validatorjs/validator.js>
this library validate and sanitize only strings.
- from this library we'll use isAlpha to check if the tour name only contains letters.
- fist install it and require it: npm i validator

And again we use validate property to use it. and then all we need to do it the plugin that function here.
validate: validator.isAlpha
If we wanna specify an error message it works just like that we did before.
validate: [validator.isAlpha, 'Tour name must only contain characters']
Here is one problem and that is the spaces are also allowed in isAlpha(), but obviously we want to keep the spaces here.  So simply get rid of this one.

! END SECTION #08
*/
