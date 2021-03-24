const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require("mongoose")


// console.log(date());

const app = express();



app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));


// mongoose connected via RoBo 3T
mongoose.connect("mongodb://localhost:27017/todolistDB",{ useUnifiedTopology: true, useNewUrlParser: true});


// schema////
const listSchema = ({
    name: {
        type: String,
        required: [true, "You need to fill the list!"],
    }
});

const List = mongoose.model("List", listSchema);

const list1 = new List({
    name: "Welcome to your todolist"
});

const list2 = new List({
    name: "Hit the + button to add a new item"
});

const list3 = new List({ 
    name: "<-- Hit this to delete an item"
});

 ///today////
const todaySchema = new mongoose.Schema ({
    name: String
});

const Today = mongoose.model("Today", todaySchema)

const defaultItems = [list1, list2, list3];




////////// apps ////////
app.get('/', function(req, res){


    List.find({}, function(err, foundItem){

        if (foundItem.length === 0 ) {
            List.insertMany(defaultItems, function(err){
            
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully saved defualt items to DB")
                };
            });
        } else {
            res.render("list", {listTitle: "Today", newListItems: foundItem});
        }
        // 
    });
});



app.post('/', function(req, res){

    const itemName = req.body.newItem
    
    const addedList = new List({ 
        name: itemName
    });

    addedList.save(function(err){
        if(err) {
            console.log(err)
        } else {
            res.redirect("/")
        }

    });
});

app.post("/delete", function(req, res){

    const checkboxID = req.body.checkbox

    List.findByIdAndRemove(checkboxID, function(err){
        if (err) {
            console.log("Failed")
        } else {
            res.redirect("/")
        }
    });

    // res.redirect("/")
});

app.get("/:customListName", function(req, res) {
    const customListName = req.params.customListName
    

});


app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.post("/work", function(req, res) {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work")
});


app.get("/about", function(req, res) {

    res.render("about");
})


app.listen(3000, function(){

    console.log("Server started on port 3000")
});