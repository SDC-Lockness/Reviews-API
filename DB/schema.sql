
DROP TABLE IF EXISTS characteristics, characteristicReviews, reviews, photos;

CREATE TABLE characteristics(
  id BIGSERIAL PRIMARY KEY,
  product_id  INT NOT NULL,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE characteristicReviews(
  id BIGSERIAL PRIMARY KEY,
  characteristic_id INT NOT NULL,
  review_id INT NOT NULL,
  value INT NOT NULL
);

CREATE TABLE reviews(
  id BIGSERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  date BIGSERIAL NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  recommend BOOLEAN DEFAULT false,
  reported BOOLEAN DEFAULT false,
  reviewer_name VARCHAR(50) NOT NULL,
  reviewer_email VARCHAR(50) NOT NULL,
  response TEXT NOT NULL,
  helpfulness INT DEFAULT 0
);

CREATE TABLE photos(
  id BIGSERIAL PRIMARY KEY,
  review_id INT NOT NULL,
  photo_url VARCHAR(150) NOT NULL
);



CREATE INDEX product_id_idx ON reviews (product_id);

CREATE INDEX photos_rev_idx ON photos (review_id);


--copy data from csv files to tables

COPY characteristics (id, product_id, name)
FROM '/Users/mexicanpepe/Desktop/characteristics.csv'
DELIMITER ',' CSV HEADER;

COPY characteristicReviews (id, characteristic_id, review_id, value)
FROM '/Users/mexicanpepe/Desktop/characteristic_reviews.csv'
DELIMITER ',' CSV HEADER;

COPY reviews (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/Users/mexicanpepe/Desktop/reviews.csv'
DELIMITER ',' CSV HEADER;

COPY photos (id, review_id, photo_url)
FROM '/Users/mexicanpepe/Desktop/reviews_photos.csv'
DELIMITER ',' CSV HEADER;