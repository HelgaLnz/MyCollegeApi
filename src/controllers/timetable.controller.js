const { createNewTimetable } = require('../services/timetable.service');
const { validationResult } = require('express-validator');
const errService = require('../services/error.service');


const createTimetable = async (req, res) => {
  try {
    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (errors.array().some((e) => e.location === 'headers')) {
        return res.status(401).json({ errors: errService.UNAUTHORIZED_ERR });
      }

      return res.status(400).json({ errors: errors.array() });
    }

    const body = req.body;

    const result = await createNewTimetable(
      body.corpusId,
      body.file,
      body.fileFormat
    );
    
    //check error
    if(result) res.status(201).json({ msg: 'Record added to timetable' });
    else res.status(409).json({ msg: 'Invalid timetable data' });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports = {
  createTimetable  
};