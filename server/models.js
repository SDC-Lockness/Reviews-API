const db = require('../DB/db.js');


const getReviews = (product_id = 40346, page = 1, count = 5, sort = 'date') => {
  // Create the sort mapping
  const sortMapping = {
    relevant: 'helpfulness DESC',
    newest: 'date DESC',
    helpfulness: 'helpfulness DESC',
  };

  // Validate and get the sort column
  const sortColumn = sortMapping[sort.toLowerCase()] || 'date';

  // Calculate the offset based on the page and count
  const offset = (page - 1) * count;

  const query = `
    SELECT
      r.id AS review_id,
      r.rating,
      r.summary,
      r.recommend,
      r.response,
      r.body,
      r.date,
      r.reviewer_name,
      r.helpfulness,
      json_agg(json_build_object('url', rp.photo_url)) AS photos
    FROM
      reviews r
      LEFT JOIN review_photos rp ON r.id = rp.review_id
    WHERE
      r.product_id = $1
    GROUP BY
      r.id
    ORDER BY
      ${sortColumn}
    LIMIT
      $2 OFFSET $3;
  `;

  return db.query(query, [product_id, count, offset]);
};



const fetchMetaData = (product_id = 40347) => {

  //CREATE FETCHMETADATA QUERY
  const query = `
      WITH ratings AS (
        SELECT rating, COUNT(*) as count
        FROM reviews
        WHERE product_id = $1
        GROUP BY rating
      ),
      recommendations AS (
        SELECT recommend, COUNT(*) as count
        FROM reviews
        WHERE product_id = $1
        GROUP BY recommend
      ),
      chars AS (
        SELECT
          c.name,
          c.id AS characteristic_id,
          AVG(cr.value) as value
        FROM characteristics c
        JOIN characteristic_reviews cr ON c.id = cr.characteristic_id
        WHERE c.product_id = $1
        GROUP BY c.name, c.id
      )
      SELECT
        r.product_id,
        (SELECT jsonb_object_agg(rating, count) FROM ratings) AS ratings,
        (SELECT jsonb_object_agg(recommend::text, count) FROM recommendations) AS recommended,
        (SELECT jsonb_object_agg(name, jsonb_build_object('id', characteristic_id, 'value', value::text)) FROM chars) AS characteristics
      FROM reviews r
      WHERE r.product_id = $1;
    `;

  return db.query(query, [product_id])
};


const addReview = ({ product_id, rating, summary, body, name, email, photos, characteristics }) => {

  const postReviewQuery = `
      INSERT INTO reviews
        (
        product_id,
        rating,
        date,
        summary,
        body,
        reviewer_name,
        reviewer_email,
        helpfulness
        )
      VALUES
        ($1, $2, current_timestamp, $3, $4, $5, $6, 0)
        RETURNING id;
    `

  const addPhotosQuery = `
        INSERT INTO reviews_photos
          (review_id, url)
        SELECT
          review_id,
          url
        FROM
        UNNEST
          ($1::int[], $2::text[]) AS alias
          (review_id, url)`


  const addCharacteristicsQuery = `
          INSERT INTO characteristic_reviews
            (characteristic_id, review_id, value)
          SELECT
            characteristic_id,
            review_id,
            value
          FROM
          UNNEST
            ($1::int[], $2::int[], $3::int[])
            AS alias
            (characteristic_id, review_id, value)`

  return db.query(postReviewQuery, [product_id, rating, summary, body, name, email])
    .then(results => {

      const review_id = results.rows[0].id;

      db.query(addPhotosQuery, [Array(photos.length).fill(review_id), photos])
        .then(results => console.log('photo added'))
        .catch(error => console.log(error))

      db.query(addCharacteristicsQuery, [Object.keys(characteristics), Array(Object.keys(characteristics).length).fill(review_id), Object.values(characteristics)] )

        .then(results => console.log('Characteristics added'))
        .catch(error => console.log(error))

    })

    .catch(error => { return error })

};


const addHelpfulReview = ( review_id ) => {

  const helpfulQuery = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = $1;`

  return db.query(helpfulQuery, [review_id])
};


const reportReview = ( review_id ) => {

  const reportQuery = `UPDATE reviews SET reported = true WHERE id = $1;`

  return db.query(reportQuery, [review_id])
};

module.exports.getReviews = getReviews;
module.exports.fetchMetaData = fetchMetaData;
module.exports.addReview = addReview;
module.exports.addHelpfulReview = addHelpfulReview;
module.exports.reportReview = reportReview;