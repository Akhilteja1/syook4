
# Time Series Data Streaming Application

This is a Node.js-based application that generates and streams encrypted time-series data over a WebSocket connection, listens for incoming data streams, decrypts and validates the data, and saves it to a  database. It also includes a frontend component to display real-time data.


Before you begin, ensure you have met the following requirements:

Node.js and npm installed on your machine.


To start the frontend application:
cd client
npm install
npm start

To start the listener service
cd server
npm install
node index.js
