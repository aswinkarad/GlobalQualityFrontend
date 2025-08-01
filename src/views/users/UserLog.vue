<template>
    <v-container class="px-10 hmmsdashboard" fluid style="height:100vh;">
        <v-breadcrumbs :items="breadcrumbs" class="breadcrumbs-container">
            <template v-slot:divider>
                <v-icon color="white">mdi-chevron-right</v-icon>
            </template>
            <template v-slot:item="{ item }">
                <v-breadcrumbs-item :href="item.href" :disabled="item.disabled" class="custom-breadcrumb-item">
                    {{ item.text.toUpperCase() }}
                </v-breadcrumbs-item>
            </template>
        </v-breadcrumbs>

        <div class="text-h6 mb-4 mt-6 dashboard-title">
            USER ACTIVITY
        </div>

        <Transition name="slide-fade">
            <div class="mt-4 mb-2 filter-container">
                <v-row>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="search"
                            label="Search by name or mobile"
                            clearable
                            @input="debounceFilter"
                            @click:clear="clearSearch"
                            prepend-inner-icon="mdi-magnify"
                            dense
                            outlined
                        />
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-select
                            v-model="selectedAction"
                            :items="actionOptions"
                            label="Filter by Action"
                            clearable
                            dense
                            outlined
                            @update:modelValue="filterClient"
                            @click:clear="clearActionFilter"
                        ></v-select>
                    </v-col>
                    

                    <v-col cols="12" md="2" class="button-group">
                        <v-btn 
                            @click="clearAllFilters"
                            class="clear-btn mr-2"
                            color="warning"
                            :disabled="!hasActiveFilters"
                        >
                            Clear All
                        </v-btn>
                        <v-menu open-on-hover>
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" class="export-btn"
                                    style="background: linear-gradient(45deg, #4d90fe, #285bc7); color: white;">
                                    Export
                                </v-btn>
                            </template>
                            <v-list class="export-menu" style="cursor: pointer">
                                <v-list-item @click="toCSV">
                                    <v-list-item-title>CSV</v-list-item-title>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-title @click="toPdf()">PDF</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-col>
                </v-row>
                
                <!-- Filter Status Display -->
                <v-row v-if="hasActiveFilters" class="mt-2">
                    <v-col>
                        <div class="filter-status">
                            <v-chip 
                                v-if="search" 
                                closable 
                                @click:close="clearSearch"
                                color="primary"
                                small
                                class="mr-2"
                            >
                                Search: {{ search }}
                            </v-chip>
                            <v-chip 
                                v-if="selectedAction" 
                                closable 
                                @click:close="clearActionFilter"
                                color="success"
                                small
                                class="mr-2"
                            >
                                Action: {{ selectedAction }}
                            </v-chip>
                            <v-chip 
                                v-if="selectedDate" 
                                closable 
                                @click:close="clearDateFilter"
                                color="info"
                                small
                                class="mr-2"
                            >
                                Date: {{ formattedSelectedDate }}
                            </v-chip>
                        </div>
                    </v-col>
                </v-row>
            </div>
        </Transition>

        <!-- Loading State -->
        <v-progress-linear
            v-if="loading"
            indeterminate
            color="primary"
            class="mb-4"
        ></v-progress-linear>

        <!-- No Data State -->
        <v-card v-if="!loading && displayUserLogs.length === 0" class="text-center pa-8">
            <v-icon size="64" color="grey lighten-1">mdi-database-search</v-icon>
            <div class="text-h6 mt-4 grey--text">
                {{ hasActiveFilters ? 'No data found' : 'No user activity records available' }}
            </div>
            <div class="text-body-2 grey--text">
                {{ hasActiveFilters ? 'Try adjusting your filters' : 'No user activity records available' }}
            </div>
        </v-card>

        <!-- Data Table -->
        <v-table v-else class="rounded-lg mt-6 modern-table">
            <thead>
                <tr>
                    <th class="text-left">#</th>
                    <th class="text-left sortable" @click="sortBy('username')">
                        NAME
                        <v-icon v-if="sortField === 'username'" small>
                            {{ sortOrder === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                        </v-icon>
                    </th>
                    <th class="text-left sortable" @click="sortBy('mobile')">
                        MOBILE
                        <v-icon v-if="sortField === 'mobile'" small>
                            {{ sortOrder === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                        </v-icon>
                    </th>
                    <th class="text-left sortable" @click="sortBy('action')">
                        ACTION
                        <v-icon v-if="sortField === 'action'" small>
                            {{ sortOrder === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                        </v-icon>
                    </th>
                    <th class="text-left sortable" @click="sortBy('timestamp')">
                        TIME
                        <v-icon v-if="sortField === 'timestamp'" small>
                            {{ sortOrder === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                        </v-icon>
                    </th>
                    <th class="text-left sortable" @click="sortBy('createdAt')">
                        CREATED DATE
                        <v-icon v-if="sortField === 'createdAt'" small>
                            {{ sortOrder === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                        </v-icon>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, i) in paginatedUserLogs" :key="`${item.id || i}-${item.timestamp}`" class="table-row-hover">
                    <td>{{ (page - 1) * size + i + 1 }}</td>
                    <td>{{ item.user?.username || 'N/A' }}</td>
                    <td>{{ item.user?.mobile || 'N/A' }}</td>
                    <td>
                        <v-chip :color="getActionColor(item.action)" small dark>
                            {{ item.action || 'N/A' }}
                        </v-chip>
                    </td>
                    <td>{{ formatDate(item.timestamp) }}</td>
                    <td>{{ formatDate(item.createdAt) }}</td>
                </tr>
            </tbody>
        </v-table>

        <!-- Pagination with Info -->
        <div class="d-flex justify-space-between align-center mt-4">
            <div class="text-body-2 grey--text">
                Showing {{ ((page - 1) * size + 1) }} to {{ Math.min(page * size, displayUserLogs.length) }} of {{ displayUserLogs.length }} entries
                {{ hasActiveFilters ? '(filtered)' : '(total)' }}
            </div>
            <v-pagination 
                v-model="page" 
                :length="calculatedTotalPages" 
                :total-visible="7" 
                color="primary"
                @update:modelValue="changePage" 
            />
        </div>

    </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

export default {
    name: 'UserLogs',
    data() {
        return {
            breadcrumbs: [
                { text: 'Home', disabled: false, href: '/' },
                { text: 'USER ACTIVITY', disabled: true, href: '/UserLog' },
            ],
            username: '',
            mobile: '',
            search: '',
            selectedAction: null,
            actionOptions: [
                'Login',
                'Logout',
                'Create User',
                'Update User',
                'Delete User',
                'View Report',
                'Download Data',
                'Users_list',
                'message_list',
                'chat_list',
                'priority_list',
                'city_list',
                'call_handle_list',
                'WorkingCondition_list',
            ],
            selectedDate: null,
            menu: false,
            page: 1,
            size: 15,
            totalPages: 1,
            totalRecords: 0,
            loading: false,
            debounceTimer: null,
            sortField: '',
            sortOrder: 'asc',
            allUserLogs: [], // Store all original data
            filteredUserLogs: [], // Store filtered data
        }
    },
    computed: {
        ...mapState('user', ['UserLogs']),
        
        formattedSelectedDate() {
            if (this.selectedDate instanceof Date) {
                return this.selectedDate.toISOString().split('T')[0];
            } else if (typeof this.selectedDate === 'string' && this.selectedDate.length > 0) {
                return this.selectedDate;
            }
            return '';
        },
        
        hasActiveFilters() {
            return !!(this.search || this.selectedAction || this.selectedDate);
        },

        // Get the data to display based on filters
        displayUserLogs() {
            if (!this.hasActiveFilters) {
                // No filters applied, show original data
                return this.allUserLogs;
            }
            // Filters applied, show filtered data
            return this.filteredUserLogs;
        },

        // Calculate pagination for displayed data
        paginatedUserLogs() {
            const start = (this.page - 1) * this.size;
            const end = start + this.size;
            return this.displayUserLogs.slice(start, end);
        },

        // Calculate total pages based on displayed data
        calculatedTotalPages() {
            return Math.ceil(this.displayUserLogs.length / this.size) || 1;
        }
    },
    methods: {
        ...mapActions('user', ['GET_USERLOG_LIST']),

        // Debounced search to avoid too many filter operations
        debounceFilter() {
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer);
            }
            this.debounceTimer = setTimeout(() => {
                this.applyClientSideFilters();
            }, 300); // Wait 300ms after user stops typing
        },

        // Apply filters on client side
        applyClientSideFilters() {
            this.page = 1; // Reset to first page when filtering
            
            if (!this.hasActiveFilters) {
                // No filters, use original data
                this.filteredUserLogs = [...this.allUserLogs];
                return;
            }

            // Apply filters to original data
            this.filteredUserLogs = this.allUserLogs.filter(item => {
                let matches = true;

                // Search filter (name or mobile)
                if (this.search && this.search.trim()) {
                    const searchTerm = this.search.toLowerCase().trim();
                    const username = (item.user?.username || '').toLowerCase();
                    const mobile = (item.user?.mobile || '').toLowerCase();
                    matches = matches && (username.includes(searchTerm) || mobile.includes(searchTerm));
                }

                // Action filter
                if (this.selectedAction) {
                    matches = matches && (item.action === this.selectedAction);
                }

                // Date filter
                if (this.selectedDate) {
                    const filterDate = new Date(this.selectedDate).toISOString().split('T')[0];
                    const itemDate = item.createdAt ? item.createdAt.split('T')[0] : '';
                    matches = matches && (itemDate === filterDate);
                }

                return matches;
            });

            // Apply sorting if specified
            if (this.sortField) {
                this.applySorting();
            }
        },

        filterClient() {
            this.applyClientSideFilters();
        },

        changePage(pageNumber) {
            this.page = pageNumber;
            // No need to fetch data, just change page
        },

        handleDateChange() {
            this.menu = false;
            this.applyClientSideFilters();
        },

        clearSearch() {
            this.search = '';
            this.applyClientSideFilters();
        },

        clearActionFilter() {
            this.selectedAction = null;
            this.applyClientSideFilters();
        },

        clearDateFilter() {
            this.selectedDate = null;
            this.applyClientSideFilters();
        },

        clearAllFilters() {
            this.search = '';
            this.selectedAction = null;
            this.selectedDate = null;
            this.sortField = '';
            this.sortOrder = 'asc';
            this.page = 1;
            this.applyClientSideFilters();
        },

        sortBy(field) {
            if (this.sortField === field) {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortField = field;
                this.sortOrder = 'asc';
            }
            this.applySorting();
        },

        applySorting() {
            if (!this.sortField) return;

            const dataToSort = this.hasActiveFilters ? this.filteredUserLogs : this.allUserLogs;
            
            dataToSort.sort((a, b) => {
                let aValue, bValue;

                switch (this.sortField) {
                    case 'username':
                        aValue = (a.user?.username || '').toLowerCase();
                        bValue = (b.user?.username || '').toLowerCase();
                        break;
                    case 'mobile':
                        aValue = a.user?.mobile || '';
                        bValue = b.user?.mobile || '';
                        break;
                    case 'action':
                        aValue = (a.action || '').toLowerCase();
                        bValue = (b.action || '').toLowerCase();
                        break;
                    case 'timestamp':
                        aValue = new Date(a.timestamp || 0);
                        bValue = new Date(b.timestamp || 0);
                        break;
                    case 'createdAt':
                        aValue = new Date(a.createdAt || 0);
                        bValue = new Date(b.createdAt || 0);
                        break;
                    default:
                        return 0;
                }

                if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
                if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        },

        getActionColor(action) {
            const colorMap = {
                'Login': 'success',
                'Logout': 'warning',
                'Create User': 'info',
                'Update User': 'primary',
                'Delete User': 'error',
                'View Report': 'secondary',
                'Download Data': 'purple',
            };
            return colorMap[action] || 'grey';
        },

        formatDate(dateString) {
            if (!dateString) return 'N/A';
            try {
                return new Date(dateString).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit'
                });
            } catch (error) {
                return dateString.split('T')[0] || 'N/A';
            }
        },

        async fetchUserLogs() {
            this.loading = true;
            
            try {
                // Fetch all data without any filters from API
                const payload = {
                    page: 1,
                    size: 1000, // Get all data at once
                };

                const response = await this.GET_USERLOG_LIST(payload);
                
                if (response) {
                    // Store the original data
                    this.allUserLogs = this.UserLogs ? [...this.UserLogs] : [];
                    // Initially show all data
                    this.filteredUserLogs = [...this.allUserLogs];
                    // Apply any existing filters
                    this.applyClientSideFilters();
                } else {
                    console.warn('API response did not contain data.');
                    this.allUserLogs = [];
                    this.filteredUserLogs = [];
                }
            } catch (error) {
                console.error('Error fetching user logs:', error);
                this.$toast?.error('Failed to fetch user logs. Please try again.');
                this.allUserLogs = [];
                this.filteredUserLogs = [];
            } finally {
                this.loading = false;
            }
        },

        toCSV() {
            const dataToExport = this.hasActiveFilters ? this.filteredUserLogs : this.allUserLogs;
            
            if (!dataToExport || dataToExport.length === 0) {
                alert('No data available to export');
                return;
            }

            const data = dataToExport.map((el, index) => ({
                '#': index + 1,
                'NAME': el.user?.username || 'N/A',
                'MOBILE': el.user?.mobile || 'N/A',
                'ACTION': el.action || 'N/A',
                'TIME': this.formatDate(el.timestamp),
                'CREATED DATE': this.formatDate(el.createdAt),
            }));

            const headers = Object.keys(data[0]);
            const csvContent = [
                headers.join(','),
                ...data.map(row => headers.map(h => {
                    return `"${String(row[h]).replace(/"/g, '""')}"`;
                }).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            const filename = this.hasActiveFilters ? 'UserActivity_Filtered' : 'UserActivity_All';
            link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        },

        toPdf() {
            try {
                const dataToExport = this.hasActiveFilters ? this.filteredUserLogs : this.allUserLogs;

                if (!dataToExport || !Array.isArray(dataToExport) || dataToExport.length === 0) {
                    alert('No data available to generate PDF.');
                    return;
                }

                const doc = new jsPDF();

                // Header
                doc.setFontSize(18);
                const title = this.hasActiveFilters ? 'User Activity Report (Filtered)' : 'User Activity Report (All)';
                doc.text(title, 20, 20);
                
                // Filters info
                let yPosition = 35;
                if (this.hasActiveFilters) {
                    doc.setFontSize(10);
                    doc.text('Applied Filters:', 20, yPosition);
                    yPosition += 10;
                    
                    if (this.search) {
                        doc.text(`Search: ${this.search}`, 25, yPosition);
                        yPosition += 8;
                    }
                    if (this.selectedAction) {
                        doc.text(`Action: ${this.selectedAction}`, 25, yPosition);
                        yPosition += 8;
                    }
                    if (this.selectedDate) {
                        doc.text(`Date: ${this.formattedSelectedDate}`, 25, yPosition);
                        yPosition += 8;
                    }
                    yPosition += 5;
                }

                const tableData = dataToExport.map((item, index) => [
                    index + 1,
                    item.user?.username || 'N/A',
                    item.user?.mobile || 'N/A',
                    item.action || 'N/A',
                    this.formatDate(item.timestamp),
                    this.formatDate(item.createdAt)
                ]);

                autoTable(doc, {
                    head: [['#', 'Name', 'Mobile', 'Action', 'Time', 'Created Date']],
                    body: tableData,
                    startY: yPosition,
                    styles: { fontSize: 8 },
                    headStyles: { fillColor: [77, 144, 254] },
                    alternateRowStyles: { fillColor: [245, 245, 245] }
                });

                const filename = this.hasActiveFilters ? 'UserActivityReport_Filtered' : 'UserActivityReport_All';
                doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);

            } catch (error) {
                console.error('PDF Error:', error);
                alert('PDF generation failed: ' + error.message);
            }
        }
    },

    mounted() {
        this.fetchUserLogs();
    },

    beforeUnmount() {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
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

/* Filter Status */
.filter-status {
    padding: 10px 0;
}

/* Buttons */
.button-group {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    height: 100%;
}

.clear-btn,
.filter-btn,
.export-btn {
    border-radius: 6px;
    transition: all 0.3s ease;
    text-transform: none;
    font-weight: 600;
}

.clear-btn:hover,
.filter-btn:hover,
.export-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(77, 144, 254, 0.3);
}

/* Export Menu */
.export-menu {
    background: #ffffff;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.export-menu .v-list-item-title {
    color: #4d90fe;
}

.export-menu .v-list-item:hover {
    background: #e0f2f7;
}

/* Table Styling */
.modern-table {
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    overflow: hidden;
}

.modern-table th {
    background: #042B4C;
    color: white !important;
    padding: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.modern-table th.sortable {
    cursor: pointer;
    user-select: none;
    transition: background-color 0.3s ease;
}

.modern-table th.sortable:hover {
    background: #064a7a;
}

.table-row-hover:hover {
    background: #f5f7fa;
    transition: background 0.3s ease;
}

.v-table tbody tr td {
    padding: 12px;
    border-bottom: 1px solid #eee;
}

.v-table {
    font-family: 'Montserrat', sans-serif;
}

/* CSS Keyframe Animations */
@keyframes slideInDown {
    0% {
        opacity: 0;
        transform: translateY(-100%);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInLeft {
    0% {
        opacity: 0;
        transform: translateX(-100px);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeInUp {
    0% {
        opacity: 0;
        transform: translateY(50px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
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

    .modern-table th,
    .modern-table td {
        padding: 10px 6px;
        font-size: 0.8rem;
    }
}

@media (max-width: 600px) {
    .hmmsdashboard {
        padding: 8px;
    }

    .dashboard-title {
        font-size: 1.2rem;
    }

    .button-group {
        flex-direction: column;
        gap: 4px;
    }

    .clear-btn,
    .export-btn {
        width: 100%;
        font-size: 0.8rem;
        padding: 6px 12px;
    }

    .modern-table th,
    .modern-table td {
        padding: 8px 4px;
        font-size: 0.7rem;
    }
}
</style>

<style>
/* Global styles for transitions */
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