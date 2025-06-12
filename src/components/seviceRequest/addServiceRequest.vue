<template>
    <div class="text-center">
        <v-dialog v-model="show" transition="dialog-top-transition" activator="parent" :max-width="isMobile ? '100%' : '900'" :fullscreen="isMobile" scrollable>
            <v-card class="dialog-card elevation-5">
                <v-card-title class="dialog-title">
                    {{ title }}
                    <v-spacer></v-spacer>
                    <v-btn icon small @click="show = false" class="close-btn">
                        <v-icon style="color: black;">mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text class="form-container">
                    <v-container fluid>
                        <v-row dense>
                            <v-col cols="12" :sm="isMobile ? 12 : 4">
                                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model:search="search"
                                    v-model="client" clearable :items="clientList" item-title="name" item-value="id"
                                    label="Client" class="custom-field" prepend-inner-icon="mdi-account" hide-details></v-autocomplete>
                                <span v-if="v$.client.$error" class="error-text">
                                    Client is required
                                </span>
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 4">
                                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="city"
                                    disabled label="City" class="custom-field" prepend-inner-icon="mdi-city" hide-details></v-autocomplete>
                                <span v-if="v$.city.$error" class="error-text">
                                    City is required
                                </span>
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 4">
                                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="equipment"
                                    clearable :items="editClientValue.equipments" item-title="equipmentName" item-value="id"
                                    label="Machine Name" class="custom-field" prepend-inner-icon="mdi-tools" hide-details></v-autocomplete>
                                <span v-if="v$.equipment.$error" class="error-text">
                                    Equipment is required
                                </span>
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 4">
                                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="sale"
                                    clearable :items="saleList" item-title="serialNo" item-value="id"
                                    label="Serial Number" class="custom-field" prepend-inner-icon="mdi-barcode" hide-details></v-autocomplete>
                                <span v-if="v$.sale.$error" class="error-text">
                                    Serial Number is required
                                </span>
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 4">
                                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="workingCondition"
                                    clearable :items="conditionList" item-title="workingCondition" item-value="id"
                                    label="Working Condition" class="custom-field" prepend-inner-icon="mdi-wrench" hide-details></v-autocomplete>
                                <span v-if="v$.workingCondition.$error" class="error-text">
                                    Working Condition is required
                                </span>
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 4">
                                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="priority"
                                    clearable :items="priorityList" item-title="priority" item-value="id"
                                    label="Priority" class="custom-field" prepend-inner-icon="mdi-priority-high" hide-details></v-autocomplete>
                                <span v-if="v$.priority.$error" class="error-text">
                                    Priority is required
                                </span>
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 4">
                                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="technician"
                                    clearable :items="techList" item-title="username" item-value="id"
                                    label="Assigned To" class="custom-field" prepend-inner-icon="mdi-account-hard-hat" hide-details></v-autocomplete>
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 4">
                                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="callHandle"
                                    clearable :items="callhandelList" item-title="callHandle" item-value="id"
                                    label="Call Handle" class="custom-field" prepend-inner-icon="mdi-phone" hide-details></v-autocomplete>
                                <span v-if="v$.callHandle.$error" class="error-text">
                                    Call Handle is required
                                </span>
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 4">
                                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact" v-model="ServiceRequest"
                                    clearable :items="ServiceTypeList" item-title="type" item-value="id"
                                    label="Service Request" class="custom-field" prepend-inner-icon="mdi-service-toolbox" hide-details></v-autocomplete>
                                <span v-if="v$.ServiceRequest.$error" class="error-text">
                                    Service Request is required
                                </span>
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 4">
                                <v-text-field color="#7b1fa2" label="Service By" density="compact" v-model="service_by"
                                    variant="outlined" class="custom-field" ></v-text-field>
                                <span v-if="v$.service_by.$error" class="error-text">
                                    {{ v$.service_by.$errors[0].$message }}
                                </span>
                            </v-col>
                            <v-col cols="12" :md="isMobile ? 12 : 8">
                                <v-textarea color="#7b1fa2" variant="outlined" label="Description" v-model="description"
                                    auto-grow rows="3" row-height="25" class="custom-field" prepend-inner-icon="mdi-text"></v-textarea>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions class="action-container">
                    <v-btn class="action-btn cancel-btn" @click="show = false">
                        Cancel
                    </v-btn>
                    <v-btn class="action-btn save-btn" @click="addServiceRequest()">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import useVuelidate from "@vuelidate/core";
import { required, numeric } from "@vuelidate/validators";

export default {
    name: 'addServiceRequest',
    data() {
        return {
            v$: useVuelidate(),
            dialog: false,
            client: '',
            city: '',
            equipment: '',
            sale: '',
            technician: '',
            cityLists: [],
            saleList: [],
            workingCondition: '',
            priority: '',
            description: '',
            callHandle: '',
            ServiceRequest: '',
            search: '',
            service_by:'',
        };
    },
    components: {},
    props: {
        visible: {
            type: Boolean,
        },
        title: {
            type: String,
        },
    },
    validations() {
        return {
            client: { required },
            city: { required },
            equipment: { required, numeric },
            sale: { required, numeric },
            workingCondition: { required },
            priority: { required },
            callHandle: { required },
            ServiceRequest: { required },
            service_by: { required },
        };
    },
    watch: {
        workingCondition(newValue, oldValue) {
            if (newValue) {
                this.toggleItem(newValue);
            }
        },
        client(newValue, oldValue) {
            this.setCity();
        },
        equipment(newValue, oldValue) {
            this.setSerialNo();
        },
        search(val) {
            this.GET_CLIENT_LIST({ name: val });
        },
        visible(val) {
            if (val == false) {
                this.client = '';
                this.city = '';
                this.equipment = '';
                this.sale = '';
                this.priority = '';
                this.callHandle = '';
                this.ServiceRequest = '';
                this.technician = '';
            }
        },
    },
    computed: {
        ...mapState('callHandle', ['callhandelList']),
        ...mapState('priority', ['priorityList']),
        ...mapState('workingCondition', ['conditionList']),
        ...mapState('city', ['cityList']),
        ...mapState('technician', ['techList']),
        ...mapState('clients', ['clientList', 'editClientValue']),
        ...mapState('salesEquipment', ['serialList']),
        ...mapState('servicetype', ['ServiceTypeList']),
        show: {
            get() {
                return this.visible;
            },
            set(value) {
                if (!value) {
                    this.$emit('close');
                }
            },
        },
        isMobile() {
            return this.$vuetify.display.smAndDown;
        },
    },
    methods: {
        ...mapActions('clients', ['GET_CLIENT_BY_ID', 'GET_CLIENT_LIST']),
        ...mapActions('salesEquipment', ['GET_ALL_SALE_EQUIPMENT', 'GET_SALE_EQUIPMENT_BY_EQUIPMENT_ID_AND_CLIENT_ID']),
        ...mapActions('callHandle', ['GET_CALL_HANDLE_LIST']),
        ...mapActions('priority', ['GET_PRIORITY_LIST']),
        ...mapActions('workingCondition', ['GET_CONDITION_LIST']),
        ...mapActions('city', ['GET_CITY_LIST']),
        ...mapActions('technician', ['GET_TECH_LIST']),
        ...mapActions('servicetype', ['GET_SERVICETYPE_LIST']),
        async setCity() {
            this.equipment = '';
            this.sale = '';
            if (this.client) {
                const clnt = this.$store.getters["clients/getClientById"](this.client);
                this.city = clnt.city.city;
                const payload = {
                    id: this.client,
                };
                await this.GET_CLIENT_BY_ID(payload);
                await this.GET_ALL_SALE_EQUIPMENT();
            }
        },
        setSerialNo() {
            try {
                if (this.equipment) {
                    this.saleList = [];
                    const params = {
                        cid: this.client,
                        eid: this.equipment,
                    };
                    this.GET_SALE_EQUIPMENT_BY_EQUIPMENT_ID_AND_CLIENT_ID(params).then(() => {
                        this.saleList = this.serialList;
                    });
                }
            } catch (error) {
                console.log(error);
            }
        },
        setDescription() {
            if (this.selctedCondition) {
                this.description = this.selctedCondition + ' - ';
            }
        },
        addServiceRequest() {
            this.v$.$validate();
            if (!this.v$.$error) {
                const payload = {
                    saleId: this.sale,
                    service_by: this.service_by,
                    description: this.description,
                    callHandleId: this.callHandle,
                    serviceTypeId: this.ServiceRequest,
                    workingStatusId: 1,
                    workingconditionId: this.workingCondition,
                    priorityId: this.priority,
                    callRegisterDate: new Date().toISOString().substr(0, 10),
                };
                if (this.technician) {
                    payload.staffId = this.technician;
                }
                console.log(payload);
                this.$emit('save', payload);
                this.sale = '';
                this.description = '';
                this.service_by = '';
                this.technician = '';
                this.callHandle = '';
                this.ServiceRequest = '';
                this.workingCondition = '';
                this.priority = '';
                this.v$.$reset();
            }
        },
        toggleItem(item) {
            try {
                const cdtn = this.$store.getters["workingCondition/getworkingConditoinWithId"](item);
                if (cdtn && cdtn.workingCondition) {
                    this.description = `${cdtn.workingCondition} - `;
                    console.log('Condition Data:', cdtn);
                } else {
                    console.warn('No working condition found for item:', item);
                    this.description = '';
                }
            } catch (error) {
                console.error('Error in toggleItem:', error);
                this.description = '';
            }
        },
    },
    async created() {
        this.name = '';
        this.image = '';
        this.modelNo = '';
        try {
            await this.GET_CALL_HANDLE_LIST();
            await this.GET_PRIORITY_LIST();
            await this.GET_CONDITION_LIST();
            await this.GET_CITY_LIST();
            await this.GET_TECH_LIST();
            await this.GET_SERVICETYPE_LIST();
        } catch (error) {
            console.error("Error fetching lists:", error);
        }
    },
};
</script>

<style scoped>
.v-input__prepend {
    display: none !important;
}

input:focus {
    outline: none !important;
}

.dialog-card {
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    background: #ffffff;
}

.close-btn {
    background: rgba(255, 255, 255, 0.2);
    color: white;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.3);
}

.form-container {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    background: #fafafa;
}

.custom-field {
    border-radius: 8px;
    background: #ffffff;
    transition: all 0.3s ease;
}

.custom-field:focus-within {
    box-shadow: 0 0 8px rgba(123, 31, 162, 0.3);
}

.action-container {
    background: #ffffff;
    border-top: 1px solid #eee;
    padding: 16px 24px;
    justify-content: flex-end;
    gap: 12px;
}

.action-btn {
    min-width: 120px;
    border-radius: 25px;
    text-transform: uppercase;
    font-weight: 600;
    padding: 8px 24px;
    transition: all 0.3s ease;
}

.cancel-btn {
    background: #e0e0e0;
    color: #424242;
}

.cancel-btn:hover {
    background: #d0d0d0;
}

.save-btn {
    background: linear-gradient(45deg, #d46f1c, #7b1fa2);
    color: white;
}

.save-btn:hover {
    background: linear-gradient(45deg, #8e24aa, #6a1b9a);
}

.error-text {
    color: #d32f2f;
    font-size: 0.75rem;
    margin-top: 4px;
    display: block;
}

@media (min-width: 601px) {
    .dialog-card {
        margin: 24px;
    }

    .v-row {
        margin: -12px;
    }

    .v-col {
        padding: 12px;
    }

    .custom-field {
        font-size: 0.95rem;
    }
}

@media (max-width: 600px) {
    .dialog-card {
        max-height: 100vh;
        border-radius: 0;
        margin: 0;
    }

    .dialog-title {
        font-size: 1.1rem;
        padding: 12px 16px;
    }

    .form-container {
        padding: 16px;
    }

    .v-row {
        margin: -8px;
    }

    .v-col {
        padding: 8px;
    }

    .custom-field {
        font-size: 0.9rem;
    }

    .action-container {
        flex-direction: column;
        padding: 16px;
        gap: 8px;
    }

    .action-btn {
        width: 100%;
        padding: 10px;
    }

    .error-text {
        font-size: 0.7rem;
    }
}
</style>