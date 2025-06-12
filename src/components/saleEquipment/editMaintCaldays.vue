<template>
    <div class="text-center">
        <v-dialog v-model="show" transition="dialog-bottom-transition" activator="parent">
            <v-card width="584">
                <v-card-title>
                    <div class="text-h6" style="font-family: Montserrat, sans-serif !important;">Edit maintenance</div>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            
                            <!-- <v-col cols="12" sm="6" md="4">
                                <v-text-field  label="Calibration Period" v-model="items.caldays"
                                    density="comfortable" variant="underlined">
                                </v-text-field>
                                <span v-if="v$.CalPeriod.$error" style="color: red">
                                    {{ v$.CalPeriod.$errors[0].$message }}
                                    Calibration Period is required
                                </span>
                            </v-col> -->
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field  label="Maintenance Period" v-model="items.prevdays"
                                    density="comfortable" variant="underlined">
                                </v-text-field>
                                <span v-if="v$.MaintenancePeriod.$error" style="color: red">
                                    {{ v$.MaintenancePeriod.$errors[0].$message }}
                                    <!-- Maintenance Period is required -->
                                </span>
                            </v-col>
                           

                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="white" style="background: rgb(4 43 76);" @click="(show = false)">
                        cancel
                    </v-btn>
                    <v-btn color="white" style="background: rgb(4 43 76);" @click="addSale()">
                        save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import useVuelidate from "@vuelidate/core";
import { required, numeric, decimal, maxLength, email } from "@vuelidate/validators";
import { mapActions, mapState } from 'vuex'
export default {

    name: 'editEquipment',
    data() {
        return {
            v$: useVuelidate(),
            dialog: false,
            serialNo: '',
            // CalPeriod: '',
            MaintenancePeriod: '',
            selcetdClient: '',
            selcetdCategory: '',
            selcetdSubCategory: '',
            selcetedEquipment: '',
            invoice: '',
            amc: '',
            installationReport: '',
            warranty: '',
            maintenance: '',
            InstallationDate: "",
            WarrantyDate: "",
            orderDate: "",
            availSubCatList: [],
            availableEquilist: []
        }
    },
    validations() {
        return {
            // selcetdClient: { required },
            // selcetedEquipment: { required },
            // CalPeriod: { required, numeric },
            MaintenancePeriod: { required, numeric },
            // serialNo: { required },
            // InstallationDate: { required },
            // WarrantyDate: { required },
            // // invoice: { required },
            // // installationReport: { required },
            // // warranty: { required },
            // orderDate: { required }

        }
    },
    props: {
        visible: {
            type: Boolean,
        },
        title: {
            type: String
        },
        items: {
            type: Array
        }

    },
    computed: {
        ...mapState('clients', ['clientList']),
        ...mapState('category', ['categoryList']),
        ...mapState('subCategory', ['subcatList']),
        ...mapState('equipments', ['allEquipments']),


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


        ...mapActions('clients', ['GET_CLIENT_LIST']),
        ...mapActions('category', ['GET_ALL_CATEGORY']),
        ...mapActions('subCategory', ['GET_ALL_SUBCATEGORY']),
        ...mapActions('equipments', ['GET_EQUIPMENT', 'GET_ALL_EQUIPMENT']),

        addCat() {

            const payload = {
                name: this.name,
                image: this.image
            }

            this.$emit('save', payload);
            this.name = '';
            this.image = '';
        },
        getSubcatList() {
            this.availSubCatList = []
            if (!this.selcetdCategory) {
                this.availSubCatList = this.subcatList
            } else {
                const list = this.$store.getters["subCategory/get_all_sub_cat_with_cat_id"](this.selcetdCategory);
                this.availSubCatList = list
            }


        },
        getEquiList() {
            this.availableEquilist = []
            if (!this.selcetdSubCategory) {
                this.availableEquilist = this.allEquipments
            } else {
                const list = this.$store.getters["equipments/get_all_equipment_with_sub_catId"](this.selcetdSubCategory);
                this.availableEquilist = list
            }
        },
        addSale() {
        this.selcetdClient  = this.items.clientId
        this.selcetedEquipment = this.items.equipment.id
        // this.CalPeriod = this.items.caldays
        this.MaintenancePeriod = this.items.prevdays
        this.InstallationDate = this.items.installationDate
        this.WarrantyDate = this.items.warrantyDate
        this.serialNo  = this.items.serialNo
        this.orderDate  = this.items.orderDate
        
            this.v$.$validate();

            if (!this.v$.$error) {
                const payloads = {
                    serialNo: this.serialNo,
                    equipmentId: this.selcetedEquipment,
                    clientId: this.selcetdClient,
                    // callibrationPeriod: this.CalPeriod,
                    maintenancePeriod: this.MaintenancePeriod,
                    installationDate: this.InstallationDate,
                    warrantyDate: this.WarrantyDate,
                    invoice: this.invoice,
                    installationReport: this.installationReport,
                    warrantyDocument: this.warranty,
                    maintenanceContract: this.maintenance,
                    annualMaintenanceContract: this.amc,
                    orderDate: this.orderDate
                }
                this.$emit('save', payloads)
                // console.log(payloads)
            }
        },
        async initail(){
            await this.GET_CLIENT_LIST();
            await this.GET_ALL_CATEGORY();
            await this.GET_ALL_SUBCATEGORY().then(()=>{
                this.getSubcatList()
            })
            await this.GET_ALL_EQUIPMENT().then(()=>{
                this.getEquiList()
            })
        }
    },
    created() {
        // this.initail()
       
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

.date {
    height: 50%;
    align-items: center;
    border-bottom: solid 1px #ababab;
    width: max-content;
    padding-bottom: 7px;
}
</style>
<style>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
    transition: transform .2s ease-in-out;
}
</style>