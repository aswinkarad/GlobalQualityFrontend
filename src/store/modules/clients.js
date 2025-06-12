import axios from 'axios'
export default {
    namespaced: true,
    state: {
        clientList: [],
        clientListReport: {},
        editClientValue:{},
        clientTotalPage: ''
    },

    mutations: {
        SET_CLIENT_LIST( state, data){
            state.clientList = data
        },
        SET_CLIENT_REPORT_LIST( state, data){
            state.clientListReport = data
        },
        SET_EDIT_CLIENT_VALUE( state, data){
            state.editClientValue = data
        },
        SET_CLIENT_TOTAL_PAGE(state, data){
            state.clientTotalPage = data
        }
    },
    actions: {
        async GET_CLIENT_LIST({ commit, state }, query) {
            const auth = JSON.parse(localStorage.getItem('user'))
            // console.log(auth)
            const options = {
                method: 'get',
                url: `${process.env.VUE_APP_BASE_URL}clients/list_of_clients`,
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }

            }
            if(query){
                options.params = query
            }
            const data = await axios(options)

             commit('SET_CLIENT_LIST', data.data.data);
             commit('SET_CLIENT_TOTAL_PAGE', data.data.totalPages)
            //  console.log(data)
        },
        async GET_CLIENT_LIST_REPORT({ commit, state }, query) {
            const auth = JSON.parse(localStorage.getItem('user'))
            // console.log(auth)
            const options = {
                method: 'get',
                url: `${process.env.VUE_APP_BASE_URL}clients/list_of_clients`,
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }

            }
            if(query){
                options.params = query
            }
            const data = await axios(options)

             commit('SET_CLIENT_REPORT_LIST', data.data.data);
            //  commit('SET_CLIENT_TOTAL_PAGE', data.data.totalPages)
            //  console.log(data)
        },
        // async ADD_CLIENT({ commit }, payload){
        //     try {
        //         const auth = JSON.parse(localStorage.getItem('user'));
        //         const  addclient = await axios({
        //             method:'post',
        //             url :`${process.env.VUE_APP_BASE_URL}clients/add_client`,
        //             data: payload,
        //             headers: {
        //                 Authorization: 'Bearer ' + auth.access_token
        //             }
        //         })
        //      console.log(addclient);

        //     } catch (error) {
        //         console.log(error);
        //     }
        // },
        async ADD_CLIENT({ commit }, payload) {
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                const response = await axios({
                    method: 'post',
                    url: `${process.env.VUE_APP_BASE_URL}clients/add_client`,
                    data: payload,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token,
                    },
                });
        
                console.log('API Response:', response); 
        
                if (response && response.data) {
                    return response.data; // Return the response data
                } else {
                    throw new Error('Invalid response from the server');
                }
            } catch (error) {
                console.error('Error in ADD_CLIENT:', error);
                throw error; // Re-throw the error to handle it in the component
            }
        },
        async DELETE_CLIENT({ commit }, payload){
            // console.log(payload)
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                const deleteclient = await axios({
                    method:'get',
                    url :`${process.env.VUE_APP_BASE_URL}clients/delete_client/${ payload.id }`,
                
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
    
                })
                // console.log(deleteclient)

            } catch (error) {
                console.log(error)
            }
        } ,
        async GET_CLIENT_BY_ID({ commit, state }, payload){
             console.log(payload)
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                const clientWithId = await axios({
                    method:'get',
                    url :`${process.env.VUE_APP_BASE_URL}clients/list_of_clients/${ payload.id }`,
                
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
    
                })
                // console.log(clientWithId)
                commit('SET_EDIT_CLIENT_VALUE', clientWithId.data.data[0] )
                // console.log(state.editClientValue)

            } catch (error) {
                console.log(error)
            }
        } ,
        async UPDATE_CLIENT({ commit }, payload){
            try{
                // console.log(payload)
                const auth = JSON.parse(localStorage.getItem('user'));
                const update = await axios({
                    method:'post',
                    url :`${process.env.VUE_APP_BASE_URL}clients/update_client`,
                    data: payload,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
    
                })
                // console.log(update)

            }catch(error){
                console.log(error)
            }
        },
        async FILTER_CLIENT({ commit }, payload){
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                const data = await axios({
                    method:'get',
                    url :`${process.env.VUE_APP_BASE_URL}clients/list_of_clients`,
                    params: payload,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
    
                });
                commit('SET_CLIENT_LIST', data.data.data)
                // console.log(data)

            } catch (error) {
                console.log(error)
            }
        }
    },
    getters: {
        getClientById:(state) => (id) =>{
            return state.clientList.find( list => list.id === id )
        } 
        
    }

}