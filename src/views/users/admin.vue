<template>
    <v-container class="px-10 hmmsdashboard" fluid style="height:100vh;">
        <!-- Breadcrumb Navigation -->
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
                    {{ item.text }}
                </v-breadcrumbs-item>
            </template>
        </v-breadcrumbs>

        <div class="text-h6 mb-4 mt-6 dashboard-title">
            ADMIN
        </div>

        <Transition name="slide-fade">
            <div class="mt-4 mb-2">
                <v-row>
                    <v-col cols="12" md="10">
                        <!-- Assuming searchAndFilterToolbar has a search input -->
                        <v-text-field 
                            v-model="searchQuery" 
                            hide-details 
                            variant="outlined"
                            density="comfortable" 
                            placeholder="Search Admins"
                            prepend-inner-icon="mdi-magnify"
                            @input="filterAdmins"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2" style="align-self: center;">
                        <div class="d-flex justify-end">
                            <v-btn 
                                style="background: rgb(4 43 76);" 
                                @click="dialog = true"
                            >
                                <span style="color: white">Add Admin</span>
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
                <tr v-for="(item, i) in filteredAdminList" :key="item.id" class="table-row-hover">
                    <td>{{ i + 1 }}</td>
                    <td class="truncate">{{ item.username }}</td>
                    <td class="truncate">{{ item.email }}</td>
                    <td>
                        <v-hover v-slot="{ isHovering, props }">
                            <v-avatar rounded size="small" v-bind="props" class="mr-1"
                                :class="isHovering ? 'elevation-12' : 'elevation-2'" color="blue-darken-2"
                                style="cursor: pointer;" @click="openEditDialog(item)">
                                <v-icon size="18" icon="mdi-pencil-outline"></v-icon>
                            </v-avatar>
                        </v-hover>
                        <v-hover v-slot="{ isHovering, props }">
                            <v-avatar rounded size="small" v-bind="props" class="mr-1"
                                :class="isHovering ? 'elevation-12' : 'elevation-2'" color="#e9bc10"
                                style="cursor: pointer;" @click="openDeleteDialog(item)">
                                <v-icon size="18" color="white" icon="mdi-trash-can-outline"></v-icon>
                            </v-avatar>
                        </v-hover>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <div v-if="adminTotalPages > 0">
            <paginationVue :length="adminTotalPages" @chanegePage="chanegePage"/>
        </div>

        <addAdminVue 
            :visible="dialog" 
            @close="dialog = false" 
            @save="addCategory" 
            :title="dialog_title" 
        />
        <addAdminVue 
            :visible="editDialog" 
            @close="editDialog = false" 
            @save="updateAdmin" 
            :title="editDialog_title" 
            :item="selectedAdmin"
        />
        <deleteWarnVue 
            :visible="deleteDialog" 
            @close="deleteDialog = false" 
            @delete="deleteAdmin" 
            :item="selectedAdmin"
        />
    </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import addAdminVue from '@/components/addAdmin.vue';
import deleteWarnVue from '@/components/deleteWarn.vue';
import paginationVue from '@/components/pagination.vue';

export default {
    name: 'userPage',
    components: {
        addAdminVue,
        deleteWarnVue,
        paginationVue
    },
    data() {
        return {
            breadcrumbs: [
                { text: 'Home', disabled: false, href: '/' },
                { text: 'Admin', disabled: true, href: '/admin' },
            ],
            dialog: false,
            editDialog: false,
            deleteDialog: false,
            dialog_title: 'Add Admin',
            editDialog_title: 'Edit Admin',
            selectedAdmin: null,
            searchQuery: '',
            filteredAdminList: []
        }
    },
    computed: {
        ...mapState('admin', ['adminList', 'adminTotalPages'])
    },
    methods: {
        ...mapActions('admin', ['GET_ADMIN_LIST', 'ADD_ADMIN', 'UPDATE_ADMIN', 'DELETE_ADMIN']),

        chanegePage(page) {
            const query = {
                page: page,
                size: 15,
                search: this.searchQuery || ''
            };
            this.GET_ADMIN_LIST(query).then(() => {
                this.filterAdmins();
            });
        },

        filterAdmins() {
            if (this.searchQuery) {
                this.filteredAdminList = this.adminList.filter(admin =>
                    admin.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    admin.email.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            } else {
                this.filteredAdminList = [...this.adminList];
            }
        },

        openEditDialog(item) {
            this.selectedAdmin = { ...item };
            this.editDialog = true;
        },

        openDeleteDialog(item) {
            this.selectedAdmin = { ...item };
            this.deleteDialog = true;
        },

        addCategory(adminData) {
            this.ADD_ADMIN(adminData).then(() => {
                this.dialog = false;
                this.GET_ADMIN_LIST({ size: 15 });
            }).catch(error => {
                console.error('Error adding admin:', error);
            });
        },

        updateAdmin(updatedData) {
            this.UPDATE_ADMIN({
                id: this.selectedAdmin.id,
                ...updatedData
            }).then(() => {
                this.editDialog = false;
                this.selectedAdmin = null;
                this.GET_ADMIN_LIST({ size: 15 });
            }).catch(error => {
                console.error('Error updating admin:', error);
            });
        },

        deleteAdmin() {
            this.DELETE_ADMIN(this.selectedAdmin.id).then(() => {
                this.deleteDialog = false;
                this.selectedAdmin = null;
                this.GET_ADMIN_LIST({ size: 15 });
            }).catch(error => {
                console.error('Error deleting admin:', error);
            });
        }
    },
    watch: {
        adminList(newList) {
            this.filteredAdminList = [...newList];
            this.filterAdmins();
        }
    },
    mounted() {
        this.GET_ADMIN_LIST({ size: 15 }).then(() => {
            this.filteredAdminList = [...this.adminList];
        });
    }
}
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