<template>
    <v-container class="px-10" fluid style="height:100vh; background: ;">
        <div class="text-h6 mb-2" style="font-family:'Montserrat', sans-serif !important">
            CALIBRATOIN
        </div>
        <searchAndFilterToolbar :btn_text="serv_text" @btn_action="dialog = true"/>
        <v-table class="rounded-lg mt-4">
            <thead>
                <tr>
                    <th class="text-left">
                        #
                    </th>
                    <th class="text-left">
                        Equipment Name
                    </th>
                    <th class="text-left">
                        Client
                    </th>
                    <th class="text-left">
                        City
                    </th>
                    <th class="text-left">
                        Working Status
                    </th>
                    <th class="text-left">
                        Serial Number
                    </th>
                    <th class="text-left">
                        Priority
                    </th>
                    <th class="text-left">
                        Assigned to
                    </th>
                    <th class="text-left">
                        Status
                    </th>
                    <th class="text-left">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in desserts" :key="item.name">

                    <td></td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.user }}</td>
                    <td>{{ item.callhandle }}</td>
                    <td>{{ item.status }}</td>
                    <td>{{ item.reportNumber }}</td>
                    <td>{{ item.regDatTime }}</td>
                    <td>{{ item.attendedBy }}</td>
                    <td>
                        <v-chip color="#fd5e00" v-if="item.status == 'open'" style="min-width: 100px; cursor: pointer;"> <span class="ma-auto">{{ item.status}}</span>
                                <v-menu activator="parent">
                                    <v-list class="pa-0">
                                        <v-list-item @click="changeStatus(status, item.id)" :style="{ 'background': status.bck  }" v-for="status in items" :key="status.id">
                                            <v-list-item-title style="color: white ;"> {{ status.title }} </v-list-item-title>
                                        </v-list-item>
                                        <!-- <v-list-item style="background: #20ad8c;">
                                            <v-list-item-title style="color: white;"> Assigned </v-list-item-title>
                                        </v-list-item> -->
                                    </v-list>
                                </v-menu>
                        </v-chip>
                        <v-chip color="#1985d0" v-else-if="item.status == 'Complete'" style="min-width: 100px; cursor: pointer;"> <span class="ma-auto">{{ item.status}}</span>
                                <v-menu activator="parent">
                                    <v-list class="pa-0">
                                        <v-list-item @click="changeStatus(status, item.id)" :style="{ 'background': status.bck  }" v-for="status in items" :key="status.id">
                                            <v-list-item-title style="color: white ;"> {{ status.title }} </v-list-item-title>
                                        </v-list-item>
                                        <!-- <v-list-item style="background: #20ad8c;">
                                            <v-list-item-title style="color: white;"> Assigned </v-list-item-title>
                                        </v-list-item> -->
                                    </v-list>
                                </v-menu>
                        </v-chip>
                        <v-chip color="#20ad8c" v-else-if="item.status == 'Assigned'" style="min-width: 100px; cursor: pointer;"> <span class="ma-auto">{{ item.status}}</span>
                                <v-menu activator="parent">
                                    <v-list class="pa-0">
                                        <v-list-item @click="changeStatus(status, item.id)" :style="{ 'background': status.bck  }" v-for="status in items" :key="status.id">
                                            <v-list-item-title style="color: white ;"> {{ status.title }} </v-list-item-title>
                                        </v-list-item>
                                        <!-- <v-list-item style="background: #20ad8c;">
                                            <v-list-item-title style="color: white;"> Assigned </v-list-item-title>
                                        </v-list-item> -->
                                    </v-list>
                                </v-menu>
                        </v-chip>

                    </td>
                   
                    <td>
                         <v-hover v-slot="{ isHovering, props }">
                            <v-avatar rounded size="small" v-bind="props" class="mr-1"
                                :class="isHovering ? 'elevation-12' : 'elevation-2'" color="blue-darken-2"
                                style="cursor: pointer;">
                                <v-icon size="18" icon="mdi-pencil-outline"></v-icon>
                            </v-avatar>
                        </v-hover>
                        <v-hover v-slot="{ isHovering, props }">
                            <v-avatar rounded size="small" v-bind="props" class="mr-1"
                                :class="isHovering ? 'elevation-12' : 'elevation-2'" color="#e9bc10"
                                style="cursor: pointer;">
                                <v-icon size="18" color="white" icon="mdi-trash-can-outline"></v-icon>
                            </v-avatar>
                        </v-hover>
                    </td>
                </tr>
            </tbody>
        </v-table>
        <!-- <addcalibrationVue :visible="dialog" @close="dialog = false" @save="addCategory" :title="dialog_title" /> -->
    </v-container>
</template>

<script>
import searchAndFilterToolbar from '@/components/searchAndFilterToolbar.vue';
// import addcalibrationVue from '@/components/addCalibration.vue';
export default {
    name: 'servicecalibration',
    components: {
        searchAndFilterToolbar,
        // addcalibrationVue
    },
    data() {
        return {
            serv_text: '',
            dialog: false,
            items: [
                {
                    title: 'Complete',
                    bck: '#1985d0'
                },
                { 
                    title: 'Assigned',
                    bck:'#20ad8c' 
                },
                { 
                    title: 'open',
                    bck:'#fd5e00' 
                },
               
            ],
              desserts: [
                {   id: 1,
                    name: 'Mark Otto',
                    user: 'super admin',
                    callhandle: 'internal',
                    Wstatus: 'Not Working',
                    reportNumber: '0034',
                    regDatTime: '2022-02-14 01:30 PM',
                    attendedBy: '-',
                    firstAttende: '-',
                    status: 'open'
                    
                },
                {   
                    id: 2,
                    name: 'Mark Otto',
                    user: 'super admin',
                    callhandle: 'internal',
                    Wstatus: 'Not Working',
                    reportNumber: '0034',
                    regDatTime: '2022-02-14 01:30 PM',
                    attendedBy: '-',
                    firstAttende: '-',
                    complete: '-',
                    status: 'Complete'
                },
                {   
                    id: 3,
                    name: 'Mark Otto',
                    user: 'super admin',
                    callhandle: 'internal',
                    Wstatus: 'Not Working',
                    reportNumber: '0034',
                    regDatTime: '2022-02-14 01:30 PM',
                    attendedBy: '-',
                    firstAttende: '-',
                    complete: '-',
                    status: 'open'
                },

            ],

        }
    },
     methods:{
        changeStatus(status, item){            
            const index = this.desserts.findIndex(el => el.id == item)
            this.desserts[index].status = status.title

        }
    }
}
</script>

<style scoped>
tbody tr:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, .05);
}
</style>