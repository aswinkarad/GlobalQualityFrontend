import axios from 'axios'
export default {
    namespaced: true,
    state: {
        callhandelList: {}
    },
    mutations: {
        SET_CALL_HANDLE_LIST( state, data){
            state.callhandelList = data
        }
    },
    actions: {
        async GET_CALL_HANDLE_LIST({ commit, state }) {
            const auth = JSON.parse(localStorage.getItem('user'))
            // console.log(auth)
            const data = await axios({
                method: 'get',
                url: `${process.env.VUE_APP_BASE_URL}service/list_of_callhandle`,
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }

            })

             commit('SET_CALL_HANDLE_LIST', data.data)
            //  console.log(data)
            //  console.log(state.conditionList)
        },
      
    },
    getters: {
     
    }

}