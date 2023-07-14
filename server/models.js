const db = require('../DB/db.js');


const getReviews = ({ product_id, sort, page, count }) => {

  //CREATE GETREVIEWS QUERY
  const query = `
      SELECT
      R.id AS review_id,
      R.rating,
      R.summary,
      R.recommend,
      R.response,
      R.body,
      R.date,
      R.reviewer_name,
      R.helpfulness,
      (
        SELECT
          array_to_json(coalesce(array_agg(photo), array[]::record[]))
        FROM
          (
            SELECT
              RP.id,
              RP.url
            FROM
              reviews R2
              INNER JOIN reviews_photos RP ON R2.id = RP.review_id
            WHERE
              RP.review_id = R.id
          ) photo
      ) AS photos
    FROM
      reviews R
    WHERE
      R.product_id = $1
      AND R.reported = false
    ORDER BY $2
    LIMIT $3
    OFFSET $4;`

  if (sort === 'relevant'){
    sort = 'R.helpfulness DESC';

  } else if (sort === 'newest'){
    sort = 'R.date DESC';

  } else if (sort === 'helpfulness'){
    sort = 'R.helpfulness DESC';
  }

  const offset = count * page - count;


  return db.query(query, [product_id, sort, count, offset])

    .then(results => { return results; })
    .catch(error => { return error; })

};


const fetchMetaData = ({product_id}) => {

  //CREATE FETCHMETADATA QUERY
  const query = `
      SELECT
      R1.product_id,
      (
        SELECT
          json_object_agg(ALIAS2.rating, coalesce(ALIAS2.count, '0')) AS ratings
        FROM
          (
            SELECT
              empty.rating,
              alias.count
            FROM
              (
                temp_ratings empty FULL OUTER JOIN (
                  SELECT R.rating, CAST(COUNT(*) AS text)
                  FROM reviews R
                  WHERE R.product_id = R1.product_id
                  GROUP BY R.rating
                ) alias USING (rating)
              )
          ) ALIAS2
      ),
      json_build_object(
        'false',
        COUNT(R1.recommend) - SUM(R1.recommend::int),
        'true',
        SUM(R1.recommend::int)
      ) AS recommended,
      (
        SELECT
          json_object_agg(alias2.name, alias2.json_build_object) AS characteristics
        FROM
          (
            SELECT
              alias.name,
              json_build_object('id', alias.id, 'value', alias.value)
            FROM
              (
                SELECT
                  C.name,
                  C.id,
                  AVG(CR.value)::NUMERIC(10, 2) AS value
                FROM
                  characteristics C
                  INNER JOIN characteristic_reviews CR ON C.id = CR.characteristic_id
                WHERE
                  C.product_id = R1.product_id
                GROUP BY
                  C.id
              ) alias
          ) alias2
      )
    FROM
      reviews R1
    WHERE
      R1.product_id = $1
    GROUP BY
      R1.product_id;`


  return db.query(query, [product_id])

    .then(results => { return results; })
    .catch(error => { return error; })

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


const addHelpfulReview = ({ review_id }) => {

  const helpfulQuery = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = $1;`

  return db.query(helpfulQuery, [review_id])

    .then(results => { return results })
    .catch(error => { return error })

};


const reportReview = ({ review_id }) => {

  const reportQuery = `UPDATE reviews SET reported = true WHERE id = $1;`

  return db.query(reportQuery, [review_id])

    .then(results => { return results })
    .catch(error => { return error })

};