var express = require("express"),
app     = express(),
mongoose = require("mongoose"),
bodyParser = require("body-parser"),
expressSanitizer = require("express-sanitizer"),
methodOverride = require('method-override');

mongoose.connect("mongodb://localhost/stokcsi");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(methodOverride('_method'));

var stockSchema = new mongoose.Schema({
  text: String,
});

var Stock = mongoose.model("Stock", stockSchema);

app.get("/", function(req, res){
  res.redirect("/stocks");
});

app.get("/", function(req, res){
  Stock.find({}, function(err, stocks){
    if(err){
      console.log(err);
    } else {
      res.render("index", {stocks: stocks}); 
    }
  })
});

app.get("/stocks", function(req, res){
  Stock.find({}, function(err, stocks){
    if(err){
      console.log(err);
    } else {
      res.render("index", {stocks: stocks}); 
    }
  })
});
app.get("/stocks/new", function(req, res){
 res.render("new"); 
});

app.post("/stocks", function(req, res){
 req.body.stock.text = req.sanitize(req.body.stock.text);
 var formData = req.body.stock;
 Stock.create(formData, function(err, newStock){
    if(err){
      res.render("new");
    } else {
        res.redirect("/stocks");
    }
  });
});

app.get("/stocks/:id/edit", function(req, res){
 Stock.findById(req.params.id, function(err, stock){
   if(err){
     console.log(err);
     res.redirect("/")
   } else {
      res.render("edit", {stock: stock});
   }
 });
});

app.put("/stocks/:id", function(req, res){
 Stock.findByIdAndUpdate(req.params.id, req.body.stock, function(err, stock){
   if(err){
     console.log(err);
   } else {
      res.redirect('/');
   }
 });
});

app.delete("/stocks/:id", function(req, res){
 Stock.findById(req.params.id, function(err, stock){
   if(err){
     console.log(err);
   } else {
      stock.remove();
      res.redirect("/stocks");
   }
 }); 
});


app.listen(5000, function() {
  console.log('Server running on port 5000');
});
