require('dotenv').config();

const sql = require('mssql/msnodesqlv8');

const GET_ALL_EMPLOYEES = `
  SELECT E.Id, E.UserId, U.Firstname, U.Middlename, U.Lastname, A.[Login]  
  FROM [Employee] E 
  LEFT JOIN [User] U ON E.UserId = U.Id 
  LEFT JOIN [Authentication] A ON U.AuthenticationId = A.Id
`;

const GET_ALL_STUDENTS = `
  SELECT S.Id, S.UserId, S.GroupLetter, S.GroupNumber, U.Firstname, U.Middlename, U.Lastname, A.[Login]  
  FROM [Student] S
  LEFT JOIN [User] U ON S.UserId = U.Id 
  LEFT JOIN [Authentication] A ON U.AuthenticationId = A.Id
`;

const GET_ALL_ADMINS = `
  SELECT A.Id, A.UserId, U.Firstname, U.Middlename, U.Lastname, A.[Login]  
  FROM [Admin] A
  LEFT JOIN [User] U ON A.UserId = U.Id 
  LEFT JOIN [Authentication] A ON U.AuthenticationId = A.Id
`;

const GET_ALL_USERS = `
  SELECT U.*, A.Login 
  FROM [User] U
  LEFT JOIN Authentication A ON U.AuthenticationId = A.Id
`;

const CREATE_AUTH = (login, password) => `
  INSERT INTO [Authentication] ([Login], [Password])
  OUTPUT inserted.Id
  VALUES ('${login}', '${password}')
`;

const CREATE_USER_WITH_LASTNAME = (firstname, middlename, lastname, authId) => `
  INSERT INTO [User]
  (Firstname, Middlename, Lastname, AuthenticationId)
  OUTPUT inserted.Id, inserted.Firstname, inserted.Middlename, inserted.Lastname
  VALUES (N'${firstname}', N'${middlename}', N'${lastname}', ${authId})
`;

const CREATE_USER_WITHOUT_LASTNAME = (firstname, middlename, authId) => `
  INSERT INTO [User]
  (Firstname, Middlename, AuthenticationId)
  OUTPUT inserted.Id, inserted.Firstname, inserted.Middlename
  VALUES (N'${firstname}', N'${middlename}', ${authId})
`;

const CREATE_USER_WITH_ROLE = (createdUser) => `
  INSERT INTO [Student] (UserId) 
  VALUES ('${createdUser.recordset[0].Id}')
`;

const CREATE_EMPLOYEE_WITH_ROLE = (createdUser) => `
  INSERT INTO [Employee] (UserId) VALUES ('${createdUser.recordset[0].Id}')
`;

const CREATE_ADMIN_WITH_ROLE = (createdUser) => `
  INSERT INTO [Employee] (UserId) OUTPUT inserted.Id VALUES ('${createdUser.recordset[0].Id}')
`;

const CREATE_ADMIN_USER = (createdUserWithRole) => `
  INSERT INTO [Admin] (EmployeeId)
  VALUES ('${createdUserWithRole.recordset[0].Id}')
`;

const GET_USER_LOGIN_REQUEST = (authId) => `
  SELECT Login FROM [Authentication]
  WHERE [Authentication].Id = ${authId}
`;

const GET_DUBLICATE_LOGIN = (login) => `
  SELECT DISTINCT A.[Login]
  FROM [Authentication] A
  INNER JOIN [Authentication] A1 ON (A.[Login] = '${login}') AND NOT(A.[Id] = A1.[Id])
`;

const GET_DUBLICATE_PASSWORD = (password) => `
  SELECT DISTINCT A.[Password]
  FROM [Authentication] A
  INNER JOIN [Authentication] A1 ON (A.[Password] = '${password}') AND NOT(A.[Id] = A1.[Id])
`;

const sqlConfig = {
  server: process.env.SERVER,
  database: process.env.DATABASE,
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
    useUTC: true,
  },
};

const getConnection = async () => {
  try {
    return await sql.connect(sqlConfig);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { 
  GET_ALL_EMPLOYEES,
  GET_ALL_STUDENTS,
  GET_ALL_ADMINS,
  GET_ALL_USERS,
  CREATE_AUTH,
  CREATE_USER_WITH_LASTNAME,
  CREATE_USER_WITHOUT_LASTNAME,
  CREATE_USER_WITH_ROLE,
  CREATE_EMPLOYEE_WITH_ROLE,
  CREATE_ADMIN_WITH_ROLE,
  CREATE_ADMIN_USER,
  GET_USER_LOGIN_REQUEST,
  GET_DUBLICATE_LOGIN,
  GET_DUBLICATE_PASSWORD,
  getConnection
};
