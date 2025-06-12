import axios from 'axios'
export default {
    namespaced: true,
    state: {
        preventiveList: {},
        preventiveTotalPage: ''
    },
    mutations: {
        SET_PREVENTIVE_LIST( state, data){
            state.preventiveList = data
        },
        SET_PREVENTIVE_TOTAL_PAGE(state, data){
            state.preventiveTotalPage = data
        }
    },
    actions: {
        async GET_PREVENTIVE_LIST({ commit, state }, query) {
            const auth = JSON.parse(localStorage.getItem('user'))
            
            // console.log(auth)
            const options = {
                method: 'get',
                url: `${process.env.VUE_APP_BASE_URL}remainder/preventive_remainder?sort=desc`,
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }
            }
            if(query){
              options.params = query;
            }
            const data = await axios(options)
            console.log(data.data.data);
             commit('SET_PREVENTIVE_LIST', data.data.data);
             commit('SET_PREVENTIVE_TOTAL_PAGE', data.data.totalPages)
             console.log(data.data)
        },
        async UPDATE_SERVICE_PREVENTIVE({ commit, state }, payload){
            const auth = JSON.parse(localStorage.getItem('user'));
            const update = await axios({
                method: 'post',
                url: `${process.env.VUE_APP_BASE_URL}service/add_servicereq_frompreventive`,
                data:{
                    saleId: payload.saleId,
                    description: 'Preventive Reminder',
                    statusId: 1,
                    callHandleId: 2,
                    workingConditionId:1,
                    priorityId:1,
                    callRegisterDate: Date.now()
                },
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }

            })
            // console.log(update);

        }
        
        
    },
    getters: {
     
    }

}