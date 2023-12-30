# Asynchronous Javascript

<!https://dog.ceo/dog-api/> -Using dog.ceo API.

```js
const fs = require('fs');
const superagent = require('superagent');

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Bred: ${data}`);
  // Inside of this callback function, we want to do http request.
  // There is several ways to doing this, but easiest way to just using an npm package for that.
  // There are many but we're gonna use is called super Agent. npm install superagent

  // Sending http request by using superagent
  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err, res) => {
      if (err) return console.log(err.message);

      console.log(res.body.message);
      // Here we have this callback function inside a callback function.
      // Now we want to save this string into a new text file. that again yet another callback function

      fs.writeFile('dog-img.txt', res.body.message, (err) => {
        console.log('Random dog image saved to file!');

        // all these callbacks makes our code messy, makes it difficult to understand and also hard to maintain.
        // May be not at this level with just three callback inside of each other.
      });
    });
});
```

---

## FROM CALLBACK TO PROMISES

We gonna start by using promise for the http request instead of callback on superagent library, this is gonna work because the super agent library actually has support for promises out of the box. So we can simply use them, HOWEVER for node functions coming from internal node packages like readFile, we will actually have to build the promise ourselves.

A promise basically implements the concept of a future value. A value that we are expecting to receive sometime in the future. Here in this example the random dog image is a future value.  
Now we'll learn how to consume promises:  
We'll start with get methods, because this method returns a promise.

**REMEMBER:**

- state of promise in beginning, when it's not received value yet, is called pending state.
- Resolved state -when it's either fulfilled or rejected. fulfilled -> successful and rejected -> there's an error.
- then method only called when the promise is fulfilled. and catch method when it's rejected.

---

## Building Promise

We'll promisify the read file and write file functions, which means that we will make them so that they return promises, instead of passing a callback into them.  
So, what we want is basically a read file function that returns a promise and that only receives a file name, no callback

We are creating a function readFilePromise, which behind the scenes runs a readFile function and then returns a promise. So that we can use that promise instead of callback.  
**We use Promise constructor**  
This promise constructor takes so-called **executor function**, which will get called immediately when promise is created and this function will take two arguments, resolve and reject.  
Both of these arguments are a functions. Calling resolve function will basically mark the promise as successful/fulfilled and return the successful value from the promise.  
In this executor function, we do all async operations. -in this case we're gonna call fs.readFile().  
Whatever variable that we pass into the resolve function, will be later available as the argument in the then method -in this example data variable.  
Also we can also mark the promise as rejected in case there was an error, by calling reject function. and whatever we pass into the reject function, will be later available in the catch method.  
Also promisify the writeFile function.  
Implementing the Chaining, by making each then handler return a new promise.  
At end of all of then handlers we need only one function to handle errors.  
Remember we can only use await it it's inside any async function.

### Promisify ReadFile

```js
const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      // Reject Function
      if (err) reject('I could not find that file. 🧨🧨🧨');
      // Resolve Function
      resolve(data);
    });
  });
};
```

### Promisify writeFile

```js
const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('Could not write file: 🧨🧨');
      resolve('Success');
    });
  });
};
```

```js
readFilePromise(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);

    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);

    return writeFilePromise('dog-img.txt', res.body.message);
    // fs.writeFile('dog-img.txt', res.body.message, (err) => {
    //   if (err) return console.log(err.message);
    //   console.log('Random dog image saved to file!');
    // });
  })
  .then(() => {
    console.log('Random dog image saved to file!');
  })
  .catch((err) => {
    console.log(err);
  });
```

```js
fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);
  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .then((res) => {
      fs.writeFile('dog-img.txt', res.body.message, (err) => {
        if (err) return console.log(err.message);
        console.log('Random dog image saved to file!');
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
});
```

---

## Consuming Promises with Async_Await

Instead of consuming with the then method we can use ES8 new feature async/await instead.

- In order to use async/await we need to create async function.
- async means asynchronous function, basically one that keep running in the background while performing the code that's in it. while the rest of the code keeps running in the event loop.
- This async automatically returns a promise
- Inside async function we always have one or more wait expressions. save it in a variable
- this await will stop the code from running at this point until this promise is resolved.
- If the promise is successfully then the await expression is the resolved value of the promise.
- For error handler we could not attach catch handler anywhere, so Instead we use try/catch block. It has nothing to do with async/await. It's a standard javascript feature.

```js
const getDogPic = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/dog.txt`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    await writeFilePromise('dog-img.txt', res.body.message);

    console.log('Random dog image saved to file!');
  } catch (err) {
    console.log(err);
    throw err;
  }

  return '2: READY!!';
};

console.log('1: will get dog pics');
getDogPic();
console.log('2: Done getting dog pics');
```

**Output:**  
1: will get dog pics  
2: Done getting dog pics

<https://images.dog.ceo/breeds/labrador/n02099712_4462.jpg>  
Random dog image saved to file!

Because this async function actually runs in the background, so can't just stop the execution of our main thread here.

```js
console.log('1: will get dog pics');
const x = getDogPic();
console.log(x);
console.log('2: Done getting dog pics');
```

Returning Values from Async Functions [code ⬆]

Here we have a Promise {\<pending>}, Instead of the string that we were expecting/ returning.  
Why x is not a string but this Promise pending?  
Because an Async function actually returns a promise automatically. Instead of logging x to the console it just tells x is a promise and it's pending/running at this point.

But what should be do if we actually want to get return a value? [code ⬇]  
We would have to treat this async function as a promise, we would use then method on it or again use async/await. Let's see

Instead of trying to save the returned value to a variable, we can use then method on it.

Because getDogPic returns a promise, and each time we have a promise we can use the then method in order to get access to it's future value.

!Now output is as expected:  
1: will get dog pics  
<https://images.dog.ceo/breeds/labrador/n02099712_6248.jpg>  
Random dog image saved to file!  
2: READY!!  
3: Done getting dog pics

What happen if there was an error? that's bit difficult to handle.  
If there is an error in the promise, but it sill resolve as a successful promise, It still returns that string. Even we use catch method here, because this returning promise is already marked as successful.

- but if we wanted to really wanted to mark it as rejected, we'll have to do something called throwing an error. lets do that in the catch block. ⬆
- we use built in javascript function called throw(err). and this will mark that entire promise as rejected.

Now output is:  
1: will get dog pics  
I could not find that file. ���  
ERROR..!!

The problem with this is that is mixes Async/Await with promises. We are still using then and catch methods. ⬇

So, Lets do with Another Pattern of doing it.

```js
console.log('1: will get dog pics');
getDogPic()
  .then((x) => {
    console.log(x);
    console.log('3: Done getting dog pics');
  })
  .catch((err) => {
    console.log('ERROR..!!');
  });
```

Another pattern of doing that⬆. code is in ⬇

- We use async/await to create this login
- but we don't want to create a whole new name function. Instead we'll use well known pattern called IIFE Immediately Invoked Function Expression.
- In IIFE, we always define our function in parenthesis. and then we call it right away. like this: (() => {})();

- In real life this sort of stuff happens all the time. we have an async function and we called it from async function and may be even another async function...

```js
(async () => {
  try {
    console.log('1: will get dog pics');
    const x = await getDogPic();
    console.log(x);
    console.log('3: Done getting dog pics');
  } catch (err) {
    console.log('ERROR..!!');
  }
})();
```

---

## Waiting for Multiple promises Simultaneously

Let's say that we wanted to get three random dog images not just one. We could do awaiting the three API calls one after the other. Why we make second api call to wait for the first one? and the third one to wait for the second one? Why we take unnecessary waiting time? When we could just run all at same time.  
Instead of awaiting one after other, first we save the promise in a variable, instead of awaiting. We saved the promise not the resolved value of promise.

and after that we create a variable and await it with Promise.all(). And into promise.all we pass an array of promises

here all variables contains all the information about this http request. we interested in onl body.message property. so we will have to get body.message property from that array.

```js
const getDogPic = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/dog.txt`);

    const res1Promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2Promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3Promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const all = await Promise.all([res1Promise, res2Promise, res3Promise]);
    const imgs = all.map((el) => el.body.message);

    // console.log(all);
    console.log(imgs);

    // console.log(res.body.message);

    await writeFilePromise('dog-img.txt', imgs.join('\n'));

    console.log('Random dog image saved to file!');
  } catch (err) {
    console.log(err);
    throw err;
  }

  return '2: READY!!';
};

(async () => {
  try {
    console.log('1: will get dog pics');
    const x = await getDogPic();
    console.log(x);
    console.log('3: Done getting dog pics');
  } catch (err) {
    console.log('ERROR..!!');
  }
})();
```
