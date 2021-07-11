const { urlencoded } = require("express");
const express=require("express");
const date=require(__dirname+"/data.js");
const app=express();
const _=require("lodash");
const mongoose=require("mongoose");
let workitems=[];
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-Nikhil:Test123@cluster0.gltgt.mongodb.net/todolistDB",{useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
// app.listen(3000);
const itemSchema=new mongoose.Schema({
    name:"String"
});
const Item= mongoose.model("Item",itemSchema);
const food=new Item
({
    name:"Ramen"
});
const shopping=new Item
({
    name:"Broom"
});
const shoes=new Item
({
    name:"Shoes"
});
// Item.insertMany([food,shopping,shoes],function(err)
// {
//     if(err)
//     console.log(err);
//     else
//     console.log("success");
// });
app.get("/",function(req,res){
    const e= Item.find({},function(err,found)
    {
        if(found.length===0)
        {
            Item.insertMany([food,shopping,shoes],function(err)
            {
                if(err)
                console.log(err);
                else
                console.log("success");
            });
            res.redirect("/");
        }
        else
        res.render("list",{listTitle:"Today",newitems: found});
        // console.log(found);
    });

});
const listSchema = new mongoose.Schema({
    name:String,
    items:[itemSchema]
});
const List=mongoose.model("List",listSchema);
app.post("/",function(req,res)
{
    // console.log(req.body.list);
     const k=req.body.listitem;
     const p=req.body.list;
    //  console.log(req);
    const item=new Item({
        name:k
    });
    if(p==="Today"){
    item.save();
    res.redirect("/"); 
    }
    else{
        List.findOne({name:p},function(err,result)
        {
            result.items.push(item);
            result.save();
            res.redirect("/"+p);
        });
    }

});
app.get("/:listname",function(req,res)
{
    listName=_.capitalize(req.params.listname);
    const f=List.findOne({name:listName},function(err,result)
    {
        if(!err){
        if(!result)
        {
            const list=new List ({
                name:listName,
                items:[food,shopping,shoes]
            });
            list.save();
            res.redirect("/"+listName);
            console.log(list);
        }
        else
        {
        res.render("list",{listTitle:result.name,newitems:result.items}); 
        }
}
    });
    }); 
app.post("/delete",function(req,res)
{
    const chkd=_.capitalize(req.body.checkbox);
    const r=req.body.listName;
    if(r==="Today"){
    Item.deleteOne({_id:chkd},function(err)
    {
        if(err)
        console.log(err);
        else
        {
            console.log("success");
            res.redirect("/");
        }
    });
  
}
else{
    List.findOneAndUpdate({name:r},{$pull: {items:{_id:chkd}}},function(err,found)
    {
        if(!err)
        {
            res.redirect("/"+r);
        }
    });
}
    
});


