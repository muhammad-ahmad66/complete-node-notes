# INTRODUCTION TO BACKEND-DEVELOPMENT

## Table of Contents

1. [How_the_Web_Works](#how_the_web_works)
2. [WHAT_IS_A_SERVER](#what_is_a_server)
3. [STATIC_AND_DYNAMIC](#static_and_dynamic)
4. [APIs](#apis)

---

## How_the_Web_Works

### How the web actually works behind the scenes?

**What does actually happen each time that we type a url into browser in order to open up a new webpage? Or each time we request data form an API?**  
Our browser which is also called **client** send a request to the **server** where the webpage is hosted. And the server will then send back a response, which is gonna contain the webpage that we just requested, this process is called **request-response model** or **client-server architecture**.

Let's say that we wanna access google maps by writing google.com/maps into browser as a url. And every url gets an **http** or **https**, which is for the protocol that will be used on the connection. Then domain name here which is google.com and after /maps is so called resource that we want to access.  
Domain name is not actually the real address of the server that we are trying to access, but just a nice name. So, we need a converting a domain name to the real address of the server, that happens through a **DNS(domain name server)**, which is a special servers that are basically like a phone-books of the internet.  
So, the first step that happens when we open up a website is that the browser makes a request to a DNS, and this special server will then simply match the web address that we types into the browser to the server's real IP address. This happens through **Internet Service Provider(ISP)**.  
IP: <https://234.3.322.230:334> last past is called **port number**, which is a specific service running on server. NOTE: Port number is nothing to do with google maps resource that we want to access in above example. That resource will actually be sent over in the HTTP request.

Once we have the real web address, **A TCP socket connection** is established between the browser and the server, which are now finally connected, And this connection is typically kept alive for the entire time it takes to transfer all the files of the website.

**What are TCP and IP?**  
**TCP** is Transmission Control Protocol and **IP** is Internet Protocol, and together they are communication protocols that define exactly how data travels across the web. They are basically internet's fundamental control system, because they are the ones who set the rules about how data moves on the internet.  
**http** stands for HyperText Transfer Protocol.  
After **TCP/IP**, _HTTP_ is yet another communication protocol, A communication protocol is simply a system of rules that allows two or more parties to communicate. **HTTP** allows clients and we servers to communicate.

**A request message will looks like this:**  
GET /maps Http/1.3.  
.Host: <www.google.com>  
User-Agent: Mozilla/5.0  
Accept-language: en-US

<BODY>

The beginning of the message is the most important part, called **start line**, which contains the **http method** that used in the request, then the **request target** and **http version**.  
There are many http methods available, but most important one are **GET** for simply requesting data, and **POST** for sending data and **PUT** and **PATCH** to basically modify data.

A request target, this is where the server is thought that we want to access the maps resource in this example. if it's empty(no maps), just a slash/, then we would be accessing the website's root, which will be google.com.

Then next part of the request are the **request headers**, which is just some information that we send about the request itself, there are tons of different headers available, like what browser is used to make request, at what time, the user's language and many others...

Finally in the case we're sending data to the server, there will also be a **request body** containing that data, for example data coming from an html form.

Now these are all about HTTP requests and response....

Differences between **HTTP** and **HTTPS** is that **HTTPS** is encrypted using **TLS** or **SSL**, Which are yet some more protocols. But beside these encryption the logic between HTTP requests and responses still applies to HTTPS.

NOW at this point our request hits the server, which will be working on it until it has our website ready to send back. And it will send it back using HTTP response. The HTTP response message looks quite similar to the request, with a **start line**, **headers** and a **body**.

The **start line** has besides the **HTTP version**, a **status code** and **message**. status code 200 means OK, and 404 means not found.  
Then the **response headers** are information about response itself, we can actually make our own headers.  
**Difference between response headers and request headers** is that it's actually the back-end developer specifies them and sends them back in the response.  
Finally the last part of the response is again the **body**, which is actually present in most responses. And it's also the developer specifies, the developer who specifically sends back the body in the response. We already did that using response.end().  
The **body** should usually contain the html of the website we requested or for example, json data coming from API or something like that.

Basically, this entire back and forth between client and server that it just explained happens for every single file that is included in the website. There can be multiple requests and responses happening at the same time.

The **TCP/IP** are the communication protocols that define how data travels across the web.

The job of **TCP** is to break out the requests and responses into thousands of small chunks called packets before they are sent, then once they get to their destination, it will reassemble all the packets into the original request or response

The job of IP protocol is to send and route all of these packets through the internet, so it ensures that all of them arrive at the destination that they should go using IP addresses on each packet.

---

## WHAT_IS_A_SERVER

A basic server is really just a computer that is connected to the internet, which first stores a website's files like html, css, images etc. And second, runs an http server, that is capable of understanding urls, requests and also delivering responses. The http server software actually communicates with the browser using requests and responses, therefore its's like a bridge between the frontend and the backend.

## STATIC_AND_DYNAMIC

### STATIC

A simple web-app, is when a developer uploads the final ready to be served files(html, css, js, images... ) of a websites onto the web server, and then exact same files that the server will later send to the browser when the website is requested. The browser takes this files and render them. It means there is no work done on the server, there is no back-end code, and also there is no application.

### DYNAMIC

Dynamic websites usually contains **database** and then there's also and application running, like a node.js app, which fetch data from the database and then renders it to the browser dynamically.  
Each time a new page is requested, the server will build a page, with filling templates(html,css,js files) based on data coming from the database and send all files(html,css,js,images...) back to the browser, This whole process is called **server-side rendering**.  
The website can change all the time according to the content that's in the database or user's actions on the site, that's way it's called dynamic website.  
**_Dynamic websites and web applications are same thing._**

---

## APIs

**APIs(Application Programming Interface):**  
Recent years we see more and more websites based on APIs.  
A piece of software that can be used by another piece of software, to allow applications to talk each other.  
An API powered websites are quite similar to dynamic websites, that use database and getting data. BUT big difference is that with an API we only send the data to the browser, usually in the json data format, not entire website. Just a data, not the ready to be displayed website, (no html, no css... only json data).

So when building and API powered websites, there is always these two steps:

1. Building an API
2. Consuming the API on the client side.

In API based website the build phase is kind of moves from backend to frontend. we can also say it moves from the server to the client. Many times Dynamic website are called server side rendered because they are actually built on the server. On the other hand API powered websites are often called client-side rendered.  
So, backend developers actually just build an API and let frontend people to build a site. Node is a absolutely perfect tool for building an APIs, it's very commonly used to that.

APIs that build with Node, or any other language can be consumed by other clients than just the browser.
