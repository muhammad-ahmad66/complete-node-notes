/*
* STREAMS: Streams are yet another important concept in NodeJs. 
?Using Streams we can process(read and write) data piece by piece(chunks), without completing the whole read or write operation, and therefor we don't have keep all the data in memory. 
Think about Youtube and Netflix, which are both called streaming companies, because they stream video using the same principle, so instead fo waiting until the entire video file loads, the processing is done piece by piece or in chunks. So that we can start watching even before the entire file is downloaded or loaded. 
? So, Stream is a perfect candidate for handling large volumes of data. Also streaming makes the data processing move efficient in terms of memory and time. 

? How streams Implement in Node?
There are four fundamental types of streams: 1) Readable streams 2) Writable streams 3) Duplex streams and 4) Transform streams. 
?Readable streams are ones from which we can read, we can consume data. Streams are everywhere in the core node modules like events. for example the data that comes in when an http server gets a request is actually a readable stream. We can read a file from filesystem piece by piece.
? Streams are actually instances of the EventEmitter class. It means that all streams can emit and listen to named events. We can listen to many different events, most important two are the 'data' and 'end' events.  
The data event is emitted when there is new piece data to consume, and the end event is emitted as soon as there is no more data to consume. 

We can have also important functions that we can use on streams, and in the case of readable streams, the most important ones are 'pipe' and 'read' functions.  

? Writeable streams are the once to which we can write data. for example: http response that we can send back to the client and which is actually a writeable stream. The most important events are 'drain' and 'finish' events. and the most important functions are 'write()' and end() functions. 

? Duplex streams are streams that are both readable and writable at a same time. -less common- Good example in the web socket from the net module. Web socket is basically just a communication channel between client and server that works in both directions. 

? Transform streams are duplex stream, and at the same time can modify or transform the data as it is read or written. example of this one is the zlib core module to compress data which actually uses a transform stream. 

These events and functions are foe consuming streams that are already implemented. We could also implement our own streams and consume them using these same events and functions. 

*/

/*
*Lecture# 037 
* STREAMS IN PRACTICE: 

?Lets say in our application, we need to read a large text file from the file system, and then send it to the client.
There are multiple ways to do this, we cover from basic way to most appropriate...


*/

const fs = require('fs');
const server = require('http').createServer(); // we do like this. the result of requiring http, is the http object and on there we ca then use createServer, and save it into variable.

// ! 1st SOLUTION:
/*
 listen to the request
server.on('request', (req, res) => {
   SOLUTION 1: most straightforward way, which is simple read the file into a variable, and one that done, send it to the client
  fs.readFile('test-file.txt', (err, data) => {
    if (err) console.log(err);

    res.end(data);
  });
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening on...');
});

 This working just fine but the problem is that node will actually have to load the entire file into memory, because only after that's ready it can send that data.
*/
// ! 2st SOLUTION:
// In this solution we'll actually use streams.
// here we don't need to read this data from the file into variable. Instead of reading data into a variable and store that data into memory, we will just create a readable stream. Then as we receive each chunk of data, we send it to the client as a response which is a writable stream ⬇

server.on('request', (req, res) => {
  const readable = fs.createReadStream('test-file.txt'); // this now creates a stream from the data that is in this text file, which we can then consume piece by piece.

  // consuming piece by piece
  // ?Remember each time there is a new piece of the that we consume, a readable stream emits the data event. so we can listen to that.
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

// There is a still a problem with this approach. The problem is that our readable stream, the one that we're using to read the file from the disk, is much much faster than actually sending the result with the response writable stream over the network. and this will overwhelm/overload/overburden the response stream, which cannot handle all this incoming data so fast. And this problem is called backpressure problem, and it's a real problem that can happen in real situations. In this case, backpressure happens when the response cannot send the data nearly as fast as it is receiving it from the file. So we have better solution.

// ! 3rd SOLUTION -best one:
// The secret here is to actually use that pipe operator.
// The pipe operator is available on all readable streams, and it allows us to pipe the output of a readable stream right into the input of a writable stream. And that will then fix the problem of backpressure, because it'll automatically handle the speed of the data coming in and the speed of the data going out.
server.on('request', (req, res) => {
  const readable = fs.createReadStream('test-file.txt');

  // Here all we have to do is take our readable stream, use the pipe method on it, and put in a writable stream(that is the response). That's all we've to do!
  readable.pipe(res); //readableSource.pipe(writeableDestination)
});

server.listen('8000', '127.0.0.1', () => {
  console.log('Listening...');
});
