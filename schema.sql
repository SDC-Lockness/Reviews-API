
DROP TABLE IF EXISTS characteristics, characteristicsReviews, reviews, photos;

CREATE TABLE characteristics (
  id int not null,
  product_id int primary key,
  name varchar(50) not null
);

CREATE TABLE characteristicsReviews (
  id int not null,
  characteristic_id int not null,
  review_id int primary key,
  value int not null
);

CREATE TABLE reviews (
  id int primary key,
  product_id int references characteristics(product_id),
  rating int not null,
  date timestamp not null,
  summary varchar(700) not null,
  body varchar(1000) not null,
  recommend boolean not null,
  reported boolean not null,
  reviewer_email varchar(60) not null,
  response varchar(200) default null,
  helpfulness int not null
);

CREATE TABLE photos (
  id int primary key ,
  review_id int references characteristicsReviews(review_id),
  photo_Url varchar(300) NOT NULL
);
