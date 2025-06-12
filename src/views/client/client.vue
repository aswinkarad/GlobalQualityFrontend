<template>
    <v-container class="px-4 px-md-10" fluid style="height:100vh; background:#e7f0f7;">
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
            CLIENTS
        </div>
        <searchAndFilterToolbar :btn_text="cl_text" :show-button="showToolbar" :placeholder="placeholder"
            @btn_action="dialog = true" @fiterWithName="fliterByName" :auto="true" @filterBtn="displayFilter"
            @search="fliterByName" />
        <Transition name="slide-fade">
            <div class="mt-4 mb-2" v-if="filterDisplay">
                <v-row>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete v-model="city" hide-details variant="outlined" density="comfortable"
                            :items="cityList" item-title="city" clearable item-value="id" label="City"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete v-model="care" hide-details variant="outlined" density="comfortable"
                            :items="careofList" item-title="careof" clearable item-value="id"
                            label="Care of"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="2">
                        <v-autocomplete v-model="type" hide-details variant="outlined" density="comfortable"
                            :items="typeList" item-title="title" item-value="id" clearable
                            label="Type"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field v-model="startDate" label="Start Date" type="date" variant="outlined"
                            density="comfortable" clearable></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field v-model="endDate" label="End Date" type="date" variant="outlined"
                            density="comfortable" clearable></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="2" class="d-flex justify-center align-center">
                        <v-btn style="background: rgb(4 43 76); width: 100%; max-width: 150px;" @click="filterClient()">
                            <span style="color: white">Filter</span>
                        </v-btn>
                    </v-col>
                </v-row>
            </div>
        </Transition>

        <v-table class="rounded-lg mt-4">
            <thead>
                <tr>
                    <th class="text-left">NAME</th>
                    <th class="text-left">EMAIL</th>
                    <th class="text-left">PHONE</th>
                    <th class="text-left d-none d-md-table-cell">CITY</th>
                    <th class="text-left d-none d-md-table-cell">CARE OF</th>
                    <!-- <th class="text-left d-none d-md-table-cell">TYPE</th> -->
                    <th class="text-left">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in clientList" :key="item.id">
                    <td v-if="item.arabicname">{{ item.name + ' ' + item.arabicname }}</td>
                    <td v-else>{{ item.name }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.contact1 }}</td>
                    <td class="d-none d-md-table-cell">{{ item.city?.city || 'N/A' }}</td>
                    <td class="d-none d-md-table-cell">{{ item.careof?.careof || 'N/A' }}</td>
                    <!-- <td class="d-none d-md-table-cell">{{ item.clienttype?.client_type || 'N/A' }}</td> -->
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
                                <v-list-item @click="openDeleteDialog(item)" v-if="showToolbar">
                                    <v-list-item-title>
                                        <v-icon left color="red">mdi-trash-can-outline</v-icon> Delete
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </td>
                </tr>
            </tbody>
        </v-table>
        <paginationVue :length="clientTotalPage" @chanegePage="chanegePage" />

        <deleteWarnVue :visible="delete_dialog" @close="delete_dialog = false" :item="deleteValue"
            @delete="deleteClient" />
        <editClients :visible="edit_dialog" @close="edit_dialog = false" @save="update_client" :data="editValue"
            :title="dialog_title" />
        <addClients :visible="dialog" @close="dialog = false" @save="add_client" :title="dialog_title" />
    </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import searchAndFilterToolbar from '@/components/searchAndFilterToolbar.vue';
import addClients from '@/components/client/addClients.vue';
import editClients from '@/components/client/editClient.vue';
import deleteWarnVue from '@/components/deleteWarn.vue';
import paginationVue from '@/components/pagination.vue';

export default {
    name: 'clientsPage',
    components: {
        searchAndFilterToolbar,
        addClients,
        deleteWarnVue,
        editClients,
        paginationVue
    },
    data() {
        return {
            breadcrumbs: [
                { text: 'Home', disabled: false, href: '/' },
                { text: 'Clients', disabled: true, href: '/clients' },
            ],
            cl_text: 'Add Client',
            placeholder: 'Name',
            dialog: false,
            delete_dialog: false,
            edit_dialog: false,
            deleteValue: {},
            editValue: {},
            filterDisplay: false,
            dialog_title: 'Add Client',
            city: '',
            care: '',
            showToolbar: false,
            type: '',
            startDate: '',
            endDate: '',
            // typeList: [
            //     { id: 1, title: 'GOV' },
            //     { id: 2, title: 'NON-GOV' },
            // ]
        }
    },
    computed: {
        ...mapState('clients', ['clientList', 'editClientValue', 'clientTotalPage']),
        ...mapState('city', ['cityList']),
        ...mapState('careof', ['careofList'])
    },
    methods: {
        isAdmin() {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.role) {
                const userRole = user.role[0];
                this.showToolbar = userRole !== 'Engineer';
            }
        },
        ...mapActions('clients', ['GET_CLIENT_LIST', 'ADD_CLIENT', 'DELETE_CLIENT', 'GET_CLIENT_BY_ID', 'UPDATE_CLIENT']),
        ...mapActions('city', ['GET_CITY_LIST']),
        ...mapActions('careof', ['GET_CAREOF_LIST']),

        displayFilter() {
            this.filterDisplay = !this.filterDisplay;
        },

        async add_client(item) {
            try {
                await this.ADD_CLIENT(item);
                await this.GET_CLIENT_LIST();
                this.dialog = false;
            } catch (error) {
                console.error('Error adding client:', error);
            }
        },

        openDeleteDialog(item) {
            this.deleteValue = item;
            this.delete_dialog = true;
        },

        async deleteClient() {
            try {
                await this.DELETE_CLIENT(this.deleteValue.id);
                await this.GET_CLIENT_LIST();
                this.delete_dialog = false;
                this.deleteValue = {};
            } catch (error) {
                console.error("Error deleting client:", error);
            }
        },

        async openEditDialog(item) {
            await this.GET_CLIENT_BY_ID(item).then(() => {
                this.editValue = this.editClientValue;
                this.edit_dialog = true;
            });
        },

        async update_client(item) {
            try {
                await this.UPDATE_CLIENT(item);
                await this.GET_CLIENT_LIST();
                this.edit_dialog = false;
                this.editValue = {};
            } catch (error) {
                console.error('Error updating client:', error);
            }
        },

        toInnerPage(item) {
            this.$router.push({ name: 'clientInnerPage', params: { id: item.id } });
        },

        filterClient() {
            const payload = {
                cty: this.city || '',
                typ: this.type || '',
                creof: this.care || '',
                startDate: this.startDate || '',
                endDate: this.endDate || '',
                size: 15,
                page: 1
            };
            this.GET_CLIENT_LIST(payload);
        },

        fliterByName(text) {
            const payload = {
                name: text || '',
                size: 15,
                page: 1
            };
            this.GET_CLIENT_LIST(payload);
        },

        chanegePage(page) {
            const query = {
                page: page,
                size: 15,
                cty: this.city || '',
                typ: this.type || '',
                creof: this.care || '',
                startDate: this.startDate || '',
                endDate: this.endDate || ''
            };
            this.GET_CLIENT_LIST(query);
        }
    },
    mounted() {
        Promise.all([
            this.isAdmin(),
            this.GET_CLIENT_LIST({ size: 15 }),
            this.GET_CITY_LIST({ size: 1000 }),
            this.GET_CAREOF_LIST({ size: 1000 })
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

.v-table .v-table__wrapper>table>tbody>tr td {
    border-bottom: none;
    font-size: small;
    font-weight: 500;
    padding: 8px;
}

.v-table .v-table__wrapper>table>thead>tr>th {
    border-bottom: none;
    font-weight: 600 !important;
    padding: 8px;
}

.v-table {
    font-family: Montserrat, sans-serif !important;
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

/* Mobile Responsive Styles */
@media (max-width: 600px) {
    .v-container {
        padding: 8px !important;
    }

    .breadcrumbs-container {
        padding: 6px 10px;
    }

    .custom-breadcrumb-item {
        font-size: 0.75rem;
    }

    .text-h6 {
        font-size: 1rem !important;
    }

    .v-table {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
    }

    .v-table .v-table__wrapper>table>thead>tr>th,
    .v-table .v-table__wrapper>table>tbody>tr td {
        font-size: 0.75rem;
        padding: 6px;
        min-width: 100px;
    }

    .v-btn {
        min-width: 0;
        padding: 0 8px;
    }

    .v-row {
        margin: 0;
    }

    .v-col {
        padding: 4px !important;
    }
}

@media (max-width: 960px) {
    .v-row {
        flex-direction: column;
    }

    .v-col {
        margin-bottom: 8px;
    }

    .v-table .v-table__wrapper>table>thead>tr>th,
    .v-table .v-table__wrapper>table>tbody>tr td {
        font-size: 0.85rem;
    }

    .breadcrumbs-container {
        padding: 8px 12px;
    }

    .custom-breadcrumb-item {
        font-size: 0.9rem;
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