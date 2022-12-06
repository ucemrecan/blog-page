// PACKAGES
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();
const port = process.env.PORT || 3000;

// mongoose
mongoose.connect('mongodb+srv://admin-umtcmrcn:hfi468AXC@cluster0.obcjmxy.mongodb.net/blogDB');

const blogSchema = new mongoose.Schema( {
  title: String,
  content: String
});

const Blog = mongoose.model('Blog', blogSchema);


// VARIABLES
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// SET
app.set('view engine', 'ejs');

// USE
app.use(express.urlencoded({ extended: true })) // express 4.16'dan sonra body-parser bu şekilde kullanılıyor.
app.use(express.static('public'));


// GET
app.get('/', (req, res) => {

  Blog.find({}, (err, foundPosts) => {
    if (err) {
      console.log(err);
    } else {
      res.render('home', {homeStartingContent: homeStartingContent,
        posts: foundPosts});
    }
  })
})

app.get('/about', (req, res) => {
  res.render('about', { aboutContent: aboutContent });
} )

app.get('/contact', (req, res) => {
  res.render('contact', { contactContent: contactContent })
})

app.get('/compose', (req, res) => {
  res.render('compose');
})

// express route parameters
app.get('/posts/:postName', (req, res) => {

  const requestedTitle = req.params.postName;

  Blog.find({}, (err, foundPosts) => {
    if (err) {
      console.log(err);
    } else {
      foundPosts.forEach( (post) => {

        const storedTitle = post.title;

        if (_.lowerCase(requestedTitle) === _.lowerCase(storedTitle)) {
          res.render('post', {title: post.title,
                              content: post.content})
        } else {
          console.log("Match not found :/");
        }
    });
  };
});
});


// POST
app.post('/compose', (req, res) => {

  // insert mongoose eklenecek
  const title = _.capitalize(req.body.postTitle);
  const content = req.body.postBody;

  const newBlog = new Blog({
    title: title,
    content: content
  });

  newBlog.save()

  res.redirect('/');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
