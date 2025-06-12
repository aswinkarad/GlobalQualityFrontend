<template>
    <v-container class="px-10 hmmsdashboard" fluid style="height:100vh;">
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

        <div class="text-h6 mb-4 mt-6 dashboard-title">
            SERVICE REPORT
        </div>

        <Transition name="slide-fade">
            <div class="mt-4 mb-2">
                <v-row>
                    <v-col cols="12" md="2">
                        <v-autocomplete 
                            v-model="clientName" 
                            @click="resetMachineId" 
                            hide-details 
                            variant="outlined"
                            density="comfortable" 
                            :items="clien || []" 
                            item-title="name" 
                            item-value="id" 
                            clearable 
                            label="Clients"
                            @update:modelValue="filterService"
                        ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-autocomplete 
                            v-model="cityId" 
                            hide-details 
                            variant="outlined"
                            density="comfortable" 
                            :items="availableCities" 
                            item-title="city" 
                            item-value="id" 
                            clearable 
                            label="City"
                            @click="loadCities"
                            @update:modelValue="filterService"
                        ></v-autocomplete>
                    </v-col>
                    <!-- <v-col cols="12" md="2">
                        <v-autocomplete 
                            v-model="machineId" 
                            hide-details 
                            variant="outlined"
                            density="comfortable" 
                            :items="mechine || []" 
                            :item-title="test" 
                            item-value="id" 
                            clearable 
                            label="Machine (Serial No)"
                            @click="getClientMechines()"
                            @update:modelValue="filterService"
                        ></v-autocomplete>
                    </v-col> -->
                    <v-col cols="12" md="2">
                        <v-autocomplete 
                            v-model="workingStatusId" 
                            hide-details 
                            variant="outlined"
                            density="comfortable" 
                            :items="statuses" 
                            item-title="name" 
                            item-value="id" 
                            clearable 
                            label="Status"
                            @update:modelValue="filterService"
                        ></v-autocomplete>
                    </v-col>
                    <!-- <v-col cols="12" md="2">
                        <v-text-field 
                            v-model="startDate" 
                            label="Start Date" 
                            type="date" 
                            variant="outlined"
                            density="comfortable" 
                            clearable
                            @update:modelValue="filterService"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-text-field 
                            v-model="endDate" 
                            label="End Date" 
                            type="date" 
                            variant="outlined"
                            density="comfortable" 
                            clearable
                            @update:modelValue="filterService"
                        ></v-text-field>
                    </v-col> -->
                    <v-col cols="12" md="2" style="align-self: center;">
                        <div class="d-flex justify-end">
                            <v-btn 
                                style="background: rgb(4 43 76);" 
                                @click="filterService"
                            >
                                <span style="color: white">Filter</span>
                            </v-btn>
                            <v-menu open-on-hover>
                                <template v-slot:activator="{ props }">
                                    <v-btn 
                                        v-bind="props" 
                                        style="background: rgb(4 43 76);"
                                        class="ml-2"
                                    >
                                        <span style="color: white">Export</span>
                                    </v-btn>
                                </template>
                                <v-list style="cursor: pointer">
                                    <v-list-item>
                                        <JsonCSV :data="json_data" :name="`Service_Report_${new Date().toISOString().split('T')[0]}.csv`">
                                            <v-list-item-title>CSV</v-list-item-title>
                                        </JsonCSV>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-title @click="toPdf()">PDF</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                    </v-col>
                </v-row>
            </div>
        </Transition>

        <v-table class="rounded-lg mt-6 modern-table">
            <thead>
                <tr>
                    <th class="text-left">#</th>
                    <th class="text-left">Equipment Name</th>
                    <th class="text-left">Client</th>
                    <th class="text-left">City</th>
                    <th class="text-left">Call Handle</th>
                    <th class="text-left">Working Status</th>
                    <th class="text-left">Serial Number</th>
                    <th class="text-left">Call Registration Date</th>
                    <th class="text-left">Priority</th>
                    <th class="text-left">Assigned to</th>
                    <th class="text-left">Status</th>
                    <th class="text-left">Created At</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, i) in serviceList" :key="item.id" class="table-row-hover">
                    <td>{{ i + 1 }}</td>
                    <td>{{ item.sale?.equipment?.equipmentName || 'N/A' }}</td>
                    <td>{{ item.sale?.client?.name || 'N/A' }}</td>
                    <td>{{ item.sale?.client?.city?.city || 'N/A' }}</td>
                    <td>{{ item.call_handle?.callHandle || 'N/A' }}</td>
                    <td>{{ item.workingcondition?.workingCondition || 'N/A' }}</td>
                    <td>{{ item.sale?.serialNo || 'N/A' }}</td>
                    <td>{{ item.callRegisterDate?.split('T')[0] || 'N/A' }}</td>
                    <td>{{ item.priority?.priority || 'N/A' }}</td>
                    <td><span v-if="item.user">{{ item.user.username }}</span><span v-else>N/A</span></td>
                    <td>
                        <v-chip
                            :class="{ Open: item.workingStatusId == 1, Accepted: item.workingStatusId == 2, Completed: item.workingStatusId == 3, Verified: item.workingStatusId == 4, Cancel: item.workingStatusId == 5 }"
                            style="min-width: 100px; cursor: pointer; color: white;"
                        >
                            <span class="ma-auto">{{ item.working_status?.workingStatus || 'N/A' }}</span>
                        </v-chip>
                    </td>
                    <td>{{ formatDate(item.createdAt) }}</td>
                </tr>
            </tbody>
        </v-table>

        <div v-if="serviceTotalPages > 0">
            <paginationVue :length="serviceTotalPages" @chanegePage="chanegePage" />
        </div>
    </v-container>
</template>

<script>
import paginationVue from '@/components/pagination.vue';
import { mapActions, mapState, mapMutations } from 'vuex';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import JsonCSV from 'vue-json-csv';

export default {
    name: 'serviceRequest',
    components: {
        paginationVue,
        JsonCSV
    },
    data() {
        return {
            breadcrumbs: [
                { text: 'Home', disabled: false, href: '/' },
                { text: 'Service Report', disabled: true, href: '/service-report' },
            ],
            clien: [],
            mechine: [],
            availableCities: [],
            machineId: '',
            clientName: '',
            cityId: '',
            workingStatusId: '',
            startDate: '',
            endDate: '',
            json_data: [],
            statuses: [
                { id: 1, name: 'Open' },
                { id: 2, name: 'In Progress' },
                { id: 3, name: 'Completed' },
                { id: 4, name: 'Verified' },
                { id: 5, name: 'Cancel' },
            ],
            heading: "Service Report",
            allCitiesLoaded: false,
            isInitialLoad: true
        }
    },
    computed: {
        ...mapState('service', ['serviceList', 'serviceTotalPages', 'serviceReportList']),
        ...mapState('clients', ['clientList']),
        ...mapState('salesEquipment', ['saleEquipmentList']),
        ...mapState('city', ['cityList'])
    },
    methods: {
        ...mapMutations('service', ['REMOVE_ALL_SERVICE_LIST']),
        ...mapActions('clients', ['GET_CLIENT_LIST']),
        ...mapActions('service', ['GET_SERVICE_LIST', 'GET_SERVICE_REPORT_LIST']),
        ...mapActions('salesEquipment', ['GET_ALL_SALE_EQUIPMENT']),
        ...mapActions('city', ['GET_CITY_LIST']),

        formatDate(date) {
            if (!date) return 'N/A';
            return new Date(date).toISOString().split('T')[0];
        },

        test(item) {
            return ` ${item.equipment ? item.equipment.equipmentName : ''} (${item.serialNo}) `;
        },

        resetMachineId() {
            this.machineId = '';
        },

        async extractCitiesFromServiceData() {
            if (this.serviceList && this.serviceList.length > 0) {
                const uniqueCities = new Map();
                this.serviceList.forEach(service => {
                    if (service.sale?.client?.city) {
                        const city = service.sale.client.city;
                        if (city.id && city.city) {
                            uniqueCities.set(city.id, city);
                        }
                    }
                });
                return Array.from(uniqueCities.values());
            }
            return [];
        },

        async loadCities() {
            try {
                if (!this.allCitiesLoaded) {
                    await this.GET_CITY_LIST({ size: 1000 });
                    if (Array.isArray(this.cityList) && this.cityList.length > 0) {
                        this.availableCities = this.cityList;
                        this.allCitiesLoaded = true;
                        return;
                    }
                }
                const extractedCities = await this.extractCitiesFromServiceData();
                if (extractedCities.length > 0) {
                    this.availableCities = extractedCities;
                }
            } catch (error) {
                console.error('Error loading cities:', error);
                const extractedCities = await this.extractCitiesFromServiceData();
                if (extractedCities.length > 0) {
                    this.availableCities = extractedCities;
                }
            }
        },

        async getClientMechines() {
            let query = { size: 1000 };
            if (this.clientName) {
                query.cid = this.clientName;
            }
            try {
                await this.GET_ALL_SALE_EQUIPMENT(query);
                this.mechine = Array.isArray(this.saleEquipmentList) ? this.saleEquipmentList : [];
            } catch (error) {
                console.error('Error fetching machines:', error);
                this.mechine = [];
            }
        },

        async loadInitialData() {
            const query = {
                size: 10,
                page: 1
            };
            try {
                await this.GET_SERVICE_LIST(query);
                await this.loadCities();
            } catch (error) {
                console.error('Error loading initial data:', error);
            }
        },

        async filterService() {
            const query = {
                clientid: this.clientName || '',
                sid: this.machineId || '',
                statid: this.workingStatusId || '',
                cityid: this.cityId || '',
                startdte: this.startDate || '',
                enddte: this.endDate || '',
                size: 10,
                page: 1
            };
            try {
                await this.GET_SERVICE_LIST(query);
                if (!this.isInitialLoad) {
                    await this.loadCities();
                }
                this.isInitialLoad = false;
            } catch (error) {
                console.error('Error filtering services:', error);
            }
        },

        async chanegePage(page) {
            const query = {
                clientid: this.clientName || '',
                sid: this.machineId || '',
                statid: this.workingStatusId || '',
                cityid: this.cityId || '',
                startdte: this.startDate || '',
                enddte: this.endDate || '',
                page: page,
                size: 10
            };
            try {
                await this.GET_SERVICE_LIST(query);
            } catch (error) {
                console.error('Error changing page:', error);
            }
        },

        toCSV() {
            this.json_data = this.serviceList.map(el => ({
                'EQUIPMENT NAME': el.sale?.equipment?.equipmentName || 'N/A',
                'CLIENT NAME': el.sale?.client?.name || 'N/A',
                'CITY': el.sale?.client?.city?.city || 'N/A',
                'CALL HANDLE': el.call_handle?.callHandle || 'N/A',
                'WORKING STATUS': el.workingcondition?.workingCondition || 'N/A',
                'SERIAL NUMBER': el.sale?.serialNo || 'N/A',
                'CALL REGISTRATION DATE': el.callRegisterDate?.split('T')[0] || 'N/A',
                'PRIORITY': el.priority?.priority || 'N/A',
                'TECHNICIAN': el.user ? el.user.username : 'N/A',
                'STATUS': el.working_status?.workingStatus || 'N/A',
                'CREATED AT': this.formatDate(el.createdAt),
            }));
        },

        async toPdf() {
            const payload = {
                clientid: this.clientName || '',
                sid: this.machineId || '',
                statid: this.workingStatusId || '',
                cityid: this.cityId || '',
                startdte: this.startDate || '',
                enddte: this.endDate || '',
                size: 1000000
            };
            try {
                await this.GET_SERVICE_REPORT_LIST(payload);
                const doc = new jsPDF('p', 'mm', 'a4');
                const columns = [
                    { header: "Equipment Name", dataKey: "equipName" },
                    { header: "Call Handle", dataKey: "callHandle" },
                    { header: "Working Status", dataKey: "workingCondition" },
                    { header: "Serial Number", dataKey: "serialNo" },
                    { header: "Reg Date", dataKey: "regDate" },
                    { header: "Priority", dataKey: "priority" },
                    { header: "Assigned To", dataKey: "assgndTo" },
                    { header: "Created At", dataKey: "createdAt" },
                ];

                const body = Array.isArray(this.serviceReportList) ? this.serviceReportList.map(el => ({
                    equipName: el.sale?.equipment?.equipmentName || 'N/A',
                    client: el.sale?.client?.name || 'N/A',
                    city: el.sale?.client?.city?.city || 'N/A',
                    callHandle: el.call_handle?.callHandle || 'N/A',
                    workingCondition: el.workingcondition?.workingCondition || 'N/A',
                    serialNo: el.sale?.serialNo || 'N/A',
                    regDate: el.callRegisterDate?.split('T')[0] || 'N/A',
                    priority: el.priority?.priority || 'N/A',
                    assgndTo: el.user ? el.user.username : 'N/A',
                    status: el.working_status?.workingStatus || 'N/A',
                    createdAt: this.formatDate(el.createdAt),
                })) : [];

                if (!this.clientName) {
                    columns.splice(1, 0, { header: "Client", dataKey: "client" });
                }
                if (!this.cityId) {
                    columns.splice(this.clientName ? 2 : 1, 0, { header: "City", dataKey: "city" });
                }
                if (!this.workingStatusId) {
                    columns.splice(columns.length - 1, 0, { header: "Status", dataKey: "status" });
                }

                doc.setFontSize(20);
                doc.text("SERVICE REPORT", 105, 20, { align: 'center' });
                doc.setLineWidth(0.5);
                doc.line(15, 25, 195, 25);

                doc.setFontSize(10);
                let yPos = 35;
                doc.text(`Client: ${this.clientName ? this.clien.find(c => c.id === this.clientName)?.name || 'All' : 'All'}`, 15, yPos);
                yPos += 7;
                doc.text(`City: ${this.cityId ? this.availableCities.find(c => c.id === this.cityId)?.city || 'All' : 'All'}`, 15, yPos);
                yPos += 7;
                doc.text(`Machine: ${this.machineId ? this.mechine.find(m => m.id === this.machineId)?.equipment?.equipmentName || 'All' : 'All'}`, 15, yPos);
                yPos += 7;
                doc.text(`Serial No: ${this.machineId ? this.mechine.find(m => m.id === this.machineId)?.serialNo || 'All' : 'All'}`, 15, yPos);
                yPos += 7;
                doc.text(`Status: ${this.workingStatusId ? this.statuses.find(s => s.id === this.workingStatusId)?.name || 'All' : 'All'}`, 15, yPos);
                yPos += 7;
                doc.text(`Date Range: ${this.startDate && this.endDate ? `${this.startDate} ~ ${this.endDate}` : 'All'}`, 15, yPos);

                autoTable(doc, {
                    startY: yPos + 10,
                    head: [columns.map(col => col.header)],
                    body: body.map(row => columns.map(col => row[col.dataKey])),
                    styles: { fontSize: 8, cellPadding: 2 },
                    headStyles: { fillColor: [4, 43, 76], textColor: [255, 255, 255] },
                    margin: { left: 15, right: 15 }
                });

                doc.save(`Service_Report_${new Date().toISOString().split('T')[0]}.pdf`);
            } catch (error) {
                console.error('Error generating PDF:', error);
            }
        }
    },
    async mounted() {
        this.REMOVE_ALL_SERVICE_LIST();
        try {
            await Promise.all([
                this.GET_CLIENT_LIST({ size: 1000 }).then(() => {
                    this.clien = Array.isArray(this.clientList) ? this.clientList : [];
                }),
                this.GET_ALL_SALE_EQUIPMENT({ size: 1000 }).then(() => {
                    this.mechine = Array.isArray(this.saleEquipmentList) ? this.saleEquipmentList : [];
                }),
                this.loadInitialData()
            ]);
        } catch (error) {
            console.error('Error during initialization:', error);
            this.clien = [];
            this.mechine = [];
            this.availableCities = [];
        }
    }
}
</script>

<style scoped>
.hmmsdashboard {
    background: linear-gradient(135deg, #F5F7FA, #E8ECEF);
    min-height: 100vh;
    padding: 20px;
}

.breadcrumbs-container {
        background: linear-gradient(90deg, #4d90fe, #285bc7);
    border-radius: 8px;
    padding: 10px 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.custom-breadcrumb-item {
    color: white;
    font-weight: 600;
}

.dashboard-title {
    font-family: 'Montserrat', sans-serif;
    color: #2A4066;
    font-weight: 700;
}

.modern-table {
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
}

.modern-table th {
    background: #042B4C;
    color: white !important;
    padding: 12px;
    font-weight: 600;
}

.table-row-hover:hover {
    background: #f5f7fa;
}

.v-table tbody tr td {
    padding: 12px;
    border-bottom: 1px solid #eee;
}

.v-table {
    font-family: 'Montserrat', sans-serif;
}

.Open { background: #1985d0; }
.Accepted { background: #20ad8c; }
.Completed { background: #fd5e00; }
.Verified { background: #1ad539; }
.Cancel { background: #ff0000; }
</style>

<style>
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}
</style>