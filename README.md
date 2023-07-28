![AWS](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Javascript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Node JS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white)
![NGINX](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

# Reviews-API
Starting with a sluggish API capable of less than 100RPS, the Atelier Reviews API is the result of refactoring an e-commerce monolithic application to a more performant and scalable microservice architecture capable of handling webscale traffic.

## Optimizations:
 *Implemented an ETL process to migrate over 7GB/20M+ entries into a redesigned postreSQL database optimizing query times to ~1ms.
 *Scaled horizontally to a microservice architecture with 3 AWS EC2 instances.
 *Utilized an NGINX load balancer to distribute traffic across servers and take advantage of caching capabilities.
