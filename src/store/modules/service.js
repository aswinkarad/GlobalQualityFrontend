// store/modules/service.js (Your service-specific Vuex module)

import axios from 'axios';

export default {
  namespaced: true, // Ensures this module has its own namespace (e.g., service/GET_SERVICE_LIST)
  state: {
    serviceList: [],
    serviceReportList: {},
    editServicetValue: {},
    serviceTotalPages: '',
    serialList: [], // Ensure serialList is defined
  },
  mutations: {
    SET_SERVICE_LIST(state, data) {
      state.serviceList = data;
    },
    SET_SERVICE_REPORT_LIST(state, data) {
      state.serviceReportList = data;
    },
    REMOVE_ALL_SERVICE_LIST(state) {
      state.serviceList = {};
    },
    SET_EDIT_SERVICE_VALUE(state, data) {
      state.editServicetValue = data;
    },
    SET_SERVIEC_TOTAL_PAGES(state, data) {
      state.serviceTotalPages = data;
    },
    SET_SERIAL_LIST(state, data) {
      state.serialList = data;
    },
    // Add mutation for successful service addition
    ADD_SERVICE_SUCCESS(state, data) {
      state.serviceList.unshift(data); // Add new service to the beginning of the list
    },
  },
  actions: {
    async GET_SERVICE_LIST({ commit }, query) {
      const auth = JSON.parse(localStorage.getItem('user'));
      // console.log(auth);
      
      const options = {
        method: 'get',
        url: `${process.env.VUE_APP_BASE_URL}service/list_of_servicereq`,
        headers: {
          Authorization: 'Bearer ' + auth.access_token,
        },
        params: query || {},
      };

      // console.log('Request Options (GET_SERVICE_LIST):', options);

      try {
        const response = await axios(options);
        console.log('API Response (GET_SERVICE_LIST):', response.data);

        commit('SET_SERVICE_LIST', response.data.data);
        commit('SET_SERVIEC_TOTAL_PAGES', response.data.totalPages);
        
        return response.data;
      } catch (error) {
        console.error('API Error (GET_SERVICE_LIST):', error);
        if (error.response) {
          console.error('Error Response Data (GET_SERVICE_LIST):', error.response.data);
        }
        throw error;
      }
    },

    async GET_SERVICE_REPORT_LIST({ commit }, query) {
      const auth = JSON.parse(localStorage.getItem('user'));
      const options = {
        method: 'get',
        url: `${process.env.VUE_APP_BASE_URL}service/list_of_servicereq`,
        headers: {
          Authorization: 'Bearer ' + auth.access_token,
        },
        params: query || {},
      };
      try {
        const data = await axios(options);
        commit('SET_SERVICE_REPORT_LIST', data.data.data);
        return data.data;
      } catch (error) {
        console.error('API Error (GET_SERVICE_REPORT_LIST):', error);
        throw error;
      }
    },
async ADD_SERVICE({ commit }, payload) {
  const auth = JSON.parse(localStorage.getItem('user'));

  if (!auth || !auth.access_token) {
    throw new Error('Authentication token not found');
  }

  // console.log('Adding service request with payload:', payload);

  if (payload instanceof FormData) {
    // console.log('FormData entries for ADD_SERVICE:');
    for (let [key, value] of payload.entries()) {
      // console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
    }
  }

  await axios({
    method: 'post',
    url: `${process.env.VUE_APP_BASE_URL}service/add_servicereq`,
    data: payload,
    headers: {
      Authorization: 'Bearer ' + auth.access_token,
    },
    timeout: 30000, // 30 second timeout for file uploads
  });

  commit('ADD_SERVICE_SUCCESS', payload);
},

    async CHENGE_SERVICE_STATUS({ commit }, payload) {
      try {
        const auth = JSON.parse(localStorage.getItem('user'));
        const data = new FormData();
        data.append('workingStatusId', payload.workingStatusId);
        data.append('saleId', payload.saleId); // Make sure saleId is correctly appended
        const response = await axios({
          method: 'post',
          url: `${process.env.VUE_APP_BASE_URL}service/update_servicereq/${payload.id}`,
          data: data,
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
            'Content-Type': 'multipart/form-data', // Explicitly set for FormData when not auto-handled
          },
        });
        return response.data;
      } catch (error) {
        // console.error('Error changing service status:', error);
        throw error;
      }
    },

    async DELETE_SERVICE_REQUEST({ commit }, payload) {
      try {
        const auth = JSON.parse(localStorage.getItem('user'));
        const response = await axios({
          method: 'get', // Typically DELETE method is used for deletion, but your code uses 'get'
          url: `${process.env.VUE_APP_BASE_URL}service/delete_servicereq/${payload.id}`,
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
          },
        });
        return response.data;
      } catch (error) {
        // console.error('Error deleting service request:', error);
        throw error;
      }
    },

   async GET_SERVICE_WITH_ID({ commit }, id) { // Changed payload to id for clarity
  
  try {
    const auth = JSON.parse(localStorage.getItem('user'));
      const response = await axios({
      method: 'get',
      url: `${process.env.VUE_APP_BASE_URL}service/list_of_servicereq`,
      params: {
        id: id,
      },
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
      },
    });
     const serviceData = response.data.data[0];
    // Ensure documents is an array
    serviceData.documents = Array.isArray(serviceData.documents)
      ? serviceData.documents
      : (serviceData.documents ? JSON.parse(serviceData.documents) : []);
    commit('SET_EDIT_SERVICE_VALUE', serviceData);
    console.log(serviceData);
    
    return serviceData;
  } catch (error) {
    throw error;
  }
},

    async UPDATE_SERVICE({ commit }, payload) {
      try {
        const auth = JSON.parse(localStorage.getItem('user'));
        const data = payload.formData; // The formData is already prepared in ServiceEdit.vue
        const response = await axios({
          method: 'post', // Assuming POST for updates with FormData
          url: `${process.env.VUE_APP_BASE_URL}service/update_servicereq/${payload.id}`,
          data: data,
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
            'Content-Type': 'multipart/form-data', // Important for FormData
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error updating service:', error);
        if (error.response) {
            // console.error('Error Response Data (UPDATE_SERVICE):', error.response.data);
            // console.error('Status Code (UPDATE_SERVICE):', error.response.status);
            throw new Error(error.response.data.message || `Server error: ${error.response.status}`);
        } else if (error.request) {
            // console.error('No response received (UPDATE_SERVICE):', error.request);
            throw new Error('No response from server when updating service.');
        } else {
            // console.error('Request setup error (UPDATE_SERVICE):', error.message);
            throw new Error(error.message || 'An unexpected error occurred during update.');
        }
      }
    },

    async GET_SALE_EQUIPMENT_BY_EQUIPMENT_ID_AND_CLIENT_ID({ commit }, params) {
      try {
        const auth = JSON.parse(localStorage.getItem('user'));
        const response = await axios({
          method: 'get',
          url: `${process.env.VUE_APP_BASE_URL}sales/list`,
          params: {
            clientId: params.cid,
            equipmentId: params.eid,
          },
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
          },
        });
        commit('SET_SERIAL_LIST', response.data.data);
        return response.data.data;
      } catch (error) {
        console.error('Error fetching sale equipment by client and equipment ID:', error);
        commit('SET_SERIAL_LIST', []);
        throw error;
      }
    },

    async GET_ALL_SALE_EQUIPMENT({ commit }) {
      try {
        const auth = JSON.parse(localStorage.getItem('user'));
        const response = await axios({
          method: 'get',
          url: `${process.env.VUE_APP_BASE_URL}sales/list_all`,
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
          },
        });
        commit('SET_SERIAL_LIST', response.data.data);
        return response.data.data;
      } catch (error) {
        console.error('Error fetching all sale equipment:', error);
        commit('SET_SERIAL_LIST', []);
        throw error;
      }
    },
  },
  getters: {
    getClientById: (state) => (id) => {
      // This getter would only work if clientList is part of this module's state
      // or a global state accessible here. If clients is a separate module,
      // you'd access it via rootGetters.
      return state.clientList.find((list) => list.id === id);
    },
    getworkingConditoinWithId: (state) => (id) => {
      // Similar note for conditionList
      return state.conditionList.find((condition) => condition.id === id);
    },
  },
};