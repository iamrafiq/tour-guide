const fs = require('fs');
const express = require('express');
var bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use( bodyParser.json());       // to support JSON-encoded bodies


/*
app.get('/', (req, res)=>{

    //res.status(200).send('Hello from the server side');
    //or json    
    res.status(200).json({message:'Hello from server', app:'toure guide'});


});
app.post('/', (req, res)=>{
    res.send('you can post to this input');
})*/
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
app.get('/api/v1/tours', (req, res)=>{
    res.status(200).json({
        status:'success',
        results:tours.length,
        data:{
            tours:tours
        }
    });
});

app.get('/api/v1/tours/:id', (req, res)=>{
 
    const id = req.params.id * 1; // mulltiply by 1 will convert the string to int
    const tour = tours.find(el=> el.id ===id);

    res.status(200).json({
        status:'success',
        data:{
            tour:tour
        }
    });
});

app.post('/api/v1/tours', (req, res)=>{
    console.log(req.body);
    const newId = tours[tours.length-1].id + 1;
    const newTour = Object.assign({id:newId}, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err =>{
        res.status(201).json({
            status:'success',
            data:{
                tour:newTour
            }
        });
    });
})
//starting server
const port = 3000;
app.listen(port, ()=>{
    console.log(`app running on port ${port}...`);
});