# Introduction to NodeJS and NPM

## Table of Contents

1. [Node_Modules](#node_modules)
2. [READING_AND_WRITING_FILES](#reading_and_writing_files)
   1. [In_Blocking-Synchronous_Way](#in_blocking-synchronous_way)
   2. [In_Non-Blocking-Asynchronous_Way](#in_non-blocking-asynchronous_way)

## What is NODE.JS??

**_NODE.JS IS A JAVASCRIPT RUNTIME BUILT ON GOOGLE’S OPEN-SOURCE V8 JAVASCRIPT ENGINE.🤔_**  
We can use JavaScript on the server-side of web development.  
Build fast, highly scalable network applications (back-end)

**Why and When to Use NodeJS??**  
[See_PDF_File](./theory-lectures.pdf)

## Running JavaScript outside of Browser

```js
console.log(hello);
```

In normal javascript file, we will include this javascript file into HTML file and open up that Html file in a browser. right???  
But here we use node command in terminal 'node index.js'

## Node_Modules

Nodejs is really built around the concept of node modules, where all kinds of additional functionality are stored in a module.  
In case reading file that is inside th FS(file system) module.

**How we use them?**  
We do require them into our code and then store the result of the requiring function in a variable.  
By using FS module we'll get access to functions for reading data and writing data to the file system.
Calling this function with built in FS module will return an object, in which there are lots of functions that we can use. We stored that object in a fs variable in below example.

[SEE-NODE-DOCUMENTATION](https://nodejs.org/en/docs)

BUILT-IN MODULES

```JS
const fs = require('fs');
const http = require('http');
const url = require('url');
```

3rd-PARTY-MODULES

```JS
const slugify = require('slugify');
```

OUT OWN MODULES

```JS
const replaceTemplate = require('./modules/replaceTemplate');
```

// Here this dot . points to the location where this module is in. it is not like a dot in fs.

---

## READING_AND_WRITING_FILES

### In_Blocking-Synchronous_Way

#### Reading text from file

**readFileSync()** here **sync** is for **synchronous** version of file reading. There is also asynchronous version.  
The readFileSync() function takes two arguments, the first one is the path to the file that we are reading, and the second is for character encoding.

```js
fs.readFileSync('./txt/input.txt', 'utf-8'); // We should have to save it somewhere in the variable.
```

```js
const fs = require('fs');
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);
```

#### Writing text to file

Same as reading we will specify two arguments. 1- path to the file 2- Text we want to write.  
BUT fs.writeFileSync(path, text) doesn't return anything.

```js
const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);
console.log('File written!');
```

---

### In_Non-Blocking-Asynchronous_Way

**READING AND WRITING FILES ASYNCHRONOUSLY:** In Asynchronous read files, we don't specify the file encoding, Instead as a second parameter write a callback function. And it calls this callback function with two arguments, first one is error and second one is actual data. (IN CALLBACKS THE ERROR AS A FIRST PARAMETER IS VERY COMMON)

Reading and writing files in non-blocking / asynchronous way:

#### READING FILE

```js
fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
  console.log(data);
});
console.log('will read file!');
```

#### Nested Callbacks (CALLBACK HELL)

```js
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
  if (err) return console.log('ERROR 🧨🧨');

  fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
    console.log(data2);
    fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
      console.log(data3);

      fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
        console.log('FILE HAS BEEN WRITTEN😍😜😉');
      });
    });
  });
});
console.log('will read file!');
```

**REMEMBER:** An Arrow function doesn't gets its own this keyword, It use the **this keyword** from the parent function. While a normal function always gets its own this keyword.

---

## BLOCKING_AND_NON-BLOCKING

BLOCKING:
Synchronous simply means that each statements is processed one after another, line by line, Each line of code wait for the result of the previous statement. Each line blocks the execution of the rest of the code, that's why synchronous code is also blocking code.

NON-BLOCKING\_\_ASYNCHRONOUS:
In asynchronous code we upload heavy work to basically be worked on in the background. then once the work is done a callback function, that we register before is called to handle the result. During all that time the rest of the code can still be executing without being blocked.

So, we use asynchronous readFile function, which accepts a callback function. This will start reading the file in the background, then immediately nome on to the next statement.

?Why do we do this:
In Nodejs process, there's only a one single thread. A thread is a just like a set of instructions that's run in the computer's CPU.
Node js is single threaded, so all users that using our application are using only that same thread. It means one user blocks the code than all other users will have to wait fot the execution to finish.

?Call backs doesn't automatically make the code asynchronous!!
It only works for some functions in the Node API, such as readFile function and many many more....

?CALLBACK HELL: lot of nested callbacks. We can avoid this by using ES6 promises OR ES8 async/await.

\*/

// !=====================! //
// _Lecture#010
/_

// **\*\***\*\*\*\***\*\***\***\*\***\*\*\*\***\*\***
// **\*\***\*\***\*\***\*\*\*\***\*\***\*\***\*\***
// \*SERVERS #029F70

// !=====================! //
// \* Lecture#011

/\*
\*CREATING A SIMPLE WEB SERVER
We will build a simple web server that capable of accepting requests and sending back a responses.

First step is to include yet another module, this one is called http
const http = require('http'); That's is one that gives us networking capabilities, such as building an http server.

?In order to build own server, we have to do two things. First, we create a server and second, we start the server, so that we can listen to incoming requests.

http.createServer()
createServer() will accept a callback function, which will be fired off each time a new request is hits our server. And this callback function get access to two important and fundamental variables. It's the request variable, and a response variable.
\*/
// const http = require('http');

// _1) CREATING A SERVER
/_
http.createServer((req, res) => {
res.end('Hello from the server!');
}); \*/ // each time a new request is hits to our server, this callback function will get called. This callback function will have access to the request object which holds all kinds of stuff like request url, etc. On the other hand response object gives us a lot of tools basically for dealing with response. res.end() is very simple way fo sending back a response.

// _2) LISTENING INCOMING REQUEST
/_
In order to listen an incoming request first we have to save the result of createServer() in a new variable. We stored that result in a variable named server.
We use that server and on that we call listen(). and listen() accept a couple of parameters the first one is port, usually the port that we use in node (8000), (300), (80), etc. A port is basically a sub address on a certain host. and the second one is host, if we don't specify host, and then will default to a local host, but we can also specify localhost explicitly. localhost usually has this address as a default('127.0.0.1'). this is a standard IP address of localhost. Localhost simply means the current computer. Third as an optional argument we can pass a callback function, which will be run as soon as the server starts listening.

\*/

/\*
const server = http.createServer((req, res) => {
// console.log(res);
res.end('Hello from the server!');
});

server.listen('8000', '127.0.0.1', () => {
console.log('listening to request on port 8000');
});

\*/

// \***\*\*\*\*\*\*\***\*\*\*\*\***\*\*\*\*\*\*\***
// \***\*\*\*\*\*\*\***\*\*\*\*\***\*\*\*\*\*\*\***
// \*ROUTING #029F70

// !=====================! //
// \* Lecture#012

/\*
\*ROUTING: Routing basically means implementing different actions for a different URLs.
Routing is very complicated in real world big applications, In those cases we use a tool for that like Express.
Right now we implement routing without any dependencies(express)..
The first step is actually able to analyze the URL, and for that we yet another built-in Node module, just called url

if we not found any page often we see 404 error, that is something called HTTP status code. We can add status code to the response. simplest way to display 404 error is to use res.writeHead(404);

We can do sendHeader in writeHead(). To send headers we need to specify an object, there we put the headers that we want to send.
res.writeHead(404, {

});
?What is header? An http header is basically a piece of information about the response that we are sending back.
res.writeHead(404, {
'Content-Type': 'text/html',
my-own-header': 'hello-world',
});
res.end('<h1>Page not found</h1>');
}
!Headers and status code always need to be set before we send out the response. we never can send headers after the response content itself, (res.end('<h1>Page not found</h1>') after this)

_/
/_
const server = http.createServer((req, res) => {
// console.log(res);
// console.log(req.url);

// Implementing Routing
const pathname = req.url;

if (pathname === '/' || pathname === '/overview') {
res.end('This is the OVERVIEW');
} else if (pathname === '/product') {
res.end('This is the PRODUCT');
} else {
res.writeHead(404, {
'Content-Type': 'text/html',
'my-own-header': 'hello-world',
});
// res.end('Page not found');
res.end('<h1>Page not found</h1>');
}

res.end('Hello from the server!');
});

server.listen('8000', '127.0.0.1', () => {
console.log('listening to request on port 8000');
});

\*/
// ? These routes that we defined here in our codes and the routes that we put in the URLs in the browser have nothing to do with files and folders in our project's file system.

// **\*\***\*\***\*\***\***\*\***\*\***\*\***
// **\*\***\*\***\*\***\***\*\***\*\***\*\***
// \*BUILDING API #029F70

// !=====================! //
// \* Lecture#013

/\*
?What is an API???
Basically an API is a service form which we can request some data.

Look at json file in dev-data folder.

?What is JSON?
JSON is a very simple text format that looks a lot like javascript objects.

fs.readFile('./dev-data/data.json')
!Remember
In readFile './dev' dot means current folder where terminal is pointing, In this case starter. That is not always be ideal. so, therefor there is a better way. All Node.js scripts, get access to a variable called \_\_dirname, and that variable always translates to the directory in which script that we're executing is located. In this case both(terminal & index.js) are in same place...

_/
/_
const url = require('url');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
// Implementing Routing
const pathname = req.url;

if (pathname === '/' || pathname === '/overview') {
res.end('This is the OVERVIEW');
} else if (pathname === '/product') {
res.end('This is the PRODUCT');
} else if (pathname === '/api') {
// fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
// const productData = JSON.parse(data);
// console.log(productData);
res.writeHead(200, {
'Content-Type': 'application/json',
});
res.end(data);
// It's working. BUT not 100% efficient, that is because each time someone hits /api route, the file will hve to be read and then send back. INSTEAD we can do is to just read the file once in the beginning, and then each time someone hits /api route, simple send back the data. For that we write this code in the beginning with synchronous way. This code will be executed only once in the beginning, so it's not a matter it blocks the code.
// });
} else {
res.writeHead(404, {
'Content-Type': 'text/html',
'my-own-header': 'hello-world',
});
// res.end('Page not found');
res.end('<h1>Page not found</h1>');
}

// res.end('Hello from the server!');
});

server.listen('8000', '127.0.0.1', () => {
console.log('listening to request on port 8000');
});
\*/
// For html Content types is text/html and for json Content type is application/json.

// !**\*\*\*\***\_\_\_**\*\*\*\***!//
// \*lecture#015

// _Filling the HTML Template:
/_
const replaceTemplate = (temp, product) => {
let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
// /PRODUCTNAME/g: it's a regular expression, with g => global, it will replace all the instance of {%PRODUCTNAME%} with product.productName.

output = output.replace(/{%IMAGE%}/g, product.image);
output = output.replace(/{%PRICE%}/g, product.price);
output = output.replace(/{%FROM%}/g, product.from);
output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
output = output.replace(/{%QUANTITY%}/g, product.quantity);
output = output.replace(/{%DESCRIPTION%}/g, product.description);
output = output.replace(/{%ID%}/g, product.id);

if (!product.organic) {
output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
}

return output;
};
!Placed in a module(replaceTemplate.js)
\*/

const tempOverview = fs.readFileSync(
`${__dirname}/templates/template-overview.html`,
'utf-8'
);

const tempCard = fs.readFileSync(
`${__dirname}/templates/template-card.html`,
'utf-8'
);

const tempProduct = fs.readFileSync(
`${__dirname}/templates/template-product.html`,
'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
// dataObj is an array of objects.

// !REMEMBER: We are using all of these synchronized versions because we are in the top level code, which is only executed once, right in the beginning when we load up the application.then every time we'll get from that variables.

// Slugify
// Creating slugs for all our products
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

// console.log(slugify('Fresh Avocados', { lower: true }));

// const url = require('url');
const server = http.createServer((req, res) => {
//console.log(req.url); ///product?id=0
//console.log(url.parse(req.url, true)); //object with lot of properties
const { query, pathname } = url.parse(req.url, true); // here we are destructuring the object and store the properties of query and pathname in variables with exact names as property.

//const pathname = req.url;

// Overview Page
if (pathname === '/' || pathname === '/overview') {
res.writeHead(200, {
'Content-Type': 'text/html',
});

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);

    // Product Page

} else if (pathname === '/product') {
res.writeHead(200, {
'Content-Type': 'text/html',
});
const product = dataObj[query.id];
const output = replaceTemplate(tempProduct, product);
res.end(output);

    // API

} else if (pathname === '/api') {
res.writeHead(200, {
'Content-Type': 'application/json',
});
res.end(data);

    // Not Found

} else {
res.writeHead(404, {
'Content-Type': 'text/html',
});
res.end('<H1>Page not found</H1>');
}
});

server.listen('8000', '127.0.0.1', () => {
console.log('Listening to the request on port 8000');
});

// !lecture#016
// _PARSING VARIABLES FROM URLs
// ? How to parse some variables from the URL in order to build the product page.
/_
Right now req.url() on clicking details is product?id=0, so here no routers, for that it gives page not found although we have product routes but not any routes for product?id=0. So first we check for req.url(), and url.parse(). console.log(req.url);
console.log(url.parse(req.url, true)); parse means parse the query; query means ?id=0 , we also need to pass a true value in a parse function in order to parse the query into an object.

\*/

// !lecture#017
// _USING OUR OWN MODULES:
/_
We can create our own modules and export something from them for example function, then import this function into another module.  
Imagine we have to use this replaceTemplate() function in multiple files, for that we can create a new module and export this function from and imported to a files.
?NOTE: In node.js actually every single file is treated as a module. So, this index.js is actually is also a module. Here imports other modules like fs, http, url....

? How do we export functions form a modules?
There are different ways to export something from a module. one of these are module.exports
!Imports usually always happen at the top of the file.

\*/

// **\*\***\*\*\*\***\*\***\***\*\***\*\*\*\***\*\***
// **\*\***\*\***\*\***\*\*\*\***\*\***\*\***\*\***
// \*NPM #029F70

// !=====================! //
// _Lecture#018
/_
? What is NPM_Node Package Manege?
NPM is a command line interface app that automatically comes included with Node.js, and which we use to install and manage open source packages. These packages usually comes from the package repository that is npm. So NPM is both the command line interface app and repository itself.

? First thing we usually do whenever we start a new project is: npm init. This will create a package.json file, which is kind of configuration file of the project, where all kinds of data about the project are stored.
\*/

// !=====================! //
// *Lecture#019
//*Types of Packages and Installs
/\*
?TWO TYPES OF PACKAGES:
There are two types of packages that can be install with npm, and also two types of installs there are.
The two types of packages are simple dependencies and development dependencies.

- TWO TYPES OF PACKAGES:
  ? 1) REGULAR/SIMPLE DEPENDENCIES:
  Now simple/regular dependencies are simply packages that contains some code that we will include in our own code. We actually call them dependencies because our project and code depend on them to work correctly. For example Express is dependency. now we use Slugify package, which is a small tool that we can use to make readable URLs
  to install dependencies: npm install slugify

? 2) DEVELOPMENT DEPENDENCIES:
These are usually just tools for development for example: code bundler like webpack OR a debugger tool, OR a testing library. Our code does not really depend on them, We simply use them to develop our applications. let's now install a dev dependency.
npm install nodemon --save-dev
nodemon is a tool helps us develop NodeJs applications by automatically restarting the node application whenever we change some files in our working directory.

- TWO TYPES OF INSTALLS:
  ? 1) LOCALLY INSTALLS:
  Install the packages locally, they only work in this project only.

? 1) GLOBALLY INSTALLS:
Global installs will be available anywhere, not just in our project folder, But in every folder across our machine.

- NPM SCRIPTS:
  ? How we use dev-dependencies locally, How we use local-dev-dependencies??
  We couldn't simply run it from the command line because the local dependencies don't work like that. But we can specify an npm script. We do that in script field.
  "scripts": {
  "start": "nodemon index.js"
  }, this nodemon means dev-dependency nodemon that are installed locally.
  then we can run: npm run start

\*/

// !=====================! //
// *Lecture#020
//*Using 3rd-Party Modules:

/\*
?How to require third-party modules form the NPM registry?
Actually requiring a module installed from NPM, is really simple.
const slugify = require('slugify');
slugify will be a function which we can use to basically create slug.
?What is slug?
Slug is basically just last part of a url that contains a unique string that identifies the resource that the website is displaying.

console.log(slugify('Fresh Avocados', {lowercase: true}));
!See Slugify documentation from npm page.
\*/

// !=====================! //
// *Lecture#021
//*Package Versioning and Updating:

/\*
? Version Numbers of our Packages:
Most of the packages on npm follow the so-called semantic version notation, which means that their version numbers are always expressed with theses numbers.
"nodemon": "^3.0.1";
first one is called major version(3).second one is called minor version(0) and the third one is called patch version(1).

- The patch version is intended to fix bugs.
- The minor version is introduces some new features into the package, but it does not include breaking changes.
- Major version is introduced when a huge release, which can have breaking changes.

?UPDATING PACKAGES:
^ This symbol that comes in front of the version number specifies which updates we accept for each of the packages.
? Check any outdated package?
npm outdated

? installing certain version
We can install a certain package with a certain version number.
npm install slugify@1.0.0;

? To update
npm update slugify

? DELETE PACKAGES:
npm uninstall slugify

\*/

// !=====================! //
// *Lecture#022
//*Setting up Prettier:

// we can create a file .prettierrc file to configure the prettier. then in curly braces we can define some settings.
// We can also setting all these configuration in VS Code, without defining any file.
// ?Defining a separate file is better to do because then we can change configurations from one project to another. and IMPORTANTLY it makes easier for multiple developers on the same team/project to all use the same configuration.

// !=====================! //
// _=====================_ //
// ?=====================? //

//

// !NEW SECTION #ff0000
// \*INTRODUCTION TO BACKEND-DEVELOPMENT

// !=====================! //
// _Lecture#025
//_ An Overview of How the Web Works:

/\*
? How the web actually works behind the scenes.
? What does actually happen each time that we type a url into browser in order to open up a new webpage? Or each time we request data form an API?
Our browser which is also called client send a request to the server where the webpage is hosted. And the server will then send back a response, which is gonna contain the webpage that we just requested, this process is called request-response model or client-server architecture.
Let's say that we wanna access google maps by writing google.com/maps into browser as a url. And every url gets an http or https, which is for the protocol that will be used on the connection. Then domain name here which is google.com and after /maps is so called resource that we want to access.
Domain name is not actually the real address of the server that we are trying to access, but just a nice name. So, we need a converting a domain name to the real address of the server, that happens through a DNS(domain name server), which is a special servers that are basically like a phone-books of the internet.
So, the first step that happens when we open up a website is that the browser makes a request to a DNS, and this special server will then simply match the web address that we types into the browser to the server's real IP address. this happens through internet service provider(ISP).
ip: <https://234.3.322.230:334> last past is called port number, which is a specific service running on server. NOTE: Port number is nothing to do with google maps resource that we want to access in above example. That resource will actually be sent over in the HTTP request.

Once we have the real web address, a TCP socket connection is established between the browser and the server, which are now finally connected, And this connection is typically kept alive for the entire time it takes to transfer all the files of the website.
? What are TCP and IP?
TCP is Transmission Control Protocol and IP is Internet Protocol, and together they are communication protocols that define exactly how data travels across the web. They are basically internet's fundamental control system, because they are the ones who set the rules about how data moves on the internet.
http stands for HyperText Transfer Protocol.
After TCP/IP, HTTP is yet another communication protocol, A communication protocol is simply a system of rules that allows two or more parties to communicate. http allows clients and we servers to communicate.
A request message will looks like this:
GET /maps Http/1.3.
.Host: <www.google.com>
User-Agent: Mozilla/5.0
Accept-language: en-US

<BODY>

the beginning of the message is the most important part, called start line, which contains the http method that used in the request, then the request target and http version.
There are many http methods available, but most important one are GET for simply requesting data, and POST for sending data and PUT and PATCH to basically modify data.

A request target, this is where the server is thought that we want to access the maps resource in this example. if it's empty(no maps), just a slash/, then we would be accessing the website's root, which will be google.com.

Then next part of the request are the request headers, which is just some information that we send about the request itself, there are tons of different headers available, like what browser is used to make request, at what time, the user's language and many others...
Finally in the case we're sending data to the server, there will also be a request body containing that data, for example data coming from an html form.
Now these are all about http requests ad response....

differences between http and https is that https is encrypted using TLS or SSL, Which are yet some more protocols. But beside these encryption the logic between http requests and responses still applies to https.

NOW at this point our request hits the server, which will be working on it until it has our website ready to send back. And it will send it back using HTTP response. The http response message looks quite similar to the request, with a start line, headers and a body.
The start line has besides the http version, a status code and message. status code 200 means OK, and 404 means not found. Then the response headers are information about response itself, we can actually make our own headers. Difference between response headers and request headers is that it's actually the back-end developer specifies them and sends them back in the response. Finally the last part of the response is again the body, which is actually present in most responses. And it's also the developer specifies the developer who specifically sends back the body in the response. We already did that using response.end(). The body should usually contain the html of the website we requested or for example, json data coming from API or something like that.

Basically, this entire back and forth between client and server that it just explained happens for every single file that is included in the website. There can be multiple requests and responses happening at the same time.

The TCP/IP are the communication protocols that define how data travels across the web.

The job of TCP is to break out the requests and responses into thousands of small chunks called packets before they are sent, then once they get to their destination, it will reassemble all the packets into the original request or response

The job of IP protocol is to send and route all of these packets through the internet, so it ensures that all of them arrive at the destination that they should go using IP addresses on each packet.

- FRONT-END AND BACK-END
  #59d253

?WHAT IS A SERVER:
A basic server is really just a computer that is connected to the internet, which first stores a website's files like html, css, images etc. and second, runs an http server, that is capable of understanding urls, requests and also delivering responses. The http server software actually communicates with the browser using requests and responses, therefore its's like a bridge between the frontend and the backend.

- STATIC AND DYNAMIC
  #59d253

?STATIC:
A simple web-app, is when a developer uploads the final ready to be served files(html, css, js, images... ) of a websites onto the web server, and then exact same files that the server will later send to the browser when the website is requested. The browser takes this files and render them. It means there is no work done on the server, there is no back-end code, and also there is no application.

?DYNAMIC:
Dynamic websites usually contains database and then there's also and application running, like a node.js app, which fetch data from the database and then renders it to the browser dynamically.
Each time a new page is requested, the server will build a page, with filling templates(html,css,js files) based on data coming from the database and send all files(html,css,js,imgs...) back to the browser, This whole process is called server-side rendering.
? The website can change all the time according to the content that's in the database or user's actions on the site, that's way it's called dynamic website.

Dynamic websites and web applications are same thing.

?APIs (Application Programming Interface):
Recent years we see more and more websites based on APIs.
A piece of software that can be used by another piece of software, to allow applications to talk each other.
An API powered websites are quite similar to dynamic websites, that use database and getting data. BUT big difference is that with an API we only send the data to the browser, usually in the json data format, not entire website. Just a data, not the ready to be displayed website, (no html, no css... only json data).

So when building and API powered websites, there is always these two steps:
1- Building an API
2- Consuming the API on the client side.

In API based website the build phase is kind of moves from backend to frontend. we can also say it moves form the server to the client. Many times Dynamic website are called server side rendered because they are actually built on the server. On the other hand API powered websites are often called client-side rendered.
So, backend developers actually just build an API and let frontend people to build a site. Node is a absolutely perfect tool for building an APIs, it's very commonly used to that.

APIs that build with Node, or any other language can be consumed by other clients than just the browser

\*/

//
// !-----------------------! //
// _-----------------------_ //
// ?-----------------------? //
// !NEW SECTION #ff0000

//

// _lecture 030
//_ Node, V8, Libuv and C++

/\*
Node architecture in terms of node dependencies, which is a just of couple of libraries that node depends on in order to work properly.
The most important ones is the V8 javascript engine and libuv. Remember node.js is javascript engine run-time based on google's V8 engine.
V8 engine converts javascript code into machine code that a computer can actually understand. V8 engine is not enough to create server side applications, so we have libuv.
Libuv is an open source library with a strong focus on asynchronous IO(input output). This gives node access to the underlying computer operating system, file system, networking, and more... Besides that, libuv also implements two extremely important features of node.js. Which are the event loop and also the thread pool. And in simple terms, the event loop is responsible for handling for easy tasks like executing call backs and network IO while the thread pool is for more heavy work like file access or compression or something like that. Libuv is completely written in C++ not in javascript, and V8 itself also use C++ code besides javascript. Therefor node itself is a program written in C++ and javascript, not just in javascript.

\*/

// _lecture 031
//_ Processes, Threads and the Thread Pool:

/\*
When we use node on a computer, it means that there is a node process running on that computer. A process is a just a program in execution, and remember that nodeJs is basically C++ program, which will therefor start a process when it's running.
In node we actually have access to a process variable.
In that process node.js runs in a so called single thread. A thread is basically just a sequence of instructions. NODE RUNS IN JUST ONE THREAD, SO WE NEED TO BE VERY CAREFUL ABOUT NOT BLOCKING THAT THREAD.

Let's now understand what happens in a single thread when start node application:
When the program is initialized, all the top level code is executed, which means all the code that is not inside any callback function. Also all the modules that need are required, and all the callback are registered, just like once that we used for http server in nod-farm app. Then after all that, the event loop finally starts running, in there(event loop) most of the work is done. But here is the catch, some tasks are actually too heavy, they are too expensive to be executed in the event loop, because they would then block the single thread. So that's where thread pool comes in, ThreadPool gives us four additional threads that are completely separate from the main single thread, and we can configure it up to 128 threads, but usually these four are enough. So, These threads together formed a thread pool. And the event loop can then automatically offload heavy tasks to the thread pool. All these happens automatically behind the scenes. heavy tasks may be: file system, cryptography, compression, DNS lookup, etc....

\*/

// _lecture 032
//_ Event Loop: Event loop is the heart of the node.js architecture.

/\*
? Remember, in the node process the event loop runs still in the single thread.
The event loop is where all the application code that is inside callback functions is executed. So, basically all codes that is not top level code will run in event loop, some parts might get offloaded to the thread pool. Node.js is all build around callback functions, functions that are called as soon as some work is finished in some time in future. Things like our application receiving an http request on our server or a timer expiring or a file finishing to read, all these will emit events as soon as they are done with their work and event loop will then pick up these events and call the callback functions that are associated with each event. The event loop receives events each time something important happens and will then call the necessary callbacks.
?In Summary: It's usually said that the event loop does the orchestration, which simply means that it receives events, calls their callback functions and offloads the more expensive tasks to thread pool.

? How does all this actually work behind the scenes? In what order are these callbacks executed?
When we start our application the event loop starts running, and the event loop has multiple phases and each phase has a callback queue, which are the callbacks coming from the events that the event loop receives.
?Let's now take a look at four most important phases:
1- First phase takes care of callbacks of expired timers for example setTimeout() function. So if there are callback functions from timers that just expired, these are first ones to be processed by the event loop. If a timer expires later during that time when one of the other phases are being processed, then the callback of that timer will only be called as soon as the event loop comes back to this first phase. So, callbacks in each queue are processed one by one until there are no ones left in the queue and only then the event loop will enter the next phase.

2- I/O polling and execution of I/O callbacks: polling means looking for new I/O events that are ready to be processed and putting them into the callback queue. and remember in the context of a node application, I/O(input/output) means mainly stuff like networking and fil accessing.

3- The next phase is for setImmediate callbacks, and setImmediate is a special kind of timer that we can use if we want to precess callbacks immediately after the I/O polling and execution phase.

4- Finally the fourth phase is for close callbacks, which are not that important for us. In this phase all close events are processed for example for when a web server or a webSocket shuts down.

These are the four phases in the event loop each has it's own callback queue but besides these four callback queues there are two other queues. 1- nextTick() queue and 2- microtask queue which is mainly for resolved promises. If there are any callbacks in one of these two queues to be processed, they will be executed right after current phase of the event loop, instead of waiting for the entire loop to finish. what about nextTick?? Basically process.nextTick() is a function that we can use when we really, really need to execute a certain callback right after the current event loop phase.
THE EVENT LOOP IS WHAT MAKES ASYNCHRONOUS PROGRAMMING POSSIBLE IN NODE.JS.

?Guidelines for the not block the event loop:

- Don't use sync version of functions in fs, crypto and zlib modules in callback functions.
- Don't perform complex calculations in event loop.
- Be careful with JSON in large objects.
- Don't use too complex regular expressions.

? What is a tick in event loop?
!REMEMBER: In Node. js, each iteration of an Event Loop is called a tick. Every time the event loop takes a full trip to all phases.

\*/

// _lecture 033
//_ The Event Loop in Practice
// Open this folder in code editor. 2-how-node-works/starter, There will be a code with explanations.
// !Go here '2-how-node-works/starter event-loop.js' lazmii

// _lecture 034
//_ Events and Event-Driven Architecture:
/\*
Most of node's core modules like http, fs, and timers are built around event driven architecture, we can also use this architecture to our advantage in our own code. And the concept is actually quite simple. let's see...
In node, there are certain objects called event emitters that emit named events as soon as something important happens in the app. like request hitting server, or a timer expiring or file finishing to read. These events can then be picked up by event listeners, that we setup, which will fire off callback functions that are attached to each listener. lets look at the example of how node use the event-driven architecture to handle server requests in the http module that we already used.
So, when we want to create a server, we use createServer method and save it to a server variable.(see below example). Implementation here is bit different from what we did before, but it works the exact same way. Here this server.on method is how we actually create a listener, and in this case for the request event. So, let's say we have our server running and a new request is made. The server acts as an emitter, and will automatically emit an event called 'request' each time that a request hits the server. then since we already have a listener set up for this exact event, the callback function that we attached to this listener will automatically be called, and this kind of function we already known from before, it will simply send some data back to the client. Now it works this way because behind the scenes the server is actually an instance of the node.js eventEmitter class, so it inherits all this event emitting and listening logic from that eventEmitter class. This eventEmitter logic is called observer pattern in javascript programming in general, and it's quite popular pattern with many use cases. And the opposite of this pattern is simply functions calling other functions, which is something that we're more used to actually.

const server = http.createServer();
server.on('request', (req, res) => {
console.log('Request received');
res.end('Request received');
})

! Go to the 2-how-node-works/starter/events.js file, open it.. code should be there.... lazmii

\*/
