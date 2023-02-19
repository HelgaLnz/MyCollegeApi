const express = require('express');
const timetableController = require('../controllers/timetable.controller');
const timetableRoutes = express.Router();

timetableRoutes.post('/timetable', timetableController.createTimetable);

module.exports = timetableRoutes;