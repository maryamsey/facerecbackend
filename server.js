const express = require('express');
const bodyparser = require('body-parser');
const bcrypt =require('bcrypt-nodejs');
const cors = require('cors');
const app = express();
const knex = require('knex');
const register = require ('./Controllers/register')


const db =knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'mss',
      database : 'Smart-Brain'
    }
  });

  db.select ('*').from ('users').then(data =>{
      console.log(data);
  } );

app.use(bodyparser.json());
app.use(cors())



app.get('/', (req, res)=>{
    res.send(database.users);
})



app.post('/signin', (req, res) =>{
    db.select('email', 'hash').from('login')
    .where('email','=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid){
            db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user =>{
                res.json(user[0])
            })
            .catch(err=> res.status(400).json('unable to get user'))
        } else{
            res.status(400).json('wrong credentials')
        }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})



app.post('/register', (req, res) =>{
    register.handleRegister(req, res, db, bcrypt)})


app.get('/profile/:id', (req,res) =>{
    const {id} = req.params;
    db.select('*').from ('users').where({id})
    .then(user=> {
    if(user.length){
        res.json(user[0])
    }else{
        res.status(400).json('Not Found')
    }
}).catch(err => res.status(400).json('error getting user'));
})



app.put('/image', (req, res)=>{
    const {id} = req.body;
    db('users').where('id', '=',id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entreis'))
})

app.listen(3000, ()=>{
    console.log('App is running on port 3000');
})



