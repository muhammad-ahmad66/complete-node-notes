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
