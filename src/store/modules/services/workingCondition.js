import axios from 'axios'
export default {
    namespaced: true,
    state: {
        conditionList: {}
    },
    mutations: {
        SET_CONDITION_LIST( state, data){
            state.conditionList = data
        }
    },
    actions: {
        async GET_CONDITION_LIST({ commit, state }) {
            const auth = JSON.parse(localStorage.getItem('user'))
            // console.log(auth)
            const data = await axios({
                method: 'get',
                url: `${process.env.VUE_APP_BASE_URL}service/list_of_working_condition`,
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }

            })

             commit('SET_CONDITION_LIST', data.data)
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