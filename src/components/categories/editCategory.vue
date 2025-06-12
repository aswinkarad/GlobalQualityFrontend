<template>
    <div class="text-center">
        <v-dialog v-model="show" transition="dialog-top-transition" activator="parent">
            <v-card width="400">
                <v-card-title><div class="text-h6" style="font-family: Montserrat, sans-serif !important;" >{{ title }}</div></v-card-title>
                <v-card-text v-if="equipment">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="name" hide-details label="Equipment Name" placeholder=""
                                variant="underlined" density="comfortable"></v-text-field>
                         
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="modelNo" hide-details label="Model Number" placeholder=""
                                variant="underlined" density="comfortable"></v-text-field>
                           
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-file-input accept="image/png, image/jpeg, image/bmp" v-model="image"
                                prepend-icon="mdi-image-outline" label="Image" hide-details density="comfortable" variant="outlined">
                            </v-file-input>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-text v-else>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="item" hide-details label="Category" placeholder=""
                                variant="underlined" density="comfortable"></v-text-field>
                        
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-file-input accept="image/png, image/jpeg, image/bmp" v-model="image"
                                prepend-icon="mdi-image-outline" label="Image" hide-details density="comfortable" variant="outlined">
                            </v-file-input>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="white" style="background: rgb(4 43 76);" @click="(show = false)">
                        cancel
                    </v-btn>
                    <v-btn color="white" style="background: rgb(4 43 76);"  @click="addCat()">
                        save
                    </v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
    name: 'EditCategory',
    data() {
        return {
            dialog: false,
            name: '',
            image: '',
            modelNo: ''
        }
    },
    props: {
        visible: {
            type: Boolean,
        },
        title:{
            type: String,
            default: 'Edit Category'
        },
        equipment:{
            type: Boolean,
            default: false
        },
        item: {
            type: String
        }

    },
    computed: {
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
    methods:{
        addCat(){
        
            const payload = {
                name: this.item,
                image: this.image
            }
            if(this.equipment){
                payload.modelNo = this.modelNo 
            }
            this.$emit( 'update', payload);
            // console.log(payload)

            this.name = '';
            this.image= '';
        }
    },
    created(){
        this.name = '';
        this.image = '';
        this.modelNo = ''
    }
}
</script>
<style scoped>
.dialog-card {
    padding: 20px;
    border-radius: 12px !important;
    background: #ffffff;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
}

.dialog-header {
    position: relative;
    padding: 16px 24px;
    background: linear-gradient(135deg, #042B4C 0%, #054272 100%);
    border-radius: 12px 12px 0 0;
    margin: -20px -20px 0;
}

.title-text {
    font-family: Montserrat, sans-serif !important;
    font-weight: 600;
    font-size: 1.25rem;
    color: #ffffff;
    width: 100%;
    text-align: center;
}

.close-btn {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #ffffff !important;
}

.dialog-content {
    padding: 24px 16px;
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.input-wrapper {
    position: relative;
}

.custom-input {
    font-family: Montserrat, sans-serif !important;
}

.custom-input :deep(.v-field) {
    border-radius: 8px;
    transition: all 0.3s ease;
}

.custom-input :deep(.v-field--focused) {
    box-shadow: 0 2px 8px rgba(4, 43, 76, 0.1);
}

.dialog-footer {
    padding: 16px;
    border-top: 1px solid #eee;
    justify-content: flex-end;
    gap: 12px;
}

.action-btn {
    min-width: 100px;
    height: 42px !important;
    text-transform: capitalize;
    font-family: Montserrat, sans-serif !important;
    font-weight: 500;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.cancel-btn {
    background: #f5f6fa !important;
    color: #042B4C !important;
}

.cancel-btn:hover {
    background: #e8e9ef !important;
    transform: translateY(-2px);
}

.save-btn {
    background: #042B4C !important;
    color: #ffffff !important;
}

.save-btn:hover {
    background: #054272 !important;
    transform: translateY(-2px);
}

/* Remove prepend icon if not needed */
.v-input__prepend {
    display: none !important;
}
</style>