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
                                <v-text-field color="#7b1fa2" label="User Name" density="compact" v-model="username"
                                    variant="outlined" class="custom-field" prepend-inner-icon="mdi-account"></v-text-field>
                                <span v-if="v$.username.$error" class="error-text">
                                    {{ v$.username.$errors[0].$message }}
                                </span>
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 6">
                                <v-text-field color="#7b1fa2" label="Email" density="compact" v-model="email"
                                    variant="outlined" class="custom-field" prepend-inner-icon="mdi-email"></v-text-field>
                                <span v-if="v$.email.$error" class="error-text">
                                    {{ v$.email.$errors[0].$message }}
                                </span>
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 6">
                                <v-text-field color="#7b1fa2" label="Mobile" density="compact" v-model="mobile"
                                    variant="outlined" class="custom-field" prepend-inner-icon="mdi-phone"></v-text-field>
                                <span v-if="v$.mobile.$error" class="error-text">
                                    {{ v$.mobile.$errors[0].$message }}
                                </span>
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 6">
                                <v-text-field color="#7b1fa2" label="Password" density="compact" v-model="password"
                                    variant="outlined" class="custom-field" prepend-inner-icon="mdi-lock"></v-text-field>
                                <span v-if="v$.password.$error" class="error-text">
                                    {{ v$.password.$errors[0].$message }}
                                </span>
                            </v-col>
                            <v-col cols="12" :sm="isMobile ? 12 : 6">
                                <v-text-field color="#7b1fa2" label="Confirm Password" density="compact" v-model="confirmPass"
                                    variant="outlined" class="custom-field" prepend-inner-icon="mdi-lock-check"></v-text-field>
                                <span v-if="v$.confirmPass.$error" class="error-text">
                                    {{ v$.confirmPass.$errors[0].$message }}
                                </span>
                                <span v-if="confirmError" class="error-text">{{ confirmError }}</span>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions class="action-container">
                    <v-btn class="action-btn cancel-btn" @click="show = false">
                        Cancel
                    </v-btn>
                    <v-btn class="action-btn save-btn" @click="addCat()">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, numeric, decimal, maxLength, email } from "@vuelidate/validators";

export default {
    name: 'addAdmin',
    data() {
        return {
            v$: useVuelidate(),
            dialog: false,
            username: "",
            email: "",
            mobile: "",
            password: "",
            confirmPass: "",
            confirmError: ""
        }
    },
    validations() {
        return {
            username: { required },
            email: { required, email },
            mobile: { required, numeric },
            password: { 
                required: this.title === 'Add Admin' ? required : false // Make password optional for edit
            },
            confirmPass: { 
                required: this.title === 'Add Admin' ? required : false // Make confirmPass optional for edit
            }
        }
    },
    props: {
        visible: {
            type: Boolean,
        },
        title: {
            type: String
        },
        item: {  // Add item prop to receive existing admin data
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        show: {
            get() {
                return this.visible
            },
            set(value) {
                if (!value) {
                    this.$emit('close')
                }
            }
        }
    },
    watch: {
        item: {
            immediate: true,
            handler(newItem) {
                if (newItem && Object.keys(newItem).length > 0) {
                    // Populate fields with existing data when editing
                    this.username = newItem.username || ''
                    this.email = newItem.email || ''
                    this.mobile = newItem.mobile || ''
                    this.password = '' // Leave password empty for security
                    this.confirmPass = ''
                }
            }
        }
    },
    methods: {
        addCat() {
            this.v$.$validate();
            if (!this.v$.$error) {
                if (this.password == this.confirmPass) {
                    const payload = {
                        username: this.username,
                        email: this.email,
                        mobile: this.mobile,
                        password: this.password
                    }
                    this.confirmError = ''
                    this.$emit('save', payload);
                } else {
                    this.confirmError = 'password doesnot match'
                }
            }
        }
    },
    created() {
        this.name = '';
        this.image = '';
        this.modelNo = ''
    }
}
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