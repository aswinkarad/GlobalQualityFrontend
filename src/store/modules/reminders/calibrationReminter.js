import axios from 'axios'
export default {
    namespaced: true,
    state: {
        calibrationList: {},
        calibrationTotalPage: ''
    },
    mutations: {
        SET_CALIBRATION_LIST( state, data){
            state.calibrationList = data
        },
        SET_CALIBRATION_TOTAL_PAGE( state, data){
            state.calibrationTotalPage = data
        },
    },
    actions: {
        async GET_CALIBRATION_LIST({ commit, state }, query) {
            const auth = JSON.parse(localStorage.getItem('user'))
            // console.log(auth)
            const options = {
                method: 'get',
                url: `${process.env.VUE_APP_BASE_URL}remainder/calibration_remainder`,
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }

            }
            if(query){
                options.params = query
            }
            const data = await axios(options)
            console.log(data.data.data);
             commit('SET_CALIBRATION_LIST', data.data.data);
             commit('SET_CALIBRATION_TOTAL_PAGE', data.data.totalPages)
            //  console.log(data.data)
        },
        async UPDATE_SERVICE_CALIBRATION({ commit, state }, payload){
            const auth = JSON.parse(localStorage.getItem('user'));
            const update = await axios({
                method: 'post',
                url: `${process.env.VUE_APP_BASE_URL}service/add_servicereq_fromcalibrative`,
                data:{
                    saleId: payload.saleId,
                    description: 'Calibration Reminder',
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
            console.log(update);

        }
        
        
    },
    getters: {
     
    }

}