# How Nodes works_Behind the Scene

## Table of Contents

1. [Node_V8_Libuv_And_C](#node_v8_libuv_and_c)
2. [Processes_Threads_And_The_Thread_Pool](#processes_threads_and_the_thread_pool)
3. [Event_Loop](#event_loop)
4. [Events_and_Event-Driven_Architecture](#events_and_event-driven_architecture)
5. [STREAMS](#streams)
6. [How_Requiring_Modules_Really_Works](#how_requiring_modules_really_works)
7. [Some_Missing_Stuff](#some_missing_stuff)

## Node_V8_Libuv_And_C++

Node architecture in terms of node dependencies, which is a just of couple of libraries that node depends on in order to work properly.  
The most important ones is the **V8 javascript engine** and **libuv**. Remember Node.js is javascript engine run-time based on google's V8 engine.

**V8 Engine** converts javascript code into machine code that a computer can actually understand. **V8 Engine** is not enough to create server side applications, so we have **libuv**.  
**Libuv** is an open source library with a strong focus on asynchronous IO(input output). This gives node access to the underlying **computer operating system**, **file system**, **networking**, and more... Besides that, libuv also implements two extremely important features of node.js. Which are the **event loop** and also the **thread pool**. And in simple terms, the **Event Loop** is responsible for handling for easy tasks like executing call backs and network IO while the **Thread Pool** is for more heavy work like file access or compression or something like that. **Libuv is completely written in C++ not in javascript**, and **V8 itself also use C++ code besides javascript**. **Therefor node itself is a program written in C++ and javascript, not just in javascript.**

---

## Processes_Threads_And_The_Thread_Pool

When we use node on a computer, it means that there is a node process running on that computer. **A process is a just a program in execution**, and remember that nodeJs is basically C++ program, which will therefor start a process when it's running.  
**In node we actually have access to a process variable.**  
In that process node.js runs in a so called single thread. **A thread is basically just a sequence of instructions.** NODE RUNS IN JUST ONE THREAD, SO WE NEED TO BE VERY CAREFUL ABOUT NOT BLOCKING THAT THREAD.

**Let's now understand what happens in a single thread when start node application:**  
When the program is initialized, all the top level code is executed, which means all the code that is not inside any callback function. Also all the modules that need are required, and all the callback are registered, just like once that we used for http server in nod-farm app. Then after all that, the **event loop** finally starts running, in there(event loop) most of the work is done. But here is the catch, some tasks are actually too heavy, they are too expensive to be executed in the event loop, because they would then block the single thread. So that's where thread pool comes in, **ThreadPool gives us four additional threads that are completely separate from the main single thread**, and we can configure it up to 128 threads, but usually these four are enough. So, These threads together formed a thread pool. And the **event loop** can then automatically offload heavy tasks to the thread pool. All these happens automatically behind the scenes. **Heavy tasks may be:** file system, cryptography, compression, DNS lookup, etc....

---

## Event_Loop

Event loop is the heart of the node.js architecture.

**Remember: In the node process the event loop runs still in the single thread.**  
The event loop is where all the application code that is inside callback functions is executed. So, basically all codes that is not top level code will run in event loop, some parts might get offloaded to the thread pool.  
Node.js is all build around callback functions, functions that are called as soon as some work is finished in some time in future. Things like our application receiving an http request on our server or a timer expiring or a file finishing to read, all these will emit events as soon as they are done with their work and event loop will then pick up these events and call the callback functions that are associated with each event. The event loop receives events each time something important happens and will then call the necessary callbacks.

**In Summary:** It's usually said that the event loop does the **orchestration**, which simply means that it receives events, calls their callback functions and offloads the more expensive tasks to thread pool.

**How does all this actually work behind the scenes? In what order are these callbacks executed?**  
When we start our application the event loop starts running, and the event loop has multiple phases and each phase has a callback queue, which are the callbacks coming from the events that the event loop receives.

**Let's now take a look at four most important phases:**

1. **First phase takes care of callbacks of expired timers** for example setTimeout() function. So if there are callback functions from timers that just expired, these are first ones to be processed by the event loop. If a timer expires later during that time when one of the other phases are being processed, then the callback of that timer will only be called as soon as the event loop comes back to this first phase. So, callbacks in each queue are processed one by one until there are no ones left in the queue and only then the event loop will enter the next phase.
2. **I/O polling and execution of I/O callbacks:** polling means looking for new I/O events that are ready to be processed and putting them into the callback queue. and **Remember** in the context of a node application, I/O(input/output) means mainly stuff like networking and fil accessing.
3. **The next phase is for setImmediate callbacks**, and **setImmediate** is a special kind of timer that we can use if we want to precess callbacks immediately after the I/O polling and execution phase.
4. **Finally the fourth phase is for close callbacks**, which are not that important for us. In this phase all close events are processed for example for when a web server or a webSocket shuts down.

These are the four phases in the event loop each has it's own callback queue but besides these four callback queues there are two other queues. 1. **nextTick() queue** and 2. **microtask queue**.  
**microtask queue** is mainly for resolved promises. If there are any callbacks in one of these two queues to be processed, they will be executed right after current phase of the event loop, instead of waiting for the entire loop to finish.  
**And what about nextTick??** Basically **process.nextTick()** is a function that we can use when we really, really need to execute a certain callback right after the current event loop phase.

**THE EVENT LOOP IS WHAT MAKES ASYNCHRONOUS PROGRAMMING POSSIBLE IN NODE.JS**.

**Guidelines for the not block the event loop:**

- Don't use sync version of functions in fs, crypto and zlib modules in callback functions.
- Don't perform complex calculations in event loop.
- Be careful with JSON in large objects.
- Don't use too complex regular expressions.

**What is a tick in event loop?**  
!REMEMBER: **In Node. js, each iteration of an Event Loop is called a tick**. Every time the event loop takes a full trip to all phases.

---

### The Event Loop in Practice

Open this folder in code editor. 2-how-node-works/starter, There will be a code with explanations.  
Go here '2-how-node-works/starter event-loop.js' lazmii

```js
const fs = require('fs');
const crypto = require('crypto');

setTimeout(() => {
  console.log('Timer 1 finished');
}, 0);

setImmediate(() => {
  console.log('Immediate 1 finished');
});

fs.readFile('test-file.txt', () => {
  console.log('I/O finished');
});

console.log('Hello from the top level code');
```

These codes⬆ is actually not in I/O cycle, It's not running inside the event loop. Because it's not running inside any callback function.  
These are not running inside any callback function, for that we have to move them inside a callback function.

```js
setTimeout(() => {
  console.log('Timer 1 finished');
}, 0);

setImmediate(() => {
  console.log('Immediate 1 finished');
});

fs.readFile('test-file.txt', () => {
  console.log('I/O finished');

  console.log('---- Running in Event Loop ----');
  setTimeout(() => {
    console.log('Timer 2 finished');
  }, 0);

  setTimeout(() => {
    console.log('Timer 3 finished');
  }, 3000);

  setImmediate(() => {
    console.log('Immediate 2 finished');
  });
});

console.log('Hello from the top level code');
```

**OUTPUT OF THIS CODE**:  
Hello from the top level code  
Timer 1 finished  
Immediate 1 finished  
I/O finished  
---- Running in Event Loop ----  
Immediate 2 finished  
Timer 2 finished  
Timer 3 finished

Why 'Immediate 2 finished' comes before 'Timer 2 finished' although setImmediate appear after setTimer in callback phases???  
Event loop actually waits for stuff to happen in the poll phase, So in that phase where I/O callbacks are handled. when I/O phase's queue of callbacks is empty,( which is the case here -no i/o callbacks, all we have these timers,) then the event loop will wait in this phase until there is an expired timer. But if we scheduled a callback using setImmediate, then that callback will actually be executed immediately after the polling phase.

Now let's make even more confusing by adding the process.nextTick

```js
setTimeout(() => {
  console.log('Timer 1 finished');
}, 0);

setImmediate(() => {
  console.log('Immediate 1 finished');
});

fs.readFile('test-file.txt', () => {
  console.log('I/O finished');

  console.log('---- Running in Event Loop ----');
  setTimeout(() => {
    console.log('Timer 2 finished');
  }, 0);

  setTimeout(() => {
    console.log('Timer 3 finished');
  }, 3000);

  setImmediate(() => {
    console.log('Immediate 2 finished');
  });

  process.nextTick(() => {
    console.log('Process.nextTick');
  });
});

console.log('Hello from the top level code');
```

**NOW OUTPUTS ARE**:  
Hello from the top level code  
Timer 1 finished  
Immediate 1 finished  
I/O finished  
---- Running in Event Loop ----  
Process.nextTick  
Immediate 2 finished  
Timer 2 finished  
Timer 3 finished

Why process.nextTick was the first one of all of them(events) to be executed?  
Remember nextTick is a part of the microtask queue, which get executed after each phase, not just after one entire tick.  
!REMEMBER: In Node. js, each iteration of an Event Loop is called a tick. Every time the event loop takes a full trip to all phases.

NOW WE TAKE A QUICK LOOK TO THE THREAD POOL

How long these operations take to run? and how we can change the thread pool size?

We gonna use some cryptography, to basically encrypt a password. for that we use, const crypto = require('crypto'); All functions from this package will be offloaded to the thread pool automatically by the event loop.

```js
const start = Date.now();

setTimeout(() => {
  console.log('Timer 1 finished');
}, 0);

setImmediate(() => {
  console.log('Immediate 1 finished');
});

fs.readFile('test-file.txt', () => {
  console.log('I/O finished');

  console.log('---- Running in Event Loop ----');
  setTimeout(() => {
    console.log('Timer 2 finished');
  }, 0);

  setTimeout(() => {
    console.log('Timer 3 finished');
  }, 3000);

  setImmediate(() => {
    console.log('Immediate 2 finished');
  });

  process.nextTick(() => {
    console.log('Process.nextTick');
  });

  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password Encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password Encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password Encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password Encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password Encrypted');
  });
});

console.log('Hello from the top level code');
```

we are using an encryption function pbkdf2('password'),and we pass ina secret string. we will discuss it later.

!OUTPUTS  
Hello from the top level code  
Timer 1 finished  
Immediate 1 finished  
I/O finished  
---- Running in Event Loop ----  
Process.nextTick  
Immediate 2 finished  
Timer 2 finished  
Timer 3 finished  
6294 Password Encrypted  
6302 Password Encrypted  
6303 Password Encrypted  
6310 Password Encrypted  
9810 Password Encrypted

The time of first four are same, because they are working in same time, because by default there are four thread pool, but for 5th one it has to wait until any thread gets finished. that's way it takes longer than others.  
But we can change the thread pool size.. How we do that?  
We do that by saying **process.env.UV_THREAD_POOLSIZE =1;** if we set it to 1, we will have only one thread in the pool.

```js
const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 5;

setTimeout(() => {
  console.log('Timer 1 finished');
}, 0);

setImmediate(() => {
  console.log('Immediate 1 finished');
});

fs.readFile('test-file.txt', () => {
  console.log('I/O finished');

  console.log('---- Running in Event Loop ----');
  setTimeout(() => {
    console.log('Timer 2 finished');
  }, 0);

  setTimeout(() => {
    console.log('Timer 3 finished');
  }, 3000);

  setImmediate(() => {
    console.log('Immediate 2 finished');
  });

  process.nextTick(() => {
    console.log('Process.nextTick');
  });

  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password Encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password Encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password Encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password Encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password Encrypted');
  });
});

console.log('Hello from the top level code');
```

---

## Events_and_Event-Driven_Architecture

Most of node's core modules like http, fs, and timers are built around event driven architecture, we can also use this architecture to our advantage in our own code. And the concept is actually quite simple. let's see...

In node, there are certain objects called **event emitters** that emit named events as soon as something important happens in the app. like request hitting server, or a timer expiring or file finishing to read. These events can then be picked up by event listeners, that we setup, which will fire off callback functions that are attached to each listener. lets look at the example of **how node use the event-driven architecture to handle server requests in the http module that we already used**.  
So, when we want to create a server, we use createServer method and save it to a server variable.(see below example). Implementation here is bit different from what we did before, but it works the exact same way. Here this server.on method is how we actually create a listener, and in this case for the request event. So, let's say we have our server running and a new request is made. The server acts as an emitter, and will automatically emit an event called 'request' each time that a request hits the server. then since we already have a listener set up for this exact event, the callback function that we attached to this listener will automatically be called, and this kind of function we already known from before, it will simply send some data back to the client. Now it works this way because behind the scenes the server is actually an instance of the node.js eventEmitter class, so it inherits all this event emitting and listening logic from that eventEmitter class. This eventEmitter logic is called observer pattern in javascript programming in general, and it's quite popular pattern with many use cases. And the opposite of this pattern is simply functions calling other functions, which is something that we're more used to actually.

```js
const server = http.createServer();
server.on('request', (req, res) => {
  console.log('Request received');
  res.end('Request received');
});
```

### Events in Practices

```js
const EventEmitter = require('events');
// EventEmitter is a class. here variable EventEmitter is a standard name, that usually(99%) developers used.

const http = require('http');
```

So to use built in node events, we need to require the events module ⬆.

To create a new emitter, we simply create an instance basically of the class that we just imported. ⬇  
**REMEMBER:** EventEmitters can emit named events and we can then subscribe(listen) to these events, and then react accordingly. it's bit similar to the listening dom events.

```js
const myEmitter = new EventEmitter();

myEmitter.on('newSale', () => {
  console.log('There was a new sale!');
});

myEmitter.on('newSale', () => {
  console.log('Just another sale!');
});

myEmitter.emit('newSale');
```

we want to emit an event called newSale. this emitting here is as if we were clicking on the button, so now we have to listers. ⬆ we listen it using on method. it will take an emit and callback ⬆.  
One of the nice things about the event emitters is that we can actually set up multiple listeners for the same event, as we did here⬆⏫  
REMEMBER: These is called observer pattern. myEmitter.emit('newSale'); this is the object that emits the events and these two myEmitter.on('newSale', () => {}); are the observers. they observe the emitter and wait until it emits the newSale event.

We can even pass arguments to the eventListener by passing them as an additional argument in the emitter. ⬇, then the callback function in listener will take an argument (stock in example below)

```js
const myEmitter = new EventEmitter();

myEmitter.on('newSale', () => {
  console.log('There was a new sale!');
});

myEmitter.on('newSale', () => {
  console.log('Just another sale!');
});

myEmitter.on('newSale', (stock) => {
  console.log(`There are ${stock} items left in the stock.`); //There are 9 items left in the stock.
});

myEmitter.emit('newSale', 9);
```

this small example works perfectly but we use this pattern in real life then best practice is to create a new class that will inherit from the node EventEmitter. some thing like this ⬇. Remember EventEmitter is a class. And here Sales class is a new class that inherits everything from the EventEmitter class.

```js
class Sales extends EventEmitter {
  constructor() {
    super();
    // always have to do when we extend from parent class.
    // by running super we get access to all the methods of the parent class.
  }
}

const myEmitter = new Sales();

myEmitter.on('newSale', () => {
  console.log('There was a new sale!');
});

myEmitter.on('newSale', () => {
  console.log('Just another sale!');
});

myEmitter.on('newSale', (stock) => {
  console.log(`There are ${stock} items left in the stock.`); //There are 9 items left in the stock.
});

myEmitter.emit('newSale', 9);
```

Yeah working... Actually this mechanism(extending the EventEmitter class) is exactly how different node modules(http, filesystem, ...) implement events internally. All of them inherits from the EventEmitter class.

let's now try another example about http module. Demonstrating that http module is completely base on events...  
We are creating a small web server and then listen to the event that it emits, but here we are doing little bit different then in intro section but works exactly same...

```js
const server = http.createServer();

// Now we are listening different events that the server will emit. [If we see .on any where then we are listening.]

server.on('request', (req, res) => {
  console.log('Request received!');
  res.end('Request received');
});

server.on('request', (req, res) => {
  console.log('Another Request😍😁');
});

server.on('close', () => {
  console.log('Server closed');
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Waiting for requests...');
});
```

Go to the 2-how-node-works/starter/events.js file, open it.. code should be there.... lazmii

---

## STREAMS

**STREAMS:** Streams are yet another important concept in NodeJs.  
Using Streams we can process(read and write) data piece by piece(chunks), without completing the whole read or write operation, and therefor we don't have keep all the data in memory.  
Think about Youtube and Netflix, which are both called streaming companies, because they stream video using the same principle, so instead of waiting until the entire video file loads, the processing is done piece by piece or in chunks. So that we can start watching even before the entire file is downloaded or loaded.  
So, Stream is a perfect candidate for handling large volumes of data. Also streaming makes the data processing move efficient in terms of memory and time.

**How streams Implement in Node?**  
**There are four fundamental types of streams**:

1. Readable streams
2. Writable streams
3. Duplex streams and
4. Transform streams.

**Readable streams** are ones from which we can read, we can consume data. Streams are everywhere in the core node modules like events. for example the data that comes in when an http server gets a request is actually a readable stream. We can read a file from filesystem piece by piece.

Streams are actually instances of the EventEmitter class. It means that all streams can emit and listen to named events. We can listen to many different events, most important two are the **'data'** and **'end'** events.  
**The data event** is emitted when there is new piece data to consume, and the end event is emitted as soon as there is no more data to consume.

We can have also important functions that we can use on streams, and in the case of readable streams, the most important ones are **'pipe'** and **'read'** functions.

**Writeable streams** are the once to which we can write data. for example: http response that we can send back to the client and which is actually a writeable stream. The most important events are **'drain'** and **'finish'** events. and the most important functions are **'write()'** and **'end()'** functions.

**Duplex streams** are streams that are both readable and writable at a same time. -less common- Good example in the web socket from the net module. Web socket is basically just a communication channel between client and server that works in both directions.

**Transform streams** are duplex stream, and at the same time can modify or transform the data as it is read or written. example of this one is the zlib core module to compress data which actually uses a transform stream.

These events and functions are foe consuming streams that are already implemented. We could also implement our own streams and consume them using these same events and functions.

---

### STREAMS IN PRACTICE

Lets say in our application, we need to read a large text file from the file system, and then send it to the client.  
There are multiple ways to do this, we cover from basic way to most appropriate...

```js
const fs = require('fs');
const server = require('http').createServer();
```

We do like this. the result of requiring http, is the http object and on there we ca then use createServer, and save it into variable.

**1st SOLUTION:**  
listen to the request

```js
server.on('request', (req, res) => {
  // SOLUTION 1: most straightforward way, which is simple read the file into a variable, and one that done, send it to the client
  fs.readFile('test-file.txt', (err, data) => {
    if (err) console.log(err);

    res.end(data);
  });
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening on...');
});
```

This working just fine but the problem is that node will actually have to load the entire file into memory, because only after that's ready it can send that data.

**2st SOLUTION:**  
In this solution we'll actually use streams.  
Here we don't need to read this data from the file into variable. Instead of reading data into a variable and store that data into memory, we will just create a readable stream. Then as we receive each chunk of data, we send it to the client as a response which is a writable stream ⬇

```js
server.on('request', (req, res) => {
  const readable = fs.createReadStream('test-file.txt');
  // this now creates a stream from the data that is in this text file, which we can then consume piece by piece.

  // consuming piece by piece
  // Remember each time there is a new piece of the that we consume, a readable stream emits the data event. so we can listen to that.
  readable.on('data', (chunk) => {
    // in this callback function, we have access to that piece of data, now we write it to a writeable stream, which is the response.
    res.write(chunk); // !Remember that response is a writeable stream.
  });
  // we also have to handle the event when all the data is read. When the stream is basically finished reading the data.
  readable.on('end', () => {
    res.end(); // here we don't have to provide any parameter(data)
  });

  // we always use 'data' and 'end' events one after another.

  // ? There is another event that we can listen to on a readable stream, which is error event.
  readable.on('error', (err) => {
    console.log(err);

    res.statusCode = 500;
    res.end('File not found.');
  });
});

server.listen('8000', '127.0.0.1', () => {
  console.log('listening on');
});
```

There is a still a problem with this approach. The problem is that our readable stream, the one that we're using to read the file from the disk, is much much faster than actually sending the result with the response writable stream over the network. and this will overwhelm/overload/overburden the response stream, which cannot handle all this incoming data so fast. And this problem is called **back-pressure problem**, and it's a real problem that can happen in real situations. In this case, back-pressure happens when the response cannot send the data nearly as fast as it is receiving it from the file. So we have better solution.

**3rd SOLUTION -best one:**  
The secret here is to actually use that pipe operator.  
The pipe operator is available on all readable streams, and it allows us to pipe the output of a readable stream right into the input of a writable stream. And that will then fix the problem of back-pressure, because it'll automatically handle the speed of the data coming in and the speed of the data going out.

```js
server.on('request', (req, res) => {
  const readable = fs.createReadStream('test-file.txt');

  // Here all we have to do is take our readable stream, use the pipe method on it, and put in a writable stream(that is the response). That's all we've to do!
  readable.pipe(res); //readableSource.pipe(writeableDestination)
});

server.listen('8000', '127.0.0.1', () => {
  console.log('Listening...');
});
```

---

## How_Requiring_Modules_Really_Works

**The CommonJS Module system:**

- In the node.js module system each javascript file is treated as a separate module.
- Node.js uses the commonJS module system: **require()**, **export** or **module.exports**.
- ES module system is used in browser: import/export; This ES module system was developed to work in the browser using the import export syntax.
- ES modules in Node.JS, specially using file extension like .mjs, but so far it's not become popular thing to use.

_**Why in Node.js each and every module actually gets access to the require function in order to import modules in the first place? It's not a standard javascript function, where does it come from? And how exactly does it work behind the scenes?** Let's find our..._

By Asking question: What happen each time that we require a module by calling the require function with the module name as the argument?

So, As a very broad overview the following steps are executed behind the scenes.  
The path to required module is resolved and the file is loaded. Then a process called **wrapping** happens, after that the module code is **executed**, and the module exports are **returned**, and finally the entire module gets **cached**.

**Let's now look at each step in more detail**.

1. **Module Resolved and Loaded:**
   First off how does node know which file to load when we require a module?  
   We can actually load three different kinds of modules. 1) **node's code modules require('http')** 2) **Our own modules or Developer modules**. require('./lib/controller); 3) **third party modules** require('express); So, this process is known as resolving the file path.  
   ! See pdf file

2. **Module code is wrapped:**  
   After the modules is loaded the module code is wrapped into a special function which will give us access to a couple of special objects. So, this step is where the magic happens. Here we get answer to the question where does the require function actually come from and why do we have access to it? It's because the Node.js runtime takes the code off our module and puts it inside the immediately invoked function expression or IIFE. Node does actually not directly execute the code that we write into a file but instead, the wrapper function that will contain our code in it's body. It also passes the exports require, module, filename and dir objects into it. So that's way in every module we automatically have access to stuff like require function. so these are basically global variables. Now by doing this, node achieves two very important things. 1) **Giving developers access to all these variables.** 2) **It keeps the top-level variables that we define in our modules private.** so it's scoped only to the current module.

3. **Wrapper function gets EXECUTION by the node.js runtime.**

4. **Require function to return something.**  
   It returns is the exports of the required module, this exports are stored in the module.exports objects. From each module we can export variables which will be returned by the require function. and we do that by assigning variables to module.exports or simple to exports.
   Here we need to know about when to use module.export or just export? If all we want to do is to export one single variable, like one class or one function then we usually use module.exports and set it equal to the variable that we want to export. (module.exports = calculator); On the other hand if we are looking to export multiple named variables like multiple functions,

5. **Caching**  
   Last step is that modules are actually cached after the first time they are loaded. It means that if we require the same module multiple times, we will always get the same result. And the code in the modules is actually only executed in the first call. In subsequent calls the result is simply retrieved from cache.

---

## PRACTICE

arguments is an array in javascript and this array contains all the values that we passed into a function. If here we see something here as we log arguments, then it's mean we're in a function.

```js
console.log(arguments);
```

Yeah Indeed. here⤴ we have five arguments of the wrapper function. (array with 5 elements) 1- **export**, 2- **require function**, 3- **module**, 4- **file name**, and 5- finally **directory name**.

we can see a wrapper function also with the following code:

```js
console.log(require('module').wrapper);
```

How we can export and import data from one module to another?  
we just created a module(a file) with a name of test-module1.js  
**we use module.exports when we wants to export one single value.**

we can then save exported value into a variable when importing it.

```js
// from test-module1.js file
// module.exports

// in modules file
const C = require('./test-module1');
const calc1 = new C();
console.log(calc1.add(2, 5)); // 7
```

See test-module1js file. that's how we export stuff with module.exports

Now lets see how and when we can use the export shorthand. The alternative to doing module.exports is add properties to the export object itself.

exports

```js
const calc2 = require('./test-module2');
// this calc2 is the export object.
console.log(calc2.multiply(3, 9));
```

This is a difference between module.exports and exports. So, again, when we're using simply exports we can add stuff to this object, so basically properties and then when we import that(require) the result that we're gonna get is an object containing all these properties. Since we are getting an object we can use ES6 destructuring to do some cool magic here.

```js
const { add, multiply, divide } = require('./test-module2');
console.log(add(7, 3));
console.log(multiply(7, 3));
console.log(divide(7, 3));
```

### Caching

Finally Let's talk about caching very quickly.

```js
require('./test-module3')(); // calling without saving in any variable.
require('./test-module3')();
require('./test-module3')();
```

output of these 3 logs:  
hello from the module  
Log this beautiful texts...!  
Log this beautiful texts...!  
Log this beautiful texts...!

hello from the module is only one and other text are three times as we called. this is because of caching, so, technically this module is only loaded once. and Log this beautiful texts...! is store somewhere in the node processes cache, so 2nd and 3rd came from cache.

---

## Some_Missing_Stuff

The Node.js Architecture Behind the Scene:

Node not just relay on these two things but also on http-parser for parsing http, c-ares or something like that for some DNS request stuff, OpenSSL for cryptography and zlib for compression.

### PROCESSES, THREADS, THREAD POOLS

**PROCESS:** process is a just a program in execution. In node we actually have access to a process variable. In that process nodeJs runs in a so called single thread.  
**THREAD:** A thread is basically a sequence of instructions.

NodeJS runs in just one thread, which makes it easy to block node applications. If we run our node application it'll run in a single thread, no matter if we have 10 users or 10 million users accessing application at the same time. So we need to be very careful about not blocking that thread.

### EVENT LOOP IS THE HEART OF THE NODE ARCHITECTURE [In_Detail]

Remember Event Loop runs in a single thread.  
The event loop is where all the application code that is inside callback functions are executed. so, basically all codes that are not top level code will run in the event loop. Some parts might get offload to the thread pool.

**1st Phase -Expired timer callbacks:**  
It takes care of callbacks of expired timers, for example from the setTimeout() function, so, it there are callback function from the timers that just expired, these are the first ones to be processed by the event loop. If a timer expires later during the time when one of the other phases are being processed, then the callback of that timer will only be called as soon as event loop comes back to this first phase. It works like this in all four phases, callbacks in each queue are processed one by one until there are no ones left in the queue, and only then, the event loop will enter the next phase.

**2nd Phase -I/O polling and execution of IO callbacks:**  
Polling means looking for new IO events that are ready to processed and putting them into the callback queue. And remember that in the context of a node application, IO means stuff like networking and file access, and so, in this phase where probably 99% of our code get executed, simply because in a typical node app the bulk of what we need to do is related to networking and file accessing.

**3rd Phase -setImmediate callbacks:**  
setImmediate is a special kind of timer that we can use if we want to process callbacks immediately after the IO polling and execution phase, which can be important in some advanced use cases.

**4th Phase -Close callbacks:**  
In this phase all close events are processed, for example for when a web-server or a webSocket shutdown.

Besides there 4 callback queues there are actually two other queues. 1) The nextTick() queue and 2) The microtask queue, which is mainly for resolved promises.  
If there is any callback in one of these two queues to be processed, they will be executed right after the current phase, Instead of waiting for entire loop to finish.  
Basically process.nextTick() is a function that we can use when really really need execute a certain callback right after the current event loop phase. it's a bit similar to the setImmediate, with difference that setImmediate only runs after the IO polling phase.

Tick in event loop: Tick is basically just a one cycle in this loop.

Now it's time to decide whether the loop should continue to the next tick or should exit?  
For this node simply checks whether there are any timers or IO tasks are still running in the background,if there aren't any, then it will exit the application. for example when we're listening for incoming http request, we are basically running an IO task and that's why teh event loop, therefor node keep running and keep listening for new http requests coming in. Also when we reading and writing files in background that's also an IO task.

An event loop is what that makes asynchronous programming possible in Node.js. Also remember that we need the event loop, because in Node.js everything works in one single thread.
