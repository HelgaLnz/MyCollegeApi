const { createNewTimetable } = require('../services/timetable.service');

const createTimetable = async (req, res) => {
  try {
    //validation

    const body = req.body;

    const result = await createNewTimetable(
      body.corpusId,
      body.file,
      body.fileFormat
    );
    
    //check error
    console.log(result);
    if(result) res.status(201).json({ msg: 'Record added to timetable' });
    else res.status(409).json({ msg: 'Invalid timetable data' });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports = {
  createTimetable  
};