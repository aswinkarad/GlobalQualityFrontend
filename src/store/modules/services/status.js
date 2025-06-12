import axios from 'axios'
export default {
    namespaced: true,
    state: {
        statusList: {}
    },
    mutations: {
        SET_STATUS_LIST( state, data){
            state.statusList = data
        }
    },
    actions: {
        async GET_STATUS_LIST({ commit, state }) {
            const auth = JSON.parse(localStorage.getItem('user'))
            // console.log(auth)
            const data = await axios({
                method: 'get',
                url: `${process.env.VUE_APP_BASE_URL}service/list_of_working_status`,
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }
            })

             commit('SET_STATUS_LIST', data.data.data)
            //  console.log(data)
            //  console.log(state.statusList)
        },
      
    },
    getters: {
      
    //     getworkingConditoinWithId:(state) => (id) =>{
    //     return state.conditionList.find( list => list.id === id )
    // } 
    }

}