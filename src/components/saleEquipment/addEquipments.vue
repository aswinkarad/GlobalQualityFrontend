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
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model:search="search"
                  v-model="selcetdClient" clearable :items="clientList" item-title="name" item-value="id" label="Client"
                  class="custom-field"></v-autocomplete>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="selcetdCategory" clearable
                  :items="categoryList" item-title="categoryName" item-value="id" label="Category"
                  class="custom-field"></v-autocomplete>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="selcetdSubCategory"
                  clearable :items="availSubCatList" item-title="subcategoryName" item-value="id" label="Sub Category"
                  class="custom-field"></v-autocomplete>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="selcetedEquipment"
                  clearable :items="availableEquilist" item-title="equipmentName" item-value="id" label="Equipment"
                  class="custom-field"></v-autocomplete>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-text-field color="#7b1fa2" label="Maintenance Period" density="compact" v-model="MaintenancePeriod"
                  variant="outlined" class="custom-field" type="number" min="0"></v-text-field>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-text-field color="#7b1fa2" label="Serial No" density="compact" v-model="serialNo" variant="outlined"
                  class="custom-field"></v-text-field>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-text-field color="#7b1fa2" label="Installation Date" type="date" density="compact"
                  v-model="InstallationDate" variant="outlined" class="custom-field"></v-text-field>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-text-field color="#7b1fa2" label="Last Maintenance Date" type="date" density="compact"
                  v-model="lastMainDate" variant="outlined" class="custom-field"></v-text-field>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-text-field color="#7b1fa2" label="Warranty Expiry Date" type="date" density="compact"
                  v-model="WarrantyDate" variant="outlined" class="custom-field"></v-text-field>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-file-input color="#7b1fa2" density="compact" clearable variant="outlined" v-model="invoice" show-size
                  label="Invoice" class="custom-field" accept=".pdf,.jpg,.png"></v-file-input>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-file-input color="#7b1fa2" density="compact" clearable variant="outlined" v-model="amc" show-size
                  label="AMC Document" class="custom-field" accept=".pdf,.jpg,.png"></v-file-input>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-file-input color="#7b1fa2" density="compact" clearable variant="outlined"
                  v-model="installationReport" show-size label="Installation Report" class="custom-field"
                  accept=".pdf,.jpg,.png"></v-file-input>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-file-input color="#7b1fa2" density="compact" clearable variant="outlined" v-model="warranty"
                  show-size label="Warranty Document" class="custom-field" accept=".pdf,.jpg,.png"></v-file-input>
              </v-col>
              <v-col cols="12" :sm="isMobile ? 12 : 4">
                <v-file-input color="#7b1fa2" density="compact" clearable variant="outlined" v-model="maintenance"
                  show-size label="Maintenance Contract" class="custom-field" accept=".pdf,.jpg,.png"></v-file-input>
              </v-col>

              <v-col cols="12">
                <v-label class="mb-2">Additional Documents (up to 10)</v-label>
                <v-row v-for="(doc, index) in allDocumentFields" :key="doc.id || `doc-${index}`" dense
                  class="align-center">
                  <v-col cols="12" :sm="isMobile ? 12 : 5">
                    <v-file-input color="#7b1fa2" prepend-inner-icon="mdi-file-pdf-box" density="compact" clearable
                      variant="outlined" v-model="doc.file" show-size :label="`Document ${index + 1}`"
                      class="custom-field" accept=".pdf,.jpg,.png"></v-file-input>
                  </v-col>
                  <v-col cols="12" :sm="isMobile ? 12 : 5">
                    <v-text-field :label="`Document ${index + 1} Name`" density="compact" v-model="doc.typeName"
                      variant="outlined" class="custom-field" prepend-inner-icon="mdi-file-text-outline"
                      :placeholder="`Document ${index + 1}`"></v-text-field>
                  </v-col>
                  <v-col cols="12" :sm="isMobile ? 12 : 2">
                    <v-btn icon @click="removeAdditionalDocument(index, doc.isExisting)"
                      :disabled="allDocumentFields.length === 1 && !editMode">
                      <v-icon background-color="white" color="red">mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-btn class="mt-2" :disabled="allDocumentFields.length >= 10" @click="addAdditionalDocumentField">
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
          <v-btn class="action-btn save-btn" @click="saveSale">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="5000" top>
      {{ snackbarMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'AddEquipment',
  props: {
    visible: {
      type: Boolean,
    },
    title: {
      type: String,
    },
    saleId: {
      type: [Number, String],
      default: null,
    },
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

      // Combined document management: 
      // 'file' for new uploads, 'url' for existing URLs, 'typeName' for name, 'originalName' for tracking changes
      // 'isExisting' to differentiate between initially loaded and newly added fields
      allDocumentFields: [{ file: [], typeName: '', url: '', originalName: '', isExisting: false }],

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
      status: 1,
      editMode: false,
      dataLoaded: false,
    };
  },
  watch: {
    search(val) {
      this.GET_CLIENT_LIST({ name: val });
    },
    InstallationDate(val) {
      this.lastMainDate = val;
    },
    selcetdCategory(val) {
      this.getSubcatList();
      if (!val) {
        this.selcetdSubCategory = '';
        this.selcetedEquipment = '';
      }
    },
    selcetdSubCategory(val) {
      this.getEquiList();
      if (!val) {
        this.selcetedEquipment = '';
      }
    },
    saleId: {
      immediate: true,
      async handler(newVal) {
        if (newVal) {
          this.editMode = true;
          await this.loadSaleData(newVal);
        } else {
          this.editMode = false;
          this.resetForm();
        }
      },
    },
  },
  computed: {
    ...mapState('clients', ['clientList']),
    ...mapState('category', ['categoryList']),
    ...mapState('subCategory', ['subcatList']),
    ...mapState('equipments', ['allEquipments']),
    ...mapState('salesEquipment', ['editValue']),
    isMobile() {
      return this.$vuetify.display.smAndDown;
    },
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.resetForm();
          this.$emit('close');
        }
      },
    },
  },
  methods: {
    ...mapActions('clients', [
      'GET_CLIENT_LIST',
      // 'ADD_CLIENT', // Not used in this component, but left for completeness if copy-pasted
      // 'DELETE_CLIENT', // Not used
      // 'GET_CLIENT_BY_ID', // Not used
      // 'UPDATE_CLIENT', // Not used
    ]),
    ...mapActions('category', [
      'GET_ALL_CATEGORY',
      // 'ADD_CATEGORY', // Not used
      // 'UPDATE_CATEGORY', // Not used
      // 'DELETE_CATEGORY', // Not used
    ]),
    ...mapActions('subCategory', ['GET_SUB_CATEGORY', 'GET_ALL_SUBCATEGORY']),
    ...mapActions('equipments', ['GET_EQUIPMENT', 'GET_ALL_EQUIPMENT']),
    ...mapActions('salesEquipment', [
      'ADD_SALE_EQUIPMENT',
      'UPDATE_SALE_EQUIPMENT',
      'GET_SALE_EQUIPMENT_BY_ID',
      'MANAGE_SALE_DOCUMENT',
    ]),
    async loadSaleData(saleId) {
      try {
        await this.ensureDataLoaded();
        const sale = await this.GET_SALE_EQUIPMENT_BY_ID(saleId);
        if (sale) {
          this.serialNo = sale.serialNo || '';
          this.MaintenancePeriod = sale.prevdays || '';
          this.selcetdClient = sale.clientId || '';
          this.selcetedEquipment = sale.equipmentId || '';
          this.InstallationDate = sale.installationDate || '';
          this.WarrantyDate = sale.warrantyDate || '';
          this.lastMainDate = sale.LastMaintenanceDate || '';
          this.status = sale.status !== undefined ? sale.status : 1;

          // Populate direct attachment fields
          this.invoice = sale.invoice ? [{ name: 'invoice', url: sale.invoice, file: [] }] : [];
          this.amc = sale.annualMaintenanceContract ? [{ name: 'amc', url: sale.annualMaintenanceContract, file: [] }] : [];
          this.installationReport = sale.installationReport ? [{ name: 'installationReport', url: sale.installationReport, file: [] }] : [];
          this.warranty = sale.warrantyDocument ? [{ name: 'warranty', url: sale.warrantyDocument, file: [] }] : [];
          this.maintenance = sale.maintenanceContract ? [{ name: 'maintenance', url: sale.maintenanceContract, file: [] }] : [];


          // Handle additional documents
          let parsedDocuments = [];
          if (sale.documents) {
            if (typeof sale.documents === 'string') {
              try {
                parsedDocuments = JSON.parse(sale.documents);
                if (!Array.isArray(parsedDocuments)) {
                  console.warn('Parsed sale.documents is not an array:', parsedDocuments);
                  parsedDocuments = [];
                }
              } catch (error) {
                console.error('Error parsing documents from fetched data in AddEquipment:', error);
                parsedDocuments = [];
              }
            } else if (Array.isArray(sale.documents)) {
              parsedDocuments = sale.documents;
            }
          }

          this.allDocumentFields = parsedDocuments.map(doc => ({
            file: [], // No file selected initially
            typeName: doc.name || '',
            url: doc.url || '', // Store the existing URL
            originalName: doc.name || '', // Store original name for tracking changes
            isExisting: true // Mark as an existing document
          }));
          // Ensure there's at least one empty field for new additions if no existing docs or if not enough.
          if (this.allDocumentFields.length === 0) {
            this.allDocumentFields.push({ file: [], typeName: '', url: '', originalName: '', isExisting: false });
          }


          this.selcetdCategory = sale.equipment?.subcategory?.categoryId || '';
          if (this.selcetdCategory) {
            await this.$nextTick();
            this.getSubcatList();
            this.selcetdSubCategory = sale.equipment?.subcategoryId || '';
            if (this.selcetdSubCategory) {
              await this.$nextTick();
              this.getEquiList();
            }
          }
        }
      } catch (error) {
        console.error('Error loading sale data:', error);
        this.showSnackbar('Failed to load sale data', 'error');
      }
    },
    async ensureDataLoaded() {
      if (!this.dataLoaded) {
        const query = { size: 150 };
        await Promise.all([
          this.GET_CLIENT_LIST(query),
          this.GET_ALL_CATEGORY(query),
          this.GET_ALL_SUBCATEGORY(query),
          this.GET_ALL_EQUIPMENT(),
        ]);
        this.dataLoaded = true;
      }
    },
    getSubcatList() {
      this.availSubCatList = [];
      this.selcetdSubCategory = '';
      if (!this.selcetdCategory) {
        this.availSubCatList = this.subcatList;
      } else {
        const list = this.$store.getters['subCategory/get_all_sub_cat_with_cat_id'](
          this.selcetdCategory
        );
        this.availSubCatList = list || [];
      }
    },
    getEquiList() {
      this.availableEquilist = [];
      this.selcetedEquipment = '';
      if (!this.selcetdSubCategory) {
        this.availableEquilist = this.allEquipments;
      } else {
        const list = this.$store.getters['equipments/get_all_equipment_with_sub_catId'](
          this.selcetdSubCategory
        );
        this.availableEquilist = list || [];
      }
    },
    addAdditionalDocumentField() {
      if (this.allDocumentFields.length < 10) {
        this.allDocumentFields.push({ file: [], typeName: '', url: '', originalName: '', isExisting: false });
        this.documentsError = '';
      } else {
        this.documentsError = 'Maximum 10 documents allowed';
        this.showSnackbar('Maximum 10 documents allowed', 'error');
      }
    },
    async removeAdditionalDocument(index, isExisting) {
      if (this.allDocumentFields.length === 1 && !isExisting) {
        this.showSnackbar('Cannot remove the last empty document field.', 'info');
        return;
      }

      const docToRemove = this.allDocumentFields[index];
      if (isExisting && docToRemove.url) { // If it's an existing document with a URL, attempt to delete from server
        try {
          const response = await this.MANAGE_SALE_DOCUMENT({
            saleId: this.saleId,
            action: 'delete',
            index: index, // Backend should use this index to target the specific document
            name: docToRemove.typeName // Optional, for logging
          });
          if (response.response === 'success') {
            this.showSnackbar('Document deleted successfully', 'success');
            this.allDocumentFields.splice(index, 1);
          } else {
            this.showSnackbar(response.message || 'Failed to delete document from server', 'error');
          }
        } catch (error) {
          console.error('Error deleting document:', error);
          this.showSnackbar(error.message || 'Failed to delete document', 'error');
        }
      } else {
        // If it's a new, unsaved field, or an existing one without a URL, just remove locally
        this.allDocumentFields.splice(index, 1);
        this.showSnackbar('Document field removed locally.', 'info');
      }
      this.documentsError = '';
    },
    showSnackbar(message, color = 'error') {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbar = true;
    },
    async saveSale() {
      // Input Validation
      if (!this.selcetedEquipment) {
        this.showSnackbar('Please select an equipment', 'error');
        return;
      }
      if (!this.availableEquilist.some(equip => equip.id === this.selcetedEquipment)) {
        this.showSnackbar('Invalid Equipment selected', 'error');
        return;
      }
      if (!this.selcetdClient) {
        this.showSnackbar('Please select a client', 'error');
        return;
      }
      if (!this.clientList.some(client => client.id === this.selcetdClient)) {
        this.showSnackbar('Invalid Client selected', 'error');
        return;
      }

      // Validate additional document names
      for (const doc of this.allDocumentFields) {
        if ((doc.file.length > 0 || doc.url) && (!doc.typeName || doc.typeName.trim() === '')) {
          this.documentsError = 'All additional documents must have a name.';
          this.showSnackbar(this.documentsError, 'error');
          return;
        }
      }
      if (this.allDocumentFields.length > 10) {
        this.documentsError = 'Maximum 10 additional documents allowed';
        this.showSnackbar(this.documentsError, 'error');
        return;
      }
      this.documentsError = ''; // Clear error if all good

      try {
        let response;
        if (this.editMode) {
          // --- For Edit Mode (UPDATE) ---
          // Step 1: Process additional documents (add/edit) via MANAGE_SALE_DOCUMENT
          const finalAdditionalDocuments = []; // To build the final array for the main update payload

          for (let i = 0; i < this.allDocumentFields.length; i++) {
            const doc = this.allDocumentFields[i];

            if (doc.file.length > 0 && doc.file[0] instanceof File) {
              // New file uploaded or existing file replaced
              const action = doc.isExisting ? 'edit' : 'add';
              const manageDocResponse = await this.MANAGE_SALE_DOCUMENT({
                saleId: this.saleId,
                action: action,
                index: i, // Send index to backend for targeted update/add
                name: doc.typeName,
                document: doc.file[0],
              });

              if (manageDocResponse.response === 'success') {
                finalAdditionalDocuments.push({ name: doc.typeName, url: manageDocResponse.url });
              } else {
                throw new Error(manageDocResponse.message || `Failed to ${action} document: ${doc.typeName}`);
              }
            } else if (doc.url && doc.typeName !== doc.originalName) {
              // Existing document with name change but no new file
              const manageDocResponse = await this.MANAGE_SALE_DOCUMENT({
                saleId: this.saleId,
                action: 'edit',
                index: i,
                name: doc.typeName,
                document: null, // No new file
              });
              if (manageDocResponse.response === 'success') {
                finalAdditionalDocuments.push({ name: doc.typeName, url: doc.url }); // Keep original URL
              } else {
                throw new Error(manageDocResponse.message || `Failed to update document name: ${doc.typeName}`);
              }
            } else if (doc.url) {
              // Existing document with no changes to file or name, just include its metadata
              finalAdditionalDocuments.push({ name: doc.typeName, url: doc.url });
            }
            // Documents that were locally removed (or had no file/url/name) are skipped.
          }

          // Step 2: Prepare main payload for UPDATE_SALE_EQUIPMENT
          const mainPayload = {
            id: this.saleId,
            serialNo: this.serialNo,
            equipmentId: this.selcetedEquipment,
            clientId: this.selcetdClient,
            maintenancePeriod: this.MaintenancePeriod,
            installationDate: this.InstallationDate,
            warrantyDate: this.WarrantyDate,
            lastMaintenanceDate: this.lastMainDate,
            status: this.status,

            // Direct attachments (pass the File object if selected, otherwise null)
            invoice: this.invoice.length > 0 ? this.invoice[0] : null,
            installationReport: this.installationReport.length > 0 ? this.installationReport[0] : null,
            warrantyDocument: this.warranty.length > 0 ? this.warranty[0] : null,
            maintenanceContract: this.maintenance.length > 0 ? this.maintenance[0] : null,
            annualMaintenanceContract: this.amc.length > 0 ? this.amc[0] : null,

            // Send the finalized additional documents array as a JSON string
            documents: JSON.stringify(finalAdditionalDocuments),
          };

          response = await this.UPDATE_SALE_EQUIPMENT(mainPayload);

        } else {
          // --- For Add Mode (ADD) ---
          // Prepare new additional documents for initial upload
          const documentsToUpload = this.allDocumentFields
            .filter(doc => doc.file.length > 0 && doc.typeName.trim() !== '')
            .map(doc => doc.file[0]);
          const typeNamesForUpload = this.allDocumentFields
            .filter(doc => doc.file.length > 0 && doc.typeName.trim() !== '')
            .map(doc => doc.typeName);

          const payload = {
            serialNo: this.serialNo,
            equipmentId: this.selcetedEquipment,
            clientId: this.selcetdClient,
            maintenancePeriod: this.MaintenancePeriod,
            installationDate: this.InstallationDate,
            warrantyDate: this.WarrantyDate,
            lastMaintenanceDate: this.lastMainDate,

            invoice: this.invoice.length > 0 ? this.invoice[0] : null,
            installationReport: this.installationReport.length > 0 ? this.installationReport[0] : null,
            warrantyDocument: this.warranty.length > 0 ? this.warranty[0] : null,
            maintenanceContract: this.maintenance.length > 0 ? this.maintenance[0] : null,
            annualMaintenanceContract: this.amc.length > 0 ? this.amc[0] : null,

            documents: documentsToUpload, // Array of File objects
            typeNames: typeNamesForUpload, // Array of names
            purchaseDate: '', // Assuming this is not collected
            status: this.status,
          };
          response = await this.ADD_SALE_EQUIPMENT(payload);
        }

        if (response.response === 'success') {
          this.$emit('success', { message: this.editMode ? 'Sale updated successfully' : 'Sale added successfully' });
          this.showSnackbar(this.editMode ? 'Sale updated successfully' : 'Sale added successfully', 'success');
          this.resetForm();
          this.show = false;
          window.location.reload(); // <--- Added this line
          // Emit a custom event to signal the parent to refresh data
          this.$emit('refreshData');
        } else {
          const errorMessage = response.message || 'Failed to save sale';
          this.showSnackbar(errorMessage, 'error');
          this.$emit('error', { message: errorMessage, details: response.errors });
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to save sale';
        let userFriendlyMessage = errorMessage;
        if (errorMessage.includes('foreign key constraint fails')) {
          userFriendlyMessage = 'Invalid Equipment or Client selected. Please check your selections.';
        } else if (errorMessage.includes('already exists')) { // Catch unique constraint errors
          userFriendlyMessage = 'A sales record with this serial number already exists.';
        }
        this.showSnackbar(userFriendlyMessage, 'error');
        this.$emit('error', { message: userFriendlyMessage, details: error.response?.data?.errors });
      }
    },
    resetForm() {
      this.serialNo = '';
      this.selcetedEquipment = '';
      this.selcetdClient = '';
      this.MaintenancePeriod = '';
      this.InstallationDate = '';
      this.WarrantyDate = '';
      this.lastMainDate = '';
      this.invoice = [];
      this.installationReport = [];
      this.warranty = [];
      this.maintenance = [];
      this.amc = [];
      this.allDocumentFields = [{ file: [], typeName: '', url: '', originalName: '', isExisting: false }];
      this.selcetdCategory = '';
      this.selcetdSubCategory = '';
      this.availSubCatList = [];
      this.availableEquilist = [];
      this.status = 1;
      this.documentsError = '';
    },
  },
  async created() {
    await this.ensureDataLoaded();
  },
};
</script>
<style scoped>
/* Dialog and Base Styles */
.dialog-card {
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  /* Larger border-radius */
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  /* More prominent shadow */
}

.close-btn {
  background: none;
  /* color: white !important; Icon color for close button */
  transition: transform 0.2s ease-in-out;
}

.close-btn:hover {
  transform: rotate(90deg);
  background: rgba(255, 255, 255, 0.1);

}

.dialog-title {
  background: linear-gradient(90deg, #4d90fe, #285bc7);
  /* Consistent gradient header */
  color: white !important;
  padding: 16px 24px;
  font-size: 1.5rem !important;
  /* Larger title font */
  font-weight: 700;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  display: flex;
  align-items: center;
}

.form-container {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  /* Increased padding */
  background: #f8fbfd;
  /* Lighter background for content */
}

/* Modern Input Field Styles */
.modern-field {
  border-radius: 8px;
  background: #ffffff;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  /* Subtle shadow for depth */
}

.modern-field:focus-within {
  box-shadow: 0 0 0 3px rgba(77, 144, 254, 0.2), 0 1px 5px rgba(0, 0, 0, 0.1);
  /* Focus glow */
  border-color: #4d90fe;
}

/* Ensure outlined variant border color */
.modern-field .v-input__control {
  border-color: #e0e0e0;
  /* Default border color */
}

/* Icons within inputs */
.modern-field .v-input__prepend-inner .v-icon,
.modern-file-field .v-input__prepend-inner .v-icon {
  color: #607d8b !important;
  /* Muted icon color for all inputs */
}

/* Labels within inputs */
.modern-field .v-label {
  color: #757575 !important;
  /* Lighter label color */
}

/* File Input Specific Styles */
.modern-file-field {
  border-radius: 8px;
  background: #ffffff;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.modern-file-field:focus-within {
  box-shadow: 0 0 0 3px rgba(77, 144, 254, 0.2), 0 1px 5px rgba(0, 0, 0, 0.1);
  border-color: #4d90fe;
}

/* Document Rows - for existing and new additional documents */
.existing-doc-row,
.new-doc-row {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
  /* Space between document entries */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
}

/* Delete/Minus Button for Document Rows */
.delete-btn {
  min-width: unset !important;
  padding: 0 !important;
  width: 32px !important;
  height: 32px !important;
  border-radius: 50% !important;
  background-color: #ef9a9a;
  /* Light red background */
  transition: all 0.2s ease-in-out;
}

.delete-btn .v-icon {
  color: white !important;
  /* White icon on red background */
  font-size: 18px !important;
}

.delete-btn:hover {
  background-color: #e57373 !important;
  transform: scale(1.1);
}

/* .delete{
  background: #d32f2f;
  color:white;
  border-radius: 50%;
} */
/* Add Document Field Button */
.add-document-btn {
  background: #e57373 !important;
  /* A nice blue for add button */
  color: blue;
  font-weight: 600;
  border-radius: 20px;
  padding: 8px 16px;
  transition: all 0.3s ease;
}

.mt-2 {
  background-color: #4d90fe;
  border-radius: 20px;
  color: white
}

.add-document-btn:hover {
  background: #285bc7 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Action Buttons (Save/Cancel) */
.action-container {
  background: #ffffff;
  border-top: 1px solid #eee;
  padding: 16px 24px;
  justify-content: flex-end;
  gap: 12px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}

.action-btn {
  min-width: 120px;
  border-radius: 28px;
  /* More rounded buttons */
  text-transform: uppercase;
  font-weight: 600;
  padding: 10px 28px;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.cancel-btn {
  background: #e0e0e0;
  color: #424242;
}

.cancel-btn:hover {
  background: #c7c7c7;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.save-btn {
  background: linear-gradient(45deg, #4d90fe, #285bc7);
  /* Blue gradient for save */
  color: white;
}

.save-btn:hover {
  background: linear-gradient(45deg, #285bc7, #1e4599);
  /* Darker gradient on hover */
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Error Text */
.error-text {
  color: #d32f2f;
  font-size: 0.75rem;
  margin-top: 4px;
  display: block;
}

/* Responsive adjustments */
@media (min-width: 601px) {
  .dialog-card {
    margin: 24px;
  }

  .v-row {
    margin: -12px;
    /* Adjust row spacing */
  }

  .v-col {
    padding: 12px;
    /* Adjust column padding */
  }

  .modern-field,
  .modern-file-field {
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
    font-size: 1.2rem !important;
    padding: 12px 16px;
  }

  .form-container {
    padding: 16px;
  }

  .v-row {
    margin: -8px;
    /* Adjust row spacing for mobile */
  }

  .v-col {
    padding: 8px;
    /* Adjust column padding for mobile */
  }

  .modern-field,
  .modern-file-field {
    font-size: 0.88rem;
  }

  .action-container {
    flex-direction: column;
    /* Stack buttons vertically on small screens */
    padding: 12px;
    gap: 8px;
  }

  .action-btn {
    width: 100%;
    /* Full width buttons on mobile */
    padding: 8px 16px;
  }

  .error-text {
    font-size: 0.7rem;
  }

  .existing-doc-row,
  .new-doc-row {
    padding: 8px;
    margin-bottom: 10px;
  }
}
</style>