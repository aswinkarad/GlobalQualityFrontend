<template>
    <div class="text-center">
        <v-dialog v-model="show" transition="dialog-top-transition"  persistent >
            <v-card width="400" color="transparent" elevation="0">
                <!-- <v-card-title> Are You Sure ?  </v-card-title> -->
               <v-img height="150" :src="require('@/assets/98288-loading.gif')">

               </v-img>
                <!-- <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="white" style="background: rgb(4 43 76);" @click="(show = false)">
                        cancel
                    </v-btn>
                    <v-btn color="white" style="background: rgb(4 43 76);"  @click="deletethis()">
                        yes
                    </v-btn> -->

                <!-- </v-card-actions> -->
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
    name:'deletWarn',
    data() {
        return {
            dialog: false,
            name: '',
            image: '',
            modelNo: ''
        }
    },
    props: {
        visible: {
            type: Boolean,
        },
        item:{
            type: Array
        },
       
        // log:{
        //     type: Boolean,
        //     default: false
        // },

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
    methods:{
        deletethis(){  
            this.$emit( 'delete', this.item);   
        }
    },
    created(){
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
</style>