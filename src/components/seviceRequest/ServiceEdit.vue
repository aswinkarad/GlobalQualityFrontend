<template>
  <div class="text-center">
    <v-dialog v-model="show" transition="dialog-top-transition" activator="parent"
      :max-width="isMobile ? '100%' : '900'" :fullscreen="isMobile" scrollable>
      <v-card class="dialog-card elevation-5">
        <v-card-title class="dialog-title">
          {{ title }}
          <v-spacer></v-spacer>
          <v-btn icon small @click="show = false" class="close-btn">
            <v-icon style="color: black;">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="form-container">
          <v-container fluid>
            <v-row dense>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="formData.sale.clientId"
                  v-model:search="search" :disabled="!!item?.sale?.clientId" clearable :items="clientList"
                  item-title="name" item-value="id" label="Client" class="custom-field" prepend-inner-icon="mdi-account"
                  hide-details @update:modelValue="getClient"></v-autocomplete>
                <span v-if="v$.client.$error" class="error-text">
                  Client is required
                </span>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact"
                  v-model="formData.sale.client.city.city" clearable :items="cityList" item-title="city"
                  item-value="city" label="City" class="custom-field" prepend-inner-icon="mdi-city"
                  hide-details></v-autocomplete>
                <span v-if="v$.city.$error" class="error-text">
                  City is required
                </span>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="formData.sale.equipmentId"
                  :disabled="!!item?.sale?.equipmentId" clearable :items="editClientValue?.equipments || []"
                  item-title="equipmentName" item-value="id" label="Machine Name" class="custom-field"
                  prepend-inner-icon="mdi-tools" hide-details
                  @update:modelValue="getEquipment(formData.sale.clientId)"></v-autocomplete>
                <span v-if="v$.equipment.$error" class="error-text">
                  Equipment is required
                </span>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="formData.sale.serialNo"
                  :disabled="!!item?.sale?.serialNo" clearable :items="saleList" item-title="serialNo" item-value="id"
                  label="Serial Number" class="custom-field" prepend-inner-icon="mdi-barcode" hide-details
                  @update:modelValue="getSerial"></v-autocomplete>
                <span v-if="v$.sale.$error" class="error-text">
                  Serial Number is required
                </span>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact"
                  v-model="formData.workingconditionId" clearable :items="conditionList" item-title="workingCondition"
                  item-value="id" label="Working Condition" class="custom-field" prepend-inner-icon="mdi-wrench"
                  hide-details></v-autocomplete>
                <span v-if="v$.workingCondition.$error" class="error-text">
                  Working Condition is required
                </span>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="formData.priorityId"
                  clearable :items="priorityList" item-title="priority" item-value="id" label="Priority"
                  class="custom-field" prepend-inner-icon="mdi-priority-high" hide-details></v-autocomplete>
                <span v-if="v$.priority.$error" class="error-text">
                  Priority is required
                </span>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="formData.userId" clearable
                  :items="techList" item-title="username" item-value="id" label="Assigned To" class="custom-field"
                  prepend-inner-icon="mdi-account-hard-hat" hide-details></v-autocomplete>
                <span v-if="v$.technician.$error" class="error-text">
                  Assigned To is required
                </span>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="formData.callHandleId"
                  clearable :items="callhandelList" item-title="callHandle" item-value="id" label="Call Handle"
                  class="custom-field" prepend-inner-icon="mdi-phone" hide-details></v-autocomplete>
                <span v-if="v$.callHandle.$error" class="error-text">
                  Call Handle is required
                </span>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-text-field color="#7b1fa2" variant="outlined" density="compact" label="Service By"
                  v-model="formData.service_by" class="custom-field" hide-details></v-text-field>
                <span v-if="v$.service_by.$error" class="error-text">
                  Service By is required
                </span>
              </v-col>

              <!-- <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="formData.serviceTypeId"
                  clearable :items="ServiceTypeList" item-title="type" item-value="id" label="Service Type"
                  class="custom-field" prepend-inner-icon="mdi-priority-high" hide-details></v-autocomplete>
              </v-col>
              
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="formData.requestTypeId"
                  clearable :items="RequestTypeList" item-title="type" item-value="id" label="Request Type"
                  class="custom-field" prepend-inner-icon="mdi-priority-high" hide-details></v-autocomplete>
              </v-col> -->
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="formData.serviceTypeId"
                  clearable :items="ServiceTypeList" item-title="type" item-value="id" label="Service Type"
                  class="custom-field" prepend-inner-icon="mdi-cog" hide-details
                  @update:modelValue="onServiceTypeChange"></v-autocomplete>
              </v-col>
              
              <!-- Conditionally show Request Type field -->
              <v-col cols="12" :sm="isMobile ? 12 : 4" v-if="shouldShowRequestType">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="formData.requestTypeId"
                  clearable :items="RequestTypeList" item-title="type" item-value="id" label="Request Type"
                  class="custom-field" prepend-inner-icon="mdi-file-document" hide-details></v-autocomplete>
              </v-col>

              

              <v-col cols="12" :md="isMobile ? 12 : 8">
                <v-textarea color="#7b1fa2" variant="outlined" label="Description" v-model="formData.description"
                  auto-grow rows="3" class="custom-field" prepend-inner-icon="mdi-text" hide-details></v-textarea>
                <span v-if="v$.description.$error" class="error-text">
                  Description is required
                </span>
              </v-col>

              <v-col cols="12">
                <v-divider class="my-4"></v-divider>
                <h4 class="mb-3">Documents</h4>

                <div v-if="hasExistingDocuments" class="mb-4">
                  <h5 class="mb-2">Existing Documents:</h5>
                  <v-list dense>
                    <v-list-item v-for="(doc, docIndex) in existingDocuments"
                      :key="'existing-doc-' + docIndex + '-' + (doc.name || doc.filename || doc.originalName || docIndex)"
                      class="document-item existing-document">
                      <template v-slot:prepend>
                        <v-icon color="blue">{{ getFileIcon(doc.name || doc.filename || doc.originalName) }}</v-icon>
                      </template>

                      <v-list-item-title>
                        {{ doc.name || doc.filename || doc.originalName || `Document ${docIndex + 1}` }}
                      </v-list-item-title>

                      <template v-slot:append>
                        <div class="d-flex align-center">
                          <v-btn v-if="doc.url || doc.path" icon small @click="viewDocument(doc)" class="mr-2"
                            title="View Document" :disabled="!doc.url && !doc.path">
                            <v-icon color="primary">mdi-eye</v-icon>
                          </v-btn>
                          <v-btn v-if="doc.url || doc.path" icon small @click="downloadDocument(doc)" class="mr-2"
                            title="Download Document" :disabled="!doc.url && !doc.path">
                            <v-icon small color="green">mdi-download</v-icon>
                          </v-btn>
                          <v-btn icon small @click="removeExistingDocument(docIndex)" title="Remove Document">
                            <v-icon small color="red">mdi-delete</v-icon>
                          </v-btn>
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>
                </div>
                <div v-else>
                  <p>No existing documents found.</p>
                </div>

                <div class="mb-4">
                  <h5 class="mb-2">Add New Documents:</h5>
                  <div v-for="(fileInput, index) in fileInputs" :key="index" class="file-input-container mb-2">
                    <v-file-input color="#7b1fa2" variant="outlined" density="compact"
                      :label="'Upload New Document ' + (index + 1)" v-model="fileInputs[index].files" multiple
                      accept="image/*,application/pdf,.doc,.docx,.txt" class="custom-field"
                      prepend-inner-icon="mdi-file-upload" hide-details></v-file-input>
                    <v-btn v-if="index > 0" icon small @click="removeFileInput(index)" class="remove-btn ml-2">
                      <v-icon color="red">mdi-delete</v-icon>
                    </v-btn>
                  </div>
                  <v-btn icon small @click="addFileInput" class="add-btn">
                    <v-icon color="green">mdi-plus</v-icon>
                  </v-btn>
                </div>

                <div v-if="newDocuments.length > 0">
                  <h5 class="mb-2">New Files Selected:</h5>
                  <v-list dense>
                    <v-list-item v-for="(doc, docIndex) in newDocuments" :key="'new-doc-' + docIndex"
                      class="document-item new-document">
                      <template v-slot:prepend>
                        <v-icon color="orange">{{ getFileIcon(doc.name) }}</v-icon>
                      </template>

                      <v-list-item-title>
                        {{ doc.name }}
                      </v-list-item-title>

                      <v-list-item-subtitle>
                        {{ formatFileSize(doc.size) }}
                      </v-list-item-subtitle>

                      <template v-slot:append>
                        <v-btn icon small @click="removeNewDocument(docIndex)">
                          <v-icon color="red">mdi-delete</v-icon>
                        </v-btn>
                      </template>
                    </v-list-item>
                  </v-list>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="action-container">
          <v-btn class="action-btn cancel-btn" @click="show = false">
            Cancel
          </v-btn>
          <v-btn class="action-btn save-btn" @click="updateServiceRequest">
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
import { required } from '@vuelidate/validators';

export default {
  name: 'ServiceEdit',
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      formData: {
        id: null,
        sale: {
          clientId: null,
          client: { city: { city: '' } },
          equipmentId: null,
          serialNo: null,
        },
        workingconditionId: null,
        priorityId: null,
        userId: null,
        callHandleId: null,
        description: '',
        service_by: '',
        requestTypeId:'',
        serviceTypeId:'',
        documents: [],
      },
      search: null,
      saleList: [],
      saleFlag: false,
      fileInputs: [{ files: [] }],
      existingDocuments: [],
      newDocuments: [],
      documentsToDelete: [],
    };
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: 'Edit Service Request',
    },
    item: {
      type: Object,
      default: null,
    },
  },
  validations() {
    return {
      client: { required },
      city: { required },
      equipment: { required },
      sale: { required },
      workingCondition: { required },
      priority: { required },
      technician: { required },
      callHandle: { required },
      description: { required },
      service_by: { required },
    };
  },
  computed: {
    ...mapState('callHandle', ['callhandelList']),
    ...mapState('priority', ['priorityList']),
    ...mapState('workingCondition', ['conditionList']),
    ...mapState('city', ['cityList']),
    ...mapState('technician', ['techList']),
    ...mapState('clients', ['clientList', 'editClientValue']),
    ...mapState('salesEquipment', ['serialList', 'saleEquipmentList']),
    ...mapState('RequestType', ['RequestTypeList']),
     ...mapState('servicetype', ['ServiceTypeList']),
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
     shouldShowRequestType() {
      // Show Request Type field only when Service Type is "Service" (id: 1) or "Application" (id: 2)
      return this.formData.serviceTypeId === 1 || this.formData.serviceTypeId === 2;
    },
    client: {
      get() { return this.formData.sale.clientId; },
      set(val) { this.formData.sale.clientId = val; },
    },
    city: {
      get() { return this.formData.sale.client.city.city; },
      set(val) { this.formData.sale.client.city.city = val; },
    },
    equipment: {
      get() { return this.formData.sale.equipmentId; },
      set(val) { this.formData.sale.equipmentId = val; },
    },
    sale: {
      get() { return this.formData.sale.serialNo; },
      set(val) { this.formData.sale.serialNo = val; },
    },
    technician: {
      get() { return this.formData.userId; },
      set(val) { this.formData.userId = val; },
    },
    workingCondition: {
      get() { return this.formData.workingconditionId; },
      set(val) { this.formData.workingconditionId = val; },
    },
    priority: {
      get() { return this.formData.priorityId; },
      set(val) { this.formData.priorityId = val; },
    },
     serviceType: {
      get() { return this.formData.serviceTypeId; },
      set(val) { this.formData.serviceTypeId = val; },
    },
     requestType: {
      get() { return this.formData.requestTypeId; },
      set(val) { this.formData.requestTypeId = val; },
    },
    callHandle: {
      get() { return this.formData.callHandleId; },
      set(val) { this.formData.callHandleId = val; },
    },
    description: {
      get() { return this.formData.description; },
      set(val) { this.formData.description = val; },
    },
    service_by: {
      get() { return this.formData.service_by; },
      set(val) { this.formData.service_by = val; },
    },
    hasExistingDocuments() {
      return this.existingDocuments && this.existingDocuments.length > 0;
    },
  },
  watch: {
    search(val) {
      if (val && !this.formData.sale.clientId) {
        this.GET_CLIENT_LIST({ name: val, size: 9999999 });
      }
    },
    visible(newValue) {
      if (newValue && this.item) {
        if (!this.item.id) {
          console.error('No valid ID provided in item prop:', this.item);
          this.$emit('error', 'Invalid service request ID.');
          return;
        }
        console.log('Step 1 - Raw item prop:', JSON.parse(JSON.stringify(this.item)));

        this.formData = {
          id: this.item.id || null,
          sale: {
            clientId: this.item.sale?.clientId || null,
            client: {
              city: { city: this.item.sale?.client?.city?.city || '' },
            },
            equipmentId: this.item.sale?.equipmentId || null,
            serialNo: this.item.sale?.serialNo || null,
          },
          workingconditionId: this.item.workingconditionId || null,
          priorityId: this.item.priorityId || null,
          userId: this.item.userId || null,
          callHandleId: this.item.callHandleId || null,
          description: this.item.description || '',
          service_by: this.item.service_by || '',
          documents: this.item.documents || [],
          // serviceTypeId: this.item.serviceTypeId || '',
          // requestTypeId: this.item.requestTypeId || '',
          serviceTypeId: this.item.serviceTypeId || null,
          requestTypeId: this.item.requestTypeId || null,
        };

        console.log('Step 2 - Populated formData:', JSON.parse(JSON.stringify(this.formData)));
        // This is the line to console log the ID received
        console.log('ServiceEdit.vue: Received Service ID:', this.formData.id);

        this.$nextTick(() => {
          this.loadExistingDocuments();
        });

        this.GET_ALL_SALE_EQUIPMENT({ size: 99999 });
      } else if (!newValue) {
        this.resetForm();
      }
    },
    fileInputs: {
      handler(newFileInputs) {
        this.newDocuments = newFileInputs.flatMap(input => input.files || []).filter(file => file != null);
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions('clients', ['GET_CLIENT_LIST', 'GET_CLIENT_BY_ID']),
    ...mapActions('salesEquipment', ['GET_ALL_SALE_EQUIPMENT', 'GET_SALE_EQUIPMENT_BY_EQUIPMENT_ID_AND_CLIENT_ID']),
    ...mapActions('callHandle', ['GET_CALL_HANDLE_LIST']),
    ...mapActions('priority', ['GET_PRIORITY_LIST']),
    ...mapActions('workingCondition', ['GET_CONDITION_LIST']),
    ...mapActions('city', ['GET_CITY_LIST']),
    ...mapActions('technician', ['GET_TECH_LIST']),
    ...mapActions('RequestType', ['GET_REQUESTTYPE']),
    ...mapActions('servicetype', ['GET_SERVICETYPE_LIST']),
    // Method to handle service type change
    onServiceTypeChange(newServiceTypeId) {
      console.log('Service Type changed to:', newServiceTypeId);
      
      // If the new service type is not "Service" (1) or "Application" (2), 
      // reset requestTypeId to null
      if (newServiceTypeId !== 1 && newServiceTypeId !== 2) {
        console.log('Service Type is not Service or Application, resetting Request Type to null');
        this.formData.requestTypeId = null;
      }
      
      // If changing from a different service type to Service or Application,
      // keep the existing requestTypeId if it exists, otherwise leave it as is
      console.log('Current Request Type ID:', this.formData.requestTypeId);
    },
    
    loadExistingDocuments() {
      try {
        let documents = [];
        console.log('Step 3 - Raw documents from formData:', this.formData.documents);

        if (this.formData.documents && this.formData.documents.length > 0) {
          if (typeof this.formData.documents === 'string') {
            try {
              documents = JSON.parse(this.formData.documents);
            } catch (parseError) {
              console.warn('Failed to parse documents as JSON, treating as single URL:', this.formData.documents);
              documents = [this.formData.documents];
            }
          } else if (Array.isArray(this.formData.documents)) {
            documents = this.formData.documents;
          } else if (typeof this.formData.documents === 'object') {
            documents = [this.formData.documents];
          }
        } else {
          console.log('Step 4 - No documents found in formData');
          this.existingDocuments = [];
          return;
        }

        this.existingDocuments = documents.map((doc, index) => {
          let docObject = {};

          if (typeof doc === 'string') {
            const filename = doc.split('/').pop() || `Document ${index + 1}`;
            docObject = {
              name: filename,
              filename: filename,
              url: doc,
              path: doc,
              originalName: filename,
              isString: true,
            };
          } else if (doc && typeof doc === 'object') {
            docObject = {
              name: doc.name || doc.filename || doc.originalName || `Document ${index + 1}`,
              filename: doc.filename || doc.name || `Document ${index + 1}`,
              url: doc.url || doc.path,
              path: doc.path || doc.url,
              originalName: doc.originalName || doc.name || doc.filename || `Document ${index + 1}`,
              isObject: true,
            };
          } else {
            console.warn(`Invalid document at index ${index}:`, doc);
            return null;
          }

          if (!docObject.url) {
            console.warn(`Document at index ${index} has no valid URL:`, docObject);
          }

          return docObject;
        }).filter(doc => doc !== null);

        console.log('Step 5 - Processed existingDocuments:', this.existingDocuments);
        this.existingDocuments = [...this.existingDocuments];
        this.documentsToDelete = [];
      } catch (error) {
        console.error('Error loading existing documents:', error);
        this.existingDocuments = [];
        this.$emit('error', 'Failed to load existing documents.');
      }
    },
    viewDocument(doc) {
      const url = doc.url || doc.path;
      if (url) {
        try {
          const fullUrl = url.startsWith('http')
            ? url
            : `${process.env.VUE_APP_API_BASE_URL || 'http://localhost:3025'}${url.startsWith('/') ? '' : '/'}${url}`;
          window.open(fullUrl, '_blank');
        } catch (error) {
          console.error('Error opening document:', error, 'Document:', doc);
          this.$emit('error', 'Failed to open document');
        }
      } else {
        console.error('No URL found for document:', doc);
        this.$emit('error', 'Unable to view document - no URL found');
      }
    },
    downloadDocument(doc) {
      const url = doc.url || doc.path;
      if (url) {
        try {
          const link = document.createElement('a');
          const fullUrl = url.startsWith('http')
            ? url
            : `${process.env.VUE_APP_API_BASE_URL || 'http://localhost:3025'}${url.startsWith('/') ? '' : '/'}${url}`;
          link.href = fullUrl;
          link.download = doc.name || doc.filename || doc.originalName || 'document';
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error('Error downloading document:', error, 'Document:', doc);
          this.$emit('error', 'Failed to download document');
        }
      } else {
        console.error('No URL found for document:', doc);
        this.$emit('error', 'Unable to download document - no URL found');
      }
    },
    resetForm() {
      this.formData = {
        id: null,
        sale: {
          clientId: null,
          client: { city: { city: '' } },
          equipmentId: null,
          serialNo: null,
        },
        workingconditionId: null,
        priorityId: null,
        userId: null,
        callHandleId: null,
        serviceTypeId: null,
        requestTypeId: null,
        description: '',
        service_by: '',
        documents: [],
      };
      this.saleList = [];
      this.saleFlag = false;
      this.fileInputs = [{ files: [] }];
      this.existingDocuments = [];
      this.newDocuments = [];
      this.documentsToDelete = [];
      this.v$.$reset();
    },
    async getClient() {
      if (!this.formData.sale.clientId) {
        this.formData.sale.equipmentId = null;
        this.formData.sale.serialNo = null;
        this.saleList = [];
      }
    },
    async getEquipment(clientId) {
      if (clientId && !this.formData.sale.equipmentId) {
        try {
          await this.GET_CLIENT_BY_ID({ id: clientId });
          this.formData.sale.serialNo = null;
          this.saleList = [];
        } catch (error) {
          console.error('Error fetching client equipment:', error);
          this.$emit('error', 'Failed to load equipment data.');
        }
      }
    },
    async getSerial() {
      if (this.formData.sale.clientId && this.formData.sale.equipmentId && !this.formData.sale.serialNo) {
        try {
          this.saleFlag = true;
          this.saleList = [];
          const params = {
            cid: this.formData.sale.clientId,
            eid: this.formData.sale.equipmentId,
          };
          await this.GET_SALE_EQUIPMENT_BY_EQUIPMENT_ID_AND_CLIENT_ID(params);
          this.saleList = this.serialList.map(item => ({
            id: item.id,
            serialNo: item.serialNo || item.serial_no || item.serialNumber || 'N/A',
          }));
        } catch (error) {
          console.error('Error fetching serial numbers:', error);
          this.$emit('error', 'Failed to load serial numbers.');
        }
      }
    },
    addFileInput() {
      this.fileInputs.push({ files: [] });
    },
    removeFileInput(index) {
      this.fileInputs.splice(index, 1);
    },
    removeExistingDocument(index) {
      const docToDelete = this.existingDocuments[index];
      this.documentsToDelete.push(docToDelete);
      this.existingDocuments.splice(index, 1);
    },
    removeNewDocument(index) {
      let removed = false;
      let currentIndex = 0;

      for (let i = 0; i < this.fileInputs.length && !removed; i++) {
        if (this.fileInputs[i].files) {
          for (let j = 0; j < this.fileInputs[i].files.length; j++) {
            if (currentIndex === index) {
              this.fileInputs[i].files.splice(j, 1);
              removed = true;
              break;
            }
            currentIndex++;
          }
        }
      }
    },
    getFileIcon(filename) {
      if (!filename) return 'mdi-file';

      const ext = filename.toLowerCase().split('.').pop();
      switch (ext) {
        case 'pdf':
          return 'mdi-file-pdf-box';
        case 'doc':
        case 'docx':
          return 'mdi-file-word-box';
        case 'txt':
          return 'mdi-file-document';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
          return 'mdi-file-image';
        default:
          return 'mdi-file';
      }
    },
    formatFileSize(bytes) {
      if (!bytes) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    async updateServiceRequest() {
      this.v$.$validate();
      if (!this.v$.$error) {
        try {
          if (!this.formData.id) {
            throw new Error('Service request ID is missing.');
          }

          const formData = new FormData();
          formData.append('id', this.formData.id);
          formData.append('description', this.formData.description || '');
          formData.append('service_by', this.formData.service_by || '');
          formData.append('staffId', this.formData.userId || '');
          formData.append('callHandleId', this.formData.callHandleId || '');
          formData.append('workingconditionId', this.formData.workingconditionId || '');
          formData.append('priorityId', this.formData.priorityId || '');
          formData.append('serviceTypeId', this.formData.serviceTypeId || '');
          formData.append('requestTypeId', this.formData.requestTypeId || '');
          formData.append('callRegisterDate', new Date().toISOString().substr(0, 10));
          formData.append('workingStatusId', 1);

          if (this.saleFlag) {
            formData.append('saleId', this.formData.sale.serialNo || '');
          } else {
            await this.GET_ALL_SALE_EQUIPMENT({ search: this.formData.sale.serialNo });
            const serial = this.saleEquipmentList[0];
            formData.append('saleId', serial?.id || this.formData.sale.serialNo || '');
          }

          console.log('Step 6 - Existing documents before submission:', JSON.parse(JSON.stringify(this.existingDocuments)));

          formData.append('existingDocuments', JSON.stringify(this.existingDocuments));

          if (this.documentsToDelete.length > 0) {
            console.log('Step 7 - Documents to delete:', JSON.parse(JSON.stringify(this.documentsToDelete)));
            formData.append('documentsToDelete', JSON.stringify(this.documentsToDelete));
          }

          console.log('Step 8 - New documents for submission:', this.newDocuments.map(doc => doc.name));

          this.newDocuments.forEach((doc) => {
            if (doc) formData.append('documents', doc);
          });

          console.log('Step 9 - FormData entries for submission:');
          for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
          }

          const result = await this.$store.dispatch('service/UPDATE_SERVICE', { id: this.formData.id, formData });
          this.$emit('save', result);
          this.resetForm();
          this.show = false;
        } catch (error) {
          console.error('Error updating service request:', error);
          this.$emit('error', error.message || 'Failed to update service request.');
        }
      } else {
        console.log('Validation errors:', this.v$.$errors);
        this.$emit('error', 'Please fill all required fields.');
      }
    },
    async initializeLists() {
      try {
        await Promise.all([
          this.GET_CALL_HANDLE_LIST(),
          this.GET_PRIORITY_LIST(),
          this.GET_CONDITION_LIST(),
          this.GET_CITY_LIST(),
          this.GET_TECH_LIST(),
          this.GET_REQUESTTYPE(),
          this.GET_SERVICETYPE_LIST(),
        ]);
      } catch (error) {
        console.error('Error initializing lists:', error);
        this.$emit('error', error.message || 'Failed to load initial data.');
      }
    },
  },
  async created() {
    await this.initializeLists();
  },
};
</script>

<style scoped>
/* Add any specific styles for ServiceEdit.vue here if needed */
.dialog-card {
  background-color: #ffffff;
  /* White background for the dialog */
}

.dialog-title {
  background-color: #042b4c;
  /* Dark blue background for the title */
  color: white;
  /* White text for the title */
  padding: 16px;
  font-size: 1.25rem;
  font-family: 'Montserrat', sans-serif !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background-color: transparent;
}

.form-container {
  padding: 24px;
}

.custom-field .v-input__control {
  border-radius: 8px;
  /* Slightly rounded borders for input fields */
}

.error-text {
  color: red;
  font-size: 0.75rem;
  margin-top: 4px;
  display: block;
}

.action-container {
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #e0e0e0;
  /* Separator for actions */
}

.action-btn {
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 8px;
}

.cancel-btn {
  background-color: #f5f5f5;
  /* Light grey for cancel */
  color: #333333;
}

.save-btn {
  background-color: #042b4c;
  /* Dark blue for save */
  color: white;
}

.document-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 8px;
  padding: 8px 16px;
  background-color: #f9f9f9;
}

.existing-document {
  background-color: #e3f2fd;
  /* Light blue for existing documents */
}

.new-document {
  background-color: #fff3e0;
  /* Light orange for new documents */
}

.file-input-container {
  display: flex;
  align-items: center;
}

.file-input-container .v-file-input {
  flex-grow: 1;
}

.file-input-container .remove-btn {
  margin-left: 8px;
}

/* Transitions for filter display */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
<style scoped>
.dialog-card {
  border-radius: 8px;
  background-color: #f5f5f5;
}

.dialog-title {
  background-color: #4d90fe;
  color: white;
  font-size: 1.25rem;
  padding: 16px;
}

.form-container {
  padding: 16px;
}

.custom-field {
  margin-bottom: 8px;
}

.error-text {
  color: red;
  font-size: 0.75rem;
  margin-top: 4px;
}

.action-container {
  justify-content: flex-end;
  padding: 16px;
}

.action-btn {
  min-width: 100px;
  margin-left: 8px;
}

.cancel-btn {
  background-color: #e0e0e0;
  color: black;
}

.save-btn {
  background-color: #7b1fa2;
  color: white;
}

.file-input-container {
  display: flex;
  align-items: center;
}

.remove-btn {
  margin-top: 8px;
}

.add-btn {
  margin-top: 8px;
}

.document-item {
  border-bottom: 1px solid #e0e0e0;
  padding: 8px 0;
}

.existing-document {
  background-color: #e3f2fd;
}

.new-document {
  background-color: #fff3e0;
}
</style>
<style scoped>
.file-input-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.file-input-container .v-file-input {
  flex-grow: 1;
  margin-right: 10px;
}

.add-btn {
  margin-top: 10px;
}

.error-text {
  color: red;
  font-size: 12px;
}

.dialog-card {
  border-radius: 8px;
}

.dialog-title {
  font-size: 1.2rem;
  font-weight: 500;
}

.action-container {
  justify-content: flex-end;
  padding: 16px;
}

.action-btn {
  min-width: 100px;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #333;
}

.save-btn {
  background-color: #7b1fa2;
  color: white;
}
</style>
<style scoped>
.v-input__prepend {
  display: none !important;
}

input:focus {
  outline: none !important;
}

.dialog-card {
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: #ffffff;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.form-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #fafafa;
}

.custom-field {
  border-radius: 8px;
  background: #ffffff;
  transition: all 0.3s ease;
}

.custom-field:focus-within {
  box-shadow: 0 0 8px rgba(123, 31, 162, 0.3);
}

.action-container {
  background: #ffffff;
  border-top: 1px solid #eee;
  padding: 16px 24px;
  justify-content: flex-end;
  gap: 12px;
}

.action-btn {
  min-width: 120px;
  border-radius: 25px;
  text-transform: uppercase;
  font-weight: 600;
  padding: 8px 24px;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #e0e0e0;
  color: #424242;
}

.cancel-btn:hover {
  background: #d0d0d0;
}

.save-btn {
  background: #4d90fe;

}

.save-btn:hover {
  background: ;
}

.error-text {
  color: #d32f2f;
  font-size: 0.75rem;
  margin-top: 4px;
  display: block;
}

@media (min-width: 601px) {
  .dialog-card {
    margin: 24px;
  }

  .v-row {
    margin: -12px;
  }

  .v-col {
    padding: 12px;
  }

  .custom-field {
    font-size: 0.95rem;
  }
}

@media (max-width: 600px) {
  .dialog-card {
    max-height: 100vh;
    border-radius: 0;
    margin: 0;
  }

  .dialog-title {
    font-size: 1.1rem;
    padding: 12px 16px;
  }

  .form-container {
    padding: 16px;
  }

  .v-row {
    margin: -8px;
  }

  .v-col {
    padding: 8px;
  }

  .custom-field {
    font-size: 0.9rem;
  }

  .action-container {
    flex-direction: column;
    padding: 16px;
    gap: 8px;
  }

  .action-btn {
    width: 100%;
    padding: 10px;
  }

  .error-text {
    font-size: 0.7rem;
  }
}
</style>