const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('DB connection Successful');
  });

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// IMPORT DATA INTO DATABASE
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE EXISTING DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);
/*

? now run like this in terminal for delete: node dev-data/data/import-dev-data.js --delete
? and run like this for import: node dev-data/data/import-dev-data.js --delete


If we run this, node dev-data/data/import-dev-data.js the output will be
[
  'C:\\Program Files\\nodejs\\node.exe',      
  'G:\\NodeJS\\complete-node-bootcamp-master\\4-natours\\starter\\dev-data\\data\\import-dev-data.js'
]  // this is output of process.argv, here is an array with tow elements, first one is the path where node is located, and second one is path to current script.


And if we run like using this: node dev-data/data/import-dev-data.js --import, the output is: [
  'C:\\Program Files\\nodejs\\node.exe',      
  'G:\\NodeJS\\complete-node-bootcamp-master\\4-natours\\starter\\dev-data\\data\\import-dev-data.js',
  '--import'
] Now we have 3rd element, which is --import
*/

// By using --import , we can use this data in order to write command line application, which will import the data when we specify import option, and will delete the data when we specify the delete option.

/*
! Always remember './' in any path dot is always relative from the folder where the node application was actually started and `${__dirname}/` is relative to the current folder where current script is.

Create method can also accept array of objects, in that case it'll create a new document for each of the objects in the array.

- if we pass nothing in deleteMany() method, then it'll delete all of documents in a certain collection.

- We'll run this file without calling any of these functions.

- This process is still running after the deletion or importing. Actually fix this.
We can use process.exit(), But this process.exit() is kind of an aggressive way of stopping an application but in this case it's no problem because it's just a very small script.  

*/
