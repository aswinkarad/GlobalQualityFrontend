<template>
  <div class="text-center">
    <v-dialog
      v-model="show"
      transition="dialog-top-transition"
      activator="parent"
      :max-width="isMobile ? '100%' : '900'"
      :fullscreen="isMobile"
      scrollable
    >
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
                <v-autocomplete
                  color="#7b1fa2"
                  variant="outlined"
                  density="compact"
                  v-model:search="search"
                  v-model="selcetdClient"
                  clearable
                  :items="clientList"
                  item-title="name"
                  item-value="id"
                  label="Client"
                  class="custom-field"
                  prepend-inner-icon="mdi-account"
                ></v-autocomplete>
                <span v-if="v$.selcetdClient.$error" class="error-text">
                  Client is required
                </span>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete
                  color="#7b1fa2"
                  variant="outlined"
                  density="compact"
                  v-model="selcetdCategory"
                  clearable
                  :items="categoryList"
                  item-title="categoryName"
                  item-value="id"
                  label="Category"
                  class="custom-field"
                  prepend-inner-icon="mdi-shape"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete
                  color="#7b1fa2"
                  variant="outlined"
                  density="compact"
                  v-model="selcetdSubCategory"
                  clearable
                  :items="availSubCatList"
                  item-title="subcategoryName"
                  item-value="id"
                  label="Sub Category"
                  class="custom-field"
                  prepend-inner-icon="mdi-shape-outline"
                  @click="getSubcatList"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete
                  color="#7b1fa2"
                  variant="outlined"
                  density="compact"
                  v-model="selcetedEquipment"
                  clearable
                  :items="availableEquilist"
                  item-title="equipmentName"
                  item-value="id"
                  label="Equipment"
                  class="custom-field"
                  prepend-inner-icon="mdi-tools"
                  @click="getEquiList"
                ></v-autocomplete>
                <span v-if="v$.selcetedEquipment.$error" class="error-text">
                  Equipment is required
                </span>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-text-field
                  color="#7b1fa2"
                  label="Maintenance Period"
                  density="compact"
                  v-model="MaintenancePeriod"
                  variant="outlined"
                  class="custom-field"
                  prepend-inner-icon="mdi-calendar-clock"
                ></v-text-field>
                <span v-if="v$.MaintenancePeriod.$error" class="error-text">
                  {{ v$.MaintenancePeriod.$errors[0].$message }}
                </span>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-text-field
                  color="#7b1fa2"
                  label="Serial No"
                  density="compact"
                  v-model="serialNo"
                  variant="outlined"
                  class="custom-field"
                  prepend-inner-icon="mdi-barcode"
                ></v-text-field>
                <span v-if="v$.serialNo.$error" class="error-text">
                  Serial No is required
                </span>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-text-field
                  color="#7b1fa2"
                  label="Installation Date"
                  type="date"
                  density="compact"
                  v-model="InstallationDate"
                  variant="outlined"
                  class="custom-field"
                  prepend-inner-icon="mdi-calendar-start"
                ></v-text-field>
                <span v-if="v$.InstallationDate.$error" class="error-text">
                  Installation Date is required
                </span>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-text-field
                  color="#7b1fa2"
                  label="Last Maintenance Date"
                  type="date"
                  density="compact"
                  v-model="lastMainDate"
                  variant="outlined"
                  class="custom-field"
                  prepend-inner-icon="mdi-calendar-check"
                ></v-text-field>
                <span v-if="v$.lastMainDate.$error" class="error-text">
                  Last Maintenance Date is required
                </span>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-text-field
                  color="#7b1fa2"
                  label="Warranty Expiry Date"
                  type="date"
                  density="compact"
                  v-model="WarrantyDate"
                  variant="outlined"
                  class="custom-field"
                  prepend-inner-icon="mdi-calendar-end"
                ></v-text-field>
                <span v-if="v$.WarrantyDate.$error" class="error-text">
                  Warranty Expiry Date is required
                </span>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-file-input
                  color="#7b1fa2"
                  prepend-inner-icon="mdi-file-pdf-box"
                  density="compact"
                  clearable
                  variant="outlined"
                  v-model="invoice"
                  show-size
                  label="Invoice"
                  class="custom-field"
                  multiple="false"
                  accept=".pdf,.jpg,.png"
                ></v-file-input>
                <span v-if="v$.invoice.$error" class="error-text">
                  Invoice is required
                </span>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-file-input
                  color="#7b1fa2"
                  prepend-inner-icon="mdi-file-pdf-box"
                  density="compact"
                  clearable
                  variant="outlined"
                  v-model="amc"
                  show-size
                  label="AMC Document"
                  class="custom-field"
                  multiple="false"
                  accept=".pdf,.jpg,.png"
                ></v-file-input>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-file-input
                  color="#7b1fa2"
                  prepend-inner-icon="mdi-file-pdf-box"
                  density="compact"
                  clearable
                  variant="outlined"
                  v-model="installationReport"
                  show-size
                  label="Installation Report"
                  class="custom-field"
                  multiple="false"
                  accept=".pdf,.jpg,.png"
                ></v-file-input>
                <span v-if="v$.installationReport.$error" class="error-text">
                  Installation Report is required
                </span>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-file-input
                  color="#7b1fa2"
                  prepend-inner-icon="mdi-file-pdf-box"
                  density="compact"
                  clearable
                  variant="outlined"
                  v-model="warranty"
                  show-size
                  label="Warranty Document"
                  class="custom-field"
                  multiple="false"
                  accept=".pdf,.jpg,.png"
                ></v-file-input>
                <span v-if="v$.warranty.$error" class="error-text">
                  Warranty Document is required
                </span>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-file-input
                  color="#7b1fa2"
                  prepend-inner-icon="mdi-file-pdf-box"
                  density="compact"
                  clearable
                  variant="outlined"
                  v-model="maintenance"
                  show-size
                  label="Maintenance Contract"
                  class="custom-field"
                  multiple="false"
                  accept=".pdf,.jpg,.png"
                ></v-file-input>
              </v-col>
              <!-- Dynamic Document Fields -->
              <v-col cols="12">
                <v-label class="mb-2">Additional Documents (up to 10)</v-label>
                <v-row
                  v-for="(doc, index) in documentFields"
                  :key="index"
                  dense
                  class="align-center"
                >
                  <v-col cols="12" :sm="isMobile ? 12 : 5">
                    <v-file-input
                      color="#7b1fa2"
                      prepend-inner-icon="mdi-file-pdf-box"
                      density="compact"
                      clearable
                      variant="outlined"
                      v-model="doc.file"
                      show-size
                      :label="`Document ${index + 1}`"
                      class="custom-field"
                      accept=".pdf,.jpg,.png"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" :sm="isMobile ? 12 : 5">
                    <v-text-field
                      color="#7b1fa2"
                      :label="`Document ${index + 1} Name`"
                      density="compact"
                      v-model="doc.typeName"
                      variant="outlined"
                      class="custom-field"
                      prepend-inner-icon="mdi-file-document-outline"
                      :placeholder="`Document ${index + 1}`"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" :sm="isMobile ? 12 : 2">
                    <v-btn
                      icon
                      color="red"
                      @click="removeDocument(index)"
                      :disabled="documentFields.length === 1"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-btn
                  color="#7b1fa2"
                  class="mt-2"
                  :disabled="documentFields.length >= 10"
                  @click="addDocumentField"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Add Document
                </v-btn>
                <span v-if="documentsError" class="error-text">
                  {{ documentsError }}
                </span>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="action-container">
          <v-btn class="action-btn cancel-btn" @click="show = false">
            Cancel
          </v-btn>
          <v-btn class="action-btn save-btn" @click="addSale">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Snackbar for Error Messages -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="5000"
      top
    >
      {{ snackbarMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core';
import { required, numeric } from '@vuelidate/validators';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'AddEquipment',
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      dialog: false,
      serialNo: '',
      MaintenancePeriod: '',
      selcetdClient: '',
      selcetdCategory: '',
      selcetdSubCategory: '',
      selcetedEquipment: '',
      invoice: [],
      amc: [],
      installationReport: [],
      warranty: [],
      maintenance: [],
      documentFields: [{ file: [], typeName: '' }],
      documentsError: '',
      InstallationDate: '',
      WarrantyDate: '',
      lastMainDate: '',
      search: '',
      availSubCatList: [],
      availableEquilist: [],
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: 'error',
    };
  },
  watch: {
    search(val) {
      console.log('Client search updated:', val);
      this.GET_CLIENT_LIST({ name: val });
    },
    InstallationDate(val) {
      console.log('Installation Date updated:', val);
      this.lastMainDate = val;
    },
  },
  validations() {
    return {
      selcetdClient: { required },
      selcetedEquipment: { required },
      MaintenancePeriod: { required, numeric },
      serialNo: { required },
      InstallationDate: { required },
      WarrantyDate: { required },
      invoice: { required },
      installationReport: { required },
      warranty: { required },
      lastMainDate: { required },
    };
  },
  props: {
    visible: {
      type: Boolean,
    },
    title: {
      type: String,
    },
  },
  computed: {
    ...mapState('clients', ['clientList']),
    ...mapState('category', ['categoryList']),
    ...mapState('subCategory', ['subcatList']),
    ...mapState('equipments', ['allEquipments']),
    isMobile() {
      return this.$vuetify.display.smAndDown;
    },
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          console.log('Dialog closed');
          this.$emit('close');
        }
      },
    },
  },
  methods: {
    ...mapActions('clients', [
      'GET_CLIENT_LIST',
      'ADD_CLIENT',
      'DELETE_CLIENT',
      'GET_CLIENT_BY_ID',
      'UPDATE_CLIENT',
    ]),
    ...mapActions('category', [
      'GET_ALL_CATEGORY',
      'ADD_CATEGORY',
      'UPDATE_CATEGORY',
      'DELETE_CATEGORY',
    ]),
    ...mapActions('subCategory', ['GET_SUB_CATEGORY', 'GET_ALL_SUBCATEGORY']),
    ...mapActions('equipments', ['GET_EQUIPMENT', 'GET_ALL_EQUIPMENT']),
    ...mapActions('salesEquipment', ['ADD_SALE_EQUIPMENT']),
    getSubcatList() {
      console.log('Fetching subcategory list for category:', this.selcetdCategory);
      this.availSubCatList = [];
      if (!this.selcetdCategory) {
        this.availSubCatList = this.subcatList;
      } else {
        const list = this.$store.getters['subCategory/get_all_sub_cat_with_cat_id'](
          this.selcetdCategory
        );
        this.availSubCatList = list;
        console.log('Subcategory list:', this.availSubCatList);
      }
    },
    getEquiList() {
      console.log('Fetching equipment list for subcategory:', this.selcetdSubCategory);
      this.availableEquilist = [];
      if (!this.selcetdSubCategory) {
        this.availableEquilist = this.allEquipments;
      } else {
        const list = this.$store.getters['equipments/get_all_equipment_with_sub_catId'](
          this.selcetdSubCategory
        );
        this.availableEquilist = list;
        console.log('Equipment list:', this.availableEquilist);
      }
    },
    addDocumentField() {
      if (this.documentFields.length < 10) {
        this.documentFields.push({ file: [], typeName: '' });
        this.documentsError = '';
        console.log('Added document field. Total fields:', this.documentFields.length);
      } else {
        this.documentsError = 'Maximum 10 documents allowed';
        this.showSnackbar('Maximum 10 documents allowed', 'error');
        console.error('Cannot add more documents. Limit reached:', this.documentFields.length);
      }
    },
    removeDocument(index) {
      if (this.documentFields.length > 1) {
        this.documentFields.splice(index, 1);
        this.documentsError = '';
        console.log('Removed document field at index:', index, 'Total fields:', this.documentFields.length);
      } else {
        console.log('Cannot remove last document field');
      }
    },
    showSnackbar(message, color = 'error') {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbar = true;
      console.log('Showing snackbar:', { message, color });
    },
async addSale() {
  console.log('Step 1: Starting form submission');

  console.log('Step 2: Validating form fields with Vuelidate');
  await this.v$.$validate(); // Ensure validation is awaited
  console.log('Step 2.1: Vuelidate validation errors:', this.v$.$errors);

  console.log('Step 3: Checking document fields validity');
  const validDocuments = this.documentFields.every(
    (doc) => doc.file.length === 0 || doc.file.length === 1
  );
  this.documentsError =
    this.documentFields.length > 10
      ? 'Maximum 10 documents allowed'
      : !validDocuments
      ? 'Each document field must have exactly one file or be empty'
      : '';
  console.log('Step 3.1: Document fields:', this.documentFields);
  console.log('Step 3.2: Valid documents:', validDocuments);
  console.log('Step 3.3: Documents error:', this.documentsError);

  console.log('Step 4: Validating equipmentId');
  if (!this.selcetedEquipment) {
    console.log('Step 4.4: Equipment not selected');
    this.showSnackbar('Please select an equipment', 'error');
    return;
  }
  const isValidEquipment = this.availableEquilist.some(
    (equip) => equip.id === this.selcetedEquipment
  );
  console.log('Step 4.1: Selected equipment ID:', this.selcetedEquipment);
  console.log('Step 4.2: Available equipment list:', this.availableEquilist);
  console.log('Step 4.3: Is equipment valid?', isValidEquipment);

  if (!isValidEquipment) {
    console.log('Step 4.4: Invalid equipment selected');
    this.showSnackbar('Invalid Equipment selected', 'error');
    console.error('Invalid equipmentId:', this.selcetedEquipment);
    return;
  }

  console.log('Step 5: Validating clientId');
  if (!this.selcetdClient) {
    console.log('Step 5.4: Client not selected');
    this.showSnackbar('Please select a client', 'error');
    return;
  }
  const isValidClient = this.clientList.some(
    (client) => client.id === this.selcetdClient
  );
  console.log('Step 5.1: Selected client ID:', this.selcetdClient);
  console.log('Step 5.2: Available client list:', this.clientList);
  console.log('Step 5.3: Is client valid?', isValidClient);

  if (!isValidClient) {
    console.log('Step 5.4: Invalid client selected');
    this.showSnackbar('Invalid Client selected', 'error');
    console.error('Invalid clientId:', this.selcetdClient);
    return;
  }

  if (!this.v$.$error && !this.documentsError) {
    console.log('Step 6: Form is valid, preparing payload');
    try {
      console.log('Step 7: Constructing documents and typeNames arrays');
      const documents = this.documentFields
        .filter((doc) => doc.file.length > 0)
        .map((doc) => doc.file[0]);
      const typeNames = this.documentFields
        .filter((doc) => doc.file.length > 0)
        .map((doc, index) => doc.typeName || `Document_${index + 1}`);
      console.log('Step 7.1: Documents:', documents.map(doc => doc.name));
      console.log('Step 7.2: TypeNames:', typeNames);

      console.log('Step 8: Building payload');
      const payload = {
        serialNo: this.serialNo,
        equipmentId: this.selcetedEquipment,
        clientId: this.selcetdClient,
        maintenancePeriod: this.MaintenancePeriod,
        installationDate: this.InstallationDate,
        warrantyDate: this.WarrantyDate,
        invoice: this.invoice.length > 0 ? this.invoice : null,
        installationReport: this.installationReport.length > 0 ? this.installationReport : null,
        warrantyDocument: this.warranty.length > 0 ? this.warranty : null,
        maintenanceContract: this.maintenance.length > 0 ? this.maintenance : null,
        annualMaintenanceContract: this.amc.length > 0 ? this.amc : null,
        lastMaintenanceDate: this.lastMainDate,
        documents,
        typeNames,
        purchaseDate: '',
      };
      console.log('Step 8.1: Payload:', {
        serialNo: payload.serialNo,
        equipmentId: payload.equipmentId,
        clientId: payload.clientId,
        maintenancePeriod: payload.maintenancePeriod,
        installationDate: payload.installationDate,
        warrantyDate: payload.warrantyDate,
        invoice: payload.invoice?.length > 0 ? payload.invoice[0]?.name : null,
        installationReport: payload.installationReport?.length > 0 ? payload.installationReport[0]?.name : null,
        warrantyDocument: payload.warrantyDocument?.length > 0 ? payload.warrantyDocument[0]?.name : null,
        maintenanceContract: payload.maintenanceContract?.length > 0 ? payload.maintenanceContract[0]?.name : null,
        annualMaintenanceContract: payload.annualMaintenanceContract?.length > 0 ? payload.annualMaintenanceContract[0]?.name : null,
        lastMaintenanceDate: payload.lastMaintenanceDate,
        documents: payload.documents.map(doc => doc.name),
        typeNames: payload.typeNames,
        purchaseDate: payload.purchaseDate
      });

      console.log('Step 9: Calling ADD_SALE_EQUIPMENT action');
      const response = await this.ADD_SALE_EQUIPMENT(payload);
      console.log('Step 9.1: API response:', response);

      if (response.response === 'success') {
        console.log('Step 10: Sale added successfully');
        this.$emit('success', { message: 'Sale added successfully' });
        this.showSnackbar('Sale added successfully', 'success');
        console.log('Step 10.1: Resetting form');
        this.serialNo = '';
        this.selcetedEquipment = '';
        this.selcetdClient = '';
        this.MaintenancePeriod = '';
        this.InstallationDate = '';
        this.WarrantyDate = '';
        this.invoice = [];
        this.installationReport = [];
        this.warranty = [];
        this.maintenance = [];
        this.amc = [];
        this.documentFields = [{ file: [], typeName: '' }];
        this.lastMainDate = '';
        this.v$.$reset();
        this.show = false;
      } else {
        console.log('Step 10: Failed to add sale');
        const errorMessage = response.message || 'Failed to add sale';
        const errorDetails = response.errors ? JSON.stringify(response.errors) : '';
        this.showSnackbar(`${errorMessage}${errorDetails ? ': ' + errorDetails : ''}`);
        this.$emit('error', { message: errorMessage, details: response.errors });
        console.error('API error:', {
          message: errorMessage,
          response,
          errors: response.errors
        });
      }
    } catch (error) {
      console.log('Step 11: Error during form submission');
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add sale';
      let userFriendlyMessage = errorMessage;
      if (errorMessage.includes('foreign key constraint fails')) {
        userFriendlyMessage = 'Invalid Equipment or Client selected. Please check your selections.';
      }
      const errorDetails = error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : error.stack;
      this.showSnackbar(`${userFriendlyMessage}${errorDetails ? ': ' + errorDetails : ''}`);
      this.$emit('error', { message: userFriendlyMessage, details: error.response?.data?.errors });
      console.error('Submission error:', {
        message: errorMessage,
        response: error.response?.data,
        status: error.response?.status,
        errors: error.response?.data?.errors,
        stack: error.stack
      });
    }
  } else {
    console.log('Step 6: Form validation failed');
    const validationErrors = this.v$.$errors.map((err) => ({
      field: err.$property,
      message: err.$message,
    }));
    const errorMessage = validationErrors.length
      ? `Validation errors: ${validationErrors.map((e) => `${e.field}: ${e.message}`).join(', ')}`
      : 'Please fix validation errors';
    this.showSnackbar(errorMessage);
    console.error('Validation errors:', {
      validationErrors,
      documentsError: this.documentsError,
      formState: {
        selcetdClient: this.selcetdClient,
        selcetedEquipment: this.selcetedEquipment,
        MaintenancePeriod: this.MaintenancePeriod,
        serialNo: this.serialNo,
        InstallationDate: this.InstallationDate,
        WarrantyDate: this.WarrantyDate,
        invoice: this.invoice.length,
        installationReport: this.installationReport.length,
        warranty: this.warranty.length,
        lastMainDate: this.lastMainDate,
        documentFields: this.documentFields
      }
    });
  }
}
  },
created() {
  console.log('Component created. Fetching initial data');
  const query = { size: 150 };
  this.GET_CLIENT_LIST(query);
  this.GET_ALL_CATEGORY(query);
  this.GET_ALL_SUBCATEGORY(query);
  this.GET_ALL_EQUIPMENT();
}
};
</script>

<style scoped>
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
  background: linear-gradient(45deg, #d46f1c, #7b1fa2);
  color: white;
}

.save-btn:hover {
  background: linear-gradient(45deg, #8e24aa, #6a1b9a);
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