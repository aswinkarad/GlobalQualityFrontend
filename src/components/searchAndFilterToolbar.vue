<template>
    <v-toolbar height="40" class="px-0" style="border:1px solid #767373 ;" rounded="lg">

        <v-btn v-if="btn_text && showButton" style="background:#042b4c;" rounded="0" color="white" height="inherit"
            @click="addActoin"><span style="text-transform: none; font-family:'Montserrat', sans-serif !important">
                <v-icon>mdi-plus</v-icon>
                {{ btn_text }}
            </span></v-btn>
        <!-- <v-autocomplete  bg-color="#f6fbfe" v-model="value" variant="plain" :items="items"
            density="compact" hide-details >
        </v-autocomplete> -->
        <v-text-field  bg-color="#f6fbfe" clearable v-model="text" density="compact" :placeholder="placeholder" 
           @keyup.enter="search()" lass="" hide-details variant="plain" single-line>
        </v-text-field>

        <v-btn style="background:#fefefe;" rounded="0" color="white" height="inherit" @click="filterBtn"><span>
                <v-icon size="large" color="#042b4c">mdi-filter-outline</v-icon>

            </span></v-btn>
        <v-btn style="background:#042b4c;" rounded="0" color="white" height="inherit" @click="search()"><span
                style="text-transform: none; font-family:'Montserrat', sans-serif !important ">
                Search
                <v-icon size="large">mdi-magnify</v-icon>
            </span></v-btn>
    </v-toolbar>
</template>

<script>
export default {
    name: 'searchFilteToolbar',
    data() {
        return {
            text: '',
            items: ['foo', 'bar', 'fizz', 'buzz'],
        }
    },
    props: {
        btn_text: {
            type: String
        },
        placeholder: {
            type: String
        },
        auto: {
            type: Boolean,
            default: false
        },
        showButton: { // New prop to control button visibility
            type: Boolean,
            default: true
        }
    },
    watch:{
        text(Nval, Oval){
            if(this.auto){
                 this.$emit('fiterWithName', Nval)
            }
        }
    },
    methods: {
        addActoin() {
            this.$emit('btn_action')
        },
        filterBtn() {
            this.$emit('filterBtn')
        },
        search() {
            this.$emit('search', this.text)
        }
    }
}
</script>

<style >
.v-field--single-line input {
    padding-left: 14px;
}
</style>