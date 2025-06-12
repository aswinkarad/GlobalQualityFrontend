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
            CARE OF
        </div>
        <searchAndFilterToolbar :btn_text="cl_text" @btn_action="dialog = true" />

        <!-- Grid Layout for Care Of Cards -->
        <v-row class="mt-4">
            <v-col v-for="(item, i) in careofList" :key="item.id" cols="12" sm="6" md="3">
                <v-card class="pa-4 card-hover" elevation="2">
                    <v-card-title class="text-h6 d-flex align-center">
                        <v-icon class="mr-2" color="blue-darken-2">mdi-account-circle</v-icon>
                        {{ item.careof }}
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

        <addCityVue :visible="dialog" @close="dialog = false" @save="addCareof" :title="dialog_title" />
        <deleteWarnVue :visible="delete_dialog" @close="delete_dialog = false" :item="deleteValue"
            @delete="deleteCareof" />
        <editCity :visible="edit_dialog" @close="edit_dialog = false" @save="editCareOfValue" :title="edit_dialog_title"
            :name="edit_value" />
    </v-container>
</template>

<script>
import searchAndFilterToolbar from '@/components/searchAndFilterToolbar.vue';
import { mapActions, mapState } from 'vuex';
import deleteWarnVue from '@/components/deleteWarn.vue';
import addCityVue from '@/components/city/addCity.vue';
import editCity from '@/components/city/editCity.vue';

export default {
    name: 'careOf',
    components: {
        searchAndFilterToolbar,
        addCityVue,
        deleteWarnVue,
        editCity
    },
    data() {
        return {
            breadcrumbs: [
                { text: 'Home', disabled: false, href: '/' },
                { text: 'Care Of', disabled: true, href: '/care-of' },
            ],
            edit_dialog: false,
            edit_value: '',
            edit_id: '',
            edit_dialog_title: 'Edit Care of',
            delete_dialog: false,
            cl_text: 'Add Care Of',
            dialog: false,
            deleteValue: {},
            dialog_title: 'Add Care Of'
        }
    },
    computed: {
        ...mapState('careof', ['careofList'])
    },
    methods: {
        ...mapActions('careof', ['GET_CAREOF_LIST', 'ADD_CAREOF', 'DELET_CAREOF', 'EDIT_CAREOF']),

        async addCareof(item) {
            try {
                await this.ADD_CAREOF(item);
                await this.GET_CAREOF_LIST();
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
                await this.DELET_CAREOF(this.deleteValue.id);
                await this.GET_CAREOF_LIST();
                this.delete_dialog = false;
                this.deleteValue = {};
            } catch (error) {
                console.error('Error deleting care of:', error);
            }
        },

        openEditDialog(item) {
            this.edit_value = item.careof;
            this.edit_id = item.id;
            this.edit_dialog = true;
        },

        async editCareOfValue(item) {
            const payload = {
                id: this.edit_id,
                name: item.name
            };
            try {
                await this.EDIT_CAREOF(payload);
                await this.GET_CAREOF_LIST();
                this.edit_dialog = false;
                this.edit_value = '';
                this.edit_id = '';
            } catch (error) {
                console.error('Error editing care of:', error);
            }
        }
    },
    mounted() {
        this.GET_CAREOF_LIST();
    }
}
</script>

<style scoped>
.breadcrumbs-container {
   background: linear-gradient(90deg, #4d90fe, #285bc7);
    border-radius: 12px;
    padding: 15px;
    /* box-shadow: 0 6px 15px rgba(255, 87, 51, 0.4); */
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