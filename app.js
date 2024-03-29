const express = require("express");
const app=express();
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
const { url } = require("inspector");
const { post } = require("request");
const { getMaxListeners, send } = require("process");


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
});

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    const fName=req.body.FirstName;
    const lName=req.body.LastName;
    const email=req.body.EmailAddress;
    const data={
        members:[
            {
                "email_address": email,
                "status" : "subscribed",
                "merge_fields" :{
                    "FNAME" : fName,
                    "LNAME" : lName
                }
            }
        ]
    }
    const jsonData=JSON.stringify(data);
    const url="https://us21.api.mailchimp.com/3.0/lists/d92890d204";
    const options={
        method: "POST",
        auth: "xyz:f510220bda4f71366ac19363f448668e-us21"
    }
    const request=https.request(url, options, function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});
app.post("/failure", function(req, res){
    res.redirect("/");
})



//f510220bda4f71366ac19363f448668e-us21 api key
//d92890d204 audience id