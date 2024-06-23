const express = require('express');
const bodyParser = require('body-parser');
const tasksRouter = require('./routes/tasks');
const cors = require('cors');

const app = express();
// Enable CORS for all origins
app.use(cors());

// Other middleware and route handlers
// Define your routes here
const port = 3000;

app.use(bodyParser.json());
app.use('/tasks', tasksRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
