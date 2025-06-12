<template>
    <v-container class="px-10" fluid style="height:100vh; background:#e7f0f7 ;">
        <v-icon @click="$router.back()">mdi-arrow-left</v-icon>

        <div class="details mt-3 rounded-lg" style="font-family: 'Montserrat', sans-serif;">
            <v-row>
                <v-col cols="12" md="4">
                    <p>Client name: <span class="detval" v-if="editServicetValue.sale">{{ editServicetValue.sale.client.name }} </span> </p>
                    <p>Serial Number : <span class="detval" v-if="editServicetValue.sale" > {{
                         editServicetValue.sale.serialNo
                    }} </span> </p>
                    <p> Assigned to : <span class="detval" v-if="editServicetValue.user">{{ editServicetValue.user.username }} </span> </p>
                    <p> Attended On  : <span class="detval" v-if="editServicetValue.attendedOn" > {{
                           editServicetValue.attendedOn.split('T')[0]
                    }} </span> </p>

                </v-col>
                <v-col cols="12" md="4">

                    <p>City : <span class="detval" v-if="editServicetValue.sale" > {{ editServicetValue.sale.client.city.city }} </span>
                    </p>
                    <p>working Condition : <span class="detval" v-if=" editServicetValue.working_condition" > {{ editServicetValue.working_condition.workingCondition  }} </span> </p>
                    <p>Call Handle : <span class="detval" v-if="editServicetValue.call_handle" > {{
                            editServicetValue.call_handle.callHandle
                    }} </span> </p>
                    <p> Completed On : <span class="detval"  v-if="editServicetValue.completedOn" > {{
                           editServicetValue.completedOn.split('T')[0]
                    }} </span> </p>


                </v-col>
                <v-col cols="12" md="4">

                    <p>Mechine name: <span class="detval" v-if="editServicetValue.sale" > {{
                           editServicetValue.sale.equipment.equipmentName
                    }} </span> </p>
                    <p>Priority : <span class="detval" v-if="editServicetValue.priority"> {{ editServicetValue.priority.priority }} </span> </p>
                    <p> Call Registration date : <span class="detval" v-if="editServicetValue.callRegisterDate"  > {{
                           editServicetValue.callRegisterDate.split('T')[0]
                    }} </span> </p>

                </v-col>
            </v-row>

        </div>
        <div class="mt-10">
            <v-row>
                <!-- <v-col cols="12" md="3"> -->
                <a v-if="editServicetValue.document1" :href="editServicetValue.document1" target="_blank">
                    <v-btn class="mx-4"> Document 1 </v-btn>
                </a>
                <a v-if="editServicetValue.document2" :href="editServicetValue.document2" target="_blank">
                    <v-btn class="mx-4"> Document 2 </v-btn>
                </a>
                <a v-if="editServicetValue.document3" :href="editServicetValue.document3" target="_blank">
                    <v-btn class="mx-4"> Document 3 </v-btn>
                </a>

                <!-- </v-col> -->
                <!-- <v-col cols="12" md="3"> -->
                <!-- <a :href="editValue.invoice" target="_blank">
                    <v-btn class="mx-4"> invoice </v-btn>
                </a> -->

                <!-- </v-col> -->
                <!-- <v-col cols="12" md="3"> -->
                <!-- <a v-if="editValue.annualMaintenanceContract" :href="editValue.annualMaintenanceContract" target="_blank">
                    <v-btn class="mx-4"> Anual Maintenance Contract </v-btn>
                </a> -->

                <!-- </v-col>       -->
                <!-- <v-col cols="12" md="3"> -->
                <!-- <a :href="editValue.warrantyDocument" target="_blank">
                    <v-btn class="mx-4"> Warranty Document</v-btn>
                </a> -->

                <!-- </v-col> -->
                <!-- <v-col cols="12" md="3"> -->
                <!-- <a v-if="editValue.maintenanceContract" :href="editValue.maintenanceContract" target="_blank">
                    <v-btn class="mx-4"> Maintenance Report </v-btn>
                </a> -->

                <!-- </v-col> -->
            </v-row>
        </div>

    </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
    name: 'serviceInner',
    computed: {
        ...mapState('service', ['editServicetValue']),
    },
    methods: {
        ...mapActions('service', ['GET_SERVICE_WITH_ID']),
        async getServiceDetails() {

            await this.GET_SERVICE_WITH_ID(this.$route.params).then(() => {
                console.log(this.editServicetValue)
            })
        }

    },
    mounted() {
        this.getServiceDetails()
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