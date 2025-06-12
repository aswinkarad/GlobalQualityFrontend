<template>
  <v-container class="px-10" fluid style="height:100vh; background:rgb(247 248 249) ;">
        <div class="text-h6 mb-2" style="font-family:'Montserrat', sans-serif !important">
          Calibration Reminder
        </div>
        <!-- <searchAndFilterToolbar :btn_text="reminder_text" /> -->
        <v-table  class="rounded-lg mt-4" >
            <thead>
                <tr>
                    <th class="text-left">
                       #
                    </th>
                    <th class="text-left">
                        Equipment 
                    </th>
                    <th class="text-left">
                        Due Date (days remaining)
                    </th>
                    <th class="text-left">
                        Client
                    </th>
                    <!-- <th class="text-left">
                        Call Registration date & time
                    </th> -->
                    <th class="text-left">
                        City
                    </th>
                    <th class="text-left">
                        Actions
                    </th>
                  
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, i) in calibrationList" :key="item.name">
                  
                    <td> {{ i + 1 }} </td>
                    <td>{{ item.sale.equipment.equipmentName }}</td>
                    <td>{{ item.callibrationPeriod.split('T')[0] }}({{ getDays(item.callibrationPeriod.split('T')[0]) }})</td>
                    <td>{{ item.sale.client.name }}</td>
                    <td>{{ item.sale.client.city.city }}</td>
                    <!-- <td>{{ item.status }}</td> -->
                    <!-- <td>{{ item.added }}</td> -->
            

                    <td>
                        <v-btn color="indigo" min-width="0" class="pa-3" dark @click="updateService(item)">
                            <v-icon> mdi-pencil-outline </v-icon>
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>
        <paginationVue :length="calibrationTotalPage"  @chanegePage="chanegePage"/>
        <deleteWarnVue :visible="delete_dialog" @close="delete_dialog = false" :item="deleteValue" :log="true" 
            @delete="update" />
   </v-container>     
</template>

<script>
import { mapActions, mapState } from 'vuex';
import moment from 'moment';
import deleteWarnVue from '@/components/deleteWarn.vue';
import paginationVue from '@/components/pagination.vue';
// import searchAndFilterToolbar from '@/components/searchAndFilterToolbar.vue'
export default {
    name: 'calibrationReminder',
    components:{
        // searchAndFilterToolbar,
        deleteWarnVue,
        paginationVue
    },
    computed:{
        ...mapState('calibrationReminter',['calibrationList', 'calibrationTotalPage'])
    },
    methods:{
        ...mapActions('calibrationReminter',['GET_CALIBRATION_LIST','UPDATE_SERVICE_CALIBRATION']),
        getDays(date){
            const days = moment(date, "YYYYMMDD").fromNow();
            return days
        },
         updateService(item){
            this.delete_dialog = true;
            this.deleteValue = item
        },
        async update(item){
          await this.UPDATE_SERVICE_CALIBRATION(item);
         this.delete_dialog = false;
          await this.GET_CALIBRATION_LIST();
        },
        chanegePage(page){
            const query = {
                page: page,
                size: 15
            }
            this.GET_CALIBRATION_LIST(query);
        }
    },
    mounted(){
        this.GET_CALIBRATION_LIST();
    },
    data(){
        return{
            reminder_text:'',
            delete_dialog: false,
            deleteValue:{},

        }
    }
}
</script>

<style scoped>
tbody tr:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, .05);
}
</style>