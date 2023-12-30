const EventEmitter = require('events'); // EventEmitter is a class. here variable EventEmitter is a standard name, that usually(99%) developers used.

const http = require('http');

/*
So to use built in node events, we need to require the events module ⬆.

To create a new emitter, we simply create an instance basically of the class that we just imported. ⬇
!REMEMBER: EventEmitters can emit named events and we can then subscribe(listen) to these events, and then react accordingly. it's bit similar to the listening dom events.
*/
/*
const myEmitter = new EventEmitter();

myEmitter.on('newSale', () => {
  console.log('There was a new sale!');
});

myEmitter.on('newSale', () => {
  console.log('Just another sale!');
});

myEmitter.emit('newSale'); */ // we want to emit an event called newSale. this emitting here is as if we were clicking on the button, so now we have to listers. ⬆  we listen it using on method. it will take an emit and callback ⬆.
// One of the nice things about the event emitters is that we can actually set up multiple listeners for the same event, as we did here⬆⏫
// !REMEMBER: These is called observer pattern. myEmitter.emit('newSale'); this is the object that emits the events and these two myEmitter.on('newSale', () => {}); are the observers. they observe the emitter and wait until it emits the newSale event.

/*
We can even pass arguments to the eventListener by passing them as an additional argument in the emitter. ⬇, then the callback function in listener will take an argument (stock in example below) 

*/

/*
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
*/
// this small example works perfectly but we use this pattern in real life then best practice is to create a new class that will inherit from the node EventEmitter. some thing like this ⬇. Remember EventEmitter is a class. and here Sales class is a new class that inherits everything from the EventEmitter class.

class Sales extends EventEmitter {
  constructor() {
    super(); // always have to do when we extend from parent class. by running super we get access to all the methods of the parent class.
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

// ? Yeah working... Actually this mechanism(extending the EventEmitter class) is exactly how different node modules(http, filesystem, ...) implement events internally. All of them inherits from the EventEmitter class.

// ! let's now try another example about http module. Demonstrating that http module is completely base on events...
// We are creating a small web server and then listen to the event that it emits, but here we are doing little bit different then in intro section but works exactly same...

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
