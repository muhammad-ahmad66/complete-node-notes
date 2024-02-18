# `Authentication And Authorization`

## `Table of Contents`

1. [Modelling_Users](#modelling_users)
2. [Creating_New_Users](#creating_new_users)
3. [Managing_Passwords](#managing_passwords)
4. [How_Authentication_with_JWT_Works](#how_authentication_with_jwt_works)
5. [Signing_up_Users](#signing_up_users)
6. [Logging_in_Users](#logging_in_users)
7. [Protecting_Tour_Routes](#protecting_tour_routes)
8. [Advanced_Postman_Setup](#advanced_postman_setup)
9. [Authorization__User_Roles_and_Permission](#authorization__user_roles_and_permission)
10. [Password_Reset_Functionality__Reset_Token](#password_reset_functionality__reset_token)
11. [Password_Reset_Functionality__Setting_New_Password](#password_reset_functionality__setting_new_password)
12. [Updating_the_Current_User__Password](#updating_the_current_user__password)
13. [Updating_the_current_User__Data](#updating_the_current_user__data)
14. [Deleting_the_current_User](#deleting_the_current_user)
15. [Security_Best_Practices](#security_best_practices)
16. [Sending_JWT_via_Cookie](#sending_jwt_via_cookie)
17. [Implementing_Rate_Limiting](#implementing_rate_limiting)
18. [Setting_Security_http_Headers](#setting_security_http_headers)
19. [Data_Sanitization](#data_sanitization)
20. [Preventing_Parameter_Pollutions](#preventing_parameter_pollutions)

---

## `Modelling_Users`

Authentication and Authorization is all about users signing up, logging in, and accessing pages or routes, that we grant them permission to do so, So, It's really really all about the users. And, so we need to start by implementing the user model in this lecture, so that in the next one we can then create new users in our database.  
let's create a new file for the user model(userModel.js) in models folder.  
After requiring mongoose, all we need to do is to create a schema and then a model out of it.

`Small Challenge:`  
Create a schema with five fields name, email, photo, password, passwordConfirm

In email we want to validate the email address, so basically testing if the provided email is valid for common email format. For that we need to create our own validator. But here we use validator package.

**Why type of photo is String?**  
If user's wants to upload a photo then that will be stored somewhere in our file system and the path to that photo will then be stored into this photo field.

```js
// userModel.js file

const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please provide a password'],
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
```

---

## `Creating_New_Users`

Let's now create those new users, based on the User Model that we just implemented in the last lecture. So, we'll do most of the user-related stuff like creating new users, logging users in, or updating passwords in the authentication controller. So all of these stuff that's related to authentication is not gonna be in the user controller, that we actually created before but instead we will create an authentication controller.  
_We built authController.js file, all the function that are related to authentication will go here._

The first thing we need to do in authController.js file is to import our User model.  
Then lest's create and export our very first controller(sign up). Instead of making createUser like we did in tour controller, we'll call signup because that's name that has a bit more meaning in the context of authentication.

For create a new user, Remember how we create a new tour document based on tour model. **WE USED OUR MODEL AND THEN MONGOOSE METHOD ON THAT,LIKE User.create(), AND PASS AN OBJECT WITH THE DATA by which user should be created. JUST LIKE BEFORE THAT DATA SHOULD BE IN REQ.BODY.**  
In the next step we send that newUser to the client.  

```js
exports.signup= catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    }
  })
})
```

This⤴ entire function(signup) is an async function, so we need to catch the error, so for that we wrap this entire function into the catchAsync function. We don't have to write try/catch block in every function.

Now we need to implement the route so that the signup handler can get called.  Let's go to our userRoutes. The user resource is bit different from all the other resources, because it really has to do with all things authentication. And so we have a different controller for that, so the authController, the function names also have some different names and so we will actually also have a special routes.  
As we see this sign up is a special endpoint. For signup we only need POST http method, we cannot get data from signup or we cannot patch a signup.

```js
// In userRoutes file
const authController = require('./../controllers/authController')
router.post('/signup', authController.signup);
```

There is also possibility of a system administrator to updating or deleting or getting all the users based on their ID. but we will take care of that late. For now we just want to implement all the functions that are about authentication. So basically functions that are only relevant for the user itself.  

```js
// In authController file
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.signup= catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    }
  })
});
```

**`Router for Signup`**

```js

// !in userRoutes file
const authController = require('./../controllers/authController')
router.post('/signup', authController.signup);
```

---

## `Managing_Passwords`

In this lecture we're gonna manage our users passwords in the database. Fist validate if the inputted password is equal to the confirmed password and then also to encrypt the password in the database in order to secure it against attacks.  

Fist thing we gonna do is to validate if the two inputted passwords are the same. And the best place to do that is in the confirm password in userModel.js. And so let's write our custom validator for that.

In validate we will create a function and error message. A validator will gonna be a function, which is then gonna be called when the new document is created. **In this we'll not use arrow function, b/c we will use this keyword**. **Remember in a validator function we return either true or false.** If the return value is false then it means we're gonna get a validation error, Here we'll check current element with inputted password. If it gives false then will validation error, **BUT WE NEED TO KEEP IN MIND THAT THIS IS GONNA WORK ON SAVE AND CREATE ONLY.** For this reason whenever we want to update the user we'll always have to use save as well and not use findOne and updateOne etc, like we did with our tours. Only work when we create a new object, [.create()] or on save [.save()]

```js
passwordConfirm: {
  type: String,
  required: [true, 'Please confirm your password'],
  validate: {
    validator: function(el){
      return el === this.password;
    },
    message: 'Passwords are not the same!',
  }
}
```

But now, the next step is to actually encrypt these plain passwords that we are storing in our database. When we are working with authentication, one of the most fundamental principles is to never ever store plain passwords in a database, that's something that's absolutely not acceptable, so we should always encrypt user's passwords. Imagine due to a some reason a hacker gets access to the database, if then the passwords are stored in plain text in there, then he can simply login as any user and do whatever he really wants... Lets now go ahead and implement this.  
The model is the best place to do this kind of functionality. because it really has to do with the data itself so it should be on the model not in the controller. So again keep the fat models, thin controllers philosophy in mind.

**How we gonna now implement this encryption?**  
Well, this is another perfect use case for using Mongoose middleware. And the one that we're gonna use is a pre-save middleware, basically document middleware. REMEMBER! We defined that on the schema. And in this we want to set a pre-hook, so a pre-middleware on save. The reason to doing like this is that the middleware function that we're gonna specify here, so the encryption, is then gonna be happened between the moment that we receive that data and the moment where it's actually persisted to the database. So that's where the pre-save middleware runs. **Between getting the data and saving it to the database.** And so that's the perfect time to manipulate the data.

Now we actually only want to encrypt the password if the password field has actually been updated. So basically only when really the password is changed or also when it's created new. Because imagine the user is only updating the email. Then in that case we do not want to encrypt the password again. So we use if statement.  
Here in if statement, the **"this" keyword refers to the current document**, in this case the current user and then is modified. - we have a method on all documents which we can use if a certain field has been modified. In that method **(isModified)** we need to pass the name of the field. Here we want to say that if the password has not been modified, then return from the function, and call the next() function.

```js
userSchema.pre('save', async function(next){
  // Only run this function if password has changed
  if(!this.isModified('password')) return next();

  next();
})
```

Now it's finally time to actually encrypt or we can say to hash the password. We'll see the term 'hash' or 'hashing' all the time and so that basically means encryption as well.  
**Now we are gonna do this encryption, or hashing using a very well-known and well-studied and very popular hashing algorithm called bcrypt.**  

**This algorithm will first salt then hash our password in order to make it really strong to protect it against bruteforce attacks.** And so that's the whole reason why encryption needs to be really strong.  
**Salt means that it's gonna add a random string to the password so that two equal passwords do not generate the same hash.**  

*Let's no go ahead and use the bcryptjs package.*  
***npm i bcryptjs***  
*Import this in userModel.js*

In **hash method** with **current password** we need to specify a **cost parameter**. And we could actually do this in two ways. So the First way will to be manually generating the salt, so the random string basically, that is gonna be added to our password and then use that salt here in this hash function. but instead, to make it a bit easier we can also simply pass a **cost parameter** into this hash function. And so that is basically a measure of how CPU intensive this operation will be, And default value here is 10, but right now it's a bit better actually to use 12. because computers have become more and more powerful.  

Here⤵ this **hash** is basically asynchronous version, but there is also is a synchronous version. we want to use async version. So, this hash will then return a promise and that promise we need to await.  
With this we encrypt our password and now in the end, what we need to do is to basically delete the confirm password, because at this point in time we only the real password hashed. **To delete any field we set to undefined.**

**We required the confirm password but here we want to delete? how it's possible?**  
Because we actually set password confirm, that simply means that **it's a required input, not that it's required to actually be persisted to the database.**

```js
const bcrypt = require('bcryptjs');
userSchema.pre('save', async function(next){

  // Only run this function if password has changed
  if(!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
})
```

Let's test!! And indeed, we get very weird looking password which indeed is the encrypted version of pass12345, And also we see passwordConfirm is no longer here.

Also We created two documents with same password, but encrypted passwords are very different. this is a power of salting the password.

---

## `How_Authentication_with_JWT_Works`

Next up, we're gonna implement user authentication and authorization. So in simple terms, the whole work flow of logging users in and allowing them to interact with certain protected resources that not-logged in users cannot access.

Now there are many authentication methods out there, but the one we're gonna use is a very modern, simple and secure approach called **Json Web Tokens or JWT in short**.  
So, **Json Web Tokens are a stateless solution for authentication.** So there is no need to store any session state on the server which of course is perfect for RESTful APIs like the one we're building.  
And the most widely used alternative to authentication with JWT is to just store the user's log-in state on the server using sessions. But that of course does not follows the principle that says that RESTful APIs should be stateless and that's way we're opting for a solution like JWTs.

Let's now take a look at how authentication actually works with JSON Web Tokens. And assuming we already have a registered user in our database, this is how a user logs into the app. So the user's client starts by making a post request with the username and email and the password. The application then can checks if the user exists and if the password is correct. And if so, a unique Json Web Token for only that user is created using a secret string that is stored on a server. And a JWT itself is really just a string that looks something like this. eyj3hbGci0iJIUzIiNiTsIiNig3hjh.j9.eyj1pzc1i6ijv.., look PDF slide. [But we're gonna talk more about the JWT itself in the next slide].  
Anyway, the server then sends that JWT back to the client which will store it either in a cookie or in local storage. And just like this the user is authenticated and basically logged into our application without leaving any state on the server. So the server does in fact not know which users are actually logged in. But of course, the user knows that he's logged in because he has a valid Json Web Token which is a bit like a passport to access protected parts of the application.

A user is logged in as soon as he get back his unique valid Json Web Token which is not saved anywhere on the server. And so this process is therefore completely stateless. Then each time a user wants to access a protected route like his user profile data, for example he sends his Json Web Token along with a request. So it's a bit like showing his passport to get access to that route. And that's probably the best and easiest way to understand this whole idea.

Now once the request hits the server, our app will then verify if the Json Web Token is actually valid. So if the user is really who he says he is. And more about how this step works a bit later.  
If the token is valid then the request data will be sent to the client and if not, then there will be an error telling the user that he's not allowed to access that resource. And as long as the user is logged in, this is how it's gonna work each time that he request data from any protected route.  
Now what's very important to note here that all this communication must happen over HTTPS. So secure encrypted HTTP, in order to prevent that anyone can get access to password or Json Web Tokens. Only then we have a really secure system.

**Let's now dive a little bit deeper into how the JWT itself actually works.**  
A Json Web Token looks like eyj3hbGci0iJIUzIiNiTsIiNig3hjh.j9.eyj1pzc1i6ijv.., which was taken from the JWT debugger at **jwt.io**.  
So, essentially, **it's an encoding string made up of three parts**. **The header**, **the payload** and **the signature**.  
**`The header`** is just some metadata about the token itself. **`The payload`** is the data that we can encode into the token, any data really that we want. These two parts are just plain text that will get encoded, but not encrypted. So anyone will be able to decode them and read them. So we cannot store any sensitive data in here. But that's not a problem at all because in the third part, so in the signature, is where things really get interesting.  
**`The signature`** is created using the header, the payload, and the secret that is saved on the server. And this whole process is then called `signing the Json Web Token`. So, the signing algorithm takes the header, the payload and the secret to create a unique signature. So only this data plus the secret can create this signature, **Then together with the header and the payload, these signature forms the JWT**, which then gets sent to the client. Once the server receives a JWT to grant access to a protected route, it needs to verify it, in order to determine if the user really is who claims to be. In other words, it will verify if no one changed the header and the payload data of the token. So this verification step will check if no third party actually altered either the header or the payload of the Json Web Token.  

**How does this verification actually work?**  
It's actually quite straight forward so once the JWT is received, the verification will take it's header and payload and together with the secret that is still saved on the server, basically create a test signature. But the original signature that was generated when the JWT was first created is still in the token. And that's the key for this verification. Because now all we have to do is to compare the test signature with the original signature. And if the test signature is the same as the original signature, then it means that the payload and the header has not been modified. Because if they had been modified, then the test signature would have to be different. Therefor in this case where there has been no alteration of the data, we can then authenticate the user.  And of course, if the two signatures are actually different, then it means that someone tampered with the data. Usually by trying to change the payload. But that third party manipulating the payload does not access to the secret, so they cannot sign the JWT. So the original signature will never correspond to the manipulated data. And therefor the verification will always fail in this case. And that's the key to making this whole system work. It's the magic that makes JWT so simple also extremely powerful.

---

## `Signing_up_Users`

Previously, we already implemented a simple signup functionality, but in this lecture, we'll actually also log in the user, making a more real signup process. So starting from this lecture, we'll really start to implement our authentication.

_**Before start One warning here!!!**_  
**Authentication** is very hard to get right and many tutorials out of there that makes many serous mistakes and oversimplify things that should not be simplified.  Really worked hard to make this authentication section that we're gonna start implementing now as good as possible, because we need to be really really extra careful when writing this part of the application.  
Remember our user's data is at stake here, and the trust in the company who runs the application is at stake as well, so implementing authentication, is a real responsibility where we should not make any mistakes at all. Now There are some libraries out there that can help us to implement authentication and authorization and the most well known one is called _**Passport**_, but even a library like that doesn't take all the work and all the responsibility away from us. In this case here we are actually gonna implement the whole login protecting and authorization logic all by ourselves, except Json Web Token implementation.

We already have our signup function, right now all it does is to simply create a new user and then send it back to the client. There is a very serious security flaw in this way of signing up users, so basically the problem is that right now, we create a new user using all the data that is coming in with the body. So, the problem here is that, like this anyone can specify the role as an admin.  
Basically everyone can now simply register as an admin into our app. We need to fix that. And fixing it, is quite simple.

```js
// const newUser = await User.create(req.body);
// Instead of this line ⬆ of code in signup function, we use this ⬇:
const newUser = await User.create({
  name: req.body.name,
  email: req.body.email,
  password: req.body.password,
  passwordConfirm: req.body.passwordConfirm,
})
```

**What actually a difference here in both codes?**  
In new code we only allow the data that we actually need to be put into the new user, so just the name, email, and password. So now even if a user tries to manually input a role, we'll not store that into the new user and same for other stuff, like a photo.  
And if we need to add a new administrator to our system we can then very simply create a new user normally and then go into MongoDB compass and basically edit that role in there. Of course we could also define a special route for just creating admins.

Usually we signup for any web application, then we also get automatically logged in. So let's very quickly implement that here. Logged the user in as soon as he signed up. ALL WE NEED TO DO IS TO SIGN JASON WEB TOKEN AND THEN SEND IT BACK TO THE USER. Lets now first of all install npm package that we're gonna use for everything related to json web token  
***npm i jsonwebtoken***  

***Lets see its documentation of jwt at github.***  

The first function that we're gonna use with JWT here is jwt.sign() function, in order to create a new token, for that we need the payload, secretOrPrivateKey, and then some options. And we also us jwt.verify() to verify the user.

`CODE ⤵`  

import jwt in authController.js file.  
Then create our token in signup function.  
**REMEMBER:** **In jwt.sign() function the first parameter is payload**, this is basically an object for all the data that we're going to store inside of the token, In this case we really only want the id of the user. jwt.sign({id: newUser._id}), this is the object/payload that we want to put in our jwt.  
NEXT UP  we need the **secret in jwt.sign() function**, so basically a sting for our secret. Now we just putting a kind of placeholder, because actually our configuration file is a perfect place to store this kind of secret data, let's go ahead and add that in _config.env_ file.  
*JWT_SECRET=my-ultra-secure-and-ultra-long-long-secret*  

Using the standard HSA 256 encryption for the signature, the secret should at least be 32 characters long, but the longer that better. So for the best encryption of the signature, **we should at least use 32 characters**. **ALWAYS USE A UNIQUE SECRET FOR APPLICATIONS AND NEVER THE SAME**.  
AT THIS POINT WE HAVE THE PAYLOAD AND WE HAVE THE SECRET, the token header will actually created automatically, Now we pass in some options, And the option we gonna pass in is **when the jwt should expire**, so this means that after the time that we're gonna pass in here, the Json Web Token is no longer gonna be valid, even if it otherwise would be correctly verified. So, this is basically for logging out a user after a certain period of time. So let's actually define that expiration time also as a configuration variable in config.env file.  

JWT_EXPIRES_IN=90d  // the signing algorithm will automatically figure out this here d means days, 90days. we can also use 10h, 5m, 3s etc. also we can put any number which will then be treated as milliseconds. So after 90 days the jwt will no longer be valid, even if the signature is correct and everything is valid. THESE OPTIONS WE ALWAYS PASSED THEM IN AN OBJECT.  

So by this we just created the token, now all we need to do is to send it to the client. So we just put in the res.json({}) before the user. then that's actually it. That's really all we need to do to log in a new user, because right now we're not checking if any password is correct or if the user actually exists in the database because here in this case, the user was really just created. And so right away we logged the user into the application by sending a token, and the user should then in some ways store that token, just so we talked about before in previous lecture.

```js
const jwt = require('jsonwebtoken');
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // Creating Token
  const token = jwt.sign({id:newUser._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});
```

Yeah we just created very first json web token, which is looking like this:  
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NDE1NDJlMjBlMDgyNTFkMDJiMTI4ZSIsImlhdCI6MTY5ODc4MDIwOCwiZXhwIjoxNzA2NTU2MjA4fQ.LokTvV7EPIxszSW6ZsdvJMnoakg1O67Vw33O7A9kTA8

Now we want to see the JWT debugger, Lets go ahead an copy the token from response(postman). and then go to gwt.io, and in down in Encoded past our token.  
We now able to log in only the user in signed up. because in that case, we do not need to verify the email in the database and also not the password.

---

## `Logging_in_Users`

We're gonna implement the functionality of logging users in based on a given password and email address. And just like before, the concept of logging a user in basically means to sign a Json Web Token and send it back to the client. But in this case we only issue the token in case that the user actually exists and that the password is correct. let's start implement that.

`CODE ⤵`

Fist we need to read email and password from the body.  

**And the check process has a couple of steps:**

1. **Check if email and password exist**  

    ```js
    if(!email || !password){
      return next(new AppError('Please provide email and password!', 400));
    }
    ```

    Then we want to send an error message to the client? How we do that? We use here our appError. we simply create a new error. Error handling middleware will then pick it up and send that error back to the client. First import that error from AppError class. We need to call next middleware. and here we pass in the error

    To check we need implement the routes. Let's do that in the user router.

    ```js
    router.post('/login', authController.login);
    ```

    Again this is only valid for a post request, because of course we want to send in the login credentials in the body.

2. **Check if the user exists && password is correct**  
    Now check if there actually is a user for the email that was posted. Now we find by it's email. we filter by email.  
    **Here something important for security**, The password in encrypted actually but still it not a good practice to leak the password data out to the client. If we had getAllUsers here, then all of then would have the password visible. To fix this go into the User Schema and on the password field, _**add a property select: false,**_ then it will never show up in any output.  
    _**Go to User's schema and add: select: false, to the password field.**_  
    _**const user = User.findOne({ email })**_ - Now output of this also not contain the password, but we need a password to check, if the password is correct. So here we need to explicitly select the password here.  
    Remember select will simply select a couple of fields from the database, only the ones that we needed. In this case, **when we want the field, that is by default not selected, We need to use plus and then the name of the field.**  

    ```js
    const user = User.findOne({email}).select('+password');
    ```

    NOW ITS TIME TO COMPARE THE PASSWORD THAT IN THE DATABASE WITH THE ONE THAT USER JUST POSTED.  
    **How we gonna do that, because the user inputted password is simple text, like this: Hello12334 but the one  that we'be in the document is encrypted(hashed) look like this: 23jdkfja93480983490jkajfkdjjadlfj**  
    All we've to do is to again use the bcrypt package. We used bcrypt to generate this hashed password of inputted password, Remember encrypted there is no way of getting back to the original password. So, let's implement a function that's gonna do encrypt password. We'll do that in user model, because it's really related to the data itself.

    So here first time we gonna create an instance method. So, an instance method is basically a method that's gonna be available on all the documents of a certain collection. **In instance methods the this keyword actually points to the current document.** In this case, since we have the password set select: false, so this.password will not be available. so that's why we passed in userPassword as well in the function. So the goal of this function is to really only return true or false, so basically true if the passwords are the same, and false if not.  
    We gonna use compare function, only need to candidatePassword(given password) and userPassword(actual db password) in it.  

    ```js
    // In user mode. check for password // instance method
    userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
      return await bcrypt.compare(candidatePassword, userPassword);
    };
    ```

    The compare function compares a plain-text password (candidatePassword) with a hashed password (userPassword).  
    **The function returns a promise that resolves to a boolean value:**  
    **true** if the plain-text password matches the hashed password.  
    **false** if the plain-text password does not match the hashed password.

    Now we call this function in login function in authController. And remember the function that we defined is an instanced method. And so therefor it is available on all the user documents. Here user in right now a document.  
    Remember the correctPassword is an async function so we need to await it.

3. If everything is ok? send the token to client.

    Now creating a token is gonna be the exact same thing, in all functions, so instead of repeating, leta create a function.

```js
const AppError = require('./../utils/appError');

exports.login = catchAsync(async(req, res, next) => {
  // const email = req.body.email;
  // const password = req.body.password; // Instead we use destructuring as both are email so..
  const {email, password} = req.body; // just like this we create this two variables.

// 1) Check if email and password exist
if(!email || !password){
  return next(new AppError('Please provide email and password!', 400));
}

// 2) Check if the user exists && password is correct
const user = await User.findOne({
  // email:email
  email
}).select('+password');
// const correct = await user.correctPassword(password, user.password); // either true or false

// 3) If everything is ok? send the token to client.
if(!user || !await user.correctPassword(password, user.password)){
  return next(new AppError('Incorrect email or password', 401));
}

const token = '';
res.status(200).json({
  status: 'success',
  token
})

})

// In user model. 
// Check for password // instance method
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
```

---

## `Protecting_Tour_Routes`

So far in our authentication implementation we have logged users in with a correct password. So we completed this first step of the authentication workflow, where a json web token is created and send back to the client if the user provides a correct email and password.  
So, now we'll implement protected routes. basically using the created json web token in order to give logged in users access to protected routes. And this is the second step of authentication.

So **let's say that we wanted to protect the getAllTours route.** So basically only allowing logged in users to get access to a list of all our tours. It means before running the getAllTours handler, we would need to have some check in place in order to verify if the user is logged in or not? BEST WAY OF DOING THAT IS TO USE A MIDDLEWARE FUNCTION.

So, **In order to protect routes we're gonna create a middleware function which is gonna run before each of these handlers. **This middleware function will then either return an error**, if the user is not authenticated, so it is not logged in, **Or it will call the next middleware**, which is in this case the getAllTours handler.** That then effectively protect this route from unauthorized access. Let's go ahead and quickly create that middleware function in our authController.js file.  

Start by building a function called **protect**. and call this protect function before getAllTours route handler:

```js
router.get(authController.protect, tourController.getAllTours)
```

Now let's start implementing protect middleware function.  
**`STEPS TO IMPLEMENT THIS MIDDLEWARE:`**  

1) **Getting Token and check if it's there.**
2) **Verification the token**: the jwt algorithm verifies if the signature is valid or if it not? So there for if the token is valid or not?
3) **Check if user still Exist** -The user who trying to access the route still exist.
4) **Check if user changed password after the jwt(token) was issued.**

***IF THERE IS NO PROBLEM IN ANY OF THESE STEPS, ONLY THEN CALL THE NEXT, WHICH WILL THEN GET ACCESS TO THE ROUTE THAT WE PROTECTED.***  

`LET'S NOW START IMPLEMENT`

### `STEP#01: Getting Token and Check if it's there`

So a common practice to send a token using an HTTP header with the request. Let's take a look to the HTTP request headers.

```js
console.log(req.headers); 
// Here we get an object with all of the headers that are part of the request.
```

Now to send a Json Web Token as a Header, there is a standard for doing that. **And so that standard for sending a token is that should always use a header called authorization and then the value of that header should always start with 'Bearer', Basically we bear/we have/ we posses this token. and then the value of the token.** So, in **key Authorization** and as a **value Bearer kjdkjfakljd**, So, basically the string after the Bearer will be our value.  
So, if there is authorization in header and the value of authorization start with Bearer then we want to save the token.  
To get the last value after Bearer we first split the value with space. which will then create an array with Bearer and token, then from the array we take that second element of the array.

Working. But it's not enough to just send a token with a request, it also need to be a valid token. So basically a token where no one try to change the payload. **REMEMBER THE PAYLOAD IN THIS CASE IS ALWAYS THE USER _ID OF THE USER FOR WHICH THE TOKEN WAS ISSUED.**

```js
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if ( req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
```

### `STEP#02 Verification the token`

So in the last lecture, we read the token from the authorization header and then checked if the token actually exists. And next up, we have the verification step for the token. In this step we verify if someone manipulated the data or also if the token has already expired. So, we already used from the json web token package, the sign function **and now we're gonna use the verify function.**  
So, just like before, _**jwt.verify(token, process.env.JWT_SECRET )**_ , in verify function we pass the token, and then remember that this step also need the secret, in order to create the test signature. And as a third argument, this function actually requires a callback function. So this callback is then gonna run as soon as the verification has been completed. This jwt.verify is an asynchronous function.

Here we are actually going to promisifying this function, basically to make it return a promise. Thats the way we can then use async/await just like any other function. To build that node actually has a builtin promisify function. In order to use that we've to require built-in utils module.  

***const util = require('util');***  

From this util module we'll use promisify method. Since we only going to use this method. we can do it by destructure that object and take promisify method directly from there.  

```JS
const util = require('util');
cons {promisify} = require('util');
```

Now we just call promisify and then pass the function in there. and await it and store the result into the variable, So that resolved value of the promise will actually be the decoded data, so the decoded payload from this json web token. Here we're using promisify function to convert the callback-based jwt.verify function into a promise-based function  

```JS
const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
console.log(decoded); 
```

Here⤴ we have decoded object, the user id, timestamp of creation date, and of the expiration date of the token. Now let's try to manipulate the payload of this token. Here we changed some character from token and then try to access getAllRoutes, then we get an error, **the error name is Json Web Token, and in message we have an 'invalid signature'.**

So that is the one of the two errors that can occur, **the other one is that the 'token has already expired'.** invalid signature error is called json web token error, and actually let's go ahead and handle this error now. and the way we could do it to add a try-catch block. But instead of doing that we actually use our global-handling middleware in order to do that. Go ahead let implement in errorController.js file.  

```js
if(error.name=== 'JsonWebTokenError') error = handleJWTError(error) 
// .. Implemented in errorController.js file.
```

Another that may we can get is that the user tries to access tha application with an already expired token. name is 'TokenExpiredError'. and message is 'jwt expired'. ALSO SEE IN ERROR CONTROLLER.JS FILE

### `STEP#03 Check if User still Exist`

We could actually stop here now if we wanted. But this is not really secure enough just yet. for example what if the user has deleted in tht meantime? So the token will still exist, but if the user is no longer existent, then we actually don't want to log him in. Or even worse, what if the user has actually changed his password after the token has been issued? then that should also not work. there are king of stuff we're gonna implement in step#3&4.

Fist will check if the user still exist.

```js
User.findById(decoded.id); 
```

Now we've the id in the payload, because we can now use that id and query the user using just that id. User.findById(decoded.id); this should then find the new user. and of course we need to await that and then store it into a variable. At this point we 100% correct, because if we reached this point, then the verification process that we have previously was successful, otherwise this would have caused an error which would then have prevented the function from continuing. So this verification process is in charge of verification if no one altered the id that's in the payload of this token. So we then 100% sure for which we have issued the jwt is exactly the one whose id is now inside of the decoded payload. so this one

```js
 // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
```

### `STEP#04 Check if User changed password after JWT was issued`

**To implement this test we will actually create another instance method.** So basically a method that is going to be available on all the documents. **So documents are instances of a model.** Because this code belongs to the user model not the controller.

```js
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};
```

**we built changedPasswordAfter function and will passed the jwt timestamp, so basically the timestamp which says when the token was issued.** By default we'll return false from this method. that means the user has not changed his password after the token was issued. **Remember in instance method the this will always points the current document.** Ans so here we've access to the properties. Now we actually need to create a field in our schema for the date where the password has been changed. Add this in schema:
passwordChangedAt: Date // this passwordChangedAt property will be change when someone change the password.  
call this instance method in protect function as step 4  

```js
 const changedTimestamp = this.passwordChangedAt.getTime(); 
 // to convert passwordChangedAt to a timestamp so that we can compare.
```

One is in seconds and one is in milliseconds. so we need to divide the changedTimeStamp by 1000, so :

```js
const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10); 
// also we parsed into the number with based 10 number.
return JWTTimestamp < changedTimestamp; // this means password not changed.
```

Lastly we put the entire user data on the request.

```js
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
```

***This is a very sophisticated and very complete route-protecting algorithm. We could use any of our application.***

---

## `Advanced_Postman_Setup`

In postman the first concept that we're gonna see that is the concept of environment. At this point we haven't create any environment.  
Basically an environment is like a context where our app is running. We can then specify a couple of variables of each of these environment. And the two ones that make the most sense is just as we've in our express application, the development and the production environment. let's add our first environment. we create an environment called 'Dev:Natours' and created a variable, called URL, because that's the most important thing that we want to change from one environment to the other. So, in development, we'll have one url, and then in production we will have another one. set the variable URL to <http://127.0.0.1:3000/> And one environment for production.

{{URL}}api/v1/tours  
HERE URL is a variable. that we just created.

Automate the coping the token and pasting it into the Bearer header, For that we've to write a little bit of code. Do that in sign up and login, because these are the places, from which we'll receive a json web token.  
In signup and login endpoints come to the test tab. Here we'll programmatically set an environmental variable. We'll create an environmental variable for the json web token that we receive in the request. Basically all we need to do is to use this snippets that we have (right side) in test tap. just click on set an environment variable option. here we get pre-written some java script code.  
pm.environment.set("variable_key", "variable_value");  
we set the variable called jwt and the value would be in pm.response.json().token. here token is the name of the property in the response object.  
pm.environment.set("jwt", pm.response.json().token); // This code will get the response on there read the token property and then assign it to the jwt environment variable. Here we saved the token into an environment variable.  
Now go to any protected route, here we should have an authorization tab. here we have lot of options as a type of authorization, we'll choose the Bearer Token. and then we will specify our variable in double curly braces: {{jwt}}  

`JUST SEE LECTURE # 132 -NOT WRITING HERE.`

---

## `Authorization__User_Roles_and_Permission`

We've implemented authentication in our project up until this point. However simply authenticating(logging a user in), is not enough. So in this lecture we're gonna implement authorization as well. So, imagine the act of deleting a tour from our database, So not every user should, of course be allowed to do that, even if the user is logged in. So, we basically need to authorization only certain types of users to perform certain actions. So that's exactly what authorization is.  
**It's verifying if a certain user has the right to interact with a certain resource.**  
With authorization we basically check if a certain user is allowed to access a certain resource even if he is logged in. this is a very common scenario that should be implemented in each and every web application.

So, we're gonna build another middleware function to restrict certain routes to certain user roles. for example for deleting tours. This means were gonna build another middleware function.  
So we'll add another middleware function in deleteTour middleware stack. We always user .protect function first because we first check if the user is logged in or not? then we add another middleware called authController.restrictTo.

Into this .restrictTo function we'll the pass some user roles which will be authorized to interact with this resources. Here we allow only admin to delete tours. Lets quickly add role field in user model.

'user', 'guide', 'lead-guide', 'admin', These user roles will be specific to the application's domain. We have always different roles depending on the type of application that we writing.

```js
role: {
  type: String,
  enum: ['user', 'guide', 'lead-guide', 'admin', ''],
}
```

```js
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );
```

We will now make it(restrictTo function) so that it can take multiple arguments. So we want to the admin to be able to delete tours, but also lead-guide. So the admin and the lead-guid can delete tours. Let's now go ahead and implement this function in authController file

**How we implement this?** Because usually we cannot pass arguments into a middleware function. but in this case we really want to. We want to pass in the roles, who are allowed to access the resource. **So we need a way of basically passing in arguments into the middleware function...**  
**Well, in here we'll actually create like a wrapper function, which will then return the middleware function that we actually want to create. As we passing arbitrary number of arguments, so here we use rest parameter syntax. This will then create an array of all the arguments that were specified.**  

**So we're creating this function and right away we'll then return a new function, and this returning function will be the middleware function. So this returning function will then get access to the roles parameter, because of closure.**  

**When we'll give a user access to a certain route?** Basically when `user` role is inside of roles array that we passed in. let's say we've the normal user so it will not be in any array, because here only one string. role='user',  
roles ['admin', 'lead-guide'], role='user'

```js
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

// Calling this function on delete route
.delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );
```

If the roles array does not include the role of the current user, then we do not give permission to that user. And where is the role of current user stored? In above function(protect middleware) we stored the current user in request.user. Remember this protect middleware always runs before restrictTo.  
If it's not include then we create an error. otherwise we simply call next, next is route handler itself. THAT'S IT  
`403 means forbidden`

---

## `Password_Reset_Functionality__Reset_Token`

In this lecture and next one we're going to implement a user-friendly password reset functionality, which is kind of standard in most web applications. Usually it works like this: We've to provide an email and and will get an email with a link, where we can click and then that's gonna take us to a page where we can put a new password. This is a very standard procedure.  

Basically there are two steps, **The first one is that the user sends a post request to a forgot password route, only with his email address.** This will then create a reset token and send that to the email address that was provided. Just a simple random token, not a json web token, **then in the second part, which is gonna be the next lecture, the user then sends that token from his email along with a new password in order to update his password.**  
So basically we'll have exports.forgotPassword

Also implement this two routes, in userRoutes file.

```js
router.post('/forgotPassword', authController.resetPassword); 
// Which will only receives the email address

router.post('/resetPassword', authController.forgotPassword); 
// Which will receive the token as well as the new password.
```

**Let's specify the steps here:**

1) **Get user, based on POSTed email**  
    Here we use findOne not findById because we don't know id and user. So we specify the email address. this is only piece of data that is known, then verify, if the user does exist.  

    ```js
    exports.forgotPassword = catchAsync(async (req, res, next) => {
      // 1) Get user based on POSTed email
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return next(new AppError('There is no user with email address.', 404));
      }
    })

    ```

2) **Generate the random reset token**  
    Lets now generate a random token. For that once more we are gonna create an instant method on the user. Because once more, this really has to do with the user data itself. In userModel file.  
    The password reset token should be a random string, but at the same time, it doesn't need to be as cryptographically strong as the password hash that we created before. So we can use the very simple random bytes function from the built-in crypto module.  
    Add that built-in crypto module.  

    ```js
    const crypto = require('crypto');
    ```

    Lets then generate our token.  

    ```js
    const resetToken = crypto.randomBytes();
    // In this function we need to specify number of character and then we will convert it into hexadecimal string.
    ```

    SEE createPasswordResetToken func in userModel.  

    ```js
    userSchema.methods.createPasswordResetToken = function() {
      const resetToken = crypto.randomBytes(32).toString('hex');

      this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      console.log({ resetToken }, this.passwordResetToken);

      this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

      return resetToken;
    };
    ```

    **Why we're actually creating this token?**  
    Basically this token is what we're gonna send to the user and so it's like a reset password really that the user can then use to create a new real password. And of course only the user will have access to this token. So in fact, it is really behaves kind of password. So essentially it's just a password, it means that if a hacker can get access to our database, then that gonna allow the hacker to gain access to the account by setting a new password. If we would just simply store this reset token in our database, then if some attacker gains access to the database, they could then use that token and create a new password using that token. So just like a password we should never store a plain reset token in the database. So let's encrypt it. We gonna use built-in crypto module.  
    Now we gonna create a new field in our database schema to store resetToken. then we can compare it with the token that the user provides.  

    ```js
    passwordResetToken: String,
    passwordResetExpires: Date,
    // For security measure this reset should expire after a certain amount of times.
    ```

    Then also want to return the plain test token, because that's actually the one that we're gonna send through the email.  

    we need to send via a email, the unencrypted reset token because otherwise it wouldn't make much sense to encrypt it at all. So it the token that was in the database was the exact same that we could use to actually change the password, well then that wouldn't be any encryption at all. So we send one token via email and then we have the encrypted version in our database. And that encrypted one is then basically useless to change the password. So it's just like we're saving only encrypted password itself to the database.

    We just modify the data but not really update the document, we did not save it.  So we really just modify it.  Now we need to save it.  

    ```js
    await user.save() // error here, 
    // that is because we're trying to save a document but we do not specify all of the mandatory data, the fields that we marked as required. let quickly fix that.
    ```

    All we need to do is to actually pass a special option into this user.save method. then this property will deactivate all the validators that we specified in our schema.

    ```js
    await user.save({validateBeforeSave: false  })
    ```

    ```js
    exports.forgotPassword = catchAsync(async (req, res, next) => {
      // 1) Get user based on POSTed email
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return next(new AppError('There is no user with email address.', 404));
      }

      // 2) Generate the random reset token
      const resetToken = user.createPasswordResetToken();
      await user.save({ validateBeforeSave: false });
    });
    ```

    `Next Lecture`  
3) **Send it back to user's email**

`Sending Emails with Nodemailer`  

We need to now send the password rest token via email to the user. In this lecture we learn how to send email using a very popular solution called **Nodemailer**.  
Let's now create an email handler function, that we can then use throughout our application. In utils folder, email.js file.

let's now install nodemailer, which we're gonna use to send email using node.js. So,  
***npm i nodemailer***  
require it in email.js file.

Now we're creating that function and in there we're gonna pass in some options basically like email address, the subject line, the email content, etc.  

`We need to follow three steps in order to send emails wit nodemailer.`

1) **We need to create a transporter**
    A transporter is basically a service that will actually send the email, because it's not node.js that will actually sends the email itself. It's just the service that we define in here. something like gmail, Now gmail is not actually the service that we're gonna use, but just quickly to show how it works with gmail, because many people interested in this.  
    Here we need to always create a transporter that's always the same no matter which service we're gonna use.  

    ```js
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // to use gmail service
    });
    ```

    And here in createTransport function we need some options, just like we did below. There are couple of well known services that nodemailer know how to deal with, so we don't have to configure these manually, gmail is one of them, but also there is Yahoo, Hotmail, and many others.  
    we also need to specify auth property for authentication, in there we need the user and the password. Just like before we save that kind of stuff in our config.env file.  

    ```env
    EMAIL_USERNAME=your-gmail
    EMAIL_PASSWORD=your-password
    ```

    Tis is the configuration for the transport in Nodemailer.

    Then in our Gmail account we will actually have to activate something called the less secure app option.  
    Activate in gmail "less secure app" option.  
    **The reason why we're not using Gmail in this application** is because gmail is not all a good idea for a production app. Using gmail we can only send 500 emails per day and also we will probably very quickly be marked as a spammer and from there it will only go downhill. So unless it's like a private app, we just send emails to ourselves or like 10 peoples, well then we should use another service. And some well-know one are SendGrid and Mailgun, And actually we'll use sendGrid a bit later in this course.  

    Right now we use a special development service, which basically fakes to send emails to real addresses. But in reality these emails end up trapped in a development inbox, so that we can then take a look at how they will look later in production, that service is called mailtrap, So let's not signup for that.  
    <https://mailtrap.io/>  
    Basically with this service we can fake to send emails to clients, but these emails will then never reach these clients and instead be trapped in our mailtrap. so that way we cannot accidentally send some development emails to all of our clients.  

    On mailtrap first created an inbox called natours, and here we see our host, port, username, password, auth and tls. And so that is what we're gonna specify in our transport in nodemailer now. Let's copy the username and password and put in config.env file.

    ```env
    EMAIL_USERNAME=93e334c4bd7523
    EMAIL_PASSWORD=ca9fccacf38d24
    EMAIL_HOST=sandbox.smtp.mailtrap.io
    EMAIL_PORT=25
    ```

    We also need to specify the host, that's because mailtrap is not one of these predefined services that comes with nodemailer. And also port

    As we're using mailtrap so instead of service:'Gmail' we put host and port, We specify here because mailtrap is not one of these predefined services that comes with nodemailer.  
    MOVE TO STEP#2

2) **We need to define the email options**  
    Defining some options for our email. const mailOptions = {};  
    We could of course write step 2 and 3 in same place, but we don't. As an option we specify where the email is coming form. the name and the email address.  
    form : 'Muhammad Ahmad' <ugv@gmail.com>,  
    Next up we need a recipient address, to: options.email, Basically coming as an argument of this function.
    Then same as to subject and text.  
    We can also specify html property, so we could then convert this message to html. we'll do later, now not specify html property.  

    ```js
    // email.js file
    const nodemailer = require('nodemailer');

    const sendEmail = async options => {
      // 1) Create a transporter
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      // 2) Define the email options
      const mailOptions = {
        from: 'Muhammad Ahmad <muhammadugv66.io>',
        to: options.email,
        subject: options.subject,
        text: options.message
        // html:
      };

      // 3) Actually send the email
      await transporter.sendMail(mailOptions);
    };

    module.exports = sendEmail;

    ```

3) **Actually send the email with nodemailer**.  
    Now at the end, on transporter object we can call sendMail method(mailOptions), into that we need to pass in our mail options.  
    _transporter.sendMail(mailOptions);_  
    Now this'll return a promise, this is an async function. So let's use async await.  

    Now simply export it form this module, and import in authController file and  
    const sendEmail = require('./..utils/email');

**Lets start by defining the reset url**, Ideally when the usr click on this email and will then be able to do the request from there. And that work later when we implement our dynamic website. but still here we want to create this url here.  

The resetPassword will take the token as a parameter. And also it's not get, not post but it's patch, because the result of this will be modification of the password property in the user document.  

let's built the our reset url.  
`restURL = '${req.protocol://${req.get('host')}/api/v1/users/resetPassword${resetToken}'`

create a message and Finally send the email. and remember send email is an async function so, therefor we need to await it here. Remember this takes an object with sme options.  

```js
await sendEmail({
  email: user.email, // we can also say req.body.email that's same to user.email.
});
```

We await that that also want to send some responses.

```js
res.status(200).json({
    status: 'success',
    message: 'Token sent to email!',
  }); // we cannot send message here, because then everyone could just reset anyone's password, that's way to sent over email.
```

Now there might happen an error using this sendEmil function, and so in that case, we want to error message to the client. But in this case, we actually need to do more than simply send an error message. We need to basically, send back the password reset token and the password reset expired that we defined, We'll add try catch block here. If there is an error, we want to reset both the token and expires property.

```js

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});
```

---

## `Password_Reset_Functionality__Setting_New_Password`

Here we actually set the new password for the user.  
Just like before let's start by defining the steps that we're gonna take for this resetPassword flow.

1) **Get user based on the token**  
    Remember from the last video that the reset token that is actually sent the url is this non encrypted token.

    ```js
    {
      resetToken: 'b91a5c4473a877c3b529f3eaf65362963007d4dca04ee96670ba6f5950f96b8f'
    } 
    // 574d2eeab84d93e6205459c7c4ec2324a6a33e2cc1afde4edc286b137c06d5ad First one that're in an object.
    ```

    And the one thats in the database is the encrypted one.  
    So, now we need to do, is basically encrypt the original token again, so that we can compare it with the one that is stored in the database-encrypted one.

    Here we want to hash the token that is coming through the url which's remember req.params.token. And then finally we need to digest('hex');  
    These are exact same as we did before in encrypted original one. So, we could refactor this into it's onw function. but not now  
    Now let's actually get the user based on this token, Because that is the only thing that we know about the usr right now. This token is the only thing that can identify the user.  So, we can now query the database for this token -find the user which has this token.  

    ```js
    const user = await User.findOne({ passwordResetToken: hashedToken });
    ```

    But right now, we're not taking the token expiration data into consideration. Ans so how could we do that?  
    Well, basically what we want is to check if the passwordResetExpires property is greater than right now.  Because it the expires date is greater than now, it means it's in the future, which in turn means, that it hasn't yet expired. And so, there's a very easy way in which we can actually do this right with this query.

    ```js
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Data.now() },
    }); 
    ```

    So, here⤴ we check passwordResetExpires with actual current time/date, is it's greater then now. Data.now() will actually be a timestamp of right now, but behind the scenes, mongodb will then convert everything to the same, and therefore be able to compare them accurately.  

    With this we can, at the same time, find the user for the token and also check if the token has not yet expired.  NOW STEP 2

2) **If token has not expired, and there is a user. in this case set the new password**  
    We want to send an error if there is no user, or basically, if the token has expired. That in this case is same, because if the token has expired, then it will simply not return any user.  
    And there is no error, if next is not called then, let's set the password.

    ```js
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    ```

    That's because we send the password and confirmPassword vie a body.  
    And also let delete the reset token and the expired.

    ```js
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    ```  

    And again of course, we now need to save it, because this only modifies the document, it doesn't update.  

    ```js
    await user.save();
    ```

    In this case we actually don't need to turn off the validators, because indeed we want to validate.  
    **`REMEMBER:`** **We always use save instead of update for everything related to passwords and to the user, because we always wants to run all the validators and above all, the save middleware functions.**

    NOW GO 4TH STEP, skipped 3 for at the end.

3) Update changedPasswordAt property of the current user  
    let's quickly go back to the user model, where we're gonna do that using middleware.  

    ```js
    userSchema.pre('save', function (next) {});
    ```

    This function here, is gonna run right before a new document is actually saved. So it's a perfect place the specifying this property.  
    **When exactly do we actually want to set the passwordChangedAt property to right now?**  
    Well, we only wanted it when we actually modified the password property. In isModified method we put the name of the property.  

    ```js
    if (!this.isModified('password')) return next();
    ```

    So, if we didn't modify the password property then of course do not manipulate the passwordChangedAt property.  
    **BUT WHAT ABOUT CREATING NEW DOCUMENT?**  
    Well, when we create a new document, then we did actually modify the password, and then we would set the passwordChangedAt property. In the current implementation we actually would. But there is something else that we can use here. Basically we want to exit this middleware function right away, if the password has not been modified or if the document is new, and so we can use this.isNew property as well.  

    ```js
    userSchema.pre('save', function (next) {
      if (!this.isModified('password') || this.isNew) return next();
    });
    ```

    if these conditions are false. then we'll change passwordChangedAt property.  

    ```js
    this.passwordChangedAt = Date.now();
    ```

    This should work just fine, but actually in practice sometimes a small problem happens. And that problem is that sometimes saving to the database is a bit slower than issuing the json web token, making it so that the changed password timestamp is sometime set a bit after the json web token has been created. That then will make it so that the user will not be able to log in using the new token. Because the whole reason this timestamp actually exists, is so that we can compare it with timestamp on json web token.  
    We just need to fix this by subtracting one second  

    ```js
    this.passwordChangedAt = Date.now() -1;
    ```

    That will then put the passwordChangedAt one second in the past.
    Code:

    ```js
    userSchema.pre('save', function(next) {
      if (!this.isModified('password') || this.isNew) return next();

      this.passwordChangedAt = Date.now() - 1000;
      next();
    });
    ```

4) **Log the user in. In other words Send the jwt(token) to the user.**  

```js
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });


  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user ⤵
  // 4) Log the user in. Send the jwt to the user.
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});


// 3 Update changedPasswordAt property of the current user. (userModel.js)
// In User Model File
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1;
  next();
});
```

---

## `Updating_the_Current_User__Password`

Over the few lectures, we allowed a user to reset his password and create a new one, but now we also want to allow a logged-in user to simply update his password without having to forget it, and so without that whole reset precess. So, let's build that now.  
Just like before let's do that in authentication controller.  

Remember that this password updating functionality is only for logged-in users, but still we need the user to pass in his current password, so in order to confirm that user actually is who he says he is.. just for security measure. Let's layout steps to implement this functionality just like before.

1) **Get user from the collection**  
    As always we create a new user variable and in there we await the result of doing User.findById()  
    **Where is this id is coming from?** well, remember that this updatePassword is only for authenticated, so for logged in user, and so there for at this point we'll already have the current user on our request object. Remember that coming from the 'protect' middleware. So,  

    ```js
    const user = await.findById(req.user.id)
    ```

    And then we need to explicitly ask for the password, because it's by default not included in the output. We need the password to compare it with the one that stored in the database. For that we use pre defined instant method 'correctPassword', which is available on the documents.  

2) **Check if POSTed current password is correct**  
    Here we want to create an error if the current password is not correct.  

    ```js
    if(!user.correctPassword()){}, 

    ```

    Here we pass **candidate password**, that one is gonna be in the body, **req.body.passwordCurrent**, And then as a second argument the **actual password**, that's on **user.password**. And remember correctPassword is an async function, so we need to await here.  

3) **If so, update the password**  
    If the password is correct, well then we can actually update the password.  

    ```js
    user.password = req.body.password;
      user.passwordConfirm = req.body.passwordConfirm;
      await user.save();
    ```

    Here on save we want validation, so this time we do not turn off the validation.  
    **Why we didn't do like this user.findByIdUpdate, ...., ?** It's for two reasons.

    1. **The validations that we defined in Schema will not gonna work**, that's because in we write return el === this.password; so this.password is not defined when we update. Because internally, behind the scenes, mongoose does not really keep the current object in memory, so this.password not gonna work.
    2. **And also the pre('save', ...) middlewares are not going to work.** So, if we used simply update for updating the password, then that password would not be encrypted.

4) **Loge in the user with with new password**, to send json web token.  
Logged the user in and sent the token back to the client.  

```js
const token = signToken(user._id);
res.status(200).json({
  status: 'success',
  token,
});
```

This is 4th time we writing the same code so, refactor it. Now this actually is not the same everywhere. let's make a function in general.  
Here we need as argument the user, where the id is stored, statusCode, and response object in order to actually be able to send a response.  

Finally to  make this work we actually need to implement the route in userRouter.

We'll do a patch because we are manipulating the user document, and so that's what patch for.  
As it'll work only logged in user so we need authController.protect, which'll also put the user object on a request object.

```js
router.patch(
  'updateMyPassword',
  authController.protect,
  authController.updatePassword
);
```

To test we need to pass three password in body. 1- current pass 2- new-pass 3- new-pasConf

**`updatePassword Function`***

```js

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from the collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }


  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});

```

**`createSendToken Function`**

```js
// Refactored function for create and send token to the user
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

```

---

## `Updating_the_current_User__Data`

In this lecture, we'll allow the currently logged in user to manipulate his data, Now by implementing user updates, we're really leaving the domain of authentication and moving more into real user related stuff.  
So instead of using the authentication controller now, let's implement this updating functionality right in the userController.

Create a new handler function called `updateMe`, because it's for updating the currently authenticated user. Later we'll implement the updateUser handler but that's then for an administrator to update all of the user data, while user itself can only update, for now at least the name and email address.  
We're actually doing updating user data in a different route than updating the user password, this is because usually in a typical web application that's always how it's done. So, we've usually one place where we update our password and another place where we can update data or account itself. so here we're just following that pattern.  
`Again let's start by laying out steps:`

1) **Create error if user POSTs password data.**  
    We'll create an error if the user tries to update the password.  
    After it, for test, create a simple response and add this route to a userRouter.

    ```js
    router.patch('/updateMe', authController.protect, userController.updateMe);  
    ```

    First we use the protect middleware, its protected route, so only the currently authenticated user can update the data of the current user. All of this for secure. Because the id of the user that is gonna be updated comes from request.user, which was set by this protect middleware, which in turn got the id from the json web token, and since no one can change the id in that json web token without knowing the secret, so the id is then safe.  
    Now it's working just fine...  

2) **Update user document**  
To update the document we could try to do it with user.save(), just like before, basically getting the user then updating the properties and then by the end saving the document.  
**But the problem with that is that there are some fields that are required which we're not updating, then because of that we will get some error.** like this:

```js
const user = await User.findById(req.user.id);
user.name = 'Muhammad';
await user.save(); // This will give us an error.
```

So, the save method is not really the correct option in this case. **Instead we can do now is  to actually use findByIdAndUpdate.**  
We could not use this before for all the reasons that we talked in previous video. Since now we're not dealing with passwords, but only with this non-sensitive data like name or email, we can now use  findByIdAndUpdate

```js
const updatedUser = User.findByIdAndUpdate(req.user.id);
```

Here in this method we need to pass not only id but also the data that should be updated, and options. so the data, let's for now call it x, and the options, that we want to pass in, new:true that it returns the new object, basically the updated object instead of the old one. Ans also runValidators: true.  

```js
const updatedUser = await User.findByIdAndUpdate(req.user.id, x,{new:true} ), 
```

So mongoose validate the data. for example for invalid email.

**Why putting x here in place of data, Why not simply request.body?**  
Well that's because we actually do not want to update everything that's in the body, because let's say the user puts in the body the role, like body.role:'admin', and so this would then allow any user to change the role, and of course that can not be allowed. Doing something like this would be a huge mistake. So we need to make sure that the object that contain the date that gonna be update, only contains name and email, because for now these are the only fields that we want to allow to update. **And so basically we want to filter the body so that in the end, it only contains name and email and nothing else.**  
What we want to do is to create a variable called filteredBody and then we're create a function, which takes the data(obj which want to filter) which is req.body,because where all the data is. and then couple of arguments, one for each of the field that we want to keep in the object, for now we want to keep 'name' and 'email' filed. and later we might add more fields here. like images.  

```js
const filteredBody = filterObj(req.body, 'name', 'email');
```

Now implement the filterObj function, which will take care of filtering the object.  
filterObj will take in an object, and the rest parameters for all the allowed fields. The rest parameters will create an array containing all of the arguments that we passed in. in this case an array containing name and email.  
Now we have to loop through the object and for each element check if it's one of the allowed fields, and if it's simply add it to a new object that we're then gonna return in the end.  
we're gonna loop through the object by Object.keys() of the object that we pass in. This is a easier way to loop through an object in javascript. and this(Object.keys(obj)) here will return an array containing all the key names of this object and then we can loop through them, using forEach(), In callback function of forEach, for each element of the array, if the allowedFields includes the current field name, if(allowedFields.includes(el)) then we want to add that to a new object.  
we created empty newObject, and all the elements that satisfies the if statement which will be added to the new object. and at the end we'll return the new object.

If the current filed is one of the allowed fields, then newObj with the field name of the current filed should be equal(assign) to whatever is in the object at the current element, so the current field name.

```js
// filterObj Function
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
```

```js
// UpdateMe Handler Function
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email'); 
  // Calling filterObj func and storing result into filteredBody

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});
```

---

## `Deleting_the_current_User`

After updating, let's now also allow the current user to delete his account.  
Now when a user decides to delete his account we actually do not delete that document from the database. But instead we actually just set the account to inactive. So that the user might some point in the future reactivate the account and also so that we still can access the account in the future even if officially, let's say it has been deleted.  
To implement this first of all we need to create a new property in our schema. so let's go there.

```js
active: {
    type: Boolean,
    default: true,
    select: false,
  },
```

we want to have a field called active, which should be a type of boolean. and default should be true and also we do not want to show in the output, because we basically want to hide this implementation detail from the user.  
Now to delete the user now all we need to do is basically set that active flag to false.  

Let's create that flag to set the active flag to false.  
And again this only works for logged in users and so the user id is conveniently stored at request(req.user.id) and the data that we want to update is active:false  
Now sending back the response is also pretty easy. we use the 204 code for deleted, which will then make it so that actually in postman we do not even see this response. and we don't send any data back in case of delete.  
And not of course add it also to all routes here.  
we use the delete http method, and keep in mind we'll not actually delete a user from the database. But as longer as the user is no longer accessible anywhere then it's till okay to use delete http method here.  
Lets check for now,  and it's a protected route so we need to be signed in and so lets create our authorization header bearer token in postman and that's actually it, we don't need to pass any data in the body, and any data in the url. Because the only data that is needed is the current user id and that one is in coded inside of our adjacent web token, in auth header. Yeah the active field is changed.

```js
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

```

Now as a last step, we do not want to show up the inactive users in this output.  
**How do we could implement this?**  
Well we're gonna use something that is way back tha we talked about, which is query middleware. So query middleware is perfect for this because now we can basically add a step before any other query that we're doing then somewhere in our application. So, let's go to our user model, and that middleware.

Something that will happen before a query and that query will be a find. Then a regular function because remember that otherwise we're not having access to the this keyword or at least it won't have the value that we expect it to have.  
And Remember that here we actually used a regular expression before, basically to say that we want this middleware function to apply to every query that starts with find, not just find but also stuff like findAndUpdate...  
And so we use a regular expression looking for words or strings that start with find. `/^find/`  
**Remember this is query middleware, so therefore 'this' keyword points to the current query**  
**How this work?** Lets say we want getAllUsers for that we use find query, and now before that query is actually executed we want to add something to it. Which is that we only want to find documents which have the active property set to true. THAT'S EASY  
Fnd only documents that have active set to true. _this.find({ active: true });_ that's it, we're done. let's test with getAllUsers method. But we got nothing in response, while we had two filed where we've not specify the active to false. so they should be in response. **BUT WHY?** I guess that's because the other ones they do not have explicitly the active property set to true. So let's do what we actually did in the other section, where we say that active should not be false.  So all documents which has active not equal to false.

```js
// this.find({ active: true }); 
// Instead of this⤴ use this⤵
this.find({active: { $ne: false },});
```

```js
// Query middleware for get all the users except inactive users
userSchema.pre(/^find/, function(next) {
  // this.find({ active: true });  // not working

  // 'this' points to current query
  this.find({ active: { $ne: false } });
  next();
});
```

---

## `Security_Best_Practices`

Everything that we did in this section so far was to secure our application and user's data as good as possible. And we talked about a lot of things we can do to achieve that. But all of this information was kind of spread out all over these lectures.  
So this is a quick summary with many best practices that we already implemented and that we're still gonna implement in the rest of this section, because security is so extremely important but unfortunately, many courses don't address it enough. Here is couple of things that we can do to properly secure our apps and data.
And we're gonna look at a couple of common attacks and give some suggestions to prevent them.  

First up, we have the event of a compromised database, meaning **that an attacker gained access to our database.** **To prevent we must always encrypt passwords and password reset tokens** just like we did in the lectures in this sec. This way the attacker can't at lest steal our user's passwords and also can't reset them. Now about actually preventing attacks, let's talk about the **`brute force attack`**, where the attacker basically tries to guess a password by trying  millions and millions of random passwords until they find the right one. And what we can do is to **make the login request really slow**. And the bcrypt package that  we're using actually does that. **Another strategy is to implement rate limiting**, which limits the number of requests coming from one single IP. and this one we're gonna implement in one of the next videos. **Also a nice strategy is to actually implement a maximum number of login attempts for each user**. for example we could make it so that after 10 failed attempts, user would have to wait one hour until he can try again.  
We're not gonna implement this functionality in this section but please feel free to experiment with it on your own.  

Next up, there is the **cross-site scripting(XSS) attack**, where the attacker tries to inject scripts into our page to run his malicious code. On the client's side, this especially dangerous because it allow the attacker to read the local storage, which is the reason why we should never ever store the json web token in local storage. **Instead, it should be stored in an HTTPOnly cookies**, that makes it so that the browser can  only receive and send the cookie but cannot access or modify it in any way. And so, that then makes it impossible for any attacker to steal the json web token that is stored in the cookie. W're implementing this is a second.  
Now on the backend side, in order to prevent XSS attacks, we should sanitize user input data and set some special http headers, which make these attacks a bit more difficult to happen, and express doesn't come with these best practices, so we're gonna use middleware to set all of these special headers.

Next we have **Denial-Of-Service(DOS) attacks.** It happens when the attacker sends so many requests to a server that it breaks down and the application becomes unavailable. Implementing rate limiting is a good solution for this. Also we should limit the amount of data that can be sent in a body in a post or a patch request. And also we should avoid using so-called evil regular expressions to be in our code, these are just regular expressions that take an exponential time to run for not-matching inputs and they can be exploited to bring our entire application down.

Next up, we've the **NoSQL query injection attack.** Query injection happens when an attacker, instead of inputting valid data, injects some query in order to create query expressions that're gonna translate to true. for example we logged in even without providing a valid username or password. It's a bit complex and we should definitely google it to lean more. But for now what we need to know is that using mongoose is actually a pretty good strategy for preventing these kind of attacks. Because a good schema forces each value to have a well-defined datatype. However, it's always a good idea to still sanitize input data, we'll take care of that a bit later.

Now finish we just have a couple of best practices and suggestions on how to improve the authentication and authorization mechanisms that we implemented.

***`SEE PDF FILE`***

---

## `Sending_JWT_via_Cookie`

Se we learned in the last lecture that the json web token should be stored in a secure http-only cookie. But right now, we're only sending the token as a simple string in our JSON response.  
So, in this video, let's also send the token as a cookie, so that the browser can then save it in this more secure way.  
**Where do we actually send the token to the client?** well remember that's in the authController in createSendToken function.  

### `What is Cookies?`

First of all, **A cookie is basically just a small piece of text that a server can send to clients. Then when the client receives a cookie, it'll automatically store it and then automatically sent it back along with all future requests to the same server.** A browser automatically stores a cookie that it receives and sends it back in all future requests to that server where it came from. For not this is not gonna be really important for us as we're only testing the API using postman. But a bit later, when we're gonna render dynamic webpages and really interact with the browser, then it'll become really important that the browser send back the token basically automatically in each request.  
**Anyway let's now learn how to create and send a cookie.**  
In order to send a cookie, it's actually very easy. all we have to do is to basically attach it to the response object, in createSendToken function.

*res.cookie* and then we have to do is to specify the name of the cookie, we're calling here jwt, and then the data that we actually want to send in the cookies, that's of course gonna be the token variable. and then after that a couple of options for the cookie. The fist option we're gonna specify is the expires property. basically this expires property will make it so that the browser or client in general, will delete the cookie after it has expired. so we set the expiration date similar to the one that we set in the json web token. let's create a new variable for that in config.env file.

```env
JWT_COOKIE_EXPIRES_IN=90
```

Because the json web token package can then work with this format 90d. HERE WE specify 90 without d, so that now we can make actually operations with it. because we'll need to convert it to milliseconds.

**When should this cookie expire?** Well it should expire at a new date(), so in javascript, when specifying dates, we always need to say new Date(), and then it should expire at right now, plus 90 days, which stored in env file. and then we need to convert that into milliseconds.  
The next options is gonna be the **secure option we set to true**, and so like this, the cookie will only be sent on an encrypted connection, so basically we're only using https.  
And then finally it's that **httpOnly option set to true**. and so this will make it so that the cookie cannot be accessed or modified in any way be the browser. **All the browser is gonna do is to when we set httpOnly to true is to basically receive the cookie, store it, and then send it automatically along with every request.**

```js
res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 *1000
    ),
    secure: true,
    httpOnly: true,
  });
```

So this is actually how we define the cookie. and we sends it using res.cookie. Now if we wanted to test this right now, it wouldn't work because right now we're actually not using https. Because of this secure true the cookie would not be created and not be sent to the client. So we only want to activate this part(secure:true) in production.  
Here we gonna to is to exports this entire object of options into a separate variable.

```js
const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  ),
  // secure: true,
  httpOnly: true,
};

if (process.env.NODE_ENV === 'production') {
  cookieOptions.secure = true;
}
res.cookie('jwt', token, cookieOptions);

// Remove the Password from output
user.password = undefined;
```

**`Whole code of createSendToken Function`**

```js
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};
```

Let's now actually test this. Yeah it's working. we've one cookie here.  
Now just one last thing that we actually want to change here is to basically get rid to password in the output. "password": "$2a$12$HSso5U2cKdlwgVkBQqBx0e3Agznjg.xztnbi6B8xX5FjvZAjKCAOG",  
In our schema we actually set select false, so that it doesn't show up when we query for all the users. But in this case it comes from creating a new document and so that's different and so that's why we see it in res. We can actually very easily fix this.  
All we need to do is to actually set _user.password = undefined._ in createSendToken function

---

## `Implementing_Rate_Limiting`

**In this lecture let's implement rete limiting in order to prevent the same IP from making too many requests to our API, and that will then help us preventing attacks, like denial of service, or brute force attacks.**  
So that rete limiter will implemented as a global middleware function. So basically what the rate limiter is gonna do, is to count the number of requests coming from one IP and then, when there are too many requests, block these requests.  
And so it make sense to implement that in a global middleware, so we do that in app.js.  
And the rate limiter that we're going to use is an npm package called **`Express Rate Limit`**. Let's install it.  
***npm i express-rate-limit*** and then in app.js file require it.  

```js
const rateLimit = require('express-rate-limit');
```

We start by creating a limiter, by calling the rateLimit function, that we just defined up by requiring express-rate-limit  
rateLimit is a function which receives an objects of options, in this objects we can define how many requests per IP, we're going to allow in a certain amount of time. We can specify the max property which we gonna set to 100 (max:100). and then also the window, so the time window (windowMs: 60\*60\*1000), we allow user here to 100 requests per hour. WindowMs in the milliseconds, as we want one hour so 60\*60\*1000MS = 1hour.  
If the limit is then crossed by a certain IP, they will get back an error message. we can specify that message(message: '')  
This limiter is basically a middleware function. Which we now can use by using app.use() just like we did before.  
app.use(limiter); We can do it just like this but we actually want to basically limit access to our /api route. We basically want to apply this limiter only to /api , so that will then effect all of the routes that stat with /api,

```js
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
```

---

## `Setting_Security_http_Headers`

In this lecture we're gonna use yet another NPM package in order to set a couple of really important security http headers. So to set this headers we'll yet again use a middleware function, which will come again from an npm package.  
let's install that and it's called **`helmet`**. this is kind of standard in express development, so everyone who's building an express app should always use this helmet package. Because express doesn't use all these security best practices out of the box . Again in app.js file.  

***npm i helmet***

Here all we need to do is call helmet here, and so that will then produce the middleware function that should be put right here. In app.use() we always need a function, not a function call. app.use(helmet()); this's not correct.  
It's best practice to use helmet package early in the middleware stack. so that these headers are really sure to be set. So don't put it somewhere at the end, but right in the beginning.  
let's put it in the beginning as the first of all middlewares.  
We're really growing our middleware stack here, let's give each of them a name:  

let's take a look at helmet documentation on github

```js
const helmet = require('helmet');
app.use(helmet());
```

That's it, we have to install, require and use it

---

NOT RELATED TO THIS LECTURE:  
Body Parser, reading data from body into req.body

let's implement that, we can limit the amount of data that comes in the body.

```js
app.use(express.json());
```

Here in json we can actually specify some options and for that as always we pass in an object.  
limit:10kb, Package will understand, it will parse this string('10kb') here into meaningful data. And so now when we have a body larger than 10 kilobyte, it will basically not be accepted.  

```js
app.use(express.json({ limit: '10kb' }));
```

---

## `Data_Sanitization`

In this lecture we're going to use two more packages to improve our application security, and this time to perform data sanitization.  
so, **Data Sanitization basically means to clean all the data that comes into the application from malicious code. So code that is trying to attack our application.**  
In this case, we're trying to defend against two attacks.

1) Data Sanitization against NoSQL query injection
2) Data sanitization against XSS(Cross-Site Scripting) attacks.

We will do that in app.js file right after the body parser middleware. The body parser middleware will read the data into request.body and only after that we can actually clean that data. So after body parser is the perfect place for doing data sanitization.

Now before doing anything else, let see why it's extremely important  to defend against this type(NoSQL query injection) of attacks.  
So lets now head over to postman and try to login as someone, even without knowing their email address. So basically simply giving a password, we'll be able to login but even without knowing the email address. We're going to do that by simulating a NoSQL query injection, and the easiest way of doing it like this:  In body of request.

```json
{
  "email": {"gt":""}
  "password": "12345678"
} 
```

Instead of specifying a real email, we specify this query, we use mongodb greater then operator and set it to nothing. And know try to login.  
Yes by simply doing this we logged in as the admin. WOW, so without knowing the email, with only the password we're able to login. this will work because this expression{"gt":""} is true.  
So, this kind of attack is what we need to protect against.

So, to protect ourselves against this let's install another middleware.  
***npm i express-mongo-sanitize***

Let's also install the other one that we're going to need in this lecture
***npm i xss-clean***

let's talk about NoSQL quey injection again.

1) **Data Sanitization against NoSQL query injection**  
    require express-mongo-sanitize and also xss-clean.  

    ```js
    const mongoSanitize = require('express-mongo-sanitize');
    const xss = require('xss-clean');
    ```

    mongoSanitize is a function that we will call, which will then return a middleware function, which will we can then use.  

    ```js
    app.use(mongoSanitize());
    ```

    And this enough to prevent us against the kind of attack that we just saw before.  
    So what this middleware does is to look at the request body, the request query string, and also at request.params, then it will basically filter out all of the dollar signs and dots, because that's how MongoDB operators are written. By removing that these operator are then no longer going to work.  
    Now test same thing again, that we did before, login without email. YEAH GOT AN ERROR  
    That fixes the first problem, now let's use that other middleware that we also just required.

2) **Data sanitization against XSS(Cross-Site Scripting) attacks**

```js
app.use(xss());
```

This will then clean any use input from malicious html code. Imagine that an attacker would try to inset some malicious html code with some javascript code attached to it. If that would then later be injected into our html site, it could really create some damage then. So using this middleware we prevent that by converting all these html symbols.  
Now the Mongoose validation itself is actually already a very good protection against XSS, because it won't really allow any crazy stuff to go into our database as long as we use it correctly. So, whenever we can, just add some validation to mongoose schemas and that should mostly protect us from cross-site scripting, at least on the server side.  
THAT'S ALL  
REMEMBER, that the validator function library that we used before also has a couple of cool sanitization functions in it. We could also manually build some middleware using these....

---

## `Preventing_Parameter_Pollutions`

Now we're gonna be preventing parameter pollution, using yet another NPM package.  
But before installing that package, let's go ahead and take a look at the error. Before that let's head over to postman and see why we actually need to prevent parameter pollution in the first place.  

Let's say we want to get all tours, sorted with duration and also sorted with price. And it doesn't actually make much sense right? because we're prepared to only have one sort parameter. **{{URL}}api/v1/tours?sort=duration&sort=price**  
**Let's see what we actually get with this parameters?** We get an error, saying that this.querystring.sort.split is not a function. in sort method, where it's trying to split the sort property which we expect to be a string, But right now since we defined it(sort) twice, express will actually create an array with these two values, duration and price. split only works on string.  
So this is a typical problem. So, Basically we're now going to use a middleware which will simply remove these duplicate fields. let's install it.  
It's called **`HPP`** which stands for **HTTP Parameter Pollution**  
***npm i hpp***

let's quickly require it in app.js file.

This is yet another very simple one. All we need to do is app.use(hpp()) and then call hpp. And this one again should be used in the end, because what it does is to clear up the query string.  

```js
app.use(hpp())
```

let's test... Yeah it's only sorting with last one. in this case with price.  
So, that's kind of fixed but we actually want some duplicate properties or fields in some cases. For example we might want to search for tours with the duration of nine and five.  
{{URL}}api/v1/tours?duration=5&duration=9 // here we have durations with only 9.  
So, we have to fix this. If we comment out app.use(hpp()) then we will get duration with both 5 and 9.  
So what we can do in order to be able to use the middleware but still get this(with both 5, 9) result, we can white list some parameters.  
**So for that into this hpp() function we can pass some objects and then in there, specify the white list.whitelist property is simply an array of properties for which we actually allow duplicates in the query string.**

```js
app.use(
  hpp({
    whitelist: ['duration'],
  })
);
```

yeah, working. now we should also specify some other fields in our white list, because for example we want to search for ratingsAverage, ratingsQuantity, so lets just add them to our white list.

```js
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
```

It might seem a bit weird to basically manually put all the field names here, and later we might hve to do same thing for the other resources. and that will then make this whitelist even bigger. And of course we could do some complex stuff in order to get these field names from the model itself, but once more we just want to keep it simple here.

`END OF SECTION`

---
