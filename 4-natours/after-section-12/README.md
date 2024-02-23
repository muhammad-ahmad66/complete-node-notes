# `SERVER SIDE RENDERING WITH PUG TEMPLATES`

Up until this point in course, we've just been building our API, which can be consume by a web client, in order to build a website, or native application. But now in this section, we will finally use everything that we've built until now, to create server-side rendered websites. This is now quite easy to do because we've already done most of the preparation work before.

## `Table_Of_Contents`

1. [Setting_up_Pug_in_Express](#setting_up_pug_in_express)
2. [Creating_Our_Base_Template](#creating_our_base_template)
3. [Including_Files_into_Pug_Templates](#including_files_into_pug_templates)
4. [Extending_Our_Base_Template_with_Blocks](#extending_our_base_template_with_blocks)
5. [Building_the_Tour_Overview](#building_the_tour_overview)
6. [Building_the_Tour_Page](#building_the_tour_page)
7. [Including_a_Map_with_Mapbox](#including_a_map_with_mapbox)
8. [Building_the_Login_Screen](#building_the_login_screen)
9. [Logging_in_Users_with_our_API](#logging_in_users_with_our_api)
10. [Logging_Out_Users](#logging_out_users)
11. [Rendering_Error_Pages](#rendering_error_pages)
12. [Building_the_User_Account_Page](#building_the_user_account_page)
13. [Updating_User_Data_Using_HTML_Form](#updating_user_data_using_html_form)
14. [Updating_User_Data_Using_API](#updating_user_data_using_api)
15. [Updating_User_Password_with_our_API](#updating_user_password_with_our_api)

## `Recap_Server-Side_VS_Client-Side_Rendering`

Just a quick recap of server-side and client-side rendering.  
Remember how in client side rendering, the actual building of the website happens on the client side. And for that we need a data source, which is usually an API that sends data to the client as requested. So, that's what we've been building up until this point in the course. Now it's time to move on to server-side-rendering, and actually build the website on the server. And the main aspect of server-side rendering is building the actual html, basically because that's where all our data will be stored. And for doing that, we use templated, which have placeholders where we will then inject our data as necessary. So whenever there is a request, let's say for the home page, we then get the necessary data from the database, inject it into a template, which will then output html, and finally send that html, along with css and javascript and image files, back to the client. Now we can still then use the api for some of the things on the front end, and actually, we're also gonna be doing that.

---

## `Setting_up_Pug_in_Express`

Let's start by setting up our templating engine in express, which will then allow us to render out websites using simple templates.  
In this part of the course it's now time to actually send a final rendered website to the client, containing all the data that we've been working with up until this point, like tours, users, and reviews.  

**Now how do we actually build Or render these websites?**  
Well, we use what's called a **Template Engine** which will allow us to create a template and then easily fill up that template with our data. And the template engine that we're going to use in this course is called `Pug`. And there are a couple of other template engines like `Handlebars` or `EGS` for people who don't like pug, because there are some strong opinions around pug, but i'll still say that bug is the most commonly used template engine with express.  

So, let's now setup Pug, and render our very first webpage using it.  
The first step is to actually tell express what template engine we're gonna use, and we do that by saying, right at the beginning in our application app.set, so basically this is like a setting for the view engine, and then we that to pug.  

```js
app.set('view engine', 'pug')
```

That's it, so express automatically supports the most common engines out of the box, and of course Pug is one of them. So, we don't even need to install pug, and also don't need to require it.  
So, we defined view engine, now we also need to define where these views are actually located in our file system. So our pug templates are actually called views in Express. And that's because these templates are in fact the Views in the Model-View-Controller Architecture which we have been using in this course up until this point.  
We already have the controllers and the models folders, and so now it's time to actually create the view folder. And with that we've the three components of the MVC architecture.  
**In order to now define which folder, our views are actually located in**, we need to do again say app.set, this time with views and then name of the path. In path we could just put something like this './views', but that's not ideal. The path that we provide here is always relative to the directory from where we launched the node application, and that usually is the root project folder, but it might be. So we shouldn't use dot here, but we should instead use the directory name variable. So let's do that, together with a nice trick, that we can use with Node, which is using the path module.  

So, **Path is a built-in node module, so a core module, which is used to manipulate path names basically.**

```js
const path = require('path');

path.join(__dirname, 'views'), 
```

This will then basically behind the scenes create a path joining the directory name/views.  
Here the benefit of using path.join is that, we don't always know whether a path that we receive from somewhere already has a slash or not. So this is use to all the time to prevent this kind of bugs, because this way we don't even need to think any slashes or not. because node will automatically create a correct path.

```js
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
```

With these we've now set up our pug engine. Now it's time to create our very first template.

All I want to do here is to create an h1 element simply with the name of some tour. And the way that works with pug is just like this: ***h1 The Park Camper that's it***, that will then translate to this here <h1>The Park Camper</h1>. And it will also allow us to put all kinds of variables here. so that we can really inject our data into these templates.  

Now we actually create a new route from which we will then access that template(base.pug).  

```pug
h1 The Park Camper
```

**Rendering pages on browser, GET is always the one that we use and then specify the routes, that will simply be the root of our website.**  As always we also need handler function, and now to render a template just like before we use the response object, we still set the status, **then instead of using json we use .render**, then render will render the template with the name that we pass in, and that's in this case base, we don't need to specify the pug extension. And of course it will look for this file inside of the folder that we specified(views) in the beginning of this lecture.  

let's test, our server is still running on localhost post 3000,  
Here an error, so actually we do need to install the pug module  
***npm i pug*** *Now working*  

```js
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.status(200).render('base');
});
```

---

## `First_Steps_with_Pug`

In this lecture we're gonna learn the very fundamentals of working with pug templates. Let's open up our base.pug file, and let's get started.  

**In essence/nature, Pug is a simple whitespace sensitive syntax for writing html, so that's really the gist/core of what it is.** Now what that means is that all we use to write html elements is there name and `indentation` in our code. So let's start by setting up a very simple html structure here.  
So html usually always start with the doctype and then html, So in order to be able to properly work with Pug, we should of course have some html knowledge; After doctype the first tag will be the html. Then inside of that there's usually a head element. So in pug, in order to say that one element is inside of the other one, we use a tab, so **indentation**. Inside of head let's create the title of the webpage.  
**So Just indentation, then the name of the html element, and then the content itself. No opening tags, no closing, tags, really clean and simple syntax to use, to read as well**. ...we added a heading and a paragraph.  
Next up, let's actually also include a CSS file and also the favicon to be displayed. These kind of stuff goes in the head.  
Normally we do like this to include CSS, <link rel="stylesheet" href="css/style.css" /> so here we've two attributes rel, and href, and so, **with pug we write attributes in parentheses,** like this,  link(rel="stylesheet" href="css/style.css"), between tag name and parentheses there should not be any space.
We can actually use regular html as well in pug. so to link css we could write this as well.

```js
// Pug
link(rel='stylesheet' href='/css/style.css')

// Regular HTML
<link rel="stylesheet" href="css/style.css" />

```

**Why does this style.css file actually get loaded from the CSS folder automatically, and the favicon also gets automatically loaded from the image folder?**  
Well, fist of all, keep in mind that each of these assets actually triggers it own http request, from inspect, in Network tab we see there is three requests, one for the page itself, one for style.css and one for favicon.png. But we don't have a route handler for all of these, like for css/style.css and img/favicon.png, But if we think it's still a route, because it's get request to this url(css/style.css). **So why this does actually work?** It's because of it this middleware that we defined somewhere in app.js file. this one: ***app.use(express.static(path.join(__dirname, 'public')));***  

```js
app.use(express.static(path.join(__dirname, 'public'))); 

```

Remember by using express.static we basically define that all the static assets will always automatically be served from a folder called public, So, that's why we say css/style.css, without specifying a public, in fact it's in public folder, So, this css folder is inside of public folder, and same for the images.

**Another really cool thing is to actually use variables in here.** So, let me show how we can actually pass data into a template and then how we can use that data right here in pug.  

Remember we've this route app.use('/', (req, res) => {  
res.status(200).render('base'); })  to render our base template. In order to now pass data into this template all we need to do is to define an object here in that .render() method, in middleware and then we'll simply put some data in there. and that then be available in the pug template.  

```js
app.get('/', (req, res) => {
res.status(200).render('base', {
    tour: 'The Forest Hiker',
    user: 'Muhammad',
});
});
```

This variables that we pass in here in object, they are then called `locals` in the pug file. Now let's actually go ahead and use that data. We want to put that tour variable on to h1, Simplest way of doing that is simply use the equal operator like this:     ***h1= tour***, ***h1= then space then variableName***

**In Pug we can crete two kinds of comments.** 1- by using // just like in javascript, and this will then create a comment that's gonna be visible in the html. // h1 The Park Camper, if we now take a look then in inspection, here is the comment, So double slash basically creates an html comment. If we really want to be a comment for the pug file, not really being outputted to html,  we need to add dash.  
**So this kind of code that we write here is called buffered code.**  

And actually we could also write some javascript here, like h2= user.toUpperCase(),
If we have buffered code, then we also have unbuffered code, basically unbuffered code is code that is not going to add anything to the output. and we write that that by writing dash and let's simply do some javascript.  

```pug

// Buffered comments

//- Unbuffered comments

```

There is actually way of writing code, that is called `interpolation`, that one look bit like a ES6 template strings, but here instead of $ we use #. like this title Natours #{tour}, here we have to do like this because one part is not a variable(Natours) and another one is(tour).  

```pug
- var msg = "not my inside voice"; // - indicates this is Js code
p This is #{msg.toUpperCase()}  // here we used interpolation
```

**`Simple Pug Code`**

```pug
doctype html
html
  head
    title Natours | #{tour}
    link(rel='stylesheet' href='css/style.css')
    link(rel='shortcut icon' type='image/png' href='img/favicon.png')

  body
    h1= tour
    h2= user.toUpperCase()
    // h1 The Park Camper

    - const x = 9;
    h2= 2 * x
    p This is just some text

```

---

## `Creating_Our_Base_Template`

Let's now start to really create our base template. So the template upon which all other templates will be based on later. So, basically we'll be converting a regular html file, that is in the starter files to a pug template.  
So basically we're gonna start creating the layout of the main page, the header and the footer, not the content,  because that we'll then build more dynamically a bit later.  

Here lets now put a visible comment to our html, saying HEADER.  

Here we have header with a class header, and all we need to do to specify a class, is dot and then class name. Here we using the `BEM Architecture in CSS`, here nav is the block and tour is the modifier in class name nav--tours. And __(double underscore) means this is a element, in nav__search.  
When it's a div element, then we don't even have to say div.className, we can get rid of div.

Let's open the overview.html file, so that we can basically convert it to pug. overview.html file is the original html file that is created to design the overview page that will render dynamically.  

Let's first build head. In head we've missing the stuff which is required for the responsive design. like meta tags. and also google font links.  
Next up, let's take a look at our header, the menu bar.

Needing the extra line for only specifying the li with each a element, is not really ideal, And so what we can do here is use a colon like this li: a(href='#') About us

```pug
doctype html
html
  head
    meta(charset='UTF-8')
    meta(name='viewport' content='width=device-width, initial-scale=1.0')

    link(rel='stylesheet' href='css/style.css')
    link(rel='shortcut icon' type='image/png' href='img/favicon.png')
    link(rel='stylesheet' href='<https://fonts.googleapis.com/css?family=Lato:300,300i,700>')

    title Natours | Exciting tours for adventurous people
  body
    // HEADER
    header.header
      nav.nav.nav--tours
        a.nav__el(href='#') All tours
      .header__logo
        img(src='img/logo-white.png' alt='Natours logo')
      nav.nav.nav--user
        //- a.nav__el(href='#') My bookings
        //- a.nav__el(href='#')
        //-   img.nav__user-img(src='img/user.jpg' alt='User photo')
        //-   span Yogovi
        button.nav__el Log in
        button.nav__el.nav__el--cta Sign up

    // CONTENT
    section.overview
      h1=tour

    // FOOTER
    footer.footer
      .footer__logo
        img(src='img/logo-green.png'  alt='Natours logo')
      ul.footer__nav
        //- li
        //-   a(href='#') About us
        li: a(href='#') About us
        li: a(href='#') Download apps
        li: a(href='#') Become a guide
        li: a(href='#') Careers
        li: a(href='#') Contact
      p.footer__copyright &copy; by Muhammad Ahmad Yogovi.
```

---

## `Including_Files_into_Pug_Templates`

In this lecture, I want to just very quickly show you a feature that we actually have in all programming languages, which is to include one file and this case, one template into another template.  
So let's say that we wanted to keep our base layout here really clean without any content in it. And so what we're gonna do is to put all the code for the header into one header file. and then include that file right here. and the same also for the footer. And then our content block, become very clean element only with includes.  
Let's create a new file for the header and then for footer. We'll prefix these files that only serves for being included with an underscore.

We use a nice extension that take care of indentation.  
***Install Pug beautify***, After installation select all the codes and press a short cut keys ctrl+shift+p and then type pug and then... it will format the code.

After creating a new files all we need to do is to say include _header, and again no need of .pug extension.

```pug
// HEADER
include _header

// FOOTER
include _footer

```

*That's the simply including some files, one into the other.*

---

## `Extending_Our_Base_Template_with_Blocks`

In this lecture I will show you how to use one of the most important and also most complex features of the Pug. And that are `extends`. **With extends, we'll be able to use the same base layout for every single page that we want to render.**  
Right now we have our base template kind of finished, with a header and footer. So now, let's actually start filling out its content. Now of course we want to load different content for different pages. And to start we want to have a overview page with all the tours, and then a page with all the tour details for one specific tour. So, let's now implement some routes for both of these pages.  
We gonna do that right below the first one that we already created in the app.js.

And now in this overview page we will actually want to render a template called overview, that doesn't yet exist, and lets now quickly go ahead and create that one. And also pass in some data. we'll pass in the title of the page, ***title: 'All Tours'***  
Now let's create the /tour routes. Because we also want a route for a specific tour.

```js
app.get('/overview', (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours',
  });
});

app.get('/tour', (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
  });
});
```

Now in each of these templates and in in this case the overview, we only want to put the content for that specific page. **So we want no footer here and no header and none of the stuff that we have in the base. Really just the content for overview page. So that's exactly what we're going to put in this file. And then we will basically inject this content into the base template, which we can call the parent template. And this process is then called extending.** **So whenever the overview template is rendered, we then take the base template and fill it up with the content of this overview page and so we extend it.**  

So let's implement it in the overview page.  
So first off, In the base file we need to put a block. And that block, we call it content. then inside that block we can actually also have some content. But this content will then later be overwritten. so let's put it just as place holder.

```pug
// CONTENT
block content
  h1 This is a placeholder heading
```

Now we can go to the overview page and say that we want to extend our base template. And also here in overview we create a block called content. And then in there we can as always put our content. So here we basically redefine the content block that in the base.  
Now each file can only extend one other file. We can only extend the base here. But we can have different blocks in each of the files.  
Let's now go ahead and do the same thing in tour.pug file.

```pug

//- BASE FILE
block content
  h1 This is a placeholder heading

//- OVERVIEW FILE
extends base
block content
  h1 This is the tour overview

//- TOUR FILE
extends base
block content
  h1 This is the tour detail page
```

### `QUICK RECAP`  

We want to use this base template kind of as our starting point, so as a skeleton that has all the html stuff, like head, header, and footer, but not the specific content for each page. Then in each of these pages we only have the content for that page itself. And we can do that because we can basically inject this content from overview page to the parent base template by using extends. Basically the extends is like as the opposite of the including. [we included the header and footer files into the parent file base. so here the parent include the children], but with extends, it's the other way around, where basically the children that kinds of includes the base.

One thing that we have the title variable(app.js) on /overview and /tour, so we can put these using on html title tag on head. We can actually do that right here in the base template. When the overview and tour extends the base template, then the base template still has access to the locals/variables, that we passed into the template. So on title tag in base.bug, we can interpolation with the variable. so just specify the variable name in the #before curly braces, ***title Natours | #{title}***

---

## `Setting_up_the_Project_Structure`

Now we understand the basics of bug, It's time to do some refactoring and to fit our code better into the `MYC Architecture`.  
Just like resources we'll also going to create a router and the controller to the view as well, so basically a file where we can put all the routes that we need in in order to build our dynamic website. So cut the all 3 routes from the app.js and pase in viewRoutes.js file.  
Next up, we actually need to mount this router to our application. In the app.js just like we did before. we'll mount to the root. **app.use('/', viewRouter);**  
Now just as a final step, let's just just like before, actually exports these function(handler) from viewRoutes, here into a controller. and then import it in viewRoutes file.  
Finally we do not want a route called overview but instead, we want to show the overview right when we open the page. So use this: router.get('/', viewsController.getOverview);  

---

## `Building_the_Tour_Overview`

Now we're gonna start really build the **tour overview page**. And remember right now the overview page doesn't have any real content, and so that's what we're gonna add in this lecture. Which is the root file and the controller that is in charge fo rendering this page is the getOverview controller.  

**Let's first go there in getOverview handler in viewsController file and layout the steps that we're going to take in order to render this page.**

1) **Get Tour data from Collection:**  
    First we need to do is to get all the tour data from our collection. It means that of course we first need to actually import the tour model here in the viewController.

    ```js
    const tours = await Tour.find();
    ```

    **And now what we are actually doing to do with this tour data?**  
    Well, we're gonna have to pass all this tour data into the template, so that in there we can actually use and display it on the website. And so that's actually very easy to do. All we need to do is to put the tours in to the object that we passed in the .render function, after title. Great, so whenever there is now a request for the overview page, basically for our homepage of our dynamically rendered website, all the tour data  will be retrieved from our database and that data will get passed into our template. And so now all we need to do is to actually build that template.  

    ```js
    exports.getOverview = catchAsync(async (req, res, next) => {
      // 1) Get tour data from collection
      const tours = await Tour.find();

      // 2) Build template
      // 3) Render that template using tour data from 1)
      res.status(200).render('overview', {
        title: 'All Tours',
        tours
      });
    });
    ```

    So let's move over to the overview.pug file.

2) **Build template**  
    Then second, we're going to build our template, and we're to gonna do that in this controller.

    We have pre build overview.html file in public folder. So let's take a look to that file. Just like we build our header, now it's time to build our main content of overview page just take pre-built(overview.html) template as a reference.

    What's import to note here is that in the main section there are 9 cards, one for each tour. So actually we want to create a pug template for this card only. So that we don't have to write it manually over and over for each of the card. So that's in tourCardTemplate.pug file, there will be an entire code for one card basically translated to put code. let's copy all of that and put it in the overview.pug file.  
    Right now we have a completely static card here. So, it doesn't yet use the data that we pasted into the template.  
    Now the thing is that of course we want to have one card for each of the tours, And so basically what we want to do now is to loop through that tours array that we passed into the template as a response user .render() method from viewController.js file. **Remember that tour is an array**, because it contains multiple tour documents in it. And so let's now loop over array and create one card for each of the tour documents. And luckily that's very easy to do in pug because basically pug comes with built in loops. each tour in tours, tours here is the variable that we passed in and then in each iteration the current variable will be called tour. And inside of this loop we will put the card pug codes using indentation.

    ```pug
    each tour in tours
    <!-- Then all the codes -->
    ```
  
3) Render that template using tour data from step#1

    ```js
    const Tour = require('../models/tourModel');
    const catchAsync = require('../utils/catchAsync');

    exports.getOverview = catchAsync(async (req, res, next) => {

      // 1) Get Tour data from Collection
      const tours = await Tour.find();
      // 2) Build template

      // 3) Render that template using tour data from step#1

      res.status(200).render('overview', {
        title: 'All Tours',
        tours,
      });
    });

    exports.getTour = (req, res) => {
      res.status(200).render('tour', {
        title: 'The Forest Hiker Tour',
      });
    };
    ```

### `OVERVIEW.PUG FILE ⤵`

```pug
extends base
block content
  main.main
    .card-container
      each tour in tours
        .card
          .card__header
            .card__picture
              .card__picture-overlay &nbsp;
              img.card__picture-img(src='img/tour-1-cover.jpg', alt='Tour 1')
            h3.heading-tertirary
              span The Forest Hiker

          .card__details
            h4.card__sub-heading Easy 5-day tour
            p.card__text Breathtaking hike through the Canadian Banff National Park
            .card__data
              svg.card__icon
                use(xlink:href='img/icons.svg#icon-map-pin')
              span Banff, Canada
            .card__data
              svg.card__icon
                use(xlink:href='img/icons.svg#icon-calendar')
              span April 2021
            .card__data
              svg.card__icon
                use(xlink:href='img/icons.svg#icon-flag')
              span 3 stops
            .card__data
              svg.card__icon
                use(xlink:href='img/icons.svg#icon-user')
              span 25 people

          .card__footer
            p
              span.card__footer-value $297
              span.card__footer-text per person
            p.card__ratings
              span.card__footer-value 4.9
              span.card__footer-text rating (21)
            a.btn.btn--green.btn--small(href='#') Details
```

---

## `Building_the_Tour_Overview [PART-2]`

Let's now fill each of the card elements with the correct data for each of the tours.  
So just as a quick recap, In a last lecture we started by creating this main element and inside a div container element then inside of that container we want one of these card elements for each of the tours that comes in the array that we passed into this template, For that we use pug array loop.

Let's start filling the data from the tour name. just like this: span= tour.name, that's it.

Let's put for image the alt text to tour name. Here in alt we simply put tour.name here, because we're inside of a string and so doesn't work. And so the easiest way of doing that is actually use ES6 template strings.  
Next up let's then specify the image, actually href attribute. In database we only have the name of the image itself. So not the path of image. So that we have to actually have to manually specify. can see on compass, we have image of with imageCover field. All images are in public folder from which all the static assets are going to be served, in there we've img folder and then one folder for tours and one for users. Inside of tours we then have 3 pictures and 1 cover photo.  

```pug
img.card__picture-img(src=`img/tours/${tour.imageCover}`, alt=`${tour.name}`)
```

Let's now build h4 saying 'Easy 5-day tour', here this string is combination of different data. So, we have the difficulty, and the tour duration.

```pug
h4.card__sub-heading=`${tour.difficulty} ${tour.duration} day tour`
```

Next up we have a span element with a startLocation. So, startLocation is an object. So, here we want

```pug
startLocation.description.
```

Next up we're gonna use to start dates, Now keep in mind startDates is an array. Now we want in our overview page is basically the date where the next tour starts, so that's basically the first element of that startDates array.  
Next, this piece of data, 3 stops, which says how many stops there in these tours. Basically that means how many location we have. so we use locations field, not startLocation.  
And finally the amount of people that are part of each of the groups. So, the people that can participate in our tour.

Let's test all of these. yes, Only the dates looks kind of weird, we really just want june 2021, So, we don't need to be all that specific like time, gmt etc.  Let's fix that, and thankfully that's actually very easy with javascript. Really keep in mind tha each of the startDates is really a date object in our database. So now we can use a function like this one.

```pug
span= tour.startDates[0].toLocaleString() 
```

Basically it'll convert this date into nice readable string, and in this toLocalString we can pass an option for the language and then also an object with some options so here as an property of object we can say a month should be long, so instead of just an abbreviation(Apr, Jun),  and also saying the year should be numeric.  

***Google this function toLocalString*** *-very interesting*

Now only two things remaining, the price and the rating details. price is simple, For average rating it's also so simple.

And now finally we need to build the URL to the detail page. So, remember that when we chick on one of the cards, it then takes us to the detail page, and so of course here on detail button we now need to specify that link and of course that will depend on each tour. To want to link '/tour' then we want to query tour by their slug, not by their ID how we did in API. Because that actually makes the url look much nicer. So, link will look like this: `/tour/${tour.slug}`  
All urls starting with the slash like /tours called a relative url, and this will do is add this piece of the url after the host name. right now it's localhost.

Whenever we need a real space between two inline-block elements then we need to manually create that spaces, using this piped line with space(| ), like we did between tour.price and 'per person' to create space between them. This space is not inside of these two element, just between them.

```pug
extends base

block content
  main.main
    .card-container
    
      each tour in tours
        .card
          .card__header
            .card__picture
              .card__picture-overlay &nbsp;
              img.card__picture-img(src=`/img/tours/${tour.imageCover}`, alt=`${tour.name}`)
            h3.heading-tertirary
              span= tour.name

          .card__details
            h4.card__sub-heading= `${tour.difficulty} ${tour.duration}-day tour`
            p.card__text= tour.summary
            .card__data
              svg.card__icon
                use(xlink:href='/img/icons.svg#icon-map-pin')
              span= tour.startLocation.description
            .card__data
              svg.card__icon
                use(xlink:href='/img/icons.svg#icon-calendar')
              span= tour.startDates[0].toLocaleString('en-us', {month: 'long', year: 'numeric'})
            .card__data
              svg.card__icon
                use(xlink:href='/img/icons.svg#icon-flag')
              span= `${tour.locations.length} stops`
            .card__data
              svg.card__icon
                use(xlink:href='/img/icons.svg#icon-user')
              span= `${tour.maxGroupSize} people`

          .card__footer
            p
              span.card__footer-value= `$${tour.price}`
              | 
              span.card__footer-text per person
            p.card__ratings
              span.card__footer-value= tour.ratingsAverage
              | 
              span.card__footer-text= `rating (${tour.ratingsQuantity})`
            a.btn.btn--green.btn--small(href=`/tour/${tour.slug}`) Details
```

---

## `Building_the_Tour_Page`

In this lecture and the next one, we're gonna build the tour detail page. And along the way we gonna learn some more cool pug techniques, like `Conditionals` and `Mixins`.  

`Challenge:` Build routes for tours and then controller function for getTour in viewController.

```js
// THE ROUTER
router.get(`/tour/:slug}`, viewsController.getTour);
```

**`STEPS`**

1) **Get the date**, for requested tour(including reviews & guides),  we also needs a reviews here and tour guides.
2) **Build Template**
3) **Render template using data from step1**

```js
// THE HANDLER
exports.getTour = catchAsync(async (req, res) => {
  // 1) get the date, for requested tour(including reviews & guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  // 2) Build Template

  // 3) Render template using data from step1
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
    tour,
  });
});
```

Now all we need to do is to go ahead and build our template. We have already built-in template for it as well. just like before copy and paste.  
let's test it...  

For some reason CSS is not working.  
That is because we're in tour route, so it's trying to find css folder inside of the tour, but that of course does not exist. We need to fix the way that we import the css in our base template. So, basically we should have a slash before the css folder like this href='/css/style.css', and that's then gonna to start at the root of the page.

Let's now start using dynamic data, according to the tour.  
Remember that the variable that we passed in here is called tour as a response from handler.

In section description we have four same overview box here, the only things that changes is that icons names, then the description of the box and the value of description. Since we don't like repeated code, lets use another feature of pug called mixins.  

**Mixins** are basically reusable pieces of code that we can pass arguments into. So bit like a function, and also it's exactly like mixins in SASS. Lets copy that repeating code and then create a mixin out of block at the top.

We write mixin keyword and then the name of the mixin, and then we can specify some arguments.  
**`MIXIN`**

```pug
mixin overviewBox(label, text, icon){
  .overview-box__detail
    svg.overview-box__icon
      use(xlink:href=`/img/icons.svg#icon-${icon}`)
    span.overview-box__label= label
    span.overview-box__text= text
}
```

And now we can use this mixin. We use this mixins by writing plus and then just like a regular function we pass the arguments.

**`CALLING MIXIN`**

```pug
+overviewBox('Next date', date , 'calendar')
```

Here also for date we have to use .toLocaleSting('us-en', {}), So for that we use a javascript variable and then will and then use that variable.  

***Remember to produce javascript code which will not going to produce any output, we use this syntax: starting with hyphen***

```js
const data = tour.startDates[0].toLocaleString('en-us', {month: 'long', year: 'numeric'})
```

---

## `Building_the_Tour_Page_[Part-2]`

Next up it's time to build the 'Your Tour Guides' section. Now we don't know how many tour guides there actually are on each tour. And so just like on overview page here we need to have another loop through all the guides that are associated with a certain tour.

Will create a loop here, which in each iteration will create a box with elements. Each of the guides is the user with role of guide, and all users have property of name, photo, etc.  
Remember we used populate so it will not be just like we have in tour.guide in database, but we also should have a properties that we specified while populating.  
Label would be tour guide when its a regular guide, and lead guide.  
To print tour guide/lead guide if we put just like this tour.role. then it's printing guide and lead-guide.   that's not looking good, so now it's time to use conditional. Now pug actually has conditionals built in, but they are really simple and we can't do a lot of stuff with them. But the good thing is that we can actually still use javascript for that. So, again we use unbuffered code for that, so with the dash symbol. so we use if block here.

Now move up to the description texts. In heading we have the name of the tour with some string. So use create a template string. For description we want to put the texts in two paragraphs, that are in the description field. In description field there is \n between both paragraphs. so we gonna split the string by the new line character(\n). that will create an array, so then we iterate on the array.

Let's now move on the images section. We have three images here displaying side-by-side. These image names are stored in images filed, there we have an array of three images name. So, once more we're going to use a loop. Here we have to change CSS class name as well for each image. **How we change img--1, then img--2, and then im--3?** Well in pug loop we can actually define a second variable and that one going to be the index.  
But to add that index to the css class, it might not be that easy, because we cannot use the string template. So instead of img.picture-box__img.picture-box__img--1 **we can use class attribute for the second class name in this case, that's exactly the same.** To the class attribute we can use template string. just like this:  

```pug
each img, i in tour.images
  .picture-box
    img.picture-box__img(src=`/img/tours/${img}`, alt=`${tour.name} ${i + 1}`, class=`picture-box__img--${i+1}`)
```

Next section is the map, which we'll leave for the next lecture.  
**So now we have the reviews section. Now where are these reviews actually coming from?** Remember in the view controller we did populate the reviews field with the actual review data. And so right now we have tours.reviews which is an array of all the reviews. So, here we are going to create yet another loop inside the div [.reviews] element. Here we have a lot of codes in review section, so let's create a mixin here.  
And remember in review we have the review itself, rating, and then user, and in user we have user.name and user.photo.
The harder part is going to be to display the actual rating, because we have to display one of these elements here(svg icon) or each of the number of stars that the review has.  So five start review needs all of these five starts, 4 stars only needs four of them + a gray star.  
So what we gonna do here is to print the amount of stars in a loop. So there are five possible stars so we loop from one to five. Then in each star we test if the tour the tour rating is higher or equal to the current the star. and if so, we green star, and if not it's a gray star. The green star has the active modifier and the gray one has inactive. So we'll change that with a template string. just like before we need this class name as an attribute. Then we use a ternary operator to check.

```pug
reviews__rating
      each star in [1,2,3,4,5]
        svg.reviews__star(class=`reviews__star--${review.rating >= star?'active':'inactive'}`)
        use(xlink:href='/img/icons.svg#icon-star')
```

EXAMPLE: let's say that we have three stars out of five, so in the first iteration, star is one. And so one is of corse less than current user's rating which is 3 in this case, so the class name should be ***review__star--active***.

Now one thing that I wanted to just show you is that we can actually also export a mixin into its separate file. So let's do that for reviews mixin. make a new file _reviewCard.pug and paste the reviewCard mixin in that file. And then in tour.pug file all we need to do is to say, include_reviewCard  

All that's left to do is call to action section. And here all we really need to change is this duration.

That's done it.

```pug

extends base
include _reviewCard

block append head
  script(src='https://api.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.js')
  link(href='https://api.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.css' rel='stylesheet')

mixin overviewBox(label, text, icon)
  .overview-box__detail
    svg.overview-box__icon
      use(xlink:href=`/img/icons.svg#icon-${icon}`)
    span.overview-box__label= label
    span.overview-box__text= text

block content
  section.section-header
    .header__hero
      .header__hero-overlay &nbsp;
      img.header__hero-img(src=`/img/tours/${tour.imageCover}`, alt=`${tour.name}`)

    .heading-box
      h1.heading-primary
        span= `${tour.name} tour`
      .heading-box__group
        .heading-box__detail
          svg.heading-box__icon
            use(xlink:href='/img/icons.svg#icon-clock')
          span.heading-box__text= `${tour.duration} days`
        .heading-box__detail
          svg.heading-box__icon
            use(xlink:href='/img/icons.svg#icon-map-pin')
          span.heading-box__text= tour.startLocation.description

  section.section-description
    .overview-box
      div
        .overview-box__group
          h2.heading-secondary.ma-bt-lg Quick facts

          - const date = tour.startDates[0].toLocaleString('en-us', {month: 'long', year: 'numeric'})
          +overviewBox('Next date', date, 'calendar')
          +overviewBox('Difficulty', tour.difficulty, 'trending-up')
          +overviewBox('Participants', `${tour.maxGroupSize} people`, 'user')
          +overviewBox('Rating', `${tour.ratingsAverage} / 5`, 'star')

        .overview-box__group
          h2.heading-secondary.ma-bt-lg Your tour guides

          each guide in tour.guides
            .overview-box__detail
              img.overview-box__img(src=`/img/users/${guide.photo}`, alt=`${guide.name}`)

              - if (guide.role === 'lead-guide')
                span.overview-box__label Lead guide
              - if (guide.role === 'guide')
                span.overview-box__label Tour guide
              span.overview-box__text= guide.name

    .description-box
      h2.heading-secondary.ma-bt-lg= `About ${tour.name} tour`
      - const parapraphs = tour.description.split('\n');
      each p in parapraphs
        p.description__text= p

  section.section-pictures
    each img, i in tour.images
      .picture-box
        img.picture-box__img(src=`/img/tours/${img}`, alt=`The Park Camper Tour ${i + 1}`, class=`picture-box__img--${i + 1}`)

  //- section.section-map
  //-   #map(data-locations=`${JSON.stringify(tour.locations)}`)

  section.section-reviews
    .reviews
      each review in tour.reviews
        +reviewCard(review)

  section.section-cta
    .cta
      .cta__img.cta__img--logo
        img(src='/img/logo-white.png', alt='Natours logo')
      img.cta__img.cta__img--1(src=`/img/tours/${tour.images[1]}`, alt='Tour picture')
      img.cta__img.cta__img--2(src=`/img/tours/${tour.images[2]}`, alt='Tour picture')
      .cta__content
        h2.heading-secondary What are you waiting for?
        p.cta__text= `${tour.duration} days. 1 adventure. Infinite memories. Make it yours today!`
        button.btn.btn--green.span-all-rows Book tour now!
```

---

## `Including_a_Map_with_Mapbox`

Next up, we're gonna learn how to integrate a nice map that displays all the locations of a certain tour into our website using Mapbox. So, to display map we're gonna use a very nice library called 'Mapbox'. This library actually runs in the front end. And so this lecture we're actually going to write a little bit of front end code, not so much about the back end. But this is still very important because now we gonna learn how to write javascript for for the client side and then integrate that into our templates. So let's do that.  
Remember all the assets/data that are available on the client are in the public folder. For example our css files, images, and we also have a folder called js. so, let's create a new file in that folder called  mapbox.js

So this basically is a javascript file that we're gonna integrate into our html and which will then run on the client side. So, just like regular javascript file.
Let's integrate it into our templates. Now it might appear that the best place to do this integration is our base template. But in fact, we only want to include the mapbox script on the tour page. So how could we do that?  

And the solution for that is once more, extending a block here  in our base template. So we're going to create a new block here in base and that will then gonna extend from the tour. Remember when we extend the block then the content inside that disappears. But actually there is another way of extending blocks, which will then simply add the new content at the end or at the beginning of the block. So, let's see how we can do that.  
So in tour we write block append head, And so whatever we will write in this block here will then be appended to the content that's already in that block. And we could also use prepend, which will then add at the beginning of the bock. Now inside of head bock in the tour file all we gonna do is to add a new script. It's done when we reload any tour page, we should get a message saying 'Hello from the client side' that we console from the mapbox.js file.

Next up we want to get access to the location data of the tour that we are currently trying to display, right in the javascript file. So how are we going to do that?  
Well, we might do an **s**, basically a call to our API and get the data from there. But that's not really necessary in this case. So, let me show you a real nice trick. So, in tour.pug we already have all the data about the tour itself and now we can simply put that data into our html so that the javascript can then read it from there. So, basically we're gonna expose the location data as a string in the html and our javascript will then pick it up from there without having to do like any API call separately.  
So, let's come to our map section in tour.pug file, there we actually map (div)box with #map id, Here we want to specify the data attribute. So, there is a very nice trick in javascript where we can specify a data attribute in html, and then read that attribute using javascript in a very easy way. like this ***#map(data-locations= `${tour.locations}`)***, As in our database location is an array, so we need to transform that array into a string. so we use ***#map(data-locations= `${JSON.stringify(tour.locations}`))***, Remember in html of course we cannot have arrays or objects or anything like that so we converted to string. Now if we take a look at our html elements using inspect, there we have a data locations attribute on #map which contains all the info about locations in a huge string.  

And so in javascript(mapbox.js) we can get that very easily, because whatever we put into a data attribute like that, it will then stored into the dataset property, in this case dataset.locations because it's called data-locations, remember that locations data is a string so we need to convert it into a json, so we use ***JSON.parse(document.getElementById('map').dataset.locations);***  
Now test it. Now something going wrong in our mapbox file. So, I believe that probably the problem is that at the time we called our get element by id, the DOM is actually not already loaded. That's because we have our script integrated right at the beginning, in the head, while it really should be at the bottom of the page. So put that one at the bottom of the base file.  
Now check it, Yeah we an array here. which contains all the locations of the tour.

```js
console.log('Hello from the client side :D');
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);
```

---

## `Including_a_Map_with_Mapbox_[Part-2]`

Let's now continue building our map integration. And so let's now head over to a mapbox documentation. <https://www.mapbox.com/>  We're using mapbox instead of google maps, that's because some time age, google maps started to actually require a credit card. So it's not a free.  
let's create a new account.

***`Review lecture #186`***

---

## `Building_the_Login_Screen`

Over the next couple of lecture we'll add the login functionality to our website. In this lecture we'll start by actually rendering out the login screen to make it easy for users to login.  
Small challenge. Create a /login route. then create a controller, and a template.

```js
router.get('/login', viewsController.getLoginForm);

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};
```

Write a html on login.pug.  

Now comes a trick that where we extend the base template. So this one(login.pug) will extends the base file and don't forget after that we need to create a block with the exact same name as we have in the base file. so that's content.  
Now just one more thing that we need to do is to actually set a link to the login page, so that we can access that.  So right now the login and signup buttons are actually using the button element. but like this we cannot really specify the href attribute. so change them to real like(a tag) and then we can specify the href.  
Signup form is not implemented, because the whole process of signing up is going to be very similar to logging in.

```pug
extends base

block content
  main.main
    .login-form
      h2.heading-secondary.ma-bt-lg Log into your account
      form.form.form--login
        .form__group
          label.form__label(for='email') Email address
          input#email.form__input(type='email', placeholder='you@example.com', required)
        .form__group.ma-bt-md
          label.form__label(for='password') Password
          input#password.form__input(type='password', placeholder='••••••••', required, minlength='8')
        .form__group
          button.btn.btn--green Login
```

---

## `Logging_in_Users_with_our_API`

Now it's time to use the login API that we built in previous sections and there is a ton of stuff to do here in order to make the front-end interact with the back-end.  
So, we're gonna allow users to log into our website by doing an HTTP request, or an ajax call as many people like to call it also.  
And we're doing that HTTP request to the login API end point that we implemented before, using the data that the user provides in this login form. And so remember that our API will then send back a cookie which automatically gets stored in the browser and also automatically gets send back with each subsequent request. And this is a fundamental key in order to make our authentication system work.  
Anyway since we're doing HTTP request in the browser, we will of course, be working on the client side javascript code, just like we did with the mapbox implementation.  
so, let's now go ahead and create a new file in js folder called login.js

Let's now start by adding an event listener, listening for the submit event on our login form. So our login form has form class, so let's now select this form element. and then on there, listen for the submit event, so basically an event that the browser will fire off a user clicks on the submit button on the form. And in the callback function we'll gonna access to that event itself. First say is to say event.preventDefault(); so this prevents the form from loading any other page.  

Next up, let's actually get the email and the password value that the user puts in. These are in the elements with the id of email and password fields. We use the value property on getElementById, in order to read that fields value.  

```js
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
```

Now let's do the actual logging in in a separate function. let's now create that logging function. and this function going to accept an email and the password.  
let's simply test it, so we need to include this login file into our base template.   alert(email, password); So, here we get our alert with the email we put in on the form.  

So, in order to do these HTTP requests for the login, we're going to use a very popular library called `Axios`, In the next video we're actually going to download this library from npm and bundle it together with with all our other js scripts, But now let's use it from a CDN.  
***script(src='<https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.2/axios.min.js>')***  
Copy this in our base script template, and this will then expose an Axios object to the global scope, which we can then use in our login function.  
In **Axios** function we pass in the options for our request. Here as an option we then put, request method, request url, in this case the login end point of our api And then we need to specify the data that we're sending along with the request in the body.  
Now, Axios returns a promise and so let's actually use a async/await in order to wait for that value to come back. Now keep in mind that this is client-facing code and only the more modern browsers can run async/await functions. let's save the result of the promise into a res(result) variable.  
Now one thing that I really like about Axios is the fact that it's going to throw an error whenever we get an error back from our api endpoint. So let's say that there is a wrong password and so the server will send back a 403, basically an error. An so whenever there is an error Axios will trigger an error as well. that's very handy, because with that we can now use a try catch block. in order to do some error handling in the client side.

If we type any correct email and password, we get a 200 response, with the data. In data we have a status and token, as we specified in login. Now here what's really interesting is to take a look at our cookies. And we do that in google chrome by clicking on a i icon besides the url. In cookie it has exactly the web token that we see in console. And it's this cookie here, who will actually enable us to build this entire authentication. Because the browser will now send this cookie along with every new request.  
Lets see this cookie in backend.  

In order to actually get access to the cookies that are in a request, in Express we need to install a certain middleware. And so we need to install that from an npm package.  
***npm i cookie-parser***  
Basically this package will then parse all the cookies from the incoming request.  
Now use this middleware in app.js file.  

```js
const cookieParser = require('cookie-parser');

// let's use it close to the body parser.
app.use(cookieParser());

// let's log cookie in a middleware.
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});
```

Now on each request we will always display all the cookies in the console. So if we reload any page from our website, we should that cookie here in console, If we reload again we see another one.  
And so now, we can use this cookie in order to protect our routes. So let's implement but before do that we need to add this in our autController(in protect function). Right now we're only reading the json web token from the authorization header, and only if they start with bearer, so for the bearer token. But now we basically also want to read the Json web token from a cookie. And so what we can do here is basically add else if block.  
so, if there is no token in the authorization header, then let's take a look at the cookies. so else if(req.cookies.jwt) here jwt is the name of the cookie.  

```js
let token;
if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
  token = req.headers.authorization.split(' ')[1];
} else if (req.cookies.jwt) {
  token = req.cookies.jwt;
}
```

Now with this we're also able to authenticate users based on token sent via cookies.  
Just to test let's protect one of our view routes. We'll protect our tour detail page. Just like before require the authController file in viewRoutes file and then in that route add protect middleware.

```js
const login = async (email, password) => {
  console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: '<http://127.0.0.1:3000/api/v1/users/login>',
      data: {
        email: email,
        password: password,
      },
    });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  login(email, password);
});
```

---

## `Logging_in_Users_with_Our_API_[Part-2]`

The fist thing we want to do in this video is to conditionally rendering  the login/signup part of the page. That means is to render login and signup  buttons in case the user is not logged in, And in case the user is in fact logged in then render some kind of user menu, and also a log out button.  
So that kind of rendering should of course on the back end, so in one of our pug template.  

***Now, how will out template actually know if the user is logged in or not?***  
Well, Actually in order to determine that we will have to create a new middleware function, and really the only goal of this new middleware function is going to be if the user is currently logged in or not. Now you might think that our protect middleware also does something similar, and actually, it' similar. But the difference is that one only works for protected routes, but our new middleware function is going to be running for each and every single request on our rendered website.  
Let's now put that in our authController file.  

So this middleware really only for rendered pages, so the goal here is not to protect any route. So there never be an error in this middleware. In this the token should come from the cookies not form the headers. So for our entire, rendered website the token will always only be sent using the cookie, and never the authorization header, that one is only for the api.  
So here we check if there is JWT in cookie, if it's there on JWT then we'll first verify the token, and also check if the user still exist, and also if the user changed the password after issued the token, exact similar to the protect, but here we no need of error.  
If all of these if statements are true, it means that there is a logged in user. So what we want to do in this case, is to make that user accessible to our templates. **And how can we do that?**  
Well, that's actually something that we didn't do before.  
We can do response.locals and then put any variable in there. And our pug templates will then get access to them. so,if we say res.locals.user then inside of a template there will be a variable called user. So again, in each and every pug templates will have access to response.locals, and what ever we put there will then be a variable inside of these templates. So it's a little bit like a passing data into a template using the render function.  

Again; if there is no cookie, then there is no logged in user, so we call next() right away, and we will not put the current user on response.locals. But if there is a cookie, then we go through all of verification steps(if statements) and in the end if none of them called the next() middleware in the stack, then that means there is a logged in user. And so therefore, we put that user into response.locals, and like that we then have access to that user in our pug templates for example in the _header, which is actually where that user navigation will be.  

Let's come to viewRoutes and add this newly created middleware, We want this middleware in each single routes that we have in viewRoutes file. We do that bit like before we did with the protect middleware.  
After that we're ready to use this. So let's come here to to our_header and use a conditional. Now remember how I said before that the conditionals in pug is not very powerful and so many times we actually use JavaScript. But for what we want to do now they are actually good enough. All we want to do now is to say if user SEE HEADER FILE

If there is a user then we want to display this. In the place of name we want only first name, so lets split the name using space then only display the first one.  
Now test this out because I'm actually really curious to see if this works. Yes! it's working.

```pug
header.header
  nav.nav.nav--tours
    a.nav__el(href='/') All tours
  .header__logo
    img(src='/img/logo-white.png' alt='Natours logo')
  nav.nav.nav--user
    if user
      a.nav__el.nav__el--logout Log out
      a.nav__el(href='/me')
        img.nav__user-img(src=`/img/users/${user.photo}` alt=`Photo of ${user.name}`)
        span= user.name.split(' ')[0]
    else
      a.nav__el(href='/login') Log in
      a.nav__el.nav__el--cta(href='#') Sign up
```

Next up what we wanted to fix here is to actually get an alert here, and also then the reload the page after some time. Not really reloading actually, but instead sending it back to the homepage. we only ever see that user menu when we reload the page. So that's what we will do now automatically in our javascript code here, in login.js file.

We will also see how we can send data directly from an html form into our Node application. Of course there are two ways. One way is to send data using an HTTP request like we did here in login.js, in try block, And another one is to simply directly use an html form, that one is very important as well, so we do this a bit later in the course.  
only see that alert window and reload only in case we are really sure that our API call was successful. so if(res.data) this data is the the data that we sent as our json response,  and so from there we can read .status and check if it is = to success. then show an alert with message 'Logged in successfully', after one and half seconds load the front(home) page. so we use setTimeOut with 1500ms, and in order to load another page we say location.assign('/'); Then in case we were not successful we alert(err.response.data.message);  

```js
// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
```

---

## `Logging_in_Users_with_Our_API_[Part-3]`

Let's now finally finish up this login functionality. In this lecture we wanted to implement a really nice alert for when the user successfully logs in. To see that lets logout the user by removing the cookie manually. So now the user should no longer be logged in, As we already know, that's because the cookie wasn't send in the request, and so the isLoggedIn middleware that we created did not put the user object into response.locals, and so if it's not there the user menu will not be rendered, and instead login and signup buttons get rendered.  
That alert that we're talking about we want to show up at the beginning of the page, and then after a second we want to load the home page. Anyway let's create some functions for this alert in yet another separate file in js folder.  
All right, but now before we can actually move on we need to think a little bit about our front-end architecture. We should only have one big javascript file which includes all the codes.  
And so, In modern front end development we usually use something called a module bundler. The most popular one is probably `Webpack`. But usually webpack gives us a lot of problems and it's really a pain to is it up, So there's actually a very nice new kit on the block, which is called `Parcel`.  
**`Parcel`** is fast and zero configuration web application bundler. Simply a bundler which doesn't require any complex configurations, because we don't want to waste any time with that. So, let's go ahead and install it here.  
***npm i parcel-bundler --save-dev***  

Now in order to actually use parcel let's add a script here in the package.json file.  
We're adding one to watch our javascript for that we use parcel watch command like this:  

```json
"watch:js": "parcel watch"
```

This would actually already run just fine out of the box, but we still want to configure a little bit. Because otherwise it gonna put the final bundle in some folders that we don't want them. so let's specify which folder it actually should watch. like this  

```json
"watch:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js"
```

So now when we run this, it will then take a look at this index.js file, if some thing changes in this file or one of the dependencies and whenever that happens it will then bundle all of the files together into bundle.js file.  
We also want a script for the a final version. this one we're going to run ones where really finished. I does some more optimization stuff.  

In base file we include on bundle file, so one script file that contains all the codes that in all the other files and their dependencies.

```json
"scripts": {
  "start": "nodemon server.js",
  "start:prod": "NODE_ENV=production nodemon server.js",
  "debug": "ndb server.js",
  "watch:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js",
  "build:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js"
},
```

Now the idea is basically this index.js file is our entry file and so in this one we kind of get data from the user interface and then we delegate actions to some functions coming from other modules(files) like we have login module, alert module. Just like node js we can actually export data from these modules.  
So we want to export the login function from login.js. It works little bit different than it works with the node.js, because nodejs uses commonjs in order to implement modules. But here in front end js in ES-6 there is something called modules in js. The syntax is bit a different. After exporting we can import here in index.js file.  

```js
export const login = async (email, password) => {};

import { login } from './login';
```

We use curly braces because we're doing export in this way export const login = async ....  
But there is also something similar to module.export which is kind of the **default export**.  

Lets go ahead and install axios, and import it.  

```js
import axios from 'axios';
```

Next up we should actually also install a **polyfill**, Which will make some of the newer javascript features work in older browsers as well. so,  
***npm i @babel/polyfill***  

And then import it in index.js file just like this: ***import '@babel/polyfill'***, So this one here we do not save it any variable, because that's not necessary at all. All we wanted to is to basically be included into our final bundle to polyfill some of the features of js.  

Anyway lets now import this mapbox as well, and for that we actually need to first create a function. So let's create:  

```js
export const displayMap = (locations) {
  // Wrap all the mapbox codes here.
}
```

The displayMap function will take in the array of locations, that will then be read in the index.js file. index.js is more for getting data from the user interface and delegating some actions into these other modules. Therefor this code should be inside of index.js file: Import the displayMap in index.js file Andalso call the displayMap function, that we imported.

```js
// Index.js File
import { displayMap } from './mapbox';

// DELEGATION

const locations = JSON.parse(mapBox.dataset.locations);
displayMap(locations);

```

Now remember way back when we actually created this map how it asked us if we wanted to use mapbox library on npm? So we could now go ahead and actually use that one instead of script in tour.pug. However there is a problem with this library together with parcel.

const locations = JSON.parse(document.getElementById('map').dataset.locations); This code here may created an error when we were on pages that didn't have this #map id. Because only the detail page has map id. let's fix that.  
So what I'm doing here is first to create an element with document.getElementById('map'), and then test if it actually exists, before we execute that line of code.

```js
const mapBox = document.getElementById('map');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}
```

Now let's do the final part, that we want to do in this lecture,  which is actually creating alerts.

```js
// INDEX.JS FILE

import '@babel/polyfill';
import {displayMap} from './mapbox'
import { login } from './login';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
```

So, let's create a function called `showAlert` and export that. So then in login we will import this function and use it there. This function will get in the type and msg, and this type either 'success' or 'error', because depending on this input we will then have different CSS for each of these alerts.  
So what we're gonna do is to basically create some HTML markup here and then inset that into our HTML.  
First we created a markup and then the select the element to include this newly created HTML, that's actually right at the beginning of the body element using insertAdjacentHTML(), where we pass 'afterbegin' to put inside of the body but right at starting and then the HTML.  
So this is going to create a very simple alert based on type and method, but now we actually also want a function for hiding alerts.  
Let's create that as well here. so here we select the element with the alert class and then remove that class. To remove we use a JavaScript trick, where we need to move one level up to the parent element and then from there remove a child element.  
Next up in the showAlert function we want that whenever we show an alert first hide all the alerts that already exist. So in showAlert we always run hideAlert function().  
Then finally we also always want to hide all the alerts after five seconds.  
Now let import that in login.js file. And then in there instead of js default alert we want to call our showAlert function with msg and type.

```js

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) {
    el.parentElement.removeChild(el);
  }
};

// type is 'success' or 'error'
export const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

```

NOW LETS TEST  
YEAH ALL WORKING...  

---

## `Logging_Out_Users`

In this lecture, we're gonna learn a super secure way of logging out users. So up until this point, when we wanted to delete a user, we would simply delete the cookie from our browser. However the, thing is that we created this cookie as an httpOnly cookie, and so **that means that we cannot manipulate this cookie in any way in our browser.** So we cannot change it and we can also not delete it. Remember in createSendToken function we set httpOnly: to true, and this means that we can not manipulate the cookie in the browser in any way, not even delete it.  

**So if we want to keep using this super secure way of storing cookies, then how we are going to be able to actually log out users on our website?** Because usually with **JWT Authentication** we just delete the cookie or the token from local storage. But that's not possible when using at this way(httpOnly:true).  

So, **What we're gonna do instead is to create a very simple log out route that will simply send back a new cookie with the exact same name but without the token, and that will then override the current cookie that we've in the browser with one that has the same name but no token.** And so when that cookie is then sent along with the next request, then we will not be able to identify the user as being logged in. And this will effectively then log out the user. And also we're gonna give this cookie very short expiration time. And so this will effectively be a little bit like deleting the cookie but with the very clever workaround like this.  
So let's do that in authController file right after login function.

So again; when we're doing token based authentication we usually never need an end point like this. But when we want to send a super secure cookie like we do, then we need to do it like this.  
Again; on the response we set the cookie, and the secret is to give it the exact same name, and that's JWT. just like in createSendToken function, in that we send token, but here simply some dummy text, lat's say 'loggedout', and then the cookie options. As an option an expire date is 10 sec from now. So let's create a new date based on date.now() plus 10 seconds. And also we're going to set it, again to httpOnly: true; but here we do not need to set it as secure, because in this case there is no sensitive data that any one can get a hold on. And now all we need to do is to send this response back.  

Then in our routes at [userRoutes] we need to add it, of course as well.  
This one will actually be a get request, because we're not going to send any data along with the request, we're not changing any thing, we actually simply get a cookie.  

```js
router.get('/logout', authController.logout);
```

Now we're good to actually hit that route just like in Axios library in login.js file. So lets go to login.js file.

```js
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};
```

so in logout function we will use try/catch block as well. And let's do a request with axios, and the method this time is get. URL is similar to login but with logout. Then as the next step lets also reload the page. So that's what we always do manually when we delete a cookie. And so here of course we need to do it programmatically, we need to do it here, because since this is an Ajax request we can not do it on the back end side, so we can't do it with Express. So we need to do it manually here. Otherwise we would technically be logged out but our user menu would still reflect, so it would still show that we are logged in, and so we simply need to reload the page, which will then send the invalid cookie basically to the server and then we are no longer logged in.  
***location.reload(true);*** This statement will then force a reload from the server and not from the browser cache. If we put simple location.reload without true then it might simply reload the same page from the cache, which would then still have our user menu up there. so here 'true' is very important.  
So we have our logout function and now in the index.js we basically need to now trigger it once we hit that button.

```js

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout'
    });
    if ((res.data.status = 'success')){
      location.reload(true);
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};

```

So let's create an element first by selecting the logout btn.  
Now if there is a logOutBtn then add an eventListener to that, so if there is a click event then we then call the logout function.  
That should be actually it.  

```js
const logOutBtn = document.querySelector('.nav__el--logout');

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}
```

THAT'S IT!! LET'S TEST IT OUT

---

## `Rendering_Error_Pages`

Let's now render some nice error pages to our users. And so to start, let's actually create an error first. let's open any tour, and add something to the slug. So that will then of course not be found. Now it's a JSON error just like we've seen in postman. And so lets now fix that, with nice error page.  
But first we actually need to fix this particular error. Right now we get Cannot read properties of null.. like this: "message":"Cannot read properties of null (reading 'name')", this is from our getTour, that's in viewsController.  
So there in getTour we do not have any error handling in case that there is no tour, we have that in all our other route handlers, but in this we don't have it yet. so let's add that.  

So if there is no !tour then return and do to the next middleware with a new app error.

```js
// In viewsController.js File
if (!tour) {
  return next(new AppError('There is no tour with that name.', 404));
}
```

Now let's try that again. now we should get a much nicer error. YES  
**AND KEEP IN MIND THAT THIS IS NOW AN OPERATIONAL ERROR.** So an error that we know, that we created ourself basically.  

Now in our errorController file we have two functions which send errors back to the clients. One for Development and One for Production. Then in Production, we distinguish between operational error and other unknown errors. So for the error that we know we send back the real error message because we can be sure that it's not going to be some weird looking error coming from Express or Node. While on the other hand, when it is unknown error, then we do not want to leak the error details. And so now in this case with the rendered website, we will actually the same strategy.  

So what we're going to do is to simply add the rendering of an error page to each of these functions in errorController. Basically what we're gonna do is to test if the url starts with slash /api, and so in that case we send kind of error that we seeing here in JSON. But if the url does not start with /api, in that case it means that we want to render an error page as a rendered website just like we have been doing in this section. Any way let's now implement that in that two functions in errorController.js file.

### `Development Error`

Let's start with sendErrorDev function.  
We can use if(req.originalUrl), originalUrl is basically the entire url, but not with the host. So it looks then exactly like the routes. To test if it's start with /api or not we can use js function called startsWith, If it's start with /api then simple send down the error as JSON. But if not we actually want to render an error. In render function we need the name of the template which is going to be called error, and then the data that we want to send there, for now just the title.  

**Oh actually we do not have access to the req variable in this error function, so let's add that.**  
Now we actually need to create this error.pug page or template.  
In error page we simply have an h2 with some sting and another h2 with error message. So let's pass in that error message from here(sendErrorDev func) using render function. msg: err.message, we simply set to err.message, because we're in development remember!!, because in development it doesn't matter if we leak all of the error details. SO THAT SHOULD BE WORKING NOW.  
In error template we should extend our main(base) template, So we can inject this error page's content into the content block in the base template.

```js
const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // RENDERED WEBSITE
    res.status(err.statusCode).render('error', {
      title: 'Something went wrongs',
      msg: err.message,
    });
  }
};
```

### `Production Error`

Let's now take care of our production error handling.  
So here in sendErrorProd let's now apply the same logic that we have in sendErrorDev, so test if we currently handling the api or not, by checking the originalUrl. ***And of course there could be more elegant ways of doing this, for example we could have one `completely separate error handling middleware` just for the api, and one for the rendered website.***  

Just in conclusion we now have an error handling strategy that works for development, such as before and also for production. And then in each of them we basically have two branches, One sends the error message for the api, which is exactly what we had before this implementation, and then we also have now kind of a handler for the rendered website. And so in that case, we render out our error template. Then in production we also distinguish between rendered website and API, and then just as before inside of each branches we then also distinguish between the operational errors and the unknown errors.  

```js

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

      // Programming or other unknown error: don't leak error details
    } else {
      // 1) Log error
      console.error('ERROR 💥', err);

      // 2) Send generic message
      return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
      });
    }
  } else {
    // B) RENDERED WEBSITE
    if (err.isOperational) {
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrongs',
        msg: err.message,
      });

      // Programming or other unknown error: don't leak error details
    } else {
      // 1) Log error
      console.error('ERROR 💥', err);

      // 2) Send generic message
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrongs',
        msg: err.message,
      });
    }
  }
};
```

---

## `Building_the_User_Account_Page`

In this lecture we're gonna build the user account page mostly using concepts that we already know and already used before. We'll render this page on /me url.  
So, let's start with the pug templates.  
Here we already see a lot of duplicate code here. so basically these list item elements. so let's very quickly just create a **mixin** for them to make our code look a bit cleaner. And so create a new **mixin** called **navItem**.  
**What do need to pass in to this mixin?** Well, what's going to change is the link, the text, the icon, and also the active class. Remember this active here will be true or false, And if it's true then we want to add this side-nav--active class. So lets use a turnery operator.  
Now we have an admin navigation. And this one will only be visible if the current user is an administrator. let's define that using an if statement. Here we need to test if the user role is equal to admin. So we use JavaScript for that. So we will have access to the user variable here, so just we did in other templates we gonna pass it into here.  

Now we have the form  for changing the user settings. And so the personal data will be here in these values of each form input fields.

let's now go ahead and add the route to the viewRouter. This one in gonna be called /me, this one going to be a protected route, because only if we are actually logged in we'll get access to this page. so we need to use our protect middleware here.  
**Now one problem with this is that this protect middleware here is very similar to the isLoggedIn function. And so we will actually do some duplicate operations there, which is not ideal.** Because remember that this isLoggedIn function will run for all the requests. So here both isLoggedIn and protect middlewares are running. So the solution is that we will put isLoggedIn route only for those which are not protected, Because on the protected route this check if the user is logged in will actually happen as well. Now just one thing that we do in the isLoggedIn that we currently do not do in protect is this that we put the current user on the response.locals. And so let's actually do the same in the protect middleware. So in protect we put the current user both on the req.user and res.locals, So we then automatically use it in all the templates after it. In this case our account template.

```js
// Updated Protect Middleware

// GRANT ACCESS TO PROTECTED ROUTE
req.user = currentUser;
res.locals.user = currentUser; // added this line
next();
```

And now we need to add this getAccount controller in viewsController file.

we need here only req and res. Because here, To get the account page all we really need to do is to simply render that page. we don't even need to query for the current user, because that has already been done in the protect middleware.  

```js
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};
```

And now as a final piece of the puzzle, let's add the correct link in the header. Right now the link doesn't point to the this account page. It should now point to /me  

```js
router.get('/me', authController.protect, viewsController.getAccount);

```

NOW TEST IT.  

---

## `Updating_User_Data_Using_HTML_Form`

Let's now use the user account page in order to allow users to update their data. So, what we're gonna do it to allow the user to update both the name and the email address for now. And we will add the user photo here a bit later in the next section.  

Now there are two ways in which we can do this. The first one is to submit a post request to our API, just like we did with the login form. And actually, we're gonna do that in the next lecture.  
But in this one I want to show you another way which is a more traditional and normal way. So in this more traditional way, we specify the post method right on the form, along with the url where the post request should be sent to. So basically using this method we don't need javascript for doing the request, it automatically happens with the html form which will then post the data to the url endpoint in our backend that we specified. NOW PERSONALLY I DON'T REALLY LIKE THIS WAY, because it forces a page reload, and it also requires us to create yet another route and route handler in our backend, and it also makes it a bit more difficult to handle errors. However, I still believe that it's very important that you know how to work with forms in this way, because it might make more sense in the application that you're building. For example application might not even need an API, and so in that case when we're only building a rendered website then of course it doesn't make sense to submit forms using an API call, instead we'll do it the way that we're gonna do it in this lecture. And so tha's way we're doing it this way in this lecture, and then using the API way in the next lecture.

So, what we need to do in our form in order to submit it automatically, without having to go through javascript, basically automatically posting the data to our endpoint, is to specify that endpoint, and so we do that here in the form tag, where we specify the **action attribute**. So the action, let's say that we're gonna create an endpoint called /submit-user-data, so action='/submit-user-data', and then we also specify the method to POST, so method='POST'. And so when we click on the submit button automatically the form will get submitted, and the data will be sent using a post request to this URL(/submit-user-data). There are also different ways in which the data is actually sent, but the default one is called URL encoded, and so that's the one we're using here. Basically what that gonna do is to encode all the data that we're submitting in the url a bit like query string. SO THIS IS THE FIRST STEP IN MAKING THIS METHOD WORK.  

And the second one is to specify the name properties on the fields that we actually want to send. So these input's values will be sent with a request based on their name attributes. so let's put the name field to name and email field. And so right now whe we submit the form. And so right now when we submit the form, the body that we will then receive will only have the name and the email, because these are the only two fields which actually have a name attribute.  

So let's now implement this /submit-user-data route, as I said in this method we need to implement yet another route. And remember this is a post request.  

```js
router.post('/submit-user-data', viewsController.updateUserData);
```

Now let's actually create this updateUserData handler in viewsController file.  

The first thing that we want to do here is to actually take a look at the body. console.log(req.body); and so basically in this case, just to show you that it actually won't work just like this. And I'm gonna tell you why after we experiment it. So for now let's just see if we're actually connected already. So if submitting that form will actually trigger this handler. Right now here req.body is empty. So as I saying, this will not really work just like this.  

```js
exports.updateUserData = (req, res, next) => {
  console.log('UPDATING USER', req.body);
};
```

**Because we need to add another middleware in order to parse data coming from a form. so let's do that in our app.js file.**  
Let's add that close to body parser because actually it's very similar.

And it's also an Express built in middleware and that is urlencoded. So ***app.use(express.urlencoded); **And it's call this way because remember the way that the form sends data to the server is actually also*** called urlencoded, and so here we need that middleware.**  Then in the urlencoded() function we pass in some settings, and we can say `extended true`, and that will simply allow us to pass some more complex data, which in this case is not really necessary. And we can also set the `limit property` as we did in the body parser, So if we try this again we should indeed get this data that we put in the form. yes.  

```js
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
```

Great, so that works, and so we now have our html form connected to this route handler. And so now we can do ahead and actually update the user based on this new data.

First of all we have to import the user model in viewsController.  
So we use `findByIdAndUpdate`. And what is the id that we're looking for? It will at req.user.id, And one important thing that we need to do which I didn't do yet, is to actually protect this route here as well, because only then we actually have this current user on the request, and also we only want to be able to access this route if we are logged in. So req.user.id is the id of the current user, and then we need the new data, and so let's say that we want the ***name=req.body.name*** and ***email=req.body.email***. and these are the names of the fields, because we gave them attribute in the html form.  

Now before, we updated some data, we used to pass in the entire request here into the update method, but in this we really only want to update the name and the email, and so we pass in an object just like we did. Like this we're sure that anything else basically is being stripped away from the body, because some hacker could of course now go ahead and add some additional fields to the html and then for example submit data like passwords and stuff like that. so we do not want to store that malicious data into our database. Also passwords are once more handled separately, because **remember that we can never never update passwords using findByIdAndUpdate, because that's not going to run the save middleware which will take care of encrypting our passwords.** so that's way we have a separate route for that in our API and also we have a separate form in our user interface, that's usually we always see in web applications.  

Let's now continue here with our options, where we say that we want to get the new, so basically the updated document as a result, and also that we want to run the validators.  
After submitting the data on our website  basically what we want is to simply come back to account page(/me route), but of course with the updated data here in the fields.  
So all we have to do is to basically render the account page again. But now one important difference, because right now we actually also need to pass in the updated user, because otherwise the user that the template is going to use is the one that's coming from the protect middleware, so that one is not going to be the updatedUser, and so we need to pass in user from the here. And so that should be enough.

```js

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});

```

---

## `Updating_User_Data_Using_API`

So as we said in the last lecture lets now actually use our API in order to update user data. And so just like before with the login functionality, we're now going to make an API call from the front end and so we need to create a new javascript file for that, and this one we're going to call `updateSettings`, because for now we'll basically update the data, which is name and email and later we will also update the password from this file. And so password together with the user data.  

So this is actually pretty similar to what we did with the login. Once more I actually want to leave this as a challenge for you. So go ahead an create an updateData function here. Then of course call tha function right from the index.js file. Very similar to other ones, that we did before. now one important thing to do before actually writing the javascript is that in our form we actually need to remove the attributes of form element that we set for previous lecture, ~~(action='/submit-user-data' method='POST');~~  
So that http request that we're doing with Axios will need to be inside of try catch block. In case something wrong we want show the alert just like we did.  
Let do that http request in try block.  
Method should be patch. And for the url we go to the postman to see actual url for the update Current User.  
After url we then specify the data, and this data will be the body that gonna be sent along with the request.  
And now lets check if we actually get our success back.  

```js
import axios from 'axios';
import { showAlert } from './alerts';
export const updateDate = async (name, email) => {
  const res = await axios({
    method: 'PATCH',
    url: '<http://127.0.0.1:3000/api/v1/users/updateMe>',
    data: {
      name,
      email,
    },
  });

  if (res.data.status === 'success') {
    showAlert('success', 'Data updated successfully!');
  }

  try {
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

```

Now all we need to do is to then use it here in index.js file.  

Import it and then select the form from the account page.  
Then we will do something very similar to the login.  

```js
import { updateDate } from './updateSettings';
const userDataForm = document.querySelector('form-user-data');

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    updateDate(name, email);
  });
}
```

---

## `Updating_User_Password_with_our_API`

And now to wrap up this section, let's again use our API this time to also update the user's password. We already create updateData function and now go ahead and create update password function as well. That function would basically look exactly the same. And so instead of doing that, we'll change this function a little bit, and allow it to update both the data and the password.  

And here we pass in, instead of name and email, an object containing all the data that we want to update, and then also a string for the type, which can then either be data or password. so here we pass in a data which will be an object of all data to update and then the type. And as a data to the request body we simply pass the data object.  
Then when we updating the passwords we also use another url so let's just ues a ternary operator in order to determine which url we want to call depending on type string that we passed in this function.  
Let's go to postman and copy the url to change password. So the url of Update Current User Password, so basically that one required the passwordCurrent, password, and passwordConfirm. and the route is ***/updateMyPassword***  
And so let's call this function updateSettings.  
Now call this updateSettings from index.js like this with an object and type: ***updateSettings({ name, email }, 'data');***  

Now all we need to do is to read the data from these three input fields of the form, and then also pass them into the updateSettings function.  
So let's first of all select the password form.  

```js
// updateSettings FUNCTION
// type is either 'password' or 'data',
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '<http://127.0.0.1:3000/api/v1/users/updateMyPassword>'
        : '<http://127.0.0.1:3000/api/v1/users/updateMe>';

    const res = await axios({
      method: 'PATCH',
      url: url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()}Data updated successfully!`);
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', err.response.data.message);
  }
};

// CALLING FROM INDEX FILE, (FOR DATA CHANGING)
if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateSettings({ name, email }, 'data');
  });

// CALLING FROM INDEX FILE (FOR PASSWORD CHANGING)
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');
  });
}
```

One thing that I want to show you that after a updating we still have the password showing here in the fields, and we actually don't want that. After the API call was successful, we should then go ahead and delete the content from these input fields. So that's something that we should do also here in the index.js file, because we say that in this file we handle everything related to user interface. Now remember that this updateSettings function is actually an asynchronous function, it's going to return a promise. and so we can then await that promise right here when calling it.  
Wait it until it's finished, so that after that we can do some other stuff. And in this case that is to clear these input fields.  
Now all we need to do is to select these fields again and then clear them.

Notice that it took some time until we actually got our alert here, and that's because setting a new password sets some time because of the encryption process. And so we should give the user some kind of feedback that there is actually something happening in the background, and typically we see some loading spinners. but let's keep it very simple here, so all we are going is to update the text of save password button.  
In starting we set the test to Updating and then after the await we will put original text, which is save setting.  

```js

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn-save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');

    document.querySelector('.btn-save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
```

---

***`12:47 | 24/02/2024`***  

---
