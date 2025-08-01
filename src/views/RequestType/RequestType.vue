<template>
    <v-container class="px-10" fluid style="height:100vh; background:#e7f0f7 ;">
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
        <br><br>
        <div class="text-h6 mb-2" style="font-family:'Montserrat', sans-serif !important">
            Service Request Type
        </div>
        <searchAndFilterToolbar :btn_text="cl_text" @btn_action="dialog = true" />

        <!-- Grid Layout for Care Of Cards -->
        <v-row class="mt-4">
            <v-col v-for="(item, i) in RequestTypeList" :key="item.id" cols="12" sm="6" md="3">
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

        <addType :visible="dialog" @close="dialog = false" @save="addCareof" :title="dialog_title" />
        <deleteWarnVue :visible="delete_dialog" @close="delete_dialog = false" :item="deleteValue"
            @delete="deleteCareof" />

        <!-- ✅ FIXED: Changed :name to :type -->
        <editType :visible="edit_dialog" @close="closeEditDialog" @save="editCareOfValue" :title="edit_dialog_title"
            :type="edit_value" />
    </v-container>
</template>

<script>
import searchAndFilterToolbar from '@/components/searchAndFilterToolbar.vue';
import { mapActions, mapState } from 'vuex';
import deleteWarnVue from '@/components/deleteWarn.vue';
import addType from '@/views/RequestType/AddRequestType.vue';
import editType from '@/views/RequestType/EditRequestType.vue';

export default {
    name: 'Request_Type',
    components: {
        searchAndFilterToolbar,
        addType,
        deleteWarnVue,
        editType
    },
    data() {
        return {
            breadcrumbs: [
                { text: 'Home', disabled: false, href: '/' },
                { text: ' Request Type', disabled: true, href: '/Request_Type' },
            ],
            edit_dialog: false,
            edit_value: '',
            edit_id: '',
            edit_dialog_title: 'Edit Request Type',
            delete_dialog: false,
            cl_text: 'Add Request Type',
            dialog: false,
            deleteValue: {},
            dialog_title: 'Add Request Type'
        }
    },
    computed: {
        ...mapState('RequestType', ['RequestTypeList']),
    },
    methods: {
        ...mapActions('RequestType', ['GET_REQUESTTYPE', 'ADD_REQUESTTYPE', 'DELETE_REQUESTTYPE', 'EDIT_REQUESTTYPE']),

        async addCareof(item) {
            try {
                await this.ADD_REQUESTTYPE(item);
                await this.GET_REQUESTTYPE();
                this.dialog = false;
            } catch (error) {
                console.error('Error adding care of:', error);
            }
        },

        openDeleteDialog(item) {
            this.deleteValue = item;
            this.delete_dialog = true;
        },

        async deleteCareof() {
            try {
                if (!this.deleteValue || !this.deleteValue.id) {
                    console.error("❌ Cannot delete: deleteValue or ID is missing", this.deleteValue);
                    return;
                }

                await this.DELETE_REQUESTTYPE({ id: this.deleteValue.id });
                await this.GET_REQUESTTYPE();
                this.delete_dialog = false;
                this.deleteValue = {};
            } catch (error) {
                console.error('Error deleting care of:', error);
            }
        },

        // ✅ ENHANCED: Better edit dialog handling
        openEditDialog(item) {
            console.log('Opening edit dialog for item:', item); // Debug log
            this.edit_value = item.type || ''; // Ensure it's not undefined
            this.edit_id = item.id;
            this.edit_dialog = true;

            // Debug logs
            console.log('Edit value set to:', this.edit_value);
            console.log('Edit dialog opened:', this.edit_dialog);
        },

        // ✅ NEW: Separate close method for better control
        closeEditDialog() {
            this.edit_dialog = false;
            // Don't reset values immediately to prevent flashing
            this.$nextTick(() => {
                this.edit_value = '';
                this.edit_id = '';
            });
        },

        async editCareOfValue(item) {
            const payload = {
                id: this.edit_id,
                type: item.type
            };
            try {
                console.log('Editing with payload:', payload); // Debug log
                await this.EDIT_REQUESTTYPE(payload);
                await this.GET_REQUESTTYPE();
                this.closeEditDialog();
            } catch (error) {
                console.error('Error editing care of:', error);
            }
        }
    },
    mounted() {
        this.GET_REQUESTTYPE();
    }
}
</script>

<style scoped>
.card-hover {
    transition: transform 0.2s ease-in-out;
}

.card-hover:hover {
    transform: translateY(-2px);
}
</style>