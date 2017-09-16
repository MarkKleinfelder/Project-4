// var request      = require('request');
var express      = require('express');
var session      = require('express-session');
var app          = express();
var mongoose     = require('mongoose');
var bodyParser   = require('body-parser');
var routes       = require('./config/routes');


app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', './views');
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


app.use(routes);

/***********DATABASE*************/
var db = require('./models');


/********JSON API END POINTS**********/


app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to Mark Kleinfelder's Project 4",
    documentation_url: "",
    base_url: "",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
});


//____________get all users___________//
// app.get('/api/users', function user_index(req, res){
//   	db.User.find({},function(error, users){
//     console.log(users);
//     res.json(users);
//  });
// });


//______________GET home page (index.html)_________//




//______________INDEX all programs____________//
app.get('/api/programs', function programs_index(req, res){
  db.Program.find({},function(error, programs){
    console.log(programs);
    res.json(programs);
 });
});

//_______________SHOW program by id_________//
app.get('/api/programs/:id', function(req,res){
  db.Program.findOne({ _id:req.params.id
	}, function(err,program){
	  res.json(program);
  })
})

//____________CREATE program object____//
app.post('/api/programs', function(req,res){
    console.log('hit programs');
    console.log(req.body)
	db.Program.create(req.body, function(error, program){
		console.log(program);
		res.json(program);
	});
});

//_______UPDATE program by id with comment__//
app.put('/api/programs/:id', function(req,res){
	console.log("PUT hit");
	console.log(req.params.id);
    db.Program.findOneAndUpdate({_id: req.params.id},
   	{$set:{comment:req.body.title}}, {new: false},
  	  function (err,program){
      if(err){
      	console.log("PUT error");
      }
       console.log("back-end PUT good")
       res.json(program);
      });
    });

 
//______________DELETE program by id_____//
app.delete('/api/programs/:id', function(req,res){
	console.log("DELETE hit");
	console.log(req.params.id);
	db.Program.findOneAndRemove({_id: req.params.id}, function(err,deleted){
		if(err){
			console.log(err);
		}else{
			res.json(deleted);
		};
	});
});














/*************SERVER***************/

//listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('server running');
});