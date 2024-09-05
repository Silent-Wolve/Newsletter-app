import express from "express";
import bodyParser from "body-parser";
import request from "request";
import https from "https";
import dotenv from "dotenv";
// const dotenv = require('dotenv').config();

const app = express();

const __dirname = import.meta.dirname;

dotenv.config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/signUp.html");
})

app.post("/", (req, res)=>{
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    
    // forming data to suit API requirement
    const data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    
    const jsonData = JSON.stringify(data);

    const api_key = process.env.API_KEY;
    const list_id = process.env.LIST_ID;
   const url = "https://us21.api.mailchimp.com/3.0/lists/"+ list_id 
    
    const options = {
        method: "POST",
        auth: "bee:"+ api_key
    }

    // forming data
    const request = https.request(url, options, function(response){
        // console.log(response.statusCode);
        response.on("data", (data)=>{
            // console.log(JSON.parse(data));
            if(response.statusCode === 200){
                res.sendFile(__dirname + "/success.html");
            }else{
                
            // console.log("ERROR HAPPENED")
            // console.log(response.statusCode, api_key);
                res.sendFile(__dirname + "/failure.html");
            }
        })
        // checking for error
        response.on("error", (error) => {
            console.log("ERROR HAPPENED");
            console.log(error);
        })
    })

    // posting jsonData
    // console.log(' Sending Request')
    request.write(jsonData);
    request.end();

})

app.post("/failure", (req, res)=>{
    res.redirect("/");
})

app.listen(3000, ()=>{
    console.log("Server is up and running!");
})

// 06648d54f9