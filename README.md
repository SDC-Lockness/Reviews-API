![AWS](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Javascript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Node JS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white)
![NGINX](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

# Reviews-API
***
Starting with a sluggish API capable of less than 100RPS, the Atelier Reviews API is the result of refactoring an e-commerce monolithic application to a more performant and scalable microservice architecture capable of handling webscale traffic.

<br />
### Optimizations:
* Implemented an ETL process to migrate over 7GB/20M+ entries into a redesigned postreSQL database optimizing query times to ~1ms.
* Scaled horizontally to a microservice architecture with 3 AWS EC2 instances.
* Utilized an NGINX load balancer to distribute traffic across servers and take advantage of caching capabilities.


<br />
## Stress Testing
##### Randomized selections of dataset @ 1000RPS
93% Decrease in Avg. response time with 163% increase in successful responses

| Test  | Optimization | Avg Response Time | Successfull Response Count |
| ------------- | ------------- | ------------ | ------------- |
| 1  | Single server w/ PostgreSQL on AWS  | 2740ms | 73533 / 120000 |
| 2  | (1) EC2 w/ NGINX Load Balancer  | 3326ms | 61298 / 120000 |
| 3  | (2) EC2 w/ NGINX Load Balancer  | 1859ms | 97917 / 120000 |
| 4  | Optimized database & NGINX  | 167ms | 119974 / 120000 |
| 5  | Optimized caching  | 48ms | 119979 / 120000 |

<br />
## Getting Started
1. From terminal, clone repo
```
git clone https://github.com/SDC-Lockness/Reviews-API.git
```
2. Install dependencies
```
npm install
```
3. Configure .env file
4. Follow sql schemas in the ELT scripts in schema.sql to set up database.
5. Start server
```
npm run start
```

<br />
## Routes
| HTTP Request  | API Endpoint | Response | Status Code |
| ------------- | ------------- | ------------ | ------------- |
| GET  | /reviews  | A list of reviews per particular product | 200 |
| GET  | (/metaData  | Metadata for a single product | 200 |
| POST  | /reviews/:product_id  | Post review for a given product | 200 |
| PUT  | /reviews/helpful/:review_id  | Mark review helpful | 200 |
| PUT  | /reviews/report/:review_id  | Report review | 200 |
