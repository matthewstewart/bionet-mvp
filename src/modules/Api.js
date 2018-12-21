//import Auth from "./Auth";
//import axios from "axios";
import appConfig from '../configuration.js';

async function getAll (endpoint) {
  try {
    let request = new Request(`${appConfig.apiBaseUrl}/${endpoint}`, { method: 'GET' });
    let response = await fetch(request);
    let result = response.json();
    // console.log(`Api.getAll('${endpoint}').result`, result);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getOne (endpoint, id) {
  try {
    let request = new Request(`${appConfig.apiBaseUrl}/${endpoint}/${id}`, { method: 'GET' });
    let response = await fetch(request);
    let result = response.json();
    //console.log(`Api.getOne('${endpoint}, ${id}').result`, result);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const Api = {
  'getAll': getAll,
  'getOne': getOne,
  // updateLab: async (lab) => {
  //   try {
  //     let config = {
  //       'headers': {  
  //         'authorization': `Bearer ${Auth.getToken()}`
  //       },
  //       'json': true
  //     };
  //     let {message, data} = await axios.post(`${appConfig.apiBaseUrl}/labs/${lab._id}/membership`, lab, config);
  //     let res = {
  //       'success': true,
  //       'message': message,
  //       'result': data.data,
  //       'error': null
  //     };
  //     return res;
  //   } catch (error) {
  //     let res = {
  //       'success': false,
  //       'message': `There was a problem posting to ${appConfig.apiBaseUrl}/labs/${lab._id}/membership .`,
  //       'result': {},
  //       'error': {
  //         'code': error.response.status,
  //         'message': error.response.statusText
  //       }
  //     };
  //     return res;
  //   }
  // } 
}

export default Api;