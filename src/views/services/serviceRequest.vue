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
            SERVICE REQUESTS
        </div>
        <searchAndFilterToolbar :btn_text="serv_text" :show-button="showToolbar" :auto="true"
            @btn_action="openAddService" :placeholder="'Search with serialNo Client and Equipment Name '"
            @fiterWithName="searchSeriveRe" @filterBtn="filterDisplay = !filterDisplay" />
        <Transition name="slide-fade">
            <div class="mt-4 mb-2" v-if="filterDisplay">
                <v-row>
                    <v-col cols="12" md="2">
                        <v-autocomplete v-model="selctedPriority" clearable hide-details variant="outlined"
                            density="compact" :items="priorityList" item-title="name" item-value="id"
                            label="Priority"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-autocomplete v-model="selctedStatus" clearable hide-details variant="outlined"
                            density="compact" :items="StatusList" item-title="name" item-value="id"
                            label="Status"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-autocomplete v-model="selectedCity" clearable hide-details variant="outlined"
                            density="compact" :items="cityList" item-title="city" item-value="id"
                            label="City"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-autocomplete v-model="selectedEngineer" clearable hide-details variant="outlined"
                            density="compact" :items="techList" item-title="username" item-value="id"
                            label="Engineer"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="2" style="align-self: center;">
                        <v-btn style="background: rgb(4 43 76);" @click="applyFilters()">
                            <span style="color: white">Filter</span>
                        </v-btn>
                    </v-col>
                </v-row>
            </div>
        </Transition>
        <v-table class="rounded-lg mt-4">
            <thead>
                <tr>
                    <th class="text-left" style="width:10%">Serial Number</th>
                    <th class="text-left" style="width:10%">Equipment Name</th>
                    <th class="text-left" style="width:10%">Client</th>
                    <th class="text-left" style="width:10%">City</th>
                    <th class="text-left" style="width:10%">Call Handle</th>
                    <th class="text-left" style="width:10%">Working Status</th>
                    <th class="text-left" style="width:10%">Call Registration date & time</th>
                    <th class="text-left" style="width:10%">Priority</th>
                    <th class="text-left" style="width:10%">Assigned to</th>
                    <th class="text-left" style="width:5%">Status</th>
                    <th class="text-left" style="width:5%">Message</th>
                    <th class="text-left" v-if="showMessage">CEO Approval</th> <!-- New Column -->
                    <th class="text-left" style="width:20%">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item) in filteredServiceList" :key="item.id">
                    <td>{{ item.sale?.serialNo || 'N/A' }}</td>
                    <td>{{ item.sale?.equipment?.equipmentName || 'N/A' }}</td>
                    <td>{{ item.sale?.client?.name || 'N/A' }}</td>
                    <td>{{ item.sale?.client?.city?.city || 'N/A' }}</td>
                    <td>{{ item.call_handle?.callHandle || 'N/A' }}</td>
                    <td>{{ item.workingcondition?.workingCondition || 'N/A' }}</td>
                    <td>{{ item.callRegisterDate?.split('T')[0] || 'N/A' }}</td>
                   
                    <td>{{ item.priority?.priority || 'N/A' }}</td>
         
                    <td><span v-if="item.user">{{ item.user.username }}</span><span v-else>N/A</span></td>
                    <td class="">
                        <v-chip :color="getStatusColor(item.working_status?.workingStatus)"
                            style="min-width: 100px; cursor: pointer;">
                            <span class="ma-auto">{{ item.working_status?.workingStatus || 'N/A' }}</span>
                            <v-menu activator="parent">
                                <v-list class="pa-0">
                                    <v-list-item @click="changeStatus(status, item)" v-for="status in StatusList"
                                        :class="getStatusClass(status.name)" :key="status.id">
                                        <v-list-item-title>{{ status.name }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </v-chip>
                    </td>
                               <td class="message"><span class="circle-badge">1</span></td>

                    <!-- New CEO Approval Column -->
                    <td>
                        <!-- <v-chip :color="getApprovalColor(item.ceoApproval)" style="min-width: 100px;">
                            {{ item.ceoApproval || 'Pending' }}
                        </v-chip> -->
                        <v-btn icon small @click="openApprovalDialog(item)" class="ml-2" v-if="showMessage">
                            <v-icon>mdi-message-outline</v-icon>
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
                                <v-list-item @click="openEditDialog(item)" v-if="showToolbar">
                                    <v-list-item-title>
                                        <v-icon left>mdi-pencil-outline</v-icon> Edit
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="openMessageDialog(item)" v-if="showToolbar">
                                    <v-list-item-title>
                                        <v-icon left>mdi-message-outline</v-icon> Approvals messages
                                    </v-list-item-title>
                                </v-list-item>

                            </v-list>
                        </v-menu>
                    </td>
                </tr>
            </tbody>
        </v-table>
        <snackbarVue :visible="snackbar" :text="mssg" :button="false" :color="snackColor" @close="snackbar = false" />
        <paginationVue :length="serviceTotalPages" @chanegePage="chanegePage" />
        <addServiceRequest :visible="dialog" @close="dialog = false" @save="addService" :title="dialog_title" />
        <EditServiceRequestVue :visible="edtDialog" @close="edtDialog = false" @save="updateService"
            :title="editDialog_title" :item="edit_value" />
        <!-- New Approval Dialog -->
        <v-dialog v-model="approvalDialog" max-width="500px">
            <v-card>
                <v-card-title>CEO Approval Message</v-card-title>
                <v-card-text>
                    <v-text-field v-model="subject" label="subject" outlined></v-text-field>
                    <v-text-field v-model="requested_type" label="Requested Type" outlined></v-text-field>
                    <v-textarea v-model="message" label="Message to CEO" outlined></v-textarea>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="approvalDialog = false">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="sendApprovalRequest">Send</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import searchAndFilterToolbar from '@/components/searchAndFilterToolbar.vue';
import addServiceRequest from '@/components/seviceRequest/addServiceRequest.vue';
import EditServiceRequestVue from '@/components/seviceRequest/ServiceEdit.vue';
import deleteWarnVue from '@/components/deleteWarn.vue';
import { mapActions, mapState } from 'vuex';
import paginationVue from '@/components/pagination.vue';
import snackbarVue from '@/components/snackbar.vue';

export default {
    name: 'serviceRequest',
    components: {
        searchAndFilterToolbar,
        addServiceRequest,
        EditServiceRequestVue,
        deleteWarnVue,
        paginationVue,
        snackbarVue
    },
    data() {
        return {
            breadcrumbs: [
                { text: 'Home', disabled: false, href: '/' },
                { text: 'Service Requests', disabled: true, href: '/service-requests' },
            ],
            serv_text: 'Add Service Request',
            dialog: false,
            edtDialog: false,
            delete_dialog: false,
            approvalDialog: false, // New dialog state
            snackbar: false,
            mssg: '',
            snackColor: '',
            filterDisplay: false,
            selctedPriority: '',
            selctedStatus: '',
            selectedCity: '',
            selectedEngineer:'',
            showToolbar: false,
            showMessage: false,
            serviceSearchVal: '',
            deleteValue: {},
            dialog_title: 'Add Service Request',
            editDialog_title: 'Edit Service Request',
            edit_value: {},
            allServiceList: [],
            message: '',
            subject: '',
            requested_type: '',
            message: '', // Message to CEO
            selectedServiceItem: null, // Track selected service for approval
            priorityList: [
                { id: 1, name: 'Low' },
                { id: 2, name: 'Medium' },
                { id: 3, name: 'High' },
            ],
            StatusList: [
                { id: 1, name: 'Open' },
                { id: 2, name: 'In Progress' },
                { id: 3, name: 'Completed' },
                { id: 5, name: 'Canceled' },
            ]
        }
    },
    computed: {
        ...mapState('service', ['serviceList', 'serviceTotalPages', 'editServicetValue']),
        ...mapState('status', ['statusList']),
        ...mapState('clients', ['editClientValue']),
        ...mapState('city', ['cityList']),
        ...mapState('technician', ['techList']),
        filteredServiceList() {
            let filteredList = [...this.allServiceList];

            // Filter by Priority
            if (this.selctedPriority) {
                filteredList = filteredList.filter(item =>
                    item.priority?.id === this.selctedPriority
                );
            }

            // Filter by Status
            if (this.selctedStatus) {
                filteredList = filteredList.filter(item =>
                    item.working_status?.id === this.selctedStatus
                );
            }

            // Filter by City
            if (this.selectedCity) {
                filteredList = filteredList.filter(item =>
                    item.sale?.client?.city?.id === this.selectedCity
                );
            }

            // Filter by Engineer
            if (this.selectedEngineer) {
                filteredList = filteredList.filter(item =>
                    item.user?.id === this.selectedEngineer
                );
            }

            // Filter by Search
            // if (this.serviceSearchVal) {
            //     const searchTerm = this.serviceSearchVal.toLowerCase();
            //     filteredList = filteredList.filter(item =>
            //         (item.sale?.equipment?.equipmentName?.toLowerCase() || '').includes(searchTerm) ||
            //         (item.sale?.client?.name?.toLowerCase() || '').includes(searchTerm)
            //     );
            // }
            if (this.serviceSearchVal) {
            const searchTerm = this.serviceSearchVal.toLowerCase();
            filteredList = filteredList.filter(item =>
                // Search in Equipment Name
                (item.sale?.equipment?.equipmentName?.toLowerCase() || '').includes(searchTerm) ||
                // Search in Client Name
                (item.sale?.client?.name?.toLowerCase() || '').includes(searchTerm) ||
                // Search in Serial Number
                (item.sale?.serialNo?.toLowerCase() || '').includes(searchTerm)
            );
        }

            return filteredList;
        }
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
                if (userRole === 'admin') {
                    this.showMessage = false;
                } else {
                    this.showMessage = true;
                }
            }
        },
        ...mapActions('clients', ['GET_CLIENT_LIST', 'GET_CLIENT_BY_ID']),
        ...mapActions('city', ['GET_CITY_LIST']),
        ...mapActions('technician', ['GET_TECH_LIST']),
        ...mapActions('workingCondition', ['GET_CONDITION_LIST']),
        ...mapActions('priority', ['GET_PRIORITY_LIST']),
        ...mapActions('callHandle', ['GET_CALL_HANDLE_LIST']),
        ...mapActions('service', [
            'ADD_SERVICE',
            'GET_SERVICE_LIST',
            'CHENGE_SERVICE_STATUS',
            'GET_SERVICE_WITH_ID',
            'UPDATE_SERVICE',
            'DELETE_SERVICE_REQUEST',
            'SEND_CEO_APPROVAL' // New action (you'll need to define this in your Vuex store)
        ]),
        ...mapActions('status', ['GET_STATUS_LIST']),
        ...mapActions('message', ['ADD_CEOMESSAGE']),

        openMessageDialog(item) {
            this.$router.push({ name: 'MessageList', params: { serviceRequestId: item.id } });
        },

        getStatusColor(status) {
            const statusColors = {
                'Open': '#1985d0',
                'In Progress': '#20ad8c',
                'Completed': '#fd5e00',
                'Verified': '#1ad539',
                'Canceled': '#1ad539'
            };
            return statusColors[status] || '#grey';
        },

        getStatusClass(status) {
            return {
                'Open': status === 'Open',
                'Accepted': status === 'In Progress',
                'Completed': status === 'Completed',
                'verified': status === 'Verified' || status === 'Canceled'
            };
        },

        getApprovalColor(status) {
            const approvalColors = {
                'Approved': '#1ad539',
                'Pending': '#ff9800',
                'Rejected': '#f44336'
            };
            return approvalColors[status] || '#ff9800'; // Default to Pending
        },

        async changeStatus(status, item) {
            const payload = {
                id: item.id,
                workingStatusId: status.id,
                saleId: item.saleId
            };
            try {
                await this.CHENGE_SERVICE_STATUS(payload);
                await this.fetchServiceList();
                this.mssg = 'Status updated successfully';
                this.snackColor = 'success';
                this.snackbar = true;
            } catch (error) {
                this.mssg = error.message || 'Error updating status';
                this.snackColor = 'error';
                this.snackbar = true;
            }
        },

        async openAddService() {
            const query = { size: 500 };
            try {
                await Promise.all([
                    this.GET_CLIENT_LIST(query),
                    this.GET_CITY_LIST(query),
                    this.GET_TECH_LIST(query),
                    this.GET_CONDITION_LIST(),
                    this.GET_PRIORITY_LIST(),
                    this.GET_CALL_HANDLE_LIST()
                ]);
                this.dialog = true;
            } catch (error) {
                console.error('Error preparing add service:', error);
            }
        },

        async addService(payload) {
            try {
                await this.ADD_SERVICE(payload);
                this.snackColor = 'success';
                this.mssg = 'Service request added successfully';
                this.snackbar = true;
                this.dialog = false;
                await this.fetchServiceList();
            } catch (error) {
                this.mssg = error.message || 'Error adding service request';
                this.snackColor = 'error';
                this.snackbar = true;
            }
        },

        async openEditDialog(item) {
            try {
                await this.GET_SERVICE_WITH_ID(item.id).then(() => {
                    this.edit_value = { ...this.editServicetValue };
                    this.edtDialog = true;
                });
                const query = { size: 500 };
                await Promise.all([
                    this.GET_CITY_LIST(query),
                    this.GET_TECH_LIST(query),
                    this.GET_CONDITION_LIST(),
                    this.GET_PRIORITY_LIST(),
                    this.GET_CALL_HANDLE_LIST(),
                    this.GET_CLIENT_LIST({ name: item.sale?.client?.name || '' })
                ]);
            } catch (error) {
                console.error('Error opening edit dialog:', error);
            }
        },

        async updateService(payload) {
            try {
                await this.UPDATE_SERVICE(payload);
                this.edtDialog = false;
                await this.fetchServiceList();
                this.mssg = 'Service request updated successfully';
                this.snackColor = 'success';
                this.snackbar = true;
            } catch (error) {
                this.mssg = error.message || 'Error updating service request';
                this.snackColor = 'error';
                this.snackbar = true;
            }
        },

        toInnerPage(item) {
            this.$router.push({ name: 'serviceInner', params: { id: item.id } });
        },

        openDeleteDailog(item) {
            this.deleteValue = item;
            this.delete_dialog = true;
        },

        async deleteService() {
            try {
                await this.DELETE_SERVICE_REQUEST(this.deleteValue.id);
                this.snackColor = 'success';
                this.mssg = 'Service request deleted successfully';
                this.snackbar = true;
                this.delete_dialog = false;
                await this.fetchServiceList();
            } catch (error) {
                this.mssg = error.message || 'Error deleting service request';
                this.snackColor = 'error';
                this.snackbar = true;
            }
        },

        async fetchServiceList() {
            try {
                const response = await this.GET_SERVICE_LIST({ size: 500 }); // Fetch all data
                this.allServiceList = [...this.serviceList];
            } catch (error) {
                console.error('Error fetching service list:', error);
            }
        },

        applyFilters() {
            this.$forceUpdate(); // Force update to ensure table refreshes
        },

        chanegePage(page) {
            this.fetchServiceList();
        },

        searchSeriveRe(val) {
            this.serviceSearchVal = val || '';
            this.applyFilters();
        },

        openApprovalDialog(item) {
            // Store the selected service request ID directly
            this.selectedServiceItem = item.id;
            this.subject = ''; // Reset subject

            this.message = ''; // Reset message
            this.approvalDialog = true;
        },

        async sendApprovalRequest() {
            if (!this.message || !this.selectedServiceItem) {
                this.mssg = "Please select a service request and enter a message.";
                this.snackColor = "error";
                this.snackbar = true;
                return;
            }

            const payload = {
                subject: this.subject || "Approval Request",
                requested_type: this.requested_type || "General",
                serviceRequestId: this.selectedServiceItem,
                message: this.message,
            };

            // console.log("Sending Approval Request:", payload);

            try {
                const response = await this.ADD_CEOMESSAGE(payload);
                this.mssg = "Approval request sent successfully";
                this.snackColor = "success";
                this.snackbar = true;
                this.approvalDialog = false;
            } catch (error) {
                console.error("Error sending approval request:", error);
                this.mssg = error.response?.data?.message ||
                    error.message ||
                    "Error sending approval request";
                this.snackColor = "error";
                this.snackbar = true;
            }
        }

    },
    mounted() {
        Promise.all([
            this.isAdmin(),
            this.fetchServiceList(),
            this.GET_STATUS_LIST(),
            this.GET_CITY_LIST({ size: 500 }),
            this.GET_TECH_LIST({ size: 500 }),
            this.GET_CONDITION_LIST(),
            this.GET_PRIORITY_LIST(),
            this.GET_CALL_HANDLE_LIST()
        ]).catch(error => {
            console.error('Error during initialization:', error);
        });
    }
}
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

tbody tr:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, .05);
}

.v-table .v-table__wrapper > table > tbody > tr > td {
    border-bottom: none;
    font-size: small;
    font-weight: 500;
}

.v-locale--is-ltr .v-table > .v-table__wrapper > table > thead > tr > th {
    border-bottom: none;
    font-weight: 600 !important;
}

.v-table {
    font-family: Montserrat, sans-serif !important;
}

/* Style for the Actions column header */
.v-table > .v-table__wrapper > table > thead > tr > th:last-child {
    text-align: center !important; /* Center the Actions header text */
    padding: 0 8px !important; /* Minimal padding for precise alignment */
    width: 48px !important; /* Fixed width to match button size */
    box-sizing: border-box; /* Ensure padding is included in width */
}

/* Style for the Actions column cells */
.v-table > .v-table__wrapper > table > tbody > tr > td:last-child {
    text-align: center !important; /* Center the content in the Actions column */
    padding: 0 8px !important; /* Match header padding */
    vertical-align: middle !important; /* Vertically center the button */
    width: 48px !important; /* Match header width */
    box-sizing: border-box; /* Ensure padding is included in width */
}

/* Ensure the action button is centered and sized appropriately */
.v-table > .v-table__wrapper > table > tbody > tr > td:last-child .v-btn {
    margin: 0 auto !important; /* Center the button horizontally */
    display: block !important; /* Ensure button is block-level for centering */
    width: 32px !important; /* Match Vuetify icon button size */
    height: 32px !important; /* Consistent height */
    min-width: unset !important; /* Override Vuetify's min-width */
}

/* Override any Vuetify default padding or margins */
.v-table > .v-table__wrapper > table > tbody > tr > td:last-child .v-btn__content {
    margin: 0 !important; /* Remove any internal margins */
    padding: 0 !important; /* Remove any internal padding */
}

.Open {
    background: #1985d0;
}

.Accepted {
    background: #20ad8c;
}

.Completed {
    background: #fd5e00;
}

.verified {
    background: #1ad539;
}

.circle-badge {
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    border-radius: 50%;
    background-color: #ff9800;
    color: white;
    text-align: center;
    font-weight: bold;
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

/* Responsive Design for Breadcrumb */
@media (max-width: 960px) {
    .breadcrumbs-container {
        padding: 8px 12px;
    }

    .custom-breadcrumb-item {
        font-size: 0.9rem;
    }

    /* Adjust Actions column for smaller screens */
    .v-table > .v-table__wrapper > table > thead > tr > th:last-child,
    .v-table > .v-table__wrapper > table > tbody > tr > td:last-child {
        width: 40px !important; /* Slightly smaller for mobile */
    }

    .v-table > .v-table__wrapper > table > tbody > tr > td:last-child .v-btn {
        width: 28px !important; /* Adjust button size for mobile */
        height: 28px !important;
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