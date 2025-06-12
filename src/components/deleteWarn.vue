<template>
    <div class="text-center">
      <v-dialog v-model="show" transition="dialog-top-transition" max-width="400">
        <v-card>
          <v-card-title>Are You Sure?</v-card-title>
          <v-card-title v-if="!log && item">
            Do you want to delete {{ item.categoryName }}?
          </v-card-title>
          <v-card-title v-else-if="!log && !item">
            No item selected for deletion.
          </v-card-title>
          <v-card-title v-else>
            Do you want to clear the log?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="white" style="background: rgb(4, 43, 76);" @click="show = false">
              Cancel
            </v-btn>
            <v-btn
              color="white"
              style="background: rgb(4, 43, 76);"
              :disabled="!item && !log"
              @click="deletethis"
            >
              Yes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DeleteWarn',
    props: {
      visible: {
        type: Boolean,
        required: true,
      },
      item: {
        type: Object, // Changed from Array to Object
        default: null, // Allow null to prevent required prop error
      },
      equipment: {
        type: Boolean,
        default: false,
      },
      log: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
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
      deletethis() {
        if (this.item || this.log) {
          this.$emit('delete', this.item);
          this.show = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .v-input__prepend {
    display: none !important;
  }
  </style>