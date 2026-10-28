// Backend: application services, accessible by URIs


const express = require('express')
const cors = require ('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express();

const dbService = require('./dbService');


app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));

// create
app.post('/insert', (request, response) => {
    console.log("app: insert a row.");
    // console.log(request.body); 

    const {name} = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.insertNewName(name);
 
    // note that result is a promise
    result 
    .then(data => response.json({data: data})) // return the newly added row to frontend, which will show it
   // .then(data => console.log({data: data})) // debug first before return by response
   .catch(err => console.log(err));
});

//1. user registration
app.post('/register', (request, response) => {
    const { userid, password, firstname, lastname, salary, age }
    = request.body
    const db = dbService.getDbServiceInstance();
    const result = db.registerUser(userid, password, firstname, lastname, salary, age);

    result
    .then(data => response.json({success: !!data}))
    .catch(err => response.status(500).json({ success: false, error: err}));

});

//2. user sign in
app.post('/signin', (request, response) => {
    const { userid, password } = request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.signInUser(userid, password);

    result
    .then(user => {
        if (user) {
            response.json({ success: true, user });
        } else {
            response.json({ success: false, message: "Invalid"});
        }
    })
    .catch(err => response.status(500).json({success: false, error: err}));
});

//3. search by first and/or last name
app.get('/searchByName', (request, response) => {
    const {firstname, lastname } = request.query;
    const db = dbService.getDbServiceInstance();
    const result = db.searchByName(firstname, lastname);

    result
     .then(data => response.json({ data }))
     .catch(err => response.status(500).json({ error: err}));
});

//4. search by user id
app.get('/searchByUserId/:userid', (request, response) => {
    const { userid } = request.params;
    const db = dbService.getDbServiceInstance();
    const result = db.searchByUserId(userid);

    result
        .then(data => response.json({ data }))
        .catch(err => response.status(500).json({ error: err }));
});

// 10. Search Users Registered Today
app.get('/registeredToday', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.searchRegisteredToday();

    result
        .then(data => response.json({ data }))
        .catch(err => response.status(500).json({ error: err }));
});


// read 
app.get('/getAll', (request, response) => {
    
    const db = dbService.getDbServiceInstance();

    
    const result =  db.getAllData(); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


app.get('/search/:name', (request, response) => { // we can debug by URL
    
    const {name} = request.params;
    
    console.log(name);

    const db = dbService.getDbServiceInstance();

    let result;
    if(name === "all") // in case we want to search all
       result = db.getAllData()
    else 
       result =  db.searchByName(name); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


// update
app.patch('/update', 
     (request, response) => {
          console.log("app: update is called");
          //console.log(request.body);
          const{id, name} = request.body;
          console.log(id);
          console.log(name);
          const db = dbService.getDbServiceInstance();

          const result = db.updateNameById(id, name);

          result.then(data => response.json({success: true}))
          .catch(err => console.log(err)); 

     }
);

// delete service
app.delete('/delete/:id', 
     (request, response) => {     
        const {id} = request.params;
        console.log("delete");
        console.log(id);
        const db = dbService.getDbServiceInstance();

        const result = db.deleteRowById(id);

        result.then(data => response.json({success: true}))
        .catch(err => console.log(err));
     }
)   

// debug function, will be deleted later
app.post('/debug', (request, response) => {
    // console.log(request.body); 

    const {debug} = request.body;
    console.log(debug);

    return response.json({success: true});
});   

// debug function: use http://localhost:5050/testdb to try a DB function
// should be deleted finally
app.get('/testdb', (request, response) => {
    
    const db = dbService.getDbServiceInstance();

    
    const result =  db.deleteById("14"); // call a DB function here, change it to the one you want

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


// set up the web server listener
// if we use .env to configure
/*
app.listen(process.env.PORT, 
    () => {
        console.log("I am listening on the configured port " + process.env.PORT)
    }
);
*/

// if we configure here directly
app.listen(5050, 
    () => {
        console.log("I am listening on the fixed port 5050.")
    }
);
