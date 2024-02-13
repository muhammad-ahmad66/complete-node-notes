# `Error_Handling_with_Express

## `Table_of_Contents`

1. [Debugging_NodeJs_with_NDB](#debugging_nodejs_with_ndb)
2. [Handling_Unhandled_Routes](#handling_unhandled_routes)
3. [An_overview_of_Error_Handling](#an_overview_of_error_handling)
4. [Implementing_a_Global_Error_Handling_sMiddleware](#implementing_a_global_error_handling_smiddleware)
5. [Better_Errors_and_Refactoring](#better_errors_and_refactoring)
6. [Catching_Errors_in_Async_Functions](#catching_errors_in_async_functions)
7. [Adding_404_Not_Found_Errors](#adding_404_not_found_errors)
8. [Errors_During_Development_VS_Production](#errors_during_development_vs_production)
9. [Handling_Invalid_Database_IDs](#handling_invalid_database_ids)
10. [Handling_Duplicate_Fields](#handling_duplicate_fields)
11. [Handling_Mongoose_Validation_Errors](#handling_mongoose_validation_errors)
12. [Errors_Outside_Express__Unhandled_Rejections](#errors_outside_express__unhandled_rejections)
13. [Catching_Uncaught_Exceptions](#catching_uncaught_exceptions)

---

## `Debugging_NodeJs_with_NDB`

We gonna learn about debugging Node.js because there will always be some bugs in  our code no matter, how careful we are. And so it's good to have a tool to help us with debugging our code. This is not really about error handling with express, but we will use a debugging tool, which we might then use throughout the rest of the course.

There are different ways of debugging Node.js code. For example we could use VS code for that, but actually Google very recently released an amazing tool which we can use to debug, which is called NDB. **NDB stands for Node Debugger.** It's a just an npm package.  Let's install NDB. We'll install as a global package.  
***npm i ndb --global***

Let's add a new script in package.json file: ndb and then our entry point.  
**"debug": "ndb server.js"**

In order to this work we actually need to finish this process(npm run start:dev), because it gonna start the server as well and so it will then try to do it on the same port, that of course not gonna work.  
*npm run debug*, This command will open new chrome window. It's called headless chrome, but it's not a real chrome. Downloading Chromium.  
In that window we have our complete file system, we also have access to our scripts which we can run from there, we also has a console, and we also has a performance and memory tabs.  
And we also edit our files from that debugger.  

The fundamental aspect of debugging is to set break points. So, break points are basically points in our code that we can define in the debugger, where our code will then stop running and we can the take a look at all our variables. that then will be extremely useful to find some bugs.  
Now by right clicking in ndb run the script and then all the codes that's above the break point will executed. and we can see variables, it's values.

---

## `Handling_Unhandled_Routes`

Let's write a handler function for undefined routes. Basically for routes that we didn't assign any handler yet. like 127.0.0.1:3000/api/tours without v1.  
In this case we would get html result, so express automatically sends html code along with a 404 error code.

Now there is another situation which is if after tours/ we specify something else. like 127.0.0.1:3000/api/v1/tours/myName  
Now we get another error saying, 'Cast to ObjectId failed...', that's because we actually have a route that accepts an id parameter after the tour/, and So mongodb is basically trying to find a document with myName id, but cannot convert in to a valid mongodb object id.  

Now here we are basically creating a handler function for all the routes that are not cached by our routers. let's open app.js file, that's basically the definition of Express application.

**How are we gonna implement a route handler for a route that was not caught by any of other route handlers?**  
So to do that remember that all the middleware functions are executed in the order they are in the code. And so the idea is that if we have a request that passed all the routers, then it means any router were not able to catch it. So, if we add a middleware after all routers, it'll only be reached if not handled by any of other routers.  
**We want all the methods(get, put...) in one handler, for that in express we can use app.all(), that then gonna run for all the verbs/http methods. app.all()**  
Next up we specify the url, since here we want to handle all the url's that were not handled before, we can use the star\* here, which stands for everything. app.all('*', ). Then the rest is just a regular middleware function.  
**req.originalUrl** is a property that is available on the request , that is the url thats requested.

```js
// ADD AFTER ALL ROUTERS // In app.js file
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`
  })
})
```

YEAH, IT'S WORKING. WHY DID THIS WORK?? The idea is that if we are able to reach the bottom of the middleware stack, it means that the request-response cycle was not yet finished at this point. Because remember that middleware is added to the middleware stack in the order that it's define here in our code.

---

## `An_overview_of_Error_Handling`

Up until this point we haven't really handled errors in a good way or in a central place in our application. We simply send back an error message as json in each route handler in case something went wrong. So, that's basically what we're gonna fix in this section.  

Two types of errors that can occur. **Operational Errors** And **Programming Errors**.  

1. **Operational errors** are problems that we can predict will inevitably happen at some point in the future. So we just need to handle them in advance. They have nothing to do with bugs in our code. Instead they depend on the user, or the system, or the network. like user accessing an invalid route, inputting invalid data, or an application failing to connect to the database, all these are operational errors that we need to handle in order.
2. Programming errors are simply bugs that we introduce into our code. for example trying to read properties from an undefined variable, using await without async, accidentally using request.query instead of request.body, or many other errors.... They are really inevitable, and also more difficult to find and to handle.

When we talking about error handling in express we mainly just mean operational errors. Because these are the ones that are easy to catch and to handle with our express application. And express actually comes with error handling out of the box. So all we have to do is to write a global express handling middleware which will then catch errors coming from all over the application. So no matter if it's an error coming from a route handler, or a model validator...., The goal is that all these errors end up in one central error handling middleware. So that we can send a nice response back to the client letting them know what happened.  
So, in this case handling means sending a response letting the user know what happened. But handling can also mean, in other cases, retrying the operation or crashing the server, or just ignoring the error altogether.  
The beauty of having a global error handling middleware is that it allows for a nice separation of concerns. We don't have to worry about error handling right in our business logic or our controllers. So really anywhere in our application. We can send the errors down to the error handler.

---

## `Implementing_a_Global_Error_Handling_sMiddleware`

Let's implement the global error handling middleware. The goal is to write a middleware function, which gonna be able to handle operational errors. IN APP.JS FILE

To define an error handling middleware all we need to do is to give the middleware function four arguments and Express will then automatically recognize it as an error handling middleware, So, therefor only call it when there is an error.

**TWO STEPS:**  

1. We **create a middleware.**
2. **Create an error.**

**FIRST STEP:**  
Just like in many other cases, this middleware is an error first function, which means that the first argument is the error.  
By specifying four parameters, express automatically knows that this function is an error handling middleware.  
For now let's keep it really simple here. all we want to do in order to handle this error is to send back a response to the client.  
Now we don't really not what status code it is. right? So, we actually want to read that status code from the error object. On error object we will assign status code in second step we'll define the status code on the error. Here we define a default status code, because there may be errors without status code, it means errors that are not created by us. 500 means internal server error, that's usually a standard that we use. In the same way we also define the status. **If 500 then it's 'error' and if it's 400 then it's a 'fail' status.**

**SECOND STEP:** (we create an error)  
let's do that in a function, which handle all the unhandled routes, in app.js file

We use the built in Error constructor in order to create an error. And now we can pass a string and that string will then be the error message property {err.message}

```js
const err = new Error(`Can't find ${req.originalUrl} on this server`);

```

Here⤵ we call the next() function from the error handler middleware in a special way. Because now we need to actually pass that error into next. So, if the next function receives an argument, no matter what it is, express know that there was an error, so it will assume that whatever we pass into next is gonna be an error. And that applies to every next function in every middleware anywhere in our application.  
So, again, **Whenever we pass anything into next, it will assume that it is an error**, and it will then skip all the other middlewares in the middleware stack and send the error that we passed in to our global error handling middleware.

So always remember, if we put any argument in next() then it will jump to the error handling middleware.

```JS
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
```

---

## `Better_Errors_and_Refactoring`

Let's now create a better and more useful error class, and also do some refactoring.  
let's create a new file in our utilities folder, named as appError.js, because that's gonna be name of the class.  
We actually want all of our appError objects to then inherit from the built-in error, so we use extends the built-in error class.  
AppError will inherits from the built-in Error class.

we pass into a new object created from the AppError class is gonna be the message and the statusCode.  
**REMEMBER THE CONSTRUCTOR METHOD IS CALLED EACH TIME, WE CREATED A NEW OBJECT OUT OF THIS CLASS. AS USUAL, WHEN WE EXTEND A PARENT CLASS, WE CALL SUPER IN ORDER TO CALL THE PARENT CONSTRUCTOR.**

We'll pass a message in to super(), because the message is the only parameter that the built-in error accepts.  
As status depends on statusCode, So, when the statusCode is 400 then the status will be 'fail', and if it;s a 500, then it's an 'error'.  
To test the statusCode we use startWith method, that we can call on strings. for that, convert the statusCode to a string.  

All the errors that we will create using this class will be operational errors.  
this.isOperational = true; we set all errors that created by using this class to true. We can later test for this property, and only sends error message back to client for these operational errors that we created using this class.  
**We also need to capture the stack trace. What's mean by stack trace?** In error middleware function err.stack will show, where the error happened.  
Error.captureStackTrace(this, this.constructor) by this way when a new object is created and a constructor function is called then that function call is not gonna appear in the stack trace, and will not pollute it.

**Why didn't set this.message = message in constructor?**  
That's because right here we called the parent class, and the parent class is Error and whatever we pass into it is gonna be the message property. So, basically in super(), by calling parent we already set the message property to our incoming message.

Export this AppError class

```js

class AppError extends Error {
  constructor(message, statusCode){
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = AppError;
```

In app.js file we import AppError class.  
in next function we'll create an error

```js
const AppError = require('./utils/appError');

app.all('*', (req, res, next)=> {
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
})
```

Finally we also want to export error middleware. because we're gonna build a couple of different functions for handling with different types of errors, so we want all of that functions to be all in the same file. We can say all of these function are handlers, we also call then controllers. let's now create an error controller file in controller folder.  new file with errorController , export it and import in app.js file.  

---

## `Catching_Errors_in_Async_Functions`

In this lecture, let's implement a better way of catching errors in all our async functions. Right now in all our async functions we have try/catch blocks, that's how we usually catch errors inside of an sync functions. that really makes our code look messy and unfocused, Also we have lots of duplicates here. Let's try to fix that.

The solution is to basically take the try/catch block out of here and put it on a higher level in another function. Basically we create a function and then wrap this async function into that function. we made a function catchAsync - because it will catch our asynchronous errors.  
Into this catchAsync function we will pass a function.  
As fn function is async function so it return promise, and when there is an error inside of an async function that basically means that the promise get rejected. So as we call the fn function, then we can catch that error here, instead of catching it in try-catch block. so catch, and error, and then next and pass the error

There are actually two big problems with the way implemented right now and so this way, it wouldn't really work at all. Because this function catchAsync has no way of knowing request, response, and next. We did not pass them into catchAsync here. And Second is that right here (in exports.createTour=...) We are actually calling the async function using the parenthesis and passing the whole function.  Then inside of catchAsync we are also calling fn function.
So, createTour should really be a function but not the result of calling a function. But that's right now what's happening.  
The solution to that is to basically make catchAsync function return another function which is then gonna be assigned to createTour and so that function can then later be called when necessary.  
catchAsync will return an anonymous function, and so remember that this is the function that express is then gonna call, so here is where we they specify request, response, and next.

```js
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
```

### `summary`

Fist we simply wrapped our asynchronous function inside of the catchAsync function that we just created. Then this function will then return a new anonymous function, which will then be assigned to createTour. And so basically it is returning function that get called as soon as a new tour should be created using the createTour handler. then the anonymous function that we passed in initially(fn) and it will then execute all the code that is in there. Now since it's(fn calling function) is async function, it'll return a promise and therefor in case there is an error in this promise or in other words in case it gets rejected we can then catch the error that happened using the catch method that is available on all promise. And in the end, it is catch method which will pass the error into the next function, which will then make it so that our error ends up in our global error handling middleware.  
Now if we create a new tour and some error happens, then that error should be caught here in catch function, and then will propagated to our error handling middleware and so that one will then send back the error response that we're expected to receive.

creating just another file in utils folder, named as  catchAsync.js, then import in tourController file.  
Now get rid of all of catch blocks, and wrap all the handlers into the catchAsync

```js
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

```

---

## `Adding_404_Not_Found_Errors`

Lets now make some more use of our AppError class by adding a couple of 404 errors and some of our tour handler functions.  
If we put any string at the place of id in this: 127.0.0.1:3000/api/v1/tours/dddddd, then it will give an error, BUT if we put something like id, but that document is not in our data database, like this: 127.0.0.1:3000/api/v1/tours/653795940e35664ec82f0ab1, then it's giving success with tour: null. That's not really what we want, We want here is to show a 404 status code, Let's now use our AppError class in order to implement that. Keep in mind that we get back null as a response.  

Go to the getTour handler and check: *if (!tour){...}* , then should create an error, because if there's no tour it will be null. and null is falsy value.  If no tour then we create a next(new return AppError('No tour found with that ID', 400)) with an error, in order to jump to error handler.  

same for updateTour. If we try to update that not exist, then it will give us the exact same error. Same for deleteTour

```js
// in getTour handler.
if (!tour) {
  return next(new AppError('No tour found with that ID', 400));
}
```

---

## `Errors_During_Development_VS_Production`

In this video we're gonna implement some logic in order to send different error messages for the development and production environment. Right now, we're sending this same err response message to everyone, no matter if we're in development or in production. But the idea is that in production, we want to leak as little information about our errors to the client as possible. In that case we only want to send a nice human friendly message, so that the user knows what's wrong. But on the other hand, in development we want to get as much information about the error that occurred as possible. and we want that right in the error message that's coming back. So we could log that information also to the console but, it's way more useful to have information right in postman,  
In errorController.js file  

Build functions⤵ for both development error log and production.

Lets now take it to the next level and talk about operational errors.  
open appError.js file.  
let remember that that we mark all the errors that we create, using appError is operational set to true. So all the errors that we create ourselves will basically be operational error. And in fact, for only operational error we want to send error message. On the other hand, a programming error or some other unknown error that comes for examples from a third party package, we don't want to send any error message about that. let's now use this.isOperational = true, in our errorController.js file.

```js
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
```

### `Functions for both dev and prod`

```js

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

```

*There are real logging libraries on npm that we could use here instead of just having this simple console.error, but just logging the error to the console will make it visible in the log.*

In order for this to work, there is something really, really important that we need to do. There are errors like errors coming from MongoDB, which we do not mark as operational, so in those case they would simply be handled using generic error. for example a validation error, right now they are coming from mongoose, not from our own app. Right now they are not marked as operational error but we need to mark them as operational.

---

## `Handling_Invalid_Database_IDs`

There are **three types of errors** that might be created by mongoose in which we need to mark as operational errors so that we can send back meaningful error messages to clients in production.

Let's now start by simulating these three errors.  

1. The first one is when we try **an invalid id** -simply something like this kj7fk1al, Mongoose will not be able to convert this to mongodb id. This is a perfect example of an operational error. So we need to send back a meaningful response in order to handle this error. The here is to basically mark this error as operational and create a nice and meaningful message.  
2. If any a duplicate value posted for a unique field. This is validation error.
3. It's also kind of validation. lets say we want to update a rating to 6, which is invalid, because we set the max of ratingAvg could be five.

These are the three errors we're gonna mark as operational error, starting with first one.  
To id, if we assign unreadable id then mongoose giving 'CastError' like this:

```Json
// JSON Error Response
"name": "CastError",
"message": "Cast to ObjectId failed for value \"lkd9f6kl0sjl0f\" (type string) at path \"_id\" for model \"Tour\""
```

Implementation in errorController file. and we want this in production. in development we don't care.

If err.name is equal to 'CastError', then we call handleCastErrorDB() function, which we'll create, and we gonna pass the error that mongoose created into this function, and this will then return a new error created out of AppError class. And that error will then be marked as operational, because remember, all our AppErrors have the is operational property set to true.  So, save this returning error in err, It's not a good practice to override the arguments of a function. So instead of doing that we'll create a hard copy of that error object.

```js
else if(process.env.NODE_ENV ==='production'){
  let error = {...err}; // copy the error object
  
  if (error.name === 'CastError') {
    error = handleCastErrorDB(error)
  }
}
```

let's now create this function[handleCastErrorDB()],

This is error object, that mongoose's giving us:

```Json
// Error Object as a Response(JSON)
"error": {
  "stringValue": "\"lk1dj3fk5las6jl7kf\"",
  "valueType": "string",
  "kind": "ObjectId",
  "value": "lk2dj2fk1las2jl1kf",
  "path": "_id",
  "reason": {},
  "name": "CastError",
  "message": "Cast to ObjectId failed for value \"lkd1jfk1las1jlk1f\" (type string) at path \"_id\" for model \"Tour\""
},

```

In error object we've the path and value property, so here the path is basically the name of the field, for which the input data is in the wrong format, And the value is incorrect inputted value. This might not only happen for the id, but really, for any field that we query for with a value in the wrong format. Let's now basically create a string that says that we have an invalid id, with the value of inputted value. *400 for bad request.*

```js
const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
}
```

---

## `Handling_Duplicate_Fields`

Let's now handle the errors that occurs when we try to create duplicate fields for fields that are supposed to be unique.  
This error doesn't have a name property. that's because it's not an error that's caused by a mongoose. But instead really by the underlying mongoDB driver. What we gonna do to identify this error is to use "code": 11000 field.  

To show the user inputted name, we'll extract the name from "errmsg" property.

```json
"errmsg": "E11000 duplicate key error: natours.tours name_1 dup key: {:\'The Forest Hiker'}",
```

From this we extract The Forest Hiker. For that we use Regular Expression.  
***SEARCH GOOGLE: 'regular expression match text between quotes'.***

**`handleDuplicateFieldDB Function`**

```js
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  // console.log(value); yeah it works, it's an array with string, so we take [0]
  const message = `Duplicate  field value: ${value}. Please use another value!`;
  return new AppError(message, 400)
};
```

**`Calling that function`**

```js
if (process.env.NODE_ENV === 'development') {
  sendErrorDev(err, res);
} else if (process.env.NODE_ENV === 'production') {
  let error = { ...err };

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  sendErrorProd(error, res);
}
```

---

## `Handling_Mongoose_Validation_Errors`

Finally let's handle Mongoose's validation errors.

Here as an error message we have a nice string, which we defined in schema. So, now we'll extract these messages from here and put them all into one string.

Now in order to create on big string out of all the strings from all the errors, we basically have to loop over all of these objects, and then extract all the error message into a new array. the object that has all the errors is 'errors' object.

```js
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Calling that function
if(error.name === 'validation') error= handleValidationErrorDB(error);
```

---

## `Errors_Outside_Express__Unhandled_Rejections`

Let's talk about something that we have in node.js called unhandled rejections, and then learn how we can actually handle them. At this point we've successfully handled errors, in our express application by passing operational asynchronous errors down into a global error handling middleware. This then sends relevant error messages back to the client depending on the type of error that occurred, However there might also occur errors outside of express and a good example for that in our current application is the mongodb database connection. So imagine that the database is down for some reason or for some reason, we cannot log in. In that case there are errors that we have to handle as well. But they didn't occur inside of our express application, so of course our error handler that we implemented will not catch this error. like if we change the password of our database from environment variables.

In this simple example all we have to do is come here to the piece of code where our DB connection is done (in server file) and then add a catch handler there.

```js

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
```

This would work, of course, but I really want to show how to globally handle unhandled rejected promises, because in a bigger application, it can become a bit more difficult to always keep track of all the promises that might become rejected at some point. Let's now learn how to handle unhandled rejections. right in the server.js file.  
Each time that there is an unhandled rejection somewhere in our application, the process object will emit an object called unhandled rejection and so we can subscribe to that event just like this: CODE ⬇  
here on unhandledRejection event, this callback will call.  
If there is any problem with DB connection, like we have here in this example, then our application is not gonna work at all. So here we will shut down our application. We use process.exit().  
process.exit(), In here we pass a code, The code zero stands for a success, and one stands for uncaught exception, so we usually use 1 here.  

```js
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥💥 Shutting down.');
  process.exit(1);
})
```

There is one problem we implemented right now. That the process.exit() is very abrupt/sudden way of ending the program because this will just immediately abort all the requests that are currently still running or pending and so that might not a good idea. And so usually we shutdown gracefully where we first close the server and only then we shutdown the app. To do that we need to save the server to a variable server. and on that server we can then say server.close() which will close the server, and it will run callback function that we passed into it. and then only in that function we shutdown the application.

```js
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
```

---

## `Catching_Uncaught_Exceptions`

Lets learn how to catch uncaught exceptions.  
**What exactly are uncaught exceptions?**  
All errors or all bugs that occur in our synchronous code but are not handled anywhere are called uncaught exceptions. And like before: just like unhandled rejections we also have the way to handling uncaught exceptions.  
Example: just log some variable that doesn't exist console.log(x);  
We will handle when occur any uncaughtException event.  

```js

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥💥 Shutting down.');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

```

In unhandled rejection, crashing the application is optional, but in uncaught exception we really really need to crush our app.

In nodejs it's not really a good practice to just blindly rely on these two error handlers that we just implemented here. So ideally errors should really be handled right where they occur.

This uncaughtException handler should be at very top of our code, before any other code is really executed.  if any error came before this handler then it will not catch that exception.

---

***`Formatted: 12-02-2024`***
