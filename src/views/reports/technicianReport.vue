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
            TECHNICIAN REPORT
        </div>

        <Transition name="slide-fade">
            <div class="mt-4 mb-2">
                <v-row>
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
                    <v-col cols="12" md="2">
                        <v-autocomplete 
                            v-model="techId" 
                            hide-details 
                            variant="outlined"
                            density="comfortable" 
                            :items="tech" 
                            item-title="username" 
                            item-value="id" 
                            clearable 
                            label="Technician"
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
                                        <JsonCSV :data="json_data" :name="`Technician_Report_${new Date().toISOString().split('T')[0]}.csv`">
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
                    <th class="text-left">Technician</th>
                    <th class="text-left">Equipment Name</th>
                    <th class="text-left">Client Name</th>
                    <th class="text-left">Serial Number</th>
                    <th class="text-left">Call Registration Date</th>
                    <th class="text-left">Priority</th>
                    <th class="text-left">Created At</th>
                    <th class="text-left">Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, i) in serviceList" :key="item.id" class="table-row-hover">
                    <td>{{ i + 1 }}</td>
                    <td><span v-if="item.user">{{ item.user.username }}</span><span v-else>N/A</span></td>
                    <td>{{ item.sale?.equipment?.equipmentName || 'N/A' }}</td>
                    <td>{{ item.sale?.client?.name || 'N/A' }} <span v-if="item.sale?.equipment?.arabicname">{{ ' ' + item.sale.equipment.arabicname }}</span></td>
                    <td>{{ item.sale?.serialNo || 'N/A' }}</td>
                    <td>{{ item.callRegisterDate?.split('T')[0] || 'N/A' }}</td>
                    <td>{{ item.priority?.priority || 'N/A' }}</td>
                    <td>{{ formatDate(item.createdAt) }}</td>
                    <td>
                        <v-chip
                            :class="{ Open: item.workingStatusId == 1, Accepted: item.workingStatusId == 2, Completed: item.workingStatusId == 3, Verified: item.workingStatusId == 4, Cancel: item.workingStatusId == 5 }"
                            style="min-width: 100px; cursor: pointer; color: white;"
                        >
                            <span class="ma-auto">{{ item.working_status?.workingStatus || 'N/A' }}</span>
                        </v-chip>
                    </td>
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
import { mapActions, mapState } from 'vuex';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import JsonCSV from 'vue-json-csv';

export default {
    name: 'TechnicianReport',
    components: {
        paginationVue,
        JsonCSV
    },
    data() {
        return {
            breadcrumbs: [
                { text: 'Home', disabled: false, href: '/' },
                { text: 'Technician Report', disabled: true, href: '/technician-report' },
            ],
            clien: [],
            mechine: [],
            tech: [],
            machineId: '',
            clientName: '',
            techId: '',
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
            ]
        }
    },
    computed: {
        ...mapState('service', ['serviceList', 'serviceTotalPages', 'serviceReportList']),
        ...mapState('clients', ['clientList']),
        ...mapState('salesEquipment', ['saleEquipmentList']),
        ...mapState('technician', ['techList'])
    },
    methods: {
        ...mapActions('clients', ['GET_CLIENT_LIST']),
        ...mapActions('technician', ['GET_TECH_LIST']),
        ...mapActions('service', ['GET_SERVICE_LIST', 'GET_SERVICE_REPORT_LIST']),
        ...mapActions('salesEquipment', ['GET_ALL_SALE_EQUIPMENT']),

        formatDate(date) {
            if (!date) return 'N/A';
            return new Date(date).toISOString().split('T')[0];
        },

        test(item) {
            return ` ${item.equipment ? item.equipment.equipmentName : ''} (${item.serialNo}) `;
        },

        getClientMechines() {
            if (this.clientName) {
                const query = {
                    cid: this.clientName,
                    size: 1000
                };
                this.GET_ALL_SALE_EQUIPMENT(query).then(() => {
                    this.mechine = this.saleEquipmentList || [];
                }).catch(error => {
                    console.error('Error fetching machines:', error);
                    this.mechine = [];
                });
            } else {
                this.mechine = [];
            }
        },

        filterService() {
            const query = {
                statid: this.workingStatusId || '',
                startdte: this.startDate || '',
                enddte: this.endDate || '',
                tech: this.techId || '',
                size: 10,
                page: 1
            };
            this.GET_SERVICE_LIST(query).catch(error => {
                console.error('Error filtering services:', error);
            });
        },

        chanegePage(page) {
            const query = {
                statid: this.workingStatusId || '',
                startdte: this.startDate || '',
                enddte: this.endDate || '',
                tech: this.techId || '',
                page: page,
                size: 10
            };
            this.GET_SERVICE_LIST(query).catch(error => {
                console.error('Error changing page:', error);
            });
        },

        toCSV() {
            this.json_data = this.serviceList.map(el => ({
                'TECHNICIAN': el.user?.username || 'N/A',
                'EQUIPMENT NAME': el.sale?.equipment?.equipmentName || 'N/A',
                'CLIENT NAME': el.sale?.client?.name || 'N/A',
                'SERIAL NUMBER': el.sale?.serialNo || 'N/A',
                'CALL REGISTRATION DATE': el.callRegisterDate?.split('T')[0] || 'N/A',
                'PRIORITY': el.priority?.priority || 'N/A',
                'CREATED AT': this.formatDate(el.createdAt),
                'STATUS': el.working_status?.workingStatus || 'N/A',
            }));
        },

        async toPdf() {
            const payload = {
                statid: this.workingStatusId || '',
                startdte: this.startDate || '',
                enddte: this.endDate || '',
                tech: this.techId || '',
                size: 999999
            };
            try {
                await this.GET_SERVICE_REPORT_LIST(payload);
                const doc = new jsPDF('p', 'mm', 'a4');
                const columns = [
                    { header: "Equipment Name", dataKey: "Eqname" },
                    { header: "Client Name", dataKey: "Clname" },
                    { header: "Serial No", dataKey: "serialNo" },
                    { header: "Call Reg Date", dataKey: "regDate" },
                    { header: "Priority", dataKey: "priority" },
                    { header: "Created At", dataKey: "createdAt" },
                ];

                const body = this.serviceReportList.map(el => ({
                    tech: el.user?.username || 'N/A',
                    Eqname: el.sale?.equipment?.equipmentName || 'N/A',
                    Clname: el.sale?.client?.name || 'N/A',
                    serialNo: el.sale?.serialNo || 'N/A',
                    regDate: el.callRegisterDate?.split('T')[0] || 'N/A',
                    priority: el.priority?.priority || 'N/A',
                    createdAt: this.formatDate(el.createdAt),
                    status: el.working_status?.workingStatus || 'N/A'
                }));

                if (!this.techId) {
                    columns.splice(0, 0, { header: "Technician", dataKey: "tech" });
                }
                if (!this.workingStatusId) {
                    columns.push({ header: "Status", dataKey: "status" });
                }

                doc.setFontSize(20);
                doc.text("TECHNICIAN REPORT", 105, 20, { align: 'center' });
                doc.setLineWidth(0.5);
                doc.line(15, 25, 195, 25);

                doc.setFontSize(10);
                let yPos = 35;
                doc.text(`Technician: ${this.techId ? this.tech.find(t => t.id === this.techId)?.username || 'All' : 'All'}`, 15, yPos);
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

                doc.save(`Technician_Report_${new Date().toISOString().split('T')[0]}.pdf`);
            } catch (error) {
                console.error('Error generating PDF:', error);
            }
        }
    },
    mounted() {
        const query = { size: 10 };
        Promise.all([
            this.GET_SERVICE_LIST(query),
            this.GET_TECH_LIST({ size: 1000 }).then(() => {
                this.tech = this.techList || [];
            }),
            this.GET_CLIENT_LIST({ size: 1000 }).then(() => {
                this.clien = this.clientList || [];
            }),
            this.GET_ALL_SALE_EQUIPMENT({ size: 1000 }).then(() => {
                this.mechine = this.saleEquipmentList || [];
            })
        ]).catch(error => {
            console.error('Error during initialization:', error);
        });
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