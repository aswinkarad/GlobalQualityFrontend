<template>
    <v-container class="px-10 hmmsdashboard" fluid style="height:100vh;">
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
            EQUIPMENTS REPORT
        </div>

        <Transition name="slide-fade">
            <div class="mt-4 mb-2">
                <v-row>
                    <v-col cols="12" md="2">
                        <v-autocomplete 
                            v-model="clientName" 
                            hide-details 
                            variant="outlined"
                            density="comfortable" 
                            :items="clien" 
                            item-title="name" 
                            item-value="id" 
                            clearable 
                            label="Clients"
                            @update:modelValue="filterEquipment"
                        ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-autocomplete 
                            v-model="warrantyStatus" 
                            hide-details 
                            variant="outlined"
                            density="comfortable" 
                            :items="warrantyStatuses" 
                            item-title="name" 
                            item-value="value" 
                            clearable 
                            label="Warranty Status"
                            @update:modelValue="filterEquipment"
                        ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-text-field 
                            v-model="startDate" 
                            label="Installation Date" 
                            type="date" 
                            variant="outlined"
                            density="comfortable" 
                            clearable
                            @update:modelValue="filterEquipment"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-text-field 
                            v-model="endDate" 
                            label="Warranty Date" 
                            type="date" 
                            variant="outlined"
                            density="comfortable" 
                            clearable
                            @update:modelValue="filterEquipment"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2" style="align-self: center;">
                        <div class="d-flex justify-end">
                            <v-btn 
                                style="background: rgb(4, 43, 76);" 
                                @click="filterEquipment"
                                :disabled="isLoading"
                            >
                                <span style="color: white">Filter</span>
                            </v-btn>
                            <v-menu open-on-hover>
                                <template v-slot:activator="{ props }">
                                    <v-btn 
                                        v-bind="props" 
                                        style="background: rgb(4, 43, 76);"
                                        class="ml-2"
                                        :disabled="isLoading"
                                    >
                                        <span style="color: white">Export</span>
                                    </v-btn>
                                </template>
                                <v-list style="cursor: pointer">
                                    <v-list-item>
                                        <JsonCSV :data="json_data" name="equipmentReport.csv">
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
                    <th class="text-left">Client Name</th>
                    <th class="text-left">Serial No</th>
                    <th class="text-left">Model</th>
                    <th class="text-left">Categories</th>
                    <th class="text-left">Installation Date</th>
                    <th class="text-left">Warranty Date</th>
                    <th class="text-left">Created At</th>
                    <th class="text-left">Warranty Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, i) in saleEquipmentList" :key="item.id" class="table-row-hover">
                    <td>{{ i + 1 }}</td>
                    <td>{{ item.equipment?.equipmentName || 'N/A' }}</td>
                    <td>{{ item.client?.name || 'N/A' }}</td>
                    <td>{{ item.serialNo || 'N/A' }}</td>
                    <td>{{ item.equipment?.model || 'N/A' }}</td>
                    <td>{{ item.equipment?.subcategory?.category?.categoryName || 'N/A' }}</td>
                    <td>{{ item.installationDate ? item.installationDate.split('T')[0] : 'N/A' }}</td>
                    <td>{{ item.warrantyDate ? item.warrantyDate.split('T')[0] : 'N/A' }}</td>
                    <td>{{ formatDate(item.createdAt) }}</td>
                    <td>{{ item.warrantyStatus || getWarrantyStatus(item.warrantyDate) }}</td>
                </tr>
            </tbody>
        </v-table>

        <div v-if="saleEquipmentList.length >= 1">
            <paginationVue :length="saleTotalPage" @chanegePage="chanegePage" />
        </div>
        <snackbarVue :visible="snackbar" @close="snackbar=false" :text="snacKtext" :color="snackColor"/>
    </v-container>
</template>

<script>
import paginationVue from '@/components/pagination.vue';
import snackbarVue from '@/components/snackbar.vue';
import { mapActions, mapState, mapMutations } from 'vuex';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import JsonCSV from 'vue-json-csv';

export default {
    name: 'equipmentReport',
    components: {
        paginationVue,
        snackbarVue,
        JsonCSV
    },
    data() {
        return {
            breadcrumbs: [
                { text: 'Home', disabled: false, href: '/' },
                { text: 'Equipment Report', disabled: true, href: '/equipment-report' },
            ],
            clientName: '',
            deviceType: '',
            warrantyStatus: '',
            startDate: '',
            endDate: '',
            json_data: [],
            isLoading: false,
            deviceTypes: [
                { id: 1, name: 'Type A' },
                { id: 2, name: 'Type B' },
            ],
            warrantyStatuses: [
                { name: 'Warranty Under', value: 'under' },
                { name: 'Warranty Out', value: 'out' },
                { name: 'All', value: '' }
            ],
            clien: [],
            snackbar: false,
            snacKtext: '',
            snackColor: ''
        }
    },
    computed: {
        ...mapState('salesEquipment', ['saleEquipmentList', 'saleTotalPage', 'saleEquipmentReport']),
        ...mapState('clients', ['clientList']),
    },
    methods: {
        ...mapMutations('salesEquipment', ['REMOVE_SALE_EQUIPMENTS']),
        ...mapActions('clients', ['GET_CLIENT_LIST']),
        ...mapActions('equipments', ['GET_ALL_EQUIPMENT']),
        ...mapActions('salesEquipment', ['GET_ALL_SALE_EQUIPMENT', 'GET_ALL_SALE_EQUIPMENT_FOR_REPORT']),

        formatDate(date) {
            if (!date) return 'N/A';                                                                                          
            return new Date(date).toISOString().split('T')[0];
        },

        getWarrantyStatus(warrantyDate) {
            if (!warrantyDate) return 'N/A';
            const today = new Date();
            const warranty = new Date(warrantyDate);
            return warranty > today ? 'Warranty Under' : 'Warranty Out';
        },

        toCSV() {
            this.json_data = this.saleEquipmentList.map(el => ({
                'EQUIPMENT NAME': el.equipment?.equipmentName || 'N/A',
                'CLIENT NAME': el.client?.name || 'N/A',
                'SERIAL NO': el.serialNo || 'N/A',
                'MODEL': el.equipment?.model || 'N/A',
                'CATEGORY': el.equipment?.subcategory?.category?.categoryName || 'N/A',
                'INSTALLATION DATE': el.installationDate ? el.installationDate.split('T')[0] : 'N/A',
                'WARRANTY DATE': el.warrantyDate ? el.warrantyDate.split('T')[0] : 'N/A',
                'CREATED AT': this.formatDate(el.createdAt),
                'WARRANTY STATUS': el.warrantyStatus || this.getWarrantyStatus(el.warrantyDate)
            }));
        },

        async toPdf() {
            try {
                this.isLoading = true;
                const payload = {
                    cid: this.clientName || '',
                    deviceType: this.deviceType || '',
                    warrantyStatus: this.warrantyStatus || '',
                    startDate: this.startDate || '',
                    endDate: this.endDate || '',
                    size: 99999
                };
                console.log('PDF payload:', payload);

                await this.GET_ALL_SALE_EQUIPMENT_FOR_REPORT(payload);
                console.log('saleEquipmentReport:', this.saleEquipmentReport);

                if (!this.saleEquipmentReport || !Array.isArray(this.saleEquipmentReport) || this.saleEquipmentReport.length === 0) {
                    console.error('No data available in saleEquipmentReport');
                    this.snackColor = 'error';
                    this.snacKtext = 'No data available to generate PDF';
                    this.snackbar = true;
                    return;
                }

                const doc = new jsPDF('p', 'mm', 'a4');
                const columns = [
                    { header: "Equipment Name", dataKey: "equiName" },
                    { header: "Serial No", dataKey: "serialNo" },
                    { header: "Model", dataKey: "model" },
                    { header: "Installation Date", dataKey: "instaDate" },
                    { header: "Warranty Date", dataKey: "warDate" },
                    { header: "Created At", dataKey: "createdAt" }
                ];

                const body = this.saleEquipmentReport.map(el => ({
                    equiName: el.equipment?.equipmentName || 'N/A',
                    clientName: el.client?.name || 'N/A',
                    serialNo: el.serialNo || 'N/A',
                    model: el.equipment?.model || 'N/A',
                    category: el.equipment?.subcategory?.category?.categoryName || 'N/A',
                    instaDate: el.installationDate ? el.installationDate.split('T')[0] : 'N/A',
                    warDate: el.warrantyDate ? el.warrantyDate.split('T')[0] : 'N/A',
                    createdAt: this.formatDate(el.createdAt),
                    warStatus: el.warrantyStatus || this.getWarrantyStatus(el.warrantyDate)
                }));

                if (!this.clientName) {
                    columns.splice(1, 0, { header: "Client Name", dataKey: "clientName" });
                }
                if (!this.deviceType) {
                    columns.splice(this.clientName ? 3 : 2, 0, { header: "Category", dataKey: "category" });
                }
                if (!this.warrantyStatus) {
                    columns.push({ header: "Warranty Status", dataKey: "warStatus" });
                }

                doc.setFontSize(20);
                doc.text("EQUIPMENTS REPORT", 105, 20, { align: 'center' });
                doc.setLineWidth(0.5);
                doc.line(15, 25, 195, 25);

                doc.setFontSize(10);
                let yPos = 35;
                doc.text(`Client: ${this.clientName ? this.clien.find(c => c.id === this.clientName)?.name || 'All' : 'All'}`, 15, yPos);
                yPos += 7;
                doc.text(`Device Type: ${this.deviceType ? this.deviceTypes.find(d => d.id === this.deviceType)?.name || 'All' : 'All'}`, 15, yPos);
                yPos += 7;
                doc.text(`Warranty Status: ${this.warrantyStatus ? this.warrantyStatuses.find(w => w.value === this.warrantyStatus)?.name || 'All' : 'All'}`, 15, yPos);
                yPos += 7;
                doc.text(`Date Range: ${this.startDate && this.endDate ? `${this.startDate} ~ ${this.endDate}` : 'All'}`, 15, yPos);

                autoTable(doc, {
                    startY: yPos + 10,
                    head: [columns.map(col => col.header)],
                    body: body.map(row => columns.map(col => row[col.dataKey])),
                    styles: { fontSize: 10, cellPadding: 3 },
                    headStyles: { fillColor: [4, 43, 76], textColor: [255, 255, 255] },
                    margin: { left: 15, right: 15 }
                });

                doc.save('EquipmentReport.pdf');
            } catch (error) {
                console.error('PDF generation failed:', error);
                this.snackColor = 'error';
                this.snacKtext = 'Failed to generate PDF';
                this.snackbar = true;
            } finally {
                this.isLoading = false;
            }
        },

        async filterEquipment() {
            try {
                this.isLoading = true;
                const payload = {
                    cid: this.clientName || '',
                    deviceType: this.deviceType || '',
                    warrantyStatus: this.warrantyStatus || '',
                    startDate: this.startDate || '',
                    endDate: this.endDate || '',
                    size: 15,
                    page: 1
                };
                console.log('Filter payload:', payload);
                await this.GET_ALL_SALE_EQUIPMENT(payload);
                console.log('saleEquipmentList:', this.saleEquipmentList);
            } catch (error) {
                console.error('Error filtering equipment:', error);
                this.snackColor = 'error';
                this.snacKtext = 'Failed to fetch equipment data';
                this.snackbar = true;
            } finally {
                this.isLoading = false;
            }
        },

        async chanegePage(page) {
            try {
                this.isLoading = true;
                const query = {
                    page: page,
                    size: 15,
                    cid: this.clientName || '',
                    deviceType: this.deviceType || '',
                    warrantyStatus: this.warrantyStatus || '',
                    startDate: this.startDate || '',
                    endDate: this.endDate || ''
                };
                console.log('Change page payload:', query);
                await this.GET_ALL_SALE_EQUIPMENT(query);
                console.log('saleEquipmentList:', this.saleEquipmentList);
            } catch (error) {
                console.error('Error changing page:', error);
                this.snackColor = 'error';
                this.snacKtext = 'Failed to fetch equipment data';
                this.snackbar = true;
            } finally {
                this.isLoading = false;
            }
        }
    },
    async mounted() {
        try {
            this.REMOVE_SALE_EQUIPMENTS();
            const query = { size: 1000 };
            await Promise.all([
                this.GET_CLIENT_LIST(query).then(() => {
                    this.clien = this.clientList || [];
                    console.log('clientList:', this.clientList);
                }),
                this.GET_ALL_EQUIPMENT().then(() => console.log('equipmentList:', this.$store.state.equipments.equipmentList)),
                this.GET_ALL_SALE_EQUIPMENT({ size: 15 }).then(() => console.log('saleEquipmentList:', this.saleEquipmentList))
            ]);
        } catch (error) {
            console.error('Error during initialization:', error);
            this.snackColor = 'error';
            this.snacKtext = 'Failed to initialize data';
            this.snackbar = true;
        }
    }
}
</script>

<!-- Existing <style> sections remain unchanged -->

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