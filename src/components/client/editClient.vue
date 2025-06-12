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
                            <v-col cols="12" :sm="isMobile ? 12 : 6">
                                <v-text-field color="#7b1fa2" label="Name" density="compact" v-model="data.name"
                                    variant="outlined" class="custom-field" prepend-inner-icon="mdi-account"></v-text-field>
                                <span v-if="v$.data.name.$error" class="error-text">
                                    {{ v$.data.name.$errors[0].$message }}
                                </span>
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 6">
                                <v-text-field style="direction:rtl" color="#7b1fa2" label="Name (Arabic)"
                                    density="compact" v-model="data.arabicname" variant="outlined"
                                    class="custom-field" prepend-inner-icon="mdi-account-outline"></v-text-field>
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 6">
                                <v-text-field color="#7b1fa2" label="Email" density="compact" v-model="data.email"
                                    variant="outlined" class="custom-field" prepend-inner-icon="mdi-email"></v-text-field>
                                <span v-if="v$.data.email.$error" class="error-text">
                                    {{ v$.data.email.$errors[0].$message }}
                                </span>
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 6">
                                <v-text-field color="#7b1fa2" label="Address Line 1" density="compact"
                                    v-model="data.address1" variant="outlined" class="custom-field"
                                    prepend-inner-icon="mdi-map-marker"></v-text-field>
                                <span v-if="v$.data.address1.$error" class="error-text">
                                    {{ v$.data.address1.$errors[0].$message }}
                                </span>
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 4">
                                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact"
                                    v-model="data.cityId" clearable :items="cityList" item-title="city" item-value="id"
                                    label="City" class="custom-field" prepend-inner-icon="mdi-city"></v-autocomplete>
                                <span v-if="v$.data.cityId.$error" class="error-text">
                                    City is required
                                </span>
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 6">
                                <v-text-field color="#7b1fa2" label="Landmark" density="compact" v-model="data.landmark"
                                    variant="outlined" class="custom-field" prepend-inner-icon="mdi-pin"></v-text-field>
                                <!-- <span v-if="v$.data.landmark.$error" class="error-text">
                                    Landmark is required
                                </span> -->
                            </v-col>
                            <!-- <v-col cols="12" :sm="isMobile ? 12 : 4">
                                <v-radio-group v-model="data.clienttypeId" :inline="!isMobile" class="mt-0 radio-group">
                                    <v-radio color="#7b1fa2" label="GOVT" :value="1"></v-radio>
                                    <v-radio color="#7b1fa2" label="Non-GOVT" :value="2"></v-radio>
                                </v-radio-group>
                                <span v-if="v$.data.clienttypeId.$error" class="error-text">
                                    Type is required
                                </span>
                            </v-col> -->
                            <v-col cols="12" :sm="isMobile ? 12 : 4">
                                <v-autocomplete color="#7b1fa2" variant="outlined" density="compact"
                                    v-model="data.careofId" clearable :items="careofList" item-title="careof"
                                    item-value="id" label="Care Of" class="custom-field"
                                    prepend-inner-icon="mdi-account-supervisor"></v-autocomplete>
                                <span v-if="v$.data.careofId.$error" class="error-text">
                                    Care of is required
                                </span>
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 4">
                                <v-text-field color="#7b1fa2" label="Zip Code" density="compact" v-model="data.zip"
                                    variant="outlined" class="custom-field" prepend-inner-icon="mdi-mailbox"></v-text-field>
                                <!-- <span v-if="v$.data.zip.$error" class="error-text">
                                    Zip Code is required
                                </span> -->
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 4">
                                <v-text-field color="#7b1fa2" label="Contact Person 1" density="compact"
                                    v-model="data.cont_person1" variant="outlined" class="custom-field"
                                   ></v-text-field>
                                <span v-if="v$.data.cont_person1.$error" class="error-text">
                                    {{ v$.data.cont_person1.$errors[0].$message }}
                                </span>
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 4">
                                <v-text-field color="#7b1fa2" label="Contact No 1" density="compact"
                                    v-model="data.contact1" variant="outlined" class="custom-field"
                                    prepend-inner-icon="mdi-phone"></v-text-field>
                                <span v-if="v$.data.contact1.$error" class="error-text">
                                    {{ v$.data.contact1.$errors[0].$message }}
                                </span>
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 4">
                                <v-text-field color="#7b1fa2" label="Contact person 2" density="compact"
                                    v-model="data.cont_person2" variant="outlined" class="custom-field"
                                    ></v-text-field>
                                <!-- <span v-if="v$.data.cont_person2.$error" class="error-text">
                                    {{ v$.data.cont_person2.$errors[0].$message }}
                                </span> -->
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 4">
                                <v-text-field color="#7b1fa2" label="Contact No 2" density="compact"
                                    v-model="data.contact2" variant="outlined" class="custom-field"
                                    prepend-inner-icon="mdi-phone-plus"></v-text-field>
                                <!-- <span v-if="v$.data.contact2.$error" class="error-text">
                                    {{ v$.data.contact2.$errors[0].$message }}
                                </span> -->
                            </v-col>

                            <v-col cols="12" :sm="isMobile ? 12 : 4">
                                <v-text-field color="#7b1fa2" label="Contact person 3" density="compact"
                                    v-model="data.cont_person3" variant="outlined" class="custom-field"
                                    ></v-text-field>
                                <!-- <span v-if="v$.data.cont_person3.$error" class="error-text">
                                    {{ v$.data.cont_person3.$errors[0].$message }}
                                </span> -->
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 4">
                                <v-text-field color="#7b1fa2" label="Contact No 3" density="compact"
                                    v-model="data.contact3" variant="outlined" class="custom-field"
                                    prepend-inner-icon="mdi-phone-plus"></v-text-field>
                                <!-- <span v-if="v$.data.contact3.$error" class="error-text">
                                    {{ v$.data.contact3.$errors[0].$message }}
                                </span> -->
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions class="action-container">
                    <v-btn class="action-btn cancel-btn" @click="show = false">
                        Cancel
                    </v-btn>
                    <v-btn class="action-btn save-btn" @click="editClients()">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, numeric, email } from "@vuelidate/validators";
import { mapActions, mapState } from 'vuex';

export default {
    name: 'editClients',
    props: {
        visible: {
            type: Boolean,
        },
        title: {
            type: String
        },
        data: {
            type: Object,
            default: () => ({
                name: '',
                arabicname: '',
                email: '',
                address1: '',
                address2: '',
                cityId: null,
                landmark: '',
                // clienttypeId: null,
                careofId: null,
                cont_person1:'',
                contact1: '',
                cont_person2:'',
                contact2: '',
                cont_person3:'',
                contact3: '',
                zip: ''
            })
        }
    },
    setup() {
        return { v$: useVuelidate() };
    },
    validations() {
        return {
            data: {
                name: { required },
                email: { required, email },
                address1: { required },
                cityId: { required },
                // landmark: { required },
                // clienttypeId: { required },
                careofId: { required },
                cont_person1: { required },
                contact1: { required, numeric },
                // cont_person2: { required },
                contact2: { numeric },
                // zip: { required }
            }
        };
    },
    computed: {
        ...mapState('city', ['cityList']),
        ...mapState('careof', ['careofList']),
        show: {
            get() {
                return this.visible;
            },
            set(value) {
                if (!value) {
                    this.$emit('close');
                }
            }
        },
        isMobile() {
            return this.$vuetify.display.smAndDown;
        }
    },
    methods: {
        ...mapActions('city', ['GET_CITY_LIST']),
        ...mapActions('careof', ['GET_CAREOF_LIST']),
        editClients() {
    this.v$.$validate();
    if (!this.v$.$error) {
        const payload = {
            id: this.data.id,
            careofId: this.data.careofId,
            // clienttypeId: this.data.clienttypeId,
            cityId: this.data.cityId,
            name: this.data.name,
            arabicname: this.data.arabicname,
            email: this.data.email,
            address1: this.data.address1,
            address2: this.data.address2,
            landmark: this.data.landmark,
            cont_person1: this.data.cont_person1,
            contact1: this.data.contact1,
            cont_person2: this.data.cont_person2,
            contact2: this.data.contact2,
            cont_person3: this.data.cont_person3,
            contact3: this.data.contact3,
            zip: this.data.zip
        };
        this.$emit('save', payload);
    }
}
    },
    created() {
        this.GET_CITY_LIST();
        this.GET_CAREOF_LIST();
    }
};
</script>

<style scoped>
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

/* Desktop Styles */
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

    .radio-group {
        justify-content: flex-start;
        gap: 24px;
    }
}

/* Mobile Styles */
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

    .radio-group {
        flex-direction: column;
        gap: 8px;
        margin-bottom: 8px;
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