import axios from 'axios'
export default {
    namespaced: true,
    state: {
        careofList: {}
    },
    mutations: {
        SET_CAREOF_LIST( state, data){
            state.careofList = data
        }
    },
    actions: {
        async GET_CAREOF_LIST({ commit, state }) {
            const auth = JSON.parse(localStorage.getItem('user'))
            // console.log(auth)
            const data = await axios({
                method: 'get',
                url: `${process.env.VUE_APP_BASE_URL}clients/list_of_careofs`,
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }

            })

             commit('SET_CAREOF_LIST', data.data.data)
            //  console.log(state.careofList)
        },
        async ADD_CAREOF({ commit }, payload){
            // console.log(payload);
            try {
                
                const auth = JSON.parse(localStorage.getItem('user'));
                const  addCareof = await axios({
                    method:'post',
                    url :`${process.env.VUE_APP_BASE_URL}clients/add_careof`,
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
        async DELET_CAREOF({ commit }, payload){
            // console.log(payload)
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                const deleteCareof = await axios({
                    method:'get',
                    url :`${process.env.VUE_APP_BASE_URL}clients/delete_careof/${ payload.id }`,
                
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
    
                })
                // console.log(deleteCareof)

            } catch (error) {
                console.log(error)
            }
        } ,
        async EDIT_CAREOF({ commit }, payload){
            try{
                const auth = JSON.parse(localStorage.getItem('user'));
                const update = await axios({
                    method:'post',
                    url :`${process.env.VUE_APP_BASE_URL}clients/update_careof`,
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