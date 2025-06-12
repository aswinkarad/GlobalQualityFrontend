<template>
    <div class="text-center">
        <v-dialog v-model="show" transition="dialog-top-transition" activator="parent">
            <v-card  width="400">
                <v-card-title>
                    <div class="text-h6" style="font-family: Montserrat, sans-serif !important;">{{ title }}</div>
                </v-card-title>

                <v-card-text>
                    
                      
                                <v-text-field color="#9c27b0" label="name" density="comfortable" v-model="name" variant="underlined">
                                </v-text-field>
                   
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="white" style="background: rgb(4 43 76);" @click="(show = false)">
                        cancel
                    </v-btn>
                    <v-btn color="white" style="background: rgb(4 43 76);" @click="addCat()">
                        save
                    </v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
    name: 'AddCity',
    data() {
        return {
            dialog: false,
            name: '',
        }
    },
    props: {
        visible: {
            type: Boolean,
        },
        title: {
            type: String
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
    methods: {
        addCat() {

            const payload = {
                name: this.name,
               
            }

            this.$emit('save', payload);
            this.name = '';
          
        }
    },
    created() {
        this.name = '';
       
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
</style>