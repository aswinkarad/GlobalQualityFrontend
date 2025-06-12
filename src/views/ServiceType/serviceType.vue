<template>
    <v-container class="px-10" fluid style="height:100vh; background:#e7f0f7 ;">
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
        <br><br>
        <div class="text-h6 mb-2" style="font-family:'Montserrat', sans-serif !important">
            SERVICE TYPE
        </div>
        <searchAndFilterToolbar :btn_text="cl_text" @btn_action="openAddDialog" />

        <!-- Grid Layout for service type Cards -->
        <v-row class="mt-4">
            <v-col v-for="(item, i) in ServiceTypeList" :key="item.id" cols="12" sm="6" md="3">
                <v-card class="pa-4 card-hover" elevation="2">
                    <v-card-title class="text-h6 d-flex align-center">
                        {{ item.type }}
                    </v-card-title>
                    <v-card-actions class="justify-end">
                        <v-hover v-slot="{ isHovering, props }">
                            <v-avatar rounded size="small" v-bind="props" class="mr-1" @click="openEditDialog(item)"
                                :class="isHovering ? 'elevation-12' : 'elevation-2'" color="blue-darken-2"
                                style="cursor: pointer;">
                                <v-icon size="18" icon="mdi-pencil-outline"></v-icon>
                            </v-avatar>
                        </v-hover>
                        <v-hover v-slot="{ isHovering, props }">
                            <v-avatar rounded size="small" v-bind="props" class="mr-1" @click="openDeleteDialog(item)"
                                :class="isHovering ? 'elevation-12' : 'elevation-2'" color="#e9bc10"
                                style="cursor: pointer;">
                                <v-icon size="18" color="white" icon="mdi-trash-can-outline"></v-icon>
                            </v-avatar>
                        </v-hover>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- Add Service Type Dialog -->
        <v-dialog v-model="addDialog" max-width="500px">
            <v-card>
                <v-card-title class="text-h6">{{ dialog_title }}</v-card-title>
                <v-card-text>
                    <v-text-field v-model="type" label="Service Type" outlined></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="addDialog = false">Cancel</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="addServiceType">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Edit Service Type Dialog -->
        <v-dialog v-model="editDialog" max-width="500px">
            <v-card>
                <v-card-title class="text-h6">{{ edit_dialog_title }}</v-card-title>
                <v-card-text>
                    <v-text-field v-model="type" label="Service Type" outlined></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="editDialog = false">Cancel</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="updateServiceType">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="deleteDialog" max-width="500px">
            <v-card>
                <v-card-title class="text-h6">Are you sure you want to delete this service type?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="deleteDialog = false">Cancel</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="deleteServiceType">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import searchAndFilterToolbar from '@/components/searchAndFilterToolbar.vue';
import { mapActions, mapState } from 'vuex';

export default {
    name: 'serviceType',
    components: {
        searchAndFilterToolbar,
    },
    data() {
        return {
            breadcrumbs: [
                { text: 'Home', disabled: false, href: '/' },
                { text: 'Service Type', disabled: true, href: '/serviceType' },
            ],
            addDialog: false, // Controls the Add dialog
            editDialog: false, // Controls the Edit dialog
            deleteDialog: false, // Controls the Delete dialog
            type: '', // Holds the new service type value
            type: '', // Holds the edited service type value
            editId: null, // Holds the ID of the service type being edited
            deleteId: null, // Holds the ID of the service type being deleted
            dialog_title: 'Add Service Type',
            edit_dialog_title: 'Edit Service Type',
            cl_text: 'Add Service Type'
        };
    },
    computed: {
        ...mapState('servicetype', ['ServiceTypeList'])
    },
    methods: {
        ...mapActions('servicetype', ['GET_SERVICETYPE_LIST', 'ADD_SERVICETYPE', 'DELET_SERVICETYPE', 'EDIT_SERVICETYPE']),

        // Open Add Dialog
        openAddDialog() {
            this.type = ''; // Reset the input field
            this.addDialog = true;
        },

        // Add Service Type
        async addServiceType() {
            if (this.type.trim()) {
                try {
                    await this.ADD_SERVICETYPE({ type: this.type });
                    await this.GET_SERVICETYPE_LIST();
                    this.addDialog = false;
                } catch (error) {
                    console.error('Error adding service type:', error);
                }
            }
        },

        // Open Edit Dialog
        openEditDialog(item) {
            this.type = item.type; // Set the current value for editing
            this.editId = item.id; // Set the ID of the item being edited
            this.editDialog = true;
        },

        // Update Service Type
        async updateServiceType() {
            if (this.type.trim()) {
                try {
                    await this.EDIT_SERVICETYPE({ id: this.editId, type: this.type });
                    await this.GET_SERVICETYPE_LIST();
                    this.editDialog = false;
                } catch (error) {
                    console.error('Error updating service type:', error);
                }
            }
        },

        // Open Delete Dialog
        openDeleteDialog(item) {
            this.deleteId = item.id; // Set the ID of the item being deleted
            this.deleteDialog = true;
        },

        // Delete Service Type
        async deleteServiceType() {
            try {
                await this.DELET_SERVICETYPE(this.deleteId);
                await this.GET_SERVICETYPE_LIST();
                this.deleteDialog = false;
            } catch (error) {
                console.error('Error deleting service type:', error);
            }
        }
    },
    mounted() {
        this.GET_SERVICETYPE_LIST();
    }
};
</script>

<style scoped>
.breadcrumbs-container {
    background: linear-gradient(90deg, #f07053, #2A4066);
    border-radius: 12px;
    padding: 15px;
    box-shadow: 0 6px 15px rgba(255, 87, 51, 0.4);
    animation: slideInDown 0.6s ease-out;
}

.custom-breadcrumb-item {
    color: #fcfcfc;
    font-weight: 700;
    transition: all 0.3s ease;
}

.custom-breadcrumb-item:hover {
    color: #E8ECEF;
    transform: scale(1.05);
}

.v-card {
    background: white;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.card-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.v-card-title {
    font-family: 'Montserrat', sans-serif !important;
    word-break: break-word;
}

.v-card-actions {
    justify-content: flex-end;
}

@keyframes slideInDown {
    0% { opacity: 0; transform: translateY(-100%); }
    100% { opacity: 1; transform: translateY(0); }
}
</style>