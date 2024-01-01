
#0f0
/*
? --------------------------- ?
! --------------------------- !
* --------------------------- *
! NEXT SECTION #07

*/

#0f0
/*
? --------------------------- ?
! --------------------------- !
* --------------------------- *
! NEXT SECTION #08
* Using MongoDB with Mongoose

*/

/*
* lecture 082
* Connecting Our Database with the Express App.

Now it's time to connect the mongoDB database with our express application.

- 1st step is to actually get our connection string from Atlas just like we did before when connected the database to compass and to the mongo shell.
- Next we need to install mongodb driver. -A software that allows node codes to access and interact with MongoDB database. And there are couple of different mongodb drivers, but we're gonna use the one that is the most popular one. which is Mongoose, which adds a couple of features to the native mongodb driver. npm i mongoose@5
- After installation we need to require mongoose in server.js, here we will establish our connection. And after requiring we will use connect method which is available on mongoose, Into this connect method we need to pass in our database connection string. the string is we stored in config.env file in DATABASE variable. And a second argument we pass in an object with some options and these are just some options that we need to specify in order to deal with some deprecation warnings. 
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}) // These option will be exactly same in different apps.  
This connect method will return a promise, so handle that promise by using then(), and this promise will get access to connection object. 
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

?Connecting with Atlas (Remote)
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).then(con => {
  // console.log(con.connections);
  
  console.log('DB connection Successful');
})


?Connecting with Local-host
mongoose.connect(process.env.DATABASE_LOCAL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con => {
  // console.log(con.connections);
  
  console.log('DB connection Successful');
})
*/

/*
* lecture 083
* What is Mongoose

? What is Mongoose?
Mongoose is an object data modeling library for MongoDB and NodeJs, providing a higher level of abstraction. It's is bit like the relationship between express and node, So, express is a layer fo abstraction over regular node, while mongoose is a layer of abstraction over regular MongoDB driver. By the way, an object data modeling library is just a way for us to write javascript code that will then interact with a database. So, we could just use a regular MongoDB driver to access our database, and it would work just fine. But instead we use mongoose because it gives us a lot more functionality, allowing for faster and simpler development of our applications. So, some of the features mongoose give us is schemas to model our data and relationship, easy data validation, a simple query API, middleware, and much more. 
- In mongoose a schema is where we model our data, so where we describe the structure of the data, default values and validations. We then take that schema and create a model out of it. 
- And model is basically a wrapper around the schema, which allows us to actually interface with the database in order to create, delete, update, and read documents.

*/

/*
* lecture 084
* Creating a simple Tour Model

Let's now implement a very simple schema and model for our application. We do that in server.js file.
Mongoose is all about models, And model is like a blueprint that we use to create documents. So, it's a bit like classes in javascript.
We create a model in order to create documents and also to query, update, delete these documents. so basically to perform each of the CRUD operations, we need a mongoose model.
- And in order to create a model we actually need a schema. So we actually create models out of mongoose schema. And we use the schema to describe our data, to set default values, to validate the data, and all kinds of stuff like that. 
- For schema we use const tourSchema = new mongoose.Schema({

}). and in Schema we pass our schema as an object. We can also pass in some options, into the schema, but we leaving that for future.
const tourSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  price: Number,
})
We have a name, rating, and price and we specified the datatype that we expect for each of these fields. This is the most basic way of describing a schema, but we can take it one step further by defining something called schema type options for each field or for only some specific field. 
- In name instead of just specifying it as a string, we can pass another object. In this object with type property we can define couple of more options. for example, we can say that field is required,  And we can specify the error when any required field is missing. In order to that we just have to pass an array and the first one is true and second will be error string. example ⬇. Also we can set default values. also say name should be unique. practical ⬇
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

?Lets now create a model of it. 

const Tour = mongoose.model('Tour', tourSchema)
Always use Uppercase first letter for model name and model variable. 
In mongoose.model() method, we pass name of the model and then the schema.

? In next video we use our model to create  a very first tour document.
? Remember in schema we use required: true, This is a something called a validator, because it's used to validate our data. There are lot of validators in mongoose, and we can create our own validators.

*/

/*
* lecture: 085
* Creating Documents and Testing the Model

Lets now start creating documents, testing the model, and really start using Mongoose.

- We will create a new variable(testTour) this will be a new document created out of the tour model that we created in last video. and in that we will pass an object with the data. 
const testTour = new Tour({
  name: 'The Forest Hiker', 
  rating: 4.7,
  price: 497
}) // This is a new document out of tour model or function constructor, This is kind of using javascript function constructors or javascript classes. basically creating a new object out of class. 
- Now testTour is an instance of the tour model, and so now it has a couple of methods on it that we can use in order to interact with the database. Like these:
? testTour.save():
this will save it to the tour collection in the database. Now this save method will return a promise that we can then consume. and in here(in this case callback of then method), we get access to the document that was just saved to the database. 
testTour.save().then(doc => {
  console.log(doc)
}).catch(err => {
  console.log('Error!!!', err);
})
One thing here, that saving this document to the database might go wrong so let's catch error.
Now if we run it, then it will execute the code that are in instance(testTour) of Tour model, basically create a new tour and try to save it into database. 
? In database we've tours collection. From where it's coming? we've not created any collection. 
Basically it's coming from the model, by using that we create documents, But model name is Tour, not tours? Mongoose automatically created that collection name according to model as soon as we created the first document using the tour model and gives plural name automatically.

! Here one thing! if we reload/save this page, all the code will run and then it'll try to save this document again in collection as we save the file. We get and error here, the Error is 'duplicate key error collection', This is because we already have a tour with name of Forest Hiker and now we were trying to create another one, and since in our schema we have unique property: true for name. 

*/

/*
* lecture 086
* Intro to Back-End Architecture_MVC, Types of Logic and More...

* MVC ARCHITECTURE: 
MVC stands for Model, View, and Controller. There are different ways to implementing the MVC architecture
- The Model layer is concerned with everything about applications data, and the business logic.
- The function of Controllers layer is to handle the application's request, interact with models, and send back responses to the client, and all that is called the application logic. 
- The View layer is necessary if we have a graphical interface in our app. Or in other words if we're building a server-side rendered websites. The view layer consist of the templates used to generate the view. And that's the presentation layer.
!So,
Model       => Business Logic
Controller  => Application Logic
View        => Presentation Logic

Using a pattern or an architecture like this allows modular applications which is going to be way easier to maintain and scale as necessary.

// And we could take it even further, and add more layers of abstraction here 

? Let's take a look at MVC in the context of our app, and the request-response cycle.
So, as always; start with a request, that request will hit one of our routers, remember we have multiple routers, one for each resource,  Now the goal of the router is to delegate the request to the correct handler function, which will be in one of the controllers. There will be one controller for each of resources to keep these different parts of the app nicely separated. Then depending on the incoming request, the controller might need to interact with one of the models, for example to retrieve a certain document from the database or to create a new one, And there is one model file for each resource. After getting the data from the model, the controller might then be ready to send back a response to the client, for example, containing that data. Now in case we want to actually render a website there is one more step involved. In this case, after getting the data from the model the controller will then select one of the view templates and inject the data into it. That render website will then be send back as the response. In the View layer in an express app there is usually one view template for each page. like a tour overview page, a tour detail page, or a login page. 
? More detail about the Model and Controller.
One of the big goal of MVC is to separate business logic from application logic. And What are these types of Logic actually?
- Application logic is all the code that is only concerned about the application's implementation and not the underlying business problem that we're actually trying to solve with tha application, like showing and selling tours, managing stock in supermarket, or organizing a library. Application logic makes the app actually work. A big part of app logic in express is about managing requests and responses. Application logic serves a bridge between model and view layer. 
- Business logic is all the code that actually solves the business problem that we set out to solve. Let's say that our goal is to show tours to customers and sell them. The code that is directly related to the business rules, to how the business works and the business needs, is business logic. examples: creating new tours, validating user inputs, checking user's password.
- The Application login and Business logic are almost impossible to completely separate, But we should do our best efforts to keep the application logic in our controllers and business logic in our models.

And there is this Philosophy of 'Fat Models/Thin Controllers': which says we should offload  as much logic as possible into the models to keep the controllers as simple and lean as possible. 

*/

// * lecture 087
// * Refactoring for MVC. 

// * Following Codes are deleted:

// ! Now longer depend on json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
); 
// No need of importing from the file.


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

// !These codes are completely deleted.




// ? deleted from create tour
// console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId, ratingsAverage: 5.0 }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
     
    },
  );


// ? No need of Check id function. Because from now on we're gonna start working with the IDs that are coming from MongoDB, and Mongo itself will give us an error if we use an invalid id. 
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

/*
* lecture 088
* Another Way of Creating Documents

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
* lecture 089
* Reading Documents

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
* lecture 090
* Updating Documents

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

! CHECK MONGOOSE DOC https://mongoosejs.com/docs/api/model.html
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
* lecture 091
* Deleting Documents



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
* lecture 092
* Modelling the Tours

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
* lecture 093
* Importing Development Data

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
* lecture 094
* Making the API Better_Filtering

Now we'll implement couple of common API features that make an API easier and more pleasant to use for users.
* In this lecture we'll start form Filtering
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
* lecture 095
* Making the API Better_Advanced Filtering

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
* lecture 096
* Making the API better_ SORTING

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
* lecture 097
* Making the API Better_ LIMITING FIELDS

Next feature in our API, we have field limiting, so basically, in order to allow clients to choose which fields they want to get back inn the response. So, for a client, it's always ideal to receive as little data as possible, in order to reduce the bandwidth that is consumed with each request. And that's of course especially true, when we have really data-heavy data sets. It's very nice feature to allow the API users to only request some of the fields. 
We specify limits like this in url: 
tours?fields=name,duration,difficulty,price 
We only want name,duration,difficulty,price
Just like in sort mongoose, actually request a string with the field name separated by spaces. Mongoose'll accept a string like this:  query = query.select('name duration price'). 
This operation, selecting a certain field names is called projecting. 
Here we also want default in case user does not specify the fields, In that case we'll just remove something. Down in getAll we always have __v field set to zero, Mongodb just created these fields because it uses them internally. We could disable them, but that's not a good practice because mongoose actually uses them, But we can do is to never send them to the client, so we exclude them. 
We just prefix __v with minus in select method. like this:
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
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
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
* lecture 098
* Making the API Better_ PAGINATION

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
const page = req.query.page * 1 || 1; first we've converted page string to number and then set the default value to 1. 
The formula we get for skip is: 
const skip = (page -1) * limit;

const page = req.query.page * 1 || 1;
const limit = req.query.limit * 1 || 100;
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
* lecture 099
* Making our API Better_ Aliasing

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
* lecture 100
* Refactoring API Features

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
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

const features = new APIFeatures(Tour.find(), req.query);

/*
* lecture 101
* Aggregation Pipeline_Matching and Grouping

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
! Remember we should pass the field name with dollar sign in _id like this: _id: '$difficulty',

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
* lecture 102
* Aggregation Pipeline_ Unwinding and Projection

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

! https://www.mongodb.com/docs/manual/reference/operator/aggregation/month/ VISIT THIS MONGODB DOCS, TO READ MORE ABOUT OPERATORS.

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
}, WE want month field as well with the value of _id, because here the value of _id is actual number of month.
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

- NEXT UP, Let's get rid of _id field. as we copied it's value to month's field. so need of _id more. For that we use $project stage. We simply give each of the field names a zero or a one. If we give any field zero then that one no longer shows up. If we put one then it would show up. 
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
* lecture 103
* Virtual Properties

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
* lecture 104
* Document Middleware

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
* lecture 105
* Query Middleware
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
* lecture 106
* Aggregation Middleware

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
* lecture 107
* Data Validation Built-In-Validators

Mongoose offers us very powerful ways of validating data that's coming into our model. In this video we gonna learn all about data validation with mongoose.  
? What exactly does validation actually mean? 
Validation is basically checking, if the entered values are in the right format for each field in our document schema, and also that values have been actually been entered for all of the required fields. Now on the other hand, we also have sanitization, which is to ensure that the inputted data is basically clean, so that is no malicious code being injected into our database or into the application itself. So, in that step we remove unwanted characters, or code from the input data. And this is actually a crucial step, like a golden standard in back-end development. To never ever accept input data coming from a user as it is. So we always need to sanitize that incoming data. But anyway, we'll leave data sanitization for the security section of the course, So, in this lecture we can focus entirely on the data validation. And we are doing this validation right on the model, it's because of the fat model and this controller philosophy, which makes the model the perfect place to perform validation. 
In fact, Mongoose already comes with a bunch of validation tools out of the box. We already did some validation, like required, that is built in validator. unique is not really a validator. 

* maxlength and minlength:
max and min length are specific to the string datatype. It an input string is longer than maxlength then it produce an error. We specify an array and then set the value, and then we add an error as a second array element. 
? - What about in updating an existing one? is it works on updating. 
- Yes, we get the same error, Now this only works because of the setting that we set way back, when we implemented this updating handler. there we set a an option {runValidators: true}, and if we set that to false then mongoose will accept this name without any error, even if the length not validate the maxlenght or minlength. 

* min and max
- We know that the rating must be between one and five, So very similar to the min and max length, on numbers we simply have min and max 
min and max are not only for numbers but it also gonna works with dates. 

* enum:
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
* lecture 108
* Data Validating_ Custom Validators

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
Validator: A library of string validators and sanitizers. link:https://github.com/validatorjs/validator.js
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

/*
#0f0
/*
? --------------------------- ?
! --------------------------- !
* --------------------------- *
! NEXT SECTION #09
* ERROR HANDLING WITH EXPRESS
*/

/*
* lecture 110
* Debugging Node.js with ndb

We gonna learn about debugging Node.js because there will always be some bugs in  our code no matter, how careful we are. And so it's good to have a tool to help us with debugging our code. This is not really about error handling with express, but we will use a debugging tool, which we might then use throughout the rest of the course. 
- There are different ways of debugging Node.js code. For example we could use VS code for that, btu actually Google very recently released an amazing tool which we can use to debug, which is called NDB. NDB stands for Node Debugger, It's a just an npm package.  Let's install NDB. We'll install as a global package
! npm i ndb --global
Let's add a new script in package.json file:
ndb and then our entry point.
! "debug": "ndb server.js"
In order to this work we actually need to finish this process(npm run start:dev), because it gonna start the server as well and so it will then try to do it on the same port, that of course not gonna work. 
npm run debug, This command will open new chrome window. It's called headless chrome, but it's not a real chrome. Downloading Chromium
In that window we have our complete file system, we also have access to our scripts which we can run from there, we also has a console, and we also has a performance and memory tabs. 
- And we also edit our files from that debugger. 

- The fundamental aspect of debugging is to set break points. So, break points are basically points in our code that we can define in the debugger, where our code will then stop running and we can the take a look at all our variables. that then will be extremely useful to find some bugs. 
now by right clicking in ndb run the script and then all the codes that's above the break point will executed. and we can see variables, it's values.

*/
/*
* lecture 111
* Handling Unhandled Routes

- let's write a handler function for undefined routes. Basically for routes that we didn't assign any handler yet. like 127.0.0.1:3000/api/tours without v1. 
In this case we would get html result, so express automatically sends html code along with a 404 error code. 
- Now there is another situation which is if after tours/ we specify something else. like 127.0.0.1:3000/api/v1/tours/myName
Now we get another error saying, 'Cast to ObjectId failed...', that's because we actually have a route that accepts an id parameter after thr tour/, and So mongodb is basically trying to find a document with myName id, but cannot convert in to a valid mongodb object id. 

Now here we are basically creating a handler function for all the routes that are not cached by our routers. let's open app.js file, that's basically the definition of Express application. 

? How are we gonna implement a route handler for a route that was not catched by any of other route handlers?
So to do that remember that all the middleware functions are executed in the order they are in the code. And so the idea is that if we have a request that passed all the routers, then it means any router were not able to catch it. So, f we add a middleware after all routers, it'll only be reached if not handled by any of other routers. 
We want all the methods(get, put...) in one handler, for that in express we can use app.all(), that then gonna run for all the verbs/http methods. app.all()
Next up we specify the url, since here we want to handle all the url's that were not handled before, we can use the star* here, which stands for everything. app.all('*', )
then the rest is just a regular middleware function.
req.originalUrl is a property that is available on the request , that is the url thats requested. 

*/

// ADD AFTER ALL ROUTERS
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`
  })

})
// YEAH, IT'S WORKING. WHY DID THIS WORK?? The idea is that if we are able to reach the bottom of the middleware stack, it means that the request-response cycle was not yet finished at this point. Because remember that middleware is added to the middleware stack in the order that it's define here in our code. 

/*
* lecture 112
* An overview of Error Handling

Up until this point we haven't really handled errors in a good way or in a central place in our application. We simply send back an error message as json in each route handler in case something went wrong. So, that's basically what we're gonna fix in this section. 
Two types of errors that can occur. Operational Errors And Programming Errors. 
Operational errors are problems that we can predict will inevitably happen at some point in the future. So we just need to handle them in advance. They have nothing to do with bugs in our code. Instead they depend on the user, or the system, or the network. like user accessing an invalid route, inputting invalid data, or an application failing to connect to the database, all these are operational errors that we need to handle in order.  
Programming errors are simply bugs that we introduce into our code. for example trying to read properties from an undefined variable, using await without async, accidentally using request.query instead of request.body, or many other errors.... They are really inevitable, and also more difficult to find and to handle. 
When we talking about error handling in express we mainly just mean operational errors. Because these are the ones that are easy to catch and to handle with our express application. And express actually comes with error handling out of the box. So all we have to do is to write a global express handling middleware which will then catch errors coming from all over the application. So no matter if it's an error coming from a route handler, or a model validator...., The goal is that all these errors end up in one central error handling middleware. So that we can send a nice response back to the client letting them know what happened. 
So, in this case handling means sending a response letting the user know what happened. But handling can also mean, in other cases, retrying the operation or crashing the server, or just ignoring the error altogether.
The beauty of having a global error handling middleware is that it allows for a nice separation of concerns. We don't have to worry about error handling right in our business logic or our controllers. ro really anywhere in our application. We can send the errors down to the error handler. 

*/

/*
* lecture 113
* Implementing a Global Error Handling Middleware
let's implement the global error  handling middleware. The goal is to write a middleware function, which gonna be able to handle operational errors. IN APP.JS FILE
- To define an error handling middleware all we need to do is to give the middleware function four arguments and Express will then automatically recognize it as an error handling middleware, So, therefor only call it when there is an error. 

? TWO STEPS:
FIRST: We create a middleware
SECOND: Create an error. 

- Just like in many other cases, this middleware is an error first function, which means that the first argument is the error.
! By specifying four parameters, express automatically knows that this function is an error handling middleware. 
- For now let's keep it really simple here. all we want to do in order to handle this error is to send back a response to the client.
Now we don't really not what status code it is. right? So, we actually want to read that status code from the error object. On error object we will assign status code in second step we'll define the status code on the error. Here we define a default status code, because there may be errors without status code, it means errors that are not created by us. 500 means internal server error, that's usually a standard that we use. In the same way we also define the status. if 500 then it's 'error' and if it's 400 then it's a 'fail' status.

SECOND STEP: (we create an error)
let's do that in a function, which handle all the unhandled routes, in app.js file
- We use the built in error constructor in order to create an error. And now we can pass a string and that string will then be the error message property {err.message} 

- Here we call the next() function from the error handler middleware in a special way. Because now we need to actually pass that error into next. So, if the next function receives an argument, no matter what it is, express know that there was an error, so it will assume that whatever we pass into next is gonna be an error. And that applies to every next function in every middleware anywhere in our application.
? So, again, Whenever we pass anything into next, it will assume that it is an error, and it will then skip all the other middlewares in the middleware stack and send the error that we passed in to our global error handling middleware. 

! So always remember, if we put any argument in next() then it will jump to the error handling middleware.
*/
// FIRST STEP
// CREATING ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  })
})
// SECOND STEP
// CREATING AN ERROR 
app.all('*', (req, res, next)=> {
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.status= 'fail',
  err.statusCoe = '404';

  next(err);
})

/*
* lecture 114
* Better Errors and Refactoring
let's now create a better and more useful error class, and also do some refactoring.
let's create a new file in our utilities folder, named as appError.js, because that's gonna be name of the class. 
We actually want all of our appError objects to then inherit from the built-in error, so we use extends the built-in error class.
! AppError will inherits from the built-in Error class.

we pass into a new object created from the AppError class is gonna be the message and the statusCode. 
? REMEMBER THE CONSTRUCTOR METHOD IS CALLED EACH TIME, WE CREATED A NEW OBJECT OUT OF THIS CLASS. AS USUAL, WHEN WE EXTEND A PARENT CLASS, WE CALL SUPER IN ORDER TO CALL THE PARENT CONSTRUCTOR.

We'll pass a message in to super(), because the message is the only parameter that the built-in error accepts.
As status depends on statusCode, So, when the statusCode is 400 then the status will be 'fail', and if it;s a 500, then it's an 'error'.
To test the statusCode we use startWith method, that we can call on strings. for that, convert the statusCode to a string.

All the errors that we will create using this class will be operational errors. 
this.isOperational = true; we set all errors that created by using this class to true. We can later test for this property, and only sends error message back to client for these operational errors that we created using this class.
We also need to capture the stack trace. What's mean by stack trace? In error middleware function err.stack will show, where the error happened.
Error.captureStackTrace(this, this.constructor) by this way when a new object is created and a constructor function is called then that function call is not gonna appear in the stack trace, and will not pollute it. 

? Why didn't set this.message = message in constructor?
That's because right here we called the parent class, and the parent class is Error and whatever we pass into it is gonna be the message property. So, basically in super(), by calling parent we already set the message property to our incoming message.
- Export this AppError class 
*/

class AppError extends Error {
  constructor(message, statusCode){
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor)
  }
}
/*
In app.js file we import AppError class. 
in next function we'll create an error 

*/
const AppError = require('./utils/appError');

app.all('*', (req, res, next)=> {

  next(new AppError(`Can't find ${req.originalUrl} on this server`));
})

/*
Finally we also want to export error middleware. because we're gonna build a couple of different functions for handling with different types of errors, so we want all of that functions to be all in the same file. We can say all of these function are handlers, we also call then controllers. let's now create an error controller file in controller folder.  new file with errorController , export it and import in app.js file. 
*/

/*
* lecture 115
* Catching Errors in Async Functions
In this lecture, let's implement a better way of catching errors in all our async functions. Right now in all our async functions we have try/catch blocks, that's how we usually catch errors inside of an sync functions. that really makes our code look messy and unfocused, Also we have lots of duplicates here. Let's try to fix that.

The solution is to basically take the try/catch block out of here and put it on a higher level in another function. Basically we create a function and then wrap this async function into that function. we made a function catchAsync - because it will catch our asynchronous errors.
Into this catchAsync function we will pass a function. 
As fn function is async function so it return promise, and when there is an error inside of an async function that basically means that the promise get rejected. So as we call the fn function, then we can catch that error here, instead of catching it in try-catch block. so catch, and error, and then next and pass the error

There are actually two big problems with the way implemented right now and so this way, it wouldn't really work at all. Because this function catchAsync has no way of knowing request, response, and next. We did not pass them into catchAsync here.   And Second is that right here (in exports.createTour=...) We are actually calling the async function using the parenthesis and passing the whole function.  Then inside of catchAsync we are also  calling fn function. 
So, createTour should really be a function but not the result of calling a function. But that's right now what's happening. 
The solution to that is to basically make catchAsync function return another function which is then gonna be assigned to createTour and so that function can then later be called when necessary.
catchAsync will return an anonymous function,  and so remember that this is the function that express is then gonna call, so here is where we they specify request, response, and next. 

summary: 
- fist we simply wrapped our asynchronous function inside of the catchAsync function that we just created. Then this function will then return a new anonymous function, which will then be assigned to createTour. And so basically it is returning function that get called as soon as a new tour should be created using the createTour handler. then the anonymous function that we passed in initially(fn) and it will then execute all the code that is in there. Now since it's(fn calling function) is async function, it'll return a promise and therefor in case there is an error in this promise or in other words in case it gets rejected we can then catch the error that happened using the catch method that is available on all promise. And in the end, it is catch method which will pass the error into the next function, which will then make it so that our error ends up in our global error handling middleware. 
Now if we create a new tour and some error happens, then that error should be catched here in catch function, and then will propagated to our error handling middleware and so that one will then send back the error response that we're expected to receive. 

creating just another file in utils folder, named as  catchAsync.js, then import in tourController file. 

Now get rid of all of catch blocks, and wrap all the handlers into the catchAsync 


*/

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);

  }
}

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  })
});

/*
* lecture 116
* Adding 404 Not Found Errors

lets now mak some more us of our AppError class by adding a couple of 404 errors and some of our tour handler functions.    
if we put any string at the place of id in this: 127.0.0.1:3000/api/v1/tours/dddddd, then it will give an error, BUT if we put something like id, but that doc is not in our data database, like this: 127.0.0.1:3000/api/v1/tours/653795940e35664ec82f0ab1, then it's giving success with tour: null. That's not really what we want, We want here is to show a 404 status code, Let's now use our AppError class in order to implement that. Keep in mind that we get back null as a response. 
Go to the getTour handler and check: if (!tour){

} , then should create an error, because if there's no tour it will be null. and null is falsy value.  If no tour then we create a next(new return AppError('No tour found with that ID', 400)) with an error, in order to jump to error handler. 
same for updateTour. If we try to update that not exist, then it will give us the exact same error. Same for deleteTour

*/
// in getTour handler. 
if (!tour) {
  return next(new AppError('No tour found with that ID', 400));
}

/*
* lecture 117
* Errors During Development VS Production
In this video we're gonna implement some logic in order to send different error messages for the development and production environment. Right now, we're sending this same err response message to everyone, no matter if we're in development or in production. But the idea is that in production, we want to leak as little information about our errors to the client as possible. In that cas we only want to send a nice human friendly message, so that the user knows what's wrong. But on the other hand, in development we want to get as much information about the error that occurred as possible. and we want that right in the error message that's coming back. So we could log that information also to the console but, it's way more useful to have information right in postman, 
In errorController.js file

- build functions for both development error log and production.

? lets now take it to the next level and talk about operational errors. 
open appError.js file. 
let remember that that we mark all the errors that we create, using appError is operational set to true. So all the errors that we create ourselves will basically be operational error. And in fact, for only operational error we want to send error message. On the other hand, a programming error or some other unknown error that comes for examples from a third party package, we don't want to send any error message about that. let's now use this.isOperational = true, in our errorController.js file.  aagy wala nyche

*/
if(process.env.NODE_ENV === 'development'){
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
} else if(process.env.NODE_ENV === 'production') {

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

}

// ? Functions for both dev and prod..

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted errors: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details.
  } else {
    // 1) Log error
    console.error('ERROR!!!!', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

/*
There are real logging libraries on npm that we could use here instead of just having this simple console.error, but jus logging the error to the console will make it visible in the log. 

- In order for this to work, there is something really, really important that we need to do. There are errors like errors coming from MongoDB, which we do not mark as operational, so in those case they would simply be handled using generic error. for example a validation error, right now they are coming from mongoose, not from our own app. Right now they are not marked as operational error but we need to mark them as operational. 

*/

/*
* lecture 118
* Handling Invalid Database IDs

There are three types of errors that might be created by mongoose in which we need to mark as operational errors so that we can send back meaningful error messages to clients in production.

Let's now start by simulating these three errors. 
1- The first one is when we try an invalid id -simply something like this kjfkal, Mongoose will not be able to convert this to mongodb id. This is a perfect example of an operational error. So we need to send back a meaningful response in order to handle this error. The here is to basically mark this error as operational and create a nice and meaningful message. 
2- If any a duplicate value posted for a unique field. This is validation error
3- It's also kind of validation. lets say we want to update a rating to 6, which is invalid, because we set the max of ratingAvg could be five. 
These are the three errors we're gonna mark as operational error, starting with first one. 
? To id, if we assign unreadable id then mongoose giving 'CastError' like this: 
"name": "CastError",
"message": "Cast to ObjectId failed for value \"lkdjfklasjlkf\" (type string) at path \"_id\" for model \"Tour\""

! implementation in errorController file. and we want this in production. in development we don't care. 
- if err.name is equal to 'CastError', then we call handleCastErrorDB() function, which we'll create, and we gonna pass the error that mongoose created into this function, and this will then return a new error created out of AppError class. And that error will then be marked as operational, because remember, all our AppErrors have the is operational property set to true.  So, save this returning error in err, It's not a good practice to override the arguments of a function. So instead of doing that we'll create a hard copy of that error object.




*/

else if(process.env.NODE_ENV ==='production'){
  let error = {...err};
  
  if (error.name === 'CastError') {
    error = handleCastErrorDB(error)
  }
}
/*
let's now create this function[handleCastErrorDB()], 

? This is error object, that mongoose's giving us:
"error": {
  "stringValue": "\"lkdjfklasjlkf\"",
  "valueType": "string",
  "kind": "ObjectId",
  "value": "lkdjfklasjlkf",
  "path": "_id",
  "reason": {},
  "name": "CastError",
  "message": "Cast to ObjectId failed for value \"lkdjfklasjlkf\" (type string) at path \"_id\" for model \"Tour\""
},

In error object we've the path and value property, so here the path is basically the name of the field, for which the input data is in the wrong format, And the value is incorrect inputted value. This might not only happen for the id, but really, for any field that we query for with a value in the wrong format. Let's now basically create a string that says that we have an invalid id, with the value of inputted value. 
400 for bad request.
*/
const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
}

/*
* lecture 119
* Handling Duplicate Fields

let's now handle the errors that occurs when we try to create duplicate fields for fields that are supposed to be unique. 
this error doesn't have a name property. that's because it's not an error that's caused by a mongoose. But instead really by the underlying mongoDB driver. What we gonna do to identify this error is to use "code": 11000 field. 
To show the user inputted name, we'll extract the name from "errmsg" property. "errmsg": "E11000 duplicate key error: natours.tours name_1 dup key: {:\'The Forest Hiker'}",
From this we extract The Forest Hiker. For that we use Regular Expression. 
SEARCH GOOGLE: 'regular expression match text between quotes'.

console.log(value); yeah it works, it's an array with string, so we take [0]

*/

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  // console.log(value);
  const message = `Duplicate  field value: ${value}. Please use another value!`;
  return new AppError(message, 400)
};

/*
* lecture 120
* Handling Mongoose Validation Errors
Finally let's handle Mongoose's validation errors. 
- here as an error message we have a nice string, which we defined in schema. So, now we'll extract these messages from here and put them all into one string. 
- Now in order to create on big string out of all the strings from all the errors, we basically have to loop over all of these objects, and then extract all the error message into a new array.  the object that has all the errors is 'errors' object. 
*/

if(error.name === 'validation') error= handleValidationErrorDB(error);

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
}

/*
* lecture 121
* Errors Outside Express_ Unhandled Rejections

let's talk about something that we have in node.js called unhandled rejections, and then learn how we can actually handle them. At this point we've successfully handled errors, in our express application by passing operational asynchronous errors down into a global error handling middleware. This then sends relevant error messages back to the client depending on the type of error that occurred, However there might also occur errors outside of express and a good example for that in our current application is the mongodb database connection. So imagine that the database is down for some reason or for some reason, we cannot log in. In that case there are errors that we have to handle as well. But they didn't occur inside of our express application, so of course our error handler that we implemented will not catch this error. like if we change the password of our database from environment variables.

In this simple example all we have to do is come here to the piece of code where our DB connection is done (in server file) and then add a catch handler there. 
*/

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections);

    console.log('DB connection Successful');
  }).catch(err => console.log('Error'));

/*
This would work, of course, but I really want to show how to globally handle unhandled rejected promises, because in a bigger application, it can become a bit more difficult to always keep track of all the promises that might become rejected at some point. Let's now learn how to handle unhandled rejections. right in the server.js file. 
Each time that there is an unhandled rejection somewhere in our application, the process object will emit an object called unhandled rejection and so we can subscribe to that event just like this: CODE ⬇
here on unhandledRejection event, this callback will call. 
If there is any problem with DB connection, like we have here in this example, then our application is not gonna work at all. So here we will shut down our application. We use process.exit(). 
process.exit(), In here we pass a code, The code zero stands for a success, and one stands for uncaught exception, so we usually use 1 here. 

*/
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥💥 Shutting down.');
  process.exit(1);
})

/*
There is one problem we implemented right now. That the process.exit() is very abrupt/sudden way of ending the program because this will just immediately abort all the requests that are currently still running or pending and so that might not a good idea. And so usually we shutdown gracefully where we first close the server and only then we shutdown the app. To do that we need to save the server to a variable server. and on that server we can then say server.close() which will close the server, and it will run callback function that we passed into it. and then only in that function we shutdown the application.

*/
server = app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥💥 Shutting down.');
  server.close(()=>{
    process.exit(1);
  })
})

/*
* lecture 122
* Catching Uncaught Exceptions

lets learn how to catch uncaught exceptions. 
? What exactly are uncaught exceptions?
All errors or all bugs that occur in our synchronous code but are not handled anywhere are called uncaught exceptions. And like before: just like unhandled rejections we also have the way to handling uncaught exceptions. 
Example: just log some variable that doesn't exist console.log(x);
We will handle when occur any uncaughtException event.

*/

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥💥 Shutting down.');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// ! In unhandled rejection, crashing the application is optional, but in uncaught exception we really really need to crush our app.
/*
In nodejs it's not really a good practice to just blindly rely on these two error handlers that we just implemented here. So ideally errors should really be handled right where they occur. 

this uncaughtException handler should be at very top of our code, before any other code is really executed.  if any error came before this handler then it will not catch that exception. 

*/

/*
#0f0
/*
? --------------------------- ?
! --------------------------- !
* --------------------------- *
! NEXT SECTION #09
* ERROR HANDLING WITH EXPRESS
*/

/*
* lecture 146
* Modelling Users
Authentication and Authorization is all about users signing up, logging in, and accessing pages or routes, that we grant them permission to do so, So, It's really really all about the users. And, so we need to start by implementing the user model in this lecture, so that in the next one we can then create new users in our database. 
let's create a new file for the user model(userModel.js) in models folder. 
After requiring mongoose, all we need to do is to create a schema and then a model out of it. 

? Small Challenge:
Create a schema with five fields name, email, photo, password, passwordConfirm


In email we want to validate the email address, so basically testing if the provided email is valid for common email format. For that we need to create our own validator. But here we use validator package 

? why type of photo is string? 
If user's wants to upload a photo then that will be stored somewhere in our file system and the path to that photo will then be stored into this photo field.

*/
// ! userModel.js file
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String, 
  password: {
    types: String,
    required: [true, 'please provide a password'],
    minlength: 8,
  },
  passwordConfirm: {
    types: String,
    required: [true, 'please provide a password'],
  },
  
});

const User = mongoose.model('User', userSchema);

module.exports = User;

/*
* lecture 125
* Creating New Users
let's now create those new users, based on the model that we just implemented in the last video. So, we'll do most of the user-related stuff like creating new users, logging users in, or updating passwords in the authentication controller. So all of these stuff that's related to authentication is not gonna be in the user controller, that we actually created before but instead we will create an authentication controller. 
? We built authController.js file, all the function that are related to authentication will go here. 

- The first thing we need to do in authController.js file is to import our User model. 
- Then lest's create and export our very first controller(signup). Instead of making createUser like we did in tour controller, we'll call signup because that's name that has a bit more meaning in the context of authentication. 
for create a new user, Remember how we create a new tour document based on tour model. WE USED OUR MODEL AND THEN MONGOOSE METHOD ON THAT,LIKE User.create(), AND PASS AN OBJECT WITH THE DATA by which user should be created. JUST LIKE BEFORE THAT DATA SHOULD BE IN REQ.BODY. 
In the next step we send that newUser to the client. 
This entire function(signup) is an async function, so we need to catch the error, so for that we wrap this entire function into the catchAsync function. We don't have to write try/catch block in every function. 
- Now we need to implement the route so that the signup handler can get called.  Let's go to our userRoutes. The user resource is bit different from all the other resources, because it really has to do with all things authentication. And so we have a different controller for that, so the authController, the function names also have some different names and so we will actually also have a special routes. 
As we see this sign up is a special endpoint. For signup we only need POST http method, we cannot get data from signup or we cannot patch a signup. 

There is also possibility of a system administrator to updating or deleting or getting all the users based on their ID. but we will take care of that late. For now we just want to implement all the functions that are about authentication. So basically functions that are only relevant for the user itself. 
*/
// !authController file
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.signup= catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    }
  })
});

// !in userRoutes file
const authController = require('./../controllers/authController')
router.post('/signup', authController.signup);

/*
* lecture 126
* Managing Passwords

In this lecture we're gonna manage our users passwords in the database. Fist validate if the inputted password is equal to the confirmed password and then also to encrypt the password in the database in order to secure it against attacks. 
Fist thing we gonna do is to validate if the two inputted passwords are the same. And the best place to do that is in the confirm password in userModel.js. And so let's write our custom validator for that. 
In validate we will create a function and error message. A validator will gonna be a function, which is then gonna be called when the new document is created. In this we'll not use arrow function, b/c we will use this keyword. Remember in a validator function we return either true or false. If the return value is false then it means we're gonna get a validation error, Here we'll check current element with inputted password. If it gives false then will validation error, BUT WE NEED TO KEEP IN MIND THAT THIS IS GONNA WORK ON SAVE AND CREATE ONLY. For this reason whenever we want to update the user we'll always have to use save as well and not use findOne and updateOne etc, like we did with our tours. Only work when we create a new object, [.create()] or on save [.save()]
*/

passwordConfirm: {
  type: String,
  required: [true, 'Please confirm your password'],
  validate: {
    validator: function(el){
      return el === this.password;
    },
    message: 'Passwords are not the same!',
  }
}
/*

But now, the next step is to actually encrypt these plain passwords that we are storing in our database. When we are working with authentication, one of the most fundamental principles is to never ever store plain passwords in a database, that's something that's absolutely not acceptable, so we should always encrypt user's passwords. Imagine due to a some reason a hacker gets access to the database, if then the passwords are stored in plain text in there, then he can simply login as any user and do whatever he really wants... Lets not go ahead and implement this. The model is the best place to do this kind of functionality. because it really has to do with the data itself so it should me on the model not in the controller. So again keep the fat models, thin controllers philosophy in mind. 

? How we gonna now implement this encryption? 
Well, this is another perfect use case for using Mongoose middleware. And the one that we're gonna use is a pre-save middleware, basically document middleware. REMEMBER! We defined that on the schema. And in this we want to set a pre-hook, so a pre-middleware on save. The reason to doing like this is that the middleware function that we're gonna specify here, so the encryption, is then gonna be happened between the moment that we receive that data and the moment where it's actually persisted to the database. So that's where the pre-save middleware runs. Between getting the data and saving it to the database. And so that's the perfect time to manipulate the data. 

- Now we actually only want to encrypt the password if the password field has actually been updated. So basically only when really the password is changed or also when it's created new. Because imagine the user is only updating the email. Then in that case we do not want to encrypt the password again. So we use if statement. Here in if statement, the "this" keyword refers to the current document, in this case the current user and then is modified. - we have a method on all documents which we can use if a certain field has been modified. In that method(isModified) we need to pass the name of the field. Here we want to say that if the password has not been modified, then return from the function, and call the next() function. 

Now it's finally time to actually encrypt or we can say to hash the password. We'll see the term 'hash' or 'hashing' all the time and so that basically means encryption as well. 
? Now we are gonna do this encryption, or hashing using a very well-known and well-studied and very popular hashing algorithm called bcrypt. 
This algorithm will first salt then hash our password in order to make it really strong to protect it against bruteforce attacks. And so that's the whole reason why encryption needs to be really strong. 
Salt means that it's gonna add a random string to the password so that two equal passwords do not generate the same hash. 
let's no go ahead and use the bcryptjs package. 
! npm i bcryptjs
Import this in userModel.js

in hash method with current password we need to specify a cost parameter. And we could actually do this in two ways. So the First way will to be manually generating the salt, so the random string basically, that is gonna be added to our password and then use that salt here in this hash function. but instead, to make it a bit easier we can also simply pass a cost parameter into this hash function. And so that is basically a measure of how CPU intensive this operation will be, And default value here is 10, but right now it's a bit better actually to use 12. because computers have become more and more powerful. 
Here this hash is basically asynchronous version, but there is also is a synchronous version. we want to use async version. So, this hash will then return a promise and that promise we need to await. 
With this we encrypt our password and now in the end, what we need to do is to basically delete the confirm password, because at this point in time we only the real password hashed. To delete any field we set to undefined. 
? We required the confirm password but here we want to delete? how it's possible?
because we actually set password confirm, that simply means that it's a required input, not that it's required to actually be persisted to the database. 

Let's test!! And indeed, we get very weird looking password which indeed is the encrypted version of pass12345, And also we see passwordConfirm is no longer here. 

? We created two documents with same password, but encrypted passwords are very different. this is a power of salting the password. 
*/
const bcrypt = require('bcryptjs');
userSchema.pre('save', async function(next){

  // Only run this function if password has changed
  if(!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined; 
  next();
})

/*
* lecture 127
* How Authentication with JWT Works

Nest up, we're gonna implement user authentication and authorization. So in simple terms, the whole work flow of logging users in and allowing them to interact with certain protected resources that not-logged in users cannot access. 
Now there are many authentication methods out there, but the one we're gonna use is a very modern, simple and secure approach called Json Web Tokens or JWT in short. 
So, Json Web Tokens are a stateless solution for authentication. So there is no need to store any session state on the server which of course is perfect for restful APIs like the one we're building. 
? And the most widely used alternative to authentication with JWT is to just store the user's log-in state on the server using sessions. But that of course does not follows the principle that says that restful APIs should be stateless and that's way we're opting for a solution like JWTs. 

Let's now take a look at how authentication actually works with Json Web Tokens. And assuming we already have a registered user in our database, this is how a user logs into the app. So the user's client starts by making a post request with the username and email and the password. The application then can checks if the user exists and if the password is correct. And if so, a unique Json Web Token for only that user is created using a secret string that is stored on a server. And a JWT itself is really just a string that looks something like this. look slide. [But we're gonna talk more about the JWT itself in the next slide]. Anyway, the server then sends that JWT back to the client which will store it either in a cookie or in local storage. And just like this the user is authenticated and basically logged into our application without leaving any state on the server. So the server does in fact not know which users are actually logged in. But of course, the user knows that he's logged in because he has a valid Json Web Token which is a bit like a passport to access protected parts of the application. 
A user is logged in as soon as he get back his unique valid Json Web Token which is not saved anywhere on the server. And so this process is therefore completely stateless. Then each time a user wants to access a protected route like his user profile data, for example he sends his Json Web Token along with a request. So it's a bit like showing his passport to get access to that route. And that's probably the best and easiest way to understand this whole idea. 
Now once the request hits the server, our app will then verify if the Json Web Token is actually valid. So if the user is really who he says he is. And more about how this step works a bit later.
If the token is valid then the request data will be sent to the client and if not, then there will be an error telling the user that he's not allowed to access that resource. And as long as the user is logged in, this is how it's gonna work each time that he request data from any protected route. 
Now what's very important to note here that all this communication must happen over https. So secure encrypted http, in order to prevent that anyone can get access to password or Json Web Tokens. Only then we have a really secure system 

Let's now dive a little bit deeper into how the JWT itself actually works. 
A Json Web Token looks like eyjhbGci0iJIUzIiNiTsIiNighjh.j9.eyjpzci6ijv.., which was taken from the JWT debugger at jwt.io. 
So, essentially, it's an encoding string made up of three parts. The header, the payload and the signature. The header is just some metadata about the token itself, and the payload is the data that we can encode into the token, any data really that we want. These two parts are just plain text that will get encoded, but not encrypted. So anyone will be able to decode them and read them. So we cannot store any sensitive data in here. But that's not a problem at all because in the third part, so in the signature, is where things really get interesting. 
The signature is created using the header, the payload, and the secret that is saved on the server. And this whole process is then called signing the Json Web Token. So, the signing algorithm takes the header, the payload and the secret to create a unique signature. So only this data plus the secret can create this signature, Then together with the header and the payload, these signature forms the JWT, which then gets sent to the client. Once the server receives a JWT to grant access to a protected route, it needs to verify it, in order to determine if the user really is who claims to be. In other words, it will verify if no one changed the header and the payload data of the token. So this verification step will check if no third party actually altered either the header or the payload of the Json Web Token. 
How does this verification actually work?
It's actually quite straight forward so once the JWT is received, the verification will take it's header and payload and together with the secret that is still saved on the server, basically create a test signature. But the original signature that was generated when the JWT was first created is still in the token. And that's the key for this verification. Because now all we have to do is to compare the test signature with the original signature. And if the test signature is the same as the original signature, then it means that the payload and the header hae not been modified. Because if they had been modified, then the test signature would have to be different. Therefor in this case where there has been no alteration of the data, we can then authenticate the user.  And of course, if the two signatures are actually different, then it means that someone tampered with the data. Usually by trying to change the payload. But that third part y manipulating the payload does not access to the secret, so they cannot sign the JWT. So the original signature will never correspond to the manipulated data. And therefor the verification will always fail in this case. And that's the key to making this whole system work. It's the magic that makes JWT so simple also extremely powerful.

*/

/*
* lecture 128
* Signing up Users

Previously, we already implemented a simple signup functionality, but in this lecture, we'll actually also log in the user, making a more real signup process. So starting from this lecture, we'll really start to implement our authentication. 

! Before start One warning here!!!
Authentication is very hard to get right and many tutorials out of there that makes many serous mistakes and oversimplify things that should not be simplified.  Really worked hard to make this authentication section that we're gonna start implementing now as good as possible, because we need to be really really extra careful when writing this part of the application. remember our user's data is at stake here, and the trust in the company who runs the application is at stake as well, so implementing authentication, is a real responsibility where we should not make any mistakes at all. Now There are some libraries out there that can help us to implement authentication and authorization and the most well known one is called Passport, but even a library like that doesn't take all the work and all the responsibility away from us. In this case here we are actually gonna implement the whole login protecting and authorization logic all by ourselves, except Json Web Token implementation. 

We already have our signup function, right now all it does is to simply create a new user and then send it back to the client. There is a very serious security flaw in this way of signing up users, so basically the problem is that right now, we create a new user using all the data that is coming in with the body. So, the problem here is that, like this anyone can specify the role as an admin. 
? Basically everyone can now simply register as an admin into our app. We need to fix that. And fixing it, is quite simple. 
!const newUser = await User.create(req.body);
Instead of this line⬆ of code in signup function, we use this⬇:
const newUser = await User.create({
  name: req.body.name,
  email: req.body.email,
  password: req.body.password,
  passwordConfirm: req.body.passwordConfirm,
})
? What actually a difference here in both codes?
In new code we only allow the data that we actually need to be put into the new user, so just the name, email, and password. So now even if a user tries to manually input a role, we'll not store that into the new user and same for other stuff, like a photo. 
And if we need to add a new administrator to our system we can then very simply create a new user normally and then go into MongoDB compass and basically edit that role in there. Of course we could also define a special route for just creating admins. 

Usually we signup for any web application, then we also get automatically logged in. sto let's very quickly implement that here. logged the user in as soon as he signed up. ALL WE NEED TO DO IS TO SIGN JASON WEB TOKEN AND THEN SEND IT BACK TO THE USER. Lets now first of all install npm package that we're gonna use for everything related to json web token
! npm i jsonwebtoken 
lets see its documentation of jwt at github. 
the first function that we're gonna use with JWT here is jwt.sign() function, in order to create a new token, for that we need the payload, secretOrPrivateKey, and then some options. And we also us jwt.verify() to verify the user. 

import jwt in authController.js file. 
Then create our token in signup function. 
REMEMBER: IN jwt.sign() function the first parameter is payload, this is basically an object for all the data that we're going to store inside of the token, In this case we really only want the id of the user. jwt.sign({id: newUser._id}), this is the object/payload that we want to put in our jwt. 
NEXT UP  we need the secret in jwt.sign function, so basically a sting for our secret. Now we just putting a kind of placeholder, because actually our configuration file is a perfect place to store this kind of secret data, let's go ahead and add that in config.env file. 
JWT_SECRET=my-ultra-secure-and-ultra-long-long-secret 
Using the standard HSA 256 encryption for the signature, the secret should at least be 32 characters long, but the longer that better. So for the best encryption of the signature, we should at least use 32 characters. ALWAYS USE A UNIQUE SECRET FOR APPLICATIONS AND NEVER THE SAME. 
AT THIS POINT WE HAVE THE PAYLOAD AND WE HAVE THE SECRET, the token header will actually created automatically, NOW WE pass in some options, And the option we gonna pass in is when the jwt should expire, so this means that after the time that we're gonna pass in here, the json web token is no longer gonna be valid, even if it otherwise would be correctly verified. So, this is basically for logging out a user after a certain period of time. So let's actually define that expiration time also as a configuration variable in config.env file. 
JWT_EXPIRES_IN=90d  // the signing algorithm will automatically figure out this here d means days, 90days. we can also use 10h, 5m, 3s etc. also we can put any number which will then be treated as milliseconds. So after 90 days the jwt will no longer be valid, even if the signature is correct and everything is valid. THESE OPTIONS WE ALWAYS PASSED THEM IN AN OBJECT. 
So by this we just created the token, now all we need to do is to send it to the client. So we just put in the res.json({}) before the user. then that's actually it. That's really all we need to do to log in a new user, because right now we're not checking if any password is correct or if the user actually exists in the database because here in this case, the user was really just created. And so right away we logged the user into the application by sending a token, and the user should then in some ways store that token, just so we talked about before in previous lec. 
*/
const jwt = require('jsonwebtoken');
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // Creating Token
  const token = jwt.sign({id:newUser._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })


  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

// Yeah we just created very first json web token, which is looking like this:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NDE1NDJlMjBlMDgyNTFkMDJiMTI4ZSIsImlhdCI6MTY5ODc4MDIwOCwiZXhwIjoxNzA2NTU2MjA4fQ.LokTvV7EPIxszSW6ZsdvJMnoakg1O67Vw33O7A9kTA8

/*
? Now we want to see the JWT debugger, lets go ahead an copy the token form response(postman). and then go to gwt.io, and in down in Encoded past our token
We now able to log in only the user in signed up. because in that case, we do not need to verify the email in the database and also not the password.

*/

/*
* lecture 129
* Logging in Users

We're gonna implement the functionality of logging users in based on a given password and email address. And just like before, the concept of logging a user in basically means to sign a Json Web Token and send it back to the client. But in this case we only issue the token in case that the user actually exists and that the password is correct. let's start implement that.
- Fist we need to read email and password from the body.  

And the check process has a couple of steps: 
1) Check if email and password exist
if(!email || !password){
  return next(new AppError('Please provide email and password!', 400));
} 
Then we want to send an error message to the client? How we do that? We use here our appError. we simply create a new error. error handling middleware will then pick it up and send that error back to the client. First import that error from AppError class. We need to call next middleware. and here we pass in the error

To check we need implement the routes. Let's do that in the user router. 
router.post('/login', authController.login);
Again this is only valid for a post request, because of course we want to send in the login credentials in the body.

2) Check if the user exists && password is correct
Now check if there actually is a user for the email that was posted. Now we find by it's email. we filter by email. 
Here something important for security, The password in encrypted actually but still it not a good practice to leak the password data out to the client. If we had getAllUsers here, then all of them would have the password visible. To fix this go into the user schema and on the password field, add a property select: false, then it will never show up in any output.
? go to User's schema and add: select: false, to the password field. 
const user = User.findOne({ email }) - Now output of this also not contain the password, but we need a password to check, if the password is correct. So here we need to explicitly select the password here. Remember select will simply select a couple of fields from the database, only the ones that we needed. In this case, when we want the field, that is by default not selected, We need to use plus and then the name of the field. 
const user = User.findOne({email}).select('+password');
NOW ITS TIME TO COMPARE THE PASSWORD THAT IN THE DATABASE WITH THE ONE THAT USER JUST POSTED. 
? How we gonna do that, because the user inputted password is simple text, like this: Hello12334 but the one  that we'be in the document is encrypted(hashed) look like this: 23jdkfja93480983490jkajfkdjjadlfj
All we've to do is to again use the bcrypt package. We used bcrypt to generate this hashed password of inputted password, Remember encrypted there is no way of getting back to the original password. So, let's implement a function that's gonna do encrypt password. We'll do that in user model, because it's really related to the data itself. 
- So first time we gonna create an instance method. So, an instance method is basically a method that's gonna be available on all the documents of a certain collection. In instance methods the this keyword actually points to the current document. In this case, since we have the password set select: false, so this.password will not be available. so that's way we passed in userPassword as well in the function. So the goal of this function is to really only return true or false, so basically true if the passwords are the same, and false if not. 
We gonna use compare function, only need to candidatePassword and userPassword in it. 
Now we call this function in login function in authController. And remember the function that we defined is an instanced method. And so therefor it is available on all the user documents. Here user in right now a document. 
Remember the correctPassword is an async function so we need to await it. 
3) If everything is ok? send the token to client. 


Now creating a token is gonna be the exact same thing, in all functions, so instead of repeating, leta create a function. 

*/
const AppError = require('./../utils/appError');

exports.login = catchAsync(async(req, res, next) => {
  // const email = req.body.email;
  // const password = req.body.password; // Instead we use destructuring as both are email so..
  const {email, password} = req.body; // just like this we create this two variables.

// 1) Check if email and password exist
if(!email || !password){
  return next(new AppError('Please provide email and password!', 400));
}

// 2) Check if the user exists && password is correct
const user = await User.findOne({
  // email:email
  email
}).select('+password');
// const correct = await user.correctPassword(password, user.password); // either true or false
// 3) If everything is ok? send the token to client. 

if(!user || !await user.correctPassword(password, user.password)){
  return next(new AppError('Incorrect email or password', 401));
}

const token = '';
res.status(200).json({
  status: 'success',
  token
})

})

// In user mode. check for password // instance method
userSchema.methods.correctPassword = function(candidatePassword, userPassword){
  return bcrypt.compare(candidatePassword, userPassword);
}

/*
* lecture 130
* Protecting Tour Routes
So far in our authentication implementation we have logged users in with a correct password. So we completed this first step of the authentication workflow, where a json web token is created and send back to the client if the user provides a correct email and password.
So, now we'll implement protected routes. basically using the created json web token in order to give logged in users access to protected routes. And this is the second step of authentication. 

So let's say that we wanted to protect the getAllTours route. So basically only allowing logged in users to get access to a list of all our tours. It means before running the getAllTours handler, we would need to have some check in place in order to verify if the user is logged in or not? BEST WAY OF DOING THAT IS TO USE A MIDDLEWARE FUNCTION. 
- So, In order to protect routes we're gonna create a middleware function which is gonna run before each of these handlers. This middleware function will then either return an error, if the user is not authenticated, so it is not logged in, Or it will call the next middleware, which is in this case the getAllTours handler. That then effectively protect this route from unauthorized access.  Let's go ahead and quickly create that middleware function in our authController.js file.
build a function called protect. and call this protect function before getAllTours route handler:
router
  .get(authController.protect, tourController.getAllTours) 

Now let's start implementing protect middleware. 
STEPS TO IMPLEMENT THIS MIDDLEWARE:
1) Getting Token and check if it's there

2) Verification the token : the jwt algorithm verifies if the signature is valid or if it not? So there for if the token is valid or not? 

3) Check if user still Exist -The user who trying to access the route still exist. 

4) Check if user changed password after the jwt(token) was issued. 

? IF THERE IS NO PROBLEM IN ANY OF THESE STEPS, ONLY THEN CALL THE NEXT, WHICH WILL THEN GET ACCESS TO THE ROUTE THAT WE PROTECTED. 

LET'S NOW START IMPLEMENT
1) Getting Token and check if it's there: 
So a common practice to send a token using an http header with the request. Let's take a look to the http request headers.   console.log(req.headers); here we get an object with all of the headers that are part of the request. 
Now to send a json web token as a header, there is a standard for doing that. And so that standard for sending a token is that should always use a header called authorization and then the value of that header should always start with 'Bearer', Basically we bear/we have/ we posses this token. and then the value of the token. so, in key Authorization and as a value Bearer kjdkjfakljd, So, basically the string after the Bearer will be our value. 
So, if there is authorization in header and the value of authorization start with Bearer then we want to save the token. 
To get the last value after Bearer we first split the value with space. which will then create an array with Bearer and token, then from the array we take that second element of the array. 

Working. But it's not enough to just send a token with a request, it also need to be a valid token. So basically a token where no one try to change the payload. REMEMBER THE PAYLOAD IN THIS CASE IS ALWAYS THE USER _ID OF THE USER FOR WHICH THE TOKEN WAS ISSUED.

! --------------------------- !
* lecture 131
* Protecting Tour Routes -Part 2

2) Verification the token
So in the last lecture, we read the token from the authorization header and then checked if the token actually exists. And next up, we have the verification step for the token. In this step we verify if someone manipulated the data or also if the token has already expired. So, we already used from the json web token package, the sign function  and now we're gonna use the verify function. So, just like before, jwt.verify(token, process.env.JWT_SECRET ) , in verify function we pass the token, and then remember that this step also need the secret, in order to create the test signature. And as a third argument, this function actually requires a callback function. So this callback is then gonna run as soon as the verification has been completed. This jwt.verify is an asynchronous function. 
- Here we are actually going to promisifying this function, basically to make it return a promise. That way we can then use async/await just like any other function. To build that node actually has a builtin promisify function. In order to use that we've to require built-in utils module.
? const util = require('util');
From this util module we'll use promisify method. Since we only going to use this method. we can do it by destructure that object and take promisify method directly from there
? cons {promisify} = require('util');
Now we just call promisify and then pass the function in there. and await it and store the result into the variable, So that resolved value of the promise will actually be the decoded data, so the decoded payload from this json web token. 
const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
console.log(decoded); // Here we have decoded object, the user id, timestamp of creation date, and of the expiration date of the token. Now let's try to manipulate the payload of this token. Here we changed some character from token and then try to access getAllRoutes, then we get an error, the error name is Json Web Token, and in message we have an 'invalid signature'. 
So that is the one of the two errors that can occur, the other one is that the 'token has already expired'. invalid signature error is called json web token error, and actually let's go ahead and handle this error now. and the way we could do it to add a try-catch block. But instead of doing that we actually use our global-handling middleware in order to do that. Go ahead let implement in errorController.js file.  
if(error.name=== 'JsonWebTokenError') error = handleJWTError(error) .. Implemented in errorController.js file. 

Another another that may we can get is that the user tries to access tha application with an already expired token. name is 'TokenExpiredError'. and message is 'jwt expired'. ALSO SEE IN ERROR CONTROLLER.JS FILE

3) 3) Check if user still Exist
We could actually stop here now if we wanted. But this is not really secure enough just yet. for example what if the user has deleted in tht meantime? So the token will still exist, but if the user is no longer existent, then we actually don't want to log him in. Or even worse, what if the user has actually changed his password after the token has been issued? then that should also not work. there are king of stuff we're gonna implement in step#3&4.  
fist will check if the user still exist.   User.findById(decoded.id); Now we've the id in the payload, because we can now use that id and query the user using just that id. User.findById(decoded.id); this should then find the new user. and of course we need to await that and then store it into a variable. At this point we 100% correct, because if we reached this point, then the verification process that we have previously was successful, otherwise this would have caused an error which would then have prevented the function from continuing. So this verification process is in charge of verification if no one altered the id that's in the payload of this token. So we then 100% sure for which we have issued the jwt is exactly the one whose id is now inside of the decoded payload. so this one 

Finally step# 04) Check if user changed password after the jwt(token) was issued. 
To implement this test we will actually create another instance method. So basically a method that is going to be available on all the documents. So documents are instances of a model. Because this code belongs to the user model not the controller. 

we built changedPasswordAfter function and will passed the jwt timestamp, so basically the timestamp which says when the token was issued. By default we'll return false from this method. that means the user has not changed his password after the token was issued. Remember in instance method the this will always points the current document. Ans so here we've access to the properties. Now we actually need to create a field in our schema for the date where the password has been changed. Add this in schema: 
passwordChangedAt: Date // this passwordChangedAt property will be change when someone change the password. 
call this instance method in protect function as step 4
 const changedTimestamp = this.passwordChangedAt.getTime(); to convert passwordChangedAt to a timestamp so that we can compare. 
One one is in seconds and one is in milliseconds. so we need to divide the changedTimeStamp by 1000
so : const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10); also we parsed into the number with based 10 number. 
return JWTTimestamp < changedTimestamp; this means password not changed. 

Lastly we put the entire user data on the request. 

! This is a very sophisticated and very complete route-protecting algorithm

*/
/*
* lecture 132
* Advanced Postman Setup

In postman the first concept that we're gonna see that is the concept of environment. At this point we haven't create any environment. 
Basically an environment is like a context where our app is running. We can then specify a couple of variables of each of these environment. Ant the two ones that make the most sense is just as we've in our express application, the development and the production environment. let's add our first environment. we create an environment called 'Dev:Natours' and created a variable, called URL, because that's the most important thing that we want to change from one environment to the other. So, in development, we'll have one url, and then in production we will have another one.  set the variable URL to http://127.0.0.1:3000/ And one environment for production.

! {{URL}}api/v1/tours
HERE URL is a variable. that we just created.

? Automate the coping the token and pasting it into the Bearer header, For that we've to write a little bit of code. Do that in sign up and login, because these are the places, from which we'll receive a json web token. 
in signup and login endpoints come to the test tab. Here we'll programmatically set an environmental variable. We'll create an environmental variable for the json web token that we receive in the request. Basically all we need to do is to use this snippets that we have (right side) in test tap. just click on set an environment variable option. here we get pre-written some java script code. 
pm.environment.set("variable_key", "variable_value");
we set the variable called jwt and the value would be in pm.response.json().token. here token is the name of the property in the response object. 
? pm.environment.set("jwt", pm.response.json().token); // This code will get the response on there read the token property and then assign it to the jwt environment variable. Here we saved the token into an environment variable. 
? Now go to any protected route, here we should have an authorization tab . here we have lot of options as a type of authorization, we'll choose the Bearer Token. and then we will specify our variable in double curly braces: {{jwt}}


! JUST SEE LECTURE # 132 -NOT WRITING HERE. 
*/

/*
* lecture 133
* Authorization _User Roles and Permission
We've implemented authentication in our project up until this point. However simply authenticating(logging a user in), is not enough. So in this video we're gonna implement authorization as well. So, imagine the act of deleting a tour from our database, So not every user should, of course be allowed to do that, even if the user is logged in. So, we basically need to authorization only certain types of users to perform certain actions. So that's exactly what authorization is. It's verifying if a certain user has the right to interact with a certain resource. with authorization we basically check if a certain user is allowed to access a certain resource even if he is logged in. this is a very common scenario that should be implemented in each and every web application. 
So, we're gonna build another middleware function to restrict certain routes to certain user roles. for example for deleting tours. This means were gonna build another middleware function 
So we'll add another middleware function in deleteTour middleware stack. We always user .protect function first because we first check if the user is logged in or not? then we add another middleware called authController.restrict
.delete(authController.protect, authController.restrict('admin'), tourController.deleteTour); 
Into this .restrict function we'll the pass some user roles which will be authorized to interact with this resources.  Here we allow only admin to delete tours. Lets quickly add role field in user model. 

'user', 'guide', 'lead-guide', 'admin', These user roles will be specific to the application's domain. We have always different roles depending on the type of application that we writing. 
we will now make it(restrict func) so that it can take multiple arguments. So we want to the admin to be able to delete tours, but also lead-guide. So the admin and the lead-guid can delete tours. Let's no go ahead and implement this function in authController file
.delete(
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  tourController.deleteTour
);

role: {
  type: String,
  enum: ['user', 'guide', 'lead-guide', 'admin', ''],
}

? How we implement this? Because usually we cannot pass arguments into a middleware function. but in this case we really want to.. We want to pass in the roles, who are allowed to access the resource. So we need a way of basically passing in arguments into the middleware function? 
Well, in here we'll actually create like a wrapper function, which will then return the middleware function that we actually want to create. As we passing arbitrary number of arguments, we in here we use rest parameter syntax. this will then create an array of all the arguments that were specified. s
So we're creating this function and right away we'll then return a new function. and this returning function will be the middleware function. So this returning function will then get access to the roles parameter, because of closure.  
? When we'll give a user access to a certain route? Basically when user role is inside of roles array that we passed in. let's say we've the normal user so it will not be in any array, because here only one string. role='user', 
roles ['admin', 'lead-guide'], role='user'

if the roles array does not include the role of the current user, then we do not give permission to that user. And where is the role of current user stored? In above function(protect middleware) we stored the current user in request.user. Remember this protect middleware always runs before restrictTo. 
If it's not include then we create an error. otherwise we simply call next, next is route handler itself. THAT'S IT
403 means forbidden



/*
* lecture 134
* Password Reset Functionality_ Reset Token
In this video and next one we're going to implement a user-friendly password reset functionality, which is kind of standard in most web applications. Usually it works like this: We've to provide an email and and will get an email with a link, where we can click and then that's gonna take us to a page where we can put a new password. This is a very standard procedure. 
Basically there are two steps, The first one is that the user sends a post request to a forgot password route, only with this email address. This will then create a reset token and sent that to the email address that was provided. Just a simple random token, not a json web token, then in the second part, which is gonna be the next video, the user then sends that token from his email along with a new password in order to update his password. 
So basically we'll have exports.forgotPassword 

also implement this two routes, in userRoutes file. 
router.post('/forgotPassword', authController.login); // which will only receives the email address 
router.post('/resetPassword', authController.login); // which will receive the token as well as the new password. 
? let's specify the steps here:

1) Get user based on POSTed email
Here we use findOne not findById because we don't know id and user. so we specify the email address. this is only piece of data that is known. 
then verify, if the user does exist. 

2) Generate the random  reset token:
lets now generate a random token. For that once more we are gonna create an instant method on the user. Because once more, this really has to do with the user data itself. In userModel file.  
The password reset token should be a random string, but at the same time, it doesn't need to be as cryptographically strong as the password hash that we created before. So we can use the very simple random bytes function from the built-in crypto module. 
? Add that built-in crypto module
! const crypto = require('crypto');
Lets then generate our token .
? SEE createPasswordResetToken func in userModel
const resetToken = crypto.randomBytes(); in this function we need to specify number of character and then we will convert it into hexadecimal string. 

? Why we're actually creating this token? 
Basically this token is what we're gonna send to the user and so it's like a reset password really that the user can then use to create a new real password. And of course only the user will have access to this token. So in fact, it is really behaves kind of password. So essentially it's just a password, it means that if a hacker can get access to our database, then that gonna allow the hacker to gain access to the account by setting a new password. If we would just simply store this reset token in our database, then if some attacker gains access to the database, they could then use that token and create a new password using that token. So just like a password we should never store a plain reset token in the database. So let's encrypt it. We gonna use built-in crypto module.  
Now we gonna create a new field in our database schema to store resetToken. then we can compare it with the token that the user provides. 
passwordResetToken: String,
passwordResetExpires: Date, // for security measure this reset should expire after a certain amount of times.

then also want to return the plain test token, because that's actually the one that we're gonna send through the email. 

we need to send via a email, the unencrypted reset token because otherwise it wouldn't make much sense to encrypt it at all. So it the token that was in the database was the exact same that we could use to actually change the password, well then that wouldn't be any encryption at all. So we send one token via email and then we have the encrypted version in our database. And that encrypted one is then basically useless to change the password. So it's just like we're saving only encrypted password itself to the database. 

We just modify the data but not really update the document, we did not save it.  So we really just modify it.  Now we need to save it. 
await user.save() // error here, that is because we're trying to save a document but we do not specify all of the mandatory data, the fields that we marked as required. let quickly fix that. 
All we need to do is to actually pass a special option into this user.save method. then this property will deactivate all the validators that we specified in our schema.  
await user.save({validateBeforeSave: false  })

3) Send it back to user's email

*/

/*
* lecture 135
* Sending Emails with Nodemailer

We need to now send the password rest token via email to the user. In this lecture we learn how to send email using a very popular solution called Nodemailer. 
Let's now create an email handler function, that we can then use throughout our application. in utils folder, email.js file.

let's now install nodemailer, which we're gonna use to send email using node.js. So,
! npm i nodemailer 
require it in email.js file. 

Now we're creating that function. and in here we're gonna pass in some options basically like email address, the subject line, the email content, etc. 
We need to follow three steps in order to send emails wit nodemailer. 
1) We need to create a transporter 
A transporter is basically a service that will actually send the email, because it's not node.js that will actually sends the email itself. It's just the service that we define in here. something like gmail, Now gmail is not actually the service that we're gonna use, but just quickly to show how it works with gmail, because many people interested in this. 
Here we need to always create a transporter that's always the same no matter which service we're gonna use. 
const transporter = nodemailer.createTransport({    
  service: 'Gmail',
});
and here in createTransport function we need some options, just like we did below. There are couple of well known services that nodemailer know how to deal with, so we don't have to configure these manually, gmail is one of them, but also there is Yahoo, Hotmail, and many others. 
we also need to specify auth property for authentication, in there we need the user and the password. Just like before we save that kind of stuff in our config.env file. 
EMAIL_USERNAME=your-gmail
EMAIL_PASSWORD=your-password 
this is the configuration for the transport in Nodemailer. 

Then in our Gmail account we will actually have to activate something called the less secure app option. 
? Activate in gmail "less secure app" option. 
The reason why we're not using Gmail in this application is because gmail is not all a good idea for a production app. Using gmail we can only send 500 emails per day and also we will probably very quickly be marked as a spammer and from there it will only go downhill. So unless it's like a private app, we just send emails to ourselves or like 10 peoples, well then we should use another service. And some well-know one are SendGrid and Mailgun, And actually we'll use sentGrid a bit later in this course.  

Right now we use a special development service, which basically fakes to send emails to real addresses. But in reality these emails end up trapped in a development inbox, so that we can then take a look at how they will look later in production, that service is called mailtrap, So let's not signup for that. 
! https://mailtrap.io/
Basically with this service we can fake to send emails to clients, but these emails will then never reach these clients and instead be trapped in our mailtrap. so that way we cannot accidentally send send some development emails to all of our clients. 
On mailtrap first created an inbox called natours, and here we see our host, port, username, password, auth and tls. And so that is what we're gonna specify in our transport in nodemailer now. Let's copy the username and password and put in config.env file. 
EMAIL_USERNAME=93e334c4bd7523
EMAIL_PASSWORD=ca9fccacf38d24
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=25
we also need to specify the host, that's because mailtrap is not one of these predefined services that comes with nodemailer. And also port

As we're using mailtrap so instead of service:'Gmail' we put host and port, We specify here because mailtrap is not one of these predefined services that comes with nodemailer. 
MOVE TO STEP#2

2) We need to define the email options. 
Defining some options for our email,   const mailOptions = {};
We could of course step 2 and 3 in same place, but we don't. As an option we specify where the email is coming form. the name and the email address. 
form : 'Muhammad Ahmad' <ugv@gmail.com>,
next up we need a recipient address, to: options.email, Basically coming as an argument of this function. 
Then same as to subject and text. 
We can also specify html property, so we could then convert this message to html. we'll do later, now not specify html property. 

3) Actually send the email with nodemailer. 
Now at the end, on transporter object we can call sendMail method(mailOptions), into that we need to pass in our mail options. 
  transporter.sendMail(mailOptions);
Now this'll return a promise, this is an async function. So let's use async await. 

Now simply export it form this module. 

Now import in authController file and 
const sendEmail = require('./..utils/email');

*/
// * email.js file
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) We need to create a transporter
  const transporter = nodemailer.createTransport({
    // service: 'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) We need to define the email options.
  const mailOptions = {
    from: 'Muhammad <ugv@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) Actually send the email with nodemailer.
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

/*

lets start by defining the reset url, Ideally when the usr click on this email  and will then be able to do the request from there. And that work later when we implement our dynamic website. but still here we want to create this url here.

The resetPassword will take the token as a parameter. And also it's not get, not post but it's patch, because the result of this will be modification of the password property in the user document. 

let's built the our reset url. 
restURL = `${req.protocol://${req.get('host')}/api/v1/users/resetPassword${resetToken}`

create a message and Finally send the email. and remember send email is an async function so, therefor we need to await it here. Remember this takes an object with sme options.
await sendEmail({
  email: user.email, // we can also say req.body.email that's same to user.email. 
}); 
We await that that also want to send some responses. 

res.status(200).json({
    status: 'success',
    message: 'Token sent to email!',
  }); // we cannot send message here, because then everyone could  just reset anyone's password, that's way to sent over email.

Now there might happen an error using this sendEmil function, and so in that case, we want to error message to the client. But in this case, we actually need to do more than simply send an error message. We need to basically, send back the password reset token and the password reset expired that we defined, We'll add try catch block here. If there is an error, we want to reset both the token and expires property. 

*/

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address. ', 404));
  }

  // 2) Generate the random  reset token
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  // 3) Send it back to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot you password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      // email: user.email,
      email: req.body.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

/*
* lecture 136
* Password Reset Functionality _Setting New Password 
Here we actually set the new password for the user. 
Just like before let's start by defining the steps that we're gonna take for this resetPassword flow.

1) Get user based on the token
Remember from the last video that the reset token that is actually sent the url is this non encrypted token. {
  resetToken: 'b91a5c4473a877c3b529f3eaf65362963007d4dca04ee96670ba6f5950f96b8f'    
} 574d2eeab84d93e6205459c7c4ec2324a6a33e2cc1afde4edc286b137c06d5ad First one that're in an object. 
And the one thats in the database is the encrypted one. 
So, now we need to do, is basically encrypt the original token again, so that we can compare it with the one that is stored in the database-encrypted one. 

here we want to hash the token that is coming through the url which's remember req.params.token. And then finally we need to digest('hex');
These are exact same as we did before in encrypted original one. So, we could refactor this into it's onw function. but not now
Now let's actually get the user based on this token, Because that is the only thing that we know about the usr right now. This token is the only thing that can identify the user.  So, we can now query the database for this token -find the user which has this token. 
const user = await User.findOne({ passwordResetToken: hashedToken });
But right now, we're not taking the token expiration data into consideration. Ans so how could we do that? Well, basically what we want is to check if the passwordResetExpires property is greater than right now. Because it the expires date is greater than now, it means it's in the future, which in turn means, that it hasn't yet expired. And so, there's a very easy way in which we can actually do this right with this query. 
const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Data.now() },
}); // So, here we check passwordResetExpires with actual current time/date, is it's greater then now. Data.now() will actually be a timestamp of right now, but behind the scenes, mongodb will then convert everything to the same, and therefore be able to compare them accurately..
With this we can, at the same time, find the user for the token and also check if the token has not yet expired.  NOW STEP 2

2) If token has not expired, and there is a user. in this case set the new password.
We want to send an error if there is no user, or basically, if the token has expired. That in in this case is same, because if the token has expired, then it will simply not return any user. 
And there is no error, if next is not called then, let's set the password. 
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
that's because we send the password and confirmPassword vie a body. 
And also let delete the reset token and the expired 
user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
And again of course, we now need to save it. because this only modifies the document, it doesn't update. 
  await user.save();
In this case we actually don't need to turn off the validators, because indeed we want to validate. 
? REMEMBER: We always use save instead of update for everything related to passwords and to the user, because we always wants to run all the validators and above all, the save middleware functions. 

NOW GO 4TH STEP, skipped 3 for at the end.


3) Update changedPasswordAt property of the current user
let's quickly go back to the user model, where we're gonna do that using middleware. 
--------------------
userSchema.pre('save', function (next) {});
this function here, is gonna run right before a new document is actually saved. So it's a perfect place the specifying this property.
? When exactly do we actually want to set the passwordChangedAt property to right now?
Well, we only wanted it when we actually modified the password property. in isModified method we put the name of the property. . 
if (!this.isModified('password')) return next();
So, if we didn't modify the password property then of course do not manipulate the passwordChangedAt property. BUT WHAT ABOUT CREATING NEW DOCUMENT?
well, when we create a new document, then we did actually modify the password, and then we would set the passwordChangedAt property. In the current implementation we actually would. But there is something else that we can use here. Basically we want to exit this middleware function right away, if the password has not been modified or if the document is new, and so we can use this.isNew property as well. 
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next(); 
});
if this condition is false. then we'll change passwordChangedAt property.
  this.passwordChangedAt = Date.now();

? This should work just fine, but actually in practice sometimes a small problem happens. And that problem is that sometimes saving to the database is a bit slower than issuing the json web token, making it so that the changed password timestamp is sometime set a bit after the json web token has been created. That then will make it so that the user will not be able to log in using the new token. Because the whole reason this timestamp actually exists, is so that we can compare it with timestamp on json web token. 
We just need to fix this by subtracting one second
this.passwordChangedAt = Date.now() -1;
That will then put the passwordChangedAt one second in the past. 
Code: 
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1;
  next();
});

code will be in userModel.js file
---------------------
4) Log the user in. in other words Send the jwt(token) to the user. 

*/

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Data.now() },
  });

  // 2) If token has not expired, and there is a user. in this case set the new password.
  if (!user) {
    return next(new AppError('Token is invalid or has expired.', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property of the current user
  // 4) Log the user in. Send the jwt to the user.
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

// 3 Update changedPasswordAt property of the current user. (userModel.js)
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1;
  next();
});

/*
* lecture 137
* Updating the Current User_ Password
Over the few videos we allowed a user to reset his password and create a new one, but now we also want to allow a logged-in user to simply update his password without having to forget it, and so without that whole reset precess. So, let's build that now. 
Just like before let's do that in authentication controller. 

Remember that this password updating functionality is only for logged-in users, but still we need the user to pass in his current password, so in order to confirm that user actually is who he says he is.. just for security measure. Let's layout steps to implement this functionality just like before.
1) Get user from the collection
As always we create a new user variable   and in there we await the result of doing User.findById() 
? where is this id is coming from? well, remember that this updatePassword is only for authenticated, so for logged in user, and so there for at this point we'll already have the current user on our request object. remember that coming from the 'protect' middleware. So,
const user = await.findById(req.user.id) and then we need to explicitly ask for the password, because it's by default not included in the output. We need the password to compare it with the one that stored in the database. For that we use pre defined instant method 'correctPassword', which is available on the documents.


2) Check if POSTed current password is correct
Here we want to create an error if the current password is not correct.
if(!user.correctPassword()){}, here we pass candidate password, that one is gonna be in the body, req.body.passwordCurrent, And then as a second argument the actual password, that's on user.password. And remember correctPassword is an async function, so we need to await here.

3) If so, update the password
If the password is correct, well then we can actually update the password, 
user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
Here on save we want validation, so this time we do not turn off the validation.  
? Why we didn't do like this user.findByIdUpdate, ...., ? It's for two reasons, 1- The validations that we defined in Schema will not gonna work, that's because in we write return el === this.password; so this.password is not defined when we update. because internally, behind the scenes, mongoose does not really keep the current object in memory, so this.password not gonna work. 2- And also the pre('save', ...) middlewares are not going to work. So, if we used simply update for updating the password, then that password would not be encrypted. 

4) loge in the user with with new password, to send json web token.  
Logged the user in and sent the token back to the client. 
const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
this is 4th time we writing the same code so, refactor it. Now this actually is not the same everywhere. let's make a function in general
here we need as argument the user, where the id is stored, statusCode, and response object in order to actually be able to send a response.

Finally to  make this work we actually need to implement the route in userRouter. 

We'll do a patch because we are manipulating the user document, and so that's what patch for.
As it'll work only logged in user so we need authController.protect, which'll also put the user object on a request object.
router.patch(
  'updateMyPassword',
  authController.protect,
  authController.updatePassword
);

To test we need to pass three password in body. 1- current pass 2- new-pass 3- new-pasConf
*/

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from the collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) loge in the user with with new password, to send json web token.
  createSendToken(user, 200, res);
});

// Refactored function for create and send token to the user
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

/*
* lecture 138
* Updating the current User_ Data
In this lecture, we'll allow the currently logged in user to manipulate his data, Now by implementing user updates, we're really leaving the domain of authentication and moving more into real user related stuff.
? So instead of using the authentication controller now, let's implement this updating functionality right in the userController. 

create a new handler function called updateMe, because it's for updating the currently authenticated user. later we'll implement the updateUser handler but that's then for an administrator to update all of the user data, while user itself can only update, for now at least the name and email address. 
we're actually doing updating user data in a different route than updating the user password, this is because usually in a typical web application that's alway how it's done. So, we've usually one place where we update our password and another place where we can update data or account itself. so here we're just following that pattern. Again let's start by laying out steps:

1) Create error if user POSTs password data.
We'll create an error if the user tries to update the password.
After it, for test, create a simple response and add this route to a userRouter. 

router.patch('/updateMe', authController.protect, userController.updateMe);  
First we use the protect middleware, its protected route, so only the currently authenticated user can update the data of the current user. All of this for secure. because the id of the user that is gonna be updated comes from request.user, which was set by this protect middleware, which in turn got the id from the id from the json web token, and since no one can change the id in that json web token without knowing the secret, so the id is then safe.
Now it's working just fine...

2) Update user document 
To update the document we could try to do it with user.save(), just like before, basically getting the user then updating the properties and then by the end saving the document.  
? But the problem with that is that there are some fields that are required which we're not updating, then because of that we will get some error. like this: 
const user = await User.findById(req.user.id);
user.name = 'Muhammad';
await user.save(); // This will give us an error. 
?So, the save method is not really the correct option in this case. Instead we can do now is  to actually use findByIdAndUpdate. 
We could not use this before for all the reasons that we talked in previous video. Since now we're not dealing with passwords, but only with this non-sensitive data like name or email, we can now use  findByIdAndUpdate
const updatedUser = User.findByIdAndUpdate(req.user.id); 
here in this method we need to pass not only id but also the data that should be updated, and options. so the data, let's for now call it x, and the options, that we want to pass in, new:true that it returns the new object, basically the updated object instead of the old one. Ans also runValidators: true
const updatedUser = await User.findByIdAndUpdate(req.user.id, x,{new:true} ), so mongoose validate the data. for example for invalid email. 
? Why putting x here in place of data, Why not simply request.body?
Well that's because we actually do not want to update everything that's in the body, because let's say the user puts in the body the role, like body.role:'admin', and so this would then allow any user to change the role, and of course that can not be allowed. Doing something like this would be a huge mistake. So we need to make sure that the object that contain the date that gonna be update, only contains name and email, because for now these are the only fields that we want to allow to update. And so basically we want to filter the body so that in the end, it only contains name and email and nothing else. 
What we want to do is to create a variable called filteredBody and then we're create a function, which takes the data(obj which want to filter) which is req.body,because where all the data is. and then couple of arguments, one for each of the field that we want to keep in the object, for now we want to keep 'name' and 'email' filed. and later we might add more fields here. like images. 
const filteredBody = filterObj(req.body, 'name', 'email');
Now implement the filterObj function, which will take care of filtering the object. 
filterObj will take in an object, and the rest parameters for all the allowed fields. The rest parameters will create an array containing all of the arguments that we passed in. in this case an array containing name and email. 
Now we have to loop through the object and for each element check if it's one of the allowed fields, and if it's simply add it to a new object that we're then gonna return in the end. 
we're gonna loop through the object by Object.keys() of the object that we pass in. This is a easier way to loop through an object in javascript. and this(Object.keys(obj)) here will return an array containing all the key names of this object and then we can loop through them, using forEach(), In callback function of forEach, for each element of the array, if the allowedFields includes the current field name, if(allowedFields.includes(el)) then we want to add that to a new object. 
we created empty newObject, and all the elements that satisfies the if statement which will be added to the new object. and at the end we'll return the new object.

newObj[el] = obj[el]; If the current filed is one of the allowed fields, then newObj with the field name of the current filed should be equal(assign) to whatever is in the object at the current element, so the current field name. 

*/

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data.
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }

  // 2) Filtered out unwanted field names that are not allowed to be updated.
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

/*
* lecture 139
* Deleting the current User
After updating, let's now also allow the current user to delete his account. 
Now when a user decides to delete his account we actually do not delete that document from the database. But instead we actually just set the account to inactive. So that the user might some point in the future reactivate the account and also so that we still can access the account in the future even if officially, let's say it has been deleted. 
To implement this first of all we need to create a new property in our schema. so let's go there. 

active: {
    type: Boolean,
    default: true,
    select: false,
  },

we want to have a field called active, which should be a type of boolean. and default should be true and also we do not want  to show in the output, because we basically want to hide this implementation detail from the user.
Now to delete the user now all we need to do is basically set that active flag to false.

let's create that flg to set the active flag to false. 
and again this only works for logged in users and so the user id is conveniently stored at request(req.user.id) and the data that we want to update is active:false 
Now sending back the response is also pretty easy. we use the 204 code for deleted, which will then make it so that actually in postman we do not even see this response. and we don't send any data back in case of delete.  
And not of course add it also to all routes here. 
we use the delete http method, and keep in mind we'll not actually delete a user from the database. But as longer as the user is no longer accessible anywhere then it's till okay to use delete http method here.
Lets check for now,  and it's a protected route so we need to be signed in and so lets create our authorization header bearer token in postman and that's actually it, we don't need to pass any data in the body, and any data in the url. because the only data that is needed is the current user id and that one is in coded inside of our adjacent web token, in auth header. Yeah the active field is changed. 

Now as a last step, we do not want to show up the inactive users in this output. 
? how do we could implement this?
well we're gonna use something that is way back tha we talked about, which is query middleware. So query middleware is perfect for this because now we can basically add a step before any other query that we're doing then somewhere in our application. So, let's go to our user model, and that middleware. 

*/
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

/*
something that will happen before a query and that query will be a find. then a regular function because remember that otherwise we're not having access to the this keyword or at least it won't have the value that we expect it to have.
And Remember that here we actually used a regular expression before, basically to say that we want this middleware function to apply to every query that starts with find, not just find but also stuff like findAndUpdate..., 
And so we use a regular expression looking for words or strings that start with find. /^find/
Remember this is query middleware, so therefore 'this' keyword points to the current query
? How this work? lets say we want getAllUsers for that we use find query, and now before that query is actually executed we want to add something to it. which is that we only want to find documents which have the active property set to true. THAT'S EASY
find only documents that have active set to true.   this.find({ active: true }); that's it, we're done. let's test with getAllUsers method. but we got nothing in response. while we had two filed where we've not specify the active to false. so they should be in response. BUT WHY? I guess that's because the other ones they do not have explicitly the active property set to true. So let's do what we actually did in the other section, where we say that active should not be false.  So all documents which has active not equal to false. 
this.find({active: { $ne: false },});

*/
userSchema.pre(/^find/, function (next) {
  // 'this' points to current query
  // this.find({ active: true }); not working
  this.find({
    active: { $ne: false },
  });
  next();
});

/*
* lecture 140
* Security Best Practices
Everything that we did in this section so far was to secure our application and user's data as good as possible. And we talked about a lot of things we can do to achieve that. But all of this information was kind of spread out all over these lectures. 
? So this is a quick summary with many best practices that we already implemented and that we're still gonna implement in the rest of this section, because security is so extremely important but unfortunately, many courses don't address it enough. Here is couple of things that we can do to properly secure our apps and data.
And we're gonna look at a couple of common attacks  and give some suggestions to prevent them. 
First up, we have the event of a compromised database, meaning that an attacker gained access to our database. To prevent we must always encrypt passwords and password reset tokens just like we did in the videos in this sec. this way the attacker can't at lest steal our user's passwords and also can't reset them. Now about actually preventing attacks, let's talk about the brute force attack, where the attacker basically tries to guess a password by trying  millions and millions of random passwords until they find the right one.  And what we can do is to make the login request really slow. And the bcrypt package that  we're using actually does that. Another strategy is to implement rate limiting, which limits the number of requests coming from one single IP. and this one we're gonna implement in one of the next videos. Also a nice strategy is to actually implement a maximum number of login attempts for each user. for example we could make it so that after 10 failed attempts, user would have to wait one hour until he can try again. 
? We're not gonna implement this functionality in this section but please feel free to experiment with it on your own. 

Next up, there is the cross-site scripting(XSS) attack, where the attacker tries to inject scripts into our page to run his malicious code. On the client's side, this especially dangerous because it allow the attacker to read the local storage, which is the reason why we should never ever store the json web token in local storage. Instead, it should be stored in an HTTPOnly cookies, that makes it so that the browser can  only receive and send the cookie but cannot access or modify it in any way. And so, that then makes it impossible for any attacker to steal the json web token that is stored in the cookie. W're implementing this is a second. 
Now on the backend side, in order to prevent XSS attacks, we should sanitize user input data and set some special http headers, which make these attacks a bit more difficult to happen, and express doesn't come with these best practices, so we're gonna use middleware to set all of these special headers. 

Next we have Denial-Of-Service(DOS) attacks. It happens when the attacker sends so many requests to a server that it breaks down and the application becomes unavailable. Implementing rate limiting is a good solution for this. Also we should limit the amount of data that can be sent in a body in a post or a patch request. And also we should avoid using so-called evil regular expressions to be in our code, these are just regular expressions that take an exponential time to run for not-matching inputs and they can be exploited to bring our entire application down. 

Next up, we've the NoSQL query injection attack. Query injection happens when an attacker, instead of inputting valid data, injects some query in order to create query expressions that're gonna translate to true. for example we logged in even without providing a valid username or password. It's a bit complex and we should definitely google it to lean more. But for now what we need to know is that using mongoose is actually a pretty good strategy for preventing these kind od attacks. because a good schema forces each value to have a well-defined datatype. However, it's always a good idea to still sanitize input data, we'll take care of that a bit later. 

Now finish we just have a couple of best practices and suggestions on how to improve the authentication and authorization mechanisms that we implemented. 

! SEE PDF FILE, must


*/

/*
* lecture 141
* Sending JWT via Cookie
Se we learned in the last lecture that the json web token should be stored in a secure http-only cookie. But right now, we're only sending the token as a simple string in our JSON response. 
So, in this video, let's also send the token as a cookie, so that the browser can then save it in this more secure way. 
? Where do we actually send the token to the client? well remember that's in the authController in createSendToken function. 

* Let's talk a little bit about cookies. 
First of all, a cookie is basically just a small piece of text that a server can send to clients. Then when the client receives a cookie, it'll automatically store it and then automatically sent it back along with all future requests to the same server. A browser automatically stores a cookie that it receives and sends it back in all future requests to that server where it cam from. For not this is not gonna be really important for us as we're only testing the API using postman. But a bit later, when we're gonna render dynamic webpages and really interact with the browser, then it'll become really important that the browser send back the token basically automatically in each request.
? Anyway let's now learn how to create and send a cookie. 
In order to send a cookie,it's actually very easy. all we have to do is to basically attach it to the response object, in createSendToken function.

res.cookie and then we have to do is to specify the name of the cookie, we're calling here jwt, and then the data that we actually want to send in the cookies, that's of course gonna be the token variable. and then after that a couple of options for the cookie. The fist option we're gonna specify is the expires property. basically this expires property will make it so that the browser or client in general, will delete the cookie after it has expired. so we set the expiration date similar to the one that we set in the json web token. let's create a new variable for that in config.env file. 

JWT_COOKIE_EXPIRES_IN=90
because the json web token package can then work with this format 90d. HERE WE specify 90 without d, so that now we can make actually operations with it. because we'll need to convert it to milliseconds. 
? When should this cookie expire? well it should expire at a new date(), so in javascript, when specifying dates, we always need to say new Date(), and then it should expire at right now, plus 90 days, which stored in env file. and then we need to convert that into milliseconds. 
The next options is gonna be the secure option. we set to true, and so like this, the cookie will only be sent on an encrypted connection, so basically we're only using https. 
and then finally it's that httpOnly option set to true. and so this will make it so that the cookie cannot be accessed or modified in any way be the browser. All the browser is gonna do is to when we set httpOnly to true is to basically receive the cookie, store it, and then send it automatically along with every request.
res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: true,
    httpOnly: true,
  }); 
So this is actually how we define the cookie. and we sends it using res.cookie. Now if we wanted to test this right now, it wouldn't work because right now we're actually not using https. because of this secure true the cookie would not be created and not be sent to the client. So we only want to activate this part(secure:true) in production. 
Here we gonna to is to exports this entire object of options into a separate variable. 
*/

const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  ),
  // secure: true,
  httpOnly: true,
};

if (process.env.NODE_ENV === 'production') {
  cookieOptions.secure = true;
}
res.cookie('jwt', token, cookieOptions);

// Remove the Password from output
user.password = undefined;

/*
Let's now actually test this. Yeah it's working. we've one cookie here
Now just one last thing that we actually want to change here is to basically get rid to password in the output. "password": "$2a$12$HSso5U2cKdlwgVkBQqBx0e3Agznjg.xztnbi6B8xX5FjvZAjKCAOG",
In our schema we actually set select false, so that it doesn't show up when we query for all the users. But in this case it comes from creating a new document and so that's different and so  that's why we see it in res. We can actually very easily fix this. 
All we need to do is to actually set user.password = undefined. in createSendToken function

*/

/*
* lecture 142
* Implementing Rate Limiting
In this lecture let's implement rete limiting in order to prevent the same IP from making too many requests to our API, and that will then help us preventing attacks, like denial of service, or brute force attacks. 
So that rete limiter will implemented as a global middleware function. So basically what the rate limiter is gonna do, is to count the number of requests coming from one IP and then, when there are too many requests, block these requests. 
? And so it make sense to implement that in a global middleware, so we do that in app.js. 
and the rate limiter that we're going to use is an npm package called Express Rate Limit. let's install it
! npm i express-rate-limit
and then in app.js file require it.
const rateLimit = require('express-rate-limit');


We start by creating a limiter, by calling the rateLimit function, that we just defined up by requiring express-rate-limit
rateLimit is a function which receives an objects of options, in this objects we can define how many requests per IP, we're going to allow in a certain amount of time. We can specify the max property which we gonna set to 100 (max:100). and then also the window, so the time window (windowMs: 60*60*1000), we allow user here to 100 requests per hour. WindowMs in the milliseconds, as we want one hour so 60*60*1000MS = 1hour.
if the limit is then crossed by a certain IP, they will get back an error message. we can specify that message(message: '')
This limiter is basically a middleware function. which we now can use by using app.use() just like we did before. 
app.use(limiter); We can do it just like this but we actually want to basically limit access to our /api route. We basically want to apply this limiter only to /api , so that will then effect all of the routes that stat with /api, 

*/
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

/*
* lecture 143
* Setting Security http Headers
In this video we're gonna use yet another NPM package in order to set a couple of really important security http headers. So to set this headers we'll yet again use a middleware function, which will come again from an npm package.
let's install that and it's called helmet. this is kind of standard in express development, so everyone who's building an express app should always use this helmet package. Because express doesn't use  all these security best practices out of the box . Again in app.js file. 
! npm i helmet
/*
Here all we need to do is call helmet here, and so that will then produce the middleware function that should be put right here. In app.use() we always need a function, not a function call. app.use(helmet()); this's not correct.
It's best practice to use helmet package early in the middleware stack. so that these headers are really sure to be set. So don't put it somewhere at the end, but right in the beginning. 
let's put it in the beginning as the first of all middlewares. 
We're really growing our middleware stack here, let's give each of them a name:

let's take a look at helmet documentation on github

const helmet = require('helmet');
app.use(helmet());

That's it, we have to install, require and use it. 
=================

NOT RELATED TO THIS LECTURE:
Body Parser, reading data from body into req.body

let's implement that, we can limit the amount of data that comes in the body. 
app.use(express.json());
Here in json we can actually specify some options and for that as always we pass in an object. 
limit:10kb, Package will understand, it will parse this string('10kb') here into meaningful data. And so now when we have a body larger than 10 kilobyte, it will basically not be accepted. 
app.use(express.json({ limit: '10kb' }));
*/

/*
* lecture 144
* Data Sanitization
In this lecture we're going to use two more packages to improve our application security, and this time to perform data sanitization. 
so, data sanitization basically means to clean all the data that comes into the application from malicious code. So code that is trying to attack our application. 
In this case, we're trying to defend against two attacks. 
1) Data Sanitization against NoSQL query injection
2) Data sanitization against XSS(Cross-Site Scripting) attacks.

We will do that in app.js file right after the body parser middleware. The body parser middleware will read the data into request.body and only after that we can actually clean that data. So after body parser is the perfect place for doing data sanitization. 

Now before doing anything else, let see why it's extremely important  to defend against this type(NoSQL query injection) of attacks. 
So lets now head over to postman and try to login as someone, even without knowing their email address. So basically simply giving a password, we'll be able to login but even without knowing the email address. We're going to do that by simulating a NoSQL query injection, and the easiest way of doing it like this:  In body of request. 
{
  "email": {"gt":""}
  "password": "12345678"
} // Instead of specifying a real email, we specify this query, we use mongodb greater then operator and set it to nothing. And know try to login. 
! Yes by simply doing this we logged in as the admin. WOW, so without knowing the email, with only the password we're able to login. this will work because this expression{"gt":""} is true.
So, this kind of attack is what we need to protect against.

So, to protect ourselves against this let's install another middleware, 
! npm i express-mongo-sanitize
Let's also install the other one that we're going to need in this video
! npm i xss-clean

let's talk about NoSQL quey injection again.

1) Data Sanitization against NoSQL query injection
require express-mongo-sanitize and also xss-clean.
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
mongoSanitize is a function that we will call, which will then return a middleware function, which will we can then use. 
app.use(mongoSanitize());
And this enough to prevent us against the kind of attack that we just saw before. 
? So what this middleware does is to look at the request body, the request query string, and also at request.params, then it will basically filter out all of the dollar signs and dots, because that's how MongoDB operators are written. By removing that these operator are then no longer going to work. 
Now test same thing again, that we did before, login without email. YEAH GOT AN ERROR
That fixes the first problem, now let's use that other middleware that we also just required. 

2) Data sanitization against XSS(Cross-Site Scripting) attacks.
app.use(xss());
This will then clean any use input from malicious html code. Imagine that an attacker would try to inset some malicious html code with some some javascript code attached to it. If that would then later be injected  into our html site, it could really create some damage then. So using this middleware we prevent that by converting all these html symbols. 
Now the Mongoose validation itself is actually already a very good protection against XSS, because it won't really allow any crazy stuff to go into our database as long as we use it correctly. So, whenever we can, just add some validation to mongoose schemas and that should mostly protect us from cross-site scripting, at least on the server side. 
THAT'S ALL
REMEMBER, that the validator function library that we used before also has a couple of cool sanitization functions in it. We could also manually build some middleware using these....

*/

/*
* lecture 145
* Preventing Parameter Pollutions
Now we're gonna be preventing parameter pollution, using yet another NPM package.
But before installing that package, let's go ahead and take a look at the error. Before that let's head over to postman and see why we actually need to prevent parameter pollution in the first place. 
let's say we want to get all tours, sorted with duration and also sorted with price. And it doesn't actually make much sense right? because we're prepared to only have one sort parameter. {{URL}}api/v1/tours?sort=duration&sort=price Let's see what we actually get with this parameters? We get an error, saying that this.querystring.sort.split is not a function. in sort method, where it's trying to split the sort property which we expect to be a string, But right now since we defined it(sort) twice, express will actually create an array with these two values, duration and price. split only works on string. 
So this is a typical problem. So, Basically we're now going to use a middleware which will simply remove these duplicate fields. le't install it. 
It's called HPP which stands for HTTP Parameter Pollution
! npm i hpp
let's quickly require it in app.js file. 

This is yet another very simple one. All we need to do is app.use(hpp()) and then call hpp. And this one again should be used in the end, because what it does is to clear up the query string. 
let's test... Yeah it's only sorting with last one. in this case with price. 
So, that's kind of fixed but we actually want some duplicate properties or fields in some cases. For example we might want to search for tours with the duration of nine and five.
{{URL}}api/v1/tours?duration=5&duration=9 // here we have durations with only 9.  
So, we have to fix this. If we comment out app.use(hpp()) then we will get duration with both 5 and 9.
So what we can do in order to be able to use the middleware but still get this(with both 5, 9) result, we can white list some parameters.
So for that into this hpp() function we can pass some objects and then in there, specify the white list.whitelist property is simply an array of properties for which we actually allow duplicates in the query string. 
app.use(
  hpp({
    whitelist: ['duration'],
  })
);
yeah, working. now we should also specify some other fields in our white list, because for example we want to search for ratingsAverage, ratingsQuantity, so lets just add them to our white list. 
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
It might seem a bit weird to basically manually put all the field names here, and later we might hve to do same thing for the other resources. and that will then make this whitelist even bigger. And of course we could do some complex stuff in order to get these field names from the model itself, but once more we just want to keep it simple here. 

! END OF SECTION
! ------------------------- !
? REMAINING SECTION WILL BE IN AFTER-SECTION-10 FOLDER. 
*/

/*
 * SECTION 11
 * MODELLING DATA AND ADVANCED MONGOOSE
 *
 * SECTION INTRO:
 * Knowing how to work with data is one of the most important and valuable skills tha we can have as a backend developer. That's why in this section we're gonna dive really deep into data modeling concepts and techniques. By the end of this section our API will be fully functioning with all routes and all resources, a complete authentication and authorization, and also all established relationships between all the data sets.
 */

/*
* lecture 147
* MongoDB Data Modeling 

! for this lecture must read pdf file as well. 
One of the most important steps in building intensive apps is to actually model all this data in MongoDB. And so that's what we're gonna talk about in this lecture. So, it's really crucial that you follow it through even at first its a lot to take in. 
? What is Data Modeling?
Data modeling is the process of taking unstructured data generated by a real world scenario, and then structured it into a logical data model in a database.  And we do that according to a set of criteria which we're gonna learn about in this video. For example let's say that we want to design an online shop data model. There will be initially a ton of unstructured data that we know we need, stuff like products, categories, customer's orders, shopping carts, suppliers..., Our goal with data modeling is to then structuring this data into a logical way, reflecting the real-world relationships that exists between some of these data sets. SEE PDF FILE.
Data modeling is the most demanding part of building an entire application. Because it really is not always straight forward. So there is not just one unique correct way of structuring the data. 
We're gonna go through four steps. 
1- In first step we learn about how to identify different types of relationships between data. 
2- Then we're gonna understand the difference referencing or normalization and embedding or denormalization. 
3- In the next and most important step; will show my(jonas) framework for deciding whether we should embed documents or reference to other documents based on a couple of difference factors. 
4- Also we've to quickly talk about different types of referencing, because that's important if that is the type of design that we choose for our data. 

? Different types of Relationships that can exist between data. 
There are three big types of relationships. One to One(1:1), One to Many(1:many), Many to Many(many:many).
we'll gonna use a movie application as an example here. 
1:1 Relationships: One filed can only have one value.one movie only ever have one name. 

1:many Relationships: This is the most important relationships, and they are so important that in mongodb we actually distinguish between three types of one to may relationships. one to few, one to many, one to a ton / a million,
example of one to few is that one movie can win many awards, but just a few. 
example of one to many is that one movie can have thousands of reviews.
In general one to many relationships means that one document can relate to many other documents. 

many:many Relationship: one movie can have many actors, and at the same time one actor can play in many movies. so here a relationship goes in both directions while other two goes in only one direction. for example one movie can have many reviews, but one specific review is only for one movie. 

? Referencing VS Embedding
Referencing and Embedding two datasets. 
Each time we've two related datasets we can either represent that related data in a reference or normalized form or in an embedded or denormalized form. 
In a reference form we keep two related datasets and all the documents separated. All the data is nicely separated, which is exactly what normalized means. we would have one movie document and one actor document for each actor. 
? Now how do we then make a connection between movie and the actors so that later in our app we can show which actors played in a particular movie. because a movie has no way of knowing about the actors. 
Well that's where the IDs come in. So, we use the actor IDs in order to create references on the movie document. Effectively connecting movies with actors. 
! SEE PDF FILE
In the movie document we've and array where we stored ids of all the actors, so when we request data about a certain movie we can easily identify its actors. This type of referencing is called child referencing, because its the parent, in this case the move, who referencing its children, in this case the actors.
So we're really creating some sort of hierarchy here. 
Now there is also parent referencing, we talked bout bit later. 
And by the way in relational database; all data is always represented in normalized form. But in NoSQL database like mongoDB, we can denormalize data into a denormalized form simply by embedding the related documents right into the main document. So, now we've all the relevant data about actors right inside the one main movie document without the need for separate documents, collections, and IDs. So, if we choose to denormalize or to embed our data we will have one main document containing all the main data as well as the related data. And the result of this is that our application will need to fewer queries to the database, because we can get all the data about movies and actors all at the same time, which will increase our performance. Now the downside here is of course that we can't really query the embedded data on its own. And so if that's a requirement for the application we would have to choose a normalize design. Since we're talking about pros and cons of the denormalized form, lets do the same about the normalized design. 
Basically normalize form is kind of the opposite of embedded, there is an improvement in performance when we often need to query the related data on its own. because we then can just query the data that we need and not always movies and actors together. But on the other hand when we need to actually query movies and actors together we then are gonna many queries to the database.

? How do we actually decide if we should normalize or denormalize the data? 
When we've two related datasets; we have to decide if we're gonna embed the datasets or if we're gonna keep them separated and reference them from one datasets to the other. We use three criteria to take that decision.
1- First we look at the type of relationships that exist between datasets. 
2- We try to determine the data access pattern of the dataset that we want to either embed or reference. And this just means to analyze how often data is read and written in that dataset. 
3- Data Closeness: Data closeness is term that I(Jonas) actually just made up, but what it means is how much the data is really related, and how we want to query the data from the database. 
Now to take the decision; we need to combine all of these three criteria. 
! SEE PDF - MUST MUST MUST

Now let's say that we have chosen to normalize/reference our datasets. Then after that we still have to choose between three different types of referencing, Child Referencing, Parent Referencing, and Two-Way Referencing. 

- Child referencing: In child referencing we basically keep references to the related child documents in a parent document. and they are usually stored in an array. each document(child) has an id and all the id will store in parent document. The problem is that, this array of ids can become very large if there are lots of children. And this is an anti-pattern in mongodb, something the we should avoid at all costs. Also child referencing makes it so that parents and children are very tightly coupled. 

- Parent referencing: In parent referencing, in each child document we keep a reference to the parent element. The child always knows it's parent, so in this case the parent actually knows nothing about the children. 
The conclusion is that in general child referencing is best used for one to a few relationships. On the other hand parent referencing is best used for one to many and one to a ton relationships. Always keep in mind that one of the most important principle of data modeling is that array should never be grow indefinitely, In order to never break that 16MB limit. (one document must has < 16MB size)

- Two way referencing: We usually use this two way referencing to design many to many relationships. And it works like this, In each movie we will keep references to all the actors that paly in that movie. And at the same time in each actor we also keep references to all the movies that the actor played in. Movies and actors are connected to both directions. 

In general always favor embedding, unless there is good reason nto to embed.
*/

/*
* lecture 148
* Designing Our Data Model

Let's now use that theory in order to actually design the data model of our Natours app. And this the most difficult part of building an app. 

let's star with all the datasets that we actually need in our application, tours, users, these two we already have. Tours and users are two completely separate(normalized) datasets. Next up, we're also gonna have reviews, and we'll also have locations. because most tours actually have a number of different locations. And finally we also gonna have bookings. 
We've all these datasets. Now let's actually model the relationships that exist between them. 
* users, tours, reviews, locations, bookings
? Relationship between users and reviews: 
This relationship is clearly a one-to-many relationship, because one user can write multiple reviews, but one review can only belong to one user. and the parent in this relationship is clearly the users. Anyway, we I choose to model this relationship using parent referencing, and that's because a user can write a lot of reviews and also because we might actually need to query only for the reviews on their own. It's parent referencing, basically the review keeping a reference of the user, so keeping an ID. 

? Relationship between tours and reviews:
Again it's one to many relationship. where one tour can have multiple reviews but one review can only be about one tour. We model it exact same way as users-review relation. So, again parent referencing, and in the end the reviews end up with a tour id and user id. then once we query a review we always know exactly tour, and user of belongs to this review.

? Relationship between tours and location. 
Each tour is gonna have a couple of locations,  and each of location can also be part of another tours. So here few-to-few (many-to-many) relationship. This could be a good example of two-way referencing. so basically normalizing the locations into its own dataset. here but instead we're gonna denormalize the locations, so to embed them into the tours. That's for few reasons; first because there only so few locations. also we will not gonna access the locations on their own. also these locations are intrinsically related to the tours because really without locations there couldn't be any tours. So we embed locations to tours. 

? Relationship between tours and users:
this relationship between is again a few-to-few relationship, because one tour can have only a few users(so a few tour-guides), but at a same time, each tour guide can also be guiding a few tours. Modeling this relationship we could do it in two ways, by referencing or embedding. 

? Bookings: 
Basically a new booking will be created each time that a user purchases a tour. So, this is still kind of a relationship,between users and tours. because it's a user who is gonna buy a tour. But we also want to store some data about the relationship itself, so in this case about the purchase itself in our database, for example the price or the date when the purchase happened or something like that. So in case like this it's a good idea to create an extra dataset, which is in this case bookings. And so, of course there will be a relationship between tours and bookings and also users and bookings. Because the booking connects tours with users but kind of with an intermediate step. So, one tour can have many bookings, but one booking can only belong to one tour, and the same thing with the users. so one user can book many tours, and but one booking can only belong to one of the users. So of course we've a one-to-many relationship in both cases, and also in both cases we're gonna use parent referencing. so that means that on each booking we're gonna keep an id of both the tour that was purchased and also of the user who actually purchased the tour. 

*/
/*

* lecture 149
* Modelling Locations(Geospatial Data)
Now we're finally gonna start implementing our data model, and starting with the locations. So in this video we're gonna learn all bout geospatial data in MongoDB. 
Remember from the previous lecture that our location data will actually be embedded into the tours. And so therefor we're basically gonna declare everything that is related to locations in our tour model. so let's open tourModel file. 


So we'll have startLocation and then also, locations in general. Now mongodb supports geospatial data out of the box. And geospatial data is basically data that describes places on earth using longitude and latitude coordinates. So we can describes simple points, or we can also describe more complex geometries, like lines or even polygons, or even multi-polygons.
lets implement this geospatial data. And mongodb uses a special data format called GeoJSON, in order to specify geospatial data. 
? Now how does this actually work?
startLocation: {

} // This object we specified here is actually, this time not for the schema types options as we have it before. up there like:secretTour: {
      type: Boolean,
      default: false
    }  But now the object is actually really an embedded object. And so inside this object, we can specify a couple of properties. And in order for this object to be recognized as geospatial JSON, we need the type and the coordinates properties, So, we need type and we need coordinates and noe each of these fields(type and coordinates) then gonna get it's own schema type options. so basically here it's a bit nested, we are one level deeper

so we've type schema type options and then we also need schema type options for coordinates. For type the type will be string, and default will be 'Point', we could also specify polygons or lines.. as a default. but this is a standard to put 'Point' as a default. And we also specify the only possible options by defining the enum(enumeration) property. In this case we only want a point.
We need to define type for coordinates too, an array of coordinates. coordinates: [Number], it means that we expects an array of numbers. and this array as the name says is the coordinates of the point with the longitude first and second the latitude, this's a bit counterintuitive(متضاد) because usually it works the other way around, that's how it works in GeoJSON. if we see GoogleMaps, there will be the fist latitude and then the longitude.
Remember the latitude is basically the horizontal position measured in degrees starting from the equator, so equator it's zero degrees and in the north pole it's 90 degrees. And longitude is just the same thing but vertically.
We also want to specify a property for the address as a string and also a description for this start location again as a string.
In order to specify geospatial data with mongodb we basically need to create a new object such as we did here, And that object then needs to have at least two field names coordinates as array of numbers and then the type which should be type of string, may be points, lines, or any other geometries, and we can add some more fields, such as we did here, 
Remember in last lecture we said, we're gonna embed all the locations into the tour documents, but right now this startLocation here is not really a document itself. it's really just an object describing a certain point on the earth. But in order to really create new documents and then embed them into another document we actually need to create an array, So it's actually very similar to what we already have here, but it needs to be an array. so that's what we're gonna do with our locations. so,
location: [
  {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String,
    day: Number, // this day will basically be the day of the tour in which people will go to this location. 
  }
]
Now if we wanted to make it simpler, we could delete the startLocation all together, and then simple define the first location as the startLocation and set it to day number zero. But it's nice to also have the startLocation as a separate field. So this is how we create an embedded documents. remember we always need to use array. so by specifying an array of object, this will then create brand new documents, inside of parent document, which is in this case the tour. 
In order to create some locations we're actually going to import all our original data, so instead of creating new tours, we'll delete the ones we have. and then import complete data. in dev-data folder, remember before we imported tours-simple.json file, but we also have tours file and this then actually has locations and the startLocation. In each locations we see each location has it's own id, so these are really are documents. not just simple objects. So lets go to our import-dev-data.js and replace in fs.readFileSync(`${__dirname}/tours.json`, 'utf8'); and them first delete existing tours using --delete and import using --import
$ node ./dev-data/data/import-dev-data.js --delete
node ./dev-data/data/import-dev-data.js --import

*/

/*
* lecture 150
* Modelling Tour Guide_ Embedding
Remember in video about data model we said that we could either embed or reference the tour guide data, so in this video I'm gonna show how we could implement embedding tour guide documents into a tour document.  So, in this lecture we're going to embed user documents into tour document and then in the next video, I'll show how we can actually reference users instead of embedding. 
So, The idea here is that when creating a new tour document the user will simply add an array of user ids, and we will then get the corresponding user documents based on these ids and add them to our tour documents, in other words, we embed them into our tour. Lets' do that in tourModel.js

guides: Array.
? How this would word when creating a new tours?
when creating a new tour we add a guides property and the value would ba an array of ids as we defined here. like "guides":["438jkjlk, "kjdkjk3"], like this. And once we then save this tour, we'll then behind the scenes, retrieve the two user documents corresponding to these two ids. So lets implement that. The best place of the best place implement that is a pre-saved middleware. So that will then happen automatically each time that a new tour is saved. in tourModel file.

we get this.guides as an input, and remember this is gonna be an array of all the user ids. so we'll loop through them using .map method. and then in each iteration get the user document for the current id and store them insides of guides. 
here we need User, so import that, and we will find using this id from User. and actually we need to await this promise here and make the map function as an async function. 
tourSchema.pre('save', function (next) {
  const guides = this.guides.map(async (id) => await User.findById(id));

  next();
});
BUT now we actually get a problem, because the map method will assign the result of each iteration to the new element to the guides array. Know we have an async function, as we know that returns a promise,  and right now this guides array is basically an array of full of promises. So lets call this guidesPromise. and so we now actually need to run all of these promises at the same time. So here all we need to is to await Promise.all(guidesPromises). and we directly assign the result ot this Promise.all to this.guides, basically override that simple arrays of ids with an array of user documents.
  
tourSchema.pre('save', async function (next) {
  const guidesPromises = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);

  next();
});

That's it. 
Now we get the guides as a complete documents, not just ids, that we specify in the body.  
This is how we could implement embedding for this tour guides. 

Now this simple code that we implemented here, of course only works for creating new documents, not for updating them.  Now we would go ahead and implement this same logic also for updates. However, we're not gonna do that, because from the video where we modeled our data, there are actually some drawbacks  embedding this data in this case. for example imagine that a tour guide updates his email address, or they change their role from guide to lead guide. each time one of these changes would happen then we would have to check if a tour has that user as a guide, and if so, then update the tour as well. and so thats really a lot of work, so we're not gonna go in that direction. 
In this particular case we use referencing instead of embedding. 

*/
guides: Array, // in tour schema.


tourSchema.pre('save', async function (next) {
  const guidesPromises = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);

  next();
});

/*
* lecture 151
* Modelling Tour Guides _Child Referencing
So we embedded users into tours in last lecture, and also talked about the drawbacks of that approach in our specific situation. So in this video let's actually connect tours and users not by embedding but instead by a reference.

let's comment out the code that we wrote in the last lecture. 
This time in this video the idea is that tours and users will always remain completely separate entities in our database. 
So all we save on a certain tour document is the ids of the users that are the tour guides for that specific tour. Then when we query the tour we want to automatically get access to the tour guides, without them being actually saved on the tour document itself. And that exactly is referencing. 
? so, How we implement referencing in mongoose?
Here in TourSchema, in the  guides will now want to specify an array just like we did before, but this time with the locations. these means this guides will be some sub-documents. 
guides: [
  {types: mongoose.Schema.ObjectId}
]
here the type will be new one, and that's mongoose.Schema.objectId. It means is that we expect type of each of the elements in the guides array to be a MongodB Id. and all of these(types: mongoose.Schema.ObjectId)should be inside of an object, just like any other schema type definition. And here we also need to specify the reference, this is where the magic happens behind the scenes. Here now we say that the reference should be User. so this is how we establish references between different data sets in Mongoose. And for this we do not even need to have the user to be imported into this document. We actually required before in previous lec, but we don't even need it. 
Let's no go ahead and create a new tour. To test just like before we pass a guides with array of ids, but this time we actually specified that an object Id is exactly what we expect. And behind the scenes, it's also referenced to the user. When we create this tour it will actually only contains ids that we specified in guides in body, not the corresponding users. 
This is how we pass in body as a new user. 
{
    "name": "Test Tour One!",
        "duration": 1,
    "maxGroupSize": 1,
    "difficulty": "difficult",
    "price": 200,
    "summary": "last tour",
    "imageCover": "tour-3-cover.jpg",
    "ratingsAverage": 4.9,
    "guides":["6544bad7e0268d39645e1a07", "6546016675e85446a85dcfed"]
}

As we expected we have only ids in the response. So for now only we have references inside of mongoose. As we talked in parent referencing the parent will store the ids of each child.
In the next video we'll then take care of actually displaying the user data in the output using a process called populating. 
*/

// guides: Array,
guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }] // from tourSchema.

/*
* lecture 152
* Populating Tour Guides
Let's now use a process called populate in order to actually get access to the referenced tour guides whenever we query for a certain tour. In the last video we created a reference to the user in the guides field in our tourModel. Now we're gonna use populate in order to basically replace the fields that we referenced with the actual data, and the result of that will look as if the data has always been embedded. in fact as we know it is in a completely different collection. 
- Now the populate process always happens in a query. So let's now go to our tourController and then right to the function where we get a single tour, in getTour. 

so in findById query we need to add populate the query just like this. 
  const tour = await Tour.findById(req.params.id).populate('guides');
In populate will pass the name of the field, which we actually want to populate, in this case that's guides. So, we want to populate, basically to fill up the field called guides in our model. And again this guides field only contains the references, and with populate we're then gonna fill it up with the actual data, only in the query not in actual database. 
This is what we to do, now take a look. now if we getTour with that id, where we put "guides":["", ""], then we see the tour with all the user's data that are corresponding to that ids. And if we now take a look at get all tours, here we have only the values that are actually in the database, only ids in guides field, also in compass. In getAllTours only showing ids because we didn't implement the populate till now. 
let me(jonas) just show you a small trick that we can do with the populate function. Which is to actually also just select the certain fields, for example we're not interested in this __v property, and also not in passwordChangedAt property. 
So, in populate, we can actually specify that, instead of just passing a string of field name, we can create an object of options. the path, which is name of field, is guides, and then we use select property and the value should be the name of  properties that we want to deselect with minus sign. 
cont tour= await Tour.findById(req.params.id).populate({
  path: 'guides',
  select: '-__v -passwordChangedAt'
})

So, this populate function is an absolutely fundamental tool for working with data in Mongoose. and especially of course when there are relationships between data. We should always know exactly how and when to use it in our own applications. 
? Now one thing that should keep in mind, is that behind the scenes, using populate will still create a new query, and so this might affect our performance. In kind of small application, this small hit on performance is not a big deal at all. but in huge app with tons of populates that might indeed have some kind of effects. Really it makes sense, because how else would mongoose be able to get data about tours and users at a same time. It need to create a new query basically in order to be able to create this connection. 

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
});

In getAllTours we've not implemented yet, one solutions may be copy the code from here and past it in getAllTour handler as well, but not a good practice. So instead of this we use a query middleware. 
So let's quickly go ahead and move to our tourModel and add a middleware there. 

tourSchema.pre(), then we in pre we will pass a regular expression for everything that start with find. 
We do this in query middleware, because this is a middleware that is going to run each time these is a query. 
remember in query middleware this always points to the current query. And so now basically all of the queries will then automatically populate the guides field with the referenced user. 
let's test that out. 

? Now you have extremely powerful tool. 
QUICK RECAP:
This is a two step process, first we create a reference to another model like we did in tourModel, by adding guides field and specify the type and ref property. Then in the second step we populate that field, that we specify in populate method. 
*/

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

/*
* lecture 153
* Modelling Reviews _Parent Referencing
In this video, let's continue to translate the data model that we established right at the beginning into some actual code. And in this time we're gonna implement the reviews model. 
So the first step is to create a new file in models folder call it reviewModel.js 

* small challenge to create a review model, with fields: review / rating / createdAt(current timestamp) / reference to tour that this review belongs to / reference to the user who wrote this review, so basically two parent references here.

A review need to belongs to any tours, and also need an author, so basically we're implementing parent referencing  here in this case, because both the tour and the user are in a sense the of this data set, and we decided this way because we don't want a huge array in a parent element. In many situations, when we do not really know, how much our array will grow, then it's just best to opt for a parent referencing. now go ahead an implement that. 
tour: {
    type: mongoose.Schema.ObjectId,
    reg: 'Tour',
    required: [true, 'Review must belong to a tour'],
  },
by doing this, each review document now knows exactly what tour it belongs to, while the tour of course doesn't know initially what reviews and how many reviews there are, This is a problem we'll solve a bit later. 
Next up we also should know who wrote this review. 
 user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user'],
  },

Just to finish lets actually add these options to the Schema where we make it so that virtual properties also show up in json and object outputs. 
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
}
All this does is to really make sure that when we have a virtual property, basically a field that is not stored in the database, but calculated using some other values. We want this to also show up whenever there is an output. 
*/
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
const Review = mongoose.mode('Review', reviewSchema);

module.exports = Review;

/*
* lecture 154
* Creating and Getting Reviews
In this video we're gonna continue implementing the review's resource, and this time by implementing an endpoint for getting all reviews and also for creating new reviews. At this point, we're basically just reviewing stuff that we already learned before in previous sections. 
So As a challenge you've to implement both these endpoints, so one endpoint for getting all review, and  one for creating new review. Create a controller file and in their create the controller functions, and also create the routes in a new review routes file, and also create some new reviews and also retrieve them from the database using get all reviews. 

app.use('/api/v1/reviews', reviewRouter);
this router here in this case reviewRouter is basically a middleware that we mount upon this path'/api/v1reviews', so whenever there is a request with a url that start like this('/api/v1/reviews'), then this middleware function here will basically be called. so in there just  slash route / will will be api/v1/reviews
*/

/*
* lecture 155
* Populating Reviews
lets now populate the reviews with both the user and the tour data. So, just like we did on tour, let's now make is so that both the tour and the user will automatically populated each time there is a query for a review. 
When we want to populate two fields, we need to actually call populate twice. so once for each of the fields. 

In reviewModel lets implement our pre find middleware. 
in .pre method we as usual we pass in a function and in that function the this always points to the current query. so we want to populate on the current query, so this.populate(), We will now actually specify the options object because we only wan tto select a couple of fields, not the entire tour, and entire user. 
    path: 'tour', // here tour means, actually we specified exact same name 'tour' fields in Schema, is then going to be one that's populated based on Tour model, because we specified 'Tour' in ref property in tour filed. So in Tour collection then mongoose going to look for documents with the id that we specified. 
    select: 'name', // we only wants the name of the tour. 
And if we want to populate multiple fields, we need to do is to call populate again.
lets' test it.
*/
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name',
  }).populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

/*
* lecture 156
* Virtual Populate_ Tour and Reviews
Pretty advanced mongoose feature called 'Virtual Populate'. 
At this point we've populate the reviews with the tour and the user data. So right now if we query for reviews we get access to that information. However that still leaves one problem unsolved. So,
? How are we going to access reviews on the tours? basically the other way around. 
so let's say that we queried for a specific tour, then how will we get access to all reviews for that tour? And this problem arises here because we did parent referencing on the reviews. basically having the reviews pointing to the tours, not the tours pointing to the reviews. In this case the parent does not really know about its children. so in this example the tour does not know about its reviews. But we actually want the tour to know about all the reviews that it's got. 
Now in order to solve this problem, with what we know at this point we could have two solutions. The first one would be to manually query for reviews each time that we query for tours. But it would be a bit cumbersome doing it manually. And second solution could be also do child referencing on the tours, so basically keep an array of all review id's on each tour document, then we populate that array. 
However there is a great solution for this. That's because Mongoose actually offers us a very nice solution for this problem, with a pretty advanced feature called 'Virtual Populate'. 
So, with Virtual Populate we can actually populate the tour with reviews. So in other words, we can get access to all the reviews for a certain tour, but without keeping this array of id's on the tour. So, think of virtual populate like a way of keeping that array of review id's on a tour but without actually persisting it to the database. And so that then solves the problem that we have with child referencing. So it's a bit like virtual fields, but with populate. 

implementations on tourModel 

we do it on tourSchema and dot virtual(), in virtual we pass a name of virtual field, let's call it reviews, and then an object of some options. the fist one is the name of the model that e want to reference. And so that works just like with the normal referencing. and ref of model will be Review in this case. And also we actually need to specify the name of the fields in order to connect the two data sets. And this is the most complicated part of implementing 'virtual populate'. 
So here we need to specify two fields. The foreign field and the local field. 
foreignField will be the name of field in the other model, in this case in the Review model, where the reference of the current model is stored. So, in Review model we stored the reference of the tour in the tour field. so in this case foreignField will be the 'tour'. SEE REVIEWMODEL.JS FILE. 
And now we need to do the same for the current model. so, we need to say where that id is actually stored in current model, in this case tourModel. and that field is the _id. This _id, which is how it's called in the local model, is called tour in the foreign model(Review model). this is how  we connect two models together. 
Now, with this setup, we can actually use populate just like we did before. And what we want to do now is to go ahead and populate the tour, when we only get one single tour. It means with getTour we should get all reviews corresponding to that tour. We only want to populate into get one tour not in the getAllTours, So, let's do that populate actually in the tourController. 
there all we need to do is to call populate and pass the name of the field that we want to populate. just like this: 
const tour = await Tour.findById(req.params.id).populate('reviews');

This is creating kind of a problem, because this creating a chain of populates, and that's not ideal at all. So, we have the tour being populated with reviews. but then the reviews also get populated with the tour again, and also with the user. and then also the tour is also getting populated with guides. So here we would have a chain of three populates. And so performance, that of course, not ideal at all. 
So the solution that we're going to use here is to actually turn off populating the reviews with the tours. basically we do not need tour data on each review.  In this app it is more logical to really have the reviews available on tours, and it's not that important having the tour available on the review. So let's turn off that populate from the review model. just comment out the populate to the tour, by doing this we still do parent referencing, so we still keep a reference to the tour, but we do no populate it. 

* QUICK RECAP:
We started doing only parent referencing on the review, But that made it so that on the tours, we had no access to its corresponding reviews. And the easiest fix for that would be to also do child referencing on the tours. But the problem with that would be that we do not actually want to keep an array of all the child documents on the parent document, So instead of doing that, we implemented virtual populates. and this allows us to basically do the exact same thing, so keeping a referencing to all the documents on the parent document but without actually persisting that information in the database. And so then after having this virtual populate setup, all we needed to do is to basically use populate just like we did before with the real references. And then finally we also turned off one of the populates that we had on the review, where we populated the tour id.  
*/
// Virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

/*
* lecture 157
* Implementing Simple Nested Routes
In this lecture we're gonna talk about something called nested routes. What they are, Why we need them, and How we can actually implement them in Express.
let's think for a second how in practice, we actually want to create a new review. So up until this point, when creating new reviews, we always manually passed the tour id and the user id into the request body and then created the review from there. That's okay during development, but of course that's not how a review will be created in the real world. 
So, in the real world, the user id should ideally come from the currently logged in user and the tour id should come from the current tour. And that should ideally be encoded right in the route, so int he url. So, when submitting a post request for a new review, we'll want to submit that to a url like this:
Example: POST /tour/434fad434/reviews
ideally we want to  do a post request for tour, and then the id of the tour and then reviews. Just like this we've the tour id right in the url. and the user id will then also from the currently logged in user. In above example, what we see here is now a so-called nested route. and this make a lot of sense when there is clear parent-child relationship between resources. So reviews is clearly a child of tour. And so this nested routes basically means to access the reviews resource on the tour's resource, And in the same way we'll actually also want to access reviews from a certain tour in the same way. GET /tour/443fad434/reviews this would then ideally get us all the reviews fot this tour. we could go even further. and also specify the id of review GET /tour/443fad434/reviews/789jk89 ; 
POST /tour/443fad434/reviews
GET /tour/443fad434/reviews
GET /tour/443fad434/reviews/895fa8

Let's now actually implement this, starting with the POST route. 

Since the route actually starts with tours it will be of course redirected to our tour router. So we're going to have to implement this functionality for now in the tour router. 

// EXAMPLES
// POST /tour/443fad434/reviews
// GET /tour/443fad434/reviews
// GET /tour/443fad434/reviews/895fa8

/tour this /tour part is already mounted this router, so we do not have to repeat it here. Then we've the tour id and then slash reviews, as our example. For clear lets call id to tourId, and the we want to implement the create review. It's not make much sense to actually call the review controller in the tour route, but for now we need to do is like this, because the route starts with tour, in next video we're going to fix that. 
Anyway, we now got our tour id right in the route, but we need to let the controller know that it should now use current tour id, and also the currently logged in user's id. So now need to go ahead and update our review controller. 

right here in create review. and what we're gonna do is this:
if(!req.body.tour) req.body.tour = req.params.tourId;
basically if we didn't specify the tour id and the body then we want to define that as the one coming from the url, 
And the we also need to do the same with the user. so, 
if(!req.body.user) req.body.user = req.user.id; // we'll get the req.user from the protect middleware. 
With this we actually make it so that the user can still specify manually the tour and the user id. What we doing here is simply define them when they are not there, or when they are not specified in teh request.body, so this should be enough for test. 

  In createReview(reviewController)
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

*/
router
  .route('/:tourId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

/*
* lecture 158
* Nested Routes with Express
let's now improve the nested route implementation that we coded in the last lecture. For that we're gonna use a special advanced express feature. In last video we implemented a simple nested post route, here the review route is kind of within the tour rote, because reviews belongs to tours. And this is a very common thing to do in API design. Now the problem with this implementation is that as it is a bit messy, that's because we put a route for creating a review in the tour router. simply because a route starts with slash tour. and that's a bit confusing and what's also confusing is that we have something very similar to this in our review route. 
when we create a new review without the nested route, is actually the same as nested one.LETS TAKE A LOOK AT BOTH ONE WE HAVE IN REVIEWROUTES FILE(UNNESTED ONE) AND TOURROUTES FILE(NESTED ONE)

NESTED ONE
router
  .route('/:tourId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

WITHOUT NESTED
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

? let's now fix this using an advanced express feature called mergeParams.
first, lets remove the nested code from the tourRoutes.js
next up we will import the review router into the tour router. 

In tourRoutes file
keep in mind that router itself is really just a middleware. 
what we do here is to say, that this tour router should use the review router in case it ever encounters a route like this:
router.use('/:tourId/reviews', reviewRouter),
so this is again a mounting a router. That actually what we did in app.js file during mounting routes. When we have a url like this '/:tourId/review' then just use the reviewRouter. Like this we have the tour router and nicely separated and decoupled from one another. But now, there's actually still one piece missing because right now this review router here doesn't get access to this tour id parameter.  So now we need to enable the review router to actually get access to this parameter here as well. let's now go to the reviewRouter. 
And so this is where the magical mergeParams comes into play. 
const router = express.Router({ mergeParams: true });
So, here in the express.router() function we can specify some options, and here all we need to do is set mergeParams to true
? why we need mergeParams: true? 
It's because by default each router only have access to the parameters of their specific routes. but in this route, so in this url for post there is actually no tour id. but we still want to get access to the tour id, that was in this other router. 
For now no matter if we get a route like this, /tour/443fad434/reviews or like this /reviews , it will now all end up in the handler that is in reviewRoutes(reviewController.createReview) and again that works because all of the routes starting with this kind of patterns /tour/k89dk/reviews will be redirected to this router reviewRouter and from there it will match to the exact route('/') router. And thanks to merge parameters we then get access to id of tour, which actually comes from the other router before. (before redirecting to the review root from tourRoutes)

lets test it


*/

// Redirecting to the reviewRouter if the url is like this: (code in tourRouter)
router.use('/:tourId/reviews', reviewRouter);

// This will then get the params(id) from the previous router (code in reviewRouter)
const router = express.Router({ mergeParams: true });

/*
* lecture 159
* Adding a Nested GET Endpoint
In the last two videos we created a nested POST endpoint in order to create new reviews on a certain tour. So, let's now build upon that, and also create a nested GET endpoint. 
We already have our getAllReviews handler function implemented. But right now all it does is to basically get an array of all the reviews in the review collection. Now a common use case for our API might be to get an array of all the reviews of one particular tour, so very similar to the createReview, Basically something like this: GET /tour/34hk12/reviews, 
So all we need to do in order to implement this is to do some simple changes to our getAllReviews handler function, Because right now thanks to the merge params, and redirecting that we implemented, this getAllReviews handler function will now automatically get called whenever there is a GET request for a url that looks like this /tour/43kjk23/reviews, and we will also get access to the tourId. 
  /*
  In getAllReviews handler in reviewController
  let's do some very simple changes here, what we're going to do here is to check if there is a tourId, and if there is one, then we're only going to search for reviews where the tour is equal to that tourId. 
  if(req.params.tourId) then we want to create a filter object, which will then use in find method. If there is a tourId then that id should store in tour property in filter object. then we'll filter the reviews with that id. So then only the reviews where the tour matches the Id are going to be found. So, if it's a regular api call without nested route, then that filter will simply be empty object, and so we're gonna find all the reviews.   
  Let's test it with this nested url: 
  GET {{URL}}api/v1/tours/5c88fa8cf4afda39709c2951/reviews

*/
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);
});

/*
* lecture 160
* Building Handler Factory Functions _Delete
In this video we're gonna be building a handler factory function in order to delete review documents but also documents from all the other collections, all with one simple function. 
So, as I[Jonas] mentioned right at the beginning of this section, adding very similar handlers to all of our controllers will create a lot of duplicate code. Because all these update handlers, or all these delete handlers, or all these create handlers, they really all just look basically the same, right? Also, imagine that we wanted to change like some https status code or status message, then we would have to go into each and every controller and then change all the handlers in there. So, instead of manually writing all these handlers, why not simply create a factory function, that's gonna return these handlers for us? So a factory function is exactly that, It's a function that returns another function, in this case our handler function, for deleting, creating, updating and also for reading resources. This whole concept can be a bit complex. But this kind of logic is what every advanced javascript developer should be able to implement. 

let's implement this first on delete handler. Actually we have one in the tour controller, lets go ahead and copy that one, just to keep it as a reference. and lets' create a new file in a controllers, anc call it handlerFactory.js. we're doing this in a controller folder, because the functions that we're gonna write will basically return controllers. 
Again -the goal here is to basically create a function, which will then return a function that looks like a delete function, that we copied from tourController, but of course not only for the tour, but for every single model that we have in our application and that we might have in the future. 

Ans so what that means is that inside the factory function we will pass in the model. 
lets call this one deleteOne, because this function is not only going to work to delete tours, but also to delete reviews and users. and in future some other documents we might also have. 
We'll pass the model into this function. and we create a new function and that function will right away then return async handler function. This async function will be the complete function that we copied from the tour, basically deleteTour handler.
And so now all we need to do is to actually change from the specific Tour model to the more generic model. so instead of Tour we use a Model that we passed in. 
And also we need to change tour to just document(doc). because we will not know what kind of document is this. So this function will not really know if it is a tour, or review or user...
And that's actually it. So this basically the generalization of this(deleteTour) specific function, which worked only for tours. and now this new one works for every model. 
We need in this file(handlerFactory) to import catchAsync and also AppError. 

And in tourController file we need to import handlerFactory file. 
const factory = require('./handlerFactory')
Now we're ready to test this 

*/
// handlerFactory file:
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

/*
In tourController file
Now new exports.deleteTour will be factory.deleteOne, and then pass in the Model, which is Tour. And that's it,  

QUICK RECAP:
We call this deleteOne function, then in there we pass the model,  and so what's going to happen is that this function(deleteOne) will then right away return handler function that we had before. simply the specific model, which before was the tour, is now going to be replaced with the one that we passed into the function. and by the way this works because fo javascript closures, which a just a fancy way of saying that the inner function will get access to the variables of the outer function, even after the outer has already returned. 
let's check yea it's working.
*/
exports.deleteTour = factory.deleteOne(Tour);

/*
Perfect all working.
And now the goal is to be able to use this handlerFactory in each and every single controller. So let's go the reviews controller, and implement there too. 
IN reviewController file
And so now exports.deleteReview = factor.deleteOne(Review), call with Review model. And that's it. that all we need to implement the deleteReview handler. And of course we also need to specify the route itself in reviewRoutes
router.route('/:id').delete(reviewController.deleteReview);
Let's test it.  Yeah it's also perfect. Let's move to the next one. to the userController
*/
exports.deleteReview = factory.deleteOne(Review);

/*
Now only the administrator should be able to actually delete users because remember that when the user delete himself, then they will not actually get deleted but only active will be set to false. But the admin is really gonna be able to delete the user effectively from the database. But we're going to worry about that permission stuff a bit later. So let's also check it on postman 
DELETE {{URL}}api/v1/users/6550e0512a05a637c0990151
*/
exports.deleteUser = factory.deleteOne(User);

/*
* lecture 161
* Factory Functions _Update and Create
Let's continue creating some factory functions, this time for updating and for creating some resources. And now we already know how it works, it's really simple to just continue doing the same for updating. IN handlerFactor file.

Remember: the arrow function will implicitly return what ever comes after the arrow. 
Copy the updateTour and paste in arrow function, that'll return by arrow function. 
And then replace the specific one(Tour) with a general one(Model). and then replace all of this tour with document(doc). And in response, where we actually send the data, it would be nice to actually give it the property name of the data that we're sending. for example :
data: {
  reviews: doc, OR tours: doc OR..
}
but that's a bit too much work to implement it right now. so we're simply going to leave it like this data: doc
And now this should work now, because everything else is really just the same. Let's test it by simply calling from the tourController, just like this
exports.updateTour = factory.updateOne(Tour);

And also same thing for the user, 
exports.updateUser = factory.updateOne(User);
And again update user function is only for administrators, And only for updating data that is not the password, because, remember whenever we use, findByIdAndUpdate() all the safe middleware is not run. 

And finally also lets put it int eh review controller. 
exports.updateReview = factory.updateOne(Review);
Now we need to the route to updateReview.  

Let's now go ahead and add these routes to postman and test them.
yeah, Updating users is now working for of our three resources using the factory function. And so let's now go ahead and add the next one, which is gonna be createOne. 
*/
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

/*
Once again copy the createTour function from the tourController. 
As usual replace Tour with Model and tour with doc. That's it, in factory function. 
And again call the createOne handler from the tour and review resources, and for user we actually do not need the createOne, because for creating new users,  we already have signup function, and we cannot replace it from the factory function, because it really is different from this generic one. 
exports.createTour = factory.createOne(Tour);
*/

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

/*

But in createReview handler we have some additional step. like here we have: 
if (!req.body.tour) req.body.tour = req.params.tourId;
if (!req.body.user) req.body.user = req.user.id;
So, how can we fix that? 
Well we can actually create a middleware that is going to run before the createReview handler.
So we created setTourUserIds middleware, In this middleware we will set this ids on the body and then move straight to the next middleware, where then the review is actually created. And this middleware in the POST reviewRoutes, just like this:
router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

And the call the createOne function 
exports.createReview = factory.createOne(Review);
*/

// Middleware for createReview, which will set tour and user's id.
exports.setTourUserIds = (req, res, next) => {
    // Allow Nested Routes
 if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

/*
* lecture 162
* Factory Functions_ Reading
Just to finish this part, let's create some factories for getting documents. And let's start with getOne()

exports.getOne, but this one is actually a bit trickier, that's because we have a populate in the getTour handler, which is different from all the other get handlers in the other resources. But this is not really a big problem, because we will simply allow ourselves to pass in a populate options object into our getOne function, So, instead of simply passing in the model, we'll also have populate so options. And so from here we will then return the normal handler function. again copy from the tour Handler. 
Now change the tour and Tour as usual and here we also need some more changes because of populate. So, basically we'll first create the query, and then if there is the populate options object, we'll add then to the query, and then by the end, await that query. 
  let query = Model.findById(req.params.id);
then if there is a populate options object, in that case query should be query.populate(popOptions), And then finally await the query and save it in the document. And that actually it. 

Now let's go ahead and use this one in everywhere in resources. starting wit tour.
*/
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

/*
In getTour call the getOne function and pass the Tour and populate options object. 
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
Remember that the path property is basically the field that we want to populate. and then we could also specify select, which tells which of the fields we actually want to get. but in this case we don't have any of that.  
Just to make sure,lets' quickly test it. 
*/
exports.getTour = factory.getOne(Tour, { path: 'reviews' });

/*
/*
Now lets also use this getOne in all the other resources. So the user controller. Here only with the model, no  populate object options
*/
exports.getUser = factory.getOne(User);

/*
Finally the same thing for the review. And we should add this(getReview) one in our route too.
*/
exports.getReview = factory.getOne(Review);

/*
Now all that's missing is basically a getAll factory function
Now we will actually have to require API features here in handlerFactory. 
As always will replace Tour and tour with Model and doc respectively.
Call it from the tourController and test it to see Is it's working with all these features?
exports.getAllTours = factory.getAll(Tour);
lets test with this query string in url: {{URL}}api/v1/tours?duration[gte]=10&sort=price, To test is all features are still working?  Yeah it's working. 
*/

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(process.env.NODE_ENV);
    // EXECUTE THE QUERY
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: {
        data: doc,
      },
    });
  });

/*
Let's now do the same for the reviews. 
One problem that we have here in review is that the getAllReviews route handler has these two lines of codes that all the other do not have:
let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
But what we're gonna do here is to simply copy these codes(2 lines) and and paste into our handler factory as well. That's kind of hack, because we really only need this one for getAllReviews, but to get around this would be a bit too much work. 
    And this filter, we will then pass it in find as well.

exports.getAllReviews = factory.getAll(Review);

Lets test getAllReviews in postman: {{URL}}api/v1/reviews/ Yeah it's working
Let's now test with query sting in url to test for all features.  So let's try to get all review with a rating of four: {{URL}}api/v1/reviews?rating=4 , yes working...
Just like this we get access to all these API features, like filtering, sorting, pagination, and all that stuff that we implemented long time ago. 

let's finally also use getAll for the userController. 
exports.getAllUsers = factory.getAll(User);

*/
/*
* lecture 163
* Adding a 'me' Endpoint
It's good practice to implement a slash 'me' endpoint in any API, So basically, an endpoint where a user can retrieve his own data. Basically it's gonna be something very similar to updateMe and deleteMe endpoints. let's add this also in userController. 
/*
Now, we still actually want to use the getOne factory function, because otherwise it would be very very similar code in this one. Now the only problem with this is that getOne basically uses the ID coming from the parameter in order to get the requested document. But we want to do here is to basically get the document based on current user id, so the id coming from the currently logged in user, and that way we don't have to pass in any id as a url parameter. How we can do that?
Very simple. all we do here is a very simple middleware which is gonna go like this: In that middleware we're gonna do is to say request.params.id = req.user.id; We will then add this middleware before calling getOne. So let's implement the route for getMe.

In this router we, of course need to be logged in, so we first use protect middleware, and this protect middleware  will then add the user to the current request, which allow us to read the id from that user. Then we call our newly created middleware, to put user id in the req.params.id
Now let's check this: {{URL}}api/v1/users/me
*/
// Middleware
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// Router /me
router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);

/*
* lecture 164
* Adding Missing Authentication and Authorization
So, we're currently in the process of putting some finishing touches on our API, and one of the things that we need to do now is to fix some of the authentication and authorization in all our resources.

And we're gonna start with our tour resource. And since all the authentication and authorization stuff is always defined on the route declarations, well, we're gonna work here on the tour routes file. 
So, the tour API that we have here is basically what we want to expose to the world. So for example, we might want to allow other travel sites to embed our tours into their own websites, and that's what this API is basically for. And there for we will not have any authorization on get tour requests. And so we should actually get rid of the one that we have currently, on getAllTours. Right now we protected getAllTours, and so only authenticated users can use that. but that doesn't make much sense, because we want to expose this part of the API to everyone, so let's git rid of that. However, the actions of creating or editing tours, we only want to allow lead guides and administrators to perform these actions. So, of course, no normal users and no normal guides. So, let's put that. And everything else is free to everyone, But about the get monthly plan, we also might to restrict that, for everyone one except normal users.  
And so that's look perfect at this point. So basically our tour router is now completed. 
---------------
Now move to the userRoutes.
Here in userRoutes the first three routes are open to everyone, so singing up, logging in, forget password and reset password. None of these we needed to be logged in. 
But we need to be logged in(authenticated) to update password, to get own information, to update or to delete our own account. and really for all other operations. So we don't want, the public to basically get information about all the users. and we also don' want anyone to delete users, or to update users, etc. 
So to authenticate all of these we could go ahead and app authController.protect to all of these routes. But actually we can do better than that. 
So in order to do that let's keep in mind that this point this protect function here is just a middleware. and also remember that middleware runs always in sequence. Now this routers that we have here, that we created in the beginning, using express.Routes(), i.e const router = express.Router(); is kind of like a mini application. And so just like with the regular app we can use middleware on this router as well. and so, we can do something like this:
const router = express.Router();
router.use(authController.protect);
That's it, and this will do is to basically protect all the routes that come after this point. this point means here this code[router.use(authController.protect)]; is defined. That's because middleware runs in sequence. So after first four middleware function(signup, login, forgetPassword, resetPassword), the next middleware in the stack is protect, because we defined that one after this four. And this protect will only call the next middleware if the user is authenticated. and next middleware in this case is the patch middleware here. Again what does it means is that, all of these routes, basically all of these middlewares technically, that comes after using protect middleware is now protected. 
That's a nice trick in order to protect all the routes at the same time, simply by using a middleware that comes before all these other routes. 
------
Now all of these actions should only be executed by administrators [getAllUsers, createUser, getUser, updateUser, deleteUser]. and so now we can actually use the exact same technique to do this too. 
router.use(authController.restrictTo('admin'));
And now only admins will be able to perform actions that comes after this code. Now from this point, all the routes are not only protected, but also restricted only to the admin. 
Perfect, that actually finishes the authentication and authorization for users as well. 
----------------
Let's do the same thing for reviews as well. 

The first this we want to do is to basically protect all of the routes which have to do with reviews. So, we want no one who is not authenticated to get, or post, or to change, or to delete any reviews. 
router.use(authController.protect);
So from this point no one can access any of this routes without being authenticated. 
Now let's think about authorization. So first of all, only users should be able to post reviews. Then admins should be able to update or to delete reviews, just like regular users. and finally guides can not add, edit, or delete reviews. since the guides are the ones who performing the job, so it would be weird if they could post reviews themselves or edit other peoples' reviews. 
So, now only way of getting access to data about reviews is to call all of the tours, at least for people who are not authenticated. 

By this we finishes all the authentication and authorization parts of all our three resources. 
*/
 
/*
* lecture 165
* Important Review and User Data
So, before moving on to implementing some more API features, let's now very quickly import the rest of our development data. So, data on users and on reviews. In our dev-data folder we already imported all the tours, but we also have a users(in users.json), and also reviews(reviews.json) there. 
Ans so all we need to do now is to basically import dev-data script. So duplicate read file code in import-dev-data.js file. 
const tours= JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')); 
const users= JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')); 
const reviews= JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
and also require other two modules:
const Tour = require('./../../modules/tourModel')
const Review = require('./../../modules/reviewModel')
const User = require('./../../modules/userModel')

and now then, also duplicate await Tout.create(tours); one for user and one for review.
and also duplicate the code from deleteData functions as well.  await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

? And delete using...s
node ./dev-data/data/import-dev-data.js --delete

? And import using
node ./dev-data/data/import-dev-data.js --import
And here we get the validation error, that's basically because of, we're creating a new user  without specifying the passwordConfirm property. So the solution to this here is to actually explicitly turn off the validation property in this case, when importing new users.  all we need to do is to pass in an additional object with some options. the option we want is this case is validateBeforeSave: false,: So
await User.create(user, {validateBeforeSave: false}); // With this all of the validations in the model basically just be skipped. And also another thing that we need to do in the model is to turn off the password encryption, because the users that we provide already have an encrypted password. so in userModel just comment out all the middleware that we use for encryption. now the password encryption step is also gonna be skipped. 
Now import using:
node ./dev-data/data/import-dev-data.js --import

now remove the comment. so in future the password encryption should work properly. 

let's try to login. with email and password. the password for all of the users is always 'test1234'.  
*/

/*
* lecture 166
* Improving Read Performance with Indexes
So let's now talk a little bit about read performance in MongoDB, Why something called indexes are so important, and how we can actually create them ourselves. 
And we want to start this demonstration about indexes by firing off a simple query on all our tours. 
Let's come to getAllTours on postman and filter with price less than 1000.
{{URL}}api/v1/tours?price[lt]=1000 Here we get 3 results. and then we can actually also get a couple of statistics about the query itself. So, let's go to the handler function(getAll), that is in the handlerFactory, So here, in getAll handler, on the query we'll actually now add an explain method. So after the query we'll call the explain method like this:
const doc = await features.query.explain();

Now let's take look at that on postman. 
! The Complete response with explain method()
{
"status": "success",
"result": 1,
    "data": {
        "data": [
            {
                "explainVersion": "1",
                "queryPlanner": {
                    "namespace": "natours.tours",
                    "indexFilterSet": false,
                    "parsedQuery": {
                        "$and": [
                            {
                                "price": {
                                    "$lt": 1000
                                }
                            },
                            {
                                "secretTour": {
                                    "$not": {
                                        "$eq": true
                                    }
                                }
                            }
                        ]
                    },
                    "queryHash": "BA5856A7",
                    "planCacheKey": "B3444FA9",
                    "maxIndexedOrSolutionsReached": false,
                    "maxIndexedAndSolutionsReached": false,
                    "maxScansToExplodeReached": false,
                    "winningPlan": {
                        "stage": "PROJECTION_DEFAULT",
                        "transformBy": {
                            "__v": 0,
                            "createdAt": 0
                        },
                        "inputStage": {
                            "stage": "SORT",
                            "sortPattern": {
                                "createdAt": -1
                            },
                            "memLimit": 33554432,
                            "limitAmount": 100,
                            "type": "simple",
                            "inputStage": {
                                "stage": "COLLSCAN",
                                "filter": {
                                    "$and": [
                                        {
                                            "price": {
                                                "$lt": 1000
                                            }
                                        },
                                        {
                                            "secretTour": {
                                                "$not": {
                                                    "$eq": true
                                                }
                                            }
                                        }
                                    ]
                                },
                                "direction": "forward"
                            }
                        }
                    },
                    "rejectedPlans": []
                },
                "executionStats": {
                    "executionSuccess": true,
                    "nReturned": 3,
                    "executionTimeMillis": 0,
                    "totalKeysExamined": 0,
                    "totalDocsExamined": 9,
                    "executionStages": {
                        "stage": "PROJECTION_DEFAULT",
                        "nReturned": 3,
                        "executionTimeMillisEstimate": 0,
                        "works": 14,
                        "advanced": 3,
                        "needTime": 10,
                        "needYield": 0,
                        "saveState": 0,
                        "restoreState": 0,
                        "isEOF": 1,
                        "transformBy": {
                            "__v": 0,
                            "createdAt": 0
                        },
                        "inputStage": {
                            "stage": "SORT",
                            "nReturned": 3,
                            "executionTimeMillisEstimate": 0,
                            "works": 14,
                            "advanced": 3,
                            "needTime": 10,
                            "needYield": 0,
                            "saveState": 0,
                            "restoreState": 0,
                            "isEOF": 1,
                            "sortPattern": {
                                "createdAt": -1
                            },
                            "memLimit": 33554432,
                            "limitAmount": 100,
                            "type": "simple",
                            "totalDataSizeSorted": 4846,
                            "usedDisk": false,
                            "spills": 0,
                            "inputStage": {
                                "stage": "COLLSCAN",
                                "filter": {
                                    "$and": [
                                        {
                                            "price": {
                                                "$lt": 1000
                                            }
                                        },
                                        {
                                            "secretTour": {
                                                "$not": {
                                                    "$eq": true
                                                }
                                            }
                                        }
                                    ]
                                },
                                "nReturned": 3,
                                "executionTimeMillisEstimate": 0,
                                "works": 10,
                                "advanced": 3,
                                "needTime": 6,
                                "needYield": 0,
                                "saveState": 0,
                                "restoreState": 0,
                                "isEOF": 1,
                                "direction": "forward",
                                "docsExamined": 9
                            }
                        }
                    },
                    "allPlansExecution": []
                },
                "command": {
                    "find": "tours",
                    "filter": {
                        "price": {
                            "$lt": 1000
                        },
                        "secretTour": {
                            "$ne": true
                        }
                    },
                    "sort": {
                        "createdAt": -1
                    },
                    "projection": {
                        "__v": 0,
                        "createdAt": 0
                    },
                    "limit": 100,
                    "$db": "natours"
                },
                "serverInfo": {
                    "host": "ac-5kvwmjl-shard-00-01.njixesy.mongodb.net",
                    "port": 27017,
                    "version": "6.0.11",
                    "gitVersion": "f797f841eaf1759c770271ae00c88b92b2766eed"
                },
                "serverParameters": {
                    "internalQueryFacetBufferSizeBytes": 104857600,
                    "internalQueryFacetMaxOutputDocSizeBytes": 104857600,
                    "internalLookupStageIntermediateDocumentMaxSizeBytes": 16793600,
                    "internalDocumentSourceGroupMaxMemoryBytes": 104857600,
                    "internalQueryMaxBlockingSortMemoryUsageBytes": 33554432,
                    "internalQueryProhibitBlockingMergeOnMongoS": 0,
                    "internalQueryMaxAddToSetBytes": 104857600,
                    "internalDocumentSourceSetWindowFieldsMaxMemoryBytes": 104857600
                },
                "ok": 1,
                "$clusterTime": {
                    "clusterTime": "7301027035458043908",
                    "signature": {
                        "hash": "a43srN1eG2AGDbKFbEtdBGeYtN8=",
                        "keyId": "7262094376690515970"
                    }
                },
                "operationTime": "7301027035458043908"
            }
        ]
    }
}
And now we get a completely different result, which is basically these statistics, there is a lot of stuff there. But we're really interested in is the executionStats field. But what's really important to note here is that the number of documents that were examined is 9. And so this means that mongodb had to examine/scan all of the nine documents in order to find the correct three results, so the three documents that matches the query. And that's not efficient at all. Now of course at this scale, with only nine documents it makes absolutely no difference. but if we had 100 of 1000s or ever millions of docs here, then this would significantly affect the read performance of this query. So here we really need to learn about indexes. Because with indexes, we'll be able to kind of solve this problem. 
!Remaining, let's leave for tomorrow. gd ni8 14/11/2024 | 12:27PM

So, we can create indexes on specific fields in a collection. for example mongo automatically create an index on the id field by default.  let's see that, in compass we've the indexes tab. We see there by default we've an id index. And this id index is then basically an ordered list of  all the ids that get stored somewhere outside of the collection. And this index is extremely useful, because whenever documents are queried by the id mongodb will search that ordered index instead of searching through the whole collection and look at all the documents one by one. So again, without an index, mongo has to look at each document one by one. but with an index on the field that we're querying for, this process becomes much more efficient. So, that's pretty smart.
We can set our own indexes on fields that we query very often. So, let's actually do that with the price field that we jus queried for before, because that is one of the most important that people will query for. So, we need to go to the tour model. 

/*
In tour model, let's do it right after the Schema declaration.
tourSchema.index(), and in the index method, we'll pass in an object with the name of the field, where we want to set the indexes. in this case the field gonna be price. and set the price to either one or minus one. One means that we're sorting the price index in an ascending order, while the minus one stands for descending order. And there are actually other types of indexes as well, like for text, or for geospatial data, we'll see that a bit later.
tourSchema.index({ price: 1 });
let's test this!! yes, here number or returned documents are still 3 but number of examined are also only 3. So, that proves that with this index, we basically achieved exactly what we wanted. So, before we had to scan through all of the 9 documents and now the engine only needs to scan the only 3 documents, that are actually also returned. because their prices are now ordered in that index. and sos that makes it much easier and much faster for the mongodb engine to find them. And so this is of course a huge performance gain.
Another thing that we might notice, from indexes tab, is how the id index, says unique here. And so unique is also a property that we can give to indexes. And this is actually the reason, why the ids have always to be unique. simply because index of the id has a unique property. 
we also see that their is also an index for name as well, in indexes tab. But we didn't actually create that manually ourselves. right? It's because in our Schema definition, we set the name field to be unique. And so what Mongoose then does behind the scenes in order to ensure the uniqueness of this field is to create a unique index for it. So, because of that not only the id, but also the name always hae to be unique. 

So, when all we ever do is to just query for one single field alone, then a single field index is perfect, because the index that we just set before is called single field index. But if we sometime query for that field, combined with another one, then it's actually more efficient to create a compound index. So one with two fields and not just one. 
So lets's create a query for that. And so another field that going to queried for all the time is the ratings average. So the ratingsAverage with Price.
?price[lt]=1000&ratingsAverage[gte]=4.7
So, by this query, we get 2 results, so no. of docs that match this query is 2, and we still had to examine/scan three documents. So, here we gonna use compound index. Here all we need to do is to add the second field(ratingsAverage). and let's put this one in descending order.
tourSchema.index({ price: 1, ratingsAverage: -1 });
Now let's check, 

And this compound index that we just created is also going to work when the query for just one of these two fields individually. 

? How do we decide which field we actually need to index? And why we don't set indexes on all the fields?
Well, we kind of used the strategy that I used to set the indexes on the price and on the average rating. So, basically we need to carefully study the access patterns of our application in order to figure out which fields are queried the most and then set the indexes for these fields. For example, we're not setting an index on the groupSize. because we know that most people will not query for that parameter, and we don't need to create an index there. 
We don't want to blindly set indexes on all the fields. And the reason for that is each idex actually users resources and also each index needs to be updated each time that the underlying collection is updated. 
So, in summary, when deciding whether to index a certain field or not, we must kind of balance the frequency of queries using that exact field with the cost of maintaining this index. and also with the read-write pattern of the resource. However just like it is with data modeling, there are not really hard rules here. it's all bit fuzzy. we always needs some experimentation.

There's just one more index that we actually want to set here, which is for the tour slug. Because later on we will actually want to use the unique slug to query for tours. So meaning that the slug will then probably become the most queried field. And so it makes all the sense to also have an index for that one. So:
tourSchema.index({slug:1}); Most 1 0r -1 is not that important, like here. 

So, that's the power of indexes. They really can make our read performance on databases much, much better. And so, in our own applications we should really never ignore them. 
Before finish lets remove the explain method that we put in handler function. 
const doc = await features.query.explain();

*/

/*
* lecture 167
* Calculating Average Rating on Tours [PART-1]
? Remember how we've a field for the average rating on each tour document? Well up until this point that filed doesn't really hold any meaningful data. But so let's now actually change that anc calculate average ratings in this lecture.
So, storing a summary of a related data set on the main data set is actually a very popular technique in data modeling that we hadn't actually mentioned yet. And this technique can actually be really helpful in order to prevent constant queries of the related data set. So, in our application a great example of this technique is to store the average rating and the number of ratings on each tour, so that we don't have to query the reviews and calculate that average each time that we query for all the tours. For example, that could become very useful for a tour overview page in our front-end, where we really do not want to display all the reviews, but still want to show a summary of these reviews. like the number of ratings and the average.
And actually we already have the fields for that in our tour Schema, so we've the ratingsAverage and the ratingsQuantity. But right now they'r only just some numbers, and of course, they are not the actual average. because we never really calculated that at any point till now.
So, right now we're gonna calculate the average rating and also the number of rating of a tour each time that a new review is added to that tour, or also when a review is updated or deleted, because that's exactly the situations when the number or the average might change. So,
? How are we actually going to implement this?
well, back here in the review model we're gonna create a new function which will take in a tourId and calculate the average rating and the number of ratings that exist in our collection for that exact tour. Then in the end the function will, even update the corresponding tour document. Then in order to use that function we'll use middleware to basically call this function, each time there is a new review or updated or deleted. let's now start by writing that function. and for that we're actually wrote a static method on our schema, and that's a feature of Mongoose that we hadn't used yet. We only used instance method, which we can call on documents and they are also very useful, but this time we're really going to use static methods in reviewModel file. 
These can be called on the model directly. for example on the Review model, Review.calcStats()
----
And the way this works is of course reviewSchema.statics.calcAverageRatings() = function(){}, this function remember takes in a tourId. and that id is of course for the tour to which the current review belongs to. so, in order to now actually do the calculation we will again use the aggregation pipeline. let's remember that in our tour controller, we used the aggregation pipeline to also create some statistics. so we used the aggregation pipeline, which we called directly on the model. So, now in our instance method, we can actually do the exact same thing. 
So, in the static method, the this keyword actually points to the current model. so we can use this.aggregate(). Remember we need to call the aggregate on the model directly. And that's exactly why we're using a static method here in first place, because 'this' points to the model and we need to call aggregate always on the model. 
So into aggregate we need to pass in an array of all the stages that we want in aggregate. So what do we want to do first? 
Well the first step should be to select all the reviews that actually belong to the current tour that was passed in as the argument.
So our first stage is a match stage, and in there we pass our filter object. $match: { tour: tourId }, like this we only select a tour that we actually want to update. 
Now in the next stage let's actually calculate the statistics themselves. And for that we use a group stage. And in the group phase remember the first field that we need to specify is the _id, and then the common filed that all of the documents have in common that we want to group by and so that's again going to be the tour. so just like in our previous statistic calculation example where we group all the tour by their difficulty.
Now the number of ratings(nRating) will be the number of tours that we have, so each tour that was matched in the previous step. All we do is to basically add one for each tour that we have. So if there are five review documents for the current tour, then for each of these documents one will get added. so then in the end the number of ratings will be five. and again, because of course we have five review documents for the current tour. 
Then also the average rating, which just like before we use the $avg operator, with the name of the field, for which we want to find average. 
ant that's actually it. So the number and average of ratings is exactly that we wanted to calculate in this aggregation. 
Now keep in mind that this actually returns a promise, so we need to await that and store in into a variable called stats.
And now we actually need to use that stats variable. And for now all I really want to do just to test this is to actually log the statistics to the console. console.log(stats); In the later steps we actually wants to then update the tour document with these statistics. 
For now we actually need to call this method somewhere, because otherwise these statistics will never be called. And remember I said in the beginning, we'll that using middleware each time that a new review is created. So let's implement that. 
reviewSchema.pre('save', function(next{

})
And remember in this kind of middleware the this keyword points to the document that is currently being saved. 
So we will want to call the calcAverageRating function using this.tour, 
? Now how are we actually going to call this function? 
Remember how I said that this function is available on the model. Basically like this Review.calcAverageRatings(), then we want to pass in this.tour, because 'this' points to current review, so here here 'this' is a current review and tour is the id of tour on which this review belongs to. So this.tour is then the tour id, that we're gonna pass in the calcAverageRatings.
  Review.calcAverageRatings(this.tour);
Now the problem is that at this point here in the code, the review variable is not yet defined. You might think tht simple solution would be the move the middleware after the review declaration. But unfortunately that's not going to work, because just like in Express this code basically runs in the sequence it is declared. Ans so if we were to put this middleware after the review declaration then this reviewSchema here would not contain this middleware. because then we only be declaring it after the review model was already created. 
But there is fortunately still a way around this, and that is to use this.constructor  and so this here still point to the model, basically this keyword point current document and the constructor is the model who created that document. So here this.constructor stands for the Review, so we can then simply do it like this: 
this.constructor.calcAverageRatings(this.tour);
And that's actually it. So let's now go ahead and test this. And for doing that we'll create a new tour first, because tht other ones that we already have average and number of ratings already calculated. Now in order to create a new review we actually need to logged in as a regular user, Now we create a new review on the tour that we just created.
Here we get some unexpected values, that's just because we should use the post middleware instead of pre. because at pre-save the current review is not really in the collection yet. and so $match stage shouldn't be able to then appear int the output. because again at this point it's not really saved into the collection just yet. So it's best to use post here, because at that time all the docs are already saved in the database. 
And in the post middleware does not get access to next. 
Now here's the output of console.log(stats);
[
  {
    _id: 6553b551f9282f5da05c45b0,
    nRating: 3,
    avgRating: 4.333333333333333
  }
]
So, we're now correctly calculating the statistics, but of course they're not yet being persisted to the current tour document. So if we see in compass on the tour that we just created and added reviews to it. then on this tour, it still has default values 4.5 and 0, So now it's time to actually persist the calculated statistics into the tour document. 
*/
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  console.log(stats);
};

// Middleware
reviewSchema.post('save', function () {
  // this point to current review
  this.constructor.calcAverageRatings(this.tour);
});

// const Review = mongoose.model('Review', reviewSchema);

// -----------
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  console.log(stats);
  /*
And so let's do that. And first of all, in order to be able to do that we need to require the tour model here in reviewModel. 
Now what we need to do is to basically find the current tour and then update it. the id is of course tourId, that was passed in into the function and then an object of the data that we actually want to update. let's get these fields name for update[ratingsQuantity, ratingsAverage]
Now if we take a look at the stats, that we logged above, we see that they are stored in an array actually. So, we need to first position of that array, where this object is. 
now we also need to await it. As always this return a promise and so we can await it. and could also store the result of this to a variable but we don't really need the tour at all, all we need to do is to really update it. so we don't store the resolved value of the promise anywhere. 
-- Now comes the moment. Let's test it. yes indeed it worked. Perfect that's awesome, absolutely fantastic. 
*/
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating,
  });
};

/*
QUICK RECAP: we started by creating a static method, so the entire calcAverageRatings function, to basically create the statistics of the average and number of ratings for the tour Id for which the current review was created. And we created this function as a static method, because we needed to call the aggregate function on the model. So, in the static method to 'this' keyword calls exactly to a method. So we constructed our aggregation pipeline here where we selected all the reviews that matched the current tour id, and then they're calculated the statistics for all of the reviews. then after that was done we saved the statistics to the current tour, then in order to actually use this function we call it after a new review has been created, for that we need to use this.constructor, because this is what point to the current model. 
Now keep in mind that we said that we also want to update the statistics whenever a review is edited or deleted. That's for next video.
*/

/*
* lecture 168
* Calculating Average Rating on Tours [PART-2]
this is part two of calculating the review statistics, this time, for when a review is updated or deleted. 
And this part is actually a bit harder, because keep in mind that a review is updated or deleted using findByIdAndUpdate and findByIdAndDelete, and so for these, we actually do not have document middleware but only quey middleware. And so in the query, actually don't have direct access to the document in order to then do something similar to what we did before, like this.constructor.calcAverageRatings(this.tour);
Because, remember we need access to the current review, so that from there, we can extract the tour Id, and then calculate the statistics from there. but again for these hooks(findByIdAndUpdate/Delete) we only have query middleware. 
But let me now show you a nice trick to actually go around this limitations. So we're going to implement a pre-middleware for there events/hooks(findByIdAndUpdate/Delete)

In pre again we're going to use regular expression for a string starting with findOneAnd, and so this gonna work for findOneAndUpdate&Delete, because remember that behind the scenes findByIdAndUpdate is just a short hand for findOneAndUpdate with the current Id. Here we actually need to use the findOneAndDelete and findOneAndUpdate middleware hooks.
Remember that the goal is to get access to the current review document, but here the 'this' keyword is the current query. 
Now how are we going to go around this?
Well, we can basically execute the query, and then that will give us the document that's currently being processed. So, in order to do that we can use findOne, then all we need to do is to await this query and then save it in a variable called r.  
And just to make sure that this works here, let's for now just log this to the console. console.log(r); without doing any calculations all we're really interested in is to see if this nice trick works. the trick of going around that in a query middleware, we only have access to the query. we need to get access to the doc, so we basically executed this query. this.findOne(); So let's update any review
Yeah, here is the review document, now of course the review not updated to new one that we changed from body, because this findOne really gets the document from the database, and so at this point of time in pre it still didn't persist any changes to the database, ans so it was five before.  But that doesn't really matter here, because all we're interested in the id of tour, which is stored in tour field of the review document. that's what we gonna need in order to calculate the average ratings. And so let's actually use that function. 
? Let think about this. because if we were to use this calcAverageRatings function at this point and time then we would calculate the statistics using the non-updated data, because of we're using pre, and that's the exact same reason why up there we use post instead of pre. because only after the document is already saved to the database it makes sense to then calculate the ratings. So, here it's the exact same thing, with the bi difference that we cannot simply change this pre to post. Because at this pont and time we no longer have access to the query, because the query has already executed, quey mean this.findOne() to get the current review document, so without the query we cannot save the review document. and we can then not run this calcAverageRatings func. 
This is really confusing, but I really decided to create this lecture in this way because, It's really the only solution around this problem, and it's really great exercise to understand this life cycle.  
So, the solution for this is to now use post after the pre. so we use first pre for query and for post calculate the average. because in post the the review should updated in the database. so this is the perfect point and time where we can then call calcAverageRatings function. 
? But where do we now get the tour Id from? in post hook.
Well, we're gonna have to use a trick which is basically to pass data from the pre-middleware to the post middleware. And so instead of saving the await this.findOne() in r variable, we're gonna save it to this.r, so basically we create a property on 'this' keyword. and so in post-middleware we still has access to that r property on 'this'.
So in calcAverageRatings function we pass this.r, remember this.r is a review, that we store from pre-middleware. so we pass this.r.tour.

Now again we need something like this'this.constructor' in order to actually call this callAverageRatings function. because that this in fact is a static method, and so we need to call it on the model. Now where is this model in this case. Well it's at the this.r, which is this time equivalent to this 'this' in this.constructor in above post-middleware, so here this.r.constructor, 
Remember: HOW WE PASS THE DATA FROM THE PRE MIDDLEWARE TO THE POST MIDDLEWARE.
And so in post we retrieved the review document from 'this' variable. 
? Why we do this way? 
Because in pre the query is not yet updated in database, so it will give the average of the existing before current update, and we also not use await this.findOne(), because query is already executed.

By this we should actually now be ready to test this. 
Yep indeed, it's working, and also stored in database. It's working on update, let's now test for deleting.

With deleting the last review we get an error here, message: "Cannot read properties of undefined (reading 'nRating')", that's in calcAverageRatings at line 69, ratingsQuantity: stats[0].nRating, this line creating a problem, So we're trying to read number of rating of undefined. stats[0] is basically undefined. that's because if there are no document matching by this $match stage, then we simply get an empty array, 
So we should only execute this piece of code here whenever we actually do have something in the stats array. So we simply use if block here. 
and if not, basically when if condition is not true then, basically that means that all our review are gone,  So, we want to go back to the default ones, that we specified in the Schema.
Now now we no longer get an error. 
* QUICK RECAP:
In order to be able to run this function[calcAverageRatings] also on update and on delete, we actually need to use the query middleware that mongoose gives us for these situations. So, we do not have a handy document middleware, which works for these functions, but instead we need to use the query middleware, and that one we do not directly have access to the current document. And so we need to go around that by using findOne, and so basically retrieving  the current document from the database. We then store it on the current query variable 'this', and by doing that we then get access to it in the post middleware, And it's then only in the post middleware, And it's then only in the post middleware where we actually calculate the statistics for reviews. And remember that we do it like that way, because if we did it right in pre middleware function, then the underlying data would not have been updated at that point. ans so the calculated statistics would not really be up to date. So, that's why we used this two-step process here. 

We do this functionality here because i want to show, how to work with all these different middlewares in different situations whenever needed in real world. 
*/
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

/*
* lecture 169
* Preventing Duplicate Reviews
In this video we're gonna use a simple trick in order to prevent users from writing multiple reviews for the same tours, So, basically preventing duplicate reviews. So, in the last video we created all the reviews in order to calculate the averages, and we created multiple reviews for one tour, all from the same user. But in practice, that doesn't  make much sense, So, in the real world each user should only review each tour once.
Basically a duplicate review happens when there is a review with the same user ad the same tour Id. And that's what we want to avoid from happening. 
And the obvious solution here is to just use a unique index. However it's not enough to set both fields to unique. And actually that would really be very wrong, because that would mean that each tour can get only one review and each user can only write one review. What we do need is them both together to be unique. So the combination of user and tour to be always unique. that sounds a bit complicated, but luckily for us, that's actually very easy to achieve with indexes. So, we already created a compound index on the tour before, and so now let's do the same here on the reviews. Again right here after the schema definition in reviewModule.

reviewSchema.index({ tour: 1, user: 1 }); that's a similar to what we did before, but here we're going to take it to the next level. 
And now add an object for options. and the options here that we're gonna set is unique to true. and that's it. This will achieve exactly what we want. Now each combination of tour and user has always to be unique, and test it.
But it actually it might now work right away, because sometimes this kind of index doesn't get set immediately. 
There is just one more thing that I want to show you, and so for that, I'm going to log in as yet another person, 
Here if we see at ratingsAverage, here it's 4.6666666666, which is not looking good so we will fix that in the front end. for example when we request data from the api, and then display it.  But actually we want to do it right here on the back end. so the end user already gets this rounded value. in this case would be 4.7.
And for doing that, I'm gonna show you a small new feature in mongoose that we didn't use yet. So, let's go to our tour Model. and on that ratingsAverage field we can use a setter function.

set: 
this setter function will be run each time that a new value is set for this field. So here we usually specify a callback function, which receives the current value. in this case, it returns this value, but rounded. But the problem with Math.round() is that it rounds values to integers. for example if we had something like this 4.66666. then it will round to 5, but that's not what we want. we want to be rounded to 4.7 
so we're gonna use a trick here, which is quite common, so multiplying this by 10, that will be 46.6666 and round of this will then 47, then we divide result by 10 again. then that will be 4.7
set: val => Math.round(val *10)/10; that's it. 
set: (val) => Math.round(val * 10) / 10,
*/
/*
* lecture 170
* Geospatial Queries _Finding Tours Within Radius
In this lecture, we're gonna learn about geospatial queries in order to implement a really cool feature, which is to provide a search functionality for tours with in a certain distance of a specified point. So let's say you lived in a certain point and wanted to know which tours start at a certain from you, like 250 miles, because you don't want to drive further than that in order to start your tour experience. so that would be an awesome feature, and that's actually a really nice use case of geospatial queries. 
And in order to implement something like this, here in our tour router, we could create a nice route, something like this: 

router.route('/tour-within')
we call this one /tours-with then we also need to specify the distance. so therefor we crate a distance parameter, Next we also need to specify the center, basically the point where we live, and then lat and lng. so basically into this variable here(latlng) , we want to pass in the coordinates of the place where we are. Let's say we live in Islamabad and wanted to find all the tours within a distance of 300 miles. so in distance will be 300, and then in latlng we put the coordinates of where we live, Then, let's also provide the options of specifying the unit. so if this distance is in kilometers or in miles. unit and unit as a parameter. 
Now this way of specifying a url is something that we never did before. So basically saying here center and slash: and then putting the longitude and latitude after that and then slash unit, and then after that the queries parameter. And of course we could also make it so that user should specify all of these options using a query string, but this way it looks way cleaner and it's also kind of a standard way of specifying URLs, which contains a lot of options. What I was saying that instead we could do it like this:
tours-distance?distance=434&center=-30,43&unit=mi 
But instead we want to specify like this:
/tour-distance/233/center/-30,43/unit/mi

Anyway we need a route handler, and that's gonna be at tourController.getTourWithin
let's now go ahead an implement this handler in tourController.

*/
router.route(
  '/tour-within/:distance/center/:latlng/unit/:unit',
  tourController.getToursWithin
);

/*
'/tour-within/:distance/center/:latlng/unit/:unit'
/tour-within/233/center/-30,43/unit/mi


let's start by getting all parameters. 
So, let's use a simple destructuring, in order to get all our data at once from the parameters. 
const { distance, latlng, unit } = req.params;
On req.params we've .distance, .latlng, and .unit, because these are the names of the three parameters that we specified here. 
Next up, let's actually get all coordinates from this latlng variable. and 32.43, 54.43 is the format that we expect the two coordinates, that makes it really easy to copy this data from google maps. So this(34.34, 43.23) is the format that we expect the latitude and longitude. And so let's now create one variable for each of them.  one for latitude and one for longitude
Here in params latlng is a string, so we use split by comma, then it will create an array of two elements, and now we cna again use destructuring in order to save these in two variables that we're interested in. 
const [lag, lng] = latlng.spit(',');
Next up, we want to test if we actually have the latitude and longitude variables defined, because if not, then it means the user didn't specify in the required format. So, if not lat or no lng, then we want to create an error, 
Now let's see the values of all variables, console.log(distance, lat, lng, unit);
{{URL}}api/v1/tours/tour-within/233/center/-30,43/unit/mi 
yeah we get the all the values [233 -30 43 mi] that we specified in the url.

Now it's time to actually write the query itself. Now a geospatial query actually works quite similar to a regular query. So we're still going to write tours = Tour.find(), 
Now all we need to do is to specify our filter object here in the find method. 
Remember that we basically want to query for start location, because the start location field is what holds the geospatial point where each tour starts, and so that's exactly what we're searching for. 
So, in startLocation we need to specify the value that we'e searching for. And for that we will now use a geospatial operator called  $geoWithin, and this operator does exactly what it says. so it finds documents with a certain geometry. And that geometry is what we need to define as a next step. 
So, we want to find documents, but where do we actually want to find these documents? Well, we want to find them inside of a sphere that starts at this point that we defined in latlng and which has a radius of the distance that we defined. So in our example in Islamabad if we specify the distance of 250 miles, then that means we want to find all the tour documents within a sphere has a radius of 250 miles. 
And so now we need to pass the information here into the geoWithin operator. And we do that by defining a $centerSphere. And centerSphere operator takes an array of coordinates and the radius. Let's now define the coordinates here in the array, and for that we need yet another array. and then lng and lat. Here we first need to always define the longitude and then latitude, which is a bit counterintuitive, because usually coordinate pairs are always specified with the lat first and then lng. 
Remember a $centerSphere will takes 3rd operator, a radius, but here we have center in radius, Now here we actually do not pass in the distance, but instead a mongodb expects a radius in a special unit called radians.
So, first we define a radius in a variable, So, the radius is basically the distance that we want to have as the radius, but converted to a special unit called radians. And in order to get the radians, we need to divide our distance by the radius of the earth. Also converting to radian we need take a consideration our units here, because of course the radius of the earth is different in miles then in kilometers. 
So let's now do a turnery operator here, and say that if the unit is equal to miles.. 3963.2, this is the radius of the earth in miles, 6378.1, this is in km. 
All right, so this kind of crazy conversion here is necessary because normally mongodb expect the radius of our sphere to be in radians. And in radians we get by dividing the distance by the radius of the earth. Now we're almost ready to test this now. 
One very important thing is that we actually in order to be able to do geospatial queries, we need to first attribute an index to the field where the geospatial data that we're searching for is stored. So, in this case, we need to add an index to startLocation field in tour model. so let's do that in tour model. 

 but now we're actually not going to set 1 or -1, because this time it's a different index that we need. So for geospatial data, this index need to be a 2D sphere index if the data describes real points on the earth like sphere, Or instead we can also use 2D index if we're using just fictional points on a simple two dimensional plane. Now in this case of course, we are talking about real points on the earth's surface, so we're going to use a 2D sphere index here. so, startLocation:'2dsphere', And with this we're basically telling mongodb that this startLocation should be indexed to a 2D sphere, so, an earth like sphere where all our data are located.
  tourSchema.index({ startLocation: '2dsphere' });

Now we're ready to test on this route:
{{URL}}api/v1/tours/tour-within/400/center/34.111745,-118.113491/unit/mi
Yes, we got 3 results here, because 3 tours are starts withing 400miles of radius from the latlng, that we specified. But how can we really know that it's true?
Well, actually we can use compass for this. On compass we've something really nice, which is Schema tab. and analyze the schema. Now here we've a nice summary for all of our fields. we're really interested in startLocations. Now we would see a map here, but right now there is no map because we have a document right now which doesn't have a start location. So in order to this to work properly we need to get rid of that document, it's one of the testing documented that we create for test. yeah, now we have map on startLocation. 
And now here we can actually replicate that query using this graphical interface. 

! Let's take a look at documentation of MongoDB, specially at Geospatial operators. 

*/
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

/*
* lecture 171
* Geospatial Aggregation _ Calculating Distances 
In previous video we searched for tour documents within a certain distance from a certain point using geospatial queries. Now in this lecture, let's use geospatial aggregation in order to calculate distances to all the tours from a certain point. And so, just like before let's actually start by defining the route so that we know which data we're going to be working with. 

distances/ and then the data that we need is the latitude and longitude of the point where the user currently is, and then let's alo allow user to specify the unit. This time we do not need the distance parameter, as we had before in previous one, because we're not gonna be searching for a certain radius. We're really gonna calculate the distance from a certain point to all the tours that we have in our collection.
router.route('distances/:latlng/unit/:unit').get(tourController.getDistances);
*/
router.route('distances/:latlng/unit/:unit').get(tourController.getDistances);

/*
So, the beginning of this getDistances function is actually quite similar to the getToursWithin one. we have some similar units, then we also need to get the latitude and longitude, and we also need to create the error if there is no latitude or longitude. 
Next up, let's now do the actual calculation. So, just like before in order to do calculations we always use the aggregation pipeline. and remember that is called on the model itself, here on Tour. so, Tour.aggregate(), and let's await and save it into the distances variable. 
And remember in aggregate method we passed in an array with all the stages of the aggregation pipeline that we want to define. 
Now for geospatial aggregation there is actually only one single stage, and that's called $geoNear, so this is the only geospatial aggregation pipeline stage that actually exists, This one always needs to be the first one in the pipeline. 
!So, keep that in mind, that $geoNear always need to be the first stage. And also it requires at least one of our fields contains a geospatial index. Actually we already did that before, let's take a look so, our startLocation already has 2dsphere geospatial index on it. And since we're using this startLocation field in order to calculate the distances, that's then perfect.
so, if there's only one field with geospatial index then this $geoNear stage will automatically use that index in order to perform the calculation. But if we have multiple fields with geospatial indexes then we need to use the keys parameter, in order to define the field that we want to use for calculations. But in this case we've only one field and so automatically that startLocation field is going to be used for doing these calculations. 
? So, what do we need to pass into gerNear?
first we need to specify the near property, and near is the point from which to calculate the distances. So, all the distances will be calculated from this point that we specify here in near property. So all the distances will calculated between the points we specify in near property and the all startLocations. And so this near point here is of course the point that we pass into this function with the latitude and longitude that comes in url. Now we need to specify this point as geoJson, so that's just like we did before, where we need to specify type property as 'Point', and then specify the coordinates property. And as always the first coordinates here is the longitude, then latitude. And let's multiply both of them by 1, simply to convert it to numbers. 
So near is the first mandatory field in $geoNear stage, and the second one is the distanceField property.  
And distanceField is the name of the field that will be created and where all the calculated distances will be stored. let's simply call this one 'distance'
Actually, that's it. That's all the field that are mandatory in $geoNear stage, and of course we can add other stages after $geoNear, we'll do that bit later, but now want to really see the results of this...
Here we've an error, saying geoNear always need to be the first stage in a pipeline, But if we now take a look at the code, we might think that actually our geoNear stage is currently the first stage in our pipeline, because in our aggregate pipeline there is nothing before the $geoNear stage. So why???? 
? So why do we get this error that $geoNear is not first stage in the pipeline? 
"Actually it took me a bit of time to figure this out" -Jonas, Because this has something to do with a piece of code that we wrote a long time ago. That's in tourModel, there we have an aggregation middleware, and remember that what that middleware did is to actually always add the $match stage that we specify there in all the other stages. So we have the first stage a $match, that comes from the aggregation middleware and then as a second stage we've  $geoNear, so it actually makes sense that we get that error. 
Now we could go ahead and change this middleware, and say that if geoNear is the first operator in the pipeline that simply do not do this there, -do not do this $match stage there. But that's a bit too much work for that use case, so all we're gonna do is to get rid of that middleware, simply comment out.  
Now we get our tours, and it should have that distance field that we add by distanceField property. yes, indeed we have distance property with a huge big number as a value. It is this big number, because actually it's calculated in meters. so now the distance is in meters, 
So let's first of all convert this one to kilometers. Later on we will then also convert it to miles because we specified the unit to miles. but for now the easiest solution  is to actually convert it to kilometers, because all we have to do for that is to just divide it by 1000. 
And also what we want to do is to only really get the distances, and the name of the tours. so get rid of all the other clutter the we have in response and really on focus on the distances themselves. So for that we use the $project stage. 
So let's add $project stage as a second stage, in their we need to specify the name of the fields that we want to keep. in this case only distance and name. 
And now let's basically divide the distance by 1000 in order to convert these meters to kilometers. Actually it's very easy to do that, because in a geoNear stage we can actually specify the distance multiplier property. So, distanceMultiplier:0.001  In here we will specify the number, which is then going to be multiplied with all distances. here we specify 0.001, and so that is exactly the same as dividing the 1000. 
Now we get two results only the name of tours and the distances in kilometers.
Now let's do the conversion
lets create a multiplier variable with a ternary operator, if the unit is a mile then what should be multiplier, For that lets simply google what one meter is in miles. 0.000621371, this is one meter in miles, so all we need to do is to multiply our result in meters with this number. If the unit is in meter then we simply multiply with 0.001, that we used before.
const multiplier = unit === 'mi'? 0.000621371 : 0.001

That's it, that wraps up this lecture, 
These two videos are just for great overview of how to work with geospatial data in mongodb. And there's a ton of possibilities of stuff that we can do in our awn applications using this kind of data. 
*/
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude ad longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        // distanceMultiplier: 0.001,
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});

/*
* lecture 172
* Creating API Documentation Using POSTMAN
So, our API is now basically finished. And so in this final video of the section, we're gonna quickly create documentation for API directly in postman. We can easily create some quick documentation right in postman. And it's really important to have API documentation in place because this is how we communicate to team members, or even to our final users of the API, how they can actually use it in practice. 
Before doing that lets do some quick fix. 
- In 'log in' endpoint, we actually expose our password, that's not a good idea, and so lets  create an environment variable which is going to hold this password. Since it's always the same that should be no problem. in Dev:Natours and Prod:Natours as well. 

Now we create a description for each and every request that we have in our collection. Now I'm not going to do that, I will just exemplify it here with the fist one. with getAllTours
Under the title we can add the description on postman let's say "Use this endpoint to create a new tour", 
Then the same thing applies to the folders, edit and then add description.  "You can get all tours, create new ones, and edit and delete tours. There are also special endpoints for some special requirements."
We can also add a description on Natours it self. lats say "The Natours API contains endpoints for tours, users, and reviews."
So, we should always add a description to all the requests, to all the folders, and also to the collection itself. 
We can also actually describe the query parameters in a query string, so let's do that in getAllTours.

Now we should be ready to actually publish our API documentation. click 3-dots on Natours and click on View documentation and publish
Now our api is on this url: https://documenter.getpostman.com/view/30560440/2s9YXpUJAU 
*/

/*
#0f0
/*
? ------------------------- ?
! ------------------------- !
* ------------------------- *
! NEXT SECTION #12
* SERVER SIDE RENDERING WITH PUG TEMPLATES
Up until this point in course, we've just been building our API, which can be consume by a web client, in order to build a website, or native application. But now in this section, we will finally use everything that we've built until now, to create server-side rendered websites. this is now quite easy to do because we've already done most of the preparation work before.

*/
/*
* lecture 174
* Recap_ Server-Side VS Client-Side Rendering
Just a quick recap of server-side and client-side rendering.
Remember how in client side rendering, the actual building of the website happens on the client side. And for that we need a data source, which is usually an API that sends data to the client as requested. So, that's what we've been building up until this point in the course. Now it's time to move on to server-side-rendering, and actually build the website on the server. And the main aspect of server-side rendering is building the actual html, basically because that's where all our data will be stored. And for doing that, we use templated, which have placeholders where we will then inject our data as necessary. So whenever there is a request, let's say for the home page, we then get the necessary data from the database, inject it into a template, which will then output html, and finally send that html, along with css and javascript and image files, back to the client. Now we can still then use the api for some of the things on the front end, and actually, we're also gonna be doing that.

*/
/*
* lecture 175
* Setting up Pug in Express
let's start by setting up our templating engine in express, which will then allow us to render out websites using simple templates, 
In this part of the course it's now time to actually send a final rendered website to the client, containing all the data that we've been working with up until this point, like tours, users, and reviews. 
? Now how do we actually build Or render these websites?
well, we use what's called a template engine which will allow us to create a template and then easily fill up that template with our data. And the template engine that we're going to use in this course is called bug. And there are a couple of other template engines like handerbars or EGS for people who don't like pug, because there are some strong opinions around pug, but i'll still say that bug is the most commonly used template engine with express. 
So, let's now setup pug, and render our very first webpage using it. 
The first step is to actually tell express what template engine we're gonna use, and we do that by saying, right at the beginning in our application app.set, so basically this is like a setting for the view engine, and then we that to pug
app.set('view engine', 'pug')
that's it, so express automatically supports the most common engines out of the box, and of course pug is one of them. so, we don't even need to install pug, and also don't need to require it. 
So, we defined view engine, now we also need to define where these views are actually located in our file system. So our pug templates are actually called views in express. and that's because these templates are in fact the views in the model-view-controller architecture which we have been using in this course up until this point. 
We already have the controllers and the models folders, and so now it's time to actually create the view folder. and with that we've the three components of the MVC architecture. 
In order to now define which folder, our views are actually located in, we need to do again say app.set, this time with views and then name of the path. in path we could just put something like this './views', but that's not ideal. The path that we provide here is always relative to the directory from where we launched the node application, and that usually is the root project folder, but it might be. So we shouldn't use dot here, but we should instead use the directory name variable. So let's do that, together with a nice trick, that we can use with Note, which is using the path module. 
So, Path is a built-in node module, so a core module, which is used to manipulate path names basically.

path.join(__dirname, 'views'), this will then basically behind the scenes create a path joining the directory name/views.
Here the benefit of using path.join is that, we don't always know whether a path that we receive from somewhere already has a slash or not. so this is use to all the time to prevent this kind of bugs. because this way we don't even need to think any slashes or not. because node will automatically create a correct path. 
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
With these we've now set up our pug engine. Now it's time to create our very first template. 

- All i want to do here is to create an h1 element simply with the name of some tour. and the way that works with pug is just like this: h1 The Park Camper that's it, that will then translate to this here <h1>The Park Camper</h1>, And it will also allow us to put all kinds of variables here. so that we can really inject our data into these templates.  
- Now we actually create a new route from which we will then access that template(base.pug). 
h1 The Park Camper

Rendering pages on browser get is always the one that we use. and then specify the routes, that will simply be the root of our website.  as alway we also need handler function, and now to render a template just like before we use the response object, we still set the status, then instead of using json we use .render, then render will render the template with the name that we pass in, and that's in this case base, we don't need to specify the pug extension. And of course it will look for this file inside of the folder that we specified(views) in the beginning of this lecture.
let's test, our server is still running on localhost post 3000, 
! here an error, so actually we do need to install the pug module npm i pug
Now working. 

*/
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.status(200).render('base');
});

/*
* lecture 176
* First Steps with Pug
In this lecture we're gonna learn the very fundamentals of working with pug templates. let's open up our base.pug file, and let's get started.


- h1 The Park Camper

- In essence/nature, Pug is a simple whitespace sensitive syntax for writing html, so that's really the gist/core of what it is. Now what that means is that all we use to write html elements is there name and indentation in our code. So let's start by setting up a very simple html structure here. 
- So html usually always start with the doctype and then html, So in order to be able to properly work with Pug, we should of course have some html knowledge; After doctype the first tag will be the html. Then inside of that there's usually a head element. So in pug, in order to say that one element is inside of the other one, we use a tab, so indentation. Inside of head let's create the title of the webpage.
- So just indentation, then the name of the html element, and then the content itself. No opening tags, no closing, tags, really clean and simple syntax to use, to read as well. ...we added a heading and a paragraph
- Next up, let's actually also include a CSS file and also the favicon to be displayed. These kind of stuff goes in the title. 
- Normally we do like this to include CSS, <link rel="stylesheet" href="css/style.css" /> so here we've two attributes rel, and href, and so, with pug we write attributes in parentheses, like this,  link(rel="stylesheet" href="css/style.css"), between tag name and parentheses there should not be any space. 
- We can actually use regular html as well in pug. so to link css we could write this as well: <link rel="stylesheet" href="css/style.css" />
- ? Why does this style.css file actually get loaded from the CSS folder automatically, and the favicon also gets automatically loaded from the image folder?
- well, fist of all, keep in mind that each of these assets actually triggers it own http request, from inspect, in Network tab we see there is three requests, one for the page itself, one for style.css and one for favicon. But we don't have a route handler for all of these, like for css/style.css and img/favicon.png, But if we think it's still a route, because it's get request to this url(css/style.css) So why this does actually work? It's because of it this middleware that we defined somewhere in app.js file. this one: app.use(express.static(path.join(__dirname, 'public')));  Remember by using express.static we basically define that all the static assets will always automatically be served from a folder called public, So, that's why we say css/style.css, without specifying a public, in fact it's in public folder, So, this css folder is inside of public folder, and same for the images. 
- Another really cool thing is to actually use variables in here. So, let me show how we can actually pass data into a template and then how we can use that data right here in pug. 
- Remember we've this route app.use('/', (req, res) => {
  res.status(200).render('base'); })  to render our base template. In order to now pass data into this template all we need to do is to define an object here in that .render() method, in middleware and then we'll simply put some data in there. and that then be available in the pug template. 
- app.get('/', (req, res) => {
-   res.status(200).render('base', {
-     tour: 'The Forest Hiker',
-     user: 'Muhammad',
-   });
- });
- this variables that we pass in here in object, they are then called locals in the pug file. Now let's actually go ahead and use that data. We want to put that tour variable on to h1, Simplest way of doing that is simply use the equal operator like this:     h1= tour , h1= then space then variableName. 
- In pug we can crete two kinds of comments. 1- by using // just like in javascript, and this will then create a comment that's gonna be visible in the html. // h1 The Park Camper, if we now take a look then in inspection, here is the comment, So double slash basically creates an html comment. If we really want to be a comment for the pug file, not really being outputted to html,  we need to add dash. 
- So this kind of code that we write here is called buffered code. 
- And actually we could also write some javascript here, like h2= user.toUpperCase(), 
- If we have buffered code, then we also have unbuffered code, basically unbuffered code is code that is not going to add anything to the output. and we write that that by writing dash and let's simply do some javascript
- There is actually way of writing code, that is called interpolation, that one look bit like a ES6 template strings, but here instead of $ we use #. like this title Natours #{tour}, here we have to do like this because one part is not a variable(Natours) and another one is(tour). 

Pug code
doctype html 
html
  head
    title Natours | #{tour}
    link(rel='stylesheet' href='css/style.css')
    link(rel='shortcut icon' type='image/png' href='img/favicon.png')

  body 
    h1= tour
    h2= user.toUpperCase()
    // h1 The Park Camper

    - const x = 9;
    h2= 2 * x
    p This is just some text

*/
/*
* lecture 177
* Creating Our Base Template
Let's now start to really create our base template. So the template upon which all other templates will be based on later. So, basically we'll be converting a regular html file, that is in the starter files to a pug template. 
So basically we're gonna start creating the layout of the main page, the header and the footer, not the content,  because that we'll then build more dynamically a bit later. 
let's do that now. 

- here lets now put a visible comment to our html, saying HEADER.  
- here we have header with a class header, and all we need to do to specify a class, is dot and then class name. Here we using the BEM architecture in css, here nav is the block and tour is the modifier in class name nav--tours. And __(double underscore) means this is a element, in nav__search.
-When it's a div element, then we don't even have to say div.className, we can get rid of div.

- Let's open the overview.html file, so that we can basically convert it to pug. overview.html file is the original html file that is created to design the overview page that will render dynamically. 
- Let's first build head. In head we've missing the stuff which is required for the responsive design. like meta tags. and also google font links.
- Next up, let's take a look at our header, the menu bar. 

- Needing the extra line for only specifying the li with each a element, is not really ideal, And so what we can do here is use a colon like this li: a(href='#') About us

* PUG HTML CODE
doctype html 
html
  head
    meta(charset='UTF-8')
    meta(name='viewport' content='width=device-width, initial-scale=1.0')

    link(rel='stylesheet' href='css/style.css')
    link(rel='shortcut icon' type='image/png' href='img/favicon.png')
    link(rel='stylesheet' href='https://fonts.googleapis.com/css?family=Lato:300,300i,700')
    
    title Natours | Exciting tours for adventurous people
  body
    // HEADER
    header.header
      nav.nav.nav--tours
        a.nav__el(href='#') All tours
      .header__logo
        img(src='img/logo-white.png' alt='Natours logo')
      nav.nav.nav--user
        //- a.nav__el(href='#') My bookings
        //- a.nav__el(href='#')
        //-   img.nav__user-img(src='img/user.jpg' alt='User photo')
        //-   span Yogovi
        button.nav__el Log in
        button.nav__el.nav__el--cta Sign up

    // CONTENT
    section.overview
      h1=tour

    // FOOTER
    footer.footer
      .footer__logo
        img(src='img/logo-green.png'  alt='Natours logo')
      ul.footer__nav
        li: a(href='#') About us
        li: a(href='#') Download apps
        li: a(href='#') Become a guide
        li: a(href='#') Careers
        li: a(href='#') Contact
      p.footer__copyright &copy; by Muhammad Ahmad Yogovi.
*/

/*
* lecture 178
* Including Files into Pug Templates
In this lecture, I want to just very quickly show you a feature that we actually have in all programming languages, which is to include one file and this case, one template into another template. 
so let's say that we wanted to keep our base layout here really clean without any content in it. And so what we're gonna do is to put all the code for the header into one header file. and then include that file right here. and the same also for the footer. And then our content block, become very clean element only with includes.
let's create a new file for the header and then for footer. We'll prefix these files that only serves for being included with an underscore. 

! we use a nice extension that take care of indentation.  
install Pug beautify, After installation select all the codes and press a short cut keys ctrl+shift+p and then type pug and then... it will format the code. 

After creating a new files all we need to do is to say include _header, and again no need of .pug extension.
include _header 
include _footer 

That's the simply including some files, one into the other. 

*/

/*
* lecture 179
* Extending Our Base Template with Blocks
In this video I will show you how to use one of the most important and also most complex features of the Pug. And that are extends. With extends, we'll be able to use the same base layout for every single page that we want to render. 
Right now we have our base template kind of finished, with a header and footer. So now, let's actually start filling out its content. Now of course we want to load different content for different pages. and to start we want to have a overview page with all the tours, and then a page with all the tour details for one specific tour. So, let's now implement some routes for both of these pages. 
We gonna do that right below the first one that we already created in the app.js. 

And now in this overview page we will actually want to render a template called overview, that doesn't yet exist, and lets now quickly go ahead and create that one. And also pass in some data. we'll pass in the title of the page, title: 'All Tours'
Now let's create the /tour routes. Because we also want a route for a specific tour. 
*/

app.get('/overview', (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours',
  });
});

app.get('/tour', (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
  });
});

/*
Now in each of these templates and in in this case the overview, we only want to put the content for that specific page. So we want no footer here and no header and none of the stuff that we have in the base. Really just the content for overview page. So that's exactly what we're going to put in this file. and then we will basically inject this content into the base template, which we can call the parent template. And this process is then called extending. So whenever the overview template is rendered, we then take the base template and fill it up with the content of this overview page and so we extend it. 
so let's implement it in the overview page. 
So first off, In the base file we need to put a block. And that block, we call it content. then inside that block we can actually also have some content. but this content will then later be overwritten. so let's put it just as place holder. 
// CONTENT
    block content
      h1 This is a placeholder heading 

- Now we can go to the overview page and say that we want to extend our base template. And also here in overview we create a block called content. and then in there we can as always put our content. So here we basically redefine the content block that in the base. 
- Now each file can only extend one other file. we can only extend the base here. but we can have different blocks in each of the files. 
- Let's now go ahead and do the same thing in tour.pug file. 

BASE FILE
block content
  h1 This is a placeholder heading

OVERVIEW FILE
extends base
block content
  h1 This is the tour overview

TOUR FILE
extends base
block content
  h1 This is the tour detail page

? QUICK RECAP
We want to use this base template kind of as our starting point, so as a skeleton that has all the html stuff, like head, header, and footer, but not the specific content for each page. Then in each of these pages we only have the content for that page itself. And we can do that because we can basically inject this content from overview page to the parent base template by using extends. basically the extends is like as the opposite of the including. [we included the header and footer files into the parent file base. so here the parent include the children], but with extends, it's the other way around, where basically the children that kinds of includes the base. 

One thing that we have the title variable(app.js) on /overview and /tour, so we can put these using on html title tag on head. We can actually do that right here in the base template. When the overview and tour extends the base template,  then the base template still has access to the locals/variables, that we passed into the template. So on title tag in base.bug, we can interpolation with the variable. so just specify the variable name in the #before curly braces,     title Natours | #{title}

*/

/*
* lecture 180
* Setting up the Project Structure
Now we understand the basics of bug, It's tim to do some refactoring and to fit our code better into the MYC architecture.  
Just like resources we'll also going to create a router and the controller to the view as well, so basically a file where we can put all the routes that we need in in order to build our dynamic website. so cut the all 3 routes from the app.js and pase in viewRoutes.js file.
Next up, we actually need to mount this router to our application. in the app.js just like we did before. we'll mount to the root. app.use('/', viewRouter);
Now just as a final step, let's just just like before, actually exports these function(handler) from viewRoutes, here into a controller. and then import it in viewRoutes file
Finally we do not want a route called overview but instead, we want to show the overview right when we open the page. So use this: router.get('/', viewsController.getOverview);

*/

/*
* lecture 181
* Building the Tour Overview [PART-1]
Now we're gonna start really build the tour overview page. And remember right now the overview page doesn't have any real content, and so that's what we're gonna add in this video. which is the root file and the controller that is in charge fo rendering this page is the getOverview controller. 
So let's first go there in getOverview handler in viewsController file and layout the steps that we're going to take in order to render this page. 
  /*
1) Get Tour data from Collection: First we need to do is to get all the tour data from our collection. It means that of course we first need to actually import the tour model here in the viewController. 
  const tours = await Tour.find();
? and now what we are actually doing to do with this tour data? 
well, we're gonna have to pass all this tour data into the template, so that in there we can actually use and display it on the website. And so that's actually very easy to do.  All we need to do is to put the tours in to the object that we passed in the .render function, after title. Great, so whenever there is now a request for the overview page, basically for our homepage of our dynamically rendered website, all the tour data  will be retrieved from our database and that data will get passed into our template. And so now all we need to do  is to actually build that template.
So let's move over to the overview.pug file. 

2) Build template: Then second, we're going to build our template, and we're to gonna do that in this controller.
- we have pre build overview.html file in public folder. so let's take a look to that file. Just like we build our header, now it's time to build our main content of overview page just take pre-built(overview.html) template as a reference.
- What's import to note here is that in the main section there are 9 cards, one for each tour. So actually we want to create a pug template for this card only. so that we don't have to write it manually over and over for each of the card. So that's in tourCardTemplate.pug file, there will be an entire code for one card basically translated to put code. let's copy all of that and put it in the overview.pug file.
- Right now we have a completely static card here. So, it doesn't yet use the data that we pasted into the template. 
- Now the thing is that of course we want to have one card for each of the tours, And so basically what we want to do now is to loop through that tours array that we passed into the template as a response user .render() method from viewController.js file. and remember that tour is an array, because it contains multiple tour documents in it. And so let's now loop over array and create one card for each of the tour documents. And luckily that's very easy to do in pub because basically pug comes with built in loops. each tour in tours, tours here is the variable that we passed in and then in each iteration the current variable will be called tour. and inside of this loop we will put the card pug codes using indentation. 
      each tour in tours 
- By This we have 9 identical cards.  
  
3) Render that template using tour data from step#1
*/

const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {

  // 1) Get Tour data from Collection
  const tours = await Tour.find();
  // 2) Build template

  // 3) Render that template using tour data from step#1

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
  });
};

/*
* OVERVIEW.PUG FILE
extends base
block content
  main.main
    .card-container
      each tour in tours 
        .card
          .card__header
            .card__picture
              .card__picture-overlay &nbsp;
              img.card__picture-img(src='img/tour-1-cover.jpg', alt='Tour 1')
            h3.heading-tertirary
              span The Forest Hiker

          .card__details
            h4.card__sub-heading Easy 5-day tour
            p.card__text Breathtaking hike through the Canadian Banff National Park
            .card__data
              svg.card__icon
                use(xlink:href='img/icons.svg#icon-map-pin')
              span Banff, Canada
            .card__data
              svg.card__icon
                use(xlink:href='img/icons.svg#icon-calendar')
              span April 2021
            .card__data
              svg.card__icon
                use(xlink:href='img/icons.svg#icon-flag')
              span 3 stops
            .card__data
              svg.card__icon
                use(xlink:href='img/icons.svg#icon-user')
              span 25 people

          .card__footer
            p
              span.card__footer-value $297
              span.card__footer-text per person
            p.card__ratings
              span.card__footer-value 4.9
              span.card__footer-text rating (21)
            a.btn.btn--green.btn--small(href='#') Details

*/

/*
* lecture 182
* Building the Tour Overview [PART-2]
Let's now fill each of the card elements with the correct data for each of the tours. 
So just as a quick recap, In a last video we started by creating this main element and inside a div container element then inside of that container we want one of these card elements for each of the tours that comes in the array that we passed into this template, for that we use pug array loop.
- Let's start filling the data from the tour name. just like this: span= tour.name, that's it. 
- let's put for image the alt text to tour name. Here in alt we simply put tour.name here, because we're inside of a string and so doesn't work. And so the easiest way of doing that is actually use ES6 template strings. 
- Next up let's then specify the image, actually href attribute. In database we only have the name of the image itself. so not the path of image. So that we have to actually have to manually specify. can see on compass, we have image of with imageCover field. All images are in public folder from which all the static assets are going to be served, in there we've img folder and then oen folder for tours and one for users. Inside of tours we then have 3 pictures and 1 cover photo.
img.card__picture-img(src=`img/tours/${tour.imageCover}`, alt=`${tour.name}`)

- Let's now build h4 saying 'Easy 5-day tour', here this string is combination of different data. So, we have the difficulty, and the tour duration, h4.card__sub-heading=`${tour.difficulty} ${tour.duration} day tour`
- Next up we have a span element with a startLocation. So, startLocation is an object. So, here we want startLocation.description.
- Next up we're gonna use to start dates, Now keep in mind startDates is an array. Now we want in our overview page is basically the date where the next tour starts, so that's basically the first element of that startDates array. 
- Next, this piece of data, 3 stops, which says how many stops there in these tours. Basically that means how many location we have. so we use locations field, not startLocation.
- And finally the amount of people that are part of each of the groups. So, the people that can participate in our tour.

Let's test all of these. yes, Only the dates looks kind of weird, we really just want june 2021, So, we don't need to be all that specific like time, gmt etc.  Let's fix that, and thankfully that's actually very easy with javascript. Really keep in mind tha each of the startDates is really a date object in our database. So now we can use a function like this one.
span= tour.startDates[0].toLocaleString() // basically it'll convert this date into nice readable string, and in this toLocalString we can pass an option for the language and then also an object with some options so here as an property of object we can say a month should be long, so instead of just an abbreviation(Apr, Jun),  and also saying the year should be numeric. 
! Google this function toLocalString, -very interesting

Now only two things remaining, the price and the rating details. price is simple, For average rating it's also so simple. 

? And now finally we need to build the URL to the detail page. So, remember that when we chick on one of the cards, it then takes us to the detail page, and so of course here on detail button we now need to specify that link and of course that will depend on each tour. To want to link '/tour' then we want to query tour by their slug, not by their ID how we did in api. because that actually makes the url look much nicer. So, link will look like this: `/tour/${tour.slug}`
All urls starting with the slash like /tours called a relative url, and this will do is add this piece of the url after the host name. right now it's localhost.

! whenever we need a real space between two inline-block elements then we need to manually create that spaces, using this piped line with space(| ), like we did between tour.price and 'per person' to create space between them. This space is not inside of these two element, just between them. 

*/

/*
* lecture 183
* Building the Tour Page [Part-1]
In this video and the next one, we're gonna build the tour detail page. And along the way we gonna learn some more cool pug techniques, like conditionals and mixins. 
? challenge, build routes for tours and then controller function for getTour in viewController.
THE ROUTER:
router.get(`/tour/:slug}`, viewsController.getTour);

/*
1) get the date, for requested tour(including reviews & guides),  we also needs a reviews here and tour guides.

2) Build Template

3) Render template using data from step1

*/
// THE HANDLER
exports.getTour = catchAsync(async (req, res) => {
  // 1) get the date, for requested tour(including reviews & guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  // 2) Build Template

  // 3) Render template using data from step1

  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
    tour,
  });
});

/*
Now all we need to do is to go ahead and build our template. we have already built-in template for it as well. just like before copy and paste. 
let's test it...
? for some reason css is not working. 
that is because we're in tour route, so it's trying to find css folder inside of the tour,  but that of course does not exist. we need to fix the way that we import the css in our base template. So, basically we should have a slash before the css folder like this href='/css/style.css', and that's then gonna to start at the root of the page.

let's now start using dynamic data, according to the tour.
Remember that the variable that we passed in here is called tour as a response from handler.

In section description we have four same overview box here, the only things that changes is that icons names, then the description of the box and the value of description. Since we don't like repeated code, lets use another feature of pug called mixins. 
Mixins are basically reusable pieces of code that we can pass arguments into. so bit like a function, and also it's exactly like mixins in SAS. lets copy that repeating code and then create a mixin out of block at the top. 

- we write mixin keyword and then the name of the mixin, and then we can specify some arguments.
MIXIN
mixin overviewBox(label, text, icon){
  .overview-box__detail
    svg.overview-box__icon
      use(xlink:href=`/img/icons.svg#icon-${icon}`)
    span.overview-box__label= label
    span.overview-box__text= text
}
And now we can use this mixin. We use this mixins by writing plus and then just like a regular function we pass the arguments.
CALLING MIXIN
+overviewBox('Next date', date , 'calendar')

Here also for date we have to use .toLocaleSting('us-en', {}), So for that we use a javascript variable and then will and then use that variable.
Remember to produce javascript code which will not going to produce any output, we use this syntax: starting with hyphan
- const data = tour.startDates[0].toLocaleString('en-us', {month: 'long', year: 'numeric'})
*/

/*
* lecture 184
* Building the Tour Page [Part-2]

Next up it's time to build the 'Your Tour Guides' section. Now we don't know how many tour guides there actually are on each tour. And so just like on overview page here we need to have another loop through all the guides that are associated with a certain tour. 
- will create a loop here, which in each iteration will create a box with elements. each of the guides is the user with role of guide, and all users have property of name, photo, etc. Here we want 
Remember we used populate so it will not be just like we have in tour.guide in database, but we also should have a properties that we specified while populating. 
label would be tour guide when its a regular guide, and lead guide. 
to print tour guide/lead guide if we put just like this tour.role. then it's printing guide and lead-guide. that's not looking good, so now it's time to use conditional. Now pug actually has conditionals built in, but they are really simple and we can't do a lot of stuff with them. But the good thing is that we can actually still use javascript for that. So, again we use unbuffered code for that, so with the dash symbol. so we use if block here. 

Now move up to the description texts.  In heading we have the name of the tour with some string. so use create a template string. For description we want to put the texts in two paragraphs, that are in the description field. In description field there is \n between both paragraphs. so we gonna split the string by the new line character(\n). that will create an array, so then we iterate on the array. 
- let's now move on the images section. we have three images here displaying side-by-side. these image names are stored in images filed, there we have an array of three images name. So, once more we're going to use a loop. Here we have to change CSS class name as well for each image. how we change img--1, then img--2, and then im--3, ? Well in bug loop we can actually define a second variable and that one going to be the index. 
But to add that index to the css class, it might not be that easy. because we cannot use the string template. So instead of img.picture-box__img.picture-box__img--1 we can use class attribute for the second class name in this case, that's exactly the same. to the class attribute we can use template string. just like this:
each img, i in tour.images
  .picture-box
    img.picture-box__img(src=`/img/tours/${img}`, alt=`${tour.name} ${i + 1}`, class=`picture-box__img--${i+1}`)

Next section is the map , which we'll leave for the next lecture. 
So now we have the reviews section. Now where are these reviews actually coming from? Remember in the view controller we did populate the reviews field with the actual review data. And so right now we have tours.reviews which is an array of all the reviews. So, here we are going to create yet another loop inside the div [.reviews] element. Here we have a lot of codes in review section, so let's create a mixin here. 
And remember in review we have the review itself, rating, and then user, and in user we have user.name and user.photo. 
The harder part is going to be to display the actual rating, because we have to display one of these elements here(svg icon) or each of the number of stars that the review has.  So five start review needs all of these five starts, 4 stars only needs four of them + a gray star. 
So what we gonna do here is to print the amount of stars in a loop. So there are five possible stars so we loop from one to five. Then in each star we test if the tour the tour rating is higher or equal to the current the star. and if so, we green star, and if not it's a gray star. The green star has the active modifier and the gray one has inactive. So we'll change that with a template string. just like before we need this class name as an attribute. Then we use a ternary operator to check. 

reviews__rating
      each star in [1,2,3,4,5]
        svg.reviews__star(class=`reviews__star--${review.rating >= star?'active':'inactive'}`)
        use(xlink:href='/img/icons.svg#icon-star')
EXAMPLE: let's say that we have three stars out of five, so in the first iteration, star is one. And so one is of corse less than current user's rating which is 3 in this case, so the class name should be review__star--active .

Now one thing that I wanted to just show you is that we can actually also export a mixin into its separate file. So let's do that for reviews mixin. make a new file _reviewCard.pug and paste the reviewCard mixin in that file. and then in tour.pug file all we need to do is to say, include _reviewCard

All that's left to do is call to action section. And here all we really need to change is this duration. 

That's done it.
*/
/*
* lecture 185
* Including a Map with Mapbox [Part-1]
Next up, we're gonna learn how to integrate a nice map that displays all the locations of a certain tour into our website using Mapbox. So, to display map we're gonna use a very nice library called 'Mapbox'. This library actually runs in the front end. And so this lecture we're actually going to write a little bit of front end code, not so much about the back end. But this is still very important because now we gonna learn how to write javascript for for the client side and then integrate that into our templates. So let's do that, 
Remember all the assets/data that are available on the client are in the public folder. for example our css files, images, and we also have a folder called js. so, let's create a new file in that folder called  mapbox.js

So this basically is a javascript file that we're gonna integrate into our html and which will then run on the client side. So, just like regular javascript file.  
let's integrate it into our templates. Now it might appear that the best place to do this integration is our base template. But in fact, we only want to include the mapbox script on the tour page. So how could we do that?
And the solution for that is once more, extending a block here  in our base template. So we're going to create a new block here in base and that will then gonna extend from the tour. Remember when we extend the block then the content inside that disappears. But actually there is another way of extending blocks, which will then simply add the new content at the end or at the beginning of the block. So, let's see how we can do that. 
So in tour we write block append head, And so whatever we will write in this block here will then be appended to the content that's already in that block. and we could also use prepend, which will then add at the beginning of the bock. Now inside of head bock in the tour file all we gonna do is to add a new script. It's done when we reload any tour page, we should get a message saying 'Hello from the client side' that we console from the mapbox.js file. 

Next up we want to get access to the location data of the tour that we are currently trying to display, right in the javascript file. So how are we going to do that? 
Well, we might do an Ajax request, basically a call to our api and get the data from there. But that's not really necessary in this case. So, let me show you a real nice trick. So, in tour.pug we already have all the data about the tour itself and now we can simply put that data into our html so that the javascript can then read it from there. So, basically we're gonna expose the location data as a string in the html and our javascript will then pick it up from there without having to do like any api call separately. 
So, let's come to our map section in tour.pug file, there we actually map (div)box with #map id, Here we want to specify the data attribute. So, there is a very nice trick in javascript where we can specify a data attribute in html, and then read that attribute using javascript in a very easy way. like this #map(data-locations= `${tour.locations}`), As in our database location is an array, so we need to transform that array into a string. so we use #map(data-locations= `${JSON.stringify(tour.locations}`)), Remember in html of course we cannot have arrays or objects or anything like that so we converted to string. Now if we take a look at our html elements using inspect, there we have a data locations attribute on #map which contains all the info about locations in a huge string. 
And so in javascript(mapbox.js) we can get that very easily, because whatever we put into a data attribute like that, it will then stored into the dataset property, in this case dataset.locations because it's called data-locations, remember that locations data is a string so we need to convert it into a json, so we use JSON.parse(document.getElementById('map').dataset.locations);
Now test it. Now something going wrong in our mapbox file. So, I believe that probably the problem is that at the time we called our get element by id, the dom is actually not already loaded. That's because we have our script integrated right at the beginning, in the head, while it really should be at the bottom of the page. So put that one at the bottom of the base file. 
Now check it, Yeah we an array here. which contains all the locations of the tour. 
*/
console.log('Hello from the client side :D');
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

/*
* lecture 186
* Including a Map with Mapbox [Part-2]
Let's now continue building our map integration. And so let's now head over to a mapbox documentation. https://www.mapbox.com/  We're using mapbox instead of google maps, that's because some time age, google maps started to actually require a credit card. so it's not a free.
let's create a new account.
! Review lecture #186

*/

/*
* lecture 187
* Building the Login Screen
Over the next couple of lecture we'll add the login functionality to our website. In this lecture we'll start by actually rendering out the login screen to make it easy for users to login.  
? Small challenge. Create a /login route. then create a controller, and a template. 

router.get('/login', viewsController.getLoginForm);

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

write a html on login.pug. 
Now comes a trick that where we extend the base template. So this one(login.pug) will extends the base file and don't' forget after that we need to create a block with the exact same name as we have in the base file. so that's content. 
Now just one more thing that we need to do is to actually set a link to the login page, so that we can access that.  So right now the login and signup buttons are actually using the button element. but like this we cannot really specify the href attribute. so change them to real like(a tag) and then we can specify the href. 
? Signup form is not implemented, because the whole process of signning up is going to be very similar to logging in. 
*/

/*
* lecture 188
* Logging in Users with our API [Part-1]
Now it's time to use the login API that we built in previous sections and there is a ton of stuff to do here in order to make the front-end interact with the back-end. 
So, we're gonna allow users to log into our website by doing an http request, or an ajax call as many people like to call it also. 
And we're doing that http request to the login API end point that we implemented before, using the data that the user provides in this login form. And so remember that our API will then send back a cookie which automatically gets stored in the browser and also automatically gets send back with each subsequent request. And this is a fundamental key in order to make our authentication system work.
Anyway since we're doing http request in the browser, we will of course, be working on the client side javascript code, just like we did with the mapbox implementation. 
so, let's now go ahead and create a new file in js folder called login.js

/*
let's now start by adding an event listener, listening for the submit event on our login form. So our login form has form class, so let's now select this form element. and then on there, listen for the submit event, so basically an event that the browser will fire off a user clicks on the submit button on the form. And in the callback function we'll gonna access to that event itself. First say is to say event.preventDefault(); so this prevents the form from loading any other page. 
Next up, let's actually get the email and the password value that the user puts in. These are in the elements with the id of email and password fields. we use the value property on getElementById, in order to read that fields value. 
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

Now let's do the actual logging in in a separate function. let's now create that logging function. and this function going to accept an email and the password. 
let's simply test it, so we need to include this login file into our base template.   alert(email, password); So, here we get our alert with the email we put in on the form. 

So, in order to do these http requests for the login, we're going to use a very popular library called Axios, In the next video we're actually going to download this library from npm and bundle it together with with all our other js scripts, But now let's use it from a CDN. script(src='https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.2/axios.min.js') copy this in our base script template, and this will then expose an Axios object to the global scope, which we can then use in our login function. 
In axios function we pass in the options for our request. here as an option we then put, request method, request url, in this case the login end point of our api And then we need to specify the data that we're sending along with the request in the body. 
Now, Axios returns a promise and so let's actually use a async/await in order to wait for that value to come back. Now keep in mind that this is client-facing code and only the more modern browsers can run async/await funcs. let's save the result of the promise into a res(result) variable. 
Now one thing that I really like about Axios is the fact that it's going to throw an error whenever we get an error back from our api endpoint. so let's say that there is a wrong password and so the server will send back a 403, basically an error. An so whenever there is an error Axios will trigger an error as well. that's very handy, because with that we can now use a try catch block. in order to do some error handling in the client side. 
if type any correct email and password, we get a 200 response, with the data. in data we have a status and token, as we specified in login.  Now here what's really interesting is to take a look at our cookies. and we do that in google chrome by clicking on a i icon besides the url. in cookie it has exactly the web token that we see in console.  And it's this cookie here, who will actually enable us to build this entire authentication. because the browser will now send this cookie along with every new request.
lets see this cookie in backend.  
In order to actually get access to the cookies that are in a  request, in express we need to install a certain middleware. and so we need to install that from an npm package. 
! npm i cookie-parser
Basically this package will then parse all the cookies from the incoming request. 
Now use this middleware in app.js file. 

const cookieParser = require('cookie-parser');
let's use it close to the body parser. 
app.use(cookieParser());
let's log cookie in a middleware. 
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});
Now on each request we will always display all the cookies in the console. So if we reload any page from our website, we should that cookie here in console, If we reload again we see another one. 
And so now, we can use this cookie in order to protect our routes. so let's implement but before do that we need to add this in our autController(in protect function). Right now we're only reading the json web token from the authorization header, and only if they start with bearer, so for the bearer token. But now we basically also want to read the Json web token from a cookie. And so what we can do here is basically add else if block.
so, if there is no token in the authorization header, then let's take a look at the cookies. so else if(req.cookies.jwt) here jwt is the name of the cookie. 
 else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
Now with this we're also able to authenticate users based on token sent via cookies. 
just to test let's protect ony of our view routes. we'll protect our tour detail page. just like before require the authController file in viewRoutes file and then in that route add protect middleware. 

*/
const login = async (email, password) => {
  console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email: email,
        password: password,
      },
    });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  login(email, password);
});

/*
* lecture 189 
* Logging in Users with Our API [Part-2]
The fist thing we want to do in this video is to conditionally rendering  the login/signup part of the page. That means is to render login and signup  buttons in case the user is not logged in, And in case the user is in fact  logged in then render some kind of user menu, and also a log out button
So that kind of rendering should of course on the back end, so in one of our pug template. 
? Now, how will out template actually know if the user is logged in or not?
well, Actually in order to determine that we will have to create a new middleware function, and really the only goal of this new middleware function is going to be if the user is currently logged in or not. Now you might think that our protect middleware also does something similar, and actually, it' similar. But the difference is that one only works for protected routes, but our new middleware function is going to be running for each and every single request on our rendered website. 
Let's now put that in our authController file.

/*
So this middleware really only for rendered pages, so the goal here is not to protect any route.  So there never be an error in this middleware. In this the token should come from the cookies not form the headers. So for our entire, rendered website the token will always only be sent using the cookie, and never the authorization header, that one is only for the api, 
so here we check if there is jwt in cookie, if it's there on jwt then we'll first verify the token, and also check if the user still exist, and also if the user changed the password after issued the token, exact similar to the protect, but here we no need of error. 
If all of these if statements are true, it means that there is a logged in user. So what we want to do in this case, is to make that user accessible to our templates. And how can we do that?
* well, that's actually something that we didn't do before    
we can do response.locals and then put any variable in there. And our pug templates will then get access to them. so,if we say res.locals.user  then inside of a template there will be a variable called user. so again, in each and every pug templates will have access to response.locals, and what ever we put there will then be a variable inside of these templates. So it's a little bit like a passing data into a template using the render function. 
Again; if there is no cookie, then there is no logged in user, so we call next() right away, and we will not put the current user on response.locals. But if there is a cookie, then we go through all of verification steps(if statements) and in the end if none of them called the next() middleware in the stack, then that means there is a logged in user. And so therefore, we put that user into response.locals, and like that we then have access to that user in our pug templates for example in the _header, which is actually where that user navigation will be. 
let's come to viewRoutes and add this newly created middleware, We want this middleware in each single routes that we have in viewRoutes file. We do that bit like before we did with the protect middleware, 
After that we're ready to use this. So let's come here to to our _header and use a conditional. Now remember how i said before that the conditionals in pug is not very powerful and so many times we actually use javascript. But for what we want to do now they are actually good enough. All we want to do now is to say if user SEE HEADER FILE

- if there is a user then we want to display this. In the place of name we want only first name, so lets split the name using space then only display the first one. 
 Now test this out because I'm actually really curious to see if this works. Yes! it's working. 

Next up what we wanted to fix here is to actually get an alert here, and also then the reload the page after some time. Not really reloading actually, but instead sending it back to the homepage. we only ever see that user menu when we reload the page. So that's what we will do now automatically in our javascript code here, in login.js file. 
/*
We will also see how we can send data directly from an html form into our Node application. Of course there are two ways. One way is to send data using an http request like we did here in login.js, in try block, And another one is to simply directly use an html form, that one is very important as well, so we do this a bit later in the course. 
only see that alert window and reload only in case we are really sure that our api call was successful. so if(res.data) this data is the the data that we sent as our json response,  and so from there we can read .status and check if it is = to success. then show an alert with message 'Logged in successfully', after one and half seconds load the front(home) page. so we use setTimeOut with 1500ms, and in order to load another page we say location.assign('/'); Then in case we were not successful we alert(err.response.data.message);


*/

// Only for rendered pages, No errors
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  // 1) Verify token
  if (req.cookies.jwt) {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    // 3) Check if user still Exist
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next();
    }

    // 4) Check if user changed password after the jwt(token) was issued.
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next();
    }

    // THERE IS A LOGGED IN USER
    res.locals.user = currentUser;
    next();
  }
  next();
});

/*
* lecture 190
* Logging in Users with Our API [Part-3]
Let's now finally finish up this login functionality. In this video we wanted to implement a really nice alert for when the user successfully logs in. To see that lets logout the user by removing the cookie manually. so now the user should no longer be logged in, As we already know, that's because the cookie wasn't send in the request, and so the isLoggedIn middleware that we created did not put the user object into response.locals, and so if it's not there the user menu will not be rendered, and instead login and signup buttons get rendered.
that alert that we're talking about  we want to show up at the beginning of the page, and then after a second we want to load the home page. Anyway let's create some functions for this alert in yet another separate file in js folder. 
Al right, but now before we can actually move on we need to think a little bit about our front-end architecture. We should only have one big javascript file which includes all the codes. 
And so, In modern front end development we usually use something called a module bundler. The most popular one is probably Webpack. but usually webpack gives us a lot of problems and it's really a pain to is it up, So there's actually a very nice new kit on the block, which is called Parcel. 
Parcel is fast and zero configuration web application bundler. Simply a bundler which doesn't require any complex configurations, because we don't want to waste any time with that. So, let's go ahead and install it here. 
! npm i parcel-bundler --save-dev 
Now in order to actually use parcel let's add a script here in the package.json file. 
We're adding one to watch our javascript for that we use parcel watch command like this:
"watch:js": "parcel watch"
This would actually already run just fine out of the box, but we still want to configure a little bit. because otherwise it gonna put the final bundle in some folders that i don't want them. so let's specify which folder it actually should watch. like this
"watch:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js"
So now when we run this, it will then take a look at this index.js file, if some thing changes in this file or one of the dependencies and whenever that happens it will then bundle all of the files together into bundle.js file. 
We also want a script for the a final version. this one we're going to run ones where really finished. I does some more optimization stuff.

In base file we include on bundle file, so one script file that contains all the codes that in all the other files and their dependencies. 

*/
/*
Now the idea is basically this index.js file is our entry file and so in this one we kind of get data from the user interface and then we delegate actions to some functions coming from other modules(files) like we have login module, alert module.  just like node js we can actually export data from these modules. 
so we want to export the login function from login.js. It works little bit different than it works with the node.js, because nodejs uses commonjs in order to implement modules. but here in front end js in ES-6 there is something called modules in js. the syntax is bit a different. After exporting we can import here in index.js file. 
import { login } from './login';
WE use curly braces because we're doing export in this way export const login = async .... 
But there is also something similar to module.export which is kind of the default export.

Lets go ahead and install axios, and import it. 
import axios from 'axios';

Next up we should actually also install a polyfill, which will make some of the newer javascript features work in older browsers as well. so,
! npm i @babel/polyfill
and then import it in index.js file just like this: import '@babel/polyfill', So this one here we do not save it any variable, because that's not necessary at all. All we wanted to is to basically be included into our final bundle to polyfill some of the features of js.
Anyway lets now import this mapbox as well, and for that we actually need to first create a function. So let's create:
export const displayMap = (locations) {
  Wrap all the mapbox codes here. 
}
the displayMap function will take in the array of locations, that will then be read in the index.js file. index.js is more for getting data from the user interface and delegating some actions into these other modules. Therefor this code should be inside of index.js file: 
const locations = JSON.parse(document.getElementById('map').dataset.locations);
Then import the displayMap in index: 
import {displayMap} from './mapbox'
Also call this function. 
displayMap(locations);
Now remember way back when we actually created this map how it asked us if we wanted to use mapbox library on npm? So we could now go ahead and actually use that one instead of script in tour.pug. However there is a problem with this library together with parcel. 

const locations = JSON.parse(document.getElementById('map').dataset.locations); This code here may created an error when we were on pages that didn't have this #map id. because only the detail page has map id. let's fix that. 
So what I'm doing here is first to create an element with document.getElementById('map'), and then test if it actually exists, before we execute that line of code. 

Now let's do the final part, that we want to do in this lecture,  which is actually creating alerts. 
*/
// INDEX.JS
import '@babel/polyfill';
// import {displayMap} from './mapbox'
import { login } from './login';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');

// DELEGATION
if (mapBox) {
  // const locations = JSON.parse(mapBox.dataset.locations);
  // displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

/*
so, let's create a function called showAlert and export that. So then in login we will import this function and use it there. This function will get in the type and msg, and this type either 'success' or 'error', because depending on this input we will then have different css for each of these alerts. 
so what we're gonna do is to basically create some html markup here and then inset that into our html. 
first we created a markup and then the select the element to include this newly created html, that's actually right at the beginning of the body element using insertAdjacentHTML(), where we pass 'afterbegin' to put inside of the body but right at starting. and then the html. 
So this is going to create a very simple alert based on type and method, but now we actually also want a function for hiding alerts. 
let's create that as well here. so here we select the element with the alert class and then remove that class. To remove we use a js trick, where we need to move one level up to the parent element and then from there remove a child element. 
Next up in the showAlert function we want that whenever we show an alert first hide all the alerts that already exist. so in showAlert we always run hideAlert function(). 
then finally we also always want to hide all the alerts after five seconds. 
Now let import that in login.js file. And then in there instead of js default alert we want to call our showAlert function with msg and type. 
NOW LETS TEST
YEAH ALL WORKING... 
*/

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) {
    el.parentElement.removeChild(el);
  }
};

export const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  window.setTimeout(hideAlert, 5000);
};

/*
* lecture 191
* Logging out Users
In this video, we're gonna learn a super secure way of logging out users. So up until this point, when we wanted to delete a user, we would simply delete the cookie from our browser. However the, thing is that we created this cookie as an http only cookie, and so that means that we cannot manipulate this cookie in any way in our browser. so we cannot change it and we can also not delete it. remember in createSendToken function we set httpOnly: to true, and this means that we can not manipulate the cookie in the browser in any way, not even delete it. 
? So if we want to keep using this super secure way of storing cookies, then how we are going to be able to actually log out users on our website? Because usually with JWT authentication we just delete the cookie or the token from local storage. but that's not possible when using at this way(httpOnly:true). 
So, What we're gonna do instead is to create a very simple log out route that will simply send back a new cookie with the exact same name but without the token, and that will then override the current cookie that we've in the browser with one that has the same name but no token.  And so when that cookie is then sent along with the next request, then we will not be able to identify the user as being logged in. And this will effectively then log out the user. and also we're gonna give this cookie very short expiration time. and so this will effectively be a little bit like deleting the cookie but with the very clever workaround like this. 
So let's do that in authController file right after login function. 

/*
So again; when we're doing token based authentication we usually never need an end point like this. but when we want to send a super secure cookie like we do, then we need to do it like this. 
Again; on the response we set the cookie, and the secret is to give it the exact same name, and that's jwt. just like in createSendToken function, in that we send token, but here simply some dummy text, lat's say 'loggedout', and then the cookie options. as an option an expire date is 10 sec from now. so let's create a new data based on data.now() plus 10 seconds. And also we're going to set it, again to httpOnly: true ; but here we do not need to set it as secure, because in this case there is no sensitive data that any one can get a hold on. And now all we need to do is to send this response back.
Then in our routes at [userRoutes] we need to add it, of course as well. 
this one will actually be a get request, because we're not going to send any data along with the request, we're not changing any thing, we actually simply get a cookie. 
router.get('/login', authController.logout);

Now we're good to actually hit that route just like in Axios library in login.js file. so lets go to login.js file.
*/
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};

/*
so in logout function we will use try/catch block as well. And let's do a request with axios, and the method this time is get. url is similar to login but with logout. then as the next step lets also reload the page. So that's what we always do manually when we delete a cookie. And so here of course we need to do it programmatically, we need to do it here, because since this is an Ajax request we can not do it on the back end side, so we can't do it with express. so we need to do it manually here. Otherwise we would technically be logged out but our user menu would still reflect, so it would still show that we are logged in, and so we simply need to reload the page, which will then send the invalid cookie basically to the server and then we are no longer logged in. location.reload(true); This statement will then force a reload from the server and not from the browser cache. if we put simple location.reload with true then it might simply reload the same page from the cache, which would then still have our user menu up there. so here 'true' is very important.   
So we have our logout function and now in the index.js we basically need to now trigger it once we hit that button. 
*/
export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
    });

    if (res.data.status === 'success') {
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
/*
So let's create an element first by selecting the logout btn. 
now if there is a logOutBtn then add an event listener to that, so if there is a click event then we then call the logout function.
That should be actually it. 
THAT'S IT!! LET'S TEST IT OUT
*/
if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

/*
* lecture 192
* Rendering Error Pages
let's now render some nice error pages to our users. And so to start, let's actually create an error first. let's open any tour, and add something to the slug. so that will then of course not be found. now it's a json error just like we've seen in postman. And so lets now fix that, with nice error page. 
But first we actually need to fix this particular error. right now we get Cannot read properties of nul.. like this: "message":"Cannot read properties of null (reading 'name')", this is from our getTour. that's in viewsController. 
So there in getTour we do not have any error handling in case that there is no tour, we have that in all our other route handlers, but in this we don't have it yet. so let's add that. 
/*
  so if there is no !tour then return and do to the next middleware with a new app error. 
  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }
  now let's try that again. now we should get a much nicer error. YES
  AND KEEP IN MIND THAT THIS IS NOW AN OPERATIONAL ERROR. So an error that we know, that we created ourself basically.

Now in our errorController file we have two functions which send errors back to the clients. one for development and one for production. then in production, we distinguish between operational error and other unknown errors. so for the error that we know we send back the real error message because we can be sure that it's not going to be some weird looking error coming from express or node. while on the other hand, when it si unknown error, then we do not want to leak the error details.  And so now in this case with the rendered website, we will actually the same strategy. 
So what we're going to do is to simply add the rendering of an error page to each of these functions in errorController. Basically what we're gonna do is to test if the url starts with slash /api, and so in that case we send kind of error that we seeing here in json. But if the url does not start with /api, in that case it means that we want to render an error page as a rendered website just like we have been doing in this section.  any way let's now implement that in that two functions in errorController.js file. 

/*
let's start with sendErrorDev function, 
we can use if(req.originalUrl), originalUrl is basically the entire url, but not with the host. so it looks then exactly like the routes.  to test if it's start with /api or not we can use js function called startsWith, if it's start with /api then simple send down the error as json. But if not we actually want to render an error. in render function we need the name of the template which is going to be called error, and then the data that we want to send there, for now just the title. 
! Oh actually we do not have access to the req variable in this error function, so let's add that. 
Now we actually need to create this error.pug page or template. 
In error page we simply have an h2 with some sting and another h2 with error message. so let's pass in that error message from here(sendErrorDev func) using render function. msg: err.message, we simply set to err.message, because we're in development remember!!, because in development it doesn't matter if we leak all of the error details. SO THAT SHOULD BE WORKING NOW 
In error template we should extend our main(base) template, So we can inject this error page's content into the content block in the base template. 
*/
const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // RENDERED WEBSITE
    res.status(err.statusCode).render('error', {
      title: 'Something went wrongs',
      msg: err.message,
    });
  }
};

/*
Let's now take care of our production error handling
/*
so here in sendErrorProd let's now apply the same logic that we have in sendErrorDev, so test if we currently handling the api or not, by checking the originalUrl. And of course there could be more elegant ways of doing this, for example we could have one completely separate error handling middleware just for the api, and one for the rendered website.
? Just in conclusion we now have an error handling strategy that works for development, such as before and also for production. And then in each of them we basically have two branches, One sends the error message for the api, which is exactly what we had before this implementation, and then we also have now kind of a handler for the rendered website. And so in that case, we render out our error template. Then in production we also distinguish between rendered website and API, and then just as before inside of each branches we then also distinguish between the operational errors and the unknown errors. 
*/
const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

      // Programming or other unknown error: don't leak error details
    } else {
      // 1) Log error
      console.error('ERROR 💥', err);

      // 2) Send generic message
      return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
      });
    }
  } else {
    // B) RENDERED WEBSITE
    if (err.isOperational) {
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrongs',
        msg: err.message,
      });

      // Programming or other unknown error: don't leak error details
    } else {
      // 1) Log error
      console.error('ERROR 💥', err);

      // 2) Send generic message
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrongs',
        msg: err.message,
      });
    }
  }
};

/*
* lecture 193
* Building the User Account Page
In this video we're gonna build the user account page mostly using concepts that we already know and already used before. we'll render this page on /me url. 
So, let's start with the pug templates
Here we already see a lot of duplicate code here. so basically these list item elements. so let's very quickly just create a mixin for them to make our code look a bit cleaner. And so create a new mixin called navItem, What do need to pass in to this mixin? well, what's going to change is the link, the text, the icon, and also the active class. remember this active here will be true or false, And if it's true then we want to add this side-nav--active class. So lets use a turnery operator.
Now we have an admin navigation. And this one will only be visible if the current user is an administrator. let's define that using an if statement. here we need to test if the user role is equal to admin. so we use js for that. So we will have access to the user variable here,  so jest we did in other templates we gonna pass it into here.

Now we have the form  for changing the user settings. And so the personal data will be here in these values of each form input fields. 

let's now go ahead and add the route to the viewRouter. this one in gonna be called /me, this one going to be a protected route, because only if we are actually logged in we'll get access to this page. so we need to use our protect middleware here. 
Now one problem with this is that this protect middleware here is very similar to the isLoggedIn function. And so we will actually do some duplicate operations there, which is not ideal, because remember that this isLoggedIn function will run for all the requests. so here both isLoggedIn and protect middlewares are running. So the solution is that we will put isLoggedIn route only for those which are not protected, because on the protected route this check if the user is logged in will actually happen as well. Now just one thing that we do in the isLoggedIn that we currently do not do in protect is this that we put the current user on the response.locals. And so let's actually do the same in the protect middleware. So in protect we put the current user both on the req.user and  res.locals, So we then automatically use it in all the templates after it. in this case our account template. 

And now we need to add this getAccount controller in viewsController file. 

we need here only req and res. Because here, To get the account page all we really need to do is to simply render that page. we don't even need to quey for the current user, because that has already been done in the protect middleware. 

And now as a final piece of the puzzle, let's add the correct link in the header. right now the link doesn't point to the this account page. It should now point to /me
NOW TEST IT.
*/
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

/*
* lecture 194
* Updating User Data
let's now use the user account page in order to allow users to update their data. So, what we're gonna do it to allow the user to update both the name and the email address for now. And we will add the user photo here a bit later in the next section. 
Now there are two ways in which we can do this. The first one is to submit a post request to our API, just like we did with the login form. And actually, we're gonna do that in the next lecture. But in this one I wat to show you another way which is a more traditional and normal way. So in this more traditional way, we specify the post method right on the form, along with the url where the post request should be sent to. So basically using this method we don't need javascript for doing the request, it automatically happens with the html form which will then post the data to the url endpoint in our backend that we specified. NOW PERSONALLY I DON'T REALLY LIKE THIS WAY, because it forces a page reload, and it also requires us to create yet another route and route handler in our backend, and it also makes it a bit more difficult to handle errors. However, I still believe that it's very important that you know how to work with forms in this way, because it might make more sense in the application that you're building. for example application might not even need an API, and so in that case when we're only building a rendered website then of course it doesn't make sense to submit forms using an API call, instead we'll do it the way that we're gonna do it in this video. And so tha's way we're doing it this way in this lecture, and then using the API way in the next lec.

So, what we need to do in our form in order to submit it automatically, without having to go through javascript, basically automatically posting the data to our endpoint, is to specify that endpoint, and so we do that here in the form tag, where we specify the action attribute. So the action, let's say that we're gonna create an endpoint called /submit-user-data, so action='/submit-user-data', and then we also specify the method to POST, so method='POST'. And so when we click on the submit button automatically the form will get submitted, and the data will be sent using a post request to this URL(/submit-user-data).  There are also different ways in which the data is actually sent, but the default one is called URL encoded, and so that's the one we're using here. Basically what that gonna do is to encode all the data that we're submitting in the url a bit like query string. SO THIS IS THE FIRST STEP IN MAKING THIS METHOD WORK. 
And the second one is to specify the name properties on the fields that we actually want to send. So these input's values will be sent with a request based on their name attributes. so let's put the name field to name and email field. And so right now whe we submit the form. And so right now when we submit the form, the body that we will then receive will only have the name and the email, because these are the only two fields which actually have a name attribute. 
So let's now implement this /submit-user-data route, as i said in this method we need to implement yet another route. and remember this is a post request. 
router.post('/submit-user-data', viewsController.updateUserData);
Now let's actually create this updateUserData handler in viewsController file.  
/*
the first thing that we want to do here is to actually take a look at the body. console.log(req.body); and so basically in this case, just to show you that it actually won't work just like this. and i'm gonna tell you wh after we experiment it. so for now let's just see if we're actually connected already. so if submitting that form will actually trigger this handler. Right now here req.body is empty. So as I saying, this will not really work just like this, 
? because we need to add another middleware in order to parse data coming from a form. so let's do that in our app.js file. 
let's add that close to body parser because actually it's very similar. 
*/
exports.updateUserData = (req, res, next) => {
  console.log('UPDATING USER', req.body);
};
/*
And it's also an express built in middleware and that is urlencoded. so app.use(express.urlencoded); And it's call this way because remember the way that the form sends data to the server is actually also called urlencoded, and so here we need that middleware.  Then in the urlencoded() function we pass in some settings, and we can say extended true, and that will simply allow us to pass some more complex data, which in this case is not really necessary. and we can also set the limit property as we did in the body parser, So if we try this again we should indeed get this data that we put in the form. yes.
Great, so that works, and so we now have our html form connected to this route handler. And so now we can do ahead and actually update the user based on this new data. 
*/
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

/*
first of all we have to import the user model in viewsController.  
So we use findByIdAndUpdate. And what is the id that we're looking for?  It will at req.user.id, And one important thing that we need to do which i didn't do yet, is to actually protect this route here as well, because only then we actually have this current user on the request, and also we only want to be able to access this route if we are logged in. So req.user.id is the id of the current user, and then we need the new data, and so let's say that we want the name = req.body.name and email= req.body.email. and these are the names of the fields, because we gave them attribute in  the html form. 
Now before, we updated some data, we used to pass in the entire request here into the update method, but in this we really only want to update the name and the email, and so we pass in an object just like we did. Like this we're sure that anything else basically is being stripped away from the body, because some hacker could of course now go ahead and add some additional fields to the html and then for example submit data like passwords and stuff like that. so we do not want to store that malicious data into our database, Also passwords are once more handled separately, because remember that we can never never update passwords using findByIdAndUpdate, because that's not going to run the save middleware which will take care of encrypting our passwords. so that's way we have a separate route for that in our api and also we have a separate form in our user interface, that's usually we always see in web applications. 
let's now continue here with our options, where we say that we want to get the new, so basically the updated document as a result, and also that we want to run the validators. 
After submitting the data on our website  basically what we want is to simply come back to account page(/me route), but of course with the updated data here in the fields. 
So all we have to do is to basically render the account page again. But now one important difference, because right now we actually also need to pass in the updated user, because otherwise the user that the template is going to use is the one that's coming from the protect middleware, so that one is not going to be the updatedUser, and so we need to pass in user from the here. And so that should be enough. 
*/

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});

/*
* lecture 195
* Updating User Data
So as we said in the last lec lets now actually use our API in order to update user data. And so just like before with the login functionality, we're now going to make an API call from the front end and so we need to create a new javascript file for that, and this one we're going to call updateSettings, because for now we'll basically update the data, which is name and email and later we will also update the password from this file. and so password together with the user data.  
/*
so this is actually pretty similar to what we did with the login. once more I actually want to leave this as a challenge for you. so go ahead an create an updateData function here. then of course call tha function right from the index.js file. Very similar to other ones, that we did before. now one important thing to do before actually writing the javascript is that in our form we actually need to remove the attributes of form element that we set for previous lecture, (action='/submit-user-data' method='POST');
So that http request that we're doing with axios will need to be inside of try catch block. In case something wrong we want show the alert just like we did.
let do that http request in try block. 
method should be patch. And for the url we go to the postman to see actual url for the update Current User, 
After url we then specify the data, and this data will be the body that gonna be sent along with the request.
And now lets check if we actually get our success back 
that it for this function.
*/
import axios from 'axios';
import { showAlert } from './alerts';
export const updateDate = async (name, email) => {
  const res = await axios({
    method: 'PATCH',
    url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
    data: {
      name,
      email,
    },
  });

  if (res.data.status === 'success') {
    showAlert('success', 'Data updated successfully!');
  }

  try {
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
/*
Now all we need to do is to then use it here in index.js file.  

Import it and then select the form from the account page.
then we will do something very similar to the login.
*/

import { updateDate } from './updateSettings';
const userDataForm = document.querySelector('form-user-data');

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    updateDate(name, email);
  });
}

/*
* lecture 196
* Updating User Password with our API
And now to wrap up this section, let's again use our api this time to also update the user's password. We already create updateData function and now go ahead and create and create update password function as well. That function would basically look exactly the same. And so instead of doing that, we'll change this function a little bit, and allow it to update both the data and the password. 

And here we pass in, instead of name and email, an object containing all the data that we want to update, and then also a string for the type, which can then either be data or password. so here we pass in a data which will be an object of all data to update and then the type. And as a data to the request body we simply pass the data object
Then when we updating the passwords we also use another url so let's just ues a ternary operator in order to determine which url we want to call depending on type string that we passed in this function. 
let's go to postman and copy the url to change password. so the url of Update Current User Password, so basically that one required the passwordCurrent, password, and passwordConfirm. and the route is /updateMyPassword
And so let's call this function updateSettings.
now call this updateSettings from index.js like this with an object and type: updateSettings({ name, email }, 'data'); 

Now all we need to do is to read the data from these three input fields of the form, and then also pass them into the updateSettings function
So let's first of all select the password form. 
*/
// updateSettings FUNCTION
// type is either 'password' or 'data',
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url: url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()}Data updated successfully!`);
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', err.response.data.message);
  }
};

// CALLING FROM INDEX FILE
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');
  });
} 
/*
One thing that i want to show you that after a updating we still have the password showing here in the fields, and we actually don't want that. After the API call was successful, we should then go ahead and delete the content from these input fields. So that's something that we should do also here in the index.js file, because we sain that in this file we handle everything related to user interface. Now remember that this updateSettings function is actually an asynchronous function, it's going to return a promise. and so we can then await that promise right here when calling it. 
wait it until it's finished, so that after that we can do some other stuff. And in this case that is to clear these input fields.
Now all we need to do is to select these fields again and then clear them. 

Notice that it took some time until we actually got our alert here, and that's because setting a new password sets some time because of the encryption process. And so we should give the user some kind of feedback that there is actually something happening in the background, and typically we see some loading spinners. but let's keep it very simple here, so all we are going is to update the text of save password button. 
in starting we set the test to Updating and then after the await we will put original text, which is save setting.
*/
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn-save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn-save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}


#0f0
/*
? ------------------------- ?
! ------------------------- !
* ------------------------- *
! NEXT SECTION #13
* ADVANCED FEATURES_ PAYMENTS, EMAIL, FILE UPLOADS
In this one we will make our website in API even better by implementing advanced features like uploads, image processing, sending emails, and even accepting credit payments using the very popular Stripe service. 
*/
/*
* lecture 198
* Image Uploads Using Multer _Users
In the first part of this section we'll be learning all about uploading images with the 'Multer' package and this particular video we will start implementing image uploads for user photos. 
Now we're gonna be working on uploading user photos and let's lets open up the userRoutes. 
So, 'Multer' is a very popular middleware to handle multi-part form data, which is a form en-coding that's used to upload files from a form. So remember how in the last section we used a url encoded form in order to update user data and for that we also had to include a special middleware. 
And so Multer is basically a middleware for multi-part form data. And now here in userRoutes what we're gonna do is, we'll allow the user to upload a photo on the /updateMe route and so instead of just being able to update email and name, users will then also be able to upload their user photos. So once more let's start by installing the package that we need.
! npm i multer
lets include that in userRoutes file const multer = require('multer');
And now we need to configure a so-called Multer upload and then use it. 
/*
let's do that right at the beginning and let's call it upload and we call the multer function that we just included, and the pass in an object, for some options. Now the only option that we're gonna specify here is the destination property and we're gonna set it to 'public/img/users So {dest : 'public/img/users'} that is exactly the folder where we want to save all the images that are being uploaded.  
And of course we can configure this in a much more complex way and we're gonna be doing in a next lecture. And by the way, we could actually just have called the multer function without any options in there, and then the upload image would simply be stored in memory and not saved anywhere to disk, but of course at this point that's not what we want, and so we at least need to specify this destination option. And with this our file is then really uploaded into directory in our file system. 
? And REMEMBER that images are directly uploaded into the database, we just upload them into our file system and then in the database we put the link basically to that image. so in this case in each user document we will have tha name of the uploaded file.
Any way what we need to now is to use this upload variable here to really create a middleware function that we can put in the /updateMe route. And it works like this, upload.single('photo'), and it's single because we only want to upload one single image and here in single func we pass the name of the field that's going to hold the image to upload, and that will be photo, and with field means the field in the form that is going to be uploading the image. 
router.patch('/updateMe', upload.single('photo'), userController.updateMe);

* QUICK CONCLUSION:
We included the Multer package and then with that we created an upload.  And this upload is just to define a couple of settings, where in this example we only define the destination, then we use that upload to create a new middleware that we can then all to this stack of the route that we want to use to upload the file, so to the /updateMe route, so for that we say upload.single('photo'); here we specify the name of the field that's going to hold this file. And so this middleware will then take care of taking the file and basically copying it to the destination that we specified, And the after that of course it will call the next middleware in the stack which is updateMe. Also this middleware(upload.single()) will put the file, or at least some information about the file on the request object and so let's actually take a look at that.
*/
const multer = require('multer');
const upload = multer({ dest: 'public/img/users' });
router.patch('/updateMe', upload.single('photo'), userController.updateMe);
/*
So let's go to the /updateMe handler, and right in the beginning let's say console.log(req.file), and also req.body. let's test it. Now we test it in postman. Here in postman instead of sending the photo property in raw from body tab, like we did for changing name or email, we put the photo property in form-data. Because this is the way how we can send multi-part form data. so as we want to change name and photo so we put name and poto property in form-data tab. for image instead of text we choose type file. and then as a value we can select the image that we want to upload. choose the image and send the request.  We get all kind of information about the file. so the originalname, encoding, mimetype, destinating, path, size etc these are came from req.file, and remember in console we also sepcified req.body. Now here body in only the name of the image. So our body parser is not really able to handle files  and so that's way the file is not showing up in the body at all, and that is the whole reason why we actually need the multer package. Lets now take a look at our folder, and so here we have an image, but if we click it now we can't realy see it because as we can see here in console it desn't even have an extension. the file really showed up here in our folder that we spcifiel as options of upload. It's working, but not where we want it, so we want to give it a better file name, and we also want to re-organize this code that we have at this point a little bit. NEXT VIDE.
in this console the file name looking like this: 
filename: '627c70a220023cb3cf1358ba22a376ed // here no no extension. like .png, .jpg etc
*/
exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  // ------------------
  // ------------------
})

/*
* lecture 199
* Configuring Multer
Let's now actually configure Multer to our needs. First giving images a better filename, then second allowing only image files to be uploaded onto our server.
And to start, let's actually move all the multer-related stuff from the userRoutes(where we put in previous lec) to the rserController. Right at the top of of userController file, Also cut a middleware that we put in the /updateMe, and export from the userController file. and then import it, with userController.uploadUserPhoto.

? Let's now go ahead and configure our Multer upload to our needs. And so for that we're going to create one Multer storage one multer filter. And then we're going to use that storage and the filter to then create the upload form there.
So let's do that right here at the top of the userController.js file.  

To store we use multer.diskStorage(), We could also choose to store the file in memory as a buffer, so that we could then use it later by other processes, and actually we're gonna do that a bit later, but for now we want to really store the file as it is in our file system. So diskStorage() will take a couple of options, and the first one is the destination, but now we cannot simply set it to this path['public/img/users'] like we did before. Now this is a bit more complex. 
So, really this destination here is a callback function with goes like this: destination: (req, res, cb) So this callback function has access to the current request, to currently uploaded file,  and also to a callback function. And this callback function is a bit like the next function in express. but we calling it cb here, which stands for callback, so that's a different name then next, because actually it doesn't come from express.  But it's similar in that we can pass errors in here, and other stuff as we will in a second. 
So now to define destination we actually need to call that callback function, and then first argument is an error if there is, and if now then just null, and the second argument is then the actual destination. So again; this all looks a bit weird and complex, so lets actually take a look at multer documentation on github.
Now we need to set the filename property after destination. and agin this is very similar callback function with a similar arguments: request, file, and callback, And then in a function, we want to give our file some unique filenames. And the way we're going to do that is to call them, user-userId-currentTimestamp, and then file extension, something like this:
! user-8394jk34jkd-34893489.jpeg
And with this we can basically guarantee that there won't be two images with the same filename. If we used only the userId, then of course multiple uploads by the same user would override the previous image. and if we only used user with timestamp then if two users were uploading an image at the same time, they would then get the exact same filename. 
So first of all let's actually extract the file extension from the uploaded file. How do we get that? well from the previous lecture where we logged req.file, where in console we see a property called mimetype, in this as a value we have a type of the uploaded image, and remember this req.file exactly the 'file' that  we passed in in this function. so here we have mimetype with value image/jpeg, so this is where we gonna get file extension. so: ext = file.mimetype.split('/')[1]; // so this is the extension. 
And no just like before we need to call the callback function will no error, and then the filename that we want to specify. So for userId, since we have request so it's simple, req.user.id. this is the id of currently logged in user. then to timestamp simply Date.now(), and then the .ext for the extension. 
cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
this is actually our Storage. And so basically a complete definition of how we want to store our files, with the destination and the filename.
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

Next up, let's create a multer filter, le's call it multerFilter
And the filter in multer is simply again a callback function, similar to ones we had before accessing the request file and the callback function. 
The goal of this function is basically to test if the uploaded file is an image, and if it is so then we pass true into the callback function, and if it's not we pass false into the callback function along with an error. Because we do not want to allow files to be uploaded that are not images. And so that's exactly what this filter is for. Now if in your own application you want to upload something else, let's say CSV files, then of course you can test for that instead of images.   
So, let's test if the uploaded file an image, for that we will once more use the mimetype because whatever image type is uploaded, so no matter it it's a jpeg, or png, or bitmap, or a tiff, or really anything the mimetype will always start with image.   if(file.mimetype.startsWith('image')), if this is true then we pass in null and true in cb function. otherwise we'll then pass an error and then false, so here we will now create an appError just like we've been doing all along.  
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please only images', 400), false);
  }
};

Great!, We have storage and filter, now it's time to actually use them in order to create the upload. 
const upload = multer({ dest: 'public/img/users' }); Now the upload will not look like this but instead we'll pass in these variables. 
So in multer we can specify the storage property. and then the file filter. 
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
OK, and that's it. And of course we could put all of this here as an argument directly. but this looks clean and professional. 

Finally we then of course, just like we did in last video use this upload and on that we call single with the name of the field, and then from there we create an export our middleware, which we already included on the route. 
exports.uploadUserPhoto = upload.single('photo');

Now test it from postman.   
*/
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');
/*
Perfect all of our multer configuration are working but of course there is still one step missing, and that's actually to link the user to the newly updated image, because right now in the databse we obviousely still have the path or actually the name of the old imgage, because nowhere in our code we specifiec.  NEXT VIDEO
*/
/*
* lecture 200
* Saving image name to databse. 
let's now just very quickly, save the actual name of the uploaded image to the corresponding updated user document. And doing that is actually pretty simple. 
So let's go here to the /updateMe middleware in userController, and the data that gets updated is here stored in this filteredBody object. And remember that this object here is the result of requeset.body leaving only the name and email. Now adding the photo to that as well is really simple. All we have to do is something like this:
if(req.file) filterBody.photo = req.file.filename
first we check if there is a request.file, then we add a photo property to the filterBody object.
const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) {
    filteredBody.photo = req.file.filename;
  }
So all we're doing is to add the photo property to the filteredBody object, that is going to be then update in User.findByIdAndUpdate(req.user.id, filteredBody, {...}) And the photo property is equal to the filename of the photo. 
That's it let's test it. Yeah..

And now just one small detail that we didn't talk about before. So,
? What happens when we create a new user? They will not have any photo in the beginning. And so let's actually change that. So for that we have a defalut image in users folder(default.jpg), So let's go to the user model. 
  so here in the photo field, let's now define a default. 
  photo: {
    type: String,
    default: 'default.jpg',
  },
And now let's actually go ahead and create a new user. and test it... WORKING... also update with new real photo. that's also working.

Awesome, that's really great. that really feels like a real world application now. Now what if the user actually uploads a super large image, let's say 10,000 per 10000 pixels. Or even an image that's not a square at all. In that case we need to resize the image and also format the image really to fit our needs in our application. And so that's is waht we will do next... 
*/
/*
* lecture 201
* Resizing Images
In this video we learn about image processing and manipulation with NodeJs, and in this particular case, we're going to resize and convert our images. So everywhere in our user interface we assume that the uploaded images are squares, so that we can then display them with 50% border radius, this only works when they are squares. But of course in the real world usres are rarely going to be uploading images that are squares. So our job now is to actually resize images to moke them squares.
So in userContoller we gonna that. 
We'll add yet another middleware before the updateMe and then that middleware will take care of the actual image processing. let's do that right after multer, because they are kind of connected.

/*
so we defined a resizeUserPhoto middleware, and before we continue let's actually add this middleware to the middleware stack in this route(/updateMe), so that's in userRoutes. and then right after the photo has been uploaded we add.. 
And so at this point we already have the file on our request, at least if there was an upload, and if there was no upload then of course we don't want to do anything that means we want to go to the next middleware directly. so if statement...
Otherwise we want to do image resizing. And for that we are going to use the sharp package. So, first of all let's install it. 
! npm i sharp
And require that in userController file. Sharp is a really nice and easy to use image processing library for nodeJs. And there's fairly a lot of stuff that we can do with it. But where it really shines is for resizing images in a very simple way. And so, that's exactly what we're looking for here. so let's use it....
we say sharp, and then we basically need to pass in the file. Now when doing image processing like this right after uploading a file then it's always best to not even save the file to the disk, but instead save it to memory. so for that we need to change a little bit our multer configuration, actually just the multer storage, because now we no longer need any of this(multerStorage) 
And instead multerStorage will be simply multer.memoryStorage(), const multerStorage = multer.memoryStorage();
 So as I mentioned earlier this way the image will then be stored as a buffer, and that buffer is then available at request.file.buffer,
So this is way more efficient, instead of having to write the file to the disk and here read it again. We simply keep the image basically in memory and then here we can read that. 
Anyway, calling the sharp function like this: sharp(req.file.buffer) will then create an object on which we can chain multiple methods in order to do our image processing. So the first one that we're going to do is resize() and then here we can specify the width and the height, and so let's say 500 and 500,  so remember we want square images so height needs to be same as width. Now this will then crop the image so that it covers this entire 500 * 500 square. and actually we can change this default behavior if we wanted to. And so let's again take a quick look at the documentation. https://sharp.pixelplumbing.com/
We could pass as a third parameter options object, where we could then define the fit. we could also define the position, see doc. In this case what we have is enough. So, let's move on to the next step. 
Because what I want to do next is is actually convert the images always to jpeg. and for that we use toFormat('jpeg'), 
We can also then define the quality of the this jpeg, so basically to compress it a little bit. so that it doesn't take up so much space, and so for that we use the jpeg method and set an option, in this object with quality with 90%;
Now we're almost done, but not entirely. Because now in the end, we then finally want to write it to a file on our disk. And for that we can use toFile(), now this method here is actually needs the entire path to the file. So basically public/images/users and then file name, and the filename format we want same as we did in previous lecture, like user-userId-currentTimestamp-extension. So we save it in the request.file.filename, first. Now why we are saving it on req.file.filename =  user-${req.user.id}-${Date.now()}.${ext}; Well,it's because right now this filename is not defined. So when we decide to save the image into memory so as a buffer, the file name will not really get set, but we really need that file name in our other middleware functions. like in updateMe we use req.file.filename to update into database. Here we can get rid of ${ext} so extension, because we already know that it will always be a jpeg, so we simple put jpeg. there is no need to get the file extension. And that's actually it. 
All we need to do now to finish is to then actually call the next middleware in the stack.

NOW TEST THAT. PERFECT...

[ Difference in disk and memory? 
Disk storage typically refers to non-volatile, persistent storage devices like hard disk drives (HDDs) or solid-state drives (SSDs). 
Memory, specifically RAM (Random Access Memory), is a type of volatile, temporary storage that is used by the computer's processor to store data that is actively being used or processed. - ChatGPT]

*/
// Changed previous one. 
const multerStorage = multer.memoryStorage();

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({
      quality: 90,
    })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};
/*
* QUICK RECAP:
We created a new middleware function that's going to be running right after the photo is uploaded. And that upload is now actually happening to a buffer and no longer directly to the file system so that's why we use memoryStorage();, But of curse this multer filter is still working, and so we can still only upload images, And so in resizeUserPhoto middleware  we put the image's filename on req.file.filename, so that we can then use it in the updateMe route handler. and then we've the actual image processing itself. where we first resized it to a square, then formatted to jpeg, with the quality of 90%, and finally we then write that file into our filesystem to the exact same folder that we specified before. So this is how it works when we need some image processing, but we do not need processing then of course we can keep using direactly on disk that we commented in this lec, this:
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});
*/

/*
* lecture 202
* Adding Image Uploads to Form
So let's now allow users to uploads their photos right on our website. So when we click on 'chooose new photo', we basically want to opan a new window for which we can select a new image to upload and then when we click the 'save settigs' button and submit a form then we want to upload that image into our backend and update the user. 
And so the first step to doing that will be to add a new input element to our html, basically to our pug template, which will then allow that file selector to open when we click. So let's go to accoutn.pug file.
right now we have a a-tag, but of course it's not a link that we're going to use, so we need:
input(type:'file', accept='image/*'), we can then specify whihc kind of file we actually accept. we can do something like that accept='image/*' so for image with all formats. so mimetype starting with image., also give the id and name fields. Here we put name as photo, because that's the name  that we have in our user document, and it's also the field name that multer is expecting. And then we also specify the label for it. 
input.form__upload(type='file', accept='image/*', id='photo', name='photo')
label(for='photo') Choose new photo

Now just like before, there are two possible ways of sending this data to the server. first without the API as we did, weher weh difine the action that we want to take and also the method, and with that the data then directly sent to the server. Now If we wanted to send the file using this method we then would need  to specify another option here. and that is the enctype='multipart/form-date', So here again we have this multi-part, so as we said before multipart is always for sendong files to the server. And again we actually need the multer middleware to handle this multipart form data, And actually the name multer comes form multipart, Anywat if we wanted to send the data without an API, we would always have to specify enctype, otherwise the form would simply ignore the file and not sent. 
But we're actually using it with the API, so we do not need to specify the enctype, but we will kind of have to do it programmatically. And so let's actually do that. so lets now send our data, including photo by doing api call. open index.js form public/js folder. 

Here we actually send the data to be updated on the server, well we're not really sending them here, but we're selecting them from the form and then passing them into updateSettings. But now remember how i said that we kind of needed to programmatically recreate a multipart form data. and so we need to do it like this.  const form = new FormData();, Now onto this form we need to keep appending new data, basically one append for each of the data that we want to send. and so form.append() and the first one is the name and then the value of that name. so form.
append('name', document.getElementById('name').value)
form.append('email', document.getElementById('email').value);

and then into updateSettings we need to pass the form. And our ajax call using axios will then actually recognize this form as an object and will work just the same as it did before. this is equivalent to what we had before with name and email, but now of course let's also add the photo which is the entire reason why we now have to do it like this.     form.append('photo', document.getElementById('photo')) this is same, but now here this not .value, but instead .files And these files are actually an array and so since there's only one, we need to select that first element from the array.
form.append('photo', document.getElementById('photo').files[0]);
Now just log the form to the console.
But in a nutshell we basically recreate this multipart form data. 
TEST AND WORKING.
*/

// UPDATED ONE
if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);

    updateSettings(form, 'data');
  });
}

/*

* lecture 203
* Uploading Multiple Images
So now that the user photo upload feature is completed, let's now learn how to upload multiple files at the same time and also how to process multiple images at a time. And so in this lec and the next one we're going to be uploading and processing tour picture. 
And to start let's actually remember what kind of images we want for our tours and also how many, so let's take a look to our tourModel. so we have imageCover(1-img) and then images which is an array of strings(3-imgs), 
Now the way we're going to upload these images and process these is going to be very simila. LET'S GO TO TOURCONTROLLER

/*
Just like before we'll store the images in memory. and also we only allow images to pass our multerFilter, And then we create our upload in the exact same way as before, 
After all these, Now, let's actually create the middleware out of this upload. And now here comes the different part, so something that going to be different to what we did in userController, because there we had upload.single() that was because we only had one single filed with a file that we wanted to upload, that was photo field.
But now we actually have multiple files and in one of them we have one image and in the other one we have three images.  So how can we do that? 
Well, we're going to use upload.fields(), and so multer is actually perfectly capable of handling this kind of situations. so here we pass in an array and each of the element is an object where we then specify the field name. the first one is imageCover, then maxCount is 1, so that means that we can only have one field called imageCover which is then going to be processed. And then the other field in our tourModel is images, and here maxCount is 3. And in case we didn't have the imageCover, instead if that only had one field which accepts multiple images or multiple files at the same time, we could have done it like this: upload.array('images', 3)
So when there's one image then upload.single('image'), and when there is multiple with the same name, then it's upload.array('images', 3), And when there is a mixed of them then upload.fields([{},{}]) with array, and as an element an object for each field. 
Now let's just recreate a body request from postman similar to what we specified here in upload.field(), so basically similar to what our multer upload expects, so one image cover and three images. Now we're not going to send this request that we created in postman, because we don't have any logic implemented to handler it at this point. we are not uploading into our file system, but only saving it to memory. 

And so just to quickly take a look at them lets actually crete our next middleware here, which is going to be the one to process these images. 
And in case we have multiple files then they will be on req.files not just file.  
Now in order to test, all we need to do is to actually add these two new middlewares to the route handler. so in tourRoutes, and just like with the users, to keep is simple here we will only allow uploading images on a tourUpdate, 
Now test the request that we created. Of course it's not really going to do anything, it's not going to be saving these images anywhere also not updating the database, but for now we just want to see the result in the console. 
so here in console we have imageCover, assigned an array which contains an object as an elements and that element contains fieldname, originalname, encoding, mimetype,  then the buffer, and the buffer is the representation of the image in memory. Now what's import here to note, is that actually even the imageCover is an array, so when we gonna retrieve the image from teh imageCover we then will have use the first element of the array. 
And then images here is also an array, and for each of image we have an object as an array element with properties just we had in imageCover.
Now all we need to do is to create resizeTourImage middleware, here these images will then be processed and also save to disk. NEXT LECTURE
*/
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = (req, res, next) => {
  console.log(req.files);
  next();
};

/*
* lecture 204
* Processing Multiple Images
Before we sart there is actually something that we need to fix in the userContoller, in resizeUserPhoto that's that we actually neet to await this whole operation of sharp, so await sharp(req.file.buffer).resize... all of these here will return a promise, that make sense becaus all of these operations here thay take some times and so of course they happen in the backgroud. Now the problem here is that right now we are calling the next() function after that, without actualy awaiting the shap operations finish, and that that's not a good idea. so await it and then catcchAsync...

And now we're actually going to do something with our tour images. 

Now just as before, in case there are no images uploaded, then we want to move straight to the next middleware. And here we gonna take it one step further, by requiring that there is both the imageCover and images, basically we want to move to the next middleware in case there is no request.files.imageCover Or..

let's start by processing coverImage. So where do we actually get the coverImage. 
well, remember, how I said, that it's at request.files.imageCover[0]
then, we want to resize it with 2:3 ratio, and the width will be 2000px, and the height 1333px. That's is nice 3:2 ratio which is very common in images. 
Next we also want to format it s a jpeg with 90% quality. And then save it as a file. but this time is public/image/tours, and here let's actually define our filename separately, because we're actually going to need it again. Here for id we use req.params.id, remember this route always contains the id of the tour. 
And now as a one last step, we actually need to make it possible that our updateTour handler then picks up this image cover filename to update it in the current tour document. Here to update we're using updateOne factory function. and that one will actually simply update all of the data that's in the body onto the new document. And so now the secret is to actually put this imageCover file on the request.body, So, req.body.imageCover = imageCoverFilename; here we could small refactor by putting req.body.imageCoven when defining the filename, like this:
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
Great now before moving on to the other images, let's actually test it with what we already have at this point.   Yes it's working for imageCover

Now images are also an array, which then contain all of other new file uploads. So, let's now use a loop to precess each of them in one iteration. we use foreach and then in our callback function we get access to the current file. 

  here we need to create the current filename, because here we want to name as image with 1 -> 2 then 3. So in our callback function we also get access to the current index.
  Next up comes the processing step itself, which is again very similar to previous ones. 
  And now why do we actually need this filename, well because we need to push this filename into request.body.images, Remember in our tourModel req.body.images is an array. and now we need to create that array, so start with empty array. req.body.images = []; And then in each iteration, we will then push the current filename to this array. req.body.images.push(filename);
  And with this we're almost done. There is just one small problem, which is the fact that we're actually not using async await correctly here in this case, so in this loop. This async await here is only inside of the callback function of the foreach loop, and that will actually not stop the code from moving right next to the next() middleware. So right now we're actually not awaiting any of these sharp, because this async/await happens inside of the callback function one of these loop methods. And we run into this kind of problem actually before. But there is fortunately a solution for this. because since this(callback of foreach) is an async function here It will return a promise. So if we do a map we can actually save an array of all of these promises. And then if we have an array we can use promise.all to await all of them. And so with that we will them actually await until all this code(all these image processing) is done.  and only then move on to the next line, which is calling the next middleware.  Let's now use promise.all,    We will not save an array which is returned by map function in to variable, instead we'll use simple promise.all on entire.
  READY TO TEST, yes working...

*/
exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) {
    return next();
  }

  // 1) Cover Image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({
      quality: 90,
    })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({
          quality: 90,
        })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );
  console.log(req.body);
  next();
});
/*
* QUICK RECAP: 30/11/2023 [2:23 AM]
So, we created a multer upload using the memory storage and this filter only for images, then we created the uploadTourImages middleware by using upload.fields, which takes in one image cover and three imags, and then on the request it will put the files property. Then in our next middleware we resize these images and first the cover image, then the remaining three images. What really point to noted is to how we put the image filename on request.body, and we do that so that in the next middleware, which is the actual route handler, it will then put that data onto the new document when it upload it. so we do that with the imageCover, and we also do that with the remaining images by pushing it into body images, which as know from our tour schema expects an array of strings and so in this case, filenames. So about these other images, we had them on request.files.images, so it's an array, and so of course we loop through it using map method. And we use map so that we can basically save the three promises which are the result of that three asycn function in map method, so we can then await all of them here using Promise.all(), And only after that we then move on to the actual tour update handler, and this part is really important. So it's importat that we only move on to the next middleware as soon as this part here(all codes in map method) is completed, because otherwise req.body.images will  be empty, and of course our filenames are then not gonna be saved to the current tour document. 
*/

/*
* lecture 205
* Building a Complex Email Handler
With the file upload part is finished, let's now turn our attention to sending emails. And we actually already sent email before for the password reset. But in the next couple of lectures we're gonna take that to a whole new level. And what we're gonna do is to build email templates with pug and sending real emails using the SendGrid service. 
And now in this first lecture we're gonna build a more robust email handler then one that we had before. So, let's open up our utilities folder, and here we already have email.js, But right now what we have here is just a very simple email sending handler, which is not able to take in a lot of options. And so now we're going to build a much more robust solution here. 
/*
So what I'm gonna do is to create a class, that class is gonna be called email, also we are exporting this class from this file. And then as always, a class needs a constructor function, which is basically the function that is gonna be running when a new object is created through this class.
Now let's actually take a look at how we would use this class in practice. And so the idea, basically whenever we want to send a new email, is to import this email class and then use it like this: 
new Email(user, url).sendWelcome(), So creating a new email, and then into it we want to pass in a user, and this user will contain the email address, and also the name in case we want to personalize the email, and also the URL, And a good example  for this one is for example the reset url for resetting the password. So, a new email object, and then on there we want to call the method that is actually going to send the email, let's say sendWelcome, and so that one is gonna be sent whenever a new user signup for our application. We will then also have send password reset. And the way we will set all this up will make it really easy to then keep adding new and new methods similar to these ones to send different emails for different scenarios.   
Anyway, since we passing the user and the url into a new email, so our constructor then needs to take these in as arguments. this.to will be equal to user.email, and we also want to define the first name of the user in order to basically personalize the email. Also this.url = incoming url, and finally also set this.from right here, so basically at the object level, And so each object created from this class will then get this property. 
Now one thing that I really  want to do is basically define this email(our email) address as a configuration variable, so an environment variable that we can very easily change by manipulating the config.env file. EMAIL_FROM=muhammadugv66@gmail.com
Next up, let's create a method here, in order to create the transport, similar to what we had before. And here we actually want to have different transports whether we are in production or not. So when we're in production, we actually want to send real emails, and we will do that a bit later using SendGrid, but if we are not in production then we still want to use our Mailtrap application. So instead of the email going to a real email address it will get caught into our mailtrap inbox, so that  we can actually take a look at it. Now this transporter method here returns a new nodemailer transport, that we created like this nodemailer.createTransport({}), Or on the other hand when we're in production  then the one that's we'll implement later. 
Now lets create the send method, And so this is gonna be the method that will do the actual sending. And this one will receive a template and a subject.  why we need the template and the subject here? So remember how we said in the beginning that we're gonna have one method called sendWelcome, and also one method for sending a reset password email. so let's also add this two methods.
The sendWelcome method will not take any arguments, all it really does is to call send with the template and the subject that we want for this email, so this makes it really easy to send different emails for all kind of different situations. So we have one generic/general send function and then all of others are more specific ones, like sendWelcome etc. This template name we put here in send will be a pug template that we're gonna create. sendWelcome() {
    this.send('welcome', 'Welcome to the Natours Family');
  } // just like this we don't need to worry about any implementation details when we're actually sending the email.

Anyway, let's now actually then build this send function, And so what we're gonna do in this function is to (1) first render the HTML for the email based on a pug template.  (2) Then define the email options. (3)And then finally create a transport and send email.
So starting with point(1), And usually up until this point, we only ever use pug to create a template then we pass the name of the template into the render function on the response, so just like this, res.render('nameOfTemplate'), And what this render function does behind the scenes is to basically create the html, based on the pug template and then send it to the client. Now in this case we do not want to render, all we want to do is to basically create the html out of the template so that we can then send that html as the email. So basically defining it here as an option in mailOptions, with html property. We are interested in sending an html email. And so that's why we're gonna have a pug template from which we will generate this html. So we need to require the pug package here in the email.js file. And then we need to use pug.renderFile(),So this will take in a file and render the pug code into real html. So that we can then save into a variable html.  So where is that template file?  well it's at __dirname, which remember is the location of the currently running script, so that is right now 'utils' folder. so from there we need to go one step up, then into views, then emails folder and in there we're have a template file, so ${template.pug} like this:     const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`); So for the welcome email, this template is gonna be called welcome, and remember this template variable is one that we passed in send method, And so let's now actually create that welcome template in the views/emails. 

(2) That's the first step, Next up, let's define the email options, so from is now, this.from, also to is this.to, and subject is equal to the subject that's coming in, and we have our html, which is html. Next we also want to include the text version of our email into the email, and that's actually really important because it's better for email delivery rates and also for spam folders. And also some people just prefer plain simple tex emails instead of having the more formatted html emails. And so basically we need a way of converting all the html to simple text, so stripping out all of the html leaving only the content. And for doing that, we are going to install yet another package, and so this one is called html-to-text So,
! npm i html-to-text
let's include that here in email.js file, and then use that to convert that html to text.  we use fromString method and here html is stored in html.
And actually I forgot something very, very important in the step(1) so in the render file, because just like with res.render we can also pass data into render file, and of course that's very important if we want to actually do our email personalization with the name and also passed in the url. And so let's do it just like we did normally in the render function.so with an object. so we also send firstName, url and subject to the template. 
(3), Now let's finally create a transport using our newTransport function and then send the email. that's this.newTransport(), basically newTransport() method is already created so we just call that, and on to that we chain sendMail method and pass in mailOptions. then we need to await all of these, because it's an async function. so mark the send() method as async, so we can await. Now we also need to await the function here from sendWelcome, because this.send() is now indeed an async function.
That's actually it, for this class. And so in the next video we will then actually go ahead use this class in order to send a welcome email. 
* QUICK RECAP:
We created a new email class from which we can create email objects that we can then use to send actual emails. And to create a new email object we will pass in the user and also a url, that we want to be that email, so then all user's stuff and url to the current object and also some other settings that we want to have available such as this.from to inform about sender.   Then we've a newTransport function which makes it really easy to create different transports for different environments. And so once more, abstracting that logic away from the actual send function which should only be concerned about sending the email. After that we have send function which takes in a template and a subject, and based on that i creates the html from a pug template which will then be set into the email options, which will at the end of the function, finally sent. But it's not going to be this send function that we will use in our code. So instead we're going to be creating one different function for each type of email that we want to send. And the first one that we created here is the sendWelcome. So sendWelcome will basically the preset the template name as welcome and as the subject as string that we pass.

*/
// email.js file(till now)
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Muhammad <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // SendGrid
      return 1;
    }

    return nodemailer.createTransport({
      // service: 'Gmail',
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        password: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject: subject,
    });

    // 2) Define the email Options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html: html,
      text: htmlToText.fromString(html),
    };

    // 3) Create a transport and send email

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family');
  }
};

/*
* lecture 206
* Email Temaplates with Pug_ Welcome Emails
So in this video we're gonna use the power of pug to create a really nice email template and then send a welcome eamil based on that template. that template is welcome.pug.
? I use this link, and get the built in link,  https://github.com/leemunroe/responsive-html-email-template Then I converted that html using this tool https://html2pug.vercel.app/ to pug,

Anyway, when we're building an html email, we always need to inline all the styles. As here we have, we'll export it to the _style.pug file, and will include it in welcome using include _style. 
Here this welcome.pug file there is lot of tables,  because we copied this code from git repo. In there we have //CONTENT  that is the part we're gonna put all our content. 
Now the thing is that we of course, will have many different templates and in case of this project we will actually only two ourselves, but there might be many emails for many situations, And so of course we will a way of reusing all of these codes that is of this CONTENT, Basically all of pug codes, except that are in CONTENT should be reusable. And actually that's exactly what we did before with our base template. so we put everything that is reusable for all the templates inside of the base, then we have to block there and all the other templates. Then simply extend that block. And so that's exactly what we will do now. so create a new template called baseEmail, put all codes into the baseEmail and then cut the content from there, and there create a block called content again. And then in welcome we put that content inside content block. and say extends baseEmail,
Here in baseEmail we have title tag so we need to change it to the subject that we passed into the template,  remember into the template we passed the subject, url and the firstName, so here we put the subject. Now change all other stuff with the things that we passed in. like name etc. 
Completed, so this welcome template will use whenever we call sendWelcome method. So let's now go ahead and do that.

? So from where do we want to send the welcome email? 
well that's in the authController and then signup function. So there we need to import the Email and then use it. 
/*
  so here in signup function, let's now use this Email class, so new Email(), and remember the first parameter is the user, which is the newUser,  and url, which we gonna create in a second. And then chain call sendWelcome method, And now all we need to do is to actually await this sendWelcome function, because send welcome is an async function, And so when we actually await it, we then wait until it finishes. 
  ? Now to specify url, What URL do we actually want here?
  well, remember in then button, where we want put this url, it says 'Upload user photo', So basically we want to point to that user account page, http://127.0.0.1:3000/me so right here, from there we a user can then change their photo. We could put hard code by just copy and past this url, but then it would only work in development, So instead of hard coding we will get this data from the request. So basically we will bet what protocol we are using, and then also the host. let's replace. to get host we need to to get function, and there pass the host as a string.
  And now let's actually test it. All we need to do for that is to just create a new user using signup from post man. Now when we create this new user then we should get a new Mailtrap, 
  ! So previously i mailtrap was not working because in auth we put password instead of pass. now correct is: pass: process.env.EMAIL_PASSWORD, Now this time we got a new message in mailtrap, with our formatted message. Also we had one more error while converting html email to plan text, we used formString method, but it's no more on html-to-text, so instead we should use htmlToText.convert(html) method. -Fixed by me
  GREAT GREAT GREAT, And it actually looks really nice. Also this button 'Upload User Photo' also working, It takes us to our accout page.  
  Remember I doesn't work on our website because we don't have any signup form on our website. 
*/

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  //  http://127.0.0.1:3000/me
  const url = `${req.protocol}://${req.get('host')}/me`;
  console.log(url);
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

/*
* lecture 207
* Sending Password Reset Emails
let's now very quickly also send emails for password reset, and that email will be very similar to the one that we built. let's just go ahead and copy and paste into a new file called passwordReset.pug, and change the some content. 
Now next up, let's actually create the sending function in email class just we built for Sendwelcome(),
async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset Token (valid for only 10 minutes)'
    );
  }
Now as a final step we need to call this method, so In our authController in forget password.
 try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();
 }
LET'S TEST THIS, yeah we get a mail on mailtap. And copy that url from there and paste to reset passwrod, and remember that url will contain the token, OKK, Yes that's also working. Now try to loging with new passwrod, YEAH ALSO WORKING...

At this point all our emails are actually getting courght in mailtrap, and so that's because in development mode, we don't want to leak these email to real users. Also we would have no way of taking a look at these emails if they would really end up in our real users email inboxes.  However in the next video we'll then start to send real emails so emails to real email addresses which will then endup in their inboxes.  
*/
async sendPasswordReset() {
  await this.send(
    'passwordReset',
    'Your password reset Token (valid for only 10 minutes)'
  );
}

/*
* lecture 208
* Using Sendgrid for _Real Emails
So let's now use the sendgrid service in order to send real emails to real inboxes, rather than to our development inbox at mailtrap. 

! COULD'T SIGNUP, TRY IT...

* just for now. 
go to the email.js and then newTronasport()

/*
  here we use nodemailer.createTransport(), and remember how i told when we first created this email handler, that there are some services that are already predefined. and SendGrid is is one of them.  so we can specify service and then 'SendGrid', we already did this before for gmail. and with that all we needed to then pass in the username and password. Here it's going to the exactly the same. And that's the reason why we actually don't even need to specify the server and the port, because nodemailer already knows this data because we specifying SendGrid service. 
  And now to test this let's create a new user with a real email address. 

  ! TRY TO SIGNUP ON SENDGRID, HERE USED JONAS'S TOKEN, BUT WORKING AT ALL.... SO TRY TRY TRY...............

  */
  // BOOKING ROUTES FILES
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // SendGrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
  }

/*
* lecture 209
* Credit Card Payments with Stripe
In this last part of the section we're now gonna accept credit card payments in our application using Stripe in order to allow users to actually buy tours.
So stripe is the best and most popular and also easiest to use software platform to integrate payments into ony website.Signup Now stripe account is in test moode, as soon as we really want to start accepting real payments involving real money from real customers, then we'll have to activate stripe account, for that we will then have to provide stipe with a bunch of data about your business. But of course in this buisiness we're nto gonna do that. so we'll always just work in this kind of test development mode. In test dashboad we can see all our transitions, just fake amount, all payments methos, credit card number, And by the way, we actually never do get access to the reall credit card number of the customer, we will always just see last four digits. we can also see the entire blance...

Before get started we need to define couple of settings about our account.  like change branding, which will make the stripe checkout pages match our brand, like change icon color. 
Now click on get API key, so there will on publishable key and one secret key. So publishable key is basically a public key, that we can use on the front-end, and a secret key is the one that is needed on the back-end. 
Finally take a quick look at the documentaion. It's really easy to find what we needed, using their documentation.
We're gonna use the payment features of Stripe, and they have a couple of differnet options. Now on the web, we can use 'Stripe Checkout', which is basically using a performated checkout page. Or we can also use 'Stripe Elements' when we really want to build our own checkout experience. But we'll just use the checkout, which is actually brand new, so it's really future-proof at this point. Then from checkout we can use it on only the client or together with the server. So when we only use it on the client side, then we don't even need a server at all. But this way of using Stripe is only really really small stores. we want something a bit complex, so for that, we use server integration. And so, of course we still need to do something on the client side, but most of the code will actually be on the server side. 
Alright, but now before we actually start to integrate the stripe checkout product into our app, I just wanted to quickly layout the entire workflow that we're gonna implement over the next couple of videos. So,
It all starts on the back-end where we're gonna implement a route to create a so-called Stripe Checkout Session. And this Session is gonna contain a bunch of data about the object that can be purchased. In our example that's the tour, So the session will contain the tourPrice, the tour name, a product image, and also some other details like client emai. 
Then on the front-end we're gonna create a function to request the Checkout Session from the server once the user clicks the buy button. So once we hit the end point that we created on the backend, that will then create a Session and send it back to the client. Then based on that Session, Stipe will automaticallly create a checkout page for us where the user can then input all the details like creadit card number, expiration date, and all that. Then again using that session, we will finally charge the credit card, And for that, we're gonna need the public key, so the one that we just saw before,  So the secret key we will need on the server as we see up there in the first step and the public key is gonna be used on the front-end. And what's really important to note here is that it's really Stripe, which will together with the session, charge the credit card, and so therefore the credit card details never even reach our server, which makes our lives as a developers a lot easier because we dont have to deal with all the security stuff that's related with managing and storing credit cards, So stripe takes all that away from us, we basically just use their API like this. 
Anyway once the credit card has successfully been charged, we can then use something called Stirpe Webhooks on our back-end, in order to create new bookings. Now this part of the workflow will only work for deployed websites, so websites that are already running on a server. And so this part of our workflow, we're only gonna be able to implement by the end of the next section. But for now, we'll actually find a temporary work-around to this, which is not really secure, but it's gonna work just fine for now. Soo keep this diagram in mind also this concepts that we actually use the session to charge a credit card and we don't really do that directly. 

! See pdf (STRIPE WORKFLOW)
*/

/*
* lecture 210
* Integration Stripe into the Back-End
So in this video let's integrate Stripe into our backend by creating that API endpoint which will create and send back a Stripe checkout session. And so at this point we're actually gonna start creating our next resource, and so that's the bookings. And we'll start with the bookingRoutes in routes folder. and also create a bookingController. And let's also integrate this right into app.js, 

const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();
/*
And so now let's actually go ahead and create our first route here in bookingRoutes. And the route that we'll create here once again not follow the rest principle because this one is not really gonna be about creating or getting or updating any booking. Instead this route will only be for the client to get a checkout session. And so let's actually call this one /checkout-session, then we need to protect this route, so that only authenticated users can actually get a checkout session. And then add bookingController.getCheckoutSession, Now actually there's one more thing we need to do here in the routes which is to specify a url parameter, and that's going to be /:tourId, So, basically we want the client to send along the id of the tour that is currently being booked. And that is so that we can fill up the checkout session with all the data that is necessary, such as the tour name and the tour price..., 
Let's now create this route handler, We now have to access to the tourId, and so the first thing that we're actually gonna do in this handler function is to find that tour in our database. And for that we need of course the tour Model. so let's require it in bookingController file.

*/
router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckoutSession
);

module.exports = router;


/*
So, let's layout our steps here again. 
1) Get the currently booked tour
2) Create Checkout Session
3) Create Session as Response

1- GET CURRENTLY BOOKED TOUR:
Let's go the first step, that's really easy. just find the id, which is in req.params.tourId.
const tour = await Tour.findById(req.params.tourId);

2- CREATE CHECKOUT SESSION:
Next up, let's actually create that session here. And for that we actually install need to install npm package. So,
! npm i stripe
And in the meantime we're gonna go to our Stipe dashboard and get our secret key from there. There ones are just for testing, and then once we have our Stripe account active, we can get our live api keys. Now as with any other keys we will put them in our config file. 
Let's now require the Stripe package. And just with all the other packages before please make sure that you are on same version @7.0.0, const stripe = require('stripe'); Now this here will then expose a function basically. And usually what we do then right away is to pass our secret key right into that. just like this: const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); this will then give us a Stripe object, that we can work with. 
And so let's use that. stripe.checkout.session.create(); here in create() we pass the usual object of options. Now there are a lot of options that we can set here, but only three of them are required. So the first one is the payment_method_types, so that's any array where we can specify multiple types and card is for credit card. and right now that's actually all the payment option that we can use for Stripe checkout, but in future they will add a lot more. Then we need to specify the success_url: so that's basically the url that will get called as soon as a credit card has been successfully charged. so as soon as the purchase was successful, the user will be redirected to this url. for now let's simple specify that as our homepage, we're going to do that just as before. Then we also need to specify the cancel_url, for now this one is gonna be similar to success_url, basically it's the page where the user goes if they choose to cancel the current payment. And actually let's make them go to the tour page where they were previously. 
Next up, we can also specify the customer email. And so that's very handy because of course we already have access to the customer's email. And so with this we can save the user one step and make the checkout experience a lot smoother. Remember that this is a protected route, so as always the user is already at the request. 
Next up, we can then also specify a custom field which is called client_reference_Id, that's sounds a bit weird but actually it's going to be really important for us. So this field is gonna allow us to pass in some data about the session that we are currently creating. And that' important because later once the purchase was successful, we'll then get access to the session object again. And by then we want to create a new booking in our database. So remember the diagram, basically i'm talking about the last step in that diagram. And also remember how that's only going to work with deployed website. But still, let's already prepare for that here. So to create a new booking in our database we will need the user's Id, the tourId, and the price. And in this session we already have access to the user's email, and from that we can then recreate the user's id, because the email here is unique. We'll also specify the tour's price here in a second. And so all that' missing here is then the tourId. So that's what we gonna specify her on the custom field, like this: client_reference_id: req.params.tourId, 
Now finally we're gonna specify some details about the product itself, so tour in this case, so that's called line_items, which accepts an array of objects, so one object per item.  in our case that only gonna be one. So, we need to specify the name of the product, so it will be tour.name, and then we can also specify a description, And remember all these fields/properties names here they really come from Stripe, so we cannot make up our own fields. In description we'll put tour.summary,  Then we can also specify an array of images. Now these images here need to be live images. so basically images that are hosted on the internet, because Stripe will actually upload this image to their own server. And so this is another of the things that we can only really do once the website is deployed. But for now as a placeholder we'll basically use the onces from our hosted example website on natours.dev, from there we choose the cover image. and the name of the image we will simple replace tour.imageCover, Next up is the amount, basically the price of the product that is being purchased, so that is tour.price, and now we need multiply that by 100, because this amount is expected be in in cents [1$ = 100cents]. Then we also need to specify the currency. Finally we also specify the quantity. And so that's just one tour in this case. So that's actually it. So the payment_method_types, success_url, cancel_url, customer_email, client_reference_id, all of these are the information about the session itself. and then in line_items, there is information about the product that the user is about to purchase. 
Now let's actually store the session, const session, and we need to await this. Basically this .create() method returns a promise, because setting all these options here will basically do an API call to Stripe and so then of course that's an async function that we should await here. 
This in now our session now go to the last step which is of course to send it.

3- CREATE SESSION AS RESPONSE
let's send back to the client. 
res.status(200).json({
    status: 'success',
    session,
  });
That's it. 

We could try this out in postman. We got it but with some fixes. I changed the line_items: filed. 
Now it's success so we should kind of see this payment or at least this payment request, in our stripe dashboard. 
*/
// BOOKING CONTROLLER FILE

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    // line_items: [
    //   {
    //     name: `${tour.name} Tour`,
    //     description: tour.summary,
    //     images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
    //     amount: tour.price * 1,
    //     currency: 'usd',
    //     quantity: 1,
    //   },
    // ],
    // ! In current version of Stripe above code is not working, which is written by Jonas sir.
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
          unit_amount: tour.price * 100, // Amount is in cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
  });

  // 3) Create Session as Response
  res.status(200).json({
    status: 'success',
    session,
  });
});

/*
* lecture 211
* Processing Payments on the Front-End
In this lecture we gonna learn how to process payments with stripe on the front-end whenever a user clicks a button. 
And to start let's actually configure it that button so that it only appears whenever a user is actually logged in. in each tours we have a button 'Book Tour Now!', If the user's is actully not logged in then this button should redirect the user to the login page. So let's implement that in the tour template. 
So if there is a user logged in then that meas that we have access to the user variable. so we can do:
if user
  button.btn.btn--green.span-all-rows 'Book tour now!'
else // there's no user
  a.btn.btn--green.span-all-rows(href='/login') Log in to book tour
Now somethig here very important in 'Book tour now!' btn, thst si we should put the current tourId right here in this button element. Now why is that so important? well remember how the api endpoint that we just created('/checkout-session/:tourId') needs the tourId, and so that tourId needs to come from somewhre basically, and so right now we don't have that information anywhere on this page, and so we'll put it here right on this element, so then our javascript file can grab it from here and send it along with the request to the checkout session route. So just like we did with the map we're going to use a data attribute. data- and then whatever variable name that we want to define,  that's tourId in this case. so (data-tour-id=`${tour.id}`)
if user
  button.btn.btn--green.span-all-rows#book-tour(data-tour-id=`${tour.id}`) Book tour now!
else 
  a.btn.btn--green.span-all-rows(href='/login') Log in to book tour
Now next up let's up let's create a script in which we will do the request, and process the payment on the front end. just like before that will be in bublic/js called it stripe.js
/*
/*
And now here we actually need access to stripe library agin. but that package that we just installed before, so stripe npm package, that we used here in bookingController, So this only works for the back end. And what we need to do on the front end is to actually include a script in the html, and since we only need that script on tour page, so we'll do it just like we did with the mapbox script. so we will put it in the head block. let's copy this script from stripe's documentation     <script src="https://js.stripe.com/v3/"></script>
So this script then will expose a stripe object to the global scope. So now in stripe.js we can use that. We say:
const stripe = Stripe(), here Stripe is an object that we get from the script that we just included. And then here we need to public key. 
const stripe = Stripe(
  'pk_test_51OIXZQSG0Tco2w5skNQHdmPgV1tOeQO26QUDjuaAiFyvfjukSmdTr1jEWURIISmVOAjC20JIxccP6QRj1YnMHcKP001k7DR7eO'
);

And now let's finally create a function, that we gonna call bookTour, And so this function will take in a tourId, And this tourId is the one thats gonna be coming right from the user interface, that we put on button element using data attribute. Just at before we gonna get that one from index.js file, where we will then also call this bookTour function. 
Anyway, Once more specify the steps that we gonna take here. 
1) Get Checkout Session from API
2) Create Checkout form + charge credit card

1- GET CHECKOUT SESSION FROM API: The first step is to actually get the session from the server, and so that's where now this route here(/checkout-session/:tourId) come in. So this is the point where we are going to use this endpoint to really get our checkout session on to the client side. 
So let's store the session into session variable, and then we're going to await an http request, which once more we will do with axios.  And then into axios we can simply just pass the url, when all we want to do a simple get request. So up until this point we have always specified the method, and the url and the data, but we're only doing a get request, and so that's then much simpler.   console.log(session); Just to see our session object, Now in our index.js we'll basically connect that green button with this function that we just created of stripe.js file. 
import { bookTour } from './stripe';
Then as always let's select our element from the web page. const bookBtn = document.getElementById('book-tour');
And so new we can add that event handler to it. 
/*
Now we need to get that tour Id from that button, so that's on the e.target, here e.target is basically the element which is clicked, so the one that triggered this event listener here, in that element we have tourId in data attribute. just like this dataset.tourId, but in our pug file we specify like this data.tour-id, So, whenever there is a - (dash) it will automatically get converted to this CamelCase notation. when property and our variable is same then we simply can destructure it like this: const {tourId} = e.target.dataset;
And we call bookTour function with this tourId, Also we change the text of the button with something like 'processing', 
YES WITH console.log(session), we get a response object, as asios send response in an object, and indeed in that object we have session object. we have customer email, etc. 
Now as a last step actually create the checkout form, and charge the credit card. 

* index.js file
if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing';
    // const tourId = e.target.dataset.tourId;
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
*/
/*
2- CREATE CHECKOUT FORM + CHARGE CREDIT CARD: As a second step we will use stripe object to basically automatically create the checkout form plus change credit card for us.
it's very simple all we need to do is to await stripe.redirectToCheckout({}) and then in their we put options, but only one option. which is the sessionId, and that will come from the session object, that is in the session variable here, and remember we saw in console our session is in the data object created by axios, 
await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });

And now comes the greatest part of all which is to actually check out if this works. 
! I think there is a problem, It may due to Content Security Policy Issue, OR, According to Stripe documentation the stripe.redirectToCheckout() method is now depreciated.

Yes, After disabling the content security policy by using chrome extension built by google, on the site, now it's working....
For here we can get the card numbers: https://stripe.com/docs/testing#cards 
We can use just: 4242424242424242
Also we get the detail on stripe test dashboard, on payments tab.

*/

import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51OIXZQSG0Tco2w5skNQHdmPgV1tOeQO26QUDjuaAiFyvfjukSmdTr1jEWURIISmVOAjC20JIxccP6QRj1YnMHcKP001k7DR7eO'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get Checkout Session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    console.log(session);
    // console.log(session.data.session.id);
    // 2) Create Checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

/*
* QUICK RECAP: 
We started by creating the checkout sesssion, which needs as an input the tour Id, so that we can then store a bunch of details about the tour in that session, like tourName, summery, images  ect. So all that stuff that we want to show up on the checkout page and also in our dashboard. Then we also include the email so that the user doesn't need to fill it out the checkout, we included by using customer_email filed. And also we added the client_reference_id, and remember this client_reference_id, which will make a lot more sense once we actually get to use it. So we create this session with all these stuff whenever someone hits this '/checkout-session/:tourId' route. And so that's exactly what we then do on our front end rihgt in the stripe.js. So we get our session here in stripe.js file and then from here we create a checkout and charge the credit card using stripe.redirectToChecout(), and this stripe object here is simply using the stripe library with our public key. And remeber the tour id is stored right on the button where the use click to book a tour, That id is then read right here in index.js, wherever someone hits the booking button. and from there we call the bookTour function with the tourId. remember bookTour is the function that is in stripe.js file, which takes care of really processing the paymensts on the front-end. And so the result of all this  what we just saw at the end, where the user really get charged the credit card and purchased the tour.  PERFECT
Now what's missing here is actually whenever there is a new booking, we want to create a new booking document in out database. So we're gonna create the bookings model right in the next video. 
*/

/*
* lecture 212
* Modelling the Bookings
Let's now, really quickly, create the model for our bookigs so that then, in the next video we can actually start creating some real bookings. create a bookingModel.js file.
/*
this bookingModel is of course gonna be very similar to what we already did before.
Now remember how we said before that we were going to use parent referencing on the bookings, so basically keeping a referencing of to the tour and also to the user, who booked that tour. So remember we set the type to mongoose.Schema.ObjectId, and then the ref, set to 'Tour' basically point to Tour model.
.......
Finally we also want to create a paid property, And this one will be automatically set to true, but this is just in case that, for example an administrator wants to create a booking outside of Stripe. For example if a customer doesn't have a credit card and want to pay directly with cash. And in this case an administrator might then use our bookings API in order to basically manually create a tour, and so that might then be paid or not yet paid. 
Now what we also want to do here is to populate the tour and the user automatically whenever there is a query. So remember how we used to do that using query middleware, right on the Schema using .pre, We will populate for both the user and tour, and in this case that's absolutely no problem for performance, because there won't be many calls to the bookings, because only guides and admins will actually be allowed to do them. So basically for a guide to check how has actually booked their tours. So that's one of the use cases that I see for this part of the api. 
*/
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour!'],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!'],
  },

  price: {
    type: Number,
    required: [true, 'Booking must have a price.'],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
/*
* lecture 213
* Creating New Bookins on Checkout Success
let's now create a new booking document in our database whenever a user successfully purchases a tour. So we're back here in the booking controller and in the in the routeHandler which creates the checkout sessions. bookingController
Remember here we have the success url, and this url is the basis of the functionality that we're going to implement in this lecture. So whenever a checkouk is successful the browser will automatically go to this success url, it's right now simply a homepage. So when a checkout is successful we want to create a booking, So basically we want to create a new booking whenever this url is accessed. Now we could create a new route for this success, but then we would have to create a whole new page and that's not really worth it in this case. that's because what we're going to do in this lecture is only a temporary solution anyway because it's not really secure. Remember How we said some lec ago in that diagram that later when a website is actually deployed on a server we will get access to the session object once the purchase is completed using Stripe Webhooks. And so these webhooks will then be perfect for us to create a new booking. But for now, since we can't do that yet, let's use a work around, which is simply to put the data that we need to create a new booking right into this success url as a query string. 
And we need to create a query string becasue Stripe will just make a get reqeust to this url, and so we cannot really send a body or any data with it except for the query string. 
So let's do that and what we need here is basically the three required fields in our booking model, so tour, user and price. So,
success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
Now as I said before, this is not secure at all, because right now anyone who knows this url structure here could simply call it without going through the checkout process. So anyone really could just book a tour without having to pay.  But for now as a work around it works just fine because many peoply will of course will know that this is our seccess url. because actually we're going to hide that fact a little bit in a second. 
Let's now create the function that will actually create the new booking in the database here in bookingController.js file. 
/*
It calls createBookingCheckout, because later on we'll also have createBooking which will then be accessible from ou bookings api. 
Let's start by getting our data from the query string. And so for that we're gonna use destructuring, tour user and price will be available on the req.query, remember that's the query string. 
Then we actually only want to create a new booking if all of these here are specified. Basically we say if they don't exist then we return and go to the next middleware. 
? Now here what exactly is the next middleware actually?
well remember that we want to create a new booking on this home url, because again that is the url that is called whenever a purchase is successful with Stripe. And so what we need to do is to add this middleware function that we're creating right now onto the middleware stack of this route handler. So what route handler is that? that's in viewRoutes and from there first one with home('/'), So here we have to add that middleware function that we currently creating.
router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);
And again, this is here just kind of temporary until we actually have our website deployed to a server where we will then be able to create a better solution for this.
Here in the bookingController it's now time to actually create that new booking. So, we now need to import that bookingModel here.
So, we have to await the Booking.create({tour, user,price}), And we're not saving this into any variable because we don't really need it. We're not gonna be sending this back as an API response. At this point all we want to do here is to just create that new document. 
Next up we could say next(), so that then go to the next middleware, but that's not really ideal. So, keep in mind that the next middleware in the stack at the home'/' route is authController.isLoggedIn, and then viewController.gerOverview, so basically the function that is going to render our home page. But remember that this url is all of the data that we passed in query string, with username, price etc, So again that's not secure at all. And so at least let's make it a little bit more secure, So what we can do here is basically redirect the application now to only this home url, so basically removing the query string from the original url.
So actually we're now going to use something that we never used before. So we're going to use res.redirect(), now here what we want is the entire url, but without the query string. So, req.originalUrl, that's the entire url from which the request came, so from there we need to split it by the question mark. So if we split it with ? then we will have any array of two elements, So here we take the first element. And what redirect here does is basically to create a new request but to this new url that we passed there. So in this case it will create a new request to our root middleware, So this request again gonna hit home/root route, and so once more it will hit this middleware that we're now creating(createBookingCheckout), so second time it going to be hitting that, but now the tour, user, and price are no longer defined so then we will go to the next middleware, which finally is the getOverview handler, which then we'll just render the homepage, but without the query sting in the url. 
NOW IT'S TIME TO TEST THIS OUT, Indeed our very fist document is created. Tha awesome and so now we really a way of creating bookings whenever a booking happens with Stripe. 
Now again, once a website is deployed, we will then actually use Stripe Webhooks in order to create bookings in a more secure and much better way.
* QUICK RECAP:
Basically we added all the variable that we need to create a new booking to the success url. then we added a new middleware function here to the stack of that exact root route, and so like this whenever this url here is hit we'll attempt to create a new booking. But that new booking is of course only created when the tour, user and price are specified in the query. And so in this middleware function, if they are specified on the query then we create a new booking, then after that is done we remove the query sting from the url in order to make the whole process a bit less transparent for the user. Basically so that whole query string doesn't show up in our browser's url bar. And then down we redirect our application to this new root url here. So this way our newly created middleware here will be skipped and then our normal homepage will simply get rendered. 
In the next lecture we'll actually take care of implementing one last piece of our website, which basically for My Bookings page. This page will do is to basically display  one tour card for each of the tours that we booked. 
*/
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying.
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();

  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

/*
* lecture 214
* Rendering a User's Booked Tours
We're gonna implement my bookins page. So basically we're gonna render a nice page conataining all the tours that a user has booked
Let's start by adding a new route to our viewRoutes. which is /my-tours route, which again will be protected. Then in a viewsController we're gonna have a controller called getMyTurs 
router.get('/my-tours', authController.protect, viewsController.getMyTours);
let's go ahaed and create this controller. 
/*
exports.getMyTours = (req, res, next) => {};
And so now, what we need to do here is to find all the tours that the user has booked. So, basically, first we need to find all the bookings for the currently logged-in users, which will then give us a bunch of tour Id, and then we have to find the tours with those ids. 
1) Find all bookings 
2) Find tours with the returned IDs
Now instead we could also do virtual populate on the tours, and it would be great if you would implement with on you own exactly as we have done it before with the tours and the reviews.
But here in this function I actually wanted to show you  how we can do it manually because I think that's also kind of important and actually a virtual populate should work something similar to what we're gonna do here. And so actually we need two queries in order to really find the tours corresponding to the user's bookings. 
Anyway lets now start!
1) Find all bookings 
So let's create a variable for all the bookings await Booking.find({ tour: req.user.id }), Now remember that each booking document has a userId, So what we do now is to basically query by the userId, so that will then return us all the tours belong to the current user. So this booking now contains all the booking document for the current user, by really that only gives us the tourIds. Now we want to find the tours with the returned Ids. 
So the next step is to basically create an array of all the ids, and then after that query for tours that have one of these ids. so step 2

2) Find tours with the returned IDs
const tourIDs = bookings.map((el) => {
    el.tour;
  }); This loops through the entire bookings array and on each element it will grab the el.tour, because in tour we stored the id of corresponding tourId. Then in the end we have a nice array with all the tour IDs there. 
? from chatGPT
If you were to query the database and retrieve multiple documents using find or a similar method, the result would be an array of objects, where each object represents a separate document.

Then having all the tourIds, we can actually get the tours corresponding to those IDs. 
Here we cannot use findById, because here we actually need a new operator, which is operator is called '$in', Tour.find({_id:{$in: tourIDs}}), So basically what this is going to do is that it will select all the tours which have an ID which is in the tourIDs array. Very handy $in operator. And so that's actually one of the reasons why i wanted to do it manually instead of just doing a virtual populate like we did before. 
And with this our tours ready to be rendered. so res.status(200).render({}), and actually we don't even need a new template for this. We're simply gonna be reusing the overview, with only the tours which users has booked. 
Ok that should be it, Now of course we could also have created whole new card for these booked tours with some more relevant information about each of the bookings.  
Let set this link right on the user account page. 
So, we're actually ready to test this. 
Nothing happening here. This was a really hard one to find the bug here. 
Small error here: 
const bookings = await Booking.find({ tour: req.user.id }); first here we need user instead of tour, b/c we need to filter tours by the user, where the user is equal to the user coming from the request, SO,
const bookings = await Booking.find({ tour: req.user.id }); 
But that's not the main bug actually. So this is not the one preventing the page from actually loading. The error that causes that to happen is right here in the booking model. It's in pre find middleware, where the problem is that we do never call the next middleware there. So this is a pre-middleware, and all of the pre-middlewares have access to the next function and so at the end of this middleware, we always have to call next. Otherwise our process really get stuck.  

NOW CHECK IT: GREAT! HERE WE GO. 
*/
exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => {
    return el.tour;
  });
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

/*
* lecture 215
* Finishing the Bookings API
And now to finish this section, let's now very quickly finish the bookings API. 
So adding all the CRUD operations to the bookings, so Creating, Reading, Updating, and Deleting bookings. 
Go to the bookingsController file

So, let start here by using the factory, that we already have in order to create all these five handlers. 
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);

Now moving to the routes, in bookingRoutes 
So without the booking id, we have as always getting all and creating a new one. And all of these routes will actually be protected and also only restricted to administrators and lead guides. so let's put that two above the handlers. 
Now the routes with the id, which will be getOne, update and delete

just to test getAllBooking and getBooking to postman. 
*/

/*
* Lecture 216
* Final Considerations 
Last video of this section, And is this section we kind of finished our project, both the API and also the rendered website.  
"In this last video I wanted to quickly address some topics that we could've added to theh API and to the website, and basically leave them for you as challeges if you would like"
- We could have add some more business logic to our project, for exampe. adding a restriction that users can only review a tour that they have actually booked. 
- You could also implement some nested booking routes, for example getting all the bookings for a certain tour, or getting all the bookings for a certain user.  
- You could dramatically improve the tour dates, and what i mean by that is that you could add a participants and a soldOut field to each of the dates. And the date then becomes kind of like an instace of the tour. then when a user actually books a tour, they need to select one of the available dates and then new booking in one of the dates will then increase the number of participants in the date until it is booked out. so basically when participants is greater than the maximum group size. Now finally when the user wants to book a certain tour on a certain date you need to check if the tour is still available on that selected date. 
! SEE PDF FILE
- Finally, you could also implement some of the advanced authentication features that we alredy talk about bit before in the security section. For example you could confirm a user email address basiclly by sending them an email with a link that they need to click, and only after the click, the user is then really registered in the application. and can do stuff like puchasing tours. 
- We could keep users logged in with something called refresh tokens. that's bit complicated to implement but if you google around about how it works then will find a good solution. 
- we could also implement two-factor authenticatio, but this one is taking it even one step further. so when a user log in they receive something like a text message.. 
This are the things that we could do on the API side.

But also there is stuff that you can do on the website. 
- implement signup form, similar to login.
- On the tour detail page, if a user has taken a tour, allow them add a review directly on the website, implemnt a fomr for this. So first we have to check if the currently logged-in user has actually booked the current tour, and also if the time of the tour has already passed. 
- Hide the entire booking section on the tour detail if the current user, had already booked the tour. Also prevent duplicate bookings on the model.
- Implement 'like tour' functionality with favourite tour page
- Implement My Reviews page, which already has a link right now, and on that page the user could then see and maybe also edit and delete all of their own reviews. 
- For administrators, implement all the 'Manage' pages, where they can perform all the CRUD operations on all the resources. 

*/

#0f0
/*
? ------------------------- ?
! ------------------------- !
* ------------------------- *
! NEXT SECTION #14
* SETTING UP GIT AND DEPLOYMENT
*/
/*
* lecture 218
* Setting Up Git and GitHub
So, the Heroku platform, where we're gonna deploy our project,works very closely with git,  And so in this lecture, we're gonna install and setup git on our computer and also open an account at github.com. 

? Whay actually git is
well, git is a version control software, so a software that runs on your computer and which basically allows you to save snapshots of your code over time. ---very baisc
Each of the project we'll create a repository, and then in there we'll create commits and diff branches. 

let's now go ahead and create an account on github.com
github is a platform where we can host our own git repositories for free in order to share it with other developers, or just to keep it secure for yourself.  
*/

/*
* lecture 219
* Git Fundamentals
In our local project folder create a new repository

* Create new git repo
? git init
In order to create new repo we need to navigate to that project folder, and then in there we write git init, so right now we have a repository with a branc name called master

* Create a special file called gitignore
all that file that shouldn't be in the repo
IN .GITIGNORE FILE
node_modules/
*.env (All .env file)

? git status
all the folders that not yet commited to our repo

* How we commit files to repo, that's a two step process
Add that file to so-called staging area, only then we commit all the files. 

? git add -A
To add(stage) all the files

? git commit -m "commit message"

Now we have a local repository with all of our codes committed to it. In the next video lets actually puch this brach on github. Hosted on the githaub account that we just created. 

*/

/*
* lecture 220
* Pushing to GitHub
Pussing to a remote branch
Create new repo on github

the goal is to basically push all our local code into this remore repo that we just created. In order to be able to do that, we need to let our local repository know about this remote repo that we created. so we have to kind of connect them, that's exactly what is said here. "…or push an existing repository from the command line"
git remote add origin https://github.com/muhammad-ahmad66/natours.git paste this to terminal
What this going to do? It will add a remote brach/repo, and this romote repo is going to be called origin and it's located at this url.
Now these two repos are connected. At this point we're ready to do git push
? git push nameOfRemoteBranch nameOfLocalBranch
name of remote branch is origin here, name of local branch is master. So,
? git push origin master

By the way the oposite operation of push is pull operation. So imagine youre working on two different computers and want to start to work on one computer and then continue on the other one. And so to do that pust the code on one computer onto github and then on the other one simply pull it. 
? git pull origin master

* Now we'll create a readme file
That's a very standard file that every single repository should have.  
The standard name is readme.md, md stands for mark down
use # for main title
That's It,

*/
/*
* lecture 221
* Preparing Our App for Deployment
We're almost realy to deploy our application now, but before we do that there is actually a couple of things we should take care off. And so let's do that now. 
The first thing that I want to do is to install a package that's gonna compress all our responses. 
So basically, whenever we send a test response to a client, no matter if that's json or html code, with the compression package that text will then be dramatically compressed. So let's install here
! npm i compression
and require that in app.js
const compression = require('compression'); This one then expose a very simple middleware function that we simply have to plug into our middleware stack. 
app.use(compression()); 
So, this will return a middleware function, which is then gonna to compress all the text that is sent to clients. This is not going to be working for images, b/c these are usually aleady compressed. 

The next step before deploying our app is to get rid of the console.logs that we've still in our code. 

Next up let's change URLs of our API calls in the client side javascipt.  
/*
for example in login.js file, right now we do this api codes to our development API.  url: 'http://127.0.0.1:3000/api/v1/users/login',  Like this it's not going to work in production. But fortunately there is a very simple solution. All we need to do is to get rid of this pard(http://127.0.0.1:3000), so if we just delete is like this then we're gonna end up with this relative url. And since the API and the website are hosted on the same server this is gonna work perfectly fine. This only works because the api and the website are basically using the same url, so we're hosting them on the same place. But if we're hosting frontend on one url and then API on another url then it wouldn't work like this.
const res = await axios({
      method: 'POST',
      // url: 'http://127.0.0.1:3000/api/v1/users/login',
      url: '/api/v1/users/login',
      data: {
        email: email,
        password: password,
      },
    }); 

Now finally, and continuing working on the client side javascript, we need to create our final bundle. 
in package.json watch:js script will just create a new bundle whenever we change one of the files, but without any compression, or without any performace optimization. But now that we're really done with all our javascript we're ready to actually build our js into a final bundle. 

Now parcel actually creates thsi cache folder with tons of files, wo we put this in gitignore file
.cache/

last step is to actually commit all of these modified files to our repository. 

install heroku
heroku login command to logged in on cli
Start script should use node, instead of nodemon package, then entry point.   "start": "node server.js",

*/