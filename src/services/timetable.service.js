const sql = require('./sql.service');

const createNewTimetable = async (
  corpusId,
  file,
  fileFormat
) => {
  try {
    const pool = await sql.getConnection();

    const createTimetableRequest = sql.CREATE_TIMETABLE(corpusId, file, fileFormat);

    const createdTimetable = await pool.request().query(createTimetableRequest);
    
    return createdTimetable;
  } catch (error) {
    console.log('sql server error:', error);
  }
};

module.exports = {
  createNewTimetable
};