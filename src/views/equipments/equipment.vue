<template>
  <v-container class="px-10" fluid style="height:100vh; background:#e7f0f7;">
    <v-breadcrumbs :items="breadcrumbs" class="breadcrumbs-container">
      <template v-slot:divider>
        <v-icon color="white">mdi-chevron-right</v-icon>
      </template>
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :href="item.href" :disabled="item.disabled" class="custom-breadcrumb-item">
          {{ item.text.toUpperCase() }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <br><br>
    <div class="text-h6 mb-2" style="font-family:'Montserrat', sans-serif !important">
      EQUIPMENTS
    </div>
    <searchAndFilterToolbar :btn_text="Eq_text" :show-button="showToolbar" @btn_action="dialog = true"
      :placeholder="'Search with Serial No, Equipment Name and Client'" :auto="true" @filterBtn="displayFilter"
      @fiterWithName="filterEqu_clName" />
    <Transition name="slide-fade">
      <div class="mt-4 mb-2" v-if="filterDisplay">
        <v-row>
          <v-col cols="12" md="2">
            <v-autocomplete v-model="city" clearable hide-details variant="outlined" density="compact" :items="cityList"
              item-title="city" item-value="id" label="City"></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2" style="align-self: center;">
            <v-btn style="background: rgb(4 43 76);" @click="filterEquipment()">
              <span style="color: white">Filter</span>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </Transition>
    <div>
      <v-table class="mt-8">
        <thead>
          <tr>
            <!-- <th class="text-left">#</th> -->
            <th class="text-left">Serial No</th>
            <th class="text-left">Equipment name</th>
            <th class="text-left">Client</th>
            <th class="text-left">Model</th>
            <th class="text-left">Categories</th>
            <th class="text-left">Installation Date</th>
            <th class="text-left">Warranty End Date</th>
            <th class="text-left">Warranty Status</th>
            <th class="text-left">Block</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in saleEquipmentList" :key="item.id">
            <!-- <td>{{ (page - 1) * size + i + 1 }}</td> -->
            <td>{{ item.serialNo || 'N/A' }}</td>
            <td>{{ item.equipment?.equipmentName || 'N/A' }}</td>
            <td v-if="item.client?.arabicname">{{ item.client.name + ' ' + item.client.arabicname }}</td>
            <td v-else>{{ item.client?.name || 'N/A' }}</td>
            <td>{{ item.equipment?.model || 'N/A' }}</td>
            <td>{{ item.equipment?.subcategory?.category?.categoryName || 'N/A' }}</td>
            <td>{{ item.installationDate ? formatDate(item.installationDate) : 'N/A' }}</td>
            <td>{{ item.warrantyDate ? formatDate(item.warrantyDate) : 'N/A' }}</td>
            <td>
              <v-chip :color="getWarrantyStatus(item).color" size="small">
                {{ getWarrantyStatus(item).text }}
              </v-chip>
            </td>
            <td>
              <v-btn v-if="showToolbar" size="small" :color="item.status === 1 ? 'warning' : 'error'"
                @click="openBlockDialog(item)">
                <v-icon left>{{ item.status === 1 ? 'mdi-block-helper' : 'mdi-cancel' }}</v-icon>
                {{ item.status === 1 ? 'Block' : 'Blocked' }}
              </v-btn>
            </td>
            <td>
              <v-menu transition="scale-transition">
                <template v-slot:activator="{ props }">
                  <v-btn icon v-bind="props">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="openViewDialog(item)">
                    <v-list-item-title>
                      <v-icon left>mdi-eye-outline</v-icon> View
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="openEditdialog(item)" v-if="showToolbar">
                    <v-list-item-title>
                      <v-icon left>mdi-pencil-outline</v-icon> Edit
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="openDeletedialog(item)" v-if="showToolbar">
                    <v-list-item-title>
                      <v-icon left>mdi-trash-can-outline</v-icon> Delete
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="openEditdialog2(item)" v-if="showToolbar">
                    <v-list-item-title>
                      <v-icon left>mdi-av-timer</v-icon> Edit Maintenance
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <paginationVue :length="saleTotalPage" @changePage="changePage" />
    <editSaleEquipment :visible="edit_dialog" @close="edit_dialog = false" @save="editSale" :items="tempEditValue" />
    <editMaintCaldaysVue :visible="daysEdit_dialog" @close="daysEdit_dialog = false" @save="editSale"
      :items="tempEditValue" />
    <addEquipment :visible="dialog" @close="dialog = false" @save="addSale" :title="dialog_title" />
    <deleteWarnVue :visible="delete_dialog" :equipment="deleteValue" @close="delete_dialog = false" :item="deleteValue"
      @delete="deleteSale" />
    <loadingDailogVue :loading="loading" @close="loading = false" />
    <snackbarVue :visible="snackbar" :text="mssg" :button="false" :color="snackColor" @close="snackbar = false" />

    <v-dialog v-model="block_dialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">
          {{ blockItem.status === 1 ? 'Block Equipment' : 'Unblock Equipment' }}
        </v-card-title>
        <v-card-text>
          Are you sure you want to {{ blockItem.status === 1 ? 'block' : 'unblock' }} this equipment?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="block_dialog = false">No</v-btn>
          <v-btn color="primary" @click="confirmToggleStatus()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="view_dialog" max-width="900" scrollable>
      <v-card v-if="viewItem && Object.keys(viewItem).length > 0" class="dialog-card">
        <v-card-title class="dialog-title">
          Equipment Details
          <v-spacer></v-spacer>
          <v-btn icon small @click="closeViewDialog" class="close-btn">
            <v-icon style="color: white;">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="form-container">
          <v-container fluid>
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="detail-item">
                  <label class="detail-label"><v-icon left>mdi-barcode</v-icon> Serial No</label>
                  <p class="detail-value">{{ viewItem.serialNo || 'N/A' }}</p>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="detail-item">
                  <label class="detail-label"><v-icon left>mdi-tools</v-icon> Equipment Name</label>
                  <p class="detail-value">{{ viewItem.equipment?.equipmentName || 'N/A' }}</p>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="detail-item">
                  <label class="detail-label"><v-icon left>mdi-account-tie</v-icon> Client Name</label>
                  <p class="detail-value">{{ viewItem.client ? (viewItem.client.arabicname ? `${viewItem.client.name}
                    (${viewItem.client.arabicname})` : viewItem.client.name) : 'N/A' }}</p>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="detail-item">
                  <label class="detail-label"><v-icon left>mdi-city</v-icon> Client City</label>
                  <p class="detail-value">{{ viewItem.client?.city?.city || 'N/A' }}</p>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="detail-item">
                  <label class="detail-label"><v-icon left>mdi-tag</v-icon> Model</label>
                  <p class="detail-value">{{ viewItem.equipment?.model || 'N/A' }}</p>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="detail-item">
                  <label class="detail-label"><v-icon left>mdi-shape</v-icon> Category</label>
                  <p class="detail-value">{{ viewItem.equipment?.subcategory?.category?.categoryName || 'N/A' }}</p>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="detail-item">
                  <label class="detail-label"><v-icon left>mdi-shape-outline</v-icon> Subcategory</label>
                  <p class="detail-value">{{ viewItem.equipment?.subcategory?.subcategoryName || 'N/A' }}</p>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="detail-item">
                  <label class="detail-label"><v-icon left>mdi-calendar-start</v-icon> Installation Date</label>
                  <p class="detail-value">{{ viewItem.installationDate ? formatDate(viewItem.installationDate) : 'N/A'
                  }}
                  </p>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="detail-item">
                  <label class="detail-label"><v-icon left>mdi-calendar-end</v-icon> Warranty Expiry Date</label>
                  <p class="detail-value">{{ viewItem.warrantyDate ? formatDate(viewItem.warrantyDate) : 'N/A' }}</p>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="detail-item">
                  <label class="detail-label">
                    <v-icon left :color="getWarrantyStatus(viewItem).color">{{ getWarrantyStatus(viewItem).color ===
                      'green'
                      ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon> Warranty Status
                  </label>
                  <p class="detail-value" :style="{ color: getWarrantyStatus(viewItem).color }">{{
                    getWarrantyStatus(viewItem).text || 'N/A' }}</p>
                </div>
              </v-col>

              <v-col cols="12" sm="6" v-if="viewItem.LastMaintenanceDate">
                <div class="detail-item">
                  <label class="detail-label"><v-icon left>mdi-calendar-check</v-icon> Last Maintenance Date</label>
                  <p class="detail-value">{{ viewItem.LastMaintenanceDate ? formatDate(viewItem.LastMaintenanceDate) :
                    'N/A'
                  }}</p>
                </div>
              </v-col>
              <v-col cols="12" sm="6" v-if="viewItem.prevdays">
                <div class="detail-item">
                  <label class="detail-label"><v-icon left>mdi-calendar-clock</v-icon> Maintenance Period (Days)</label>
                  <p class="detail-value">{{ viewItem.prevdays || 'N/A' }}</p>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="detail-item">
                  <label class="detail-label">
                    <v-icon left>{{ viewItem.status === 1 ? 'mdi-check' : 'mdi-block-helper' }}</v-icon> Status
                  </label>
                  <p class="detail-value">{{ viewItem.status === 1 ? 'Active' : 'Blocked' }}</p>
                </div>
              </v-col>

              <v-col cols="12">
                <v-divider class="my-4"></v-divider>
                <v-label class="mb-2 text-h6">Associated Documents</v-label>
                <v-row dense>
                  <v-col cols="12" sm="6" md="4" v-if="viewItem.equipment?.equipmentImage">
                    <v-card flat class="document-card">
                      <v-card-title class="text-subtitle-1">Equipment Image</v-card-title>
                      <v-card-text class="d-flex flex-column align-center">
                        <v-img v-if="isImage(viewItem.equipment.equipmentImage)"
                          :src="viewItem.equipment.equipmentImage" max-height="150" contain
                          class="mb-2 document-preview"></v-img>
                        <v-icon v-else size="64" class="mb-2 document-icon">mdi-image-off-outline</v-icon>
                        <v-btn color="primary" :href="viewItem.equipment.equipmentImage" target="_blank"
                          density="compact" class="mt-2">
                          <v-icon left>mdi-download</v-icon>
                          Download Image
                        </v-btn>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <v-col cols="12" sm="6" md="4" v-if="viewItem.invoice">
                    <v-card flat class="document-card">
                      <v-card-title class="text-subtitle-1">Invoice</v-card-title>
                      <v-card-text class="d-flex flex-column align-center">
                        <v-img v-if="isImage(viewItem.invoice)" :src="viewItem.invoice" max-height="150" contain
                          class="mb-2 document-preview"></v-img>
                        <v-icon v-else size="64" class="mb-2 document-icon">mdi-file-pdf-box</v-icon>
                        <v-btn color="primary" :href="viewItem.invoice" target="_blank" density="compact" class="mt-2">
                          <v-icon left>mdi-download</v-icon>
                          Download Invoice
                        </v-btn>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <v-col cols="12" sm="6" md="4" v-if="viewItem.installationReport">
                    <v-card flat class="document-card">
                      <v-card-title class="text-subtitle-1">Installation Report</v-card-title>
                      <v-card-text class="d-flex flex-column align-center">
                        <v-img v-if="isImage(viewItem.installationReport)" :src="viewItem.installationReport"
                          max-height="150" contain class="mb-2 document-preview"></v-img>
                        <v-icon v-else size="64" class="mb-2 document-icon">mdi-file-chart-outline</v-icon>
                        <v-btn color="primary" :href="viewItem.installationReport" target="_blank" density="compact"
                          class="mt-2">
                          <v-icon left>mdi-download</v-icon>
                          Download Report
                        </v-btn>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <v-col cols="12" sm="6" md="4" v-if="viewItem.warrantyDocument">
                    <v-card flat class="document-card">
                      <v-card-title class="text-subtitle-1">Warranty Document</v-card-title>
                      <v-card-text class="d-flex flex-column align-center">
                        <v-img v-if="isImage(viewItem.warrantyDocument)" :src="viewItem.warrantyDocument"
                          max-height="150" contain class="mb-2 document-preview"></v-img>
                        <v-icon v-else size="64" class="mb-2 document-icon">mdi-file-certificate-outline</v-icon>
                        <v-btn color="primary" :href="viewItem.warrantyDocument" target="_blank" density="compact"
                          class="mt-2">
                          <v-icon left>mdi-download</v-icon>
                          Download Warranty
                        </v-btn>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <v-col cols="12" sm="6" md="4" v-if="viewItem.maintenanceContract">
                    <v-card flat class="document-card">
                      <v-card-title class="text-subtitle-1">Maintenance Contract</v-card-title>
                      <v-card-text class="d-flex flex-column align-center">
                        <v-img v-if="isImage(viewItem.maintenanceContract)" :src="viewItem.maintenanceContract"
                          max-height="150" contain class="mb-2 document-preview"></v-img>
                        <v-icon v-else size="64" class="mb-2 document-icon">mdi-file-document-edit-outline</v-icon>
                        <v-btn color="primary" :href="viewItem.maintenanceContract" target="_blank" density="compact"
                          class="mt-2">
                          <v-icon left>mdi-download</v-icon>
                          Download Contract
                        </v-btn>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <v-col cols="12" sm="6" md="4" v-if="viewItem.annualMaintenanceContract">
                    <v-card flat class="document-card">
                      <v-card-title class="text-subtitle-1">Annual Maintenance Contract</v-card-title>
                      <v-card-text class="d-flex flex-column align-center">
                        <v-img v-if="isImage(viewItem.annualMaintenanceContract)"
                          :src="viewItem.annualMaintenanceContract" max-height="150" contain
                          class="mb-2 document-preview"></v-img>
                        <v-icon v-else size="64" class="mb-2 document-icon">mdi-file-document-multiple-outline</v-icon>
                        <v-btn color="primary" :href="viewItem.annualMaintenanceContract" target="_blank"
                          density="compact" class="mt-2">
                          <v-icon left>mdi-download</v-icon>
                          Download AMC
                        </v-btn>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <template v-if="parsedDocuments.length > 0">
                    <v-col cols="12">
                      <v-card flat class="document-section-card">
                        <v-card-title class="text-subtitle-1">Additional Documents</v-card-title>
                        <v-card-text>
                          <v-row dense>
                            <v-col cols="12" sm="6" md="4" v-for="(doc, index) in parsedDocuments"
                              :key="'additional-doc-' + index">
                              <v-card flat class="document-card">
                                <v-card-title class="text-subtitle-2">{{ doc.name || `Document ${index + 1}`
                                }}</v-card-title>
                                <v-card-text class="d-flex flex-column align-center">
                                  <v-img v-if="isImage(doc.url)" :src="doc.url" max-height="150" contain
                                    class="mb-2 document-preview"></v-img>
                                  <v-icon v-else size="64" class="mb-2 document-icon">mdi-file-file-outline</v-icon>
                                  <v-btn color="primary" :href="doc.url" target="_blank" density="compact" class="mt-2">
                                    <v-icon left>mdi-download</v-icon>
                                    Download {{ doc.name || `Doc ${index + 1}` }}
                                  </v-btn>
                                </v-card-text>
                              </v-card>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </template>
                  <v-col cols="12" v-else>
                    <v-card flat>
                      <v-card-text>
                        <p class="text-center text-subtitle-1">No additional documents available.</p>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="action-container">
          <v-spacer></v-spacer>
          <v-btn class="action-btn cancel-btn" @click="closeViewDialog">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-title>No Data Available</v-card-title>
        <v-card-text>
          Unable to load equipment details. Please try again.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="action-btn cancel-btn" @click="closeViewDialog">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import searchAndFilterToolbar from '@/components/searchAndFilterToolbar.vue';
import addEquipment from '@/components/saleEquipment/addEquipments.vue';
import editSaleEquipment from '@/components/saleEquipment/editsaleEquip.vue';
import editMaintCaldaysVue from '@/components/saleEquipment/editMaintCaldays.vue';
import deleteWarnVue from '@/components/deleteWarn.vue';
import paginationVue from '@/components/pagination.vue';
import loadingDailogVue from '@/components/loadingDailog.vue';
import snackbarVue from '@/components/snackbar.vue';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'equipment',
  data() {
    return {
      breadcrumbs: [
        { text: 'Home', disabled: false, href: '/' },
        { text: 'Equipments', disabled: true, href: '/equipments' },
      ],
      Eq_text: 'Add Equipment',
      dialog: false,
      view_dialog: false,
      filterDisplay: false,
      dialog_title: 'Add Equipment',
      delete_dialog: false,
      edit_dialog: false,
      daysEdit_dialog: false,
      block_dialog: false,
      loading: false,
      snackbar: false,
      mssg: '',
      snackColor: '',
      showToolbar: false,
      equipmentSearchVal: '',
      edit_id: '',
      deleteValue: {},
      tempEditValue: {},
      viewItem: {},
      blockItem: {
        status: 0,
        id: null,
      },
      city: '',
      care: '',
      type: '',
      equiId: '',
      typeList: [
        { id: 1, title: 'GOV' },
        { id: 2, title: 'NON-GOV' },
      ],
    };
  },
  components: {
    searchAndFilterToolbar,
    addEquipment,
    deleteWarnVue,
    editSaleEquipment,
    paginationVue,
    loadingDailogVue,
    snackbarVue,
    editMaintCaldaysVue,
  },
  computed: {
    ...mapState('salesEquipment', ['saleEquipmentList', 'editValue', 'saleTotalPage']),
    ...mapState('city', ['cityList']),
    ...mapState('careof', ['careofList']),
    ...mapState('equipments', ['allEquipments']),
    parsedDocuments() {
      if (!this.viewItem.documents) {
        return [];
      }
      try {
        const parsed = typeof this.viewItem.documents === 'string'
          ? JSON.parse(this.viewItem.documents)
          : this.viewItem.documents;

        if (!Array.isArray(parsed)) {
          console.warn('viewItem.documents is not an array after parsing:', parsed);
          // If it's not an array, it's likely malformed data; return empty array.
          return [];
        }
        return parsed.map((doc, index) => {
          if (!doc.url) {
            console.warn(`Document ${index + 1} has no URL:`, doc);
          }
          return {
            name: doc.name || `Document ${index + 1}`,
            url: doc.url || ''
          };
        }).filter(doc => doc.url); // Filter out documents without URLs
      } catch (error) {
        console.error('Error parsing documents in computed property:', error);
        this.mssg = 'Error loading additional documents (parsing issue)';
        this.snackColor = 'error';
        this.snackbar = true;
        return [];
      }
    }
  },
  methods: {
    isAdmin() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.role) {
        const userRole = user.role[0];
        this.showToolbar = userRole !== 'Engineer';
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return 'Invalid Date';
        }
        return date.toISOString().split('T')[0]; // Formats to YYYY-MM-DD
      } catch (e) {
        console.error("Error formatting date:", e);
        return 'N/A';
      }
    },
    getWarrantyStatus(item) {
      if (!item || !item.warrantyDate) {
        return { text: 'Out of Warranty', color: 'red' };
      }
      const today = new Date();
      const warrantyEnd = new Date(item.warrantyDate);
      return warrantyEnd >= today
        ? { text: 'In Warranty', color: 'green' }
        : { text: 'Out of Warranty', color: 'red' };
    },
    isImage(url) {
      if (!url) return false;
      const ext = url.toLowerCase().split('.').pop();
      return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff'].includes(ext);
    },
    // The handleDownload method is now redundant as `target="_blank"` on the `v-btn`'s href handles direct downloads.
    // However, if you need to perform additional logic (e.g., track downloads, add authentication headers),
    // you would uncomment and implement it, then call it from the @click event.
    /*
    async handleDownload(url) {
      if (!url) {
        this.mssg = 'No document URL provided for download.';
        this.snackColor = 'error';
        this.snackbar = true;
        return;
      }
      // Example of a more complex download if needed:
      // try {
      //   const response = await fetch(url, { headers: { 'Authorization': 'Bearer YOUR_TOKEN' } });
      //   if (!response.ok) throw new Error('Network response was not ok.');
      //   const blob = await response.blob();
      //   const downloadUrl = window.URL.createObjectURL(blob);
      //   const link = document.createElement('a');
      //   link.href = downloadUrl;
      //   link.setAttribute('download', url.substring(url.lastIndexOf('/') + 1)); // Use filename from URL
      //   document.body.appendChild(link);
      //   link.click();
      //   link.remove();
      //   window.URL.revokeObjectURL(downloadUrl);
      //   this.mssg = 'Download started successfully!';
      //   this.snackColor = 'success';
      //   this.snackbar = true;
      // } catch (error) {
      //   console.error('Download failed:', error);
      //   this.mssg = `Download failed: ${error.message}`;
      //   this.snackColor = 'error';
      //   this.snackbar = true;
      // }
    },
    */
    ...mapActions('city', ['GET_CITY_LIST']),
    ...mapActions('careof', ['GET_CAREOF_LIST']),
    ...mapActions('clients', ['GET_CLIENT_LIST']),
    ...mapActions('category', ['GET_ALL_CATEGORY']),
    ...mapActions('subCategory', ['GET_SUB_CATEGORY', 'GET_ALL_SUBCATEGORY']),
    ...mapActions('equipments', ['GET_EQUIPMENT', 'GET_ALL_EQUIPMENT']),
    ...mapActions('salesEquipment', [
      'ADD_SALE_EQUIPMENT',
      'GET_ALL_SALE_EQUIPMENT',
      'DELETE_SALE_EQUIPMENT',
      'GET_SALE_EQUIPMENT_BY_ID',
      'UPDATE_SALE_EQUIPMENT',
    ]),
    displayFilter() {
      this.filterDisplay = !this.filterDisplay;
    },
    openBlockDialog(item) {
      this.blockItem = { ...item };
      this.block_dialog = true;
    },
    // equipment.vue - Inside methods

    async confirmToggleStatus() {
      if (!this.blockItem.id) {
        this.mssg = 'No equipment selected';
        this.snackColor = 'error';
        this.snackbar = true;
        return;
      }

      const updatedStatus = this.blockItem.status === 1 ? 0 : 1;
      const originalItem = this.saleEquipmentList.find(e => e.id === this.blockItem.id);

      if (!originalItem) {
        this.mssg = 'Original equipment data not found.';
        this.snackColor = 'error';
        this.snackbar = true;
        return;
      }

      try {
        this.loading = true;

        // Create FormData object even for status updates
        const formData = new FormData();
        formData.append('id', originalItem.id);
        formData.append('clientId', originalItem.clientId || originalItem.client?.id || '');
        formData.append('equipmentId', originalItem.equipmentId || originalItem.equipment?.id || '');
        formData.append('serialNo', originalItem.serialNo || '');
        formData.append('maintenancePeriod', originalItem.prevdays ? String(originalItem.prevdays) : originalItem.maintenancePeriod ? String(originalItem.maintenancePeriod) : '');
        formData.append('installationDate', this.formatDate(originalItem.installationDate) || '');
        formData.append('lastMaintenanceDate', this.formatDate(originalItem.LastMaintenanceDate) || '');
        formData.append('warrantyDate', this.formatDate(originalItem.warrantyDate) || '');
        formData.append('status', updatedStatus); // This is the only field that's changing

        // Append existing document URLs (no files are being uploaded here)
        // For direct attachments, if they exist, send them as undefined to imply no change
        // If they were previously cleared (empty string), we would have set them to null.
        // For status toggle, they remain as they were.
        if (originalItem.invoice) formData.append('invoice', originalItem.invoice);
        if (originalItem.installationReport) formData.append('installationReport', originalItem.installationReport);
        if (originalItem.warrantyDocument) formData.append('warrantyDocument', originalItem.warrantyDocument);
        if (originalItem.maintenanceContract) formData.append('maintenanceContract', originalItem.maintenanceContract);
        if (originalItem.annualMaintenanceContract) formData.append('annualMaintenanceContract', originalItem.annualMaintenanceContract);

        // Handle additional documents: send their current state (names and URLs)
        // The backend updateSales expects documentMetadata as JSON string
        let currentAdditionalDocuments = [];
        if (originalItem.documents) {
          try {
            currentAdditionalDocuments = typeof originalItem.documents === 'string'
              ? JSON.parse(originalItem.documents)
              : originalItem.documents;
            if (!Array.isArray(currentAdditionalDocuments)) {
              console.warn('Original item documents is not an array:', currentAdditionalDocuments);
              currentAdditionalDocuments = [];
            }
          } catch (e) {
            console.error('Error parsing original documents for status update:', e);
            currentAdditionalDocuments = [];
          }
        }
        formData.append('documentMetadata', JSON.stringify(currentAdditionalDocuments)); // Send existing metadata

        // Call the Vuex action with the FormData object
        await this.UPDATE_SALE_EQUIPMENT({
          id: originalItem.id, // Pass the ID separately for the URL param
          formData: formData // Pass the FormData object
        });

        await this.GET_ALL_SALE_EQUIPMENT({
          size: 15,
          page: 1,
          search: this.equipmentSearchVal || '',
          cityid: this.city || '',
          eid: this.equiId || '',
        });
        this.mssg =
          updatedStatus === 0
            ? 'Equipment Blocked Successfully'
            : 'Equipment Unblocked Successfully';
        this.snackColor = 'success';
        this.snackbar = true;
      } catch (error) {
        console.error('Error updating status:', error);
        this.mssg = error.response?.data?.message || error.message || 'Error updating equipment status';
        this.snackColor = 'error';
        this.snackbar = true;
      } finally {
        this.loading = false;
        this.block_dialog = false;
        this.blockItem = { status: 0, id: null };
      }
    },
    async addSale(payload) {
      this.loading = true;
      try {
        await this.ADD_SALE_EQUIPMENT(payload);
        await this.GET_ALL_SALE_EQUIPMENT({ size: 15 });
        this.dialog = false;
        this.mssg = 'Equipment Added Successfully';
        this.snackColor = 'success';
        this.snackbar = true;
      } catch (err) {
        this.mssg = err.message || 'Error adding equipment';
        this.snackColor = 'error';
        this.snackbar = true;
      } finally {
        this.loading = false;
      }
    },
    openDeletedialog(item) {
      this.deleteValue = item;
      this.delete_dialog = true;
    },
    // async deleteSale() {
    //   try {
    //     await this.DELETE_SALE_EQUIPMENT(this.deleteValue.id);
    //     await this.GET_ALL_SALE_EQUIPMENT({ size: 15 });
    //     this.mssg = 'Equipment deleted successfully';
    //     this.snackColor = 'success';
    //     this.snackbar = true;
    //     this.delete_dialog = false;
    //     this.deleteValue = {};
    //     console.log('Deleting sale with ID:', this.deleteValue.id);

    //   } catch (error) {
    //     console.error('Error in deleteSale:', error);
    //     this.mssg = error.message || 'Error deleting equipment';
    //     this.snackColor = 'error';
    //     this.snackbar = true;
    //   }
    // },
    async deleteSale() {
      try {
        await this.DELETE_SALE_EQUIPMENT({ saleId: this.deleteValue.id });
        await this.GET_ALL_SALE_EQUIPMENT();
        this.delete_dialog = false;
        this.deleteValue = {};
      } catch (error) {
        console.error('Error deleting city:', error);
      }
    },

    async openEditdialog(item) {
      try {
        this.loading = true;
        this.edit_id = item.id;
        await this.GET_SALE_EQUIPMENT_BY_ID(item.id);
        this.tempEditValue = { ...this.editValue };
        if (Object.keys(this.tempEditValue).length === 0) {
          throw new Error('No data returned for equipment');
        }
        this.edit_dialog = true;
      } catch (error) {
        console.error('Error fetching equipment data:', error);
        this.mssg = 'Failed to load equipment data';
        this.snackColor = 'error';
        this.snackbar = true;
      } finally {
        this.loading = false;
      }
    },
    async openEditdialog2(item) {
      try {
        this.loading = true;
        this.edit_id = item.id;
        await this.GET_SALE_EQUIPMENT_BY_ID(item.id);
        this.tempEditValue = { ...this.editValue };
        this.daysEdit_dialog = true;
      } catch (error) {
        console.error('Error opening calibration edit dialog:', error);
        this.mssg = 'Failed to load equipment data';
        this.snackColor = 'error';
        this.snackbar = true;
      } finally {
        this.loading = false;
      }
    },
    async editSale(payload) {
      payload.id = this.edit_id;
      try {
        // Assuming payload.documents is already an array of objects
        // If the API expects a stringified JSON for documents, stringify it here
        const documentsToSend = Array.isArray(payload.documents)
          ? JSON.stringify(payload.documents)
          : payload.documents;

        await this.UPDATE_SALE_EQUIPMENT({ ...payload, documents: documentsToSend });
        await this.GET_ALL_SALE_EQUIPMENT({ size: 15 });
        this.edit_dialog = false;
        this.daysEdit_dialog = false;
        this.mssg = 'Equipment updated Successfully';
        this.snackColor = 'success';
        this.snackbar = true;
      } catch (error) {
        this.mssg = error.message || 'Error updating equipment';
        this.snackColor = 'error';
        this.snackbar = true;
      }
    },
    async openViewDialog(item) {
      try {
        this.loading = true;
        this.viewItem = {}; // Clear previous data
        await this.GET_SALE_EQUIPMENT_BY_ID(item.id);
        this.viewItem = { ...this.editValue }; // 'editValue' now holds the single item details

        // Ensure documents are treated as an array for the template
        if (this.viewItem.documents && typeof this.viewItem.documents === 'string') {
          try {
            this.viewItem.documents = JSON.parse(this.viewItem.documents);
          } catch (e) {
            console.error("Error parsing documents for view:", e);
            this.viewItem.documents = []; // Fallback to empty array
          }
        } else if (!Array.isArray(this.viewItem.documents)) {
          this.viewItem.documents = []; // Ensure it's an array if not already
        }

        if (Object.keys(this.viewItem).length === 0) {
          throw new Error('No data returned for equipment');
        }
        this.view_dialog = true;
      } catch (error) {
        console.error('Error fetching equipment details:', error);
        this.mssg = 'Failed to load equipment details';
        this.snackColor = 'error';
        this.snackbar = true;
      } finally {
        this.loading = false;
      }
    },
    closeViewDialog() {
      this.view_dialog = false;
      this.viewItem = {};
    },
    filterEqu_clName(val) {
      this.equipmentSearchVal = val || '';
      const payload = {
        search: this.equipmentSearchVal,
        cityid: this.city || '',
        size: 15,
        page: 1,
      };
      this.GET_ALL_SALE_EQUIPMENT(payload);
    },
    filterEquipment() {
      const payload = {
        eid: this.equiId || '',
        cityid: this.city || '',
        search: this.equipmentSearchVal || '',
        size: 15,
        page: 1,
      };
      this.GET_ALL_SALE_EQUIPMENT(payload);
    },
    changePage(page) {
      const payload = {
        page: page,
        size: 15,
        eid: this.equiId || '',
        cityid: this.city || '',
        search: this.equipmentSearchVal || '',
      };
      this.GET_ALL_SALE_EQUIPMENT(payload);
    },
  },
  mounted() {
    const query = { size: 1000 };
    Promise.all([
      this.isAdmin(),
      this.GET_ALL_SALE_EQUIPMENT({ size: 15 }),
      this.GET_CITY_LIST(query),
      this.GET_CAREOF_LIST(query),
      this.GET_ALL_EQUIPMENT(query),
    ]).catch((error) => {
      console.error('Error during initialization:', error);
      this.mssg = 'Failed to initialize data';
      this.snackColor = 'error';
      this.snackbar = true;
    });
  },
};
</script>

<style scoped>
/* Existing Styles */
.breadcrumbs-container {
  background: linear-gradient(90deg, #4d90fe, #285bc7);
  border-radius: 12px;
  padding: 10px 16px;
  box-shadow: 0 6px 15px rgba(77, 144, 254, 0.2);
  animation: slideInDown 0.8s ease-out;
}

.custom-breadcrumb-item {
  color: #FFFFFF;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.custom-breadcrumb-item:hover {
  color: #E5E7EB;
  transform: scale(1.05);
}

.v-table .v-table__wrapper>table>tbody>tr td {
  border-left: thin solid #00000008;
}

.v-locale--is-ltr .v-table>.v-table__wrapper>table>thead>tr>th {
  border-left: thin solid #00000008;
  font-weight: 600 !important;
}

.v-table {
  font-family: Montserrat, sans-serif !important;
}

tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, .05);
}

/* Modal Specific Styles - Enhanced */
.dialog-card {
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  /* Slightly larger border-radius */
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  /* More prominent shadow */
}

.close-btn {
  background: none;
  /* Remove background, rely on icon color and hover */
  color: white !important;
  /* Ensure icon is white for better contrast with blue header */
  transition: transform 0.2s ease-in-out;
}

.close-btn:hover {
  transform: rotate(90deg);
  /* Add a subtle rotation on hover */
  background: rgba(255, 255, 255, 0.1);
  /* Slight background on hover */
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

.detail-item {
  margin-bottom: 16px;
  /* Spacing between detail items */
  padding: 12px;
  background-color: #f0f6fa;
  /* Light background for each detail item */
  border-radius: 8px;
  border: 1px solid #e1eaf0;
}

.detail-label {
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  font-size: 0.95rem;
}

.detail-label .v-icon {
  margin-right: 8px;
  color: #4d90fe;
  /* Icon color matching header */
}

.detail-value {
  margin-left: 32px;
  /* Indent value slightly for readability */
  color: #555;
  font-size: 1rem;
  word-break: break-word;
  /* Ensure long values wrap */
}

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

.document-section-card {
  border: 1px solid #d0e0f0;
  border-radius: 12px;
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.document-card {
  border: 1px dashed #c0d0e0;
  /* Dashed border for document cards */
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  /* Lighter shadow */
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.2s ease-in-out;
}

.document-card:hover {
  border-color: #4d90fe;
  /* Highlight on hover */
  box-shadow: 0 4px 12px rgba(77, 144, 254, 0.1);
  transform: translateY(-3px);
}

.document-card .v-card-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #3f51b5;
  /* A slightly darker blue for titles */
  word-break: normal;
  white-space: normal;
  line-height: 1.3;
  min-height: 40px;
  /* Ensure consistent height for titles */
  display: flex;
  align-items: center;
  justify-content: center;
}

.document-card .v-card-text {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
}

.document-preview {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 5px;
  background-color: #ffffff;
}

.document-icon {
  color: #607d8b;
  /* Muted grey for icons */
}

/* Animations */
@keyframes slideInDown {
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Styles */
@media (max-width: 960px) {
  .breadcrumbs-container {
    padding: 8px 12px;
  }

  .custom-breadcrumb-item {
    font-size: 0.9rem;
  }

  .form-container {
    padding: 24px;
  }

  .dialog-title {
    font-size: 1.3rem !important;
  }
}

@media (max-width: 600px) {
  .breadcrumbs-container {
    padding: 6px 10px;
  }

  .custom-breadcrumb-item {
    font-size: 0.8rem;
  }

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
    /* Stack buttons vertically on small screens */
    padding: 12px;
    gap: 8px;
  }

  .action-btn {
    width: 100%;
    /* Full width buttons */
    padding: 8px 16px;
  }

  .detail-item {
    padding: 10px;
  }

  .detail-value {
    margin-left: 24px;
  }
}

/* Transitions for filter section */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>