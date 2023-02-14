const sql = require('./sql.service');
const errService = require('./error.service');
const { generateTokens } = require('../services/token.service');

const getAllUsers = async (role) => {
  try {
    const pool = await sql.getConnection();

    let result;
    switch (role) {
    case 'employee':
      result = await pool.request().query(sql.GET_ALL_EMPLOYEES);
      break;
    case 'student':
      result = await pool.request().query(sql.GET_ALL_STUDENTS);
      break;
    case 'admin':
      result = await pool.request().query(sql.GET_ALL_ADMINS);
      break;
    default: 
      result = await pool.request().query(sql.GET_ALL_USERS);
      break;
    }

    return result.recordset;
  } catch (error) {
    console.log('Sql server error:', error);
  }
};

const createNewUser = async (
  firstname,
  middlename,
  lastname,
  login,
  password,
  role
) => {
  try {
    const pool = await sql.getConnection();

    const checkExistingLoginRequest = sql.GET_DUBLICATE_LOGIN(login);
    const isLoginExists = await pool.request().query(checkExistingLoginRequest);
    if(isLoginExists.recordset[0].Count > 0) {
      return errService.LOGIN_CONFLICT_ERR;
    }

    const createAuthRequest = sql.CREATE_AUTH(login, password);
    const authId = (await pool.request().query(createAuthRequest))
      .recordset[0]
      .Id;

    const createUserRequest = lastname 
      ? sql.CREATE_USER_WITH_LASTNAME(firstname, middlename, lastname, authId)
      : sql.CREATE_USER_WITHOUT_LASTNAME(firstname, middlename, authId);

    const createdUser = await pool.request().query(createUserRequest);

    let createUserWithRoleRequest = '';
    switch(role) {
    case 'student': 
      createUserWithRoleRequest = sql.CREATE_USER_WITH_ROLE(createdUser);
      break;
    case 'employee': 
      createUserWithRoleRequest = sql.CREATE_EMPLOYEE_WITH_ROLE(createdUser);
      break;
    case 'admin': 
      createUserWithRoleRequest = sql.CREATE_ADMIN_WITH_ROLE(createdUser);
      break;
    }

    const createdUserWithRole = await pool.request().query(createUserWithRoleRequest);
    
    if(createdUserWithRole.recordset) {
      const createAdminUser = sql.CREATE_ADMIN_USER(createdUserWithRole);
      await pool.request().query(createAdminUser);
    }

    const userLogin = await pool.request().query(sql.GET_USER_LOGIN_REQUEST(authId));
    
    const user = createdUser.recordset[0];
    user.Login = userLogin.recordset[0].Login;
    user.Role = role;

    const tokens = generateTokens(authId);
    user.AccessToken = tokens.accessToken;
    user.RefreshToken = tokens.refreshToken;

    return user;
  } catch (error) {
    console.log('sql server error:', error);
  }
};

module.exports = {
  getAllUsers,
  createNewUser,
};
