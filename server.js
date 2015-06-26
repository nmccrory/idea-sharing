var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var moment = require('moment');
var now = moment();
var mongoose = require('mongoose');
var app = express();

//listen on port 8888
app.listen(1337,function(){
	console.log('Server is listening on port 1337');
})

app.use(express.static(path.join(__dirname, './static')));

//body parser
app.use(bodyParser.urlencoded());

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

//connecting to mongo instance
mongoose.connect('mongodb://localhost/ideas');

var ideaSchema = new mongoose.Schema({
	name: String,
	post: String,
	comments: [{name: String, body: String}],
	created_at: Date
})

var Idea = mongoose.model('Idea', ideaSchema);

app.get('/', function(req, res){
	Idea.find({}, function(err, ideas){
		if(err){
			console.log('something went wrong');
		}else{
			console.log('successfully retrieved ideas!');
			res.render('index', {ideas: ideas});
		}
	})
})

app.post('/add', function(req, res){
	var idea = new Idea({name: req.body.name, post: req.body.idea, comments: [], created_at: now});
	idea.save(function(err){
		if(err){
			console.log('Unable to add post');
		}else{
			res.redirect('/');
		}
	})
})
app.post('/comment', function(req, res){
	var comment = {body: req.body.comment, name: req.body.name};
	console.log(comment);
	Idea.update({_id: req.body.id}, {$push: {comments: comment}}, function(err, comment){
		if(err){
			console.log('error commenting');
		}else{
			console.log('comment successful');
			res.redirect('/');
		}
	})
})
