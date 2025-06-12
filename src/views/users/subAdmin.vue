<template>
  <v-container class="px-10 hmmsdashboard" fluid style="height: 100vh;">
    <!-- Breadcrumb Navigation -->
    <v-breadcrumbs :items="breadcrumbs" class="breadcrumbs-container">
      <template v-slot:divider>
        <v-icon color="white">mdi-chevron-right</v-icon>
      </template>
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :href="item.href" :disabled="item.disabled" class="custom-breadcrumb-item">
          {{ item.text }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>

    <div class="text-h6 mb-4 mt-6 dashboard-title">
      SUB ADMIN
    </div>

    <Transition name="slide-fade">
      <div class="mt-4 mb-2">
        <v-row>
          <v-col cols="12" md="10">
            <v-text-field 
              v-model="searchQuery" 
              hide-details 
              variant="outlined"
              density="comfortable" 
              placeholder="Search Sub Admins"
              prepend-inner-icon="mdi-magnify"
              @input="filterSubAdmins"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2" style="align-self: center;">
            <div class="d-flex justify-end">
              <v-btn 
                style="background: rgb(4 43 76);" 
                @click="dialog = true"
              >
                <span style="color: white">Add Sub Admin</span>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>
    </Transition>

    <v-table class="rounded-lg mt-6 modern-table">
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">NAME</th>
          <th class="text-left">EMAIL</th>
          <th class="text-left">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in filteredSubAdminList" :key="item.id" class="table-row-hover">
          <td>{{ i + 1 }}</td>
          <td class="truncate">{{ item.username }}</td>
          <td class="truncate">{{ item.email }}</td>
          <td>
            <v-hover v-slot="{ isHovering, props }">
              <v-avatar rounded size="small" v-bind="props" class="mr-1" @click="openEditDialog(item)"
                :class="isHovering ? 'elevation-12' : 'elevation-2'" color="blue-darken-2"
                style="cursor: pointer;">
                <v-icon size="18" icon="mdi-pencil-outline"></v-icon>
              </v-avatar>
            </v-hover>
            <v-hover v-slot="{ isHovering, props }">
              <v-avatar rounded size="small" v-bind="props" class="mr-1" @click="openDeleteWarn(item)"
                :class="isHovering ? 'elevation-12' : 'elevation-2'" color="#e9bc10"
                style="cursor: pointer;">
                <v-icon size="18" color="white" icon="mdi-trash-can-outline"></v-icon>
              </v-avatar>
            </v-hover>
          </td>
        </tr>
      </tbody>
    </v-table>

    <div v-if="subAdminTotalPage > 0">
      <paginationVue :length="subAdminTotalPage" @changePage="changePage" />
    </div>

    <addAdminVue :visible="dialog" @close="dialog = false" @save="addSubAdmin" :title="dialog_title" />
    <editUser :visible="edit_dialog" @close="edit_dialog = false" @save="updateSubAdmin" :title="edit_dialog_title"
      :item="editValue" />
    <deleteWarnVue :visible="delete_dialog" @close="delete_dialog = false" :item="deleteValue"
      @delete="deleteSubAdmin" />

    <v-snackbar v-model="snackbar.show" :color="snackbar.type" timeout="3000">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import deleteWarnVue from '@/components/deleteWarn.vue';
import { mapActions, mapState } from 'vuex';
import addAdminVue from '@/components/addAdmin.vue';
import editUser from '@/components/edituser.vue';
import paginationVue from '@/components/pagination.vue';
import _ from 'lodash';

export default {
  name: 'subAdmin',
  components: {
    addAdminVue,
    deleteWarnVue,
    editUser,
    paginationVue,
  },
  data() {
    return {
      breadcrumbs: [
        { text: 'Home', disabled: false, href: '/' },
        { text: 'Sub Admin', disabled: true, href: '/sub-admin' },
      ],
      dialog: false,
      dialog_title: 'Add Sub Admin',
      edit_dialog_title: 'Edit Sub Admin',
      edit_dialog: false,
      delete_dialog: false,
      deleteValue: null,
      editValue: null,
      editSubAdminId: null,
      searchQuery: '',
      filteredSubAdminList: [],
      snackbar: {
        show: false,
        text: '',
        type: 'success',
      },
    };
  },
  computed: {
    ...mapState('subAdmin', ['subAdminList', 'editUserValue', 'subAdminTotalPage']),
  },
  methods: {
    ...mapActions('subAdmin', ['GET_SABADMIN_LIST', 'ADD_SUBADMIN', 'DELETE_SUBADMIN', 'GET_USER_WITH_ID', 'UPDATE_SUBADMIN']),

    async addSubAdmin(payload) {
      try {
        await this.ADD_SUBADMIN(payload);
        await this.GET_SABADMIN_LIST({ size: 15 });
        this.dialog = false;
        this.snackbar = {
          show: true,
          text: 'Sub-admin added successfully!',
          type: 'success',
        };
      } catch (error) {
        console.error('Error adding sub-admin:', error);
        this.snackbar = {
          show: true,
          text: error.message,
          type: 'error',
        };
      }
    },

    openDeleteWarn(item) {
      if (!item || !item.id) {
        this.snackbar = {
          show: true,
          text: 'Invalid sub-admin selected for deletion.',
          type: 'error',
        };
        return;
      }
      this.deleteValue = item;
      this.delete_dialog = true;
    },

    async deleteSubAdmin(item) {
      try {
        await this.DELETE_SUBADMIN({ id: item.id });
        await this.GET_SABADMIN_LIST({ size: 15 });
        this.delete_dialog = false;
        this.deleteValue = null;
        this.snackbar = {
          show: true,
          text: 'Sub-admin deleted successfully!',
          type: 'success',
        };
      } catch (error) {
        console.error('Error deleting sub-admin:', error);
        this.snackbar = {
          show: true,
          text: error.message,
          type: 'error',
        };
      }
    },

    async openEditDialog(item) {
      try {
        if (!item || !item.id) {
          throw new Error('Invalid item or ID');
        }
        this.editSubAdminId = item.id;
        await this.GET_USER_WITH_ID({ id: item.id });
        this.editValue = { ...this.editUserValue };
        this.edit_dialog = true;
      } catch (error) {
        console.error('Error opening edit dialog:', error);
        this.snackbar = {
          show: true,
          text: error.message,
          type: 'error',
        };
      }
    },

    async updateSubAdmin(item) {
      try {
        const payload = {
          id: this.editSubAdminId,
          ...item,
        };
        await this.UPDATE_SUBADMIN(payload);
        await this.GET_SABADMIN_LIST({ size: 15 });
        this.edit_dialog = false;
        this.editValue = null;
        this.editSubAdminId = null;
        this.snackbar = {
          show: true,
          text: 'Sub-admin updated successfully!',
          type: 'success',
        };
      } catch (error) {
        console.error('Error updating sub-admin:', error);
        this.snackbar = {
          show: true,
          text: error.message,
          type: 'error',
        };
      }
    },

    changePage(page) {
      const query = {
        page,
        size: 15,
        search: this.searchQuery || '',
      };
      this.GET_SABADMIN_LIST(query).then(() => {
        this.filteredSubAdminList = this.subAdminList.filter(item => item && item.id && item.username && item.email);
      }).catch(error => {
        this.snackbar = {
          show: true,
          text: error.message,
          type: 'error',
        };
      });
    },

    filterSubAdmins: _.debounce(function () {
      const query = {
        page: 1,
        size: 15,
        search: this.searchQuery || '',
      };
      this.GET_SABADMIN_LIST(query).then(() => {
        this.filteredSubAdminList = this.subAdminList.filter(item => item && item.id && item.username && item.email);
      }).catch(error => {
        this.snackbar = {
          show: true,
          text: error.message,
          type: 'error',
        };
      });
    }, 500),
  },
  watch: {
    subAdminList(newList) {
      this.filteredSubAdminList = newList.filter(item => item && item.id && item.username && item.email);
    },
  },
  mounted() {
    this.GET_SABADMIN_LIST({ size: 15 }).then(() => {
      this.filteredSubAdminList = this.subAdminList.filter(item => item && item.id && item.username && item.email);
    }).catch(error => {
      this.snackbar = {
        show: true,
        text: error.message,
        type: 'error',
      };
    });
  },
};
</script>

<style scoped>
.hmmsdashboard {
  background: linear-gradient(135deg, #F5F7FA, #E8ECEF);
  min-height: 100vh;
  padding: 20px;
}

.breadcrumbs-container {
  background: linear-gradient(90deg, #4d90fe, #285bc7);
  border-radius: 8px;
  padding: 10px 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.custom-breadcrumb-item {
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
}

.custom-breadcrumb-item:hover {
  color: #E8ECEF;
  transform: scale(1.05);
}

.dashboard-title {
  font-family: 'Montserrat', sans-serif;
  color: #2A4066;
  font-weight: 700;
}

.modern-table {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

.modern-table th {
  background: #042B4C;
  color: white !important;
  padding: 12px;
  font-weight: 600;
}

.table-row-hover:hover {
  background: #f5f7fa;
}

.v-table tbody tr td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  font-size: small;
  font-weight: 500;
}

.v-table {
  font-family: 'Montserrat', sans-serif;
}

.truncate {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 600px) {
  .truncate {
    max-width: 100px;
  }

  .v-table tbody tr td {
    padding: 8px;
    font-size: x-small;
  }

  .v-table thead tr th {
    padding: 8px;
    font-size: small;
  }
}
</style>

<style>
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