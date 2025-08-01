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
        <v-card-title class="dialog-title sticky-header">
          Edit Equipment
          <v-spacer></v-spacer>
          <v-btn icon small @click="closeDialog" class="close-btn">
            <v-icon color="black">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="form-container">
          <v-container fluid v-if="loading">
            <v-row justify="center">
              <v-col cols="12" class="text-center">
                <v-progress-circular indeterminate color="primary" size="40"></v-progress-circular>
                <p class="mt-2">Loading equipment data...</p>
              </v-col>
            </v-row>
          </v-container>
          <v-container fluid v-else>
            <v-row dense>
              <v-col cols="12" sm="6" md="4">
                <v-autocomplete
                  color="primary"
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
                  :error-messages="v$.form.client_id.$errors.map(e => e.$message)"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-autocomplete
                  color="primary"
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
                  :error-messages="v$.form.category_id.$errors.map(e => e.$message)"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-autocomplete
                  color="primary"
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
                  :error-messages="v$.form.sub_category_id.$errors.map(e => e.$message)"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-autocomplete
                  color="primary"
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
                  :error-messages="v$.form.equipment_id.$errors.map(e => e.$message)"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  color="primary"
                  label="Serial No"
                  density="compact"
                  v-model="form.serial_no"
                  variant="outlined"
                  class="custom-field"
                  prepend-inner-icon="mdi-barcode"
                  :error-messages="v$.form.serial_no.$errors.map(e => e.$message)"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  color="primary"
                  label="Maintenance Period (days)"
                  density="compact"
                  v-model="form.maintenance_period"
                  variant="outlined"
                  class="custom-field"
                  prepend-inner-icon="mdi-calendar-clock"
                  type="number"
                  min="0"
                  :error-messages="v$.form.maintenance_period.$errors.map(e => e.$message)"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  color="primary"
                  label="Installation Date"
                  type="date"
                  density="compact"
                  v-model="form.installation_date"
                  variant="outlined"
                  class="custom-field"
                  prepend-inner-icon="mdi-calendar-start"
                  :error-messages="v$.form.installation_date.$errors.map(e => e.$message)"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  color="primary"
                  label="Last Maintenance Date"
                  type="date"
                  density="compact"
                  v-model="form.last_maintenance_date"
                  variant="outlined"
                  class="custom-field"
                  prepend-inner-icon="mdi-calendar-check"
                  :error-messages="v$.form.last_maintenance_date.$errors.map(e => e.$message)"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  color="primary"
                  label="Warranty Expiry Date"
                  type="date"
                  density="compact"
                  v-model="form.warranty_date"
                  variant="outlined"
                  class="custom-field"
                  prepend-inner-icon="mdi-calendar-end"
                  :error-messages="v$.form.warranty_date.$errors.map(e => e.$message)"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-select
                  color="primary"
                  variant="outlined"
                  density="compact"
                  v-model="form.status"
                  :items="statusOptions"
                  item-title="title"
                  item-value="value"
                  label="Status"
                  class="custom-field"
                  prepend-inner-icon="mdi-list-status"
                  :error-messages="v$.form.status.$errors.map(e => e.$message)"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-label class="section-label">Documents</v-label>

                <v-row dense class="align-center">
                  <v-col cols="12" sm="6">
                    <div v-if="invoicePreview" class="preview-container">
                      <v-img
                        v-if="isImage(invoicePreview)"
                        :src="invoicePreview"
                        max-height="120"
                        max-width="120"
                        class="preview-image"
                      ></v-img>
                      <v-icon
                        v-else
                        size="60"
                        color="primary"
                        @click="openFile(invoicePreview, 'Invoice')"
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
                      color="primary"
                      prepend-inner-icon="mdi-file-pdf-box"
                      density="compact"
                      clearable
                      variant="outlined"
                      v-model="form.invoice"
                      show-size
                      label="Invoice"
                      class="custom-field"
                      accept=".pdf,.jpg,.png"
                      @update:modelValue="updatePreview('invoice')"
                    ></v-file-input>
                  </v-col>
                </v-row>

                <v-row dense class="align-center">
                  <v-col cols="12" sm="6">
                    <div v-if="installationReportPreview" class="preview-container">
                      <v-img
                        v-if="isImage(installationReportPreview)"
                        :src="installationReportPreview"
                        max-height="120"
                        max-width="120"
                        class="preview-image"
                      ></v-img>
                      <v-icon
                        v-else
                        size="60"
                        color="primary"
                        @click="openFile(installationReportPreview, 'Installation Report')"
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
                      color="primary"
                      prepend-inner-icon="mdi-file-pdf-box"
                      density="compact"
                      clearable
                      variant="outlined"
                      v-model="form.installation_report"
                      show-size
                      label="Installation Report"
                      class="custom-field"
                      accept=".pdf,.jpg,.png"
                      @update:modelValue="updatePreview('installation_report')"
                    ></v-file-input>
                  </v-col>
                </v-row>

                <v-row dense class="align-center">
                  <v-col cols="12" sm="6">
                    <div v-if="warrantyDocumentPreview" class="preview-container">
                      <v-img
                        v-if="isImage(warrantyDocumentPreview)"
                        :src="warrantyDocumentPreview"
                        max-height="120"
                        max-width="120"
                        class="preview-image"
                      ></v-img>
                      <v-icon
                        v-else
                        size="60"
                        color="primary"
                        @click="openFile(warrantyDocumentPreview, 'Warranty Document')"
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
                      color="primary"
                      prepend-inner-icon="mdi-file-pdf-box"
                      density="compact"
                      clearable
                      variant="outlined"
                      v-model="form.warranty_document"
                      show-size
                      label="Warranty Document"
                      class="custom-field"
                      accept=".pdf,.jpg,.png"
                      @update:modelValue="updatePreview('warranty_document')"
                    ></v-file-input>
                  </v-col>
                </v-row>

                <v-row dense class="align-center">
                  <v-col cols="12" sm="6">
                    <div v-if="maintenanceContractPreview" class="preview-container">
                      <v-img
                        v-if="isImage(maintenanceContractPreview)"
                        :src="maintenanceContractPreview"
                        max-height="120"
                        max-width="120"
                        class="preview-image"
                      ></v-img>
                      <v-icon
                        v-else
                        size="60"
                        color="primary"
                        @click="openFile(maintenanceContractPreview, 'Maintenance Contract')"
                        class="pdf-icon"
                      >mdi-file-pdf-box</v-icon>
                      <v-btn
                        icon
                        small
                        class="remove-preview"
                        @click="clearPreview('maintenance_contract')"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </div>
                    <v-file-input
                      color="primary"
                      prepend-inner-icon="mdi-file-pdf-box"
                      density="compact"
                      clearable
                      variant="outlined"
                      v-model="form.maintenance_contract"
                      show-size
                      label="Maintenance Contract"
                      class="custom-field"
                      accept=".pdf,.jpg,.png"
                      @update:modelValue="updatePreview('maintenance_contract')"
                    ></v-file-input>
                  </v-col>
                </v-row>

                <v-row dense class="align-center">
                  <v-col cols="12" sm="6">
                    <div v-if="annualMaintenanceContractPreview" class="preview-container">
                      <v-img
                        v-if="isImage(annualMaintenanceContractPreview)"
                        :src="annualMaintenanceContractPreview"
                        max-height="120"
                        max-width="120"
                        class="preview-image"
                      ></v-img>
                      <v-icon
                        v-else
                        size="60"
                        color="primary"
                        @click="openFile(annualMaintenanceContractPreview, 'Annual Maintenance Contract')"
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
                      color="primary"
                      prepend-inner-icon="mdi-file-pdf-box"
                      density="compact"
                      clearable
                      variant="outlined"
                      v-model="form.annual_maintenance_contract"
                      show-size
                      label="Annual Maintenance Contract"
                      class="custom-field"
                      accept=".pdf,.jpg,.png"
                      @update:modelValue="updatePreview('annual_maintenance_contract')"
                    ></v-file-input>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" class="mt-4">
                <v-label class="section-label">Additional Documents (up to 10)</v-label>
                <v-row
                  v-for="(doc, index) in form.document_fields"
                  :key="doc.id || `doc-${index}`"
                  dense
                  class="align-center"
                >
                  <v-col cols="12" sm="5">
                    <div v-if="doc.preview" class="preview-container">
                      <v-img
                        v-if="isImage(doc.preview)"
                        :src="doc.preview"
                        max-height="120"
                        max-width="120"
                        class="preview-image"
                      ></v-img>
                      <v-icon
                        v-else
                        size="60"
                        color="primary"
                        @click="openFile(doc.preview, doc.type_name || `Document ${index + 1}`)"
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
                      color="primary"
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
                  <v-col cols="12" sm="5">
                    <v-text-field
                      color="primary"
                      :label="`Document ${index + 1} Name`"
                      density="compact"
                      v-model="doc.type_name"
                      variant="outlined"
                      class="custom-field"
                      prepend-inner-icon="mdi-file-document"
                      :placeholder="`Document ${index + 1}`"
                      :error-messages="((doc.type_name || doc.existing_file || (doc.file && doc.file.length)) && (!doc.type_name || doc.type_name.trim() === '')) ? 'Document name is required' : ''"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-btn
                      icon
                      color="error"
                      @click="removeDocument(index)"
                      :disabled="form.document_fields.length === 1 && !form.document_fields[0].existing_file && !form.document_fields[0].file.length"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-btn
                  color="primary"
                  variant="outlined"
                  class="mt-2"
                  :disabled="form.document_fields.length >= 10"
                  @click="addDocumentField"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Add Document
                </v-btn>
                <p v-if="documentsError" class="error-text mt-2">
                  {{ documentsError }}
                </p>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions class="action-container sticky-footer" v-if="!loading">
          <v-spacer></v-spacer>
          <v-btn
            class="action-btn cancel-btn"
            variant="outlined"
            @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            class="action-btn save-btn"
            color="primary"
            @click="updateEquipment"
            :loading="saving"
            :disabled="saving"
          >
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      top
      rounded="pill"
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
      required: true,
    },
    items: {
      type: Object,
      default: () => ({}),
    },
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
      maintenance_contract: [],
      annual_maintenance_contract: [],
      // For additional documents: Each object represents one document field
      // Added `hasNewFile` flag to indicate if a file was selected during this edit session
      document_fields: [{ id: null, file: [], type_name: '', existing_file: '', preview: '', original_name: '', hasNewFile: false }],
      existing_files: { // To store original URLs for direct attachment files
        invoice: '',
        installation_report: '',
        warranty_document: '',
        maintenance_contract: '',
        annual_maintenance_contract: '',
      },
    });

    // Preview state for direct attachment files
    const invoicePreview = ref('');
    const installationReportPreview = ref('');
    const warrantyDocumentPreview = ref('');
    const maintenanceContractPreview = ref('');
    const annualMaintenanceContractPreview = ref('');
    const documentsError = ref('');

    // UI state
    const loading = ref(true);
    const saving = ref(false);
    const snackbar = reactive({
      show: false,
      message: '',
      color: 'error',
    });
    const availSubCatList = ref([]);
    const availableEquiList = ref([]);

    // Computed properties
    const isAdmin = computed(() => {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.role?.[0] !== 'Engineer';
    });

    const isMobile = computed(() => store.state.isMobile || false);

    const clientList = computed(() => store.state.clients.clientList || []);
    const categoryList = computed(() => store.state.category.categoryList || []);
    const subcatList = computed(() => store.state.subCategory.subcatList || []);
    const allEquipments = computed(() => store.state.equipments.allEquipments || []);

    const statusOptions = computed(() => [
      { title: 'Active', value: 1 },
      { title: 'Blocked', value: 0 },
    ]);

    const show = computed({
      get: () => props.visible,
      set(value) {
        emit('update:visible', value);
        if (!value) {
          resetForm();
          emit('close');
        }
      },
    });

    // Validation rules
    const rules = {
      form: {
        client_id: { required },
        category_id: { required },
        sub_category_id: { required },
        equipment_id: { required },
        serial_no: { required },
        maintenance_period: { numeric, minValue: minValue(0) },
        installation_date: { required },
        last_maintenance_date: { required },
        warranty_date: { required },
        status: { required },
      },
    };

    const v$ = useVuelidate(rules, { form });

    // Methods
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          return dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
        }
        return date.toISOString().split('T')[0];
      } catch (error) {
        console.error('Date formatting error:', error);
        return dateStr;
      }
    };

    const isImage = (url) => {
      if (!url) return false;
      return /\.(jpg|jpeg|png|gif|webp|bmp|tiff)$/i.test(url);
    };

    const openFile = async (url, name = 'document') => {
      try {
        if (!url) {
          throw new Error('No document URL provided');
        }
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('File opening error:', error);
        showSnackbar('error', `Failed to open ${name}: ${error.message}`);
      }
    };

    const updatePreview = (field) => {
      const file = form[field]?.[0];
      if (file instanceof File) {
        const url = URL.createObjectURL(file);
        switch (field) {
          case 'invoice': invoicePreview.value = url; break;
          case 'installation_report': installationReportPreview.value = url; break;
          case 'warranty_document': warrantyDocumentPreview.value = url; break;
          case 'maintenance_contract': maintenanceContractPreview.value = url; break;
          case 'annual_maintenance_contract': annualMaintenanceContractPreview.value = url; break;
        }
      } else {
        switch (field) {
          case 'invoice': invoicePreview.value = form.existing_files.invoice || ''; form.invoice = []; break;
          case 'installation_report': installationReportPreview.value = form.existing_files.installation_report || ''; form.installation_report = []; break;
          case 'warranty_document': warrantyDocumentPreview.value = form.existing_files.warranty_document || ''; form.warranty_document = []; break;
          case 'maintenance_contract': maintenanceContractPreview.value = form.existing_files.maintenance_contract || ''; form.maintenance_contract = []; break;
          case 'annual_maintenance_contract': annualMaintenanceContractPreview.value = form.existing_files.annual_maintenance_contract || ''; form.annual_maintenance_contract = []; break;
        }
      }
    };

    const updateDocumentPreview = (index) => {
      const docField = form.document_fields[index];
      const file = docField.file?.[0];

      if (file instanceof File) {
        docField.preview = URL.createObjectURL(file);
        docField.original_name = file.name;
        docField.existing_file = '';
        docField.hasNewFile = true;
      } else {
        docField.preview = docField.existing_file || '';
        docField.file = [];
        docField.original_name = docField.type_name || '';
        docField.hasNewFile = false;
      }
    };

    const clearPreview = (field) => {
      switch (field) {
        case 'invoice':
          invoicePreview.value = '';
          form.invoice = [];
          form.existing_files.invoice = '';
          break;
        case 'installation_report':
          installationReportPreview.value = '';
          form.installation_report = [];
          form.existing_files.installation_report = '';
          break;
        case 'warranty_document':
          warrantyDocumentPreview.value = '';
          form.warranty_document = [];
          form.existing_files.warranty_document = '';
          break;
        case 'maintenance_contract':
          maintenanceContractPreview.value = '';
          form.maintenance_contract = [];
          form.existing_files.maintenance_contract = '';
          break;
        case 'annual_maintenance_contract':
          annualMaintenanceContractPreview.value = '';
          form.annual_maintenance_contract = [];
          form.existing_files.annual_maintenance_contract = '';
          break;
      }
    };

    const clearDocumentPreview = (index) => {
      form.document_fields.splice(index, 1);
      if (form.document_fields.length === 0) {
        addDocumentField();
      }
      showSnackbar('info', 'Document removed locally. Save to apply changes.');
      documentsError.value = '';
    };

    const loadEquipmentData = async () => {
      loading.value = true;
      try {
        const query = { size: 1000 };
        await Promise.all([
          store.dispatch('clients/GET_CLIENT_LIST', query),
          store.dispatch('category/GET_ALL_CATEGORY', query),
          store.dispatch('subCategory/GET_ALL_SUBCATEGORY', query),
          store.dispatch('equipments/GET_ALL_EQUIPMENT', query),
        ]);

        const equipmentData = await store.dispatch('salesEquipment/GET_SALE_EQUIPMENT_BY_ID', props.items.id);
        console.log('Fetched equipmentData for edit:', equipmentData);

        resetForm();

        form.id = equipmentData.id || null;
        form.client_id = equipmentData.client?.id || equipmentData.clientId || null;
        form.category_id = equipmentData.equipment?.subcategory?.category?.id || equipmentData.equipment?.subcategory?.categoryId || null;
        form.sub_category_id = equipmentData.equipment?.subcategory?.id || equipmentData.equipment?.subcategoryId || null;
        form.equipment_id = equipmentData.equipment?.id || equipmentData.equipmentId || null;
        form.serial_no = equipmentData.serialNo || '';
        form.maintenance_period = equipmentData.prevdays ? String(equipmentData.prevdays) : equipmentData.maintenancePeriod ? String(equipmentData.maintenancePeriod) : '';
        form.installation_date = formatDate(equipmentData.installationDate);
        form.last_maintenance_date = formatDate(equipmentData.LastMaintenanceDate || equipmentData.lastMaintenanceDate);
        form.warranty_date = formatDate(equipmentData.warrantyDate);
        form.status = equipmentData.status != null ? Number(equipmentData.status) : 1;

        form.existing_files.invoice = equipmentData.invoice || '';
        invoicePreview.value = form.existing_files.invoice;
        form.existing_files.installation_report = equipmentData.installationReport || '';
        installationReportPreview.value = form.existing_files.installation_report;
        form.existing_files.warranty_document = equipmentData.warrantyDocument || '';
        warrantyDocumentPreview.value = form.existing_files.warranty_document;
        form.existing_files.maintenance_contract = equipmentData.maintenanceContract || '';
        maintenanceContractPreview.value = form.existing_files.maintenance_contract;
        form.existing_files.annual_maintenance_contract = equipmentData.annualMaintenanceContract || '';
        annualMaintenanceContractPreview.value = form.existing_files.annual_maintenance_contract;

        let documents = [];
        if (equipmentData.documents) {
            if (typeof equipmentData.documents === 'string') {
                try {
                    documents = JSON.parse(equipmentData.documents);
                    if (!Array.isArray(documents)) {
                        console.warn('Parsed documents is not an array:', documents);
                        documents = [];
                    }
                } catch (error) {
                    console.error('Error parsing documents from fetched data:', error);
                    documents = [];
                }
            } else if (Array.isArray(equipmentData.documents)) {
                documents = equipmentData.documents;
            }
        }
        
        if (documents.length > 0) {
            form.document_fields = documents.map((doc) => ({
                id: doc.id || null,
                file: [],
                type_name: doc.name || '',
                existing_file: doc.url || '',
                preview: doc.url || '',
                original_name: doc.name || '',
                hasNewFile: false
            }));
        } else {
            form.document_fields = [{ id: null, file: [], type_name: '', existing_file: '', preview: '', original_name: '', hasNewFile: false }];
        }

        await updateSubCategoryList();
        await updateEquipmentList();

        console.log('Loaded form data after fetch:', form);
        loading.value = false;
      } catch (error) {
        console.error('Error loading equipment data:', error);
        showSnackbar('error', 'Failed to load equipment data. ' + (error.message || ''));
        loading.value = false;
        closeDialog();
      }
    };

    const updateSubCategoryList = async () => {
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
        await updateEquipmentList();
      }
    };

    const updateEquipmentList = async () => {
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
        const newId = `new_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        form.document_fields.push({ id: newId, file: [], type_name: '', existing_file: '', preview: '', original_name: '', hasNewFile: false });
        documentsError.value = '';
      } else {
        documentsError.value = 'Maximum 10 documents allowed';
        showSnackbar('error', 'Maximum 10 documents allowed');
      }
    };

    const removeDocument = (index) => {
        form.document_fields.splice(index, 1);
        if (form.document_fields.length === 0) {
            addDocumentField();
        }
        showSnackbar('info', 'Document field removed locally. Save to apply changes.');
        documentsError.value = '';
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
      form.maintenance_contract = [];
      form.annual_maintenance_contract = [];
      form.document_fields = [{ id: null, file: [], type_name: '', existing_file: '', preview: '', original_name: '', hasNewFile: false }];
      form.existing_files = {
        invoice: '',
        installation_report: '',
        warranty_document: '',
        maintenance_contract: '',
        annual_maintenance_contract: '',
      };
      invoicePreview.value = '';
      installationReportPreview.value = '';
      warrantyDocumentPreview.value = '';
      maintenanceContractPreview.value = '';
      annualMaintenanceContractPreview.value = '';
      availSubCatList.value = [];
      availableEquiList.value = [];
      documentsError.value = '';
      v$.value.$reset();
    };

    const updateEquipment = async () => {
      v$.value.$validate();
      if (v$.value.$invalid) {
        showSnackbar('error', 'Please fix validation errors');
        return;
      }

      for (const doc of form.document_fields) {
        if ((doc.file.length > 0 || doc.existing_file || doc.type_name.trim() !== '') && (!doc.type_name || doc.type_name.trim() === '')) {
          documentsError.value = 'All additional documents must have a name if a file is present or a name is entered.';
          showSnackbar('error', documentsError.value);
          return;
        }
      }
      if (form.document_fields.length > 10) {
        documentsError.value = 'Maximum 10 additional documents allowed';
        showSnackbar('error', documentsError.value);
        return;
      }
      documentsError.value = '';

      const dates = [form.installation_date, form.last_maintenance_date, form.warranty_date];
      for (const date of dates) {
        if (date && isNaN(new Date(date).getTime())) {
          showSnackbar('error', 'Invalid date format for one of the dates.');
          return;
        }
      }

      if (form.maintenance_period && (isNaN(Number(form.maintenance_period)) || Number(form.maintenance_period) < 0)) {
        showSnackbar('error', 'Maintenance period must be a non-negative number');
        return;
      }

      if (form.client_id !== null && !clientList.value.some(client => client.id === form.client_id)) {
        showSnackbar('error', 'Invalid Client selected. Please choose from the list.');
        return;
      }
      if (form.equipment_id !== null && !availableEquiList.value.some(equip => equip.id === form.equipment_id)) {
        showSnackbar('error', 'Invalid Equipment selected. Please choose from the list.');
        return;
      }

      saving.value = true;
      try {
        const filesToUpload = [];
        const documentMetadata = [];

        form.document_fields.forEach(doc => {
          if (doc.type_name.trim() !== '' || doc.file.length > 0 || doc.existing_file) {
            if (doc.hasNewFile && doc.file.length > 0) {
              filesToUpload.push(doc.file[0]);
              documentMetadata.push({
                name: doc.type_name,
                newFileIndex: filesToUpload.length - 1
              });
            } else if (doc.existing_file && doc.existing_file.trim() !== '') {
              documentMetadata.push({
                id: doc.id,
                name: doc.type_name,
                url: doc.existing_file
              });
            }
          }
        });

        const formData = new FormData();

        formData.append('id', form.id);
        formData.append('clientId', form.client_id || '');
        formData.append('equipmentId', form.equipment_id || '');
        formData.append('serialNo', form.serial_no || '');
        formData.append('maintenancePeriod', form.maintenance_period || '');
        formData.append('installationDate', form.installation_date || '');
        formData.append('lastMaintenanceDate', form.last_maintenance_date || '');
        formData.append('warrantyDate', form.warranty_date || '');
        formData.append('status', form.status !== undefined ? form.status : '');

        if (form.invoice.length > 0) {
          formData.append('invoice', form.invoice[0]);
        } else if (form.existing_files.invoice === '') {
          formData.append('invoice', '');
        }
        if (form.installation_report.length > 0) {
          formData.append('installationReport', form.installation_report[0]);
        } else if (form.existing_files.installation_report === '') {
          formData.append('installationReport', '');
        }
        if (form.warranty_document.length > 0) {
          formData.append('warrantyDocument', form.warranty_document[0]);
        } else if (form.existing_files.warranty_document === '') {
          formData.append('warrantyDocument', '');
        }
        if (form.maintenance_contract.length > 0) {
          formData.append('maintenanceContract', form.maintenance_contract[0]);
        } else if (form.existing_files.maintenance_contract === '') {
          formData.append('maintenanceContract', '');
        }
        if (form.annual_maintenance_contract.length > 0) {
          formData.append('annualMaintenanceContract', form.annual_maintenance_contract[0]);
        } else if (form.existing_files.annual_maintenance_contract === '') {
          formData.append('annualMaintenanceContract', '');
        }

        filesToUpload.forEach((file, index) => {
          formData.append(`documents`, file);
        });
        
        formData.append('documentMetadata', JSON.stringify(documentMetadata));

        console.log('Submitting FormData from component:', formData);

        const response = await store.dispatch('salesEquipment/UPDATE_SALE_EQUIPMENT', {
          id: form.id,
          formData: formData
        });

        if (response.response === 'success') {
          showSnackbar('success', 'Equipment updated successfully');
          // **Crucially, emit the save event here to trigger parent refresh**
          
          emit('save', response.data); 
          closeDialog();
          window.location.reload(); // Add this line to reload the window
        } else {
          showSnackbar('error', response.message || 'Failed to update equipment');
        }
      } catch (error) {
        console.error('Error updating equipment:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Failed to update equipment';
        let userFriendlyMessage = errorMsg;
        if (errorMsg.includes('foreign key constraint fails')) {
          userFriendlyMessage = 'Invalid Equipment or Client selected. Please check your selections.';
        }
        showSnackbar('error', userFriendlyMessage);
      } finally {
        saving.value = false;
      }
    };

    watch(() => props.items, (newVal) => {
      if (props.visible && newVal && newVal.id) {
        loadEquipmentData();
      }
    }, { immediate: true });

    watch(() => props.visible, (newVal) => {
      if (newVal && props.items.id) {
        loadEquipmentData();
      } else if (!newVal) {
        resetForm();
      }
    });

    const initialGlobalDataFetch = async () => {
      const query = { size: 1000 };
      try {
        await Promise.all([
          store.dispatch('clients/GET_CLIENT_LIST', query),
          store.dispatch('category/GET_ALL_CATEGORY', query),
          store.dispatch('subCategory/GET_ALL_SUBCATEGORY', query),
          store.dispatch('equipments/GET_ALL_EQUIPMENT', query),
        ]);
      } catch (error) {
        console.error('Error fetching initial global data for dropdowns:', error);
      }
    };
    initialGlobalDataFetch();

    return {
      form,
      invoicePreview,
      installationReportPreview,
      warrantyDocumentPreview,
      maintenanceContractPreview,
      annualMaintenanceContractPreview,
      documentsError,
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
      updateEquipmentList,
    };
  },
};
</script>

<style scoped>
/* Add your styles here */
.dialog-card {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
}

.dialog-title {
  background-color: #f5f5f5;
  padding: 16px 24px;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
}

.close-btn {
  background-color: transparent;
  box-shadow: none;
}

.close-btn .v-icon {
  color: #666;
}

.form-container {
  padding: 24px;
  background-color: #fdfdfd;
}

.custom-field .v-input__control {
  border-radius: 8px;
}

.custom-field .v-field--outlined {
  border-color: #ddd;
}

.custom-field .v-label {
  color: #555;
}

.custom-field .v-input__prepend-inner .v-icon {
  color: #666;
}

.section-label {
  font-size: 1rem;
  font-weight: 600;
  color: #444;
  margin-bottom: 12px;
  display: block;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
  margin-top: 20px;
}

.preview-container {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  position: relative;
  border: 1px dashed #ccc;
  padding: 8px;
  border-radius: 8px;
  background-color: #f9f9f9;
  max-width: 150px; /* Adjust as needed */
}

.preview-image {
  border-radius: 4px;
  margin-right: 8px;
  flex-shrink: 0;
}

.pdf-icon {
  margin-right: 8px;
  cursor: pointer;
  flex-shrink: 0;
}

.remove-preview {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 5;
  width: 24px;
  height: 24px;
}

.remove-preview .v-icon {
  font-size: 14px;
  color: #777;
}

.action-container {
  padding: 16px 24px;
  background-color: #f5f5f5;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.action-btn {
  min-width: 100px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  text-transform: capitalize;
}

.cancel-btn {
  color: #555;
  border-color: #ccc;
  margin-right: 8px;
}

.save-btn {
  background-color: #1976d2; /* Vuetify primary color */
  color: #fff;
}

.error-text {
  color: #ff5252;
  font-size: 0.875rem;
  margin-top: 4px;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .dialog-title {
    padding: 12px 16px;
    font-size: 1.1rem;
  }

  .form-container {
    padding: 16px;
  }

  .action-container {
    padding: 12px 16px;
  }

  .action-btn {
    min-width: 80px;
    padding: 6px 12px;
  }
}
</style>





<style scoped>
/* Add your existing styles here */
.dialog-card {
  display: flex;
  flex-direction: column;
  max-height: 90vh; /* Adjust as needed */
}

.dialog-title {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--v-card-background); /* Or specific color */
  padding-bottom: 16px; /* Add some padding */
  border-bottom: 1px solid #eee; /* Optional border */
}

.form-container {
  flex-grow: 1;
  overflow-y: auto; /* Enable scrolling for the form content */
  padding: 24px;
}

.action-container {
  position: sticky;
  bottom: 0;
  z-index: 10;
  background-color: var(--v-card-background); /* Or specific color */
  padding-top: 16px; /* Add some padding */
  border-top: 1px solid #eee; /* Optional border */
}

.custom-field .v-input__control {
  border-radius: 8px; /* Example: more rounded corners */
}

.section-label {
  font-size: 1.1em;
  font-weight: bold;
  margin-bottom: 10px;
  display: block;
  color: #3f51b5; /* Primary color */
}

.preview-container {
  position: relative;
  width: 120px; /* Same as max-width/height of v-img */
  height: 120px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #f5f5f5;
}

.preview-image {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.pdf-icon {
  cursor: pointer;
}

.remove-preview {
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  padding: 2px;
  height: 24px;
  width: 24px;
  font-size: 16px !important;
}

.error-text {
  color: #ef5350; /* Red color for errors */
  font-size: 0.875rem;
}
</style>



<style scoped>
:root {
  --primary-color: #7b1fa2;
  --background-color: #ffffff;
  --header-bg: #f5f5f5;
  --error-color: #d32f2f;
  --text-color: #333333;
  --border-radius: 8px;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dialog-card {
  border-radius: var(--border-radius);
  background-color: #ffffff;
  transition: all 0.3s ease;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: var(--header-bg);
  padding: 16px;
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--text-color);
  border-bottom: 1px solid #e0e0e0;
}

.form-container {
  padding: 24px;
}

.section-label {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 12px;
  display: block;
}

.custom-field {
  margin-bottom: 16px;
  transition: all 0.2s ease;
}

.custom-field:hover {
  transform: translateY(-2px);
}

.preview-container {
  position: relative;
  display: inline-block;
  margin-bottom: 12px;
}

.preview-image {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  transition: transform 0.2s ease;
}

.preview-image:hover {
  transform: scale(1.05);
}

.pdf-icon {
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
}

.pdf-icon:hover {
  color: #5c1477; /* Darken primary color */
  transform: scale(1.1); /* Slight enlarge on hover */
}

.remove-preview {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: var(--background-color);
  border-radius: 50%;
  box-shadow: var(--shadow);
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.remove-preview:hover {
  background-color: #e0e0e0; /* A bit darker grey on hover */
  transform: scale(1.1); /* Slight enlarge on hover */
}

/* Enhancements for prepend-inner-icons in text/select fields */
/* Target the internal v-icon within v-text-field/v-select */
.v-input--density-compact .v-input__prepend-inner .v-icon {
  font-size: 20px; /* Adjust size if needed for consistency */
  color: #9e9e9e; /* A subtle grey for inner icons */
  transition: color 0.2s ease;
}

.custom-field:hover .v-input--density-compact .v-input__prepend-inner .v-icon {
  color: var(--primary-color); /* Highlight on field hover */
}

/* Style for the add document button icon */
.v-btn .v-icon.mdi-plus {
  margin-right: 4px; /* Space between icon and text */
  transition: transform 0.2s ease;
}

.v-btn:hover .v-icon.mdi-plus {
  transform: rotate(90deg); /* Spin effect on hover */
}

/* Style for the delete document button icon */
.v-btn .v-icon.mdi-delete {
  transition: color 0.2s ease, transform 0.2s ease;
}

/* More specific selector for the delete button icon if it's text-error */
.v-btn.text-error .v-icon.mdi-delete:hover {
  color: #ff5252 !important; /* Darker red on hover, !important to override Vuetify's color prop */
  transform: scale(1.2); /* Pop effect */
}


.error-text {
  color: var(--error-color);
  font-size: 0.75rem;
  margin-top: 4px;
}

.action-container {
  position: sticky;
  bottom: 0;
  z-index: 1;
  padding: 16px;
  background-color: var(--header-bg);
  border-top: 1px solid #e0e0e0;
}

.action-btn {
  text-transform: none;
  font-weight: 500;
  border-radius: 4px;
  padding: 8px 16px;
  transition: all 0.2s ease;
}

.cancel-btn {
  color: var(--text-color);
  border-color: #e0e0e0;
}

.cancel-btn:hover {
  background-color: #f5f5f5;
}

.save-btn {
  color: #ffffff;
  background-color: var(--primary-color);
}

.save-btn:hover {
  background-color: #5c1477; /* Darken primary color */
}

@media (max-width: 600px) {
  .dialog-card {
    height: 100vh;
  }

  .form-container {
    padding: 16px;
  }

  .section-label {
    font-size: 1rem;
  }

  .custom-field {
    margin-bottom: 12px;
  }

  .action-container {
    padding: 12px;
  }

  .action-btn {
    padding: 6px 12px;
    font-size: 0.875rem;
  }
}
</style>