import * as ActionTypes from 'store/action-types';
import Http from 'Http';

const initialState = {
    isAuthenticated: false,
    user: null,
    loader:false,
};

//login 
const authLogin = (state, payload) => {
  const { body } = payload;
  localStorage.setItem('access_token', body.access_token);
  localStorage.setItem('user', JSON.stringify(body));
  Http.defaults.headers.common.Authorization = `Bearer ${body.access_token}`;
  const stateObj = {
    ...state,
      isAuthenticated: true,
      user:body
    };
  return stateObj;
};

//check auth
const checkAuth = (state) => {
    const stateObj = {
      ...state,
      isAuthenticated: !!localStorage.getItem('access_token'),
      user: JSON.parse(localStorage.getItem('user')),
    };
    if (state.isAuthenticated) {
      Http.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
        'access_token',
      )}`;
  
    }
    return stateObj;
};
//register
const authRegister = (state, payload) => {
  const { body } = payload;
  localStorage.setItem('access_token', body.access_token);
  localStorage.setItem('user', JSON.stringify(body));
  Http.defaults.headers.common.Authorization = `Bearer ${body.access_token}`;
  const stateObj = {
    ...state,
    isAuthenticated: true,
    user:body,
  };
  return stateObj;
};


//logout
const authLogout = (state) => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  const stateObj = {
    ...state,
    isAuthenticated: false,
    user: null,
  };
  return stateObj;
};
//file upload
const fileUpload = (state, payload) => {
  const { body } = payload;
  localStorage.setItem('access_token', body.access_token);
  localStorage.setItem('user', JSON.stringify(body));
  Http.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
    'access_token',
  )}`;
  const stateObj = {
    ...state,
    isAuthenticated: true,
    user:body,
  };
  return stateObj;
};

//get list
const getList = (state, payload) => {
  const { body } = payload;
  localStorage.setItem('access_token', body.access_token);
  localStorage.setItem('user', JSON.stringify(body));
  Http.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
    'access_token',
  )}`;
  const stateObj = {
    ...state,
    isAuthenticated: true,
    user:body,
  };
  return stateObj;
};

const Auth = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case ActionTypes.AUTH_LOGIN:
          return authLogin(state, payload);
        case ActionTypes.AUTH_REGISTER:
          return authRegister(state, payload);
        case ActionTypes.AUTH_CHECK:
          return checkAuth(state, payload);
        case ActionTypes.AUTH_LOGOUT:
          return authLogout(state);
        case ActionTypes.FILE_UPLOAD:
          return fileUpload(state, payload);
          case ActionTypes.GET_LIST:
          return getList(state, payload);
        default:
        return state;
    };
}
export default Auth;