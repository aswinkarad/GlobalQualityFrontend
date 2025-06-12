<template>
    <div class="text-center">
        <v-dialog v-model="show" transition="dialog-top-transition" activator="parent">
            <v-card width="400">
                <v-card-title>
                    <div class="text-h6" style="font-family: Montserrat, sans-serif !important;">{{ title }}</div>
                </v-card-title>
                <v-card-text v-if="equipment">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="equipmentName" hide-details label="Equipment Name" placeholder=""
                                variant="underlined" density="comfortable"></v-text-field>
                            <!-- <span v-if="v$.catogery.$error" style="color: red">
                                {{ v$.catogery.$errors[0].$message }}
                            </span> -->
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="model" hide-details label="Model Number" placeholder=""
                                variant="underlined" density="comfortable"></v-text-field>
                            <!-- <span v-if="v$.catogery.$error" style="color: red">
                                {{ v$.catogery.$errors[0].$message }}
                            </span> -->
                        </v-col>
                    </v-row>
                    <!-- <v-row>
                        <v-col cols="12">
                            <v-select v-model="warrantyStatus" :items="warrantyStatusOptions" label="Warranty Status"
                                variant="underlined" density="comfortable" hide-details></v-select>
                            
                        </v-col>
                    </v-row> -->
                    <v-row>
                        <v-col cols="12">
                            <v-img v-if="existingImage && !image" :src="existingImage" max-height="100" max-width="100"
                                class="mb-2"></v-img>
                            <v-file-input accept="image/png, image/jpeg, image/bmp" v-model="image"
                                prepend-icon="mdi-image-outline" label="Image" hide-details density="comfortable"
                                variant="outlined">
                            </v-file-input>
                        </v-col>
                    </v-row>
                </v-card-text>
                <!-- <v-card-text v-else>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="item" hide-details label="Category" placeholder=""
                                variant="underlined" density="comfortable"></v-text-field> -->
                <!-- <span v-if="v$.catogery.$error" style="color: red">
                                {{ v$.catogery.$errors[0].$message }}
                            </span> -->
                <!-- </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-file-input accept="image/png, image/jpeg, image/bmp" v-model="image"
                                prepend-icon="mdi-image-outline" label="Image" hide-details density="comfortable" variant="outlined">
                            </v-file-input>
                        </v-col>
                    </v-row>
                </v-card-text> -->
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="white" style="background: rgb(4 43 76);" @click="(show = false)">
                        cancel
                    </v-btn>
                    <v-btn color="white" style="background: rgb(4 43 76);" @click="addCat()">
                        save
                    </v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
    name: 'EditEquipment',
    data() {
        return {
            dialog: false,
            equipmentName: '',
            model: '',
            image: [],
            existingImage: '',
           // warrantyStatus: '',
        }
    },
    props: {
        visible: {
            type: Boolean,
        },
        title: {
            type: String,
            default: 'Edit Equipment'
        },
        equipment: {
            type: Boolean,
            default: false
        },
        item: {
            type: Object, // Corrected to Object
            default: () => ({}),
        },
        // warrantyStatuses: {
        //     type: Array,
        //     default: () => []
        // }

    },
    computed: {
        ...mapState('equipments', ['statusList']),
        // warrantyStatusOptions() {
        //     // Transform the API response format to what v-select expects
        //     return this.statusList.map(item => ({
        //         title: item.status,
        //         value: item.id
        //     }));
        // },
        show: {
            get() {
                return this.visible
            },
            set(value) {
                if (!value) {
                    this.$emit('close')
                }
            }
        }
    },
    watch: {
        item: {
            immediate: true,
            handler(newVal) {
                // Populate fields when item prop changes
                this.equipmentName = newVal.equipmentName || '';
                this.model = newVal.model || '';
                // this.warrantyStatus = newVal.warrantyStatusId || null;
                this.existingImage = newVal.equipmentImage || '';
                this.image = []; // Reset file input for new uploads
            },
        },
    },
    methods: {
        ...mapActions('equipments', ['GET_STATUS_LIST']),
        addCat() {
            const payload = {
                name: this.equipmentName,
                model: this.model,
                // warrantyStatusId: this.warrantyStatus,
                image: this.image.length ? this.image : this.existingImage,
            };
            console.log('Payload being sent:', payload);
            this.$emit('update', payload);
            // this.resetFields();
        },
    },
    created() {
        this.name = '';
        this.image = '';
        this.modelNo = '',
        this.GET_STATUS_LIST();
        this.image = [];
        this.existingImage = '';
    }
}
</script>
<style scoped>
.v-input__prepend {
    display: none !important;
}
</style>