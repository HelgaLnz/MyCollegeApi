const express = require('express');
const timetableController = require('../controllers/timetable.controller');
const timetableRoutes = express.Router();
const { accessTokenValidation } = require('../middleware/token.validator');


timetableRoutes.post('/timetable', accessTokenValidation, timetableController.createTimetable);

module.exports = timetableRoutes;