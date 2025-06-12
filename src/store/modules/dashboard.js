import axios from 'axios'
export default {
    namespaced: true,
    state: {
        dashboardValue: {}
    },
    mutations: {
        SET_DASHBOARD( state, data){
            state.dashboardValue = data
        }
    },
    actions: {
        async GET_DASHBOARD({ commit, state }) {
            const auth = JSON.parse(localStorage.getItem('user'))
            // console.log(auth)
            const data = await axios({
                method: 'get',
                url: `${process.env.VUE_APP_BASE_URL}users/get_dashboard`,
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }

            })

             commit('SET_DASHBOARD', data.data)
             console.log(data.data)
        },
       
    },
    getters: {
     
    }

}