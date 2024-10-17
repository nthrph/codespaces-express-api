const express = require('express');
const bodyParser = require('body-parser');
var mysql = require('mysql');

const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE",
  );
  next();
});
app.use(express.json());

var con = mysql.createConnection({
  host: "korawit.ddns.net",
  user: "webapp",
  password: "secret2024",
  port: "3307",
  database: "shop",
});

con.connect(function (err) {
  if (err) throw err;
});


app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/api/products', (req, res) => {
  con.query("SELECT * FROM products_6430300498", function (err, result, fields) {
    if (err) throw res.status(400).send("No products found");
    console.log(result);
    res.send(result);
  });
})

app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;
  con.query(`SELECT * FROM products_6430300498 where id=${id}`, function (err, result, fields) {
    if (err) throw err;
    if (result.length == 0)
      res.status(400).send(`No products id: ${id} found`);
    else {
      console.log(result);
      res.send(result);
    }
  });
})

app.post('/api/addproduct' , (req,res)=>{
  const name = req.body.name;
  const price = req.body.price;
  const img = req.body.img;
  console.log( name,price,img);
  con.query(`INSERT INTO products_6430300498 (name,price,img) VALUES ('${name}', '${price}' , '${img}')`, function (err, result, fields) {
    if (err) throw err;
    if (result.length == 0)
      res.status(400).send(`No products id: ${id} found`);
    else {
      console.log(result);
      res.send({products:result,status:"ok"});
    }
  });
})

app.delete('/api/delproduct/:id' , (req,res)=>{
  const id =req.params.id;
  con.query(`DELETE FROM * FROM products_6430300498 where id=${id}`, function (err, result, fields) {
    if (err) throw err.status(400).send("Error, cannot delete product");
    con.query("SELECT * FROM products_6430300498" , function (err,result,fields){
      if(err) throw res.status(400).send("No products found");
      console.log(result)
      res.send({products:result,status:"ok"})
    })
  });
})

app.post('/api/updateproduct' , (req,res)=>{
  const id =req.params.id;
  const name = req.body.name;
  const price = req.body.price;
  const img = req.body.img;
  console.log( name,price,img);
  con.query(`UPDATE products_6430300498 SET name='${name}', price='${price}' , img='${img}' WHERE id = ${id})`, function (err, result, fields) {
    if (err) throw err;
    if (result.length == 0)
      res.status(400).send(`No products id: ${id} found`);
    else {
      console.log(result);
      res.send({products:result,status:"ok"});
    }
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})