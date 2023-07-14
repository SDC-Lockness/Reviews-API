
DROP TABLE IF EXISTS characteristics, characteristic_reviews, reviews, review_photos;

CREATE TABLE reviews(
  id BIGSERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  date  BIGINT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  recommend BOOLEAN DEFAULT false,
  reported BOOLEAN DEFAULT false,
  reviewer_name VARCHAR(50) NOT NULL,
  reviewer_email VARCHAR(50) NOT NULL,
  response TEXT NOT NULL,
  helpfulness INT DEFAULT 0
);

CREATE TABLE review_photos(
  id BIGSERIAL,
  review_id INT NOT NULL REFERENCES reviews(id),
  photo_url VARCHAR(150) NOT NULL
);

CREATE TABLE characteristics(
  id BIGSERIAL PRIMARY KEY,
  product_id  INT NOT NULL,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE characteristic_reviews(
  id BIGSERIAL PRIMARY KEY,
  characteristic_id INT NOT NULL REFERENCES characteristics(id),
  review_id INT NOT NULL REFERENCES reviews(id),
  value INT NOT NULL
);


/*
copy data from csv files to tables
*/
COPY reviews (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/Users/mexicanpepe/Desktop/reviews.csv'
DELIMITER ',' CSV HEADER;

COPY review_photos (id, review_id, photo_url)
FROM '/Users/mexicanpepe/Desktop/reviews_photos.csv'
DELIMITER ',' CSV HEADER;

COPY characteristics (id, product_id, name)
FROM '/Users/mexicanpepe/Desktop/characteristics.csv'
DELIMITER ',' CSV HEADER;

COPY characteristic_reviews (id, characteristic_id, review_id, value)
FROM '/Users/mexicanpepe/Desktop/characteristic_reviews.csv'
DELIMITER ',' CSV HEADER;

