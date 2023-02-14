const { getAllUsers, createNewUser } = require('../services/user.service');
const { validationResult } = require('express-validator');

const getUsers = async (req, res) => {
  try {
    const result = await getAllUsers(req.query.role);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const body = req.body;

    const result = await createNewUser(
      body.firstname,
      body.middlename,
      body.lastname,
      body.login,
      body.password,
      body.role
    );

    if (result) res.status(201).send(result);
    else res.status(409).json({ msg: 'Invalid user data' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
};
