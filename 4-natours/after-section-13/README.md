# `ADVANCED FEATURES_ PAYMENTS, EMAIL, FILE UPLOADS`

In this one we will make our website in API even better by implementing advanced features like uploads, image processing, sending emails, and even accepting credit payments using the very popular Stripe service.

## `Table of Contents`

1. [Image_Uploading_using_Multer](#image_uploading_using_multer)
2. [Configuring_Multer](#configuring_multer)
3. [Saving_image_name_to_database](#saving_image_name_to_database)
4. [Resizing_Images](#resizing_images)
5. [Adding_Image_Uploads_to_Form](#adding_image_uploads_to_form)
6. [Uploading_Multiple_Images](#uploading_multiple_images)
7. [Processing_Multiple_Images](#processing_multiple_images)
8. [Building_a_Complex_Email_Handler](#building_a_complex_email_handler)

## `Image_Uploading_using_Multer`

In the first part of this section we'll be learning all about uploading images with the ``Multer` package and this particular lecture we will start implementing image uploads for user photos.  
Now we're gonna be working on uploading user photos and let's open up the userRoutes.  
**'Multer' is a very popular middleware to handle multi-part form data, which is a form en-coding that's used to upload files from a form.** So remember how in the last section we used a url encoded form in order to update user data and for that we also had to include a special middleware.  
And so Multer is basically a middleware for multi-part form data. And now here in userRoutes what we're gonna do is, we'll allow the user to upload a photo on the /updateMe route and so instead of just being able to update email and name, users will then also be able to upload their user photos. So once more let's start by installing the package that we need.  
***npm i multer***  
*lets include that in userRoutes file const multer = require('multer');*  
And now we need to configure a so-called Multer upload and then use it.  

let's do that right at the beginning and let's call it upload and we call the multer function that we just included, and the pass in an object, for some options. Now the only option that we're gonna specify here is the destination property and we're gonna set it to 'public/img/users So {dest : 'public/img/users'} that is exactly the folder where we want to save all the images that are being uploaded.  
And of course we can configure this in a much more complex way and we're gonna be doing in a next lecture. And by the way, we could actually just have called the multer function without any options in there, and then the upload image would simply be stored in memory and not saved anywhere to disk, but of course at this point that's not what we want, and so we at least need to specify this destination option. And with this our file is then really uploaded into directory in our file system.  
And REMEMBER that images are not directly uploaded into the database, we just upload them into our file system and then in the database we put the link basically to that image. so in this case in each user document we will have tha name of the uploaded file.
Any way what we need to now is to use this upload variable here to really create a middleware function that we can put in the /updateMe route. And it works like this, upload.single('photo'), and it's single because we only want to upload one single image and here in single func we pass the name of the field that's going to hold the image to upload, and that will be photo, and with field means the field in the form that is going to be uploading the image.

```js
router.patch('/updateMe', upload.single('photo'), userController.updateMe);
```

* QUICK CONCLUSION:
We included the Multer package and then with that we created an upload.  And this upload is just to define a couple of settings, where in this example we only define the destination, then we use that upload to create a new middleware that we can then all to this stack of the route that we want to use to upload the file, so to the /updateMe route, so for that we say upload.single('photo'); here we specify the name of the field that's going to hold this file. And so this middleware will then take care of taking the file and basically copying it to the destination that we specified, And the after that of course it will call the next middleware in the stack which is updateMe. Also this middleware(upload.single()) will put the file, or at least some information about the file on the request object and so let's actually take a look at that.

```js
const multer = require('multer');
const upload = multer({ dest: 'public/img/users' });
router.patch('/updateMe', upload.single('photo'), userController.updateMe);
```

So let's go to the /updateMe handler, and right in the beginning let's say console.log(req.file), and also req.body. let's test it. Now we test it in postman. Here in postman instead of sending the photo property in raw from body tab, like we did for changing name or email, we put the photo property in form-data. Because this is the way how we can send multi-part form data. so as we want to change name and photo so we put name and photo property in form-data tab. For image instead of text we choose type file. and then as a value we can select the image that we want to upload. choose the image and send the request.  We get all kind of information about the file. so the originalname, encoding, mimetype, destinating, path, size etc these are came from req.file, like this:

```js
{
  fieldname: 'photo',
  originalname: 'leo.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: 'public/img/users',
  filename: '505ff273301314941a016bc0b2051e48',
  path: 'public\\img\\users\\505ff273301314941a016bc0b2051e48',
  size: 207078
}
```

And remember in console we also specified req.body. Now here in body there only the name of the image. So our body parser is not really able to handle files and so that's way the file is not showing up in the body at all, and that is the whole reason why we actually need the multer package.  
Lets now take a look at our folder, and so here we have an image, but if we click it now we can't really see it because as we can see here in console it doesn't even have an extension. the file really showed up here in our folder that we specified as options of upload. It's working, but not where we want it, so we want to give it a better file name, and we also want to re-organize this code that we have at this point a little bit. NEXT LECTURE.  
in this console the file name looking like this:  
*filename: '627c70a220023cb3cf1358ba22a376ed // here no no extension. like .png, .jpg etc*

```JS
 exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  // ------------------
  // ------------------
})
```

---

## `Configuring_Multer`

Let's now actually configure Multer to our needs. First giving images a better filename, then second allowing only image files to be uploaded onto our server.  
And to start, let's actually move all the multer-related stuff from the userRoutes(where we put in previous lec) to the userController. Right at the top of of userController file, Also cut a middleware that we put in the /updateMe, and export from the userController file. and then import it, with userController.uploadUserPhoto.

Let's now go ahead and configure our Multer upload to our needs. And so for that we're going to create **one Multer storage** and **one multer filter**. And then we're going to use that **storage** and the **filter** to then create the upload from there.  
So let's do that right here at the top of the userController.js file.  

To store we use ***multer.diskStorage()***, We could also choose to store the file in memory as a buffer, so that we could then use it later by other processes, and actually we're gonna do that a bit later, but for now we want to really store the file as it is in our file system.  
So diskStorage() will take a couple of options, and the first one is the destination, but now we cannot simply set it to this path['public/img/users'] like we did before. Now this is a bit more complex.  
So, really this destination here is a callback function with goes like this: destination: (req, res, cb) So this callback function has access to the current request, to currently uploaded file,  and also to a callback function. And this callback function is a bit like the next function in express. But we calling it cb here, which stands for callback, so that's a different name then next, because actually it doesn't come from express.  But it's similar in that we can pass errors in here, and other stuff as we will in a second.  
So now to define destination we actually need to call that callback function, and then first argument is an error if there is, and if now then just null, and the second argument is then the actual destination. So again; this all looks a bit weird and complex, so lets actually take a look at multer documentation on github.  
Now we need to set the filename property after destination. And again this is very similar callback function with a similar arguments: request, file, and callback, And then in a function, we want to give our file some unique filenames. And the way we're going to do that is to call them, user-userId-currentTimestamp, and then file extension, something like this: ***user-8394jk34jkd-34893489.jpeg***  
And with this we can basically guarantee that there won't be two images with the same filename. If we used only the userId, then of course multiple uploads by the same user would override the previous image. and if we only used user with timestamp then if two users were uploading an image at the same time, they would then get the exact same filename.  
So first of all let's actually extract the file extension from the uploaded file. How do we get that? well from the previous lecture where we logged req.file, where in console we see a property called mimetype, in this as a value we have a type of the uploaded image, and remember this req.file exactly the 'file' that  we passed in in this function. so here we have mimetype with value image/jpeg, so this is where we gonna get file extension. so:  

```js
ext = file.mimetype.split['/'](1); // so this is the extension.
```

And no just like before we need to call the callback function with no error, and then the filename that we want to specify. So for userId, since we have request so it's simple, req.user.id. this is the id of currently logged in user. then to timestamp simply Date.now(), and then the .ext for the extension.  

```js
cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
```

This is actually our Storage. And so basically a complete definition of how we want to store our files, with the destination and the filename.

```js
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split['/'](1);
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});
```

Next up, let's create a multer filter, let's call it multerFilter  
And the filter in multer is simply again a callback function, similar to ones we had before accessing the request file and the callback function.  
The goal of this function is basically to test if the uploaded file is an image, and if it is so then we pass true into the callback function, and if it's not we pass false into the callback function along with an error. Because we do not want to allow files to be uploaded that are not images. And so that's exactly what this filter is for. Now if in your own application you want to upload something else, let's say CSV files, then of course you can test for that instead of images.  

So, let's test if the uploaded file an image, for that we will once more use the mimetype because whatever image type is uploaded, so no matter it it's a jpeg, or png, or bitmap, or a tiff, or really anything the mimetype will always start with image. ***if(file.mimetype.startsWith('image'))***, if this is true then we pass in null and true in cb function. otherwise we'll then pass an error and then false, so here we will now create an appError just like we've been doing all along.  

```js
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please only images', 400), false);
  }
};
```

Great!, We have storage and filter, now it's time to actually use them in order to create the upload.  
*const upload = multer({ dest: 'public/img/users' });* Now the upload will not look like this but instead we'll pass in these variables.  
So in multer we can specify the storage property. and then the file filter.

```js
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
```

OK, and that's it. And of course we could put all of this here as an argument directly. But this looks clean and professional.

Finally we then of course, just like we did in last lecture use this upload and on that we call single with the name of the field, and then from there we create an export our middleware, which we already included on the route.  
exports.uploadUserPhoto = upload.single('photo');

Now test it from postman.

```javascript
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split['/'](1);
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');
```

Perfect all of our multer configuration are working but of course there is still one step missing, and that's actually to link the user to the newly updated image, because right now in the database we obviously still have the path or actually the name of the old image, because now here in our code we specified.

---

## `Saving_image_name_to_database`

Let's now just very quickly, save the actual name of the uploaded image to the corresponding updated user document. And doing that is actually pretty simple.  
So let's go here to the /updateMe middleware in userController, and the data that gets updated is here stored in this filteredBody object. And remember that this object here is the result of request.body leaving only the name and email. Now adding the photo to that as well is really simple. All we have to do is something like this:  
*if(req.file) filterBody.photo = req.file.filename*  
First we check if there is a request.file, then we add a photo property to the filterBody object.

```js
const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) {
    filteredBody.photo = req.file.filename;
  }
```

So all we're doing is to add the photo property to the filteredBody object, that is going to be then update in User.findByIdAndUpdate(req.user.id, filteredBody, {...}) And the photo property is equal to the filename of the photo.  
That's it let's test it. Yeah..  

And now just one small detail that we didn't talk about before. So,  
**What happens when we create a new user?** They will not have any photo in the beginning. And so let's actually change that. So for that we have a default image in users folder(default.jpg), So let's go to the user model.  
so here in the photo field, let's now define a default.  

```js
  photo: {
    type: String,
    default: 'default.jpg',
  },
```

And now let's actually go ahead and create a new user. and test it... WORKING... also update with new real photo. that's also working.

Awesome, that's really great. that really feels like a real world application now. Now what if the user actually uploads a super large image, let's say 10,000 per 10000 pixels. Or even an image that's not a square at all. In that case we need to resize the image and also format the image really to fit our needs in our application. And so that's is what we will do next...

---

## `Resizing_Images`

In this video we learn about image processing and manipulation with NodeJs, and in this particular case, we're going to resize and convert our images. So everywhere in our user interface we assume that the uploaded images are squares, so that we can then display them with 50% border radius, this only works when they are squares. But of course in the real world users are rarely going to be uploading images that are squares. So our job now is to actually resize images to moke them squares. So in userController we gonna that.  
We'll add yet another middleware before the updateMe and then that middleware will take care of the actual image processing. let's do that right after multer, because they are kind of connected.

so we defined a **resizeUserPhoto** middleware, and before we continue let's actually add this middleware to the middleware stack in this route(/updateMe), so that's in userRoutes. and then right after the photo has been uploaded we add..  
And so at this point we already have the file on our request, at least if there was an upload, and if there was no upload then of course we don't want to do anything that means we want to go to the next middleware directly. so if statement...  
Otherwise we want to do image resizing. And for that we are going to use the sharp package. So, first of all let's install it.  
***npm i sharp***  

And require that in userController file. Sharp is a really nice and easy to use image processing library for nodeJs. And there's fairly a lot of stuff that we can do with it. But where it really shines is for resizing images in a very simple way. And so, that's exactly what we're looking for here. so let's use it.  
We say sharp, and then we basically need to pass in the file. Now when doing image processing like this right after uploading a file then it's always best to not even save the file to the disk, but instead save it to memory. so for that we need to change a little bit our multer configuration, actually just the multer storage, because now we no longer need any of this(multerStorage).  

And instead multerStorage will be simply multer.memoryStorage(), ***const multerStorage = multer.memoryStorage();***  
So as I mentioned earlier this way the image will then be stored as a buffer, and that buffer is then available at request.file.buffer.  
So this is way more efficient, instead of having to write the file to the disk and here read it again. We simply keep the image basically in memory and then here we can read that.  
Anyway, calling the sharp function like this: sharp(req.file.buffer) will then create an object on which we can chain multiple methods in order to do our image processing. So the first one that we're going to do is resize() and then here we can specify the width and the height, and so let's say 500 and 500,  so remember we want square images so height needs to be same as width. Now this will then crop the image so that it covers this entire 500 \* 500 square. And actually we can change this default behavior if we wanted to. And so let's again take a quick look at the documentation. <https://sharp.pixelplumbing.com/>  
We could pass as a third parameter options object, where we could then define the fit. we could also define the position, see doc. In this case what we have is enough. So, let's move on to the next step.  
Because what we want to do next is is actually convert the images always to jpeg. and for that we use toFormat('jpeg').  
We can also then define the quality of the this jpeg, so basically to compress it a little bit. so that it doesn't take up so much space, and so for that we use the jpeg method and set an option, in this object with quality with 90%;  
Now we're almost done, but not entirely. Because now in the end, we then finally want to write it to a file on our disk. And for that we can use toFile(), now this method here is actually needs the entire path to the file. So basically public/images/users and then file name, and the filename format we want same as we did in previous lecture, like user-userId-currentTimestamp-extension. So we save it in the request.file.filename, first. Now why we are saving it on req.file.filename =  user-${req.user.id}-${Date.now()}.${ext}; Well,it's because right now this filename is not defined. So when we decide to save the image into memory so as a buffer, the file name will not really get set, but we really need that file name in our other middleware functions. like in updateMe we use req.file.filename to update into database. Here we can get rid of ${ext} so extension, because we already know that it will always be a jpeg, so we simple put jpeg. there is no need to get the file extension. And that's actually it.  
All we need to do now to finish is to then actually call the next middleware in the stack.

*NOW TEST THAT. PERFECT...*

### `Difference in disk and memory?`

Disk storage typically refers to non-volatile, persistent storage devices like hard disk drives (HDDs) or solid-state drives (SSDs).  
Memory, specifically RAM (Random Access Memory), is a type of volatile, temporary storage that is used by the computer's processor to store data that is actively being used or processed. - ChatGPT]  

#### `Changed previous one`

```javascript
const multerStorage = multer.memoryStorage();

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({
      quality: 90,
    })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};
```

### `QUICK RECAP`

We created a new middleware function that's going to be running right after the photo is uploaded. And that upload is now actually happening to a buffer and no longer directly to the file system so that's why we use memoryStorage();, But of curse this multer filter is still working, and so we can still only upload images, And so in resizeUserPhoto middleware  we put the image's filename on req.file.filename, so that we can then use it in the updateMe route handler. and then we've the actual image processing itself. where we first resized it to a square, then formatted to jpeg, with the quality of 90%, and finally we then write that file into our filesystem to the exact same folder that we specified before. So this is how it works when we need some image processing, but we do not need processing then of course we can keep using directly on disk that we commented in this lec, this⤵:

```js
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split['/'](1);
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});
```

---

## `Adding_Image_Uploads_to_Form`

So let's now allow users to uploads their photos right on our website. So when we click on 'choose new photo', we basically want to open a new window for which we can select a new image to upload and then when we click the 'save settings' button and submit a form then we want to upload that image into our backend and update the user.  
And so the first step to doing that will be to add a new input element to our html, basically to our pug template, which will then allow that file selector to open when we click. So let's go to account.pug file.  
Right now we have a a-tag, but of course it's not a link that we're going to use, so we need:  
***input(type:'file', accept='image/\*'),*** we can then specify which kind of file we actually accept. we can do something like that **accept='image/\*'** so for image with all formats. so mimetype starting with image, also give the id and name fields. Here we put name as photo, because that's the name that we have in our user document, and it's also the field name that multer is expecting. And then we also specify the label for it.

```pug
input.form__upload(type='file', accept='image/*', id='photo', name='photo')
label(for='photo') Choose new photo
```

Now just like before, there are two possible ways of sending this data to the server. First without the API as we did, where we define the action that we want to take and also the method, and with that the data then directly sent to the server. Now If we wanted to send the file using this method we then would need  to specify another option here. and that is the ***enctype='multipart/form-date'***, So here again we have this multi-part, so as we said before multipart is always for sending files to the server. And again we actually need the multer middleware to handle this multipart form data, And actually the name multer comes form multipart, Anyway if we wanted to send the data without an API, we would always have to specify enctype, otherwise the form would simply ignore the file and not sent.  
But we're actually using it with the API, so we do not need to specify the enctype, but we will kind of have to do it programmatically. And so let's actually do that. so lets now send our data, including photo by doing api call. open index.js from public/js folder.

Here actually we're selecting the data from the form and then passing them into updateSettings to upload in database. But now remember how I said that we kind of needed to programmatically recreate a multipart form data. And so we need to do it like this. ***const form = new FormData();***, Now onto this form we need to keep appending new data, basically one append for each of the data that we want to send. and so form.append() and the first one is the name and then the value of that name. so form.  

```js
const form = new FormData();

form.append('name', document.getElementById('name').value)
form.append('email', document.getElementById('email').value);
```

And then into updateSettings we need to pass the form. And our ajax call using axios will then actually recognize this form as an object and will work just the same as it did before. This is equivalent to what we had before with name and email, but now of course let's also add the photo which is the entire reason why we now have to do it like this.  
***form.append('photo', document.getElementById('photo'))*** This is same, but now here this not .value, but instead .files And these files are actually an array and so since there's only one, we need to select that first element from the array.  
***form.append('photo', document.getElementById('photo').files[0]);***  
But in a nutshell we basically recreate this multipart form data.
TEST AND WORKING.

```js
// UPDATED ONE
if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);

    updateSettings(form, 'data');
  });
}
```

---

## `Uploading_Multiple_Images`

So now, that the user photo upload feature is completed, Let's now learn how to upload multiple files at the same time and also how to process multiple images at a time. And so in this lecture and the next one we're going to be uploading and processing tour picture.  
And to start let's actually remember what kind of images we want for our tours and also how many, so let's take a look to our tourModel. so we have imageCover(1-img) and then images which is an array of strings(3-images).  

Now the way we're going to upload these images and process these is going to be very similar. LET'S GO TO TOUR-CONTROLLER

Just like before we'll store the images in memory. And also we only allow images to pass our multerFilter, And then we create our upload in the exact same way as before.  
After all these, Now, let's actually create the middleware out of this upload. And now here comes the different part, so something that going to be different to what we did in userController, because there we had upload.single() that was because we only had one single filed with a file that we wanted to upload, that was photo field.  
**But now we actually have multiple files and in one of them we have one image and in the other one we have three images.  So how can we do that?**  
Well, we're going to use upload.fields(), and so multer is actually perfectly capable of handling this kind of situations. So here we pass in an array and each of the element is an object where we then specify the field name. The first one is imageCover, then maxCount is 1, so that means that we can only have one field called imageCover which is then going to be processed. And then the other field in our tourModel is images, and here maxCount is 3. And in case we didn't have the imageCover, instead if that only had one field which accepts multiple images or multiple files at the same time, we could have done it like this: ***upload.array('images', 3)***  
***So when there's one image then upload.single('image'), and when there is multiple with the same name, then it's upload.array('images', 3), And when there is a mixed of them then upload.fields(\[{},{}]) with array, and as an element an object for each field.***  
Now let's just recreate a body request from postman similar to what we specified here in upload.field(), so basically similar to what our multer upload expects, so one image cover and three images. Now we're not going to send this request that we created in postman, because we don't have any logic implemented to handler it at this point. we are not uploading into our file system, but only saving it to memory.

And so just to quickly take a look at them lets actually crete our next middleware here, which is going to be the one to process these images.  
And in case we have multiple files then they will be on req.files not just file.
Now in order to test, all we need to do is to actually add these two new middlewares to the route handler. so in tourRoutes, and just like with the users, to keep is simple here we will only allow uploading images on a tourUpdate.  
Now test the request that we created. Of course it's not really going to do anything, it's not going to be saving these images anywhere also not updating the database, but for now we just want to see the result in the console.  
So here in console we have imageCover, assigned an array which contains an object as an elements and that element contains fieldname, originalname, encoding, mimetype,  then the buffer, and the buffer is the representation of the image in memory. Now what's important here to note, is that actually even the imageCover is an array, so when we gonna retrieve the image from the imageCover we then will have use the first element of the array.  
And then images here is also an array, and for each of image we have an object as an array element with properties just we had in imageCover.  
Now all we need to do is to create resizeTourImage middleware, here these images will then be processed and also save to disk. NEXT LECTURE

```js

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = (req, res, next) => {
  console.log(req.files);
  next();
};

```

## `Processing_Multiple_Images`

Before we start there is actually something that we need to fix in the userController, in resizeUserPhoto that's that we actually need to await this whole operation of sharp, so await sharp(req.file.buffer).resize... all of these here will return a promise, that make sense becaus all of these operations here they take some times and so of course they happen in the background. Now the problem here is that right now we are calling the next() function after that, without actually awaiting the sharp operations finish, and that that's not a good idea. So await it and then catchAsync...

And now we're actually going to do something with our tour images.

Now just as before, in case there are no images uploaded, then we want to move straight to the next middleware. And here we gonna take it one step further, by requiring that there is both the imageCover and images, basically we want to move to the next middleware in case there is no request.files.imageCover Or..

Let's start by processing coverImage. So where do we actually get the coverImage.
well, remember, how I said, that it's at request.files.imageCover[0]
then, we want to resize it with 2:3 ratio, and the width will be 2000px, and the height 1333px. That's is nice 3:2 ratio which is very common in images.  
Next we also want to format it s a jpeg with 90% quality. And then save it as a file. But this time is public/image/tours, and here let's actually define our filename separately, because we're actually going to need it again. Here for id we use req.params.id, remember this route always contains the id of the tour.  
And now as a one last step, we actually need to make it possible that our updateTour handler then picks up this image cover filename to update it in the current tour document. Here to update we're using updateOne factory function. and that one will actually simply update all of the data that's in the body onto the new document. And so now the secret is to actually put this imageCover file on the request.body, So, req.body.imageCover = imageCoverFilename; here we could small refactor by putting req.body.imageCoven when defining the filename, like this:  
***req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;***  
Great now before moving on to the other images, let's actually test it with what we already have at this point.   Yes it's working for imageCover.  

Now images are also an array, which then contain all of other new file uploads. So, let's now use a loop to process each of them in one iteration. We use forEach and then in our callback function we get access to the current file.

Here we need to create the current filename, because here we want to name as image with 1 -> 2 then 3. So in our callback function we also get access to the current index.  
Next up comes the processing step itself, which is again very similar to previous ones.  
And now why do we actually need this filename, well because we need to push this filename into request.body.images, Remember in our tourModel req.body.images is an array. And now we need to create that array, so start with empty array. req.body.images = []; And then in each iteration, we will then push the current filename to this array. req.body.images.push(filename);  
And with this we're almost done. There is just one small problem, which is the fact that we're actually not using async await correctly here in this case, so in this loop. This async await here is only inside of the callback function of the forEach loop, and that will actually not stop the code from moving right next to the next() middleware. So right now we're actually not awaiting any of these sharp, because this async/await happens inside of the callback function one of these loop methods. And we run into this kind of problem actually before. But there is fortunately a solution for this. Because since this(callback of forEach) is an async function here It will return a promise. So if we do a map we can actually save an array of all of these promises. And then if we have an array we can use promise.all to await all of them. And so with that we will them actually await until all this code(all these image processing) is done. And only then move on to the next line, which is calling the next middleware. Let's now use promise.all, We will not save an array which is returned by map function in to variable, instead we'll use simple promise.all on entire.  
READY TO TEST, yes working...

```js
exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) {
    return next();
  }

  // 1) Cover Image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({
      quality: 90,
    })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({
          quality: 90,
        })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );
  console.log(req.body);
  next();
});

```

### `QUICK RECAP: 30/11/2023 [2:23 AM]`

So, we created a multer upload using the memory storage and this filter only for images, then we created the uploadTourImages middleware by using upload.fields, which takes in one image cover and three images, and then on the request it will put the files property. Then in our next middleware we resize these images and first the cover image, then the remaining three images. **What really point to noted is to how we put the image filename on request.body, and we do that so that in the next middleware,** which is the actual route handler, it will then put that data onto the new document when it upload it. so we do that with the imageCover, and we also do that with the remaining images by pushing it into body images, which as know from our tour schema expects an array of strings and so in this case, filenames. So about these other images, we had them on request.files.images, so it's an array, and so of course we loop through it using map method. And we use map so that we can basically save the three promises which are the result of that three async function in map method, so we can then await all of them here using Promise.all(), And only after that we then move on to the actual tour update handler, and this part is really important. So it's important that we only move on to the next middleware as soon as this part here(all codes in map method) is completed, because otherwise req.body.images will  be empty, and of course our filenames are then not gonna be saved to the current tour document.

---

## `Building_a_Complex_Email_Handler`

With the file upload part is finished, let's now turn our attention to sending emails. And we actually already sent email before for the password reset. But in the next couple of lectures we're gonna take that to a whole new level. And what we're gonna do is to build email templates with pug and sending real emails using the SendGrid service.
And now in this first lecture we're gonna build a more robust email handler then one that we had before. So, let's open up our utilities folder, and here we already have email.js, But right now what we have here is just a very simple email sending handler, which is not able to take in a lot of options. And so now we're going to build a much more robust solution here.
/*
So what I'm gonna do is to create a class, that class is gonna be called email, also we are exporting this class from this file. And then as always, a class needs a constructor function, which is basically the function that is gonna be running when a new object is created through this class.
Now let's actually take a look at how we would use this class in practice. And so the idea, basically whenever we want to send a new email, is to import this email class and then use it like this:
new Email(user, url).sendWelcome(), So creating a new email, and then into it we want to pass in a user, and this user will contain the email address, and also the name in case we want to personalize the email, and also the URL, And a good example  for this one is for example the reset url for resetting the password. So, a new email object, and then on there we want to call the method that is actually going to send the email, let's say sendWelcome, and so that one is gonna be sent whenever a new user signup for our application. We will then also have send password reset. And the way we will set all this up will make it really easy to then keep adding new and new methods similar to these ones to send different emails for different scenarios.
Anyway, since we passing the user and the url into a new email, so our constructor then needs to take these in as arguments. this.to will be equal to user.email, and we also want to define the first name of the user in order to basically personalize the email. Also this.url = incoming url, and finally also set this.from right here, so basically at the object level, And so each object created from this class will then get this property.
Now one thing that I really  want to do is basically define this email(our email) address as a configuration variable, so an environment variable that we can very easily change by manipulating the config.env file. EMAIL_FROM=<muhammadugv66@gmail.com>
Next up, let's create a method here, in order to create the transport, similar to what we had before. And here we actually want to have different transports whether we are in production or not. So when we're in production, we actually want to send real emails, and we will do that a bit later using SendGrid, but if we are not in production then we still want to use our Mailtrap application. So instead of the email going to a real email address it will get caught into our mailtrap inbox, so that  we can actually take a look at it. Now this transporter method here returns a new nodemailer transport, that we created like this nodemailer.createTransport({}), Or on the other hand when we're in production  then the one that's we'll implement later.
Now lets create the send method, And so this is gonna be the method that will do the actual sending. And this one will receive a template and a subject.  why we need the template and the subject here? So remember how we said in the beginning that we're gonna have one method called sendWelcome, and also one method for sending a reset password email. so let's also add this two methods.
The sendWelcome method will not take any arguments, all it really does is to call send with the template and the subject that we want for this email, so this makes it really easy to send different emails for all kind of different situations. So we have one generic/general send function and then all of others are more specific ones, like sendWelcome etc. This template name we put here in send will be a pug template that we're gonna create. sendWelcome() {
    this.send('welcome', 'Welcome to the Natours Family');
  } // just like this we don't need to worry about any implementation details when we're actually sending the email.

Anyway, let's now actually then build this send function, And so what we're gonna do in this function is to (1) first render the HTML for the email based on a pug template.  (2) Then define the email options. (3)And then finally create a transport and send email.
So starting with point(1), And usually up until this point, we only ever use pug to create a template then we pass the name of the template into the render function on the response, so just like this, res.render('nameOfTemplate'), And what this render function does behind the scenes is to basically create the html, based on the pug template and then send it to the client. Now in this case we do not want to render, all we want to do is to basically create the html out of the template so that we can then send that html as the email. So basically defining it here as an option in mailOptions, with html property. We are interested in sending an html email. And so that's why we're gonna have a pug template from which we will generate this html. So we need to require the pug package here in the email.js file. And then we need to use pug.renderFile(),So this will take in a file and render the pug code into real html. So that we can then save into a variable html.  So where is that template file?  well it's at __dirname, which remember is the location of the currently running script, so that is right now 'utils' folder. so from there we need to go one step up, then into views, then emails folder and in there we're have a template file, so ${template.pug} like this:     const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`); So for the welcome email, this template is gonna be called welcome, and remember this template variable is one that we passed in send method, And so let's now actually create that welcome template in the views/emails.

(2) That's the first step, Next up, let's define the email options, so from is now, this.from, also to is this.to, and subject is equal to the subject that's coming in, and we have our html, which is html. Next we also want to include the text version of our email into the email, and that's actually really important because it's better for email delivery rates and also for spam folders. And also some people just prefer plain simple tex emails instead of having the more formatted html emails. And so basically we need a way of converting all the html to simple text, so stripping out all of the html leaving only the content. And for doing that, we are going to install yet another package, and so this one is called html-to-text So,
! npm i html-to-text
let's include that here in email.js file, and then use that to convert that html to text.  we use fromString method and here html is stored in html.
And actually I forgot something very, very important in the step(1) so in the render file, because just like with res.render we can also pass data into render file, and of course that's very important if we want to actually do our email personalization with the name and also passed in the url. And so let's do it just like we did normally in the render function.so with an object. so we also send firstName, url and subject to the template.
(3), Now let's finally create a transport using our newTransport function and then send the email. that's this.newTransport(), basically newTransport() method is already created so we just call that, and on to that we chain sendMail method and pass in mailOptions. then we need to await all of these, because it's an async function. so mark the send() method as async, so we can await. Now we also need to await the function here from sendWelcome, because this.send() is now indeed an async function.
That's actually it, for this class. And so in the next video we will then actually go ahead use this class in order to send a welcome email.

* QUICK RECAP:
We created a new email class from which we can create email objects that we can then use to send actual emails. And to create a new email object we will pass in the user and also a url, that we want to be that email, so then all user's stuff and url to the current object and also some other settings that we want to have available such as this.from to inform about sender.   Then we've a newTransport function which makes it really easy to create different transports for different environments. And so once more, abstracting that logic away from the actual send function which should only be concerned about sending the email. After that we have send function which takes in a template and a subject, and based on that i creates the html from a pug template which will then be set into the email options, which will at the end of the function, finally sent. But it's not going to be this send function that we will use in our code. So instead we're going to be creating one different function for each type of email that we want to send. And the first one that we created here is the sendWelcome. So sendWelcome will basically the preset the template name as welcome and as the subject as string that we pass.

*/
// email.js file(till now)
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split[' '](0);
    this.url = url;
    this.from = `Muhammad <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // SendGrid
      return 1;
    }

    return nodemailer.createTransport({
      // service: 'Gmail',
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        password: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject: subject,
    });

    // 2) Define the email Options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html: html,
      text: htmlToText.fromString(html),
    };

    // 3) Create a transport and send email

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family');
  }
};

/*

* lecture 206
* Email Temaplates with Pug_ Welcome Emails
So in this video we're gonna use the power of pug to create a really nice email template and then send a welcome eamil based on that template. that template is welcome.pug.
? I use this link, and get the built in link,  <https://github.com/leemunroe/responsive-html-email-template> Then I converted that html using this tool <https://html2pug.vercel.app/> to pug,

Anyway, when we're building an html email, we always need to inline all the styles. As here we have, we'll export it to the _style.pug file, and will include it in welcome using include_style.
Here this welcome.pug file there is lot of tables,  because we copied this code from git repo. In there we have //CONTENT  that is the part we're gonna put all our content.
Now the thing is that we of course, will have many different templates and in case of this project we will actually only two ourselves, but there might be many emails for many situations, And so of course we will a way of reusing all of these codes that is of this CONTENT, Basically all of pug codes, except that are in CONTENT should be reusable. And actually that's exactly what we did before with our base template. so we put everything that is reusable for all the templates inside of the base, then we have to block there and all the other templates. Then simply extend that block. And so that's exactly what we will do now. so create a new template called baseEmail, put all codes into the baseEmail and then cut the content from there, and there create a block called content again. And then in welcome we put that content inside content block. and say extends baseEmail,
Here in baseEmail we have title tag so we need to change it to the subject that we passed into the template,  remember into the template we passed the subject, url and the firstName, so here we put the subject. Now change all other stuff with the things that we passed in. like name etc.
Completed, so this welcome template will use whenever we call sendWelcome method. So let's now go ahead and do that.

? So from where do we want to send the welcome email?
well that's in the authController and then signup function. So there we need to import the Email and then use it.
/*
  so here in signup function, let's now use this Email class, so new Email(), and remember the first parameter is the user, which is the newUser,  and url, which we gonna create in a second. And then chain call sendWelcome method, And now all we need to do is to actually await this sendWelcome function, because send welcome is an async function, And so when we actually await it, we then wait until it finishes.
  ? Now to specify url, What URL do we actually want here?
  well, remember in then button, where we want put this url, it says 'Upload user photo', So basically we want to point to that user account page, <http://127.0.0.1:3000/me> so right here, from there we a user can then change their photo. We could put hard code by just copy and past this url, but then it would only work in development, So instead of hard coding we will get this data from the request. So basically we will bet what protocol we are using, and then also the host. let's replace. to get host we need to to get function, and there pass the host as a string.
  And now let's actually test it. All we need to do for that is to just create a new user using signup from post man. Now when we create this new user then we should get a new Mailtrap,
  ! So previously i mailtrap was not working because in auth we put password instead of pass. now correct is: pass: process.env.EMAIL_PASSWORD, Now this time we got a new message in mailtrap, with our formatted message. Also we had one more error while converting html email to plan text, we used formString method, but it's no more on html-to-text, so instead we should use htmlToText.convert(html) method. -Fixed by me
  GREAT GREAT GREAT, And it actually looks really nice. Also this button 'Upload User Photo' also working, It takes us to our accout page.  
  Remember I doesn't work on our website because we don't have any signup form on our website.
*/

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  //  <http://127.0.0.1:3000/me>
  const url = `${req.protocol}://${req.get('host')}/me`;
  console.log(url);
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

/*

* lecture 207
* Sending Password Reset Emails
let's now very quickly also send emails for password reset, and that email will be very similar to the one that we built. let's just go ahead and copy and paste into a new file called passwordReset.pug, and change the some content.
Now next up, let's actually create the sending function in email class just we built for Sendwelcome(),
async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset Token (valid for only 10 minutes)'
    );
  }
Now as a final step we need to call this method, so In our authController in forget password.
 try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();
 }
LET'S TEST THIS, yeah we get a mail on mailtap. And copy that url from there and paste to reset passwrod, and remember that url will contain the token, OKK, Yes that's also working. Now try to loging with new passwrod, YEAH ALSO WORKING...

At this point all our emails are actually getting courght in mailtrap, and so that's because in development mode, we don't want to leak these email to real users. Also we would have no way of taking a look at these emails if they would really end up in our real users email inboxes.  However in the next video we'll then start to send real emails so emails to real email addresses which will then endup in their inboxes.  
*/
async sendPasswordReset() {
  await this.send(
    'passwordReset',
    'Your password reset Token (valid for only 10 minutes)'
  );
}

/*

* lecture 208
* Using Sendgrid for _Real Emails
So let's now use the sendgrid service in order to send real emails to real inboxes, rather than to our development inbox at mailtrap.

! COULD'T SIGNUP, TRY IT...

* just for now.
go to the email.js and then newTronasport()

/*
  here we use nodemailer.createTransport(), and remember how i told when we first created this email handler, that there are some services that are already predefined. and SendGrid is is one of them.  so we can specify service and then 'SendGrid', we already did this before for gmail. and with that all we needed to then pass in the username and password. Here it's going to the exactly the same. And that's the reason why we actually don't even need to specify the server and the port, because nodemailer already knows this data because we specifying SendGrid service.
  And now to test this let's create a new user with a real email address.

  ! TRY TO SIGNUP ON SENDGRID, HERE USED JONAS'S TOKEN, BUT WORKING AT ALL.... SO TRY TRY TRY...............

  */
  // BOOKING ROUTES FILES
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // SendGrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
  }

/*

* lecture 209
* Credit Card Payments with Stripe
In this last part of the section we're now gonna accept credit card payments in our application using Stripe in order to allow users to actually buy tours.
So stripe is the best and most popular and also easiest to use software platform to integrate payments into ony website.Signup Now stripe account is in test moode, as soon as we really want to start accepting real payments involving real money from real customers, then we'll have to activate stripe account, for that we will then have to provide stipe with a bunch of data about your business. But of course in this buisiness we're nto gonna do that. so we'll always just work in this kind of test development mode. In test dashboad we can see all our transitions, just fake amount, all payments methos, credit card number, And by the way, we actually never do get access to the reall credit card number of the customer, we will always just see last four digits. we can also see the entire blance...

Before get started we need to define couple of settings about our account.  like change branding, which will make the stripe checkout pages match our brand, like change icon color.
Now click on get API key, so there will on publishable key and one secret key. So publishable key is basically a public key, that we can use on the front-end, and a secret key is the one that is needed on the back-end.
Finally take a quick look at the documentaion. It's really easy to find what we needed, using their documentation.
We're gonna use the payment features of Stripe, and they have a couple of differnet options. Now on the web, we can use 'Stripe Checkout', which is basically using a performated checkout page. Or we can also use 'Stripe Elements' when we really want to build our own checkout experience. But we'll just use the checkout, which is actually brand new, so it's really future-proof at this point. Then from checkout we can use it on only the client or together with the server. So when we only use it on the client side, then we don't even need a server at all. But this way of using Stripe is only really really small stores. we want something a bit complex, so for that, we use server integration. And so, of course we still need to do something on the client side, but most of the code will actually be on the server side.
Alright, but now before we actually start to integrate the stripe checkout product into our app, I just wanted to quickly layout the entire workflow that we're gonna implement over the next couple of videos. So,
It all starts on the back-end where we're gonna implement a route to create a so-called Stripe Checkout Session. And this Session is gonna contain a bunch of data about the object that can be purchased. In our example that's the tour, So the session will contain the tourPrice, the tour name, a product image, and also some other details like client emai.
Then on the front-end we're gonna create a function to request the Checkout Session from the server once the user clicks the buy button. So once we hit the end point that we created on the backend, that will then create a Session and send it back to the client. Then based on that Session, Stipe will automaticallly create a checkout page for us where the user can then input all the details like creadit card number, expiration date, and all that. Then again using that session, we will finally charge the credit card, And for that, we're gonna need the public key, so the one that we just saw before,  So the secret key we will need on the server as we see up there in the first step and the public key is gonna be used on the front-end. And what's really important to note here is that it's really Stripe, which will together with the session, charge the credit card, and so therefore the credit card details never even reach our server, which makes our lives as a developers a lot easier because we dont have to deal with all the security stuff that's related with managing and storing credit cards, So stripe takes all that away from us, we basically just use their API like this.
Anyway once the credit card has successfully been charged, we can then use something called Stirpe Webhooks on our back-end, in order to create new bookings. Now this part of the workflow will only work for deployed websites, so websites that are already running on a server. And so this part of our workflow, we're only gonna be able to implement by the end of the next section. But for now, we'll actually find a temporary work-around to this, which is not really secure, but it's gonna work just fine for now. Soo keep this diagram in mind also this concepts that we actually use the session to charge a credit card and we don't really do that directly.

! See pdf (STRIPE WORKFLOW)
*/

/*

* lecture 210
* Integration Stripe into the Back-End
So in this video let's integrate Stripe into our backend by creating that API endpoint which will create and send back a Stripe checkout session. And so at this point we're actually gonna start creating our next resource, and so that's the bookings. And we'll start with the bookingRoutes in routes folder. and also create a bookingController. And let's also integrate this right into app.js,

const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();
/*
And so now let's actually go ahead and create our first route here in bookingRoutes. And the route that we'll create here once again not follow the rest principle because this one is not really gonna be about creating or getting or updating any booking. Instead this route will only be for the client to get a checkout session. And so let's actually call this one /checkout-session, then we need to protect this route, so that only authenticated users can actually get a checkout session. And then add bookingController.getCheckoutSession, Now actually there's one more thing we need to do here in the routes which is to specify a url parameter, and that's going to be /:tourId, So, basically we want the client to send along the id of the tour that is currently being booked. And that is so that we can fill up the checkout session with all the data that is necessary, such as the tour name and the tour price...,
Let's now create this route handler, We now have to access to the tourId, and so the first thing that we're actually gonna do in this handler function is to find that tour in our database. And for that we need of course the tour Model. so let's require it in bookingController file.

*/
router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckoutSession
);

module.exports = router;

/*
So, let's layout our steps here again.

1) Get the currently booked tour
2) Create Checkout Session
3) Create Session as Response

1- GET CURRENTLY BOOKED TOUR:
Let's go the first step, that's really easy. just find the id, which is in req.params.tourId.
const tour = await Tour.findById(req.params.tourId);

2- CREATE CHECKOUT SESSION:
Next up, let's actually create that session here. And for that we actually install need to install npm package. So,
! npm i stripe
And in the meantime we're gonna go to our Stipe dashboard and get our secret key from there. There ones are just for testing, and then once we have our Stripe account active, we can get our live api keys. Now as with any other keys we will put them in our config file.
Let's now require the Stripe package. And just with all the other packages before please make sure that you are on same version @7.0.0, const stripe = require('stripe'); Now this here will then expose a function basically. And usually what we do then right away is to pass our secret key right into that. just like this: const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); this will then give us a Stripe object, that we can work with.
And so let's use that. stripe.checkout.session.create(); here in create() we pass the usual object of options. Now there are a lot of options that we can set here, but only three of them are required. So the first one is the payment_method_types, so that's any array where we can specify multiple types and card is for credit card. and right now that's actually all the payment option that we can use for Stripe checkout, but in future they will add a lot more. Then we need to specify the success_url: so that's basically the url that will get called as soon as a credit card has been successfully charged. so as soon as the purchase was successful, the user will be redirected to this url. for now let's simple specify that as our homepage, we're going to do that just as before. Then we also need to specify the cancel_url, for now this one is gonna be similar to success_url, basically it's the page where the user goes if they choose to cancel the current payment. And actually let's make them go to the tour page where they were previously.
Next up, we can also specify the customer email. And so that's very handy because of course we already have access to the customer's email. And so with this we can save the user one step and make the checkout experience a lot smoother. Remember that this is a protected route, so as always the user is already at the request.
Next up, we can then also specify a custom field which is called client_reference_Id, that's sounds a bit weird but actually it's going to be really important for us. So this field is gonna allow us to pass in some data about the session that we are currently creating. And that' important because later once the purchase was successful, we'll then get access to the session object again. And by then we want to create a new booking in our database. So remember the diagram, basically i'm talking about the last step in that diagram. And also remember how that's only going to work with deployed website. But still, let's already prepare for that here. So to create a new booking in our database we will need the user's Id, the tourId, and the price. And in this session we already have access to the user's email, and from that we can then recreate the user's id, because the email here is unique. We'll also specify the tour's price here in a second. And so all that' missing here is then the tourId. So that's what we gonna specify her on the custom field, like this: client_reference_id: req.params.tourId,
Now finally we're gonna specify some details about the product itself, so tour in this case, so that's called line_items, which accepts an array of objects, so one object per item.  in our case that only gonna be one. So, we need to specify the name of the product, so it will be tour.name, and then we can also specify a description, And remember all these fields/properties names here they really come from Stripe, so we cannot make up our own fields. In description we'll put tour.summary,  Then we can also specify an array of images. Now these images here need to be live images. so basically images that are hosted on the internet, because Stripe will actually upload this image to their own server. And so this is another of the things that we can only really do once the website is deployed. But for now as a placeholder we'll basically use the onces from our hosted example website on natours.dev, from there we choose the cover image. and the name of the image we will simple replace tour.imageCover, Next up is the amount, basically the price of the product that is being purchased, so that is tour.price, and now we need multiply that by 100, because this amount is expected be in in cents [1$ = 100cents]. Then we also need to specify the currency. Finally we also specify the quantity. And so that's just one tour in this case. So that's actually it. So the payment_method_types, success_url, cancel_url, customer_email, client_reference_id, all of these are the information about the session itself. and then in line_items, there is information about the product that the user is about to purchase.
Now let's actually store the session, const session, and we need to await this. Basically this .create() method returns a promise, because setting all these options here will basically do an API call to Stripe and so then of course that's an async function that we should await here.
This in now our session now go to the last step which is of course to send it.

3- CREATE SESSION AS RESPONSE
let's send back to the client.
res.status(200).json({
    status: 'success',
    session,
  });
That's it.

We could try this out in postman. We got it but with some fixes. I changed the line_items: filed.
Now it's success so we should kind of see this payment or at least this payment request, in our stripe dashboard.
*/
// BOOKING CONTROLLER FILE

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    // line_items: [
    //   {
    //     name: `${tour.name} Tour`,
    //     description: tour.summary,
    //     images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
    //     amount: tour.price *1,
    //     currency: 'usd',
    //     quantity: 1,
    //   },
    // ],
    // ! In current version of Stripe above code is not working, which is written by Jonas sir.
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
          unit_amount: tour.price* 100, // Amount is in cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
  });

  // 3) Create Session as Response
  res.status(200).json({
    status: 'success',
    session,
  });
});

/*

* lecture 211
* Processing Payments on the Front-End
In this lecture we gonna learn how to process payments with stripe on the front-end whenever a user clicks a button.
And to start let's actually configure it that button so that it only appears whenever a user is actually logged in. in each tours we have a button 'Book Tour Now!', If the user's is actully not logged in then this button should redirect the user to the login page. So let's implement that in the tour template.
So if there is a user logged in then that meas that we have access to the user variable. so we can do:
if user
  button.btn.btn--green.span-all-rows 'Book tour now!'
else // there's no user
  a.btn.btn--green.span-all-rows(href='/login') Log in to book tour
Now somethig here very important in 'Book tour now!' btn, thst si we should put the current tourId right here in this button element. Now why is that so important? well remember how the api endpoint that we just created('/checkout-session/:tourId') needs the tourId, and so that tourId needs to come from somewhre basically, and so right now we don't have that information anywhere on this page, and so we'll put it here right on this element, so then our javascript file can grab it from here and send it along with the request to the checkout session route. So just like we did with the map we're going to use a data attribute. data- and then whatever variable name that we want to define,  that's tourId in this case. so (data-tour-id=`${tour.id}`)
if user
  button.btn.btn--green.span-all-rows#book-tour(data-tour-id=`${tour.id}`) Book tour now!
else
  a.btn.btn--green.span-all-rows(href='/login') Log in to book tour
Now next up let's up let's create a script in which we will do the request, and process the payment on the front end. just like before that will be in bublic/js called it stripe.js
/*
/*
And now here we actually need access to stripe library agin. but that package that we just installed before, so stripe npm package, that we used here in bookingController, So this only works for the back end. And what we need to do on the front end is to actually include a script in the html, and since we only need that script on tour page, so we'll do it just like we did with the mapbox script. so we will put it in the head block. let's copy this script from stripe's documentation     <script src="https://js.stripe.com/v3/"></script>
So this script then will expose a stripe object to the global scope. So now in stripe.js we can use that. We say:
const stripe = Stripe(), here Stripe is an object that we get from the script that we just included. And then here we need to public key.
const stripe = Stripe(
  'pk_test_51OIXZQSG0Tco2w5skNQHdmPgV1tOeQO26QUDjuaAiFyvfjukSmdTr1jEWURIISmVOAjC20JIxccP6QRj1YnMHcKP001k7DR7eO'
);

And now let's finally create a function, that we gonna call bookTour, And so this function will take in a tourId, And this tourId is the one thats gonna be coming right from the user interface, that we put on button element using data attribute. Just at before we gonna get that one from index.js file, where we will then also call this bookTour function.
Anyway, Once more specify the steps that we gonna take here.

1) Get Checkout Session from API
2) Create Checkout form + charge credit card

1- GET CHECKOUT SESSION FROM API: The first step is to actually get the session from the server, and so that's where now this route here(/checkout-session/:tourId) come in. So this is the point where we are going to use this endpoint to really get our checkout session on to the client side.
So let's store the session into session variable, and then we're going to await an http request, which once more we will do with axios.  And then into axios we can simply just pass the url, when all we want to do a simple get request. So up until this point we have always specified the method, and the url and the data, but we're only doing a get request, and so that's then much simpler.   console.log(session); Just to see our session object, Now in our index.js we'll basically connect that green button with this function that we just created of stripe.js file.
import { bookTour } from './stripe';
Then as always let's select our element from the web page. const bookBtn = document.getElementById('book-tour');
And so new we can add that event handler to it.
/*
Now we need to get that tour Id from that button, so that's on the e.target, here e.target is basically the element which is clicked, so the one that triggered this event listener here, in that element we have tourId in data attribute. just like this dataset.tourId, but in our pug file we specify like this data.tour-id, So, whenever there is a - (dash) it will automatically get converted to this CamelCase notation. when property and our variable is same then we simply can destructure it like this: const {tourId} = e.target.dataset;
And we call bookTour function with this tourId, Also we change the text of the button with something like 'processing',
YES WITH console.log(session), we get a response object, as asios send response in an object, and indeed in that object we have session object. we have customer email, etc.
Now as a last step actually create the checkout form, and charge the credit card.

* index.js file
if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing';
    // const tourId = e.target.dataset.tourId;
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
*/
/*
2- CREATE CHECKOUT FORM + CHARGE CREDIT CARD: As a second step we will use stripe object to basically automatically create the checkout form plus change credit card for us.
it's very simple all we need to do is to await stripe.redirectToCheckout({}) and then in their we put options, but only one option. which is the sessionId, and that will come from the session object, that is in the session variable here, and remember we saw in console our session is in the data object created by axios,
await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });

And now comes the greatest part of all which is to actually check out if this works.
! I think there is a problem, It may due to Content Security Policy Issue, OR, According to Stripe documentation the stripe.redirectToCheckout() method is now depreciated.

Yes, After disabling the content security policy by using chrome extension built by google, on the site, now it's working....
For here we can get the card numbers: <https://stripe.com/docs/testing#cards>
We can use just: 4242424242424242
Also we get the detail on stripe test dashboard, on payments tab.

*/

import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51OIXZQSG0Tco2w5skNQHdmPgV1tOeQO26QUDjuaAiFyvfjukSmdTr1jEWURIISmVOAjC20JIxccP6QRj1YnMHcKP001k7DR7eO'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get Checkout Session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    console.log(session);
    // console.log(session.data.session.id);
    // 2) Create Checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

/*

* QUICK RECAP:
We started by creating the checkout sesssion, which needs as an input the tour Id, so that we can then store a bunch of details about the tour in that session, like tourName, summery, images  ect. So all that stuff that we want to show up on the checkout page and also in our dashboard. Then we also include the email so that the user doesn't need to fill it out the checkout, we included by using customer_email filed. And also we added the client_reference_id, and remember this client_reference_id, which will make a lot more sense once we actually get to use it. So we create this session with all these stuff whenever someone hits this '/checkout-session/:tourId' route. And so that's exactly what we then do on our front end rihgt in the stripe.js. So we get our session here in stripe.js file and then from here we create a checkout and charge the credit card using stripe.redirectToChecout(), and this stripe object here is simply using the stripe library with our public key. And remeber the tour id is stored right on the button where the use click to book a tour, That id is then read right here in index.js, wherever someone hits the booking button. and from there we call the bookTour function with the tourId. remember bookTour is the function that is in stripe.js file, which takes care of really processing the paymensts on the front-end. And so the result of all this  what we just saw at the end, where the user really get charged the credit card and purchased the tour.  PERFECT
Now what's missing here is actually whenever there is a new booking, we want to create a new booking document in out database. So we're gonna create the bookings model right in the next video.
*/

/*

* lecture 212
* Modelling the Bookings
Let's now, really quickly, create the model for our bookigs so that then, in the next video we can actually start creating some real bookings. create a bookingModel.js file.
/*
this bookingModel is of course gonna be very similar to what we already did before.
Now remember how we said before that we were going to use parent referencing on the bookings, so basically keeping a referencing of to the tour and also to the user, who booked that tour. So remember we set the type to mongoose.Schema.ObjectId, and then the ref, set to 'Tour' basically point to Tour model.
.......
Finally we also want to create a paid property, And this one will be automatically set to true, but this is just in case that, for example an administrator wants to create a booking outside of Stripe. For example if a customer doesn't have a credit card and want to pay directly with cash. And in this case an administrator might then use our bookings API in order to basically manually create a tour, and so that might then be paid or not yet paid.
Now what we also want to do here is to populate the tour and the user automatically whenever there is a query. So remember how we used to do that using query middleware, right on the Schema using .pre, We will populate for both the user and tour, and in this case that's absolutely no problem for performance, because there won't be many calls to the bookings, because only guides and admins will actually be allowed to do them. So basically for a guide to check how has actually booked their tours. So that's one of the use cases that I see for this part of the api.
*/
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour!'],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!'],
  },

  price: {
    type: Number,
    required: [true, 'Booking must have a price.'],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
/*

* lecture 213
* Creating New Bookins on Checkout Success
let's now create a new booking document in our database whenever a user successfully purchases a tour. So we're back here in the booking controller and in the in the routeHandler which creates the checkout sessions. bookingController
Remember here we have the success url, and this url is the basis of the functionality that we're going to implement in this lecture. So whenever a checkouk is successful the browser will automatically go to this success url, it's right now simply a homepage. So when a checkout is successful we want to create a booking, So basically we want to create a new booking whenever this url is accessed. Now we could create a new route for this success, but then we would have to create a whole new page and that's not really worth it in this case. that's because what we're going to do in this lecture is only a temporary solution anyway because it's not really secure. Remember How we said some lec ago in that diagram that later when a website is actually deployed on a server we will get access to the session object once the purchase is completed using Stripe Webhooks. And so these webhooks will then be perfect for us to create a new booking. But for now, since we can't do that yet, let's use a work around, which is simply to put the data that we need to create a new booking right into this success url as a query string.
And we need to create a query string becasue Stripe will just make a get reqeust to this url, and so we cannot really send a body or any data with it except for the query string.
So let's do that and what we need here is basically the three required fields in our booking model, so tour, user and price. So,
success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
Now as I said before, this is not secure at all, because right now anyone who knows this url structure here could simply call it without going through the checkout process. So anyone really could just book a tour without having to pay.  But for now as a work around it works just fine because many peoply will of course will know that this is our seccess url. because actually we're going to hide that fact a little bit in a second.
Let's now create the function that will actually create the new booking in the database here in bookingController.js file.
/*
It calls createBookingCheckout, because later on we'll also have createBooking which will then be accessible from ou bookings api.
Let's start by getting our data from the query string. And so for that we're gonna use destructuring, tour user and price will be available on the req.query, remember that's the query string.
Then we actually only want to create a new booking if all of these here are specified. Basically we say if they don't exist then we return and go to the next middleware.
? Now here what exactly is the next middleware actually?
well remember that we want to create a new booking on this home url, because again that is the url that is called whenever a purchase is successful with Stripe. And so what we need to do is to add this middleware function that we're creating right now onto the middleware stack of this route handler. So what route handler is that? that's in viewRoutes and from there first one with home('/'), So here we have to add that middleware function that we currently creating.
router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);
And again, this is here just kind of temporary until we actually have our website deployed to a server where we will then be able to create a better solution for this.
Here in the bookingController it's now time to actually create that new booking. So, we now need to import that bookingModel here.
So, we have to await the Booking.create({tour, user,price}), And we're not saving this into any variable because we don't really need it. We're not gonna be sending this back as an API response. At this point all we want to do here is to just create that new document.
Next up we could say next(), so that then go to the next middleware, but that's not really ideal. So, keep in mind that the next middleware in the stack at the home'/' route is authController.isLoggedIn, and then viewController.gerOverview, so basically the function that is going to render our home page. But remember that this url is all of the data that we passed in query string, with username, price etc, So again that's not secure at all. And so at least let's make it a little bit more secure, So what we can do here is basically redirect the application now to only this home url, so basically removing the query string from the original url.
So actually we're now going to use something that we never used before. So we're going to use res.redirect(), now here what we want is the entire url, but without the query string. So, req.originalUrl, that's the entire url from which the request came, so from there we need to split it by the question mark. So if we split it with ? then we will have any array of two elements, So here we take the first element. And what redirect here does is basically to create a new request but to this new url that we passed there. So in this case it will create a new request to our root middleware, So this request again gonna hit home/root route, and so once more it will hit this middleware that we're now creating(createBookingCheckout), so second time it going to be hitting that, but now the tour, user, and price are no longer defined so then we will go to the next middleware, which finally is the getOverview handler, which then we'll just render the homepage, but without the query sting in the url.
NOW IT'S TIME TO TEST THIS OUT, Indeed our very fist document is created. Tha awesome and so now we really a way of creating bookings whenever a booking happens with Stripe.
Now again, once a website is deployed, we will then actually use Stripe Webhooks in order to create bookings in a more secure and much better way.
* QUICK RECAP:
Basically we added all the variable that we need to create a new booking to the success url. then we added a new middleware function here to the stack of that exact root route, and so like this whenever this url here is hit we'll attempt to create a new booking. But that new booking is of course only created when the tour, user and price are specified in the query. And so in this middleware function, if they are specified on the query then we create a new booking, then after that is done we remove the query sting from the url in order to make the whole process a bit less transparent for the user. Basically so that whole query string doesn't show up in our browser's url bar. And then down we redirect our application to this new root url here. So this way our newly created middleware here will be skipped and then our normal homepage will simply get rendered.
In the next lecture we'll actually take care of implementing one last piece of our website, which basically for My Bookings page. This page will do is to basically display  one tour card for each of the tours that we booked.
*/
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying.
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();

  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split['?'](0));
});

/*

* lecture 214
* Rendering a User's Booked Tours
We're gonna implement my bookins page. So basically we're gonna render a nice page conataining all the tours that a user has booked
Let's start by adding a new route to our viewRoutes. which is /my-tours route, which again will be protected. Then in a viewsController we're gonna have a controller called getMyTurs
router.get('/my-tours', authController.protect, viewsController.getMyTours);
let's go ahaed and create this controller.
/*
exports.getMyTours = (req, res, next) => {};
And so now, what we need to do here is to find all the tours that the user has booked. So, basically, first we need to find all the bookings for the currently logged-in users, which will then give us a bunch of tour Id, and then we have to find the tours with those ids.

1) Find all bookings
2) Find tours with the returned IDs
Now instead we could also do virtual populate on the tours, and it would be great if you would implement with on you own exactly as we have done it before with the tours and the reviews.
But here in this function I actually wanted to show you  how we can do it manually because I think that's also kind of important and actually a virtual populate should work something similar to what we're gonna do here. And so actually we need two queries in order to really find the tours corresponding to the user's bookings.
Anyway lets now start!
1) Find all bookings
So let's create a variable for all the bookings await Booking.find({ tour: req.user.id }), Now remember that each booking document has a userId, So what we do now is to basically query by the userId, so that will then return us all the tours belong to the current user. So this booking now contains all the booking document for the current user, by really that only gives us the tourIds. Now we want to find the tours with the returned Ids.
So the next step is to basically create an array of all the ids, and then after that query for tours that have one of these ids. so step 2

2) Find tours with the returned IDs
const tourIDs = bookings.map((el) => {
    el.tour;
  }); This loops through the entire bookings array and on each element it will grab the el.tour, because in tour we stored the id of corresponding tourId. Then in the end we have a nice array with all the tour IDs there.
? from chatGPT
If you were to query the database and retrieve multiple documents using find or a similar method, the result would be an array of objects, where each object represents a separate document.

Then having all the tourIds, we can actually get the tours corresponding to those IDs.
Here we cannot use findById, because here we actually need a new operator, which is operator is called '$in', Tour.find({_id:{$in: tourIDs}}), So basically what this is going to do is that it will select all the tours which have an ID which is in the tourIDs array. Very handy $in operator. And so that's actually one of the reasons why i wanted to do it manually instead of just doing a virtual populate like we did before.
And with this our tours ready to be rendered. so res.status(200).render({}), and actually we don't even need a new template for this. We're simply gonna be reusing the overview, with only the tours which users has booked.
Ok that should be it, Now of course we could also have created whole new card for these booked tours with some more relevant information about each of the bookings.  
Let set this link right on the user account page.
So, we're actually ready to test this.
Nothing happening here. This was a really hard one to find the bug here.
Small error here:
const bookings = await Booking.find({ tour: req.user.id }); first here we need user instead of tour, b/c we need to filter tours by the user, where the user is equal to the user coming from the request, SO,
const bookings = await Booking.find({ tour: req.user.id });
But that's not the main bug actually. So this is not the one preventing the page from actually loading. The error that causes that to happen is right here in the booking model. It's in pre find middleware, where the problem is that we do never call the next middleware there. So this is a pre-middleware, and all of the pre-middlewares have access to the next function and so at the end of this middleware, we always have to call next. Otherwise our process really get stuck.  

NOW CHECK IT: GREAT! HERE WE GO.
*/
exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => {
    return el.tour;
  });
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

/*

* lecture 215
* Finishing the Bookings API
And now to finish this section, let's now very quickly finish the bookings API.
So adding all the CRUD operations to the bookings, so Creating, Reading, Updating, and Deleting bookings.
Go to the bookingsController file

So, let start here by using the factory, that we already have in order to create all these five handlers.
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);

Now moving to the routes, in bookingRoutes
So without the booking id, we have as always getting all and creating a new one. And all of these routes will actually be protected and also only restricted to administrators and lead guides. so let's put that two above the handlers.
Now the routes with the id, which will be getOne, update and delete

just to test getAllBooking and getBooking to postman.
*/

/*

* Lecture 216
* Final Considerations
Last video of this section, And is this section we kind of finished our project, both the API and also the rendered website.  
"In this last video I wanted to quickly address some topics that we could've added to theh API and to the website, and basically leave them for you as challeges if you would like"

* We could have add some more business logic to our project, for exampe. adding a restriction that users can only review a tour that they have actually booked.

* You could also implement some nested booking routes, for example getting all the bookings for a certain tour, or getting all the bookings for a certain user.  
* You could dramatically improve the tour dates, and what i mean by that is that you could add a participants and a soldOut field to each of the dates. And the date then becomes kind of like an instace of the tour. then when a user actually books a tour, they need to select one of the available dates and then new booking in one of the dates will then increase the number of participants in the date until it is booked out. so basically when participants is greater than the maximum group size. Now finally when the user wants to book a certain tour on a certain date you need to check if the tour is still available on that selected date.
! SEE PDF FILE
* Finally, you could also implement some of the advanced authentication features that we alredy talk about bit before in the security section. For example you could confirm a user email address basiclly by sending them an email with a link that they need to click, and only after the click, the user is then really registered in the application. and can do stuff like puchasing tours.
* We could keep users logged in with something called refresh tokens. that's bit complicated to implement but if you google around about how it works then will find a good solution.
* we could also implement two-factor authenticatio, but this one is taking it even one step further. so when a user log in they receive something like a text message..
This are the things that we could do on the API side.

But also there is stuff that you can do on the website.

* implement signup form, similar to login.
* On the tour detail page, if a user has taken a tour, allow them add a review directly on the website, implemnt a fomr for this. So first we have to check if the currently logged-in user has actually booked the current tour, and also if the time of the tour has already passed.
* Hide the entire booking section on the tour detail if the current user, had already booked the tour. Also prevent duplicate bookings on the model.
* Implement 'like tour' functionality with favourite tour page
* Implement My Reviews page, which already has a link right now, and on that page the user could then see and maybe also edit and delete all of their own reviews.
* For administrators, implement all the 'Manage' pages, where they can perform all the CRUD operations on all the resources.

*/

# 0f0

/*
? ------------------------- ?
! ------------------------- !

* ------------------------- *
! NEXT SECTION #14
* SETTING UP GIT AND DEPLOYMENT
*/
/*
* lecture 218
* Setting Up Git and GitHub
So, the Heroku platform, where we're gonna deploy our project,works very closely with git,  And so in this lecture, we're gonna install and setup git on our computer and also open an account at github.com.

? Whay actually git is
well, git is a version control software, so a software that runs on your computer and which basically allows you to save snapshots of your code over time. ---very baisc
Each of the project we'll create a repository, and then in there we'll create commits and diff branches.

let's now go ahead and create an account on github.com
github is a platform where we can host our own git repositories for free in order to share it with other developers, or just to keep it secure for yourself.  
*/

/*

* lecture 219
* Git Fundamentals
In our local project folder create a new repository

* Create new git repo
? git init
In order to create new repo we need to navigate to that project folder, and then in there we write git init, so right now we have a repository with a branc name called master

* Create a special file called gitignore
all that file that shouldn't be in the repo
IN .GITIGNORE FILE
node_modules/
*.env (All .env file)

? git status
all the folders that not yet commited to our repo

* How we commit files to repo, that's a two step process
Add that file to so-called staging area, only then we commit all the files.

? git add -A
To add(stage) all the files

? git commit -m "commit message"

Now we have a local repository with all of our codes committed to it. In the next video lets actually puch this brach on github. Hosted on the githaub account that we just created.

*/

/*

* lecture 220
* Pushing to GitHub
Pussing to a remote branch
Create new repo on github

the goal is to basically push all our local code into this remore repo that we just created. In order to be able to do that, we need to let our local repository know about this remote repo that we created. so we have to kind of connect them, that's exactly what is said here. "…or push an existing repository from the command line"
git remote add origin <https://github.com/muhammad-ahmad66/natours.git> paste this to terminal
What this going to do? It will add a remote brach/repo, and this romote repo is going to be called origin and it's located at this url.
Now these two repos are connected. At this point we're ready to do git push
? git push nameOfRemoteBranch nameOfLocalBranch
name of remote branch is origin here, name of local branch is master. So,
? git push origin master

By the way the oposite operation of push is pull operation. So imagine youre working on two different computers and want to start to work on one computer and then continue on the other one. And so to do that pust the code on one computer onto github and then on the other one simply pull it.
? git pull origin master

* Now we'll create a readme file
That's a very standard file that every single repository should have.  
The standard name is readme.md, md stands for mark down
use # for main title
That's It,

*/
