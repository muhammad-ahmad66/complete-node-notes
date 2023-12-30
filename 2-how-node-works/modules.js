/*

! --------- THEORY ----------- !


* Lecture 038
* How Requiring Modules Really Works

? The CommonJS Module system:
- In the node.js module system each javascript file is treated as a separate module, 
- Node.js uses the commonJS module system: require(), export or module.exports;
- ES module system is used in browser: import/export; This ES module system was developed to work in the browser using the import export syntax. 
- ES modules in Node.JS, specially using file extension like .mjs, but so far it's not become popular thing to use. 

? Why in Node.js each and every module actually gets access to the require function in order to import modules in the first place? It's not a standard javascript function, where does it come from? And how exactly does it work behind the scenes? Let's find our...

?By Asking question: What happen each time that we require a module by calling the require function with the module name as the argument? 
So, As a very broad overview the following steps are executed behind the scenes. 
The path to required module is resolved and the file is loaded. Then a process called wrapping happens, after that the module code is executed, and the module exports are returned, and finally the entire module gets cached. 
Let's now look at each step in more detail. 

1st: Module Resolved and Loaded:
First off how does node know which file to load when we require a module? 
We can actually load three different kinds of modules. 1) node's code modules require('http')  2) Our own modules or  Developer modules. require('./lib/controller); 3) third party modules require('express); So, this process is known as resolving the file path.
! See pdf file

2nd: Module code is wrapped: After the modules is loaded the module code is wrapped into a special function which will give us access to a couple of special objects. So, this step is where the magic happens. Here we get answer to the question where does the require function actually come from and why do we have access to it? It's because the Node.js runtime takes the code off our module and puts it inside the immediately invoked function expression or IIFE. Node does actually not directly execute the code that we write into a file but instead, the wrapper function that will contain our code in it's body. It also passes the exports require, module, filename and dir objects into it. So that's way in every module we automatically have access to stuff like require function. so these are basically global variables.  Now by doing this, node achieves two very important things. 1) Giving developers access to all these variables. 2) It keeps the top-level variables that we define in our modules private. so it's scoped only to the current module. 

3rd: Wrapper function gets EXECUTION by the node.js runtime.

4th: Require function to return something. 
It returns is the exports of the required module, this exports are stored in the module.exports objects. From each module we can export variables which will be returned by the require function. and we do that by assigning variables to module.exports or simple to exports. 
Here we need to know about when to use module.export or just export? If all we want to do is to export one single variable, like one class or one function then we usually use module.exports and set it equal to the variable that we want to export. (module.exports = calculator); On the other hand if we are looking to export multiple named variables like multiple functions,

5th: Caching
Last step is that modules are actually cached after the first time they are loaded. It means that if we require the same module multiple times, we will always get the same result. And the code in the modules is actually only executed in the first call. In subsequent calls the result is simply retrieved from cache. 

*/
/*
! --------- PRACTICE ----------- !

* Lecture 039
* REQUIRING MODULES

*/

// arguments is an array in javascript and this array contains all the values that we passed into a function.  If here we see something here as we log arguments, then it's mean we're in a function.
// console.log(arguments); // Yeah Indeed. here we have five arguments of the wrapper function. (array with 5 elements) 1- export, 2- require function, 3- module, 4- file name, and 5- finally directory name.

// we can see a wrapper function also with the following code:
// console.log(require('module').wrapper);

/*
? How we can export and import data from one module to another?
 we just created a module(a file) with a name of test-module1.js
 we use module.exports when we wants to export one single value.

 we can then save exported value into a variable when importing it.
 */

// module.exports
const C = require('./test-module1');
const calc1 = new C();
console.log(calc1.add(2, 5)); // 7

// ! See test-module1js file. that's how we export stuff with module.exports

// ? Now lets see how and when we can use the export shorthand. The alternative to doing module.exports is add properties to the export object itself.

// exports
// const calc2 = require('./test-module2');
// this calc2 is the export object.
// console.log(calc2.multiply(3, 9));

// This is a difference between module.exports and exports. So, again, when we're using simply exports we can add stuff to this object, so basically properties and then when we import that(require) the result that we're gonna get is an object containing all these properties. Since we are getting an object we can use ES6 destructuring to do some cool magic here.
const { add, multiply, divide } = require('./test-module2');
console.log(add(7, 3));
console.log(multiply(7, 3));
console.log(divide(7, 3));

/*
* Caching
? Finally Let's talk about caching very quickly. 

*/
require('./test-module3')(); // calling without saving in any variable.
require('./test-module3')();
require('./test-module3')();
/*
output of these 3 logs:
hello from the module
Log this beautiful texts...!
Log this beautiful texts...!
Log this beautiful texts...!

hello from the module is only one and other text are three times as we called. this is because of caching, so, technically this module is only loaded once. and Log this beautiful texts...! is store somewhere in the node processes cache, so 2nd and 3rd came from cache. 
*/
