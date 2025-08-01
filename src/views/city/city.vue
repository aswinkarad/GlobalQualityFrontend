<template>
    <v-container class="px-10" fluid style="height:100vh; background:#e7f0f7 ;">
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
        <br><br>
        <div class="text-h6 mb-2" style="font-family:'Montserrat', sans-serif !important">
            CITY
        </div>
        <searchAndFilterToolbar 
            :btn_text="cl_text" 
            @btn_action="dialog = true"
            @search="handleSearch"
            @filter="handleFilter"
            @clear="clearFilters"
        />
        
        <!-- Grid Layout for City Cards -->
        <v-row class="mt-4">
            <v-col v-for="(item, i) in displayedCities" :key="item.id" cols="12" sm="6" md="3">
                <v-card class="pa-4" elevation="2">
                    <v-card-title class="text-h6">{{ item.city }}</v-card-title>
                    <v-card-actions>
                        <v-hover v-slot="{ isHovering, props }">
                            <v-avatar rounded size="small" v-bind="props" class="mr-1" @click="openEditDialog(item)"
                                :class="isHovering ? 'elevation-12' : 'elevation-2'" color="blue-darken-2"
                                style="cursor: pointer;">
                                <v-icon size="18" icon="mdi-pencil-outline"></v-icon>
                            </v-avatar>
                        </v-hover>
                        <v-hover v-slot="{ isHovering, props }">
                            <v-avatar rounded size="small" v-bind="props" class="mr-1" @click="openDeleteDialog(item)"
                                :class="isHovering ? 'elevation-12' : 'elevation-2'" color="#e9bc10"
                                style="cursor: pointer;">
                                <v-icon size="18" color="white" icon="mdi-trash-can-outline"></v-icon>
                            </v-avatar>
                        </v-hover>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <paginationVue :length="totalPages" @changePage="changePage" />
        <addCityVue :visible="dialog" @close="dialog = false" @save="AddCity" :title="dialog_title" />
        <editCity :visible="edit_dialog" @close="edit_dialog = false" @save="editCityValue" :title="edit_dialog_title"
            :name="edit_value" />
        <deleteWarnVue :visible="delete_dialog" @close="delete_dialog = false" :item="deleteValue" @delete="deleteCity" />
    </v-container>
</template>

<script>
import searchAndFilterToolbar from '@/components/searchAndFilterToolbar.vue';
import deleteWarnVue from '@/components/deleteWarn.vue';
import addCityVue from '@/components/city/addCity.vue';
import editCity from '@/components/city/editCity.vue';
import paginationVue from '@/components/pagination.vue';
import { mapActions, mapState } from 'vuex';

export default {
    name: 'city',
    components: {
        searchAndFilterToolbar,
        addCityVue,
        deleteWarnVue,
        editCity,
        paginationVue
    },
    data() {
        return {
            breadcrumbs: [
                { text: 'Home', disabled: false, href: '/' },
                { text: 'City', disabled: true, href: '/city' },
            ],
            cl_text: 'Add City',
            dialog: false,
            edit_dialog: false,
            edit_value: '',
            edit_id: '',
            edit_dialog_title: 'Edit City',
            dialog_title: 'Add City',
            delete_dialog: false,
            deleteValue: {},
            
            // Search and Filter functionality
            searchQuery: '',
            filterType: '',
            filteredCities: [],
            currentPage: 1,
            itemsPerPage: 15
        }
    },
    computed: {
        ...mapState('city', ['cityList', 'totalPages']),
        
        displayedCities() {
            // If no search or filter applied, return original cityList
            if (!this.searchQuery && !this.filterType) {
                return this.cityList || [];
            }
            
            // Return filtered cities
            return this.filteredCities;
        }
    },
    methods: {
        ...mapActions('city', ['GET_CITY_LIST', 'ADD_CITY', 'DELETE_CITY', 'EDIT_CITY']),

        // Handle search from searchAndFilterToolbar component
        handleSearch(searchTerm) {
            this.searchQuery = searchTerm.toLowerCase();
            this.applyFilters();
        },

        // Handle filter from searchAndFilterToolbar component
        handleFilter(filterType) {
            this.filterType = filterType;
            this.applyFilters();
        },

        // Clear all filters
        clearFilters() {
            this.searchQuery = '';
            this.filterType = '';
            this.filteredCities = [];
            this.currentPage = 1;
        },

        // Apply search and filter logic
        applyFilters() {
            let cities = [...(this.cityList || [])];

            // Apply search filter
            if (this.searchQuery) {
                cities = cities.filter(city => 
                    city.city.toLowerCase().includes(this.searchQuery) ||
                    (city.country && city.country.toLowerCase().includes(this.searchQuery)) ||
                    (city.state && city.state.toLowerCase().includes(this.searchQuery))
                );
            }

            // Apply category filter
            if (this.filterType) {
                switch (this.filterType) {
                    case 'recent':
                        // Filter cities added in last 30 days
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        cities = cities.filter(city => 
                            city.created_at && new Date(city.created_at) > thirtyDaysAgo
                        );
                        break;
                    case 'alphabetical':
                        cities.sort((a, b) => a.city.localeCompare(b.city));
                        break;
                    case 'population':
                        if (cities.some(city => city.population)) {
                            cities.sort((a, b) => (b.population || 0) - (a.population || 0));
                        }
                        break;
                    default:
                        // Custom filter logic can be added here
                        break;
                }
            }

            this.filteredCities = cities;
            this.currentPage = 1; // Reset to first page
        },

        async AddCity(payload) {
            try {
                await this.ADD_CITY(payload);
                this.dialog = false;
                await this.GET_CITY_LIST();
                // Reapply filters after adding new city
                if (this.searchQuery || this.filterType) {
                    this.applyFilters();
                }
            } catch (error) {
                console.error('Error adding city:', error);
            }
        },

        openDeleteDialog(item) {
            this.deleteValue = item;
            this.delete_dialog = true;
        },

        async deleteCity() {
            try {
                await this.DELETE_CITY(this.deleteValue.id);
                await this.GET_CITY_LIST();
                this.delete_dialog = false;
                this.deleteValue = {};
                // Reapply filters after deleting city
                if (this.searchQuery || this.filterType) {
                    this.applyFilters();
                }
            } catch (error) {
                console.error('Error deleting city:', error);
            }
        },

        openEditDialog(item) {
            this.edit_value = item.city;
            this.edit_id = item.id;
            this.edit_dialog = true;
        },

        async editCityValue(item) {
            const payload = {
                id: this.edit_id,
                name: item.name
            };
            try {
                await this.EDIT_CITY(payload);
                await this.GET_CITY_LIST();
                this.edit_dialog = false;
                this.edit_value = '';
                this.edit_id = '';
                // Reapply filters after editing city
                if (this.searchQuery || this.filterType) {
                    this.applyFilters();
                }
            } catch (error) {
                console.error('Error editing city:', error);
            }
        },

        changePage(page) {
            this.currentPage = page;
            // If filters are applied, handle pagination for filtered results
            if (this.searchQuery || this.filterType) {
                // For filtered results, we handle pagination client-side
                return;
            }
            
            // For non-filtered results, use original pagination logic
            const query = {
                page: page,
                size: 15
            };
            this.GET_CITY_LIST(query);
        }
    },
    mounted() {
        this.GET_CITY_LIST({ size: 15 });
    }
}
</script>

<style scoped>
.breadcrumbs-container {
   background: linear-gradient(90deg, #4d90fe, #285bc7);
    border-radius: 12px;
    padding: 15px;
    /* box-shadow: 0 6px 15px rgba(255, 87, 51, 0.4); */
    animation: slideInDown 0.6s ease-out;
}

.custom-breadcrumb-item {
    color: #fcfcfc;
    font-weight: 700;
    transition: all 0.3s ease;
}

.custom-breadcrumb-item:hover {
    color: #E8ECEF;
    transform: scale(1.05);
}

.v-card {
    background: white;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.v-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.v-card-title {
    font-family: 'Montserrat', sans-serif !important;
    word-break: break-word;
}

.v-card-actions {
    justify-content: flex-end;
}

@keyframes slideInDown {
    0% { opacity: 0; transform: translateY(-100%); }
    100% { opacity: 1; transform: translateY(0); }
}
</style>