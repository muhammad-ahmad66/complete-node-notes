/*
* Lecture#030

*The Node.js Architecture Behind the Scene: 
Node js architecture in terms of node dependencies, Node depends on couple of libraries to work properly. 
? Most important once are:
V8 Engine and Libuv
We said before that node is a javascript runtime based on google's V8 engine. V8 engine converts javascript code into machine code that a computer can actually understand. V8 alone are not enough to create server-side framework like Node, that's why we also have libuv in node. 

Libuv is an open source library with a strong focus on asynchronous IO(input/output), This layer gives node access to the underlying computer operating system, filesystem, networking, and more. Besides that, libuv also implements two extremely important features of node.js, which are the event loop and also thread pool. In simple term the event loop is responsible for handling easy tasks like executing call backs, and network IO, while the thread pool if for more heavy work like file access, compression etc. 
?Libuv is actually completely written in C++ and not in javascript. and V8 itself, also used C++ code besides javascript So therefor, Node itself is a program written C++ and javascript, not in just JavaScript. 

?Node not just relay on these two things but also on http-parser for parsing http, c-ares or something like that for some DNS request stuff, OpenSSL for cryptography and zlib for compression. 

*/

/*
*lecture 031
* PROCESSES, THREADS, THREAD POOLS

PROCESS: process is a just a program in execution. In node we actually have access to a process variable. In that process nodeJs runs in a so called single thread. 
THREAD: A thread is basically a sequence of instructions. 

NodeJS runs in just one thread, which makes it easy to block node applications. If we run our node application it'll run in a single thread, no matter if we have 10 users or 10 million users accessing application at the same time. So we need to be very careful about not blocking that thread. 

? 
When the program is initialized, all the top level code is executed, which means all the codes that are inside any callback function. Also the modules that your app needs are required, and all the callbacks are registers and than after all that the event loop finally starts running, All these happens inside the single thread. 
Some task may be too expensive to executed in the event loop, then they will block the single thread, so here thread pool comes in, which just like the event loop, is provided to node.js by the libuv library. Thread pool gives us four additional threads that are completely separate from the main single thread. And we can configure it upto 128 threads, usually these four are enough. And the event loop can then automatically offload heavy tasks to the thread pool. All this happens automatically behind the scenes. It's not developers who decide what goes to the thread pool.
Heavy tasks that goes to thread pool: File system, Cryptography, compression, DNS lookups, etc

*/

/*
* lecture 32 The Event Loop
? EVENT LOOP IS THE HEART OF THE NODE ARCHITECTURE. 
Remember Event Loop runs in a single thread. 
The event loop is where all the application code that is inside callback functions are executed. so, basically all codes that are not top level code will run in the event loop. Some parts might get offload to the thread pool.

Node are build all around callbacks. -functions that are called as soon as some work is finished in future. http request, timer expired, finished file reading all these emits and events as soon as they done with their work. And event loop will then pick up these events and call the callback functions that are associated with each event. The event loop receives events each time something important happens, and will then call the necessary callbacks. 
?It's use said that the event loop does the orchestration, which means it receives events, calls their callback functions, and offloads the more expensive tasks to the thread pool. 

? How all these works and what order these callbacks executed?
When we start our node application the event loop starts running right away. Now the event loop has multiple phases and each phase has a callback queue, which are the callbacks coming from the events that the event loop receives. 

*Let's now take a look at four most important phases: 
?1st Phase -Expired timer callbacks: 
It takes care of callbacks of expired timers, for example from the setTimeout() function, so, it there are callback function from the timers that just expired, these are the first ones to be processed by the event loop. If a timer expires later during the time when one of the other phases are being processed, then the callback of that timer will only be called as soon as event loop comes back to this first phase. It works like this in all four phases, callbacks in each queue are processed one by one until there are no ones left in the queue, and only then, the event loop will enter the next phase.

?2nd Phase -I/O polling and execution of IO callbacks: 
Polling means looking for new IO events that are ready to processed and putting them into the callback queue. And remember that in the context of a node application, IO means stuff like networking and file access, and so, in this phase where probably 99% of our code get executed, simply because in a typical node app the bulk of what we need to do is related to networking and file accessing. 

?3rd Phase -setImmediate callbacks:
setImmediate is a special kind of timer that we can use if we want to process callbacks immediately after the IO polling and execution phase, which can be important in some advanced use cases.  

?4th Phase -Close callbacks:
In this phase all close events are processed, for example for when a webserver or a webSocket shutdown.

?Besides there 4 callback queues there are actually two other queues. 1) The nextTick() queue and 2) The microtask queue, which is mainly for resolved promises. 
If there is any callback in one of these two queues to be processed, they will be executed right after the current phase, Instead of waiting for entire loop to finish. 
Basically process.nextTick() is a function that we can use when really really need execute a certain callback right after the current event loop phase. it's a bit similar to the setImmediate, with difference that setImmediate only runs after the IO polling phase. 

!Tick in event loop: Tick is basically just a one cycle in this loop. 

? Now it's time to decide whether the loop should continue to the next tick or should exit? 
For this node simply checks whether there are any timers or IO tasks are still running in the background,if there aren't any, then it will exit the application. for example when we're listening for incoming http request, we are basically running an IO task and that's why teh event loop, therefor node keep running and keep listening for new http requests coming in. Also when we reading and writing files in background that's also an IO task.

!An event loop is what that makes asynchronous programming possible in Node.js. Also remember that we need the event loop, because in Node.js everything works in one single thread. 
  
*/
