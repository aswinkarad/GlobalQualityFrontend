<template>
  <div class="text-center">

    <v-snackbar v-model="show" type="error" :color="color" :timeout="timeout">
      {{ text }}

      <template v-slot:actions v-if="button">

        <v-btn color="white" variant="text" @click="show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
export default {
  name: 'warnSnackbar',
  data: () => ({
    snackbar: false,
    // text: '',
    timeout: 2000,
  }),
  props: {
    visible: {
      type: Boolean,
    },
    text: {
      type: String,
      default: 'You must login first'
    },
    button: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,

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
  }
}
</script>