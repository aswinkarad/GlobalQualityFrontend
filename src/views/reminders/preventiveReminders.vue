<template>
  <v-container class="px-4 hmmsdashboard" fluid
    style="min-height: 100vh; background: linear-gradient(135deg, #F5F7FA, #E8ECEF);">
    <v-row  class="top-bar">
      <v-col cols="12" md="12">
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
      </v-col>
    </v-row>

    <div class="text-h6 mb-2 category-title" style="font-family: 'Montserrat', sans-serif !important">
      PREVENTIVE MAINTENANCE REMINDER
    </div>

    <searchAndFilterToolbar :auto="true" :show-filter-icon="false"
      :placeholder="'Search with Client, Equipment Name, or Serial No'" @btn_action="openAddService"
      @fiterWithName="searchByName" @filterBtn="filterDisplay = !filterDisplay" class="toolbar" />

    <Transition name="slide-fade">
      <div class="mt-4 mb-2 filter-container" v-if="filterDisplay">
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete v-model="selectedClient" clearable hide-details variant="outlined" density="compact"
              :items="clientList" item-title="name" item-value="id" label="Client" @update:modelValue="applyFilters"
              class="filter-input"></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete v-model="selectedEquipment" clearable hide-details variant="outlined" density="compact"
              :items="allEquipments" item-title="equipmentName" item-value="id" label="Equipment"
              @update:modelValue="applyFilters" class="filter-input"></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete v-model="selectedCity" clearable hide-details variant="outlined" density="compact"
              :items="cityList" item-title="city" item-value="id" label="City" @update:modelValue="applyFilters"
              class="filter-input"></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete v-model="selectedSerialNo" clearable hide-details variant="outlined" density="compact"
              :items="serialNoList" item-title="serialNo" item-value="serialNo" label="Serial Number"
              @update:modelValue="applyFilters" class="filter-input"></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select v-model="selectedDayRange" clearable hide-details variant="outlined" density="compact"
              :items="dayRanges" item-title="text" item-value="value" label="Days Remaining/Ago"
              @update:modelValue="applyFilters" class="filter-input"></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3" class="d-flex align-center">
            <v-btn class="filter-btn" @click="applyFilters">
              Filter
            </v-btn>
            <v-btn class="ml-2 clear-btn" variant="text" @click="resetFilters">
              Clear
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </Transition>

    <v-row class="mt-4">
      <v-col cols="12">
        <h3 class="section-title">All Preventive Maintenance Reminders</h3>
        <v-table v-if="filteredList.length" class="modern-table rounded-lg">
          <thead>
            <tr>
              <th class="text-left index-column all-data-header" style="color: #E8ECEF;">#</th>
              <th class="text-left equipment-column all-data-header" style="color: #E8ECEF;">Equipment</th>
              <th class="text-left serial-no-column all-data-header" style="color: #E8ECEF;">Serial No</th>
              <th class="text-left due-date-column all-data-header" style="color: #E8ECEF;">Due Date (days
                remaining/ago)</th>
              <th class="text-left client-column all-data-header" style="color: #E8ECEF;">Client</th>
              <th class="text-left city-column all-data-header" style="color: #E8ECEF;">City</th>
              <th class="text-left action-column all-data-header" style="color: #E8ECEF;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in filteredList" :key="item.id" class="table-row-hover">
              <td class="index-column">{{ i + 1 }}</td>
              <td class="equipment-column">{{ item.sale?.equipment?.equipmentName || 'N/A' }}</td>
              <td class="serial-no-column">{{ item.sale?.serialNo || 'N/A' }}</td>
              <td class="due-date-column">
                {{ formatDate(item.maintenancePeriod) }}
                ({{ getDaysDisplay(item.maintenancePeriod) }})
              </td>
              <td class="client-column">{{ item.sale?.client?.name || 'N/A' }}</td>
              <td class="city-column">{{ item.sale?.client?.city?.city || 'N/A' }}</td>
              <td class="action-column">
                <v-btn class="service-request-btn" variant="outlined" size="small" @click="goToServiceRequest(item.id)">
                  Service Request
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-alert v-else type="info" class="mt-2 alert-info">No data matches your criteria.</v-alert>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <h3 class="section-title">0-30 Days (Upcoming or Overdue)</h3>
        <v-table v-if="range0to30.length" class="modern-table rounded-lg">
          <thead>
            <tr>
              <th class="text-left index-column" style="color: #E8ECEF;">#</th>
              <th class="text-left equipment-column" style="color: #E8ECEF;">Equipment</th>
              <th class="text-left serial-no-column" style="color: #E8ECEF;">Serial No</th>
              <th class="text-left due-date-column" style="color: #E8ECEF;">Due Date (days remaining/ago)</th>
              <th class="text-left client-column" style="color: #E8ECEF;">Client</th>
              <th class="text-left city-column" style="color: #E8ECEF;">City</th>
              <th class="text-left action-column" style="color: #E8ECEF;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in range0to30" :key="item.id" class="table-row-hover">
              <td class="index-column">{{ i + 1 }}</td>
              <td class="equipment-column">{{ item.sale?.equipment?.equipmentName || 'N/A' }}</td>
              <td class="serial-no-column">{{ item.sale?.serialNo || 'N/A' }}</td>
              <td class="due-date-column">
                {{ formatDate(item.maintenancePeriod) }}
                ({{ getDaysDisplay(item.maintenancePeriod) }})
              </td>
              <td class="client-column">{{ item.sale?.client?.name || 'N/A' }}</td>
              <td class="city-column">{{ item.sale?.client?.city?.city || 'N/A' }}</td>
              <td class="action-column">
                <v-btn class="service-request-btn" variant="outlined" size="small" @click="goToServiceRequest(item.id)">
                  Service Request
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-alert v-else type="info" class="mt-2 alert-info">No data for 0-30 days</v-alert>
      </v-col>

      <v-col cols="12">
        <h3 class="section-title">30-60 Days (Upcoming or Overdue)</h3>
        <v-table v-if="range30to60.length" class="modern-table rounded-lg">
          <thead>
            <tr>
              <th class="text-left index-column" style="color: #E8ECEF;">#</th>
              <th class="text-left equipment-column" style="color: #E8ECEF;">Equipment</th>
              <th class="text-left serial-no-column" style="color: #E8ECEF;">Serial No</th>
              <th class="text-left due-date-column" style="color: #E8ECEF;">Due Date (days remaining/ago)</th>
              <th class="text-left client-column" style="color: #E8ECEF;">Client</th>
              <th class="text-left city-column" style="color: #E8ECEF;">City</th>
              <th class="text-left action-column" style="color: #E8ECEF;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in range30to60" :key="item.id" class="table-row-hover">
              <td class="index-column">{{ i + 1 }}</td>
              <td class="equipment-column">{{ item.sale?.equipment?.equipmentName || 'N/A' }}</td>
              <td class="serial-no-column">{{ item.sale?.serialNo || 'N/A' }}</td>
              <td class="due-date-column">
                {{ formatDate(item.maintenancePeriod) }}
                ({{ getDaysDisplay(item.maintenancePeriod) }})
              </td>
              <td class="client-column">{{ item.sale?.client?.name || 'N/A' }}</td>
              <td class="city-column">{{ item.sale?.client?.city?.city || 'N/A' }}</td>
              <td class="action-column">
                <v-btn class="service-request-btn" variant="outlined" size="small" @click="goToServiceRequest(item.id)">
                  Service Request
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-alert v-else type="info" class="mt-2 alert-info">No data for 30-60 days</v-alert>
      </v-col>

      <v-col cols="12">
        <h3 class="section-title">60-90 Days (Upcoming or Overdue)</h3>
        <v-table v-if="range60to90.length" class="modern-table rounded-lg">
          <thead>
            <tr>
              <th class="text-left index-column" style="color: #E8ECEF;">#</th>
              <th class="text-left equipment-column" style="color: #E8ECEF;">Equipment</th>
              <th class="text-left serial-no-column" style="color: #E8ECEF;">Serial No</th>
              <th class="text-left due-date-column" style="color: #E8ECEF;">Due Date (days remaining/ago)</th>
              <th class="text-left client-column" style="color: #E8ECEF;">Client</th>
              <th class="text-left city-column" style="color: #E8ECEF;">City</th>
              <th class="text-left action-column" style="color: #E8ECEF;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in range60to90" :key="item.id" class="table-row-hover">
              <td class="index-column">{{ i + 1 }}</td>
              <td class="equipment-column">{{ item.sale?.equipment?.equipmentName || 'N/A' }}</td>
              <td class="serial-no-column">{{ item.sale?.serialNo || 'N/A' }}</td>
              <td class="due-date-column">
                {{ formatDate(item.maintenancePeriod) }}
                ({{ getDaysDisplay(item.maintenancePeriod) }})
              </td>
              <td class="client-column">{{ item.sale?.client?.name || 'N/A' }}</td>
              <td class="city-column">{{ item.sale?.client?.city?.city || 'N/A' }}</td>
              <td class="action-column">
                <v-btn class="service-request-btn" variant="outlined" size="small" @click="goToServiceRequest(item.id)">
                  Service Request
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-alert v-else type="info" class="mt-2 alert-info">No data for 60-90 days</v-alert>
      </v-col>

      <v-col cols="12">
        <h3 class="section-title">90+ Days (Upcoming or Heavily Overdue)</h3>
        <v-table v-if="range90plus.length" class="modern-table rounded-lg">
          <thead>
            <tr>
              <th class="text-left index-column">#</th>
              <th class="text-left equipment-column">Equipment</th>
              <th class="text-left serial-no-column">Serial No</th>
              <th class="text-left due-date-column">Due Date (days remaining/ago)</th>
              <th class="text-left client-column">Client</th>
              <th class="text-left city-column">City</th>
              <th class="text-left action-column">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in range90plus" :key="item.id" class="table-row-hover">
              <td class="index-column">{{ i + 1 }}</td>
              <td class="equipment-column">{{ item.sale?.equipment?.equipmentName || 'N/A' }}</td>
              <td class="serial-no-column">{{ item.sale?.serialNo || 'N/A' }}</td>
              <td class="due-date-column">
                {{ formatDate(item.maintenancePeriod) }}
                ({{ getDaysDisplay(item.maintenancePeriod) }})
              </td>
              <td class="client-column">{{ item.sale?.client?.name || 'N/A' }}</td>
              <td class="city-column">{{ item.sale?.client?.city?.city || 'N/A' }}</td>
              <td class="action-column">
                <v-btn class="service-request-btn" variant="outlined" size="small" @click="goToServiceRequest(item.id)">
                  Service Request
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-alert v-else type="info" class="mt-2 alert-info">No data for 90+ days</v-alert>
      </v-col>
    </v-row>

    <paginationVue v-if="hasData" :length="preventiveTotalPage" @changePage="changePage" class="pagination" />

    <deleteWarnVue :visible="delete_dialog" @close="delete_dialog = false" :item="deleteValue" :log="true"
      @delete="update" class="dialog-animation" />

    <addServiceRequest :visible="showAddServiceDialog" :prefillData="prefillData" @close="showAddServiceDialog = false"
      @save="handleSaveServiceRequest" />
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import moment from 'moment';
import 'moment-timezone'; // Crucial for .tz() function

import deleteWarnVue from '@/components/deleteWarn.vue';
import paginationVue from '@/components/pagination.vue';
import searchAndFilterToolbar from '@/components/searchAndFilterToolbar.vue';
import addServiceRequest from '@/components/seviceRequest/addServiceRequest.vue';

export default {
  name: 'preventiveReminder',
  components: {
    searchAndFilterToolbar,
    deleteWarnVue,
    paginationVue,
    addServiceRequest,
  },
  data() {
    return {
      breadcrumbs: [
        { text: 'Home', disabled: false, href: '/' },
        { text: 'Preventive Maintenance Reminder', disabled: true, href: '/preventiveReminders' },
      ],
      reminder_text: '',
      delete_dialog: false,
      deleteValue: {},
      filterDisplay: false,
      searchQuery: '',
      selectedClient: null,
      selectedEquipment: null,
      selectedCity: null,
      selectedSerialNo: null,
      selectedDayRange: null, // New data property for the day range filter
      dayRanges: [
        { text: '0-30 Days (Upcoming or Overdue)', value: '0-30' },
        { text: '30-60 Days (Upcoming)', value: '30-60' }, // Consider updating text if logic changes
        { text: '60-90 Days (Upcoming)', value: '60-90' }, // Consider updating text if logic changes
        { text: '90+ Days (Upcoming or Heavily Overdue)', value: '90+' },
      ],
      showAddServiceDialog: false,
      prefillData: null,
    };
  },
  computed: {
    ...mapState('PreventiveReminders', ['preventiveList', 'preventiveTotalPage']),
    ...mapState('city', ['cityList']),
    ...mapState('equipments', ['allEquipments']),
    ...mapState('clients', ['clientList']),
    serialNoList() {
      if (!Array.isArray(this.preventiveList)) return [];
      return [...new Set(this.preventiveList
        .filter(item => item?.sale?.serialNo)
        .map(item => ({ serialNo: item.sale.serialNo })))];
    },
    hasData() {
      return Array.isArray(this.preventiveList) && this.preventiveList.length > 0;
    },
    filteredList() {
      if (!Array.isArray(this.preventiveList)) {
        console.warn('preventiveList is not an array:', this.preventiveList);
        return [];
      }
      return this.preventiveList.filter(item => {
        // Basic validation for item structure before accessing nested properties
        if (!item?.sale?.client || !item?.sale?.equipment || !item?.sale?.serialNo || !item?.maintenancePeriod) {
          console.warn('Invalid item structure or missing required fields for filtering:', item);
          return false;
        }

        const searchMatch = !this.searchQuery ||
          (item.sale.client.name || '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (item.sale.equipment.equipmentName || '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (item.sale.serialNo || '').toLowerCase().includes(this.searchQuery.toLowerCase());

        const clientMatch = !this.selectedClient || item.sale.client.id === this.selectedClient;
        const equipmentMatch = !this.selectedEquipment || item.sale.equipment.id === this.selectedEquipment;
        const cityMatch = !this.selectedCity || item.sale.client.city.id === this.selectedCity;
        const serialNoMatch = !this.selectedSerialNo || item.sale.serialNo === this.selectedSerialNo;

        const days = this.getDaysNumeric(item.maintenancePeriod);
        let dayRangeMatch = true;

        if (this.selectedDayRange) {
          switch (this.selectedDayRange) {
            case '0-30':
              dayRangeMatch = days !== null && Math.abs(days) <= 30;
              break;
            case '30-60':
              dayRangeMatch = days !== null && Math.abs(days) > 30 && Math.abs(days) <= 60;
              break;
            case '60-90':
              dayRangeMatch = days !== null && Math.abs(days) > 60 && Math.abs(days) <= 90;
              break;
            case '90+':
              dayRangeMatch = days !== null && Math.abs(days) > 90;
              break;
            default:
              dayRangeMatch = true;
          }
        }

        return searchMatch && clientMatch && equipmentMatch && cityMatch && serialNoMatch && dayRangeMatch;
      });
    },
    range0to30() {
      return this.filteredList.filter(item => {
        const days = this.getDaysNumeric(item.maintenancePeriod);
        // Includes items due today, upcoming within 30 days, or overdue by up to 30 days.
        return days !== null && Math.abs(days) <= 30;
      });
    },
    range30to60() {
      return this.filteredList.filter(item => {
        const days = this.getDaysNumeric(item.maintenancePeriod);
        // Includes items that are 30-60 days away (upcoming) OR 30-60 days ago (overdue).
        return days !== null && Math.abs(days) > 30 && Math.abs(days) <= 60;
      });
    },
    range60to90() {
      return this.filteredList.filter(item => {
        const days = this.getDaysNumeric(item.maintenancePeriod);
        // Includes items that are 60-90 days away (upcoming) OR 60-90 days ago (overdue).
        return days !== null && Math.abs(days) > 60 && Math.abs(days) <= 90;
      });
    },
    range90plus() {
      return this.filteredList.filter(item => {
        const days = this.getDaysNumeric(item.maintenancePeriod);
        // Includes items that are more than 90 days away (upcoming) OR more than 90 days ago (overdue).
        return days !== null && Math.abs(days) > 90;
      });
    },
  },
  methods: {
    ...mapActions('PreventiveReminders', ['GET_PREVENTIVE_LIST', 'UPDATE_SERVICE_PREVENTIVE']),
    ...mapActions('city', ['GET_CITY_LIST']),
    ...mapActions('equipments', ['GET_ALL_EQUIPMENT']),
    ...mapActions('clients', ['GET_CLIENT_LIST']),
    getDaysNumeric(date) {
      if (!date || !moment(date).isValid()) {
        console.warn('Invalid date for getDaysNumeric:', date);
        return null;
      }
      const dueDate = moment(date);
      // Use the current date and time in IST for comparison
      const today = moment().tz('Asia/Kolkata').startOf('day');
      return dueDate.diff(today, 'days');
    },
    getDaysDisplay(date) {
      const days = this.getDaysNumeric(date);
      if (days === null) return 'Invalid date';
      if (days === 0) return 'Today';
      return days > 0 ? `in ${days} days` : `${Math.abs(days)} days ago`;
    },
    formatDate(date) {
      if (!date || !moment(date).isValid()) return 'N/A';
      return moment(date).format('YYYY-MM-DD');
    },
    searchByName(val) {
      this.searchQuery = val || '';
      // applyFilters will be called automatically by Vue's reactivity
      // as computed properties depend on searchQuery.
    },
    // applyFilters() {
    //   // Re-evaluating computed properties happens automatically when
    //   // `selectedClient`, `selectedEquipment`, `selectedCity`, `selectedSerialNo`, `selectedDayRange` change.
    //   // Calling this method just ensures a re-evaluation if needed explicitly.
    //   this.logFilteredData(); // For debugging purposes
    // },
    resetFilters() {
      this.searchQuery = '';
      this.selectedClient = null;
      this.selectedEquipment = null;
      this.selectedCity = null;
      this.selectedSerialNo = null;
      this.selectedDayRange = null; // Reset the new filter
      // Re-apply filters to clear the display based on reset values
      this.applyFilters();
    },
    updateService(item) {
      this.delete_dialog = true;
      this.deleteValue = item;
    },
    async update(item) {
      try {
        await this.UPDATE_SERVICE_PREVENTIVE(item);
        this.delete_dialog = false;
        await this.GET_PREVENTIVE_LIST(); // Refresh data after update
      } catch (error) {
        console.error('Error updating service:', error);
      }
    },
    changePage(page) {
      const query = {
        page: page,
        size: 15,
      };
      this.GET_PREVENTIVE_LIST(query);
    },
    openAddService() {
      this.prefillData = null; // Clear any previous prefill data
      this.showAddServiceDialog = true;
    },
    // goToServiceRequest(id) {
    //   const item = this.preventiveList.find(item => item.id === id);
    //   if (item) {
    //     this.prefillData = {
    //       clientId: item.sale?.client?.id || '',
    //       city: item.sale?.client?.city?.city || '',
    //       equipmentId: item.sale?.equipment?.equipmentName || '',
    //       serialNo: item.sale?.serialNo || '',
    //       saleId: item.sale?.id || '',
    //       maintenancePeriod: item.maintenancePeriod || '',
    //     };
    //     console.log('Prefill Data for Service Request:', this.prefillData);
    //     this.showAddServiceDialog = true;
    //   } else {
    //     console.error('Item not found for ID:', id);
    //   }
    // },
    goToServiceRequest(id) {
  const item = this.preventiveList.find(item => item.id === id);
  if (item) {
    this.prefillData = {
      clientId: item.sale?.client?.id || '',
      city: item.sale?.client?.city?.city || '',
      equipmentId: item.sale?.equipment?.id || '', // Pass equipment ID instead of name
      equipmentName: item.sale?.equipment?.equipmentName || '', // Also pass name for reference
      serialNo: item.sale?.serialNo || '',
      saleId: item.sale?.id || '',
      maintenancePeriod: item.maintenancePeriod || '',
    };
    console.log('Prefill Data for Service Request:', this.prefillData);
    this.showAddServiceDialog = true;
  } else {
    console.error('Item not found for ID:', id);
  }
},
    handleSaveServiceRequest(payload) {
      console.log('Service Request Saved:', payload);
      this.showAddServiceDialog = false;
      this.prefillData = null;
      // After saving, refresh the preventive list to show updated data
      this.GET_PREVENTIVE_LIST();
    },
    //logPreventiveListStructure() {
      // console.log('Preventive List Structure:', {
      //   type: typeof this.preventiveList,
      //   isArray: Array.isArray(this.preventiveList),
      //   length: this.preventiveList?.length || 0,
      //   sample: this.preventiveList?.slice(0, 2),
      // });
    //},
    // logFilteredData() {
    //   console.log('Filtered Data Counts:', {
    //     'All Data (after filters)': this.filteredList.length,
    //     '0-30 Days': this.range0to30.length,
    //     '30-60 Days': this.range30to60.length,
    //     '60-90 Days': this.range60to90.length,
    //     '90+ Days': this.range90plus.length,
    //   });
    // },
  },
  async mounted() {
    try {
      await Promise.all([
        this.GET_PREVENTIVE_LIST(),
        this.GET_CITY_LIST(),
        this.GET_ALL_EQUIPMENT(),
        this.GET_CLIENT_LIST(),
      ]);
      this.$nextTick(() => {
        // this.logPreventiveListStructure();
        // this.logFilteredData();
      });
    } catch (error) {
      console.error('Error during mounted:', error);
    }
  },
};
</script>


<style scoped>
/* General Container Styling */
.hmmsdashboard {
  padding: 20px;
  font-family: 'Montserrat', sans-serif;
}

/* Breadcrumb Styling */
.breadcrumbs-container {
  background: linear-gradient(45deg, #4d90fe, #285bc7);
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.custom-breadcrumb-item a {
  color: white !important;
  font-weight: 500;
  text-decoration: none;
}

.custom-breadcrumb-item a:hover {
  text-decoration: underline;
}

/* Category Title */
.category-title {
  font-weight: 700;
  color: #2c3e50;
  letter-spacing: 1.2px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* Filter Toolbar and Inputs */
.filter-container {
  background: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.filter-input {
  border-radius: 6px !important;
}

.filter-btn {
  background: linear-gradient(45deg, #4d90fe, #285bc7) !important;
  color: white !important;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.filter-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.clear-btn {
  color: #4d90fe !important;
  font-weight: 600;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  color: #285bc7 !important;
  text-decoration: underline;
}

/* Table Styling */
.modern-table {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border-collapse: separate !important;
  border-spacing: 0;
}

.modern-table thead {
  background: linear-gradient(45deg, #4d90fe, #285bc7);
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Specific header for "All Data" table */
.all-data-header {
  background: linear-gradient(45deg, #1d4d8c, #3a7bd5) !important; /* Slightly different shade */
}


.modern-table th {
  padding: 12px 16px;
  border-bottom: 2px solid #e0e0e0;
  font-size: 0.9rem;
}

.modern-table tbody tr {
  transition: background 0.3s ease;
}

.table-row-hover:hover {
  background: #f8fafc !important;
}

.modern-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.85rem;
  color: #34495e;
}

.index-column {
  width: 5%;
}

.equipment-column {
  width: 20%;
}

.serial-no-column {
  width: 15%;
}

.due-date-column {
  width: 20%;
}

.client-column {
  width: 20%;
}

.city-column {
  width: 15%;
}

.action-column {
  width: 10%;
}

/* Service Request Button */
.service-request-btn {
  border: 2px solid transparent !important;
  background: linear-gradient(45deg, #4d90fe, #285bc7) !important;
  color: white !important;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 6px;
  padding: 4px 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.service-request-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #285bc7, #4d90fe) !important;
}

/* Section Title */
.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Alert Styling */
.alert-info {
  background: #e3f2fd !important;
  color: #1e88e5 !important;
  border-radius: 6px !important;
  font-size: 0.9rem;
}

/* Pagination */
.pagination {
  margin-top: 20px;
}

/* Slide Fade Transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>