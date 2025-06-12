<template>
    <v-container class="client-details-container px-10" fluid>
      <!-- Breadcrumbs Component -->
      <breadcrumbs :items="breadcrumbs" class="breadcrumbs-section" />
      
      <!-- Back Button with Label -->
  
      <!-- Client Information Card -->
      <v-card class="client-details-card elevation-3 mb-6">
        <v-card-title class="card-header py-4">
          <v-icon class="mr-2">mdi-account</v-icon>
          Client Information
        </v-card-title>
        
        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12" md="4">
              <div class="info-item">
                <span class="info-label">Name:</span>
                <span class="info-value">{{ editClientValue.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Contact 1:</span>
                <span class="info-value">{{ editClientValue.contact1 }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Contact 2:</span>
                <span class="info-value">{{ editClientValue.contact2 }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">{{ editClientValue.email }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="info-item">
                <span class="info-label">Type:</span>
                <span class="info-value" v-if="editClientValue.clienttype">{{ editClientValue.clienttype.client_type }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">City:</span>
                <span class="info-value" v-if="editClientValue.city">{{ editClientValue.city.city }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Zip:</span>
                <span class="info-value">{{ editClientValue.zip }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Landmark:</span>
                <span class="info-value">{{ editClientValue.landmark }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="info-item">
                <span class="info-label">Address 1:</span>
                <span class="info-value">{{ editClientValue.address1 }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Address 2:</span>
                <span class="info-value">{{ editClientValue.address2 }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
  
      <!-- Sales History Card -->
      <v-card class="sales-history-card elevation-3">
        <v-card-title class="card-header py-4">
          <v-icon  class="mr-2">mdi-shopping</v-icon>
          Sales History
        </v-card-title>
        
        <v-card-text class="pa-0">
          <v-table class="sales-table">
            <thead>
              <tr>
                <th class="text-left">#</th>
                <th class="text-left">Serial Number</th>
                <th class="text-left">Equipment</th>
                <!-- <th class="text-left">Order Date</th> -->
                
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in editClientValue.sales" :key="i" class="table-row">
                <td>{{ i + 1 }}</td>
                <td>{{ item.serialNo }}</td>
                <td><span v-if="item.equipment">{{ item.equipment.equipmentName }}</span></td>
                <!-- <td>{{ formatDate(item.orderDate) }}</td> -->
            
              </tr>
              <tr v-if="!editClientValue.sales || editClientValue.sales.length === 0">
                <td colspan="5" class="text-center py-4">No sales records found</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import { mapActions, mapState } from 'vuex';
  import Breadcrumbs from '../../components/Breadcrumbs.vue';
  
  export default {
    name: 'clientInnerpage',
    components: {
      Breadcrumbs,
    },
    data() {
      return {
        breadcrumbs: [
          { text: 'Home', disabled: false, href: '/' },
          { text: 'Clients', disabled: false, href: '/client' },
          { text: 'Client Details', disabled: true, href: '' },
        ],
      };
    },
    computed: {
      ...mapState('clients', ['editClientValue']),
    },
    methods: {
      ...mapActions('clients', ['GET_CLIENT_BY_ID']),
      async getClientDetails() {
        await this.GET_CLIENT_BY_ID(this.$route.params).then(() => {
          console.log(this.editClientValue);
        });
      },
      formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    },
    mounted() {
      this.getClientDetails();
    },
  };
  </script>
  
  <style scoped>
  /* Main Container Styling */
  .client-details-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4ecf7 100%);
    padding: 24px 40px !important;
    font-family: 'Montserrat', sans-serif;
  }
  
  /* Breadcrumbs Section */
  .breadcrumbs-section {
    margin-bottom: 16px;
  }
  
  /* Back Button Styling */
  .back-button-container {
    margin-bottom: 20px;
  }
  
  .back-btn {
    transition: transform 0.2s;
  }
  
  .back-btn:hover {
    transform: translateX(-5px);
  }
  
  /* Client Details Card */
  .client-details-card, .sales-history-card {
    border-radius: 12px;
    overflow: hidden;
    background-color: #ffffff;
    transition: box-shadow 0.3s ease;
    border: none;
  }
  
  .client-details-card:hover, .sales-history-card:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1) !important;
  }
  
  .card-header {
   background-color:rgb(26, 19, 19)mportant;
    color: rgb(7, 5, 5);
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  
  /* Client Information Styling */
  .info-item {
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
  }
  
  .info-label {
    color: #607d8b;
    font-weight: 500;
    min-width: 100px;
    display: inline-block;
  }
  
  .info-value {
    color: #263238;
    font-weight: 600;
    padding-left: 8px;
  }
  
  /* Sales Table Styling */
  .sales-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }
  
  .sales-table thead tr th {
    background: #f5f7fa;
    color: #3f51b5;
    font-weight: 600 !important;
    padding: 16px;
    font-size: 0.95rem;
    border-bottom: 2px solid rgba(63, 81, 181, 0.1);
    letter-spacing: 0.5px;
  }
  
  .table-row {
    transition: background-color 0.2s;
  }
  
  .table-row:hover {
    background-color: rgba(83, 109, 254, 0.05) !important;
  }
  
  .sales-table tbody tr td {
    padding: 14px 16px;
    font-size: 0.9rem;
    color: #455a64;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
  
  .sales-table tbody tr:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, 0.02);
  }
  
  /* Responsive Design */
  @media (max-width: 960px) {
    .client-details-container {
      padding: 16px 24px !important;
    }
    
    .card-header {
      padding: 16px !important;
    }
    
    .info-item {
      margin-bottom: 10px;
    }
    
    .info-label {
      min-width: 80px;
    }
  }
  
  @media (max-width: 600px) {
    .client-details-container {
      padding: 12px 16px !important;
    }
    
    .card-header {
      padding: 12px !important;
      font-size: 1.1rem;
    }
    
    .info-item {
      margin-bottom: 8px;
    }
    
    .info-label, .info-value {
      display: block;
      padding-left: 0;
    }
    
    .sales-table thead tr th,
    .sales-table tbody tr td {
      padding: 10px;
      font-size: 0.85rem;
    }
  }
  </style>