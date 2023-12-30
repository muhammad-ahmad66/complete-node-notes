const fs = require('fs');
const crypto = require('crypto');

/*
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
*/

// These codes⬆ is actually not in I/O cycle, It's not running inside the event loop. because it's not running inside any callback function.
// These are not running inside any callback function, for that we have to move them inside a callback function.

/*
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
*/
/* 
!OUTPUT OF THIS CODE:
Hello from the top level code
Timer 1 finished
Immediate 1 finished
I/O finished
---- Running in Event Loop ----
Immediate 2 finished
Timer 2 finished
Timer 3 finished

?Why 'Immediate 2 finished' comes before 'Timer 2 finished' although setImmediate appear after setTimer in callback phases???
Event loop actually waits for stuff to happen in the poll phase, So in that phase where I/O callbacks are handled. when I/O phase's queue of callbacks is empty,( which is the case here -no i/o callbacks, all we have these timers,) then the event loop will wait in this phase until there is an expired timer. But if we scheduled a callback using setImmediate, then that callback will actually be executed immediately after the polling phase.

*/
// ----------------------
// Now let's make even more confusing by adding the process.nextTick

/*
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
*/
/*
! NOW OUTPUTS ARE:
Hello from the top level code
Timer 1 finished
Immediate 1 finished
I/O finished
---- Running in Event Loop ----
Process.nextTick
Immediate 2 finished
Timer 2 finished
Timer 3 finished

? Why process.nextTick was the first one of all of them(events) to be executed?
Remember nextTick is a part of the microtask queue, which get executed after each phase, not just after one entire tick.
!REMEMBER: In Node. js, each iteration of an Event Loop is called a tick. Every time the event loop takes a full trip to all phases.

*/

/*
* NOW WE TAKE A QUICK LOOK TO THE THREAD POOL

? How long these operations take to run? and how we can change the thread pool size?

We gonna use some cryptography, to basically encrypt a password. for that we use, const crypto = require('crypto'); All functions from this package will be offloaded to the thread pool automatically by the event loop.

*/
/*
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
*/
/*
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
? But we can change the thread pool size.. How we do that?
We do that by saying process.env.UV_THREAD_POOLSIZE =1; if we set it to 1, we will have only one thread in the pool.
*/

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
