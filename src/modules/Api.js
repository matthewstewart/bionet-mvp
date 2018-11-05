import Auth from "./Auth";
import axios from "axios";
import appConfig from '../configuration.js';

const Api = {
  getAll: async (modelNamePlural) => {
    try {
      let {message, data} = await axios.get(`${appConfig.apiBaseUrl}/${modelNamePlural}`);
      let res = {
        'success': true,
        'message': message,
        'result': data.data,
        'error': null
      };
      return res;
    } catch (error) {
      let res = {
        'success': false,
        'message': `There was a problem fetching ${appConfig.apiBaseUrl}/${modelNamePlural}.`,
        'result': [],
        'error': {
          'code': error.response.status,
          'message': error.response.statusText
        }
      };
      return res;
    }
  },
  getOne: async (modelNamePlural, id) => {
    try {
      let {message, data} = await axios.get(`${appConfig.apiBaseUrl}/${modelNamePlural}/${id}`);
      let res = {
        'success': true,
        'message': message,
        'result': data.data,
        'error': null
      };
      return res;
    } catch (error) {
      let res = {
        'success': false,
        'message': `There was a problem fetching ${appConfig.apiBaseUrl}/${modelNamePlural}/${id}.`,
        'result': [],
        'error': {
          'code': error.response.status,
          'message': error.response.statusText
        }
      };
      return res;
    }
  },
  updateLab: async (lab) => {
    try {
      let config = {
        'headers': {  
          'authorization': `Bearer ${Auth.getToken()}`
        },
        'json': true
      };
      let {message, data} = await axios.post(`${appConfig.apiBaseUrl}/labs/${lab._id}/membership`, lab, config);
      let res = {
        'success': true,
        'message': message,
        'result': data.data,
        'error': null
      };
      return res;
    } catch (error) {
      let res = {
        'success': false,
        'message': `There was a problem posting to ${appConfig.apiBaseUrl}/labs/${lab._id}/membership .`,
        'result': {},
        'error': {
          'code': error.response.status,
          'message': error.response.statusText
        }
      };
      return res;
    }
  } 
}

export default Api;