import * as ActionTypes from 'store/action-types';

export function authLogin(payload) {
  return {
    type: ActionTypes.AUTH_LOGIN,
    payload,
  };
}

export function authCheck() {
    return {
      type: ActionTypes.AUTH_CHECK,
    };
}

export function authRegister(payload) {
  return {
    type: ActionTypes.AUTH_REGISTER,
    payload,
  };
}

export function authLogout() {
  return {
    type: ActionTypes.AUTH_LOGOUT,
  };
}

export function fileUpload(payload) {
  return {
    type: ActionTypes.FILE_UPLOAD,
    payload
  };
}

export function getList(payload) {
  return {
    type: ActionTypes.GET_LIST,
    payload
  };
}

export function persist_store(payload) {
    return {
      type: ActionTypes.PERSIST_STORE,
        payload
    };
}