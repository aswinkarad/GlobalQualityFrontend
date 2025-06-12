<template>
  <navigationDrawer />
</template>

<script>
import { defineComponent } from 'vue';

// Components
import navigationDrawer from '../components/navigationDrawer.vue';
import { mapState } from 'vuex'  

export default defineComponent({
  name: 'HomeView',
  computed:{
    ...mapState('user',['userData'])
  },
  components: {
    navigationDrawer,
  },
  beforeMount(){
     const user = JSON.parse(localStorage.getItem('user'))
     if(!user){
      this.$router.push({ name: 'signIn' })
     }
    //  console.log(this.userData)
  }
 
});
</script>
