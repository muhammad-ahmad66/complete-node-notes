# Introduction to NodeJS and NPM

## Table of Contents

1. [Node_Modules](#node_modules)
2. [READING_AND_WRITING_FILES](#reading_and_writing_files)
   1. [In_Blocking-Synchronous_Way](#in_blocking-synchronous_way)
   2. [In_Non-Blocking-Asynchronous_Way](#in_non-blocking-asynchronous_way)
3. [BLOCKING_AND_NON-BLOCKING](#blocking_and_non-blocking)
4. [SERVERS](#servers)
5. [ROUTING](#routing)
6. [BUILDING_API](#building_api)
7. [Filling_the_HTML_Template](#filling_the_html_template)
8. [PARSING_VARIABLES_FROM_URLs](#parsing_variables_from_urls)
9. [USING_OUR_OWN_MODULES](#using_our_own_modules)
10. [Quick_Tour_To_NPM](#quick_tour_to_npm)
    1. [Types_of_Packages_and_Installs](#types_of_packages_and_installs)
    2. [NPM_SCRIPTS](#npm_scripts)
    3. [Using_3rd-Party_Modules](#using_3rd-party_modules)
    4. [Package_Versioning_And_Updating](#package_versioning_and_updating)

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

**REMEMBER:** An Arrow function doesn't gets its own **this keyword**, It use the **this keyword** from the parent function. While a normal function always gets its own this keyword.

---

## BLOCKING_AND_NON-BLOCKING

### BLOCKING

Synchronous simply means that each statements is processed one after another, line by line, Each line of code wait for the result of the previous statement. Each line blocks the execution of the rest of the code, that's why synchronous code is also blocking code.

### NON-BLOCKING\_\_ASYNCHRONOUS

In asynchronous code we upload heavy work to basically be worked on in the background. Then once the work is done a callback function, that we register before is called to handle the result. During all that time the rest of the code can still be executing without being blocked.

So, we use asynchronous readFile function, which accepts a callback function. This will start reading the file in the background, then immediately nome on to the next statement.

**Why do we do this?**  
**In Nodejs process, there's only a one single thread.** A **thread** is a just like a set of instructions that's run in the computer's CPU.  
Node js is single threaded, so all users that using our application are using only that same thread. It means one user blocks the code than all other users will have to wait fot the execution to finish.

**REMEMBER:** Callbacks doesn't automatically make the code asynchronous.  
It only works for some functions in the Node API, such as readFile function and many many more....

**CALLBACK HELL:** lot of nested callbacks. We can avoid this by using ES6 promises OR ES8 async/await.

---

## SERVERS

**CREATING A SIMPLE WEB SERVER**  
We'll build a simple web server that capable of accepting requests and sending back a responses.

First step is to include yet another module, this one is called **http**  
**const http = require('http');** That's is one that gives us networking capabilities, such as building an http server.

In order to build own server, we have to do two things. First, we **create a server** and second, we **start the server,** so that we can listen to incoming requests.

**http.createServer()**  
**createServer()** will accept a callback function, which will be fired off each time a new request is hits our server. And this callback function get access to two important and fundamental variables. It's the request variable, and a response variable.

1. **CREATING A SERVER**

   ```JS
   const http = require('http');
   http.createServer((req, res) => {
   res.end('Hello from the server!');
   });
   ```

   Each time a new request hits to our server, this callback function⤴ will get called. **This callback function will have access to the request object which holds all kinds of stuff like request url**, etc. On the other hand **response object gives us a lot of tools basically for dealing with response**. **res.end()** is very simple way fo sending back a response.

2. **LISTENING INCOMING REQUEST**

   In order to listen an incoming request first we have to save the result of createServer() in a new variable. We stored that result in a variable named server.⤵  
   We use that server and on that we **call listen() method**. and **listen()** accept a couple of parameters the first one is **port**, usually the port that we use in node (8000), (300), (80), etc. **A port is basically a sub address on a certain host.** and the second one is **host**, if we don't specify host, and then will default to a local host, but we can also specify localhost explicitly. localhost usually has this address as a default('127.0.0.1'). This is a standard IP address of **localhost**. Localhost simply means the current computer. **Third as an optional argument we can pass a callback function**, which will be run as soon as the server starts listening.

   ```js
   const server = http.createServer((req, res) => {
     // console.log(res);
     res.end('Hello from the server!');
   });

   server.listen('8000', '127.0.0.1', () => {
     console.log('listening to request on port 8000');
   });
   ```

---

## ROUTING

**ROUTING:** Routing basically means implementing different actions for a different URLs.  
**Routing** is very complicated in real world big applications, In those cases we use a tool for that like Express.  
Right now we implement routing without any dependencies(express)..  
The first step is actually able to analyze the URL, and for that we yet another **built-in Node module,** just called **url**.

If we not found any page often we see 404 error, that is something called HTTP status code. We can add status code to the response. simplest way to display 404 error is to use res.writeHead(404);

We can do sendHeader in writeHead(). To send headers we need to specify an object, there we put the headers that we want to send.

```js
res.writeHead(404, {});
```

**What is header?** An http header is basically a piece of information about the response that we are sending back.

```js
res.writeHead(404, {
'Content-Type': 'text/html',
my-own-header': 'hello-world',
});
res.end('<h1>Page not found</h1>');
```

Headers and status code always need to be set before we send out the response. we never can send headers after the response content itself, (res.end('<h1>Page not found</h1>') after this)

```js
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
```

These routes that we defined here in our codes and the routes that we put in the URLs in the browser have nothing to do with files and folders in our project's file system.

---

## BUILDING_API

**What is an API???**  
**Basically an API is a service form which we can request some data.**

**What is JSON?**  
JSON is a very simple text format that looks a lot like javascript objects.

```js
fs.readFile('./dev-data/data.json');
```

**Remember:** In readFile './dev' dot means current folder where terminal is pointing, In this case starter. That is not always be ideal. so, therefor there is a better way. All Node.js scripts, get access to a variable called \_\_dirname, and that variable always translates to the directory in which script that we're executing is located. In this case both(terminal & index.js) are in same place...

```js
const url = require('url');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
```

```js
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
```

For html Content types is text/html and for json Content type is application/json.

⤴ It's working. BUT not 100% efficient, that is because each time someone hits /api route, the file will have to be read and then send back. INSTEAD we can do is to just read the file once in the beginning, and then each time someone hits /api route, simple send back the data. For that we write this code in the beginning with synchronous way. This code will be executed only once in the beginning, so it's not a matter it blocks the code.

---

## Filling_the_HTML_Template

```js
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
// !Placed in a module(replaceTemplate.js)

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

// REMEMBER: We are using all of these synchronized versions because we are in the top level code.
// Which is only executed once, right in the beginning when we load up the application.
// Then every time we'll get from that variables.

// Slugify
// Creating slugs for all our products
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

// console.log(slugify('Fresh Avocados', { lower: true }));

// const url = require('url');
const server = http.createServer((req, res) => {
  //console.log(req.url); ///product?id=0
  //console.log(url.parse(req.url, true)); //object with lot of properties
  const { query, pathname } = url.parse(req.url, true);
  // here we are destructuring the object and store the properties of query and pathname in variables with exact names as property.

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
```

---

## PARSING_VARIABLES_FROM_URLs

How to parse some variables from the URL in order to build the product page.

Right now req.url() on clicking details is product?id=0, so here no routers, for that it gives page not found although we have product routes but not any routes for product?id=0. So first we check for req.url(), and url.parse(). console.log(req.url);  
_console.log(url.parse(req.url, true)); **parse means parse the query**; **query means ?id=0**. We also need to pass a true value in a parse function in order to parse the query into an object._

Code Implementation ⤴

---

## USING_OUR_OWN_MODULES

We can create our own modules and export something from them for example function, then import this function into another module.  
Imagine we have to use this replaceTemplate() function in multiple files, for that we can create a new module and export this function from and imported to a files.  
NOTE: In node.js actually every single file is treated as a module. So, this index.js is actually is also a module. Here imports other modules like fs, http, url....

**How do we export functions from a modules?**  
There are different ways to export something from a module. one of these are module.exports  
_Imports usually always happen at the top of the file._

---

## Quick_Tour_To_NPM

**What is NPM_Node Package Manege?**  
**NPM is a command line interface app that automatically comes included with Node.js, and which we use to install and manage open source packages.** These packages usually comes from the package repository that is **NPM**. So **NPM is both the command line interface app and repository itself.**

First thing we usually do whenever we start a new project is: **npm init**. This will create a package.json file, which is kind of configuration file of the project, where all kinds of data about the project are stored.

---

### Types_of_Packages_and_Installs

There are **two types of packages** that can be install with npm, and also **two types of installs** there are.  
The two types of packages are **simple dependencies** and **development dependencies**.

**TWO TYPES OF PACKAGES:**

1. **REGULAR/SIMPLE DEPENDENCIES**  
   Now simple/regular dependencies are simply packages that contains some code that we will include in our own code. We actually call them dependencies because our project and code depend on them to work correctly. For example **Express** is dependency. Now we use **Slugify** package, which is a small tool that we can use to make readable URLs.  
   _To install dependencies: **npm install packageName**_

2. **DEVELOPMENT DEPENDENCIES**  
   These are usually just **tools for development** for example: code bundler like **webpack** OR a **debugger** tool, OR a testing library. Our code does not really depend on them, We simply use them to develop our applications.  
   _Let's now install a dev dependency. **npm install nodemon --save-dev**_  
   **nodemon** is a tool helps us develop NodeJs applications by automatically restarting the node application whenever we change some files in our working directory.

**TWO TYPES OF INSTALLS:**

1. **LOCALLY INSTALLS**  
   Install the packages locally, they only work in this project only.

2. **GLOBALLY INSTALLS**  
   Global installs will be available anywhere, not just in our project folder, But in every folder across our machine.

---

### NPM_SCRIPTS

**How we use dev-dependencies locally, How we use local-dev-dependencies??**  
We couldn't simply run it from the command line because the local dependencies don't work like that. But we can specify an npm script. We do that in script field.

```js
"scripts": {
"start": "nodemon index.js"
},
```

This nodemon means dev-dependency nodemon that are installed locally.  
_Now then we can run: **npm run start**._

---

### Using_3rd-Party_Modules

How to require third-party modules form the NPM registry?  
Actually requiring a module installed from NPM, is really simple. just like this⤵

```js
const slugify = require('slugify');
console.log(slugify('Fresh Avocados', { lowercase: true }));
```

slugify will be a function which we can use to basically create slug.  
**What is slug?**  
Slug is basically just last part of a url that contains a unique string that identifies the resource that the website is displaying.

_See Slugify documentation from npm page._

---

### Package_Versioning_And_Updating

**Version Numbers of our Packages:**  
Most of the packages on npm follow the so-called **semantic version notation**, which means that their version numbers are always expressed with theses numbers.  
**_"nodemon": "^3.0.1";_**  
**First one** is called major version(3). **Second one** is called minor version(0) And the **third one** is called patch version(1).

- The patch version is intended to fix bugs.
- The minor version is introduces some new features into the package, but it does not include breaking changes.
- Major version is introduced when a huge release, which can have breaking changes.

**UPDATING PACKAGES:**  
^ This symbol that comes in front of the version number specifies which updates we accept for each of the packages.

**Check any outdated package**  
_npm outdated_

**Installing certain version**  
We can install a certain package with a certain version number.  
_npm install slugify@1.0.0_

**To update**  
_npm update slugify_

**DELETE PACKAGES**  
_npm uninstall slugify_

---

## Setting_up_Prettier

We can create a file .prettierrc file to configure the prettier. Then in curly braces we can define some settings.  
We can also setting all these configuration in VS Code, without defining any file.  
Defining a separate file is better to do because then we can change configurations from one project to another. And IMPORTANTLY it makes easier for multiple developers on the same team/project to all use the same configuration.

---
