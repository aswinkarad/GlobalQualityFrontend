<template>
  <div class="text-center">
    <v-dialog v-model="show" transition="dialog-top-transition" activator="parent"
      :max-width="isMobile ? '100%' : '900'" :fullscreen="isMobile" scrollable>
      <v-card class="dialog-card elevation-5">
        <v-card-title class="dialog-title-custom" :class="dialogTitleClass">
          <span class="dialog-title-text-custom">{{ title }}</span>
          <v-spacer></v-spacer>
          <v-btn icon small @click="show = false" class="close-btn-custom">
            <v-icon :class="closeIconClass">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="form-container">
          <v-container fluid>
            <v-row dense>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model:search="search"
                  v-model="client" clearable :items="clientList" item-title="name" item-value="id" label="Client"
                  class="custom-field" prepend-inner-icon="mdi-account" hide-details
                  :error-messages="v$.client.$error ? 'Client is required' : ''"></v-autocomplete>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="city" disabled
                  :items="cityList" item-title="city" item-value="city" label="City" class="custom-field"
                  prepend-inner-icon="mdi-city" hide-details
                  :error-messages="v$.city.$error ? 'City is required' : ''"></v-autocomplete>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="equipment" clearable
                  :items="editClientValue.equipments || []" item-title="equipmentName" item-value="id"
                  label="Machine Name" class="custom-field" prepend-inner-icon="mdi-tools" hide-details
                  :error-messages="v$.equipment.$error ? 'Equipment is required' : ''"></v-autocomplete>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="sale" clearable
                  :items="saleList" item-title="serialNo" item-value="id" label="Serial Number" class="custom-field"
                  prepend-inner-icon="mdi-barcode" hide-details
                  :error-messages="v$.sale.$error ? 'Serial Number is required' : ''"></v-autocomplete>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="workingCondition"
                  clearable :items="conditionList" item-title="workingCondition" item-value="id"
                  label="Working Condition" class="custom-field" prepend-inner-icon="mdi-wrench" hide-details
                  :error-messages="v$.workingCondition.$error ? 'Working Condition is required' : ''"></v-autocomplete>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="priority" clearable
                  :items="priorityList" item-title="priority" item-value="id" label="Priority" class="custom-field"
                  prepend-inner-icon="mdi-priority-high" hide-details
                  :error-messages="v$.priority.$error ? 'Priority is required' : ''"></v-autocomplete>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="technician" clearable
                  :items="techList" item-title="username" item-value="id" label="Technician" class="custom-field"
                  prepend-inner-icon="mdi-account-hard-hat" hide-details></v-autocomplete>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="callHandle" clearable
                  :items="callhandelList" item-title="callHandle" item-value="id" label="Call Handle"
                  class="custom-field" prepend-inner-icon="mdi-phone" hide-details
                  :error-messages="v$.callHandle.$error ? 'Call Handle is required' : ''"></v-autocomplete>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="ServiceRequest" clearable
                  :items="ServiceTypeList" item-title="type" item-value="id" label="Service Type" class="custom-field"
                  prepend-inner-icon="mdi-service-toolbox" hide-details
                  :error-messages="v$.ServiceRequest.$error ? 'Service Type is required' : ''"></v-autocomplete>
              </v-col>


              <!-- <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="RequestType" clearable
                  :items="RequestTypeList" item-title="type" item-value="id" label="Request Type" class="custom-field"
                  prepend-inner-icon="mdi-service-toolbox" hide-details
                 ></v-autocomplete>
              </v-col> -->
              <v-col cols="12" :sm="isMobile ? 12 : 4" v-if="showRequestTypeField">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="RequestType" clearable
                  :items="RequestTypeList" item-title="type" item-value="id" label="Request Type" class="custom-field"
                  prepend-inner-icon="mdi-service-toolbox" hide-details></v-autocomplete>
              </v-col>



              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-text-field color="#7b1fa2" label="Service By" density="compact" v-model="service_by"
                  variant="outlined" class="custom-field" hide-details
                  :error-messages="v$.service_by.$error ? 'Service By is required' : ''"></v-text-field>
              </v-col>
              <v-col cols="12" :md="isMobile ? 12 : 8">
                <v-textarea color="#7b1fa2" variant="outlined" label="Description" v-model="description" auto-grow
                  rows="3" class="custom-field" prepend-inner-icon="mdi-text" hide-details></v-textarea>
              </v-col>
              <v-col cols="12">
                <div v-for="(fileInput, index) in fileInputs" :key="index" class="file-input-wrapper">
                  <v-file-input color="#7b1fa2" variant="outlined" density="compact"
                    :label="'Upload Document ' + (index + 1)" v-model="fileInputs[index].files" multiple
                    accept="image/*,application/pdf" class="custom-file-input" prepend-inner-icon="mdi-file-upload"
                    hide-details></v-file-input>
                  <v-btn v-if="index > 0" icon small @click="removeFileInput(index)" class="remove-file-btn">
                    <v-icon color="red">mdi-close-circle</v-icon>
                  </v-btn>
                </div>
                <v-btn icon small @click="addFileInput" class="add-file-input-btn">
                  <v-icon>mdi-plus-circle</v-icon>
                </v-btn>
                <v-list v-if="documents.length" dense class="uploaded-documents-list">
                  <v-list-item v-for="(doc, index) in documents" :key="'doc-' + index" class="document-item">
                    <v-list-item-title class="document-name">
                      {{ doc.name }}
                    </v-list-item-title>
                    <v-list-item-action>
                      <v-btn icon small @click="removeDocument(index)" class="remove-doc-btn">
                        <v-icon color="red">mdi-delete</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="services-actions">
          <v-btn class="action-btn cancel-btn" @click="show = false">
            Cancel
          </v-btn>
          <v-btn class="action-btn save-btn-combo" @click="saveServiceRequest()">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import useVuelidate from '@vuelidate/core';
import { required, numeric, helpers } from '@vuelidate/validators';

export default {
  name: 'AddServiceRequest',
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      dialog: false,
      client: null,
      city: null,
      equipment: null,
      sale: null,
      technician: null,
      saleList: [],
      workingCondition: null,
      priority: null,
      description: '',
      callHandle: null,
      ServiceRequest: null, // ServiceType
      RequestType: null,
      search: '',
      service_by: '',
      documents: [],
      fileInputs: [{ files: [] }], // Initialize with one file input
    };
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: 'Add Service Request',
    },
    prefillData: {
      type: Object,
      default: null,
    },
    titleBgColor: {
      type: String,
      default: 'blue',
    },
    closeIconColor: {
      type: String,
      default: 'white',
    },
  },
  // --- Vuelidate Rules ---
  validations() {
    return {
      client: { required: helpers.withMessage('Client is required', required) },
      city: { required: helpers.withMessage('City is required', required) }, // City is disabled, but still required by validation
      equipment: {
        required: helpers.withMessage('Machine Name is required', required),
        numeric: helpers.withMessage('Machine Name must be a number', numeric),
      },
      sale: {
        required: helpers.withMessage('Serial Number is required', required),
        numeric: helpers.withMessage('Serial Number must be a number', numeric),
      },
      workingCondition: { required: helpers.withMessage('Working Condition is required', required) },
      priority: { required: helpers.withMessage('Priority is required', required) },
      callHandle: { required: helpers.withMessage('Call Handle is required', required) },
      ServiceRequest: {
        required: helpers.withMessage('Service Type is required', required),
        numeric: helpers.withMessage('Service Type must be a number', numeric), // Added numeric for ServiceRequest
      },
      service_by: { required: helpers.withMessage('Service By is required', required) },

    };
  },
  watch: {
    workingCondition(newValue) {
      if (newValue) {
        this.toggleItem(newValue);
      }
    },
    client(newValue, oldValue) {
      // Only reset if client actually changes, not on initial load
      if (newValue !== oldValue) {
        this.equipment = null;
        this.sale = null;
        this.saleList = [];
        this.setCity();
      }
    },
    equipment(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.sale = null;
        this.saleList = [];
        this.setSerialNo();
      }
    },
    // Add this watcher to reset RequestType when ServiceRequest changes
    ServiceRequest(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.RequestType = null; // Reset request type when service type changes
      }
    },

    search(val) {
      this.GET_CLIENT_LIST({ name: val });
    },
    visible(val) {
      if (val && this.prefillData) {
        console.log('Prefill Data Received:', this.prefillData);
        this.prefillForm();
      } else if (!val) {
        this.resetForm();
      }
    },
    fileInputs: {
      handler(newFileInputs) {
        this.documents = newFileInputs.flatMap(input => input.files || []);
      },
      deep: true,
    },

    ServiceRequest(newValue, oldValue) {
    if (newValue !== oldValue) {
      const selected = this.ServiceTypeList.find(item => item.id === newValue);
      if (!selected || (selected.type !== 'Service' && selected.type !== 'Application')) {
        this.RequestType = null;
      }
    }
  },
  },
  computed: {
    ...mapState('callHandle', ['callhandelList']),
    ...mapState('priority', ['priorityList']),
    ...mapState('workingCondition', ['conditionList']),
    ...mapState('city', ['cityList']),
    ...mapState('technician', ['techList']),
    ...mapState('servicetype', ['ServiceTypeList']),
    ...mapState('clients', ['clientList', 'editClientValue']),
    ...mapState('salesEquipment', ['serialList', 'saleEquipmentList']),
    ...mapState('RequestType', ['RequestTypeList']),
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('close');
        }
      },
    },
    isMobile() {
      return this.$vuetify.display.smAndDown;
    },
    dialogTitleClass() {
      return this.titleBgColor === 'white' ? 'dialog-title-white-bg' : 'dialog-title-blue-bg';
    },
    closeIconClass() {
      return this.closeIconColor === 'black' ? 'black-icon' : 'white-icon';
    },
    showRequestTypeField() {
      const selected = this.ServiceTypeList.find(item => item.id === this.ServiceRequest);
      return selected && (selected.type === 'Service' || selected.type === 'Application');
    }
  },
  methods: {
    ...mapActions('clients', ['GET_CLIENT_BY_ID', 'GET_CLIENT_LIST']),
    ...mapActions('salesEquipment', ['GET_ALL_SALE_EQUIPMENT', 'GET_SALE_EQUIPMENT_BY_EQUIPMENT_ID_AND_CLIENT_ID']),
    ...mapActions('callHandle', ['GET_CALL_HANDLE_LIST']),
    ...mapActions('priority', ['GET_PRIORITY_LIST']),
    ...mapActions('workingCondition', ['GET_CONDITION_LIST']),
    ...mapActions('city', ['GET_CITY_LIST']),
    ...mapActions('technician', ['GET_TECH_LIST']),
    ...mapActions('servicetype', ['GET_SERVICETYPE_LIST']),
    ...mapActions('service', ['ADD_SERVICE']), // Map ADD_SERVICE action
    ...mapActions('RequestType', ['GET_REQUESTTYPE']),

    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toISOString().substr(0, 10);
    },

    resetForm() {
      this.client = null;
      this.city = null;
      this.equipment = null;
      this.sale = null;
      this.priority = null;
      this.callHandle = null;
      this.ServiceRequest = null;
      this.RequestType = null
      this.technician = null;
      this.workingCondition = null;
      this.description = '';
      this.service_by = '';
      this.documents = [];
      this.fileInputs = [{ files: [] }];
      this.saleList = [];
      this.v$.$reset();
    },

    async prefillForm() {
      this.client = this.prefillData.clientId || null;
      this.city = this.prefillData.city || null;
      this.equipment = this.prefillData.equipmentId || null;
      this.sale = this.prefillData.saleId || null;
      this.description = this.prefillData.maintenancePeriod
        ? `Preventive Maintenance Due: ${this.formatDate(this.prefillData.maintenancePeriod)}`
        : '';

      // Use $nextTick to ensure v-models are updated before async calls
      await this.$nextTick();

      if (this.client) {
        await this.setCity(true); // Pass true to indicate prefill, so it doesn't clear saleList immediately
        if (this.equipment) {
          await this.setSerialNo(true); // Pass true to indicate prefill
        }
      }
    },

    async setCity(isPrefill = false) {
      if (!isPrefill) { // Only reset if not prefilling
        this.equipment = null;
        this.sale = null;
        this.saleList = [];
      }

      if (this.client) {
        try {
          const clnt = this.$store.getters['clients/getClientById'](this.client);
          this.city = clnt?.city?.city || this.prefillData?.city || null;
          const payload = { id: this.client };
          await this.GET_CLIENT_BY_ID(payload);
          await this.GET_ALL_SALE_EQUIPMENT(); // This fetches all, later filtered
          console.log('Client and Equipment data updated for client ID:', this.client);
        } catch (error) {
          console.error('Error setting city and equipment:', error);
          this.city = null;
          this.equipment = null;
          this.sale = null;
          this.saleList = [];
          this.$emit('error', 'Failed to load client details. Please try again.');
        }
      } else {
        this.city = null;
        this.equipment = null;
        this.sale = null;
        this.saleList = [];
      }
    },

    async setSerialNo(isPrefill = false) {
      if (!isPrefill) { // Only reset if not prefilling
        this.sale = null;
      }
      this.saleList = []; // Always clear before fetching new list

      if (this.equipment && this.client) {
        try {
          const params = { cid: this.client, eid: this.equipment };
          // console.log('Fetching serial numbers with params:', params);
          const response = await this.GET_SALE_EQUIPMENT_BY_EQUIPMENT_ID_AND_CLIENT_ID(params);

          let serialData = response?.data?.data || [];

          if (Array.isArray(serialData) && serialData.length > 0) {
            this.saleList = serialData.map(item => ({
              id: item.id,
              serialNo: item.serialNo || item.serial_no || item.serialNumber || 'N/A',
            }));
          } else {
            // Fallback: Filter from already fetched all sales equipment list if direct fetch yields no data
            const fallbackData = this.saleEquipmentList.filter(
              item => item.clientId === this.client && item.equipmentId === this.equipment
            );
            this.saleList = fallbackData.map(item => ({
              id: item.id,
              serialNo: item.serialNo || item.serial_no || item.serialNumber || 'N/A',
            }));
          }

          // console.log('Processed Serial Number List:', this.saleList);

          // If prefilling, try to match and set the sale ID
          if (isPrefill && this.prefillData && this.prefillData.saleId) {
            const matchingSale = this.saleList.find(item => item.id === this.prefillData.saleId);
            if (matchingSale) {
              this.sale = matchingSale.id;
              // console.log('Auto-selected sale for prefill:', this.sale);
            }
          }

          if (!this.saleList.length) {
            // console.warn('No serial numbers found for the selected client and equipment.');
            this.$emit('error', 'No serial numbers found for the selected client and equipment.');
          }
        } catch (error) {
          // console.error('Error setting serial number:', error);
          this.saleList = [];
          this.sale = null;
          this.$emit('error', 'Failed to load serial numbers. Please try again.');
        }
      } else {
        // console.log('Missing client or equipment, resetting saleList');
        this.saleList = [];
        this.sale = null;
      }
    },

    toggleItem(item) {
      try {
        const cdtn = this.$store.getters['workingCondition/getWorkingConditionWithId'](item);
        if (cdtn && cdtn.workingCondition) {
          // Only prepend if the condition is not already present in the description
          if (!this.description.includes(cdtn.workingCondition)) {
            this.description = `${cdtn.workingCondition}${this.description ? ' - ' + this.description : ''}`;
          }
          // console.log('Condition Data:', cdtn);
        } else {
          console.warn('No working condition found for item:', item);
        }
      } catch (error) {
        // console.error('Error in toggleItem:', error);
      }
    },

    removeDocument(index) {
      this.documents.splice(index, 1);
    },

    addFileInput() {
      this.fileInputs.push({ files: [] });
    },

    removeFileInput(index) {
      this.fileInputs.splice(index, 1);
    },

    async saveServiceRequest() {
      // Validate all fields using Vuelidate
      const isFormValid = await this.v$.$validate();

      if (!isFormValid) {
        // console.log('Validation errors:', this.v$.$errors);
        this.$emit('error', 'Please fill all required fields correctly.');
        return; // Stop if validation fails
      }

      try {
        const formData = new FormData();
        // Append all fields to FormData. Ensure `null` or empty values are handled
        // consistently (e.g., send `null` or empty string if optional).
        // For IDs, `null` will be sent as "null" string, which safeParseInt handles.
        formData.append('saleId', this.sale || '');
        formData.append('service_by', this.service_by || '');
        formData.append('description', this.description || '');
        formData.append('callHandleId', this.callHandle || '');
        formData.append('serviceTypeId', this.ServiceRequest || '');
        formData.append('requestTypeId', this.RequestType || '');
        formData.append('workingStatusId', 1); // Hardcoded as per current backend logic
        formData.append('workingconditionId', this.workingCondition || '');
        formData.append('priorityId', this.priority || '');
        formData.append('callRegisterDate', new Date().toISOString().substr(0, 10)); // Format date for backend

        // Append technician only if it has a value, as it's optional
        if (this.technician !== null && this.technician !== '') {
          formData.append('staffId', this.technician);
        }

        // Append all selected document files
        this.documents.forEach((doc) => {
          formData.append('documents', doc);
        });

        // Debugging logs before sending
        // console.log('Preparing to save service request...');
        const payloadForLog = {};
        for (let [key, value] of formData.entries()) {
          payloadForLog[key] = value instanceof File ? `File: ${value.name}` : value;
        }
        // console.log('FormData contents to be sent:', payloadForLog);

        const result = await this.ADD_SERVICE(formData); // Use mapped action

        // console.log('Service request saved successfully:', result);
        this.$emit('save', result);
        this.resetForm();
        this.show = false; // Close dialog on success
      } catch (error) {
        // console.error('Error saving service request:', error);
        this.$emit('error', error.message || 'Failed to save service request. Please try again.');
      }
    },
  },

  async created() {
    try {
      await Promise.all([
        this.GET_CALL_HANDLE_LIST(),
        this.GET_PRIORITY_LIST(),
        this.GET_CONDITION_LIST(),
        this.GET_CITY_LIST(),
        this.GET_TECH_LIST(),
        this.GET_SERVICETYPE_LIST(),
        this.GET_CLIENT_LIST(), // Fetch all clients on component creation
        this.GET_ALL_SALE_EQUIPMENT(), // Fetch all sale equipment on creation
        this.GET_REQUESTTYPE(),
      ]);
      console.log('Initial data fetched successfully.');
      if (this.prefillData) {
        this.prefillForm();
      }
    } catch (error) {
      console.error('Error fetching initial lists:', error);
      this.$emit('error', 'Failed to load initial data. Please try again.');
    }
  },
};
</script>

<style scoped>
/* Your existing styles here */
.dialog-card {
  border-radius: 8px;
}

.dialog-title-custom {
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.dialog-title-text-custom {
  font-size: 1.25rem;
  font-weight: 500;
  color: white;
  /* Default to white for blue background */
}

.dialog-title-blue-bg {
  background-color: #4d90fe;
  /* Your desired blue color */
}

.dialog-title-white-bg {
  background-color: white !important;
}

.close-btn-custom {
  margin-right: -8px;
}

.white-icon {
  color: black;
}

.black-icon {
  color: black !important;
}

.form-container {
  padding: 24px;
}

.custom-field .v-label {
  font-size: 0.875rem;
  /* Smaller label font size */
}

.custom-field .v-input__control {
  min-height: 48px;
  /* Adjust input height for compact density */
}

.error-text {
  color: red;
  font-size: 0.75rem;
  margin-top: 4px;
  display: block;
}

.file-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.custom-file-input {
  flex-grow: 1;
}

.remove-file-btn,
.add-file-input-btn {
  flex-shrink: 0;
}

.uploaded-documents-list {
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-top: 16px;
  padding: 8px;
}

.document-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.document-item:last-child {
  border-bottom: none;
}

.document-name {
  flex-grow: 1;
  font-size: 0.9rem;
  word-break: break-all;
}

.remove-doc-btn {
  margin-left: 8px;
}

.services-actions {
  padding: 16px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.action-btn {
  min-width: 100px;
  font-weight: 500;
}

.cancel-btn {
  background-color: #e0e0e0;
  color: #424242;
}

.save-btn-combo {
  background-color: #4d90fe;
  /* Primary color for save */
  color: white;
}
</style>