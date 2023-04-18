import axios from 'axios';
import store from './store';
import * as actions from './store/actions';
import env from './env.json'

const access_token = localStorage.getItem('access_token');
axios.defaults.baseURL = `http://localhost:5656/`;
axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
axios.defaults.headers.common.secret_key = env.SCERET_KEY;
axios.defaults.headers.common.publish_key = env.PUBLISH_KEY;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = true;

// Create instance
const axiosInstance = axios.create();

// Axios wrapper to handle error
const axiosWrapper = apiCall => apiCall.then(res => res.data).catch(err => Promise.reject(err));

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 403) {
        store.dispatch(actions.authLogout());
    }
    return Promise.reject(error);
  },
);

export default axios;
