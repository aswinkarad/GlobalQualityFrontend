<template>
  <v-container class="px-4 hmmsdashboard" fluid style="min-height: 100vh; background: linear-gradient(135deg, #F5F7FA, #E8ECEF);">
    <!-- Breadcrumb Navigation -->
    <v-row align="center" class="top-bar">
      <v-col cols="12" md="6">
        <v-breadcrumbs :items="breadcrumbs" class="breadcrumbs-container">
          <template v-slot:divider>
            <v-icon color="white">mdi-chevron-right</v-icon>
          </template>
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item 
              :href="item.href" 
              :disabled="item.disabled" 
              class="custom-breadcrumb-item"
            >
              {{ item.text.toUpperCase() }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>

    <div class="text-h6 mb-2 category-title" style="font-family: 'Montserrat', sans-serif !important">
      PREVENTIVE MAINTENANCE REMINDER
    </div>

    <!-- Search and Filter Toolbar -->
    <searchAndFilterToolbar 
      :auto="true" 
      :show-filter-icon="false" 
      :placeholder="'Search with Client, Equipment Name, or Serial No'" 
      @btn_action="openAddService" 
      @fiterWithName="searchByName" 
      @filterBtn="filterDisplay = !filterDisplay" 
      class="toolbar" 
    />

    <!-- Advanced Filters -->
    <Transition name="slide-fade">
      <div class="mt-4 mb-2 filter-container" v-if="filterDisplay">
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete 
              v-model="selectedClient" 
              clearable 
              hide-details 
              variant="outlined" 
              density="compact" 
              :items="clientList" 
              item-title="name" 
              item-value="id" 
              label="Client" 
              @update:modelValue="applyFilters"
              class="filter-input"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete 
              v-model="selectedEquipment" 
              clearable 
              hide-details 
              variant="outlined" 
              density="compact" 
              :items="allEquipments" 
              item-title="equipmentName" 
              item-value="id" 
              label="Equipment" 
              @update:modelValue="applyFilters"
              class="filter-input"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete 
              v-model="selectedCity" 
              clearable 
              hide-details 
              variant="outlined" 
              density="compact" 
              :items="cityList" 
              item-title="city" 
              item-value="id" 
              label="City" 
              @update:modelValue="applyFilters"
              class="filter-input"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-autocomplete 
              v-model="selectedSerialNo" 
              clearable 
              hide-details 
              variant="outlined" 
              density="compact" 
              :items="serialNoList" 
              item-title="serialNo" 
              item-value="serialNo" 
              label="Serial Number" 
              @update:modelValue="applyFilters"
              class="filter-input"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="3" class="d-flex align-center">
            <v-btn 
              class="filter-btn" 
              style="background: linear-gradient(45deg, #4d90fe, #285bc7); color: white;" 
              @click="applyFilters"
            >
              Filter
            </v-btn>
            <v-btn 
              class="ml-2 clear-btn" 
              variant="text" 
              color="#4d90fe" 
              @click="resetFilters"
            >
              Clear
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </Transition>

    <!-- Maintenance Reminder Tables by Time Range -->
    <v-row class="mt-4">
      <!-- 0-30 Days -->
      <v-col cols="12">
        <h3 class="section-title">0-30 Days</h3>
        <v-table v-if="range0to30.length" class="modern-table rounded-lg">
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
                <v-btn
                  color="#4d90fe"
                  variant="text"
                  size="small"
                  @click="goToServiceRequest(item.id)"
                  class="service-request-btn"
                >
                  Service Request
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-alert v-else type="info" class="mt-2 alert-info">No data for 0-30 days</v-alert>
      </v-col>

      <!-- 30-60 Days -->
      <v-col cols="12">
        <h3 class="section-title">30-60 Days</h3>
        <v-table v-if="range30to60.length" class="modern-table rounded-lg">
          <thead>
            <tr>
              <th class="text-left index-column">#</th>
              <th class="text-left equipment-column">Equipment</th>
              <th class="text-left serial-no-column">Serial No</th>
              <th class="text-left due-date-column">Due Date (days remaining)</th>
              <th class="text-left client-column">Client</th>
              <th class="text-left city-column">City</th>
              <th class="text-left action-column">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in range30to60" :key="item.id" class="table-row-hover">
              <td class="index-column">{{ i + 1 }}</td>
              <td class="equipment-column">{{ item.sale?.equipment?.equipmentName || 'N/A' }}</td>
              <td class="serial-no-column">{{ item.sale?.serialNo || 'N/A' }}</td>
              <td class="due-date-column">
                {{ formatDate(item.maintenancePeriod) }}
                ({{ getDaysRemaining(item.maintenancePeriod) }})
              </td>
              <td class="client-column">{{ item.sale?.client?.name || 'N/A' }}</td>
              <td class="city-column">{{ item.sale?.client?.city?.city || 'N/A' }}</td>
              <td class="action-column">
                <v-btn
                  color="#4d90fe"
                  variant="text"
                  size="small"
                  @click="goToServiceRequest(item.id)"
                  class="service-request-btn"
                >
                  Service Request
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-alert v-else type="info" class="mt-2 alert-info">No data for 30-60 days</v-alert>
      </v-col>

      <!-- 60-90 Days -->
      <v-col cols="12">
        <h3 class="section-title">60-90 Days</h3>
        <v-table v-if="range60to90.length" class="modern-table rounded-lg">
          <thead>
            <tr>
              <th class="text-left index-column">#</th>
              <th class="text-left equipment-column">Equipment</th>
              <th class="text-left serial-no-column">Serial No</th>
              <th class="text-left due-date-column">Due Date (days remaining)</th>
              <th class="text-left client-column">Client</th>
              <th class="text-left city-column">City</th>
              <th class="text-left action-column">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in range60to90" :key="item.id" class="table-row-hover">
              <td class="index-column">{{ i + 1 }}</td>
              <td class="equipment-column">{{ item.sale?.equipment?.equipmentName || 'N/A' }}</td>
              <td class="serial-no-column">{{ item.sale?.serialNo || 'N/A' }}</td>
              <td class="due-date-column">
                {{ formatDate(item.maintenancePeriod) }}
                ({{ getDaysRemaining(item.maintenancePeriod) }})
              </td>
              <td class="client-column">{{ item.sale?.client?.name || 'N/A' }}</td>
              <td class="city-column">{{ item.sale?.client?.city?.city || 'N/A' }}</td>
              <td class="action-column">
                <v-btn
                  color="#4d90fe"
                  variant="text"
                  size="small"
                  @click="goToServiceRequest(item.id)"
                  class="service-request-btn"
                >
                  Service Request
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-alert v-else type="info" class="mt-2 alert-info">No data for 60-90 days</v-alert>
      </v-col>

      <!-- 90+ Days -->
      <v-col cols="12">
        <h3 class="section-title">90+ Days</h3>
        <v-table v-if="range90plus.length" class="modern-table rounded-lg">
          <thead>
            <tr>
              <th class="text-left index-column">#</th>
              <th class="text-left equipment-column">Equipment</th>
              <th class="text-left serial-no-column">Serial No</th>
              <th class="text-left due-date-column">Due Date (days remaining)</th>
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
                ({{ getDaysRemaining(item.maintenancePeriod) }})
              </td>
              <td class="client-column">{{ item.sale?.client?.name || 'N/A' }}</td>
              <td class="city-column">{{ item.sale?.client?.city?.city || 'N/A' }}</td>
              <td class="action-column">
                <v-btn
                  color="#4d90fe"
                  variant="text"
                  size="small"
                  @click="goToServiceRequest(item.id)"
                  class="service-request-btn"
                >
                  Service Request
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-alert v-else type="info" class="mt-2 alert-info">No data for 90+ days</v-alert>
      </v-col>
    </v-row>

    <!-- Pagination -->
    <paginationVue v-if="hasData" :length="preventiveTotalPage" @changePage="changePage" class="pagination" />

    <!-- Delete Confirmation Dialog -->
    <deleteWarnVue :visible="delete_dialog" @close="delete_dialog = false" :item="deleteValue" :log="true" @delete="update" class="dialog-animation" />
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import moment from 'moment';
import deleteWarnVue from '@/components/deleteWarn.vue';
import paginationVue from '@/components/pagination.vue';
import searchAndFilterToolbar from '@/components/searchAndFilterToolbar.vue';

export default {
  name: 'preventiveReminder',
  components: {
    searchAndFilterToolbar,
    deleteWarnVue,
    paginationVue,
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
        if (!item?.sale?.client || !item?.sale?.equipment || !item?.sale?.serialNo || !item?.maintenancePeriod) {
          console.warn('Invalid item structure:', item);
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
        return searchMatch && clientMatch && equipmentMatch && cityMatch && serialNoMatch;
      });
    },
    range0to30() {
      return this.filteredList.filter(item => {
        const days = this.getDaysNumeric(item.maintenancePeriod);
        return days !== null && Math.abs(days) <= 30;
      });
    },
    range30to60() {
      return this.filteredList.filter(item => {
        const days = this.getDaysNumeric(item.maintenancePeriod);
        return days !== null && days > 30 && days <= 60;
      });
    },
    range60to90() {
      return this.filteredList.filter(item => {
        const days = this.getDaysNumeric(item.maintenancePeriod);
        return days !== null && days > 60 && days <= 90;
      });
    },
    range90plus() {
      return this.filteredList.filter(item => {
        const days = this.getDaysNumeric(item.maintenancePeriod);
        return days !== null && days > 90;
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
        console.warn('Invalid date:', date);
        return null;
      }
      const dueDate = moment(date);
      const today = moment().startOf('day');
      return dueDate.diff(today, 'days');
    },
    getDaysDisplay(date) {
      const days = this.getDaysNumeric(date);
      if (days === null) return 'Invalid date';
      return days >= 0 ? `in ${days} days` : `${Math.abs(days)} days ago`;
    },
    getDaysRemaining(date) {
      const days = this.getDaysNumeric(date);
      if (days === null) return 'Invalid date';
      return `${days} days remaining`;
    },
    formatDate(date) {
      if (!date || !moment(date).isValid()) return 'N/A';
      return moment(date).format('YYYY-MM-DD');
    },
    searchByName(val) {
      this.searchQuery = val || '';
      this.applyFilters();
    },
    applyFilters() {
      this.searchByName(this.searchQuery);
      this.logFilteredData();
    },
    resetFilters() {
      this.searchQuery = '';
      this.selectedClient = null;
      this.selectedEquipment = null;
      this.selectedCity = null;
      this.selectedSerialNo = null;
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
        await this.GET_PREVENTIVE_LIST();
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
      console.log('Open Add Service');
    },
    goToServiceRequest(id) {
      this.$router.push(`/service-request/${id}`);
    },
    logPreventiveListStructure() {
      console.log('Preventive List Structure:', {
        type: typeof this.preventiveList,
        isArray: Array.isArray(this.preventiveList),
        length: this.preventiveList?.length || 0,
        sample: this.preventiveList?.slice(0, 2),
      });
    },
    logFilteredData() {
      console.log('Filtered Data:', {
        '0-30 Days': this.range0to30.length,
        '30-60 Days': this.range30to60.length,
        '60-90 Days': this.range60to90.length,
        '90+ Days': this.range90plus.length,
        sample0to30: this.range0to30.slice(0, 2),
        sample30to60: this.range30to60.slice(0, 2),
        sample60to90: this.range60to90.slice(0, 2),
        sample90plus: this.range90plus.slice(0, 2),
      });
    },
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
        this.logPreventiveListStructure();
        this.logFilteredData();
      });
    } catch (error) {
      console.error('Error during mounted:', error);
    }
  },
};
</script>

<style scoped>
.hmmsdashboard {
  min-height: 100vh;
  padding: 16px;
  position: relative;
  overflow-x: hidden;
  color: #1F2937;
}

.top-bar {
  margin-bottom: 24px;
}

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

.category-title {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(45deg, #4d90fe, #285bc7);
  -webkit-background-clip: text;
  color: transparent;
  animation: slideInLeft 0.8s ease-out;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #285bc7;
  margin-bottom: 12px;
  animation: fadeIn 0.8s ease-out;
}

.toolbar {
  margin-top: 12px;
  animation: fadeInUp 0.8s ease-out;
}

.filter-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(77, 144, 254, 0.2);
  animation: fadeIn 0.8s ease-out;
}

.filter-input /deep/ .v-input__control {
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.filter-input /deep/ .v-input__control:hover {
  background: rgba(245, 247, 250, 0.95);
  box-shadow: 0 2px 8px rgba(77, 144, 254, 0.2);
}

.filter-btn, .clear-btn, .service-request-btn {
  border-radius: 6px;
  transition: all 0.3s ease;
  text-transform: none;
}

.filter-btn {
  background: linear-gradient(45deg, #4d90fe, #285bc7);
  color: white;
}

.filter-btn:hover, .clear-btn:hover, .service-request-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(77, 144, 254, 0.3);
}

.modern-table {
  background: #FFFFFF;
  border-radius: 10px;
  padding: 0;
  transition: all 0.4s ease;
  border: 1px solid rgba(77, 144, 254, 0.15);
  box-shadow: 0 4px 20px rgba(77, 144, 254, 0.2);
  animation: fadeIn 1s ease-out;
  font-family: 'Montserrat', sans-serif !important;
  overflow-x: auto;
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
}

.modern-table th,
.modern-table td {
  padding: 12px 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #1F2937;
  vertical-align: middle;
  border-bottom: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.modern-table th {
  background: #285bc7;
  color: #FFFFFF;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  font-size: 0.9rem;
  position: sticky;
  top: 0;
  z-index: 1;
}

.index-column {
  width: 5%;
  min-width: 40px;
}

.equipment-column {
  width: 20%;
  min-width: 150px;
}

.serial-no-column {
  width: 15%;
  min-width: 100px;
}

.due-date-column {
  width: 20%;
  min-width: 150px;
}

.client-column {
  width: 20%;
  min-width: 150px;
}

.city-column {
  width: 15%;
  min-width: 100px;
}

.action-column {
  width: 10%;
  min-width: 120px;
}

.modern-table tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}

.table-row-hover {
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.table-row-hover:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 20px rgba(77, 144, 254, 0.25);
  background: rgba(245, 247, 250, 0.95);
}

.table-row-hover::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(77, 144, 254, 0.15), transparent);
  transition: left 0.5s ease;
}

.table-row-hover:hover::before {
  left: 100%;
}

.alert-info {
  border-radius: 8px;
  background: rgba(77, 144, 254, 0.1);
  color: #285bc7;
  font-weight: 500;
  animation: fadeIn 0.8s ease-out;
}

.pagination {
  margin-top: 16px;
  animation: fadeInUp 0.8s ease-out;
}

.dialog-animation /deep/ .v-dialog,
.dialog-animation /deep/ .v-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(245, 247, 250, 0.9));
  backdrop-filter: blur(8px);
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(77, 144, 254, 0.3);
  padding: 12px;
  animation: zoomInPop 0.5s ease-out;
  max-width: 90%;
  width: 400px;
  border: 1px solid rgba(77, 144, 254, 0.2);
}

.dialog-animation /deep/ .v-card-title {
  font-size: 1.4rem;
  font-weight: bold;
  background: linear-gradient(45deg, #4d90fe, #285bc7);
  -webkit-background-clip: text;
  color: transparent;
  text-align: center;
  padding: 16px;
  border-bottom: 1px solid rgba(77, 144, 254, 0.2);
}

.dialog-animation /deep/ .v-card-text {
  padding: 20px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

.dialog-animation /deep/ .v-text-field .v-input__control {
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.dialog-animation /deep/ .v-text-field .v-input__control:hover {
  background: rgba(245, 247, 250, 0.95);
  box-shadow: 0 2px 8px rgba(77, 144, 254, 0.2);
}

.dialog-animation /deep/ .v-btn {
  border-radius: 6px;
  transition: all 0.3s ease;
  text-transform: none;
  font-weight: 600;
}

.dialog-animation /deep/ .v-btn--primary {
  background: linear-gradient(45deg, #4d90fe, #285bc7);
  color: #FFFFFF;
}

.dialog-animation /deep/ .v-btn--primary:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(77, 144, 254, 0.3);
}

@keyframes slideInDown {
  0% { opacity: 0; transform: translateY(-100%); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes zoomInPop {
  0% { opacity: 0; transform: scale(0.7); }
  60% { opacity: 1; transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes slideInLeft {
  0% { opacity: 0; transform: translateX(-100px); }
  100% { opacity: 1; transform: translateX(0); }
}

@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(50px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

@media (max-width: 960px) {
  .hmmsdashboard {
    padding: 12px;
  }

  .category-title {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 1.2rem;
  }

  .breadcrumbs-container {
    padding: 8px 12px;
  }

  .custom-breadcrumb-item {
    font-size: 0.9rem;
  }

  .toolbar {
    margin-top: 10px;
  }

  .filter-container {
    padding: 10px;
  }

  .modern-table {
    margin-top: 12px;
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .modern-table th, .modern-table td {
    padding: 10px 6px;
    font-size: 0.8rem;
    min-width: 80px;
  }

  .index-column {
    width: 40px;
    min-width: 40px;
  }

  .equipment-column {
    width: 120px;
    min-width: 120px;
  }

  .serial-no-column {
    width: 80px;
    min-width: 80px;
  }

  .due-date-column {
    width: 120px;
    min-width: 120px;
  }

  .client-column {
    width: 120px;
    min-width: 120px;
  }

  .city-column {
    width: 80px;
    min-width: 80px;
  }

  .action-column {
    width: 100px;
    min-width: 100px;
  }

  .pagination {
    margin-top: 12px;
  }

  .dialog-animation /deep/ .v-dialog,
  .dialog-animation /deep/ .v-card {
    width: 350px;
    padding: 10px;
  }

  .dialog-animation /deep/ .v-card-title {
    font-size: 1.3rem;
  }

  .dialog-animation /deep/ .v-btn {
    padding: 5px 12px;
  }
}

@media (max-width: 600px) {
  .hmmsdashboard {
    padding: 8px;
  }

  .category-title {
    font-size: 1.2rem;
  }

  .section-title {
    font-size: 1rem;
  }

  .breadcrumbs-container {
    padding: 6px 10px;
  }

  .custom-breadcrumb-item {
    font-size: 0.8rem;
  }

  .toolbar {
    margin-top: 8px;
  }

  .filter-container {
    padding: 8px;
  }

  .filter-btn, .clear-btn, .service-request-btn {
    font-size: 0.8rem;
    padding: 6px 12px;
  }

  .modern-table {
    margin-top: 10px;
  }

  .modern-table th, .modern-table td {
    padding: 8px 4px;
    font-size: 0.7rem;
    min-width: 60px;
  }

  .index-column {
    width: 30px;
    min-width: 30px;
  }

  .equipment-column {
    width: 100px;
    min-width: 100px;
  }

  .serial-no-column {
    width: 60px;
    min-width: 60px;
  }

  .due-date-column {
    width: 100px;
    min-width: 100px;
  }

  .client-column {
    width: 100px;
    min-width: 100px;
  }

  .city-column {
    width: 60px;
    min-width: 60px;
  }

  .action-column {
    width: 80px;
    min-width: 80px;
  }

  .alert-info {
    font-size: 0.8rem;
    padding: 8px;
  }

  .pagination {
    margin-top: 10px;
  }

  .dialog-animation /deep/ .v-dialog,
  .dialog-animation /deep/ .v-card {
    width: 90%;
    padding: 8px;
  }

  .dialog-animation /deep/ .v-card-title {
    font-size: 1.1rem;
  }

  .dialog-animation /deep/ .v-text-field .v-input__control {
    font-size: 0.8rem;
  }

  .dialog-animation /deep/ .v-btn {
    padding: 4px 8px;
    font-size: 0.7rem;
  }
}
</style>