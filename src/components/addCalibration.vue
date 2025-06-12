<template>
    <div class="text-center">
        <v-dialog v-model="show"  transition="dialog-bottom-transition" activator="parent">
            <v-card width="inherit">
                <v-card-title>
                    <div class="text-h6" style="font-family: Montserrat, sans-serif !important;">{{ title }}</div>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-autocomplete variant="outlined" density="comfortable" v-model="selcetdClient" dense
                                    clearable
                                    :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                                    label="Client"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-autocomplete variant="outlined" density="comfortable" v-model="selcetdClient" dense
                                    clearable
                                    :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                                    label="City"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-autocomplete variant="outlined" density="comfortable" v-model="selcetdCategory"
                                    clearable
                                    :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                                    label="Machine name">
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-autocomplete variant="outlined" density="comfortable" v-model="selcetdSubCategory"
                                    clearable
                                    
                                    :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                                    label="Serial Number"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-autocomplete variant="outlined" density="comfortable" v-model="selcetedEquipment"
                                    clearable
                                    :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                                    label="working Condition"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                 <v-autocomplete variant="outlined" density="comfortable" v-model="selcetedEquipment"
                                    clearable
                                    :items="['Skiing', 'Ice hockey']"
                                    label="Priority"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                   <v-autocomplete variant="outlined" density="comfortable" v-model="selcetedEquipment"
                                    clearable
                                    :items="['Skiing', 'Ice hockey']"
                                    label="Assigned To"></v-autocomplete>
                            </v-col>

                           
                        </v-row>
                    </v-container>
                </v-card-text>
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
export default {
    name: 'addCalibration',
    data() {
        return {
            dialog: false,
            name: '',
            image: '',
            modelNo: '',
            selcetdClient: '',
            selcetdCategory: '',
            selcetdSubCategory: '',
            selcetedEquipment: '',
            InstallationDate: new Date().toISOString().substr(0, 10),
        }
    },
    props: {
        visible: {
            type: Boolean,
        },
        title: {
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
    methods: {
        addCat() {

            const payload = {
                name: this.name,
                image: this.image
            }

            this.$emit('save', payload);
            this.name = '';
            this.image = '';
        }
    },
    created() {
        this.name = '';
        this.image = '';
        this.modelNo = ''
    }
}
</script>
<style scoped>
.v-input__prepend {
    display: none !important;
}

input:focus {
    outline: none !important;
}

</style>
<style>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform .2s ease-in-out;
}
</style>