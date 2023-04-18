import Http from 'Http';
import * as action from 'store/actions';

let apiPath = 'api';
//login
export function login(credentials) {
    return (dispatch) => new Promise((resolve, reject) => {
      Http.post(`${apiPath}/auth/login`, credentials)
        .then((res) => {
          dispatch(action.authLogin(res.data));
          return resolve(res.data);
        })
        .catch((err) => {
          const { status, data } = err.response;
          const res = {
            status,
            data,
          };
          return reject(res);
        });
    });
}

//register
export function register(credentials) {
  return (dispatch) => new Promise((resolve, reject) => {
    Http.post(`${apiPath}/auth/sign_up`, credentials)
      .then((res) => {
        dispatch(action.authRegister(res.data));
        return resolve(res.data);
      })
      .catch((err) => {
        const { status, data } = err.response;
        const res = {
          status,
          data,
        };
        return reject(res);
      });
  });
}
//logout
export function logout(credentials) {
  // return
  return (dispatch) => new Promise((resolve, reject) => {
    Http.get(`${apiPath}/auth/logout`, credentials)
      .then((res) => {
        dispatch(action.authLogout(res.data));
        return resolve(res.data);
      })
      .catch((err) => {
        const { status, data } = err.response;
        const res = {
          status,
          data,
        };
        return reject(res);
      });
  });
}


//upload file
export function fileUpload(values) {
  return (dispatch) => new Promise((resolve, reject) => {
    Http.post(`${apiPath}/file_upload`, values)
      .then((res) => resolve(res.data))
      .catch((err) => {
        const { status, data } = err.response;
        const res = {
          status,
          data,
        };
        return reject(res);
      });
  });
}

//user 
export function getList(value) {
  return (dispatch) => new Promise((resolve, reject) => {
    Http.get(`${apiPath}/${value.MODULE_NAME}/list`)
      .then((res) => resolve(res.data))
      .catch((err) => {
        const { status, data } = err.response;
        const res = {
          status,
          data,
        };
        return reject(res);
      });
  });
}



