import axios from 'axios'
export default {
    namespaced: true,
    state: {
        priorityList: {}
    },
    mutations: {
        SET_PRIORITY_LIST( state, data){
            state.priorityList = data
        }
    },
    actions: {
        async GET_PRIORITY_LIST({ commit, state }) {
            const auth = JSON.parse(localStorage.getItem('user'))
            // console.log(auth)
            const data = await axios({
                method: 'get',
                url: `${process.env.VUE_APP_BASE_URL}service/list_of_priority`,
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }
            })

             commit('SET_PRIORITY_LIST', data.data)
            //  console.log(data)
            //  console.log(state.conditionList)
        },
      
    },
    getters: {
      
        getworkingConditoinWithId:(state) => (id) =>{
        return state.conditionList.find( list => list.id === id )
    } 
    }

}