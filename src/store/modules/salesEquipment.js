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
      state.saleEquipmentList = {};
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
        return data;
      } catch (error) {
        console.error('Error fetching all sale equipment:', error);
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
    console.log('Step 1: Starting ADD_SALE_EQUIPMENT action with payload:', {
      serialNo: payload.serialNo,
      equipmentId: payload.equipmentId,
      clientId: payload.clientId,
      maintenancePeriod: payload.maintenancePeriod,
      purchaseDate: payload.purchaseDate,
      installationDate: payload.installationDate,
      lastMaintenanceDate: payload.lastMaintenanceDate,
      warrantyDate: payload.warrantyDate,
      invoice: payload.invoice?.length > 0 ? payload.invoice[0]?.name : null,
      installationReport: payload.installationReport?.length > 0 ? payload.installationReport[0]?.name : null,
      warrantyDocument: payload.warrantyDocument?.length > 0 ? payload.warrantyDocument[0]?.name : null,
      maintenanceContract: payload.maintenanceContract?.length > 0 ? payload.maintenanceContract[0]?.name : null,
      annualMaintenanceContract: payload.annualMaintenanceContract?.length > 0 ? payload.annualMaintenanceContract[0]?.name : null,
      documents: payload.documents?.map(doc => doc.name) || [],
      typeNames: payload.typeNames
    });

    console.log('Step 2: Retrieving auth token from localStorage');
    const auth = JSON.parse(localStorage.getItem('user'));
    console.log('Step 2.1: Auth token retrieved:', auth ? 'Valid auth object' : 'No auth object found');

    console.log('Step 3: Creating FormData object');
    const formData = new FormData();

    // Append form fields
    console.log('Step 4: Appending form fields to FormData');
    formData.append('serialNo', payload.serialNo || '');
    formData.append('equipmentId', payload.equipmentId || '');
    formData.append('clientId', payload.clientId || '');
    formData.append('maintenancePeriod', payload.maintenancePeriod || '');
    formData.append('purchaseDate', payload.purchaseDate || '');
    formData.append('installationDate', payload.installationDate || '');
    formData.append('LastMaintenanceDate', payload.lastMaintenanceDate || '');
    formData.append('warrantyDate', payload.warrantyDate || '');
    console.log('Step 4.1: Form fields appended:', {
      serialNo: payload.serialNo,
      equipmentId: payload.equipmentId,
      clientId: payload.clientId,
      maintenancePeriod: payload.maintenancePeriod || '',
      purchaseDate: payload.purchaseDate || '',
      installationDate: payload.installationDate || '',
      LastMaintenanceDate: payload.lastMaintenanceDate || '',
      warrantyDate: payload.warrantyDate || ''
    });

    // Append single files
    console.log('Step 5: Appending single files to FormData');
    if (payload.invoice && payload.invoice[0]) {
      formData.append('invoice', payload.invoice[0]);
      console.log('Step 5.1: Invoice file appended:', payload.invoice[0].name);
    } else {
      console.log('Step 5.1: No invoice file provided');
    }

    if (payload.installationReport && payload.installationReport[0]) {
      formData.append('installationReport', payload.installationReport[0]);
      console.log('Step 5.2: Installation report file appended:', payload.installationReport[0].name);
    } else {
      console.log('Step 5.2: No installation report file provided');
    }

    if (payload.warrantyDocument && payload.warrantyDocument[0]) {
      formData.append('warrantyDocument', payload.warrantyDocument[0]);
      console.log('Step 5.3: Warranty document file appended:', payload.warrantyDocument[0].name);
    } else {
      console.log('Step 5.3: No warranty document file provided');
    }

    if (payload.maintenanceContract && payload.maintenanceContract[0]) {
      formData.append('maintenanceContract', payload.maintenanceContract[0]);
      console.log('Step 5.4: Maintenance contract file appended:', payload.maintenanceContract[0].name);
    } else {
      console.log('Step 5.4: No maintenance contract file provided');
    }

    if (payload.annualMaintenanceContract && payload.annualMaintenanceContract[0]) {
      formData.append('annualMaintenanceContract', payload.annualMaintenanceContract[0]);
      console.log('Step 5.5: Annual maintenance contract file appended:', payload.annualMaintenanceContract[0].name);
    } else {
      console.log('Step 5.5: No annual maintenance contract file provided');
    }

    // Append multiple documents and their typeNames
    console.log('Step 6: Appending multiple documents and typeNames to FormData');
    if (payload.documents && payload.documents.length > 0) {
      payload.documents.forEach((doc, index) => {
        formData.append('documents', doc);
        const typeName = payload.typeNames[index] || `Document_${index + 1}`;
        formData.append('typeNames', typeName);
        console.log(`Step 6.${index + 1}: Appended document: ${doc.name}, typeName: ${typeName}`);
      });
    } else {
      console.log('Step 6.1: No documents provided');
    }

    console.log('Step 7: Preparing to send axios request to', `${process.env.VUE_APP_BASE_URL}sales/add_sales`);
    const response = await axios({
      method: 'post',
      url: `${process.env.VUE_APP_BASE_URL}sales/add_sales`,
      data: formData,
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Step 8: Received API response:', {
      status: response.status,
      data: response.data
    });

    return response.data;
  } catch (error) {
    console.error('Step 9: Error in ADD_SALE_EQUIPMENT:', {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : 'No response data',
      stack: error.stack
    });
    throw error;
  }
},
async DELETE_SALE_EQUIPMENT({ commit, state }, saleId) {
  try {
    console.log(`Step 1: Starting DELETE_SALE_EQUIPMENT action for saleId: ${saleId}`);
    const auth = JSON.parse(localStorage.getItem('user'));
    if (!auth || !auth.access_token) {
      console.error('Step 2: No valid auth token found');
      throw new Error('User not authenticated');
    }
    console.log('Step 2: Auth token retrieved:', 'Valid auth object');

    console.log(`Step 3: Sending DELETE request to ${process.env.VUE_APP_BASE_URL}sales/delete_sales/${saleId}`);
    const response = await axios({
      method: 'delete',
      url: `${process.env.VUE_APP_BASE_URL}sales/delete_sales/${saleId}`,
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
      },
    });

    console.log('Step 4: Received API response:', {
      status: response.status,
      data: response.data,
    });

    // Update state after successful deletion
    commit('SET_SALE_EQUIPMENTS', state.saleEquipmentList.filter(item => item.id !== saleId));

    return response.data;
  } catch (error) {
    console.error('Step 5: Error deleting sale equipment:', {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : 'No response data',
      stack: error.stack,
    });
    let userFriendlyMessage = 'Error deleting equipment';
    if (error.response) {
      if (error.response.status === 404) {
        userFriendlyMessage = 'Equipment not found. It may have already been deleted.';
      } else if (error.response.status === 401) {
        userFriendlyMessage = 'You are not authorized to delete this equipment.';
      } else if (error.response.status === 400 && error.response.data.message) {
        userFriendlyMessage = error.response.data.message; // Use backend-provided message
      } else if (error.response.data.message) {
        userFriendlyMessage = error.response.data.message;
      }
    }
    throw new Error(userFriendlyMessage);
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
  async UPDATE_SALE_EQUIPMET({ commit }, payload) {
  try {
    const auth = JSON.parse(localStorage.getItem('user'));
    const formData = new FormData();

    // Append form fields using snake_case to match payload
    formData.append('serialNo', payload.serial_no);
    formData.append('equipmentId', payload.equipment_id);
    formData.append('clientId', payload.client_id);
    formData.append('maintenancePeriod', payload.maintenance_period || '');
    formData.append('purchaseDate', payload.purchase_date || '');
    formData.append('installationDate', payload.installation_date || '');
    formData.append('LastMaintenanceDate', payload.last_maintenance_date || '');
    formData.append('warrantyDate', payload.warranty_date || '');
    
    // Log the status being appended
    console.log('Appending status to formData:', payload.status);
    formData.append('status', payload.status);

    // Append single files (only if provided)
    if (payload.invoice) {
      formData.append('invoice', payload.invoice);
    }
    if (payload.installation_report) {
      formData.append('installationReport', payload.installation_report);
    }
    if (payload.warranty_document) {
      formData.append('warrantyDocument', payload.warranty_document);
    }
    if (payload.maintenance_contract) {
      formData.append('maintenanceContract', payload.maintenance_contract);
    }
    if (payload.annual_maintenance_contract) {
      formData.append('annualMaintenanceContract', payload.annual_maintenance_contract);
    }

    // Append multiple documents and their typeNames
    if (payload.documents && payload.documents.length > 0) {
      payload.documents.forEach((doc, index) => {
        formData.append('documents', doc);
        formData.append('typeNames', payload.type_names[index] || `Document_${index + 1}`);
      });
    }

    const response = await axios({
      method: 'post',
      url: `${process.env.VUE_APP_BASE_URL}sales/update_sales/${payload.id}`,
      data: formData,
      headers: {
        Authorization: 'Bearer ' + auth.access_token,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating sale equipment:', error);
    console.error('Error response:', error.response); // Log full error response for debugging
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
        const response = await axios({
          method: 'get',
          url: `${process.env.VUE_APP_BASE_URL}sales/list_of_sales`,
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
          },
          params: params || {},
        });
        commit('SET_SALE_EQUIPMENT_BY_EQUIPMENT_ID_AND_CLIENT_ID', response.data.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching sale equipment by equipment and client ID:', error);
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