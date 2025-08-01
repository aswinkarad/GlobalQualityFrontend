import axios from 'axios'
export default {
    namespaced: true,
    state: {
        RequestTypeList: {},
    },
    mutations: {
        SET_REQUESTTYPE(state, data) {
            state.RequestTypeList = data
        },
        // SET_REQUESTTYPE(state, data) {
        //     state.ServiceRequestType = data
        // },
        SET_CITY_TOTAL_PAGE(state, data) {
            state.totalPages = data
        }
    },
    actions: {
        
        async GET_REQUESTTYPE({ commit, state }, query) {
            const auth = JSON.parse(localStorage.getItem('user'))
            // console.log(auth)
            const options = {
                method: 'get',
                url: `${process.env.VUE_APP_BASE_URL}request/list_of_requestType`,
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }

            }
            if (query) {
                options.params = query
            }
            const data = await axios(options)
            // console.log(data);

            commit('SET_REQUESTTYPE', data.data)
            commit('SET_CITY_TOTAL_PAGE', data.data.totalPages)
            //  console.log(state.totalPages)
        },
        async ADD_REQUESTTYPE({ commit }, payload) {
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                const addCity = await axios({
                    method: 'post',
                    url: `${process.env.VUE_APP_BASE_URL}request/add_requestType`,
                    data: payload,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                })
            } catch (error) {
                console.log(error);
            }
        },
        async DELETE_REQUESTTYPE({ commit }, payload){
            // console.log(payload)
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                const deleteCity = await axios({
                    method:'get',
                    url :`${process.env.VUE_APP_BASE_URL}request/delete_requestType/${ payload.id }`,
                
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
    
                })
                console.log(deleteCity)

            } catch (error) {
                console.log(error)
            }
        } ,
        async EDIT_REQUESTTYPE({ commit }, payload){
            try{
                const auth = JSON.parse(localStorage.getItem('user'));
                const update = await axios({
                    method:'put',
                    url :`${process.env.VUE_APP_BASE_URL}request/update_requestType`,
                    data: {
                        id: payload.id,
                        type: payload.type
                    },
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
    
                })
                console.log(update)

            }catch(error){
                console.log(error)
            }
        }
    },
    getters: {

    }

}