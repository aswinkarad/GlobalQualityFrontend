<template>
  <div class="text-center">
    <v-dialog
      v-model="show"
      transition="dialog-top-transition"
      :max-width="isMobile ? '100%' : '900'"
      :fullscreen="isMobile"
      scrollable
      persistent
    >
      <v-card class="dialog-card elevation-5">
        <v-card-title class="dialog-title">
          Edit Equipment
          <v-spacer></v-spacer>
          <v-btn icon small @click="closeDialog" class="close-btn">
            <v-icon style="color: black;">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="form-container">
          <v-container fluid v-if="loading">
            <v-row>
              <v-col cols="12" class="text-center">
                <v-progress-circular indeterminate color="#7b1fa2"></v-progress-circular>
                <p>Loading equipment data...</p>
              </v-col>
            </v-row>
          </v-container>
          <v-container fluid v-else>
            <v-row dense>
              <!-- Client Field -->
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete
                  color="#7b1fa2"
                  variant="outlined"
                  density="compact"
                  v-model="form.client_id"
                  clearable
                  :items="clientList"
                  item-title="name"
                  item-value="id"
                  label="Client"
                  class="custom-field"
                  prepend-inner-icon="mdi-account"
                  :readonly="!isAdmin"
                ></v-autocomplete>
                <span v-if="v$.form.client_id.$error" class="error-text">
                  Client is required
                </span>
              </v-col>

              <!-- Category Field -->
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete
                  color="#7b1fa2"
                  variant="outlined"
                  density="compact"
                  v-model="form.category_id"
                  clearable
                  :items="categoryList"
                  item-title="categoryName"
                  item-value="id"
                  label="Category"
                  class="custom-field"
                  prepend-inner-icon="mdi-shape"
                  @update:modelValue="updateSubCategoryList"
                ></v-autocomplete>
                <span v-if="v$.form.category_id.$error" class="error-text">
                  Category is required
                </span>
              </v-col>

              <!-- Sub Category Field -->
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete
                  color="#7b1fa2"
                  variant="outlined"
                  density="compact"
                  v-model="form.sub_category_id"
                  clearable
                  :items="availSubCatList"
                  item-title="subcategoryName"
                  item-value="id"
                  label="Sub Category"
                  class="custom-field"
                  prepend-inner-icon="mdi-shape-outline"
                  @update:modelValue="updateEquipmentList"
                ></v-autocomplete>
                <span v-if="v$.form.sub_category_id.$error" class="error-text">
                  Sub Category is required
                </span>
              </v-col>

              <!-- Equipment Field -->
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete
                  color="#7b1fa2"
                  variant="outlined"
                  density="compact"
                  v-model="form.equipment_id"
                  clearable
                  :items="availableEquiList"
                  item-title="equipmentName"
                  item-value="id"
                  label="Equipment"
                  class="custom-field"
                  prepend-inner-icon="mdi-tools"
                ></v-autocomplete>
                <span v-if="v$.form.equipment_id.$error" class="error-text">
                  Equipment is required
                </span>
              </v-col>

              <!-- Serial Number -->
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-text-field
                  color="#7b1fa2"
                  label="Serial No"
                  density="compact"
                  v-model="form.serial_no"
                  variant="outlined"
                  class="custom-field"
                  prepend-inner-icon="mdi-barcode"
                ></v-text-field>
                <span v-if="v$.form.serial_no.$error" class="error-text">
                  Serial No is required
                </span>
              </v-col>

              <!-- Maintenance Period -->
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-text-field
                  color="#7b1fa2"
                  label="Maintenance Period (days)"
                  density="compact"
                  v-model="form.maintenance_period"
                  variant="outlined"
                  class="custom-field"
                  prepend-inner-icon="mdi-calendar-clock"
                  type="number"
                  min="0"
                ></v-text-field>
                <span v-if="v$.form.maintenance_period.$error" class="error-text">
                  {{ v$.form.maintenance_period.$errors[0].$message }}
                </span>
              </v-col>

              <!-- Installation Date -->
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-text-field
                  color="#7b1fa2"
                  label="Installation Date"
                  type="date"
                  density="compact"
                  v-model="form.installation_date"
                  variant="outlined"
                  class="custom-field"
                  prepend-inner-icon="mdi-calendar-start"
                ></v-text-field>
                <span v-if="v$.form.installation_date.$error" class="error-text">
                  Installation Date is required
                </span>
              </v-col>

              <!-- Last Maintenance Date -->
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-text-field
                  color="#7b1fa2"
                  label="Last Maintenance Date"
                  type="date"
                  density="compact"
                  v-model="form.last_maintenance_date"
                  variant="outlined"
                  class="custom-field"
                  prepend-inner-icon="mdi-calendar-check"
                ></v-text-field>
                <span v-if="v$.form.last_maintenance_date.$error" class="error-text">
                  Last Maintenance Date is required
                </span>
              </v-col>

              <!-- Warranty Expiry Date -->
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-text-field
                  color="#7b1fa2"
                  label="Warranty Expiry Date"
                  type="date"
                  density="compact"
                  v-model="form.warranty_date"
                  variant="outlined"
                  class="custom-field"
                  prepend-inner-icon="mdi-calendar-end"
                ></v-text-field>
                <span v-if="v$.form.warranty_date.$error" class="error-text">
                  Warranty Expiry Date is required
                </span>
              </v-col>

              <!-- Status -->
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-select
                  color="#7b1fa2"
                  variant="outlined"
                  density="compact"
                  v-model="form.status"
                  :items="statusOptions"
                  item-title="title"
                  item-value="value"
                  label="Status"
                  class="custom-field"
                  prepend-inner-icon="mdi-list-status"
                ></v-select>
                <span v-if="v$.form.status.$error" class="error-text">
                  Status is required
                </span>
              </v-col>

              <!-- Document Fields -->
              <v-col cols="12">
                <v-label class="mb-2">Documents</v-label>
                
                <!-- Invoice -->
                <v-row dense class="align-center">
                  <v-col cols="12" :sm="isMobile ? 12 : 5">
                    <div v-if="invoicePreview" class="preview-container mb-2">
                      <v-img
                        v-if="isImage(invoicePreview)"
                        :src="invoicePreview"
                        max-height="100"
                        max-width="100"
                        class="preview-image"
                      ></v-img>
                      <v-icon
                        v-else
                        size="100"
                        color="#7b1fa2"
                        @click="openFile(invoicePreview)"
                        class="pdf-icon"
                      >mdi-file-pdf-box</v-icon>
                      <v-btn
                        icon
                        small
                        class="remove-preview"
                        @click="clearPreview('invoice')"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </div>
                    <v-file-input
                      color="#7b1fa2"
                      prepend-inner-icon="mdi-file-pdf-box"
                      density="compact"
                      clearable
                      variant="outlined"
                      v-model="form.invoice"
                      show-size
                      label="Invoice"
                      class="custom-field"
                      multiple="false"
                      accept=".pdf,.jpg,.png"
                      @update:modelValue="updatePreview('invoice')"
                    ></v-file-input>
                    <span v-if="v$.form.invoice.$error" class="error-text">
                      Invoice is required
                    </span>
                  </v-col>
                </v-row>

                <!-- Installation Report -->
                <v-row dense class="align-center">
                  <v-col cols="12" :sm="isMobile ? 12 : 5">
                    <div v-if="installationReportPreview" class="preview-container mb-2">
                      <v-img
                        v-if="isImage(installationReportPreview)"
                        :src="installationReportPreview"
                        max-height="100"
                        max-width="100"
                        class="preview-image"
                      ></v-img>
                      <v-icon
                        v-else
                        size="100"
                        color="#7b1fa2"
                        @click="openFile(installationReportPreview)"
                        class="pdf-icon"
                      >mdi-file-pdf-box</v-icon>
                      <v-btn
                        icon
                        small
                        class="remove-preview"
                        @click="clearPreview('installation_report')"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </div>
                    <v-file-input
                      color="#7b1fa2"
                      prepend-inner-icon="mdi-file-pdf-box"
                      density="compact"
                      clearable
                      variant="outlined"
                      v-model="form.installation_report"
                      show-size
                      label="Installation Report"
                      class="custom-field"
                      multiple="false"
                      accept=".pdf,.jpg,.png"
                      @update:modelValue="updatePreview('installation_report')"
                    ></v-file-input>
                    <span v-if="v$.form.installation_report.$error" class="error-text">
                      Installation Report is required
                    </span>
                  </v-col>
                </v-row>

                <!-- Warranty Document -->
                <v-row dense class="align-center">
                  <v-col cols="12" :sm="isMobile ? 12 : 5">
                    <div v-if="warrantyDocumentPreview" class="preview-container mb-2">
                      <v-img
                        v-if="isImage(warrantyDocumentPreview)"
                        :src="warrantyDocumentPreview"
                        max-height="100"
                        max-width="100"
                        class="preview-image"
                      ></v-img>
                      <v-icon
                        v-else
                        size="100"
                        color="#7b1fa2"
                        @click="openFile(warrantyDocumentPreview)"
                        class="pdf-icon"
                      >mdi-file-pdf-box</v-icon>
                      <v-btn
                        icon
                        small
                        class="remove-preview"
                        @click="clearPreview('warranty_document')"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </div>
                    <v-file-input
                      color="#7b1fa2"
                      prepend-inner-icon="mdi-file-pdf-box"
                      density="compact"
                      clearable
                      variant="outlined"
                      v-model="form.warranty_document"
                      show-size
                      label="Warranty Document"
                      class="custom-field"
                      multiple="false"
                      accept=".pdf,.jpg,.png"
                      @update:modelValue="updatePreview('warranty_document')"
                    ></v-file-input>
                    <span v-if="v$.form.warranty_document.$error" class="error-text">
                      Warranty Document is required
                    </span>
                  </v-col>
                </v-row>

                <!-- Annual Maintenance Contract -->
                <v-row dense class="align-center">
                  <v-col cols="12" :sm="isMobile ? 12 : 5">
                    <div v-if="annualMaintenanceContractPreview" class="preview-container mb-2">
                      <v-img
                        v-if="isImage(annualMaintenanceContractPreview)"
                        :src="annualMaintenanceContractPreview"
                        max-height="100"
                        max-width="100"
                        class="preview-image"
                      ></v-img>
                      <v-icon
                        v-else
                        size="100"
                        color="#7b1fa2"
                        @click="openFile(annualMaintenanceContractPreview)"
                        class="pdf-icon"
                      >mdi-file-pdf-box</v-icon>
                      <v-btn
                        icon
                        small
                        class="remove-preview"
                        @click="clearPreview('annual_maintenance_contract')"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </div>
                    <v-file-input
                      color="#7b1fa2"
                      prepend-inner-icon="mdi-file-pdf-box"
                      density="compact"
                      clearable
                      variant="outlined"
                      v-model="form.annual_maintenance_contract"
                      show-size
                      label="Annual Maintenance Contract"
                      class="custom-field"
                      multiple="false"
                      accept=".pdf,.jpg,.png"
                      @update:modelValue="updatePreview('annual_maintenance_contract')"
                    ></v-file-input>
                  </v-col>
                </v-row>

                <!-- Additional Documents -->
                <v-label class="mb-2 mt-4">Additional Documents</v-label>
                <v-row
                  v-for="(doc, index) in form.document_fields"
                  :key="index"
                  dense
                  class="align-center"
                >
                  <v-col cols="12" :sm="isMobile ? 12 : 5">
                    <div v-if="doc.preview" class="preview-container mb-2">
                      <v-img
                        v-if="isImage(doc.preview)"
                        :src="doc.preview"
                        max-height="100"
                        max-width="100"
                        class="preview-image"
                      ></v-img>
                      <v-icon
                        v-else
                        size="100"
                        color="#7b1fa2"
                        @click="openFile(doc.preview)"
                        class="pdf-icon"
                      >mdi-file-pdf-box</v-icon>
                      <v-btn
                        icon
                        small
                        class="remove-preview"
                        @click="clearDocumentPreview(index)"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </div>
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
                      @update:modelValue="updateDocumentPreview(index)"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" :sm="isMobile ? 12 : 5">
                    <v-text-field
                      color="#7b1fa2"
                      :label="`Document ${index + 1} Name`"
                      density="compact"
                      v-model="doc.type_name"
                      variant="outlined"
                      class="custom-field"
                      prepend-inner-icon="mdi-file-document"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" :sm="isMobile ? 12 : 2">
                    <v-btn
                      icon
                      color="red"
                      @click="removeDocument(index)"
                      :disabled="form.document_fields.length <= 1"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-btn
                  color="#7b1fa2"
                  class="mt-2"
                  :disabled="form.document_fields.length >= 10"
                  @click="addDocumentField"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Add Document
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions class="action-container" v-if="!loading">
          <v-btn class="action-btn cancel-btn" @click="closeDialog">
            Cancel
          </v-btn>
          <v-btn 
            class="action-btn save-btn" 
            @click="updateEquipment" 
            :loading="saving"
            :disabled="saving"
          >
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      top
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, numeric, minValue } from '@vuelidate/validators';
import { useStore } from 'vuex';

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    items: {
      type: Object,
      default: () => ({})
    }
  },

  emits: ['update:visible', 'save', 'close'],

  setup(props, { emit }) {
    const store = useStore();

    // Form state
    const form = reactive({
      id: null,
      client_id: null,
      category_id: null,
      sub_category_id: null,
      equipment_id: null,
      serial_no: '',
      maintenance_period: '',
      installation_date: '',
      last_maintenance_date: '',
      warranty_date: '',
      status: 1,
      invoice: [],
      installation_report: [],
      warranty_document: [],
      annual_maintenance_contract: [],
      document_fields: [{ file: [], type_name: '', existing_file: '', preview: '' }],
      existing_files: {
        invoice: '',
        installation_report: '',
        warranty_document: '',
        annual_maintenance_contract: ''
      }
    });

    // Preview state
    const invoicePreview = ref('');
    const installationReportPreview = ref('');
    const warrantyDocumentPreview = ref('');
    const annualMaintenanceContractPreview = ref('');

    // UI state
    const loading = ref(true);
    const saving = ref(false);
    const snackbar = reactive({
      show: false,
      message: '',
      color: 'error'
    });
    const availSubCatList = ref([]);
    const availableEquiList = ref([]);

    // Computed properties
    const isAdmin = computed(() => {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.role?.[0] !== 'Engineer';
    });

    const isMobile = computed(() => store.state.isMobile);
    const clientList = computed(() => store.state.clients.clientList || []);
    const categoryList = computed(() => store.state.category.categoryList || []);
    const subcatList = computed(() => store.state.subCategory.subcatList || []);
    const allEquipments = computed(() => store.state.equipments.allEquipments || []);

    const statusOptions = computed(() => [
      { title: 'Active', value: 1 },
      { title: 'Inactive', value: 0 }
    ]);

    const show = computed({
      get: () => props.visible,
      set(value) {
        emit('update:visible', value);
      }
    });

    // Validation rules
    const rules = {
      form: {
        client_id: { required },
        category_id: { required },
        sub_category_id: { required },
        equipment_id: { required },
        serial_no: { required },
        maintenance_period: { required, numeric, minValue: minValue(0) },
        installation_date: { required },
        last_maintenance_date: { required },
        warranty_date: { required },
        status: { required },
        invoice: {
          required: {
            $validator: () => form.invoice.length > 0 || !!form.existing_files.invoice,
            $message: 'Invoice is required'
          }
        },
        installation_report: {
          required: {
            $validator: () => form.installation_report.length > 0 || !!form.existing_files.installation_report,
            $message: 'Installation Report is required'
          }
        },
        warranty_document: {
          required: {
            $validator: () => form.warranty_document.length > 0 || !!form.existing_files.warranty_document,
            $message: 'Warranty Document is required'
          }
        }
      }
    };

    const v$ = useVuelidate(rules, { form });

    // Methods
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          return dateStr.split('T')[0];
        }
        return date.toISOString().split('T')[0];
      } catch (error) {
        console.error('Date formatting error:', error);
        return '';
      }
    };

    const isImage = (url) => {
      return url && url.match(/\.(jpg|jpeg|png)$/i);
    };

    const openFile = (url) => {
      if (url) window.open(url, '_blank');
    };

    const updatePreview = (field) => {
      const file = form[field]?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        switch (field) {
          case 'invoice':
            invoicePreview.value = url;
            break;
          case 'installation_report':
            installationReportPreview.value = url;
            break;
          case 'warranty_document':
            warrantyDocumentPreview.value = url;
            break;
          case 'annual_maintenance_contract':
            annualMaintenanceContractPreview.value = url;
            break;
        }
      } else {
        clearPreview(field);
      }
    };

    const updateDocumentPreview = (index) => {
      const file = form.document_fields[index].file?.[0];
      if (file) {
        form.document_fields[index].preview = URL.createObjectURL(file);
      } else {
        form.document_fields[index].preview = form.document_fields[index].existing_file || '';
      }
    };

    const clearPreview = (field) => {
      switch (field) {
        case 'invoice':
          invoicePreview.value = form.existing_files.invoice || '';
          form.invoice = [];
          break;
        case 'installation_report':
          installationReportPreview.value = form.existing_files.installation_report || '';
          form.installation_report = [];
          break;
        case 'warranty_document':
          warrantyDocumentPreview.value = form.existing_files.warranty_document || '';
          form.warranty_document = [];
          break;
        case 'annual_maintenance_contract':
          annualMaintenanceContractPreview.value = form.existing_files.annual_maintenance_contract || '';
          form.annual_maintenance_contract = [];
          break;
      }
    };

    const clearDocumentPreview = (index) => {
      form.document_fields[index].preview = form.document_fields[index].existing_file || '';
      form.document_fields[index].file = [];
    };

    const loadEquipmentData = () => {
      loading.value = true;
      try {
        console.log('Loading equipment data:', props.items); // Debug log
        // Set form values from props
        form.id = props.items.id || null;
        form.client_id = props.items.client?.id || null;
        form.category_id = props.items.equipment?.subcategory?.category?.id || null;
        form.sub_category_id = props.items.equipment?.subcategory?.id || null;
        form.equipment_id = props.items.equipment?.id || null;
        form.serial_no = props.items.serialNo || '';
        form.maintenance_period = props.items.maintenancePeriod ? String(props.items.maintenancePeriod) : '';
        form.installation_date = formatDate(props.items.installationDate);
        form.last_maintenance_date = formatDate(props.items.lastMaintenanceDate);
        form.warranty_date = formatDate(props.items.warrantyDate);
        form.status = props.items.status != null ? Number(props.items.status) : 1;

        // Set existing files and previews
        form.existing_files.invoice = props.items.invoice || '';
        invoicePreview.value = form.existing_files.invoice;
        form.existing_files.installation_report = props.items.installationReport || '';
        installationReportPreview.value = form.existing_files.installation_report;
        form.existing_files.warranty_document = props.items.warrantyDocument || '';
        warrantyDocumentPreview.value = form.existing_files.warranty_document;
        form.existing_files.annual_maintenance_contract = props.items.annualMaintenanceContract || '';
        annualMaintenanceContractPreview.value = form.existing_files.annual_maintenance_contract;

        // Set additional documents
        if (Array.isArray(props.items.documents) && props.items.documents.length > 0) {
          form.document_fields = props.items.documents.map(doc => ({
            id: doc.id,
            file: [],
            type_name: doc.typeName || `Document_${doc.id}`,
            existing_file: doc.fileUrl || '',
            preview: doc.fileUrl || ''
          }));
        } else {
          form.document_fields = [{ file: [], type_name: '', existing_file: '', preview: '' }];
        }

        // Update subcategory and equipment lists
        updateSubCategoryList();
        updateEquipmentList();

        console.log('Loaded maintenance_period:', form.maintenance_period); // Debug log
        loading.value = false;
      } catch (error) {
        console.error('Error loading equipment data:', error);
        showSnackbar('error', 'Failed to load equipment data');
        loading.value = false;
        closeDialog();
      }
    };

    const updateSubCategoryList = () => {
      availSubCatList.value = [];
      if (!form.category_id) {
        availSubCatList.value = subcatList.value;
      } else {
        const list = store.getters['subCategory/get_all_sub_cat_with_cat_id'](form.category_id);
        availSubCatList.value = list || [];
      }
      if (!availSubCatList.value.some(sub => sub.id === form.sub_category_id)) {
        form.sub_category_id = null;
        form.equipment_id = null;
      }
    };

    const updateEquipmentList = () => {
      availableEquiList.value = [];
      if (!form.sub_category_id) {
        availableEquiList.value = allEquipments.value;
      } else {
        const list = store.getters['equipments/get_all_equipment_with_sub_catId'](form.sub_category_id);
        availableEquiList.value = list || [];
      }
      if (!availableEquiList.value.some(equi => equi.id === form.equipment_id)) {
        form.equipment_id = null;
      }
    };

    const addDocumentField = () => {
      if (form.document_fields.length < 10) {
        form.document_fields.push({ file: [], type_name: '', existing_file: '', preview: '' });
      } else {
        showSnackbar('error', 'Maximum 10 documents allowed');
      }
    };

    const removeDocument = (index) => {
      if (form.document_fields.length > 1) {
        form.document_fields.splice(index, 1);
      }
    };

    const showSnackbar = (color, message) => {
      snackbar.color = color;
      snackbar.message = message;
      snackbar.show = true;
    };

    const closeDialog = () => {
      emit('close');
      resetForm();
    };

    const resetForm = () => {
      form.id = null;
      form.client_id = null;
      form.category_id = null;
      form.sub_category_id = null;
      form.equipment_id = null;
      form.serial_no = '';
      form.maintenance_period = '';
      form.installation_date = '';
      form.last_maintenance_date = '';
      form.warranty_date = '';
      form.status = 1;
      form.invoice = [];
      form.installation_report = [];
      form.warranty_document = [];
      form.annual_maintenance_contract = [];
      form.document_fields = [{ file: [], type_name: '', existing_file: '', preview: '' }];
      form.existing_files = {
        invoice: '',
        installation_report: '',
        warranty_document: '',
        annual_maintenance_contract: ''
      };
      invoicePreview.value = '';
      installationReportPreview.value = '';
      warrantyDocumentPreview.value = '';
      annualMaintenanceContractPreview.value = '';
      availSubCatList.value = [];
      availableEquiList.value = [];
      v$.value.$reset();
    };

   const updateEquipment = async () => {
  v$.value.$validate();
  if (v$.value.$invalid) {
    showSnackbar('error', 'Please fix validation errors');
    return;
  }

  // Validate dates
  const dates = [form.installation_date, form.last_maintenance_date, form.warranty_date];
  for (const date of dates) {
    if (date && isNaN(new Date(date).getTime())) {
      showSnackbar('error', 'Invalid date format');
      return;
    }
  }

  // Validate maintenance_period
  if (form.maintenance_period && (isNaN(Number(form.maintenance_period)) || Number(form.maintenance_period) < 0)) {
    showSnackbar('error', 'Maintenance period must be a non-negative number');
    return;
  }

  saving.value = true;
  try {
    const documents = form.document_fields
      .filter(doc => doc.file.length > 0)
      .map(doc => doc.file[0]);
    const type_names = form.document_fields
      .filter(doc => doc.file.length > 0)
      .map((doc, index) => doc.type_name || `Document_${index + 1}`);

    const formData = {
      id: form.id,
      client_id: form.client_id,
      equipment_id: form.equipment_id,
      serial_no: form.serial_no,
      maintenance_period: form.maintenance_period ? Number(form.maintenance_period) : '',
      installation_date: form.installation_date || '',
      last_maintenance_date: form.last_maintenance_date || '',
      warranty_date: form.warranty_date || '',
      status: form.status,
      invoice: form.invoice.length > 0 ? form.invoice[0] : null,
      installation_report: form.installation_report.length > 0 ? form.installation_report[0] : null,
      warranty_document: form.warranty_document.length > 0 ? form.warranty_document[0] : null,
      annual_maintenance_contract: form.annual_maintenance_contract.length > 0 ? form.annual_maintenance_contract[0] : null,
      existing_files: form.existing_files,
      documents: documents,
      type_names: type_names
    };

    console.log('Submitting formData:', formData);
    console.log('Documents:', documents, 'Type Names:', type_names);
    await store.dispatch('salesEquipment/UPDATE_SALE_EQUIPMET', formData);
    
    showSnackbar('success', 'Equipment updated successfully');
    emit('save', formData);
    closeDialog();
  } catch (error) {
    console.error('Error updating equipment:', error);
    console.error('Error response:', error.response);
    const errorMsg = error.response?.data?.message || error.message || 'Failed to update equipment. Please check server logs.';
    showSnackbar('error', errorMsg);
  } finally {
    saving.value = false;
  }
};

    // Lifecycle hooks
    watch(() => props.items, (newVal) => {
      if (newVal && Object.keys(newVal).length > 0) {
        loadEquipmentData();
      }
    }, { immediate: true });

    // Fetch initial data
    const query = { size: 1000 };
    store.dispatch('clients/GET_CLIENT_LIST', query);
    store.dispatch('category/GET_ALL_CATEGORY', query);
    store.dispatch('subCategory/GET_ALL_SUBCATEGORY', query);
    store.dispatch('equipments/GET_ALL_EQUIPMENT', query);

    return {
      form,
      invoicePreview,
      installationReportPreview,
      warrantyDocumentPreview,
      annualMaintenanceContractPreview,
      loading,
      saving,
      snackbar,
      isAdmin,
      isMobile,
      clientList,
      categoryList,
      availSubCatList,
      availableEquiList,
      statusOptions,
      show,
      v$,
      isImage,
      openFile,
      updatePreview,
      clearPreview,
      updateDocumentPreview,
      clearDocumentPreview,
      addDocumentField,
      removeDocument,
      closeDialog,
      updateEquipment,
      updateSubCategoryList,
      updateEquipmentList
    };
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

.preview-container {
  position: relative;
  display: inline-block;
}

.preview-image {
  border-radius: 8px;
  border: 1px solid #ddd;
}

.pdf-icon {
  cursor: pointer;
}

.remove-preview {
  position: absolute;
  top: -8px;
  right: -8px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
}

.error-text {
  color: #d32f2f;
  font-size: 0.75rem;
  margin-top: 4px;
  display: block;
}

@media (max-width: 600px) {
  .dialog-card {
    max-height: 100vh;
    border-radius: 0;
    margin: 0;
  }
  
  .form-container {
    padding: 16px;
  }
  
  .action-container {
    flex-direction: column;
    padding: 16px;
    gap: 8px;
  }
  
  .action-btn {
    width: 100%;
  }
}
</style>