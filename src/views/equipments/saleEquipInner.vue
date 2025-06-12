<template>
    <v-container class="px-10" fluid style="height:100vh; background:#e7f0f7 ;">
        <v-icon @click="$router.back()">mdi-arrow-left</v-icon>

        <div class="details mt-3 rounded-lg" style="font-family: 'Montserrat', sans-serif;">
            <v-row>
                <v-col cols="12" md="4">
                    <p>Serial Number : <span class="detval"> {{ editValue.serialNo }} </span> </p>
                    <p>Sub-Category : <span class="detval" v-if="editValue.equipment"> {{
                            editValue.equipment.subcategory.subcategoryName
                    }} </span> </p>
                    <p>Maintenance Period : <span class="detval"> {{ editValue.prevdays }} </span> </p>
                    <!-- <p>Order date : <span class="detval" v-if="editValue.orderDate"> {{
                            editValue.orderDate.split('T')[0]
                    }} </span> </p> -->

                </v-col>
                <v-col cols="12" md="4">

                    <p>Client Name : <span class="detval" v-if="editValue.client"> {{ editValue.client.name }} </span>
                    </p>
                    <p>Equipment Name : <span class="detval" v-if="editValue.equipment"> {{
                            editValue.equipment.equipmentName
                    }} </span> </p>
                    <p>Installation date : <span class="detval" v-if="editValue.installationDate"> {{
                            editValue.installationDate.split('T')[0]
                    }} </span> </p>

                </v-col>
                <v-col cols="12" md="4">

                    <p>Category : <span class="detval" v-if="editValue.equipment"> {{
                            editValue.equipment.subcategory.category.categoryName
                    }} </span> </p>
                    <!-- <p>Calibration Period : <span class="detval"> {{ editValue.caldays }} </span> </p> -->
                    <p>Warranty date : <span class="detval" v-if="editValue.warrantyDate"> {{
                            editValue.warrantyDate.split('T')[0]
                    }} </span> </p>

                </v-col>
            </v-row>

        </div>
        <div class="mt-10">
            <v-row>
                <!-- <v-col cols="12" md="3"> -->
                <a :href="editValue.installationReport" target="_blank">
                    <v-btn class="mx-4"> Installation Report </v-btn>
                </a>

                <!-- </v-col> -->
                <!-- <v-col cols="12" md="3"> -->
                <a :href="editValue.invoice" target="_blank">
                    <v-btn class="mx-4"> invoice </v-btn>
                </a>

                <!-- </v-col> -->
                <!-- <v-col cols="12" md="3"> -->
                <a v-if="editValue.annualMaintenanceContract" :href="editValue.annualMaintenanceContract" target="_blank">
                    <v-btn class="mx-4"> Anual Maintenance Contract </v-btn>
                </a>

                <!-- </v-col>       -->
                <!-- <v-col cols="12" md="3"> -->
                <a :href="editValue.warrantyDocument" target="_blank">
                    <v-btn class="mx-4"> Warranty Document</v-btn>
                </a>

                <!-- </v-col> -->
                <!-- <v-col cols="12" md="3"> -->
                <a v-if="editValue.maintenanceContract" :href="editValue.maintenanceContract" target="_blank">
                    <v-btn class="mx-4"> Maintenance Report </v-btn>
                </a>

                <!-- </v-col> -->
            </v-row>
        </div>

    </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
    name: 'clientInnerpage',
    computed: {
        ...mapState('salesEquipment', ['editValue']),
    },
    methods: {
        ...mapActions('salesEquipment', ['GET_SALE_EQUIPMENT_BY_ID']),
        async getSaleDetails() {

            await this.GET_SALE_EQUIPMENT_BY_ID(this.$route.params).then(() => {
                // console.log(this.editValue)
            })
        }

    },
    mounted() {
        this.getSaleDetails()
    }
}
</script>

<style scoped>
.details {
    font-size: large;
    font-weight: 500;
    margin-top: 19px;
    border: 1px solid #bbbfee;
    padding: 23px;
}

.detval {
    font-weight: 600;
}

a,
a:hover,
a:focus,
a:active {
    text-decoration: none;
    color: inherit;
}
</style>