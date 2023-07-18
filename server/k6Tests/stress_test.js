// Stress Testing is a type of load testing used to determine the limits of the system.

/*
Run a stress test to :
-Determine how your system will behave under extreme conditions
-Determine what is the maximum capacity of your system in terms of users or throughput
-Determine the breaking point of your system and its failure mode
-Determine if your system will recover without manual intervention after the stress test is over
*/

import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  stages: [
    { duration: '10s', target: 10 }, //below normal load
    { duration: '30s', target: 10 },
    { duration: '10s', target: 100 }, // normal load
    { duration: '30s', target: 100 },
    { duration: '10s', target: 500 }, // around the breaking point
    { duration: '30s', target: 500 },
    { duration: '10s', target: 1000 }, // beyond the breaking point
    { duration: '30s', target: 1000 },
    { duration: '10s', target: 2000 },
    { duration: '30s', target: 2000 },
    { duration: '1m', target: 100 },// scale down. recovery stage.
  ]
};

const API_BASE_URL = 'http://localhost:3008';

export default () => {
  http.batch(
    [
      { method: 'GET', url: `${API_BASE_URL}/reviews` },
      { method: 'GET', url: `${API_BASE_URL}/metaData` },
    ]
  );

  sleep(1);
}