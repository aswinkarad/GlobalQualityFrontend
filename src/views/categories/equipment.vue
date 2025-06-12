<template>
  <v-container class="px-4 hmmsdashboard" fluid style="min-height: 100vh; background: #F5F7FA;">
    <v-row align="center" class="top-bar">
      <v-col cols="12" md="6">
        <v-breadcrumbs :items="bread" class="breadcrumbs-container">
          <template v-slot:divider>
            <v-icon color="white">mdi-chevron-right</v-icon>
          </template>
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :to="item.to" :disabled="item.disabled" exact class="custom-breadcrumb-item">
              {{ item.text.toUpperCase() }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>

    <div class="text-h6 mb-2 category-title" style="font-family: 'Montserrat', sans-serif !important">
      EQUIPMENTS
    </div>

    <searchAndFilterToolbar :btn_text="cl_text" :show-button="showToolbar" :show-filter-icon="false"
      @btn_action="dialog = true" class="toolbar" />

    <v-table class="modern-table rounded-lg mt-8">
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">Name</th>
          <th class="text-left">Model Number</th>
          <th class="text-left">Image</th>
          <!-- <th class="text-left">Warranty Status</th> -->
          <th v-if="showToolbar" class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in equipmentListAll" :key="item.name" class="table-row-hover">
          <td>{{ i + 1 }}</td>
          <td>{{ item.equipmentName }}</td>
          <td>{{ item.model }}</td>
          <td>
            <div class="d-flex">
              <img height="80" width="110" :src="item.equipmentImage" alt="" class="equipment-image" />
            </div>
          </td>
          <!-- <td :style="{ color: item.warranty_status.status === 'Yes' ? 'green' : 'red' }">{{ item.warranty_status.status }}</td> -->
          <td v-if="showToolbar">
            <v-hover v-slot="{ isHovering, props }">
              <v-btn icon size="small" v-bind="props" class="mr-1" @click="openEditDialog(item)"
                :class="isHovering ? 'elevation-12' : 'elevation-2'" color="#4d90fe" style="cursor: pointer;">
                <v-icon size="18">mdi-pencil-outline</v-icon>
              </v-btn>
            </v-hover>
            <v-hover v-slot="{ isHovering, props }">
              <v-btn icon size="small" v-bind="props" class="mr-1" @click="openDeleteDialog(item)"
                :class="isHovering ? 'elevation-12' : 'elevation-2'" color="#285bc7" style="cursor: pointer;">
                <v-icon size="18" color="white">mdi-trash-can-outline</v-icon>
              </v-btn>
            </v-hover>
          </td>
        </tr>
      </tbody>
    </v-table>

    <paginationVue :length="equipmentTotalPage" @chanegePage="chanegePage" class="pagination" />
    <snackbarVue :visible="snackbar" :text="mssg" :button="false" :color="snackColor" @close="snackbar = false"
      class="snackbar-animation" />
    <deleteWarnVue :visible="delete_dialog" @close="delete_dialog = false" :item="deleteValue"
      @delete="deleteEquipment" />
    <addCat :visible="dialog" @close="dialog = false" @save="addEquipment" :title="dialog_title" :equipment="true"
      class="dialog-animation" />
    <editEquipment :visible="edit_dialog" @close="edit_dialog = false" :equipment="true" :item="edit_value"
      @update="update_equipment" class="dialog-animation" />
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import searchAndFilterToolbar from '@/components/searchAndFilterToolbar.vue';
import addCat from '@/components/categories/addCat.vue';
import deleteWarnVue from '@/components/deleteWarn.vue';
import editEquipment from '@/components/categories/editEquipment.vue';
import paginationVue from '@/components/pagination.vue';
import snackbarVue from '@/components/snackbar.vue';

export default {
  name: 'equipmentPage',
  components: {
    searchAndFilterToolbar,
    addCat,
    deleteWarnVue,
    editEquipment,
    paginationVue,
    snackbarVue,
  },
  data() {
    return {
      cl_text: 'Add Equipment',
      dialog: false,
      snackbar: false,
      mssg: '',
      snackColor: '',
      dialog_title: 'Add Equipment',
      delete_dialog: false,
      edit_dialog: false,
      edit_id: '',
      edit_value: {},
      deleteValue: {},
      showToolbar: false,
      bread: [
        { text: 'Home', disabled: false, exact: true, to: '/' },
        { text: 'Categories', disabled: false, exact: true, to: { name: 'category' } },
        { text: 'Sub Categories', disabled: false, exact: true, to: { name: 'subCat', params: { cat_name: this.$route.params.cat_name } } },
        { text: 'Equipments', disabled: true },
      ],
    };
  },
  computed: {
    ...mapState('equipments', ['equipmentListAll', 'editValue', 'equipmentTotalPage', 'result']),
  },
  methods: {
    ...mapActions('equipments', ['ADD_EQUIPMENT', 'GET_EQUIPMENT', 'DELETE_EQUIPMENT', 'GET_EQUIPMENT_BY_ID', 'UPDATE_EQUIPMENT']),
    isAdmin() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.role) {
        const userRole = user.role[0];
        if (userRole === 'Engineer') {
          this.showToolbar = false;
        } else {
          this.showToolbar = true;
        }
      }
    },
    async addEquipment(payload) {
      payload.id = this.$route.params.id;
      await this.ADD_EQUIPMENT(payload).then(() => {
        if (this.result && this.result.message === 'Validation error') {
          this.snackColor = 'error';
          this.mssg = `${payload.equipmentName} is Already Exist`;
          this.snackbar = true;
        } else {
          this.snackColor = 'success';
          this.mssg = 'Equipment Added Successfully';
          this.snackbar = true;
          this.getEquipment();
          this.dialog = false;
        }
      });
    },
    getEquipment() {
      this.GET_EQUIPMENT(this.$route.params);
    },
    openDeleteDialog(item) {
      this.deleteValue = item;
      this.delete_dialog = true;
    },
    async deleteEquipment(payload) {
      await this.DELETE_EQUIPMENT(payload).then(() => {
        this.snackColor = 'success';
        this.mssg = 'Equipment Deleted Successfully';
        this.snackbar = true;
        this.GET_EQUIPMENT(this.$route.params).then(() => {
          this.delete_dialog = false;
        });
      });
    },
    openEditDialog(item) {
      this.edit_id = item.id;
      this.edit_value = { ...item };
      this.$nextTick(() => {
        this.edit_dialog = true;
      });
    },
    async update_equipment(item) {
      item.id = this.edit_id;
      await this.UPDATE_EQUIPMENT(item).then(() => {
        this.snackColor = 'success';
        this.mssg = 'Equipment Updated Successfully';
        this.snackbar = true;
        this.GET_EQUIPMENT(this.$route.params).then(() => {
          this.edit_dialog = false;
        });
      }).catch((error) => {
        this.snackColor = 'error';
        this.mssg = 'Failed to Update Equipment';
        this.snackbar = true;
        console.error(error);
      });
    },
    chanegePage(page) {
      const params = this.$route.params;
      const payload = {
        params,
        query: {
          page: page,
          size: 15,
        },
      };
      this.GET_EQUIPMENT(payload);
    },
  },
  mounted() {
    this.isAdmin();
    this.getEquipment();
  },
};
</script>

<style scoped>
/* Base Container Styling */
.hmmsdashboard {
  min-height: 100vh;
  padding: 24px;
  position: relative;
  overflow-x: hidden;
  color: #1F2937;
  background: #F5F7FA;
}

/* Top Bar */
.top-bar {
  margin-bottom: 24px;
}

.breadcrumbs-container {
  background: #4d90fe;
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

/* Category Title */
.category-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #4d90fe;
  animation: slideInLeft 0.8s ease-out;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* Toolbar */
.toolbar {
  margin-top: 12px;
  animation: fadeInUp 0.8s ease-out;
}

/* Modern Table */
.modern-table {
  background: #FFFFFF;
  border-radius: 10px;
  padding: 12px;
  transition: all 0.4s ease;
  border: 1px solid rgba(77, 144, 254, 0.15);
  box-shadow: 0 4px 20px rgba(77, 144, 254, 0.2);
  animation: fadeIn 1s ease-out;
  font-family: 'Montserrat', sans-serif !important;
  overflow-x: auto;
}

.modern-table th {
  background: #4d90fe;
  color: #FFFFFF;
  padding: 12px 8px;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  font-size: 0.9rem;
}

.modern-table td {
  padding: 12px 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #1F2937;
}

.table-row-hover {
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.table-row-hover:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 20px rgba(77, 144, 254, 0.25);
  background: #F5F7FA;
}

.table-row-hover::before {
  /* content: ''; */
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(77, 144, 254, 0.15);
  transition: left 0.5s ease;
}

.table-row-hover:hover::before {
  left: 100%;
}

.equipment-image {
  border-radius: 6px;
  transition: transform 0.3s ease;
  object-fit: cover;
}

.table-row-hover:hover .equipment-image {
  transform: scale(1.05);
}

/* Actions */
.v-btn {
  border-radius: 6px;
  transition: all 0.3s ease;
}

.v-btn--icon {
  color: #4d90fe;
}

.v-btn--icon:hover {
  transform: scale(1.1);
  color: #285bc7;
}

/* Pagination */
.pagination {
  margin-top: 16px;
  animation: fadeInUp 0.8s ease-out;
}

/* Modal Styling (addCat, editEquipment, deleteWarnVue) */
.dialog-animation /deep/ .v-dialog {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(77, 144, 254, 0.3);
  padding: 12px;
  animation: zoomInPop 0.5s ease-out;
  max-width: 90%;
  width: 400px;
}

.dialog-animation /deep/ .v-card-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: #4d90fe;
  text-align: center;
}

.dialog-animation /deep/ .v-text-field .v-input__control {
  border-radius: 6px;
  background: #F5F7FA;
  transition: all 0.3s ease;
}

.dialog-animation /deep/ .v-text-field .v-input__control:hover {
  background: #E8ECEF;
  box-shadow: 0 2px 8px rgba(77, 144, 254, 0.2);
}

.dialog-animation /deep/ .v-btn {
  border-radius: 6px;
  transition: all 0.3s ease;
}

.dialog-animation /deep/ .v-btn--primary {
  background: #4d90fe;
  color: #FFFFFF;
}

.dialog-animation /deep/ .v-btn--primary:hover {
  transform: scale(1.05);
  background: #285bc7;
  box-shadow: 0 4px 12px rgba(77, 144, 254, 0.3);
}

/* Snackbar Animation */
.snackbar-animation {
  animation: slideInRight 0.5s ease-out;
}

/* CSS Keyframe Animations */
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

@keyframes zoomInPop {
  0% {
    opacity: 0;
    transform: scale(0.7);
  }

  60% {
    opacity: 1;
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slideInLeft {
  0% {
    opacity: 0;
    transform: translateX(-100px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes slideInRight {
  0% {
    opacity: 0;
    transform: translateX(100px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive Design */
@media (max-width: 960px) {
  .hmmsdashboard {
    padding: 16px;
  }

  .category-title {
    font-size: 1.5rem;
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

  .modern-table {
    margin-top: 12px;
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .modern-table th,
  .modern-table td {
    padding: 10px 6px;
    font-size: 0.8rem;
    min-width: 100px;
  }

  .modern-table th:first-child,
  .modern-table td:first-child {
    min-width: 40px;
  }

  .equipment-image {
    height: 60px;
    width: 80px;
  }

  .pagination {
    margin-top: 12px;
  }

  .dialog-animation /deep/ .v-dialog {
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
    padding: 12px;
  }

  .category-title {
    font-size: 1.2rem;
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

  .modern-table {
    margin-top: 10px;
  }

  .modern-table th,
  .modern-table td {
    padding: 8px 4px;
    font-size: 0.7rem;
    min-width: 80px;
  }

  .modern-table th:first-child,
  .modern-table td:first-child {
    min-width: 30px;
  }

  .equipment-image {
    height: 50px;
    width: 60px;
  }

  .v-btn--icon {
    width: 24px;
    height: 24px;
  }

  .v-icon {
    font-size: 14px;
  }

  .pagination {
    margin-top: 10px;
  }

  .dialog-animation /deep/ .v-dialog {
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

  .snackbar-animation {
    font-size: 0.7rem;
    padding: 5px;
  }
}
</style>