// salesEquipment.js
import axios from 'axios';

export default {
  namespaced: true,
  state: {
    saleEquipmentList: [],
    saleEquipmentReport: {},
    editValue: {},
    serialList: {},
    saleTotalPage: '',
  },
  mutations: {
    SET_SALE_EQUIPMENTS(state, data) {
      state.saleEquipmentList = data;
    },
    SET_SALE_EQUIPMENTS_REPORT_DATA(state, data) {
      state.saleEquipmentReport = data;
    },
    REMOVE_SALE_EQUIPMENTS(state) {
      state.saleEquipmentList = [];
    },
    SET_EDIT_SALE_EQUIPMET_VALUE(state, data) {
      state.editValue = data;
    },
    SET_SALE_EQUIMENT_TOTAL_PAGE(state, data) {
      state.saleTotalPage = data;
    },
    SET_SALE_EQUIPMENT_BY_EQUIPMENT_ID_AND_CLIENT_ID(state, data) {
      state.serialList = data;
    },
  },
  actions: {
    async GET_ALL_SALE_EQUIPMENT({ commit }, params) {
      try {
        const auth = JSON.parse(localStorage.getItem('user'));
        if (!auth || !auth.access_token) {
          throw new Error('User not authenticated');
        }

        const options = {
          method: 'get',
          url: `${process.env.VUE_APP_BASE_URL}sales/list_of_sales`,
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
          },
          params: params || {},
        };

        const { data } = await axios(options);
        commit('SET_SALE_EQUIPMENTS', data.data);
        commit('SET_SALE_EQUIMENT_TOTAL_PAGE', data.totalPages);
        // console.log(data);
        
        return data;
      } catch (error) {
        console.error('GET_ALL_SALE_EQUIPMENT action: Error', error);
        throw error;
      }
    },
    async GET_ALL_SALE_EQUIPMENT_FOR_REPORT({ commit }, params) {
      try {
        const auth = JSON.parse(localStorage.getItem('user'));
        const options = {
          method: 'get',
          url: `${process.env.VUE_APP_BASE_URL}sales/list_of_sales`,
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
          },
          params: params || {},
        };
        const { data } = await axios(options);
        commit('SET_SALE_EQUIPMENTS_REPORT_DATA', data.data);
        return data;
      } catch (error) {
        console.error('Error fetching sale equipment for report:', error);
        throw error;
      }
    },
    async ADD_SALE_EQUIPMENT({ commit }, payload) {
      try {
        const auth = JSON.parse(localStorage.getItem('user'));
        const formData = new FormData();

        formData.append('serialNo', payload.serialNo || '');
        formData.append('equipmentId', payload.equipmentId || '');
        formData.append('clientId', payload.clientId || '');
        formData.append('maintenancePeriod', payload.maintenancePeriod || '');
        formData.append('purchaseDate', payload.purchaseDate || '');
        formData.append('installationDate', payload.installationDate || '');
        formData.append('LastMaintenanceDate', payload.lastMaintenanceDate || '');
        formData.append('warrantyDate', payload.warrantyDate || '');
        formData.append('status', payload.status !== undefined ? payload.status : '');

        // Direct attachments: Append File object if present, otherwise append empty string to clear it
        formData.append('invoice', payload.invoice instanceof File ? payload.invoice : '');
        formData.append('installationReport', payload.installationReport instanceof File ? payload.installationReport : '');
        formData.append('warrantyDocument', payload.warrantyDocument instanceof File ? payload.warrantyDocument : '');
        formData.append('maintenanceContract', payload.maintenanceContract instanceof File ? payload.maintenanceContract : '');
        formData.append('annualMaintenanceContract', payload.annualMaintenanceContract instanceof File ? payload.annualMaintenanceContract : '');

        // For additional documents (array of files and their names)
        if (payload.documents && Array.isArray(payload.documents) && payload.documents.length > 0) {
          payload.documents.forEach((file, index) => {
            if (file instanceof File) {
              formData.append('documents', file); // Append the actual File object
              formData.append('typeNames', payload.typeNames[index] || `Document_${index + 1}`); // Append the corresponding name
            }
          });
        }

        const response = await axios({
          method: 'post',
          url: `${process.env.VUE_APP_BASE_URL}sales/add_sales`,
          data: formData,
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
            'Content-Type': 'multipart/form-data',
          },
        });

        return response.data;
      } catch (error) {
        console.error('Error in ADD_SALE_EQUIPMENT:', error);
        throw error;
      }
    },

    // salesEquipment.js - Inside actions
    async UPDATE_SALE_EQUIPMENT({ commit }, { id, formData }) { // Destructure id and formData
      try {
        console.log('UPDATE_SALE_EQUIPMENT payload (formData):', formData);

        const auth = JSON.parse(localStorage.getItem('user'));

        const response = await axios({
          method: 'post', // Use POST for multipart form data, even for updates
          url: `${process.env.VUE_APP_BASE_URL}sales/update_sales/${id}`, // Use the id from the payload
          data: formData, // Pass the FormData directly
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
            'Content-Type': 'multipart/form-form-data', // This header is automatically set by Axios when using FormData
          },
        });

        console.log('UPDATE_SALE_EQUIPMENT response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error updating sale equipment:', error);
        throw error;
      }
    },
    // async DELETE_SALE_EQUIPMENT({ commit, state }, saleId) {
    //   try {
    //     const auth = JSON.parse(localStorage.getItem('user'));
    //     if (!auth || !auth.access_token) {
    //       throw new Error('User not authenticated');
    //     }

    //     const response = await axios({
    //       method: 'delete',
    //       url: `${process.env.VUE_APP_BASE_URL}sales/delete_sales/${saleId}`,
    //       headers: {
    //         Authorization: 'Bearer ' + auth.access_token,
    //       },
    //     });

    //     commit('SET_SALE_EQUIPMENTS', state.saleEquipmentList.filter(item => item.id !== saleId));
    //     return response.data;
    //   } catch (error) {
    //     console.error('Error deleting sale equipment:', error);
    //     let userFriendlyMessage = 'Error deleting equipment';
    //     if (error.response) {
    //       if (error.response.status === 404) {
    //         userFriendlyMessage = 'Equipment not found. It may have already been deleted.';
    //       } else if (error.response.status === 401) {
    //         userFriendlyMessage = 'You are not authorized to delete this equipment.';
    //       } else if (error.response.status === 400 && error.response.data.message) {
    //         userFriendlyMessage = error.response.data.message;
    //       } else if (error.response.data.message) {
    //         userFriendlyMessage = error.response.data.message;
    //       }
    //     }
    //     throw new Error(userFriendlyMessage);
    //   }
    // },
    async DELETE_SALE_EQUIPMENT({ commit }, payload) {
      try {
        const auth = JSON.parse(localStorage.getItem('user'));
        const deleteCity = await axios({
          method: 'delete',
          url: `${process.env.VUE_APP_BASE_URL}sales/delete_sales/${payload.saleId}`,
          headers: {
            Authorization: 'Bearer ' + auth.access_token
          }
        });
        console.log(deleteCity);
      } catch (error) {
        console.log(error);
      }
    },

    async GET_SALE_EQUIPMENT_BY_ID({ commit }, saleId) {
      try {
        const auth = JSON.parse(localStorage.getItem('user'));
        const response = await axios({
          method: 'get',
          url: `${process.env.VUE_APP_BASE_URL}sales/list_of_sales`,
          params: { sid: saleId },
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
          },
        });
        commit('SET_EDIT_SALE_EQUIPMET_VALUE', response.data.data[0] || {});
        return response.data.data[0];
      } catch (error) {
        console.error('Error fetching sale equipment by ID:', error);
        throw error;
      }
    },
    async EQUIPMENT_FILTER({ commit }, params) {
      try {
        const auth = JSON.parse(localStorage.getItem('user'));
        const response = await axios({
          method: 'get',
          url: `${process.env.VUE_APP_BASE_URL}sales/all_sales`,
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
          },
          params: params || {},
        });
        commit('SET_SALE_EQUIPMENTS', response.data.data);
        return response.data;
      } catch (error) {
        console.error('Error filtering equipment:', error);
        throw error;
      }
    },
    async GET_SALE_EQUIPMENT_BY_EQUIPMENT_ID_AND_CLIENT_ID({ commit }, params) {
      try {
        const auth = JSON.parse(localStorage.getItem('user'));
        if (!auth || !auth.access_token) {
          throw new Error('Authentication token missing');
        }

        const url = `${process.env.VUE_APP_BASE_URL}sales/list_of_sales`;
        const response = await axios({
          method: 'get',
          url: url,
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
          },
          params: params || {},
        });

        commit('SET_SALE_EQUIPMENT_BY_EQUIPMENT_ID_AND_CLIENT_ID', response.data.data);
        console.log(response.data);
        
        return response.data;
      } catch (error) {
        console.error('Error fetching sale equipment by equipment and client ID:', error);
        throw error;
      }
    },
    async MANAGE_SALE_DOCUMENT({ commit }, { saleId, action, index, name, document }) {
      try {
        const auth = JSON.parse(localStorage.getItem('user'));
        const formData = new FormData();
        formData.append('action', action);
        if (name) formData.append('name', name);
        if (index !== undefined) formData.append('index', index);
        if (document) formData.append('documents', document); // 'documents' is singular here for single file upload

        const response = await axios({
          method: 'post',
          url: `${process.env.VUE_APP_BASE_URL}sales/manage_documents/${saleId}`,
          data: formData,
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        console.error(`Error managing document (action: ${action}):`, error);
        throw error;
      }
    },
  },
  getters: {
    get_all_equipment_with_clientId_and_equiId: (state) => (clId, equId) => {
      return state.saleEquipmentList.filter(
        (item) => item.equipmentId === equId && item.clientId === clId
      );
    },
    get_sale_by_serialNo: (state) => (serial) => {
      return state.saleEquipmentList.find((item) => item.serialNo === serial);
    },
  },
};