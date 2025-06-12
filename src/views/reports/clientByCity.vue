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
                    {{ item.text.toUpperCase() }}
                </v-breadcrumbs-item>
            </template>
        </v-breadcrumbs>

        <div class="text-h6 mb-4 mt-6 dashboard-title">
            CLIENT REPORT
        </div>

        <Transition name="slide-fade">
            <div class="mt-4 mb-2 filter-container">
                <v-row>
                    <v-col cols="12" md="2">
                        <v-autocomplete 
                            v-if="cityList.length > 0" 
                            v-model="city" 
                            hide-details 
                            variant="outlined"
                            density="comfortable" 
                            :items="cityList" 
                            item-title="city" 
                            clearable 
                            item-value="id"
                            label="City"
                            @update:modelValue="filterClient"
                            class="filter-input"
                        ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-autocomplete 
                            v-if="careofList.length > 0" 
                            v-model="care" 
                            hide-details 
                            variant="outlined"
                            density="comfortable" 
                            :items="careofList" 
                            item-title="careof" 
                            clearable 
                            item-value="id"
                            label="Care of"
                            @update:modelValue="filterClient"
                            class="filter-input"
                        ></v-autocomplete>
                    </v-col>
                    <!-- <v-col cols="12" md="2">
                        <v-autocomplete 
                            v-model="type" 
                            hide-details 
                            variant="outlined" 
                            density="comfortable"
                            :items="typeList" 
                            item-title="title" 
                            item-value="id" 
                            clearable 
                            label="Type"
                            @update:modelValue="filterClient"
                            class="filter-input"
                        ></v-autocomplete>
                    </v-col> -->
                    <!-- <v-col cols="12" md="2">
                        <v-text-field 
                            v-model="startDate" 
                            label="Start Date" 
                            type="date" 
                            variant="outlined"
                            density="comfortable" 
                            clearable
                            class="filter-input"
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
                            class="filter-input"
                        ></v-text-field>
                    </v-col> -->
                    <v-col cols="12" md="2" class="button-group">
                        <v-btn 
                            class="filter-btn" 
                            style="background: linear-gradient(45deg, #4d90fe, #285bc7); color: white;" 
                            @click="filterClient()"
                        >
                            Filter
                        </v-btn>
                        <v-menu open-on-hover>
                            <template v-slot:activator="{ props }">
                                <v-btn 
                                    v-bind="props" 
                                    class="export-btn ml-2"
                                    style="background: linear-gradient(45deg, #4d90fe, #285bc7); color: white;"
                                >
                                    Export
                                </v-btn>
                            </template>
                            <v-list class="export-menu" style="cursor: pointer">
                                <v-list-item>
                                    <JsonCSV :data="json_data" name="clientReport.csv">
                                        <v-list-item-title>CSV</v-list-item-title>
                                    </JsonCSV>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-title @click="toPdf()">PDF</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-col>
                </v-row>
            </div>
        </Transition>

        <v-table class="rounded-lg mt-6 modern-table">
            <thead>
                <tr>
                    <th class="text-left">#</th>
                    <th class="text-left">NAME</th>
                    <th class="text-left">EMAIL</th>
                    <th class="text-left">PHONE</th>
                    <th class="text-left">CITY</th>
                    <th class="text-left">CARE OF</th>
                    <!-- <th class="text-left">TYPE</th> -->
                    <th class="text-left">CREATED DATE</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, i) in clientList" :key="item.name" class="table-row-hover">
                    <td>{{ i + 1 }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.contact1 }}</td>
                    <td>{{ item.city.city }}</td>
                    <td>{{ item.careof.careof }}</td>
                    <!-- <td>{{ item.clienttype.client_type }}</td> -->
                    <td>{{ item.createdAt ? item.createdAt.split('T')[0] : 'N/A' }}</td>
                </tr>
            </tbody>
        </v-table>

        <paginationVue :length="clientTotalPage" @changePage="changePage" class="pagination" />
    </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import paginationVue from '@/components/pagination.vue';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

export default {
    name: 'clientReport',
    components: {
        paginationVue,
    },
    data() {
        return {
            breadcrumbs: [
                { text: 'Home', disabled: false, href: '/' },
                { text: 'Client Report', disabled: true, href: '/client-report' },
            ],
            city: '',
            care: '',
            type: '',
            startDate: '',
            endDate: '',
            json_data: [],
            typeList: [
                { id: 1, title: 'GOV' },
                { id: 2, title: 'NON-GOV' },
            ],
        }
    },
    computed: {
        ...mapState('clients', ['clientList', 'clientTotalPage', 'clientListReport']),
        ...mapState('city', ['cityList']),
        ...mapState('careof', ['careofList']),
    },
    methods: {
        ...mapActions('city', ['GET_CITY_LIST']),
        ...mapActions('careof', ['GET_CAREOF_LIST']),
        ...mapActions('clients', ['GET_CLIENT_LIST', 'GET_CLIENT_LIST_REPORT']),
        
        toCSV() {
            this.json_data = this.clientList.map(el => ({
                'NAME': el.name,
                'EMAIL': el.email,
                'PHONE': el.contact1,
                'CITY': el.city.city,
                'CARE OF': el.careof.careof,
                'TYPE': el.clienttype.client_type,
                'CREATED DATE': el.createdAt ? el.createdAt.split('T')[0] : 'N/A',
            }));
            
            const headers = ['NAME', 'EMAIL', 'PHONE', 'CITY', 'CARE OF', 'TYPE', 'CREATED DATE'];
            const csv = [
                headers.join(','),
                ...this.json_data.map(row => headers.map(header => `"${row[header]}"`).join(','))
            ].join('\n');
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'clientReport.csv';
            link.click();
        },
        
  async toPdf() {
    try {
        const payload = {
            cty: this.city || '',
            typ: this.type || '',
            creof: this.care || '',
            startDate: this.startDate || '',
            endDate: this.endDate || '',
            size: 9999999
        };

        // Fetch data and log response
        await this.GET_CLIENT_LIST_REPORT(payload);
        console.log('clientListReport:', this.clientListReport);

        // Validate clientListReport
        if (!this.clientListReport || !Array.isArray(this.clientListReport) || this.clientListReport.length === 0) {
            console.error('No data available in clientListReport');
            alert('No data available to generate PDF.');
            return;
        }

        // Initialize jsPDF with explicit configuration
        const doc = new jsPDF('p', 'mm', 'a4');
        const columns = [
            { header: "Client Name", dataKey: "cName" },
            { header: "Email", dataKey: "email" },
            { header: "Phone", dataKey: "phone" },
            { header: "Created Date", dataKey: "createdAt" }
        ];

        // Map data with robust error handling
        const body = this.clientListReport.map(el => ({
            cName: el?.name || 'N/A',
            email: el?.email || 'N/A',
            phone: el?.contact1 || 'N/A',
            createdAt: el?.createdAt ? el.createdAt.split('T')[0] : 'N/A',
            city: el?.city?.city || 'N/A',
            careof: el?.careof?.careof || 'N/A',
            type: el?.clienttype?.client_type || 'N/A'
        }));

        // Dynamically add columns with safety checks
        if (!this.city) {
            columns.splice(3, 0, { header: "City", dataKey: "city" });
        }
        if (!this.care) {
            columns.splice(this.city ? 4 : 3, 0, { header: "Care Of", dataKey: "careof" });
        }
        if (!this.type) {
            const index = this.city && this.care ? 5 : (this.city || this.care ? 4 : 3);
            columns.splice(index, 0, { header: "Type", dataKey: "type" });
        }

        // Add title and line
        doc.setFontSize(20);
        doc.text("CLIENT REPORT", 105, 20, { align: 'center' });
        doc.setLineWidth(0.5);
        doc.line(15, 25, 195, 25);

        // Add filter information with safety checks
        doc.setFontSize(10);
        let yPos = 35;
        doc.text(`City: ${this.city ? this.cityList?.find(c => c.id === this.city)?.city || 'All' : 'All'}`, 15, yPos);
        yPos += 7;
        doc.text(`Care of: ${this.care ? this.careofList?.find(c => c.id === this.care)?.careof || 'All' : 'All'}`, 15, yPos);
        yPos += 7;
        doc.text(`Type: ${this.type ? this.typeList?.find(t => t.id === this.type)?.title || 'All' : 'All'}`, 15, yPos);
        yPos += 7;
        doc.text(`Date Range: ${this.startDate && this.endDate ? `${this.startDate} ~ ${this.endDate}` : 'All'}`, 15, yPos);

        // Generate table
        autoTable(doc, {
            startY: yPos + 10,
            head: [columns.map(col => col.header)],
            body: body.map(row => columns.map(col => row[col.dataKey])),
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [77, 144, 254], textColor: [255, 255, 255] },
            margin: { left: 15, right: 15 }
        });

        doc.save('ClientReport.pdf');
    } catch (error) {
        console.error('PDF generation failed:', error);
        alert('Failed to generate PDF. Check console for details.');
    }
},
        filterClient() {
            const payload = {
                cty: this.city || '',
                typ: this.type || '',
                creof: this.care || '',
                startDate: this.startDate || '',
                endDate: this.endDate || '',
                size: 15,
                page: 1
            };
            this.GET_CLIENT_LIST(payload);
        },
        
        changePage(page) {
            const query = {
                page: page,
                size: 15,
                cty: this.city || '',
                typ: this.type || '',
                creof: this.care || '',
                startDate: this.startDate || '',
                endDate: this.endDate || '',
            };
            this.GET_CLIENT_LIST(query);
        }
    },
    mounted() {
        const query = { size: 1000 };
        Promise.all([
            this.GET_CITY_LIST(query),
            this.GET_CAREOF_LIST(),
            this.GET_CLIENT_LIST({ size: 15 })
        ]).catch(error => {
            console.error('Error during initialization:', error);
        });
    }
}
</script>

<style scoped>
/* Base Container Styling */
.hmmsdashboard {
    background: linear-gradient(135deg, #F5F7FA, #E8ECEF);
    min-height: 100vh;
    padding: 20px;
    color: #1F2937;
}

/* Breadcrumb Styling */
.breadcrumbs-container {
    background: linear-gradient(90deg, #4d90fe, #285bc7);
    border-radius: 12px;
    padding: 10px 16px;
    box-shadow: 0 6px 15px rgba(77, 144, 254, 0.2);
    animation: slideInDown 0.8s ease-out;
}

.custom-breadcrumb-item {
    color: #FFFFFF;
    font-weight: 700;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.custom-breadcrumb-item:hover {
    color: #E5E7EB;
    transform: scale(1.05);
}

/* Dashboard Title */
.dashboard-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.8rem;
    font-weight: 800;
    background: linear-gradient(45deg, #4d90fe, #285bc7);
    -webkit-background-clip: text;
    color: transparent;
    animation: slideInLeft 0.8s ease-out;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* Filter Container */
.filter-container {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(77, 144, 254, 0.2);
    animation: fadeIn 0.8s ease-out;
}

/* Filter Inputs */
.filter-input /deep/ .v-input__control {
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.9);
    transition: all 0.3s ease;
}

.filter-input /deep/ .v-input__control:hover {
    background: rgba(245, 247, 250, 0.95);
    box-shadow: 0 2px 8px rgba(77, 144, 254, 0.2);
}

/* Buttons */
.button-group {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    height: 100%;
}

.filter-btn, .export-btn {
    border-radius: 6px;
    transition: all 0.3s ease;
    text-transform: none;
    font-weight: 600;
}

.filter-btn:hover, .export-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(77, 144, 254, 0.3);
}

/* Export Menu */
.export-menu {
    background: #285bc7;
    color:#4d90fe;
    border-radius: 6px;
}

.export-menu .v-list-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

/* Table Styling (Unchanged) */
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

/* Pagination */
.pagination {
    margin-top: 16px;
    animation: fadeInUp 0.8s ease-out;
}

/* CSS Keyframe Animations */
@keyframes slideInDown {
    0% { opacity: 0; transform: translateY(-100%); }
    100% { opacity: 1; transform: translateY(0); }
}

@keyframes slideInLeft {
    0% { opacity: 0; transform: translateX(-100px); }
    100% { opacity: 1; transform: translateX(0); }
}

@keyframes fadeInUp {
    0% { opacity: 0; transform: translateY(50px); }
    100% { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
}

/* Responsive Design */
@media (max-width: 960px) {
    .hmmsdashboard {
        padding: 12px;
    }

    .dashboard-title {
        font-size: 1.5rem;
    }

    .breadcrumbs-container {
        padding: 8px 12px;
    }

    .custom-breadcrumb-item {
        font-size: 0.9rem;
    }

    .filter-container {
        padding: 15px;
    }

    .modern-table {
        margin-top: 12px;
        display: block;
        overflow-x: auto;
        white-space: nowrap;
    }

    .modern-table th, .modern-table td {
        padding: 10px 6px;
        font-size: 0.8rem;
    }

    .pagination {
        margin-top: 12px;
    }
}

@media (max-width: 600px) {
    .hmmsdashboard {
        padding: 8px;
    }

    .dashboard-title {
        font-size: 1.2rem;
    }

    .breadcrumbs-container {
        padding: 6px 10px;
    }

    .custom-breadcrumb-item {
        font-size: 0.8rem;
    }

    .filter-container {
        padding: 10px;
    }

    .filter-btn, .export-btn {
        font-size: 0.8rem;
        padding: 6px 12px;
    }

    .modern-table {
        margin-top: 10px;
    }

    .modern-table th, .modern-table td {
        padding: 8px 4px;
        font-size: 0.7rem;
    }

    .pagination {
        margin-top: 10px;
    }
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