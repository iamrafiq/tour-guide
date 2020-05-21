const fs = require('fs');
const express = require('express');
var bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use( bodyParser.json());       // to support JSON-encoded bodies



const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

const getAllTours = (req, res)=>{
    res.status(200).json({
        status:'success',
        results:tours.length,
        data:{
            tours:tours
        }
    });
}

const getTour =  (req, res)=>{
 
    const id = req.params.id * 1; // mulltiply by 1 will convert the string to int
    const tour = tours.find(el=> el.id ===id);
    //if(id>tours.length){
    if(!tour){
        return res.status(404).json({
            status:'fail',
            message:'Invalid ID'
        });
    }
    res.status(200).json({
        status:'success',
        data:{
            tour:tour
        }
    });
};
const createTour = (req, res)=>{
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
}

const updateTour = (req, res)=>{
    if(req.params.id * 1>tours.length){
            return res.status(404).json({
                status:'fail',
                message:'Invalid ID'
            });
        }
    res.status(200).json({
        status:'success',
        data:{
            tour:'<Updated tour here>'
        }
       
    });
};
const deleteTour = (req, res)=>{
    if(req.params.id * 1>tours.length){
            return res.status(404).json({
                status:'fail',
                message:'Invalid ID'
            });
        }
    res.status(204).json({
        status:'success',
        data:null
    });
};

/**
 * app.get('/api/v1/tours', getAllTours);
 * app.post('/api/v1/tours', createTour);
 * in one call below
 */
app
   .route('/api/v1/tours')
   .get(getAllTours)
   .post(createTour);

/**
 * app.get('/api/v1/tours/:id', getTour);
 * app.patch('/api/v1/tours/:id', updateTour);
 * app.delete('/api/v1/tours/:id', deleteTour)
 * 
 * in one call all three below
 */
app
   .route('/api/v1/tours/:id')
   .get(getTour)
   .patch(updateTour)
   .delete(deleteTour)
//starting server
const port = 3000;
app.listen(port, ()=>{
    console.log(`app running on port ${port}...`);
});