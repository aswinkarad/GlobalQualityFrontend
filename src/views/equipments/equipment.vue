<template>
    <v-container class="px-10" fluid style="height:100vh; background:#e7f0f7;">
        <!-- Breadcrumb Navigation -->
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
                        <v-autocomplete v-model="city" clearable hide-details variant="outlined" density="compact"
                            :items="cityList" item-title="city" item-value="id" label="City"></v-autocomplete>
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
                    <tr v-for="(item) in saleEquipmentList" :key="item.id">
                        <td>{{ item.serialNo }}</td>
                        <td>{{ item.equipment?.equipmentName || 'N/A' }}</td>
                        <td v-if="item.client?.arabicname">{{ item.client.name + ' ' + item.client.arabicname }}</td>
                        <td v-else>{{ item.client?.name || 'N/A' }}</td>
                        <td>{{ item.equipment?.model || 'N/A' }}</td>
                        <td>{{ item.equipment?.subcategory?.category?.categoryName || 'N/A' }}</td>
                        <td>{{ item.installationDate?.split('T')[0] || 'N/A' }}</td>
                        <td>{{ item.warrantyDate?.split('T')[0] || 'N/A' }}</td>
                        <td>
                            <v-chip :color="getWarrantyStatus(item).color" size="small">
                                {{ getWarrantyStatus(item).text }}
                            </v-chip>
                        </td>
                        <td>
                            <v-btn 
                                v-if="showToolbar"
                                size="small"
                                :color="item.status === 1 ? 'warning' : 'error'"
                                @click="openBlockDialog(item)"
                            >
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
                                    <v-list-item @click="toInnerPage(item)">
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
        <editSaleEquipment :visible="edit_dialog" @close="edit_dialog = false" @save="editSale"
            :items="tempEditValue" />
        <editMaintCaldaysVue :visible="daysEdit_dialog" @close="daysEdit_dialog = false" @save="editSale"
            :items="tempEditValue" />
        <addEquipment :visible="dialog" @close="dialog = false" @save="addSale" :title="dialog_title" />
        <deleteWarnVue :visible="delete_dialog" @close="delete_dialog = false" :item="deleteValue"
            @delete="deleteSale" />
        <loadingDailogVue :visible="loading" @close="loading = false" />
        <snackbarVue :visible="snackbar" :text="mssg" :button="false" :color="snackColor" @close="snackbar = false" />
        
        <!-- Block Confirmation Dialog -->
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
            blockItem: {
                status: 0, // 0 for unblocked, 1 for blocked
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
    },
    methods: {
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
        getWarrantyStatus(item) {
            if (!item.warrantyDate) {
                return { text: 'Out of Warranty', color: 'red' };
            }
            const today = new Date();
            const warrantyEnd = new Date(item.warrantyDate);
            return warrantyEnd >= today
                ? { text: 'In Warranty', color: 'green' }
                : { text: 'Out of Warranty', color: 'red' };
        },
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
            'UPDATE_SALE_EQUIPMET',
        ]),
        displayFilter() {
            this.filterDisplay = !this.filterDisplay;
        },
        openBlockDialog(item) {
            this.blockItem = { ...item };
            this.block_dialog = true;
        },
        async confirmToggleStatus() {
            if (!this.blockItem.id) {
                console.error('No equipment selected for status toggle');
                this.mssg = 'No equipment selected';
                this.snackColor = 'error';
                this.snackbar = true;
                return;
            }
            const updatedItem = {
                ...this.blockItem,
                status: this.blockItem.status === 1 ? 0 : 1,
            };
            try {
                this.loading = true;
                await this.UPDATE_SALE_EQUIPMET(updatedItem);
                await this.GET_ALL_SALE_EQUIPMENT({
                    size: 15,
                    page: 1,
                    search: this.equipmentSearchVal || '',
                    cityid: this.city || '',
                    eid: this.equiId || '',
                });
                this.mssg =
                    updatedItem.status === 1
                        ? 'Equipment Blocked Successfully'
                        : 'Equipment Unblocked Successfully';
                this.snackColor = 'success';
                this.snackbar = true;
            } catch (error) {
                console.error('Error updating status:', error);
                this.mssg = 'Error updating equipment status';
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
        async deleteSale() {
            try {
                console.log('Step 1: Starting deleteSale for item:', this.deleteValue);
                await this.DELETE_SALE_EQUIPMENT(this.deleteValue.id);
                console.log('Step 2: Deletion successful, refreshing equipment list');
                await this.GET_ALL_SALE_EQUIPMENT({ size: 15 });
                this.mssg = 'Equipment deleted successfully';
                this.snackColor = 'success';
                this.snackbar = true;
                this.delete_dialog = false;
                this.deleteValue = {};
            } catch (error) {
                console.error('Step 3: Error in deleteSale:', {
                    message: error.message,
                    response: error.response
                        ? {
                              status: error.response.status,
                              data: error.response.data,
                          }
                        : 'No response data',
                });
                this.mssg = error.message || 'Error deleting equipment';
                this.snackColor = 'error';
                this.snackbar = true;
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
                await this.UPDATE_SALE_EQUIPMET(payload);
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
        toInnerPage(item) {
            this.$router.push({ name: 'saleEquip', params: { id: item.id } });
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
            const query = {
                page: page,
                size: 15,
                eid: this.equiId || '',
                cityid: this.city || '',
                search: this.equipmentSearchVal || '',
            };
            this.GET_ALL_SALE_EQUIPMENT(query);
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
        });
    },
};
</script>

<style scoped>
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

@media (max-width: 960px) {
    .breadcrumbs-container {
        padding: 8px 12px;
    }

    .custom-breadcrumb-item {
        font-size: 0.9rem;
    }
}

@media (max-width: 600px) {
    .breadcrumbs-container {
        padding: 6px 10px;
    }

    .custom-breadcrumb-item {
        font-size: 0.8rem;
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