/**
 * Hello! this is a tutorial to show how to make a basic CRUD API using
 * node js and express js
 * 
 * Express.js is a minimal framework for node that helps us write clean 
 * and robust code that is much smaller and easy to read
 * 
 * nodejs-is a runtime enviroment for javascript
 */


const express=require('express');//import express.js
const path=require('path')//useful for modifying paths
const app=express();//executing express module

var members=require('./members')//sample data for testing 

let PORT=process.env.PORT|| 5000;//this is the port we shall work on
//In many environments (e.g. Heroku), and as a convention, you can set the environment variable PORT to tell your web server what port to listen on.
//So process.env.PORT || 3000 means: whatever is in the environment variable PORT, or 3000 if there's nothing there.




//==>to start a dynamic port type in cmd ---> npm run dev

//logger() is a function that is a middleware that executes everytime a request is made 
//middlewares have access to the request object,response object and next middleware call

const logger=function(req,res,next)
{
    console.log("middleware executed");
    console.log(req.method +" request was made  "+req.protocol+'://'+req.headers.host+req.url);
    next();
}
app.use(logger);//use logger as middleware by invoking app.use()
app.use(express.json());//essential middlewares provided by express to help with json data
app.use(express.urlencoded({extended:false}));//If the data was sent using Content-Type: application/x-www-form-urlencoded, you will use the express.urlencoded() middleware

/*-----------------------GET REQUEST--------------------------------*/

//get all members by using a simple get function that sends back and array of objects
app.get('/api/members',(req,res)=>res.send(members))

//get a specific member based on the id of the member
//":id "is used as a url parameter and can be accessed using the req.params object
app.get('/api/members/:id',(req,res)=>{
   res.send(members.find((current)=>{
       if(parseInt(req.params.id)===current.id)
       return(current);
       
       else
       {
           res.status(400);
       }
   }))
})
/*-----------------------POST REQUEST--------------------------------*/

app.post('/api/members',(req,res)=>
{
    const newmember={
        id:parseInt(Math.random()*100),//adds a random id
        name:req.body.name,//sets value of name parameter
        roll:req.body.roll//sets value of roll parameter
    }
    members.push(newmember)//adds to the members array
    res.send(members)//sends a response back

})

/*-----------------------DELETE REQUEST--------------------------------*/

app.delete('/api/members/:id',(req,res)=>
{
    const condition=members.find((current)=>{if(current.id===parseInt(req.params.id))return true;})//checks if the id is valid
    if(condition)
    {
        members=members.filter((current)=>parseInt(req.params.id)!==current.id)//removes the given id
        res.send(members);//sends back response
    }
    else
    {    res.status(400);

         res.send("bad input");
    }
})
/*-----------------------UPDATE REQUEST--------------------------------*/

app.patch('/api/members/:id',(req,res)=>
{
    const condition=members.find((current)=>{if(current.id===parseInt(req.params.id))return true;})//checks if the id is valid
    if(condition)
    {
       members.forEach((current)=>{
           if(current.id===parseInt(req.params.id))
           {
               current.id=parseInt(req.body.id);
               current.name=req.body.name;
               current.roll=req.body.roll;
           }//sets the new values
       })
        res.send(members);//sends back the entire member list
    }
    else
    {    res.status(400)

        res.send("bad input")
    }
})

/*----------------------------------------------------------------*/
//creating a static folder
app.use(express.static(path.join(__dirname,'public')))//you can add the folder which contains all your website contents in it to host a website

app.listen(PORT,()=>console.log("console started on port="+PORT));//starts the server at the specified port

