# Section-06 Express

## Table of Content

1. [What_Is_Express](#what_is_express)
2. [Basic_Express_And_Routing](#basic_express_and_routing)
3. [APIs_And_RESTful_API_Design](#apis_and_restful_api_design)
4. [STARTING_OUR_API__HANDLING_GET_REQUESTS](#starting_our_api__handling_get_requests)
    1. [HANDLING_GET_REQUEST](#handling_get_request)
    2. [HANDLING_POST_REQUEST](#handling_post_request)
5. [RESPONDING_TO_URL_PARAMETERS](#responding_to_url_parameters)
6. [HANDLING_PATCH_REQUEST](#handling_patch_request)
7. [Handling_DELETE_Requests](#handling_delete_requests)
8. [Refactoring_Our_Routes](#refactoring_our_routes)
9. [Middleware_And_The_Request-Response_Cycle](#middleware_and_the_request-response_cycle)
10. [Creating_Our_Own_Middleware](#creating_our_own_middleware)
11. [Using_3rd_Party_Middleware](#using_3rd_party_middleware)
12. [Implementing_the_Users_Routes](#implementing_the_users_routes)
13. [Creating_And_Mounting_Multiple_Routers](#creating_and_mounting_multiple_routers)
14. [A_Better_File_Structure](#a_better_file_structure)
15. [Param_Middleware](#param_middleware)
16. [Chaining_Multiple_Middleware_Functions](#chaining_multiple_middleware_functions)
17. [Serving_Static_Files](#serving_static_files)
18. [Environment_Variables](#environment_variables)
19. [Setting_Up_ESLint_And_Prettier_In_VS_Code](#setting_up_eslint_and_prettier_in_vs_code)

## What_Is_Express

**WHAT IS EXPRESS? AND WHY WE USE IT?**  
Express is a minimal node.js framework, which means it's built on top of node.js. Basically it's a higher level of abstraction, Behind the scenes Express is written 100% using node.js code.  
Express contains a very robust and very useful set of features like complex routing, easier handling of requests and responses, add middleware, server-side rendering, and much much more...  
It allows to write a node.js codes so much faster then before.  
Express makes it easier to organize our application into the **MVC architecture**, which is a very popular software architecture pattern.

---

## INSTALLING POSTMAN

**Postman is a tool(application) that allows us to do API testing**, it's a little bit like a browser, but it doesn't render any html, or any visible website to us. Instead we can do all kinds of requests and then receive the response simply as text then work with that response. It simplifies API development. It's kind of standard application that we use for testing APIs.

It's kind of convention to have all the Express configuration in app.js.

---

## Basic_Express_And_Routing

Express is a function which upon calling will add a bunch of methods to our app variable ⬇.

```js

const express = require('express');

const app = express();

// Defining Routes -Using Express
app.get('/', (req, res) => {
  // res.status(200).send('Hello from the server side!');
  // send simply send this string. we can easily send json to the client.
  // We use here app.get, it means Response will only sent when get method is sent to server on this url.
  res
    .status(200)
    .json({ message: 'Hello from the server side', app: 'Natours' });
  // By using this .json method, will automatically set our content type to application/json.
});

  // Now using post method.
app.post('/', (req, res) => {
  res.send('You can post to this endpoint...');
});

const port = 3000;

// Listening -to start up a server
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
```

**Routes:** Routing means basically to determine how an application responds to a certain client request to certain url and http method which is used for request.

---

## APIs_And_RESTful_API_Design

### APIs

**What is an API?**  
API [Application Programming Interface]; A piece of software that can be used by another piece of software, in order to allow applications to talk to each other.

Mainly in API there are two piece they are talking to each other. (sends data to a client whenever request comes in). This kind of API that are most widely used. But in fact, APIs aren't only used to send data, and aren't always related to web development or javascript.  
The application in API can actually mean many different things as long as the piece of software is relatively stand alone. for example Node file system and http modules, we can say they are small pieces of software and we can use them, interact with them by using their API. When we use the readFile function from the FS module, we are actually using fs API. That's why we sometimes hear the term node APIs. Or when we do DOM manipulation in the browser, we are not really using the javascript language itself, but rather, the DOM API that the browser give access to us. Another example let's say we create a class in any programming language like C++ and then add some public methods or properties to it, These methods will be the API of each object created from that class because we're giving other pieces of software the possibility of interacting with our initial piece of software. So, as a **conclude** API has a broader meaning than just building web APIs. Anyway web API is important for us in context of node.

### Let's take a look at the REST architecture

**REST** stands for **Representational States Transfer**, is basically a way to building web APIs in a logical way, making them easy to consume. Because remember, we build an API for ourselves or for others to consume, So, we want to make the process of actually using the API as smooth as possible for the users.

**RESTfull** means APIs following the REST Architecture.  

**Now to build RESTful APIs, we just need to follow a couple fo principles.**

1. We need to **separate our API into logical resources**.
2. These **resources should then be exposed**, which means to be made available using structured, resource.based URLs.
3. **Use HTTP methods:** To perform different actions on data like reading or creating or deleting data, the API should use the right http methods and not the url
4. **Send data as JSON:** The data that we actually send back to the client or that we received from the client should usually use the JSON data format,
5. **Be Stateless:** They must be stateless.

**Explanation One by One:** -using Natours API as an example

#### Resources

All the data that we wanna share in the API should be divided into logical resources. In the context of REST, Resource is an object or a representation of something, which has some data associated to it. for example tours or users or reviews. so, basically any information that can be named can be resource.

#### Expose

We need to expose, which means to make available the data using some structured urls that the client can send a request to. For example <https://www.natours.com/addNewTour> this entire address is called url, in this url /addNewTour is called an API endpoint. API will have many different endpoints. like /updateTour, /deleteTour, /getTourByUser, etc... Each perform different actions or send different data to the client.  
Now there is something very wrong with these endpoints, because they don't follow the third rule which says that we should only use http methods in order to perform actions on data. So, endpoints should only contain our resources, not the actions that can be performed on them because they will quickly become a nightmare(horror/ burden/ curse) to maintain.  

**So, How should be use these http methods in practice?**

##### GET HTTP METHOD

this /getTour endpoint is to get data about a tour. so we should simply name the endpoint /tours and send the data whenever a get request is made to this endpoint. In other word when a client uses a get http method to access the endpoint. with this we only have resources in the endpoint.  
It's common practice that we always use resource in plural. The convention is that when calling /tours endpoint we get back all the tours that are in database.  
If we only want the tour with any id, we add that after another slash. like this /tour/7  
This is about get http method, it's use to perform the read operation on data.

##### POST HTTP METHOD

Next, If client wants to create a new resource in the database, in this example a new tour, the POST method should be used. post method should be use to send data to the server. In this case usually no ID will be sent. A server will automatically figure out the id for new resource.  
**The endpoint name /tours here in post method is exact same as before in get method?** both are /tours. The only difference is http method that is used for the request. If the /tours endpoint is accessed with get, we send data to the client, and if the same endpoint is accessed with post method we expect data to come in with a request, so that we can then create a new resource on the server side. So, that's really the beauty of only using http methods rather than messing with verbs in endpoint names. Again if we use resources with verbs like /getTour, /addNewTour, than it would really become unmanageable very quick.

##### PUT & PATCH HTTP METHODS

Next, There should also be the ability to update resources. for that either a PUT or a PATCH request should be made to the endpoint. The difference between them is that with PUT the client is supposed to send the entire updated object, while with PATCH it's supposed to send only the part of the object that has been changed. But both of them have the ability to send data to the server, bit like POST but with a different intent. So, again, **POST is to create a new resource while put or patch are used to update existing resource**.

##### DELETE HTTP METHOD

Finally there is the DELETE http method. Again the ID or some other unique identifier of the resource to be deleted should be part of the url. Usually in order to actually be able to perform this kind of request the client must be authenticated.  

**These are the five http methods that we can and should respond to when building our RESTful APIs.** So the client can perform the four basic **CRUD** operations.  
POST METHOD         ->   **C**REATE  
GET METHOD          ->   **R**EAD  
PUT/PATCH METHODS   ->   **U**PDATE  
DELETE METHOD       ->   **D**ELETE  

There might be actions that are not CRUD, for example a login, a search operation, but we still can create endpoints for them. for example /login or /search  

**Remember that** we had two other crazy endpoint names(/getToursByUser & /deleteToursByUser), which involved two resources(tours, user) at the same time, and that's no problem at all with REST. /getToursByUser can simply be translated to: /getToursByUser -> /users/3/tours and /deleteToursByUser -> /users/3/tours/9 (user number 3).. So there are tons of possibilities of combining resources like this.  
So, this is how we make use of http methods to build user-friendly and nicely structured urls. The data that the client actually receives, or the server receives from the client, usually we use **JSON data format**.

---

#### What JSON actually is? and how to format our API responses?

**JSON** is a very lightweight data interchange format which is heavily used by web APIs coded in any programming language. And it's so widely used today, because it's really easy for both humans and computers to understand and write JSON. JSON looks bit like a regular javascript object with all key value pairs, but with some differences, most important one is that all the keys have to be strings. It's also very typical for the values to be strings as well, but they can be other things like numbers, bool, other objects or arrays.  

Let's say this is a data(see theory-lecture.pdf) that we have in our data for a get request to this url <https://www.natours.com/tours/5> (the tour with id of 5). We could send back like this to the client but We usually some simple response formatting before sending data, there are couple of standards for this. We gonna use very simple one. called **Jsend**. we simply create a new object, then add a status message to it in order to inform the client whether the request was a success, fair or error, and then we put our original data into a new object called Data. **Wrapping the data into an additional object is called Enveloping**( see pdf file ) and it's common practice to mitigate/reduce some security issues and other problems. And also there are some other standards for response-formatting that we can look. like JSON:api or the Odata JSON protocol.

**Finally a RESTfull API should always be stateless.** Stateless in RESTfull API is all state is handled on the client, not on the server, This means that each request must contain all the information necessary to process a certain request. The server should not have to remember previous request. And state simply refer to a piece of data in the application that might change over time. For example whether a certain user is logged in or on a page with a list with several pages what the current page is, Now the fact that the state should be handled on the client means that each request must contain all the information that is necessary to process a certain request on the server. So the server should never ever have to remember the previous request in order to process the current request.

Let's take the list with several pages as an example. and let's say that we are currently on page five(currentPage = 5) and want to move forward to page six. So we could have simple endpoint called /tours/nextPage and submit a request to it, But the server would then have to figure out what the current page is and based on that send the next page to the client. In other words the server would have to remember the previous request. It would have to handle the state server side and that is exactly what we want to avoid in RESTful APIs.  
**Instead** in this case we should create a /tours/page endpoint and paste a number six to it in order to request page number six /tours/page/6 . This way we would then state on the client because on a client, we would already know that we're on page five. and so all we had to do is to just add one and then request page number six. So the server doesn't have to remember anything in this case, All it has to do is to send back data for page number six as we requested. and by the way, **statelessness** and **statefulness**(which is the opposite) are very important concepts in computer science and application design in general.  
**See Statefulness VS statelessness**

---

## STARTING_OUR_API__HANDLING_GET_REQUESTS

### HANDLING_GET_REQUEST

**Always read Comments from Codes:**

```js

const fs = require('fs');
const express = require('express');
const app = express();

// Adding Middleware:
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

```

In top-level we don't really need of async version.  
Remember **__dirname** is the folder where current script is located.  
Also parse the result with JSON.parse() It will convert json to javascript array of objects.  

```js

app.get('/api/v1/tours', (req, res) => {
 res.status(200).json({
  // We are using Jsend JSON formatting standard.
   status: 'success', 
   // status can be 'success', 'fail'(error at client side) or 'error'(error at server side)
   results: tours.length, // Number of results. we are sending. this is not primary thing to do.
   data: {
  // this data is so-called envelope for our data. this data will contain actual data/response  
  // tours: tours, // in ES6 we do not need to specify the key and the value if they have the same name, we could just write tours. 
  // Here tours before colon is resource or endpoint tours and after colon is tours data that came from the file.
    tours,
   },
 });
}); 

```

We usually called this function⤴ **rout handler**. Here we put what to do when someone hits this route. Here we just send back all the tours to that resource(/tours) [\dev-data\data\tours-simple.json in this file we have sample of tours json. This is a data that we are gonna be sending to the client]. Now before we sending data we actually need to first read it⤴. We don't do it inside the route handler, but we do it before get method. We can do it on top-level because top-level code is only executed once.

### HANDLING_POST_REQUEST

Lets now implement a route handler for post request. So we can actually add a new Tour to our data set.

Remember by the post request we can send data from the client to the server.  
**This data is then ideally on available on the request.** The **request object** is what that holds all the data, all the information about the request was done. If that request contains some data that was sent, then that data should be on the request. Express does not put that body data on the request, and in order to have that data available, we have to use something called **Middleware.**  
So use **Middleware** at the top of the code⤴. we need to do: _app.use(express.json());_ Here this express.json is a middleware. **And Middleware is basically just a function that can modify the request data.** It's called middleware because it's between(middle of) request and response.  
In this example it's simply that the data from the body is added to it -it added to request object-. we'll talk about middleware later.  
body is the property that's available on the request, because we used that middleware⤴. and we also need to send back a response, We always need to send back something in order to finish the so-called **Request/Response cycle.**  
_Then we added some json data to the **body->raw->json** on POST method at Postman application._

```JS

app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  //? const newTour = {id : newId, ...req.body};
  // Object.assign() is used to merge two objects into one. 
  // It will merge both both objects that we specify as a parameter. 
  // And remember it will always mutate the first one. we can use spread operator as well: const merged = { ...obj1, ...obj2 };

  tours.push(newTour); // here tours is, which we read from file, and remember it's an array of objects.

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours), 
    // stringify(), is a JavaScript method used for converting a JS object or value into a JSON string.
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      }); // 201 means created.
    }
  );

  // res.send('Done!');
});

```

- We have post methods, Now we want to persist(add) that data into the tours-simple.json file.⬆
- First thing we need to do is figure out the id of the new object. In database When we create a new object we never specify the id of the object. the database usually takes care of that -A new object usually automatically gets it's new id. In this case we don't have any database and so we gonna do is simply take the id of the last object and then add +1 to that. ⬆
- Then we create a new tour and that tour will basically be the body that we send plus the newId that we just created. So we can use Object.assign, which basically allows us to create a new object by merging two existing objects together.
- Now we want to push this tour into the tours array.
- After that we have to persist that into the file. Here our newTours is an object and in the file there is a json file type so we have to stringify the object.  JSON.stringify(tours)

```js
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
```

---

## RESPONDING_TO_URL_PARAMETERS

An easy way to defining parameters right in the url, how to then read these parameters and also how to respond to them.  
code ⬇

We want to actually implement a way of getting only one tour, So, right now we have '/tours' endpoint, which gives us all the tours, But we want like this: /tours/5 -It means get a specific tour using id or any other unique identifier. tours/3 here 3 will be a variable, because it can be 5, 3, 2 or anything else.

- So, we define a route, which can accept a variable.
- We just add that variable after tours using **slash colon** like this /: i.e /api/v1/tours/:id/ , like this we created a variable called id, it could be anything else.
- In the **request.params** all the parameters or all the variables that we define like this will stored. _console.log(req.params);_. we could use like this api/v1/tours/:id/:x/:y/:z then if we specify all these variables in the url then the req.params will give us all of that with corresponding  key value pairs in an object like this: { id: '3', x: '4', y: '1', z: '7' }.
- If we define these in the url, we actually have to then specify, because we are now not hitting the exact route. for example if we specify here with id, x, y and z, but in the url we specify only 3 then it will give error, because id, x and y is not specified.
- But there is a solution we can do, this is optional parameters. If we want to make any parameter optional then we simply add a question mark(?) to it. like this: /:y?
- Then we will use **find() method**. And remember in **find method** we pass a callback function. In that callback function it will loop through the array elements and in each of iteration we will have to current element and we will return either true or false in each of iterations. **Now find method will do is that it will create an array which only contains the elements where this comparison is true.**
- Now we have one problem here that in _req.pram.id_ gives a string like this {id: '3'}, but the solution is very easy. all we have to say the: _id = req.params.id * 1;_ **nice trick**
- Now it's working, but one more problem is here that if we specify an id that is not exist in the file then it's not returning any error code. like for this: _tours/999_. So let's find the solution of this!!!
- Simplest one is that to check the id is larger then length of the tours array, if it's larger then we send back 404 error saying we couldn't find any tour for the given id. Another solution is that after finding the array element by using find method. we just check for new array it is empty or not, if it's empty, just return and respond with 404 error. _if(!tour){}_. Remember if there is no tour found then tour will be undefined.

```js

const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  // console.log(req.params);

  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  // if (id > tours.length)
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: newTour,
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>', 
      // updated tour. but right now we are just sending string, we have't implemented update.
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// app.get('/api/v1/tours/:id', getTour);
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .routes('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

```

---

## HANDLING_PATCH_REQUEST

How to handle patch request to actually update data  

***The code is after post method in above code ⬆***  
**Remember** we have to http methods to update data, **put & patch**. With **put** we expect that our application receives the entire new updated object and with **patch** only expect the properties of the object. Usually we use **patch** because it's easier to simply update the properties, and it's also easier to user to simply send the data that is changing instead of sending the entire object. So we are going to work our app to **patch** not **put**.

- In this we also need the id of the tour that should be updated.
- here we are not going to updating tours, that would go lot of works. it's just a javascript. matching ids, getting from the json file and change that one and save it again to the file,  that is too much work. and in real world we would not have data in a file anywhere.
- So, let's simply send back a standard response.

---

## Handling_DELETE_Requests

code is above in DELETE METHOD ⬆

Finally, let's now handle he lead requests, And just like in previous lecture we'll not actually implement the deleting of a resource in route handle.  

---

## Refactoring_Our_Routes

CODE is above after DELETE METHOD ⬆

Reorganize some of our routes to make the code a lot better.  
Right now we have all of thees routes so, the http methods and the url together with the route handler all over the place.  
All routes should be together and the handler also together.

- will export all the these handler functions into their own functions

- For delete we usually use 204 as a response, **204 means no content**, So, as a result we usually don't sent any data back instead null -it show that the deleted resource no longer exists.

- Now let's say we want to change version or resource name, we would then have to change in all of these five places. and that is not ideal. Instead of having all of these we can do something better using **app.route()** and then we can chain all of the http methods that have same routes.  

```js
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .routes('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);
```

---

## Middleware_And_The_Request-Response_Cycle

The **Request-Response Cycle** or **Express App** receives a request when someone hits a server, for which it will then create a request and response objects. That data will then be used and precessed in order to generate and send back a meaningful response.

- In order to process that data, in express we use something called **Middleware**, **which can manipulate the request or the response object**. Or **really execute any other code that we like**. So, middleware doesn't always have to be just about the request or the response object but it usually is mostly about the request. We used _Express.json()_ to get access to the request body on the request object in previous lecture. It's called middleware because it's a function that is executed between/middle of receiving the request and sending the response.
- And actually we can say that in Express, everything is middleware even our route definitions. Even when we defined our routes, we can think of the route handler function that we wrote as middleware functions. They are simply middleware functions that are only executed for certain routes.
- Some examples of middleware are **express.json()**, **which is also called body-parser**, Or some logging functionality, Or setting some specific http headers.
- **In more technically terms, we say that all the middleware together that we use in our app is called middleware stack**. see pdf file.
- **The order of middleware in the stack is actually defined by the order they are defined in the code.** A middleware that appears first in the code will execute before that appears later.
- Our request and response object that were created in the beginning go through each middleware where they are processed or where just some other code is executed. Then at the end of each middleware function a next function is called and the middleware function will be executed from the stack with the exact same request and response objects. And that happens with all the middlewares until we reach the last one. So, just like this the initial request and response objects go through each middleware step by step, and we can think of this whole process as a kind of **pipeline** where our data go through. **The last middleware function is usually a route handler**. In this handler we do not call the next function to move to the next middleware, Instead we finally send the response data back to the client. And like this we finish the so-called request-response cycle.
- **Request-Response cycle is everything that we talk about here together, It starts with the incoming request then executing all the middleware in the middleware stack step by step and finally sending response to finish the cycle. It's actually just a linear process.**

---

## Creating_Our_Own_Middleware

Let's now actually create our own middleware functions.

In order to use middleware, we use '_use()_' method to add middleware to middleware stack. like _app.use(express.json());_ this express.json calling json method, returns a function, and that function is then added to the middleware stack. And similar to that we can create our own middleware functions. Let's do that now

We still use **app.use()** and in here to pass a function that we want to add to the middleware stack. And of course, **in each middleware function we have to access to the request and response, and also as a third argument we have the next function.**  

```js
app.use((req, res, next) => {});
```

**Here⤴ as req & res the next name is very common and use almost everywhere as a convention.**

And then we actually need to call the next function. If we didn't call the next function then the request/response cycle would really be stuck at this point. **Never forget to call the next function in middleware.**  
Remember this will apply to every single request. that's because we didn't specify any route. And remember our route handlers are also a middleware, they are simply middleware functions that only apply for a certain url(rout).  
And if any route handlers comes before the middleware, then for that route handler the middleware will not be called. because route handler and own middleware, both are middleware, and middlewares always execute step by step, according to their appearance in code. and by calling res.json() methods we ends the request-response cycle in that router handler.

```js
// Own middleware functions
app.use((req, res, next) => {
  console.log('Hello from the middleware🕛🎃🎌');
  next();
});
```

---

## Using_3rd_Party_Middleware

Let's now use the third party middleware function from npm called Morgan in order to make our development life a bit easier.  
**Morgan** is very popular logging middleware, A middleware that's gonna allow us to see request data right in the console. app.use(morgan('dev'));

GET /api/v1/tours/3 200 9.870 ms - 953 Here we have the information about request we get the http method, url, status code, time it took, and size of response in bytes.

```js
const morgan = require('morgan');

// Own middleware functions
app.use((req, res, next) => {
  console.log('Hello from the middleware🕛🎃🎌');
  next();
});

// 3rd-Party Middleware
app.use(morgan('dev'));
```

---

## Implementing_the_Users_Routes

Let's start to implement some routes for the user's resource. So our API will have a couple of different resources.

The first one that we already talked about and started to implement is the tour resource. But another one will be the user's resource. for example we can create user accounts, and have different user roles, and all that stuff that comes with users.  
For now this user's resource will be very similar to tha tours resource.

```js

const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// Own middleware functions
app.use((req, res, next) => {
  console.log('Hello from the middleware🕛🎃🎌');
  next();
});

// Middleware
app.use(morgan('dev'));
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

// ROUTE HANDLER
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  // console.log(req.params);

  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  // if (id > tours.length)
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: newTour,
      });
    },
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// USER'S ROUTE HANDLERS
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};


// ROUTES
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// Routes for users
app.route('/api/v1/users').get(getAllUsers).post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

```

---

## Creating_And_Mounting_Multiple_Routers

In this lecture things will start to get bit more advanced and that is because we'll now create multiple routers and use a precess called **mounting**.

The ultimate goal of doing this will be to separate all the code that we have in this into multiple files. So, we want is to have one file that only contains the tours routes and one file that contains user's routes, and also want to have a file which contains the handlers only for the users and then also one file that will contain all the handlers for the tours.  
To do that we need to create one separate router for each of our resources, **Right now we have four routes(2 for users & 2 for tours) and they are all on the same router and that router is app object.** If we want to separate these routes into different files then the best thing to do is to create one router for each of the resources(users & tours).

**const tourRouter = express.Router();** Just like this we create a new router and save it into tourRouter variable. and user this router for the tours routes. like this:⤵

```js
const tourRouter = express.Router();
tourRouter.route('/api/v1/tours').get(getAllTours).post(createTour);
```

**How do we connect this new touter to our application?**  
**We'll use it as middleware**. That's because this new modular tool **Router** is actually a real middleware function. **app.use('/api/v1/tours', tourRouter);** this **tourRouter** is a real middleware and we want to user that middleware for this specific /api/v1/tours rote. Just like this we created a sub application.

Now we have to change the routes in .route('/api/v1/tours'). because in the middleware we already in this route /api/v1/tours  
When we create router system like this, we actually say that we creating kind of small sub app for each of these resources. For root we simply add slash. like this tourRouter.route('/').get(getAllTours).post(createTour); and second route is route(':id')

Also do same for users.  
**These process is called mounting a new router on a route.**

```js
const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// This is called mounting the routers.
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
```

---

## A_Better_File_Structure

Let's now completely refactor our application that we have so far, and create a lot of new files and a whole new file structure. We really works with different modules and actually use them in a very meaningful way.

- First we want to separate our routers into different files.
- we make two files, 1 for tours and another for users in a folder called routers
- shifts all related stuff to corresponding files.

- Put everything together in one single main file in this case app.js, and this main file usually mainly used for middleware declarations. So, in app.js file we've all middlewares that we want to apply to all the routes.

**We have Middlewares till now:**

```js

// These first four middlewares are for all routes:
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// This is for route(/api/v1/tours), we want tourRouter middleware
app.use('/api/v1/tours', tourRouter);

// This is for route(/api/v1/users) we want userRouter tourRouter middleware
app.use('/api/v1/users', userRouter);
```

Now remove the route handlers from the routes files. So, let's create a new folder, will be called controllers. It would make sense to create a handlers folder, but later in this course we will start using a software architecture called the **Model View Controller**. And in that architecture, these handler functions are actually called controllers.

And we want to export all of functions from that tourController file, so we will put all of that functions on the export object.  
And remember when we exports data using exports object and when we import everything into one object, then all of the data that was on exports is now gonna be on tourController. So we will have tourController.getAllTours, tourController.getTour etc.  
Another option is to when we importing then first destructure it with its names and then no need of tourController.

**If we had only one export then we simply use module.exports = ___;**

**Now we are gonna do is to create a server.js file as well. Why??**  
simply because it's good practice to have everything that is related to express in one file. And Everything that is related to the server in another main file.  
**server.js file will actually be our starting file where everything starts, and it's there when we listen to our server.**

```js
const port = 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
```

this things will go in server file. but the server file not know about app object so we need to import it from the app file. so first we export the app file and import it into server file. just using module.exports = app;
Now simply this thing will goes to the server.js file. later on we wil actually have other stuff that will not related to express. like database configurations or some error handling stuff, or environment variables etc.

---

## Param_Middleware

**Let's create a special type of middleware called param middleware.**  

**Param Middleware** is middleware that only runs for certain parameters, so **basically when we have a certain parameter in our url**. The only parameter in our example is might be id.  
And so we can write middleware that only runs when this id is present in the url.  

On our router we write param() method, in this param() method we specify first the parameter that we actually want to search for, and then of course our actual middleware function, And as usual we have access to the **request**, and **response** object, and then also the **next function**. Now in param middleware function, we actually get access to a fourth argument and that one is the value of the **parameter in question**, here value holds actual value of id parameter, we usually call that one val,    like this:

```js
router.param('id', (req, res, next, val) => {

})
```

And this middleware function is not going to run for any of the user routes will run for only tours routes.

We used id in getTour, updateTour and deleteTour handler functions. All of the handler functions that used id, we checked that actually the id is valid. All these four functions have very similar code where they check if the id is valid. and if not they send back the Invalid id response. So, we have all this code in the same place and it's not a good practice. We can use here param middleware and perform this check here.

```js
const router = express.Router();
router.param('id', (req, res, next, val) => {
  console.log(`Tour id is: ${val}`); // output: Tour id is: 2
  next();
});
```

---

## Chaining_Multiple_Middleware_Functions

We gonna learn how to chain multiple middleware functions for the same route. Up until this point, whenever we wanted to define a middleware, we only ever passed one middleware function. for example for handling this post request, we only passed in this middleware function, which is createTour handler, that's only function that gonna be called whenever we get a post request. .post(tourController.createTour);

Now we want to run multiple middleware functions.  
**Why we want to run multiple middleware functions?**  
We might need run middleware before createTour here to actually check the data that is coming in the body. bit similar we did before for check id middleware.

For post method we might check if the request.body actually contains the data that we want for the tour.Create a checkBody middleware function  
Check if body contains the name and price property. If not send back 400(bad request) error.
Add it to the post handler stack.  
And we will put that function before tourController.createTour function. like this: .post(middlewareName, tourController.createTour); Here first middlewareName function will execute first and then createTour will execute.  
**.post(tourController.checkBody, tourController.createTour);** This is how we chain middleware functions. first will execute checkBody and then createTour.

---

## Serving_Static_Files

**How to serve static files with Express??**  
**What is static file?**  
It's a file that are sitting in our file system that we currently cannot access using all routes. For example, we have this overview.html in public folder. But right now there's no way that we can access this using a browser. And same for these image file that we have here, or CSS or the javascript files. That's simply because we didn't define any route for the url. We do not have any handler that is associated to this  routes(/public/overview.html).  
Now if we actually want to access something from our file system, we need to use built-in Express middleware. **app.use(express.static(`${__dirname}/public`));** Just doing this in app folder now we'll be able to open this overview.html at this url <http://127.0.0.1:3000/overview.html> With out public folder in url.  

**Why we not need public in url? Although overview.htm file is in public folder**  
Simply because when we open up a url that it can't find in any of routes, **it will then look in that public folder that we defined in App.js file. and it set that public folder kind of root folder.**

```js
app.use(express.static(`${__dirname}/public`));
```

---

## Environment_Variables

In this we'll learn all about environment variables.  

Node.JS, or Express applications can run in different environments. And the most important ones are the **Development Environment** and the **Production Environment**. That's  because depending on the environment, we might use different databases, or we might turn login on or off, or we might turn debugging on or off, or really all kinds of different settings that might change depending on the development that we're in. So again the most important ones are the development and the production environment. But there are other environments that bigger teams might use. So this type of setting that we discuss like different databases or login turned on or off, that will be based on environment variables. **By default Express sets the environment to development** which makes a lot of sense because that's what we're doing when we start a new project.

We are implementing in server.js file. because it's not related to express, it's related node.js.

```js
console.log(app.get('env')); 
```

_⤴**Output: development.**_ That's the environment that we're currently in. so this app.get('env) will get us env environment variable.

In summary, environment variables are global variables that are used to define the environment in which a node app is running. So this one is set by express. But nodejs itself actually sets a lot of environments. Now this env variable is actually set by Express. But nodejs itself actually also sets a lot of environment variables. So, let's take a look at those as well.  

This one are located at process.env

```js
 console.log(process.env)
```

⤴Here we've bunch of diff variables. Node uses most of them internally. for example a task to current working directory here.. These variables come from the process core module and we're set at the moment that the process started, and we didn't have to require the process module, it's available everywhere automatically.  

Now in express, many packages depend on a special variable called **NODE_ENV**. It's a variable that's kind of a convention which should define whether we're in development or in production mode. However Express does not really define this variable, so we have to do that manually. And there are multiple ways in which we can do it, but let's start with the easiest one which is to use the terminal.  

When we started this process we did it using npm start. and nmp start stands for "nodemon server.js", So, we use nodemon server.js to start the process. But if we want to set an environment variable for this process, we need to pre-plan that variable.

NODE_ENV this is a special variable. for that we will do in terminal  
NODE_ENV=development nodemon server.js By using this command we defined NODE_ENV=development environment variable. We can define even more(X=23) if we wanted.  **NODE_ENV=development** X=23 nodemon server.js  
***console.log(process.env);*** Using this we can see environment variables including our defined one.  

Many packages on npm that we use for express development actually depend on this environment variable. And so, when a project is ready and we are gonna deploy it, we then should change the NODE_ENV and variable to production. And we'll do that of course once we deploy the project.  
So, we set NODE_ENV and X as environment variables, but we can do a lot more. We usually use environment variables like configuration settings for our applications. So whenever our app needs some configuration for stuff that might change based on the environment that the app is running in, we use environment variables. For example we might use different databases for development and for testing until we could define one variable for each and then activate the right database according to the environment. Also we could set sensitive data like passwords and username using environment variables. Now it's not really practical to always define all of these variables in the command where we start the application.

**And so instead we create a configuration file config.env So env is the convention for defining a file which has environment variables.**  

// IN config.env file
NODE_ENV="development"
USER=muhammad
PASSWORD =123456
PORT=8000
***These variable names usually always in uppercase.***  

**Now How do we actually connect this .env file with our node application?**  
So, we need some way of reading these variables from this file and then saving them as environment variables. Because right now this is just a text file and nodejs has no way of knowing these variables. And so for that the standard is kind of using a npm package called **dotenv** So, ***npm install dotenv***

After installing go to our server and require this module

```js
// In server file
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
```

And then we can simply use this dotenv variable call config on it and then in there we just have to pass an object to specify the path where our configuration file is located. dotenv.config({ path: './config.env' }); And so this command will read our variables from the file and save them into nodeJs environment variables. we can log these variables using console.log(process.env);

Now we use this NODE_ENV variable and PORT variable.

to do that we go into app.js and somewhere here the port should be defined and somewhere here our logger middleware and what we wanna do now, Only run that middleware so to only define it when we are actually in development. So that the login does not happen when the app is in the production. **if NODE_ENV === 'environment'** only then use Morgan.

```js
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
```

**Why we have to access to this environment variable in app.js file? when we didn't define them in this file but in server.js.**
The answer to that is that the reading of the variables from the file to the node process only needs to happen once. It's then in the process and the process is of course the same no matter in what file we are. We're always in the same process and the environment variables are on the process. And the process that is running or application is running always the same and so this is available in every single file.

Now use PORT variable

```js
const port = process.env.PORT || 3000;
```

And lets now quickly do an http request to see if our logger still works.

Finally let's add a new start script to our package.json file.

right now we have "start": "nodemon server.js", but we also want to add another one for production. just to test what happen in that situation. Now we have

```js
  "start:dev": "nodemon server.js",
  "start:prod": "SET NODE_ENV=production & nodemon server.js"
```

---

## Setting_Up_ESLint_And_Prettier_In_VS_Code

How to setup ESLint with Prettier in VS Code in order to improve our code quality?  
So, ES Lint is basically a program that constantly scans our code and finds potential coding errors or simply bad coding practices that it think are wrong. and it's very very configurable so that we can really fine tune it to our needs and coding habits. And we can also use ES Lint for code formatting, but we'll continue using prettier. Prettier will be our main code formatter but based on ES Lint rules that we'll define. And so all that ES Lint will do for us is to highlight the errors.
STEPS:

- install ES-Lint and Prettier
- Now we need to install bunch of dependencies: we installing them with just one command:
- **npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev**
- Now the next step is that we need config files for both prettier and esLint

**Description about we installed plugins:**

- eslint-config-prettier: this onw will disable formatting for es Lint, because we want prettier as a formatter.
- eslint-plugin-prettier: this will allow es Lint to formatting errors as we type.
- eslint-config-airbnb: We need some job good javascript style guide that we can follow, And there are many style guides out there but the most popular one is airbnb style guide.
- eslint-plugin-node: this will add a couple of specific eslint rules only for nodejs.
- Finally there eslint other plugins which are only necessary in order to make the airbnb style guide actually work
eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react
