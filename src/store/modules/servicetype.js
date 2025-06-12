import axios from 'axios'
export default {
    namespaced: true,
    state: {
        ServiceTypeList: {}
    },
    mutations: {
        SET_SERVICETYPE_LIST( state, data){
            state.ServiceTypeList = data
        }
    },
    actions: {
        async GET_SERVICETYPE_LIST({ commit, state }) {
            const auth = JSON.parse(localStorage.getItem('user'))
            // console.log(auth)
            const data = await axios({
                method: 'get',
                url: `${process.env.VUE_APP_BASE_URL}service/list_of_serviceType`,
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }

            })

             commit('SET_SERVICETYPE_LIST', data.data)
            //  console.log(state.ServiceTypeList)
        },
        async ADD_SERVICETYPE({ commit }, payload){
            // console.log(payload);
            try {
                
                const auth = JSON.parse(localStorage.getItem('user'));
                const  addCareof = await axios({
                    method:'post',
                    url :`${process.env.VUE_APP_BASE_URL}service/add_serviceType`,
                    data: {
                        careof: payload.name
                    },
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
    
                })
                // console.log(addCareof);

            } catch (error) {
                console.log(error);
            }
            

        },
        async DELET_SERVICETYPE({ commit }, payload){
            // console.log(payload)
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                const deleteCareof = await axios({
                    method:'get',
                    url :`${process.env.VUE_APP_BASE_URL}service/delete_serviceType/${ payload.id }`,
                
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
    
                })
                // console.log(deleteCareof)

            } catch (error) {
                console.log(error)
            }
        } ,
        async EDIT_SERVICETYPE({ commit }, payload){
            try{
                const auth = JSON.parse(localStorage.getItem('user'));
                const update = await axios({
                    method:'put',
                    url :`${process.env.VUE_APP_BASE_URL}service/update_serviceType`,
                    data: {
                        id: payload.id,
                        careof: payload.name
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