const express = require('express');
const cors = require('cors');
require('dotenv').config();
const models = require('./models.js');
const pool = require('../DB/db.js')


// console.log('This is pool', pool);

// pool.query(`SELECT * FROM reviews LIMIT 10;`, (error, results) => {
//   if (error) {
//     console.log('error', error);
//   } else {
//     console.log('results', results);
//   }
// });


const port = process.env.PORT;

const app = express();

//middleware
app.use(express.json());
app.use(cors());


// Loadio Io verification
// app.get('/loaderio-711e50acdbc6a85f11f8fed4b7882c6f', (req, res) => {
//   res.send('loaderio-711e50acdbc6a85f11f8fed4b7882c6f');
// })

// getReviews
app.get('/reviews', (req, res) => {
  // console.time('getReviews')
  models.getReviews(req.query.product_id, req.query.page, req.query.count, req.query.sort)
  .then((results) => {
    res.send({
      'product': req.query.product_id,
      'page': req.query.page,
      'count': req.query.count,
      'results': results
    });
  })
  .catch((error) => {
    console.log('This is error',error)
    res.sendStatus(404);
  })
});

//get metaData
app.get('/metaData', (req, res) => {
  models.fetchMetaData(req.query.product_id)
  .then((result) => {
    res.send(result.rows);
  })
  .catch((error) => {
    console.log('This is error', error)
    res.sendStatus(404);
  })
});

//post review
app.post('/review', (req, res) => {
  models.addReview(req.body)
  .then((results) => {
    res.sendStatus(200);
  })
  .catch((error) => {
    res.sendStatus(404);
  })
})

// addhelpfull
app.put('/reviews/:review_id/helpful', (res, req) => {
  let { review_id } = req.params;
  models.addHelpfulReview({ review_id })
  .then((results) => {
    res.sendStatus(200);
  })
  .catch((error) => {
    res.sendStatus(404);
  })
})

//report review
app.put('/reviews/:review_id/report', (res, req) => {
  let { review_id } = req.params;
  models.reportReview({ review_id }).then((results) => {
    res.sendStatus(200);
  })
  .catch((error) => {
    res.sendStatus(404);
  })
})




// Start the server
app.listen(port, () => {
  console.log(`Server running on port http:/localhost:${port}`);
});