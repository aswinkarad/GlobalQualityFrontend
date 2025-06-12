<template>
  <div class="text-center">
 
      <v-row justify="center" class="mt-4">
        <v-col cols="8">
          <!-- <v-container class="max-width"> -->
            <v-pagination
            
             rounded="circle"
              v-model="page"
              class=""
              :length="length"
              :total-visible="4"
            ></v-pagination>
          <!-- </v-container> -->
        </v-col>
      </v-row>
  
  </div>
</template>
<script>
  export default {
    name: 'pagination',
    data () {
      return {
        page: 1,
      }
    },
    watch:{
        page(value){
            this.test(value)
        }
    },
    props:{
        length:{
            type: Number
        },
        // page:{
        //     type: Number
        // },
    },
    methods:{
        test(value){
            this.$emit("chanegePage", value)
        }
    }
  }
</script>