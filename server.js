require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

const userRoutes = require('./src/routes/user.routes');
const timetableRoutes = require('./src/routes/timetable.routes');

app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use('/', userRoutes);
app.use('/', timetableRoutes);

app.listen(process.env.PORT, () => {
  console.log('Server is listenint on port: ', process.env.PORT);
});
