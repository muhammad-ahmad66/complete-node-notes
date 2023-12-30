# How Nodes works_Behind the Scene

## Table of Contents

1. [Node_V8_Libuv_And_C](#node_v8_libuv_and_c)
2. [Processes_Threads_And_The_Thread_Pool](#processes_threads_and_the_thread_pool)
3. [Event_Loop](#event_loop)
4. [Events_and_Event-Driven_Architecture](#events_and_event-driven_architecture)

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

### The Event Loop in Practice

Open this folder in code editor. 2-how-node-works/starter, There will be a code with explanations.  
Go here '2-how-node-works/starter event-loop.js' lazmii

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

Go to the 2-how-node-works/starter/events.js file, open it.. code should be there.... lazmii
