<template>
    <div class="text-center">
      <v-dialog v-model="show" transition="dialog-top-transition" activator="parent">
        <v-card class="dialog-card">
          <v-card-title>
            <div class="text-h6 dialog-title" style="font-family: Montserrat, sans-serif !important;">{{ title }}</div>
          </v-card-title>
          <v-card-text v-if="equipment">
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="name" hide-details label="Equipment Name" placeholder="" variant="underlined"
                  density="comfortable"></v-text-field>
                <span v-if="v$.name.$error" class="error-text">
                  {{ v$.name.$errors[0].$message }}
                </span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="model" hide-details label="Model Number" placeholder="" variant="underlined"
                  density="comfortable"></v-text-field>
                <span v-if="v$.model.$error" class="error-text">
                  {{ v$.model.$errors[0].$message }}
                </span>
              </v-col>
            </v-row>
            <!-- <v-row>
              <v-col cols="12">
                <v-select v-model="warrantyStatus" :items="warrantyStatusOptions" label="Warranty Status"
                  variant="underlined" density="comfortable" hide-details></v-select>
                <span v-if="v$.warrantyStatus.$error" class="error-text">
                  {{ v$.warrantyStatus.$errors[0].$message }}
                </span>
              </v-col>
            </v-row> -->
            <v-row>
              <v-col cols="12">
                <v-file-input accept="image/png, image/jpeg, image/bmp" v-model="image" prepend-icon="mdi-image-outline"
                  label="Image" hide-details density="comfortable" variant="outlined"></v-file-input>
                <span v-if="v$.image.$error" class="error-text">
                  Image is required
                </span>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text v-else>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="name" hide-details label="Category" placeholder="" variant="underlined"
                  density="comfortable"></v-text-field>
                <span v-if="v$.name.$error" class="error-text">
                  {{ v$.name.$errors[0].$message }}
                </span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-file-input accept="image/png, image/jpeg, image/bmp" v-model="image" prepend-icon="mdi-image-outline"
                  label="Image" hide-details density="comfortable" variant="outlined"></v-file-input>
                <span v-if="v$.image.$error" class="error-text">
                  {{ v$.image.$errors[0].$message }}
                </span>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
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
  import { required } from "@vuelidate/validators";
  import { mapActions, mapState } from 'vuex';
  
  export default {
    data() {
      return {
        v$: useVuelidate(),
        dialog: false,
        name: '',
        image: '',
        model: '',
        // warrantyStatus: '',
      };
    },
    validations() {
      return {
        name: { required },
        image: { required },
        model: { required },
        // warrantyStatus: this.equipment ? { required } : {},
      };
    },
    props: {
      visible: {
        type: Boolean,
      },
      title: {
        type: String,
      },
      equipment: {
        type: Boolean,
        default: false,
      },
      // warrantyStatuses: {
      //   type: Array,
      //   default: () => [],
      // },
    },
    computed: {
      ...mapState('equipments', ['statusList']),
      // warrantyStatusOptions() {
      //   return this.statusList.map(item => ({
      //     title: item.status,
      //     value: item.id,
      //   }));
      // },
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
    },
    methods: {
      ...mapActions('equipments', ['GET_STATUS_LIST']),
      addCat() {
        this.v$.name.$validate();
        this.v$.image.$validate();
        const payload = {
          name: this.name,
          image: this.image,
        };
        if (this.equipment) {
          this.v$.model.$validate();
          payload.model = this.model;
          // payload.warrantyStatus = this.warrantyStatus;
        }
        if (this.v$.$errors.length === 0) {
          this.$emit('save', payload);
          this.v$.$reset();
          this.name = '';
          this.image = '';
          this.model = '';
          // this.warrantyStatus = '';
        }
      },
    },
    created() {
      this.name = '';
      this.image = '';
      this.model = '';
      this.GET_STATUS_LIST();
    },
  };
  </script>
  
  <style scoped>
  /* Dialog Card Styling */
  .dialog-card {
    width: 600px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(245, 247, 250, 0.9));
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    padding: 15px;
    animation: slideInTop 0.5s ease-out;
  }
  
  /* Dialog Title */
  .dialog-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2A4066;
    background: linear-gradient(45deg, #FF5733, #2A4066);
    -webkit-background-clip: text;
    color: transparent;
    text-align: center;
    padding-bottom: 10px;
  }
  
  /* Form Fields */
  .v-text-field,
  .v-select,
  .v-file-input {
    margin-bottom: 15px;
  }
  
  .v-text-field :deep(.v-field),
  .v-select :deep(.v-field),
  .v-file-input :deep(.v-field) {
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);
    transition: all 0.3s ease;
  }
  
  .v-text-field :deep(.v-field:hover),
  .v-select :deep(.v-field:hover),
  .v-file-input :deep(.v-field:hover) {
    background: rgba(255, 235, 230, 0.9);
    box-shadow: 0 3px 10px rgba(255, 87, 51, 0.2);
  }
  
  /* Hide Prepend Icon */
  .v-input__prepend {
    display: none !important;
  }
  
  /* Error Text */
  .error-text {
    color: red;
    font-size: 0.85rem;
    margin-top: 5px;
    display: block;
  }
  
  /* Action Buttons */
  .action-btn {
    border-radius: 8px;
    padding: 6px 16px;
    text-transform: capitalize;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  
  .cancel-btn {
    background: #042B4C;
    color: white;
  }
  
  .cancel-btn:hover {
    background: #053a66;
    transform: scale(1.05);
  }
  
  .save-btn {
    background: #042B4C;
    color: white;
  }
  
  .save-btn:hover {
    background: #053a66;
    transform: scale(1.05);
  }
  
  /* Animation */
  @keyframes slideInTop {
    0% {
      opacity: 0;
      transform: translateY(-50px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 600px) {
    .dialog-card {
      width: 110%;
      padding: 10px;
    }
  
    .dialog-title {
      font-size: 1.2rem;
      padding-bottom: 8px;
    }
  
    .v-text-field,
    .v-select,
    .v-file-input {
      margin-bottom: 12px;
    }
  
    .v-text-field :deep(.v-field),
    .v-select :deep(.v-field),
    .v-file-input :deep(.v-field) {
      font-size: 0.9rem;
    }
  
    .error-text {
      font-size: 0.75rem;
    }
  
    .action-btn {
      padding: 5px 12px;
      font-size: 0.8rem;
    }
  }
  
  @media (max-width: 400px) {
    .dialog-card {
      width: 100%;
      padding: 8px;
    }
  
    .dialog-title {
      font-size: 1rem;
    }
  
    .v-text-field :deep(.v-field),
    .v-select :deep(.v-field),
    .v-file-input :deep(.v-field) {
      font-size: 0.85rem;
    }
  
    .action-btn {
      padding: 4px 10px;
      font-size: 0.75rem;
    }
  }
  </style>