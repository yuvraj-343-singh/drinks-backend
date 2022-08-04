const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors());

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get('/', (req, res) => {
    res.send({msg:"hello"})
})
let drinkRef = db.collection("Drinks");
app.get('/fetch', async (req, res) => {
    const drinks = [];
    await drinkRef.get().then((element) => {
        if(element && element.length > 0) {
            element.forEach(el => {
                drinks.push(el.data())
            })
        } 
    })
    res.send({data:drinks, msg:"Success"})
})

app.post('/add', async(req,res) => {
    const data = req.body;
    //console.log(data)
    drinkRef.doc(Date.now().toString()).set(data)
    res.send({msg: "Record added successfully"})
})

app.listen(8000, ()=> console.log("Running"))