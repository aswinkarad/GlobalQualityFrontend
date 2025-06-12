import axios from 'axios'
export default {
    namespaced: true,
    state: {
        cityList: {},
        totalPages:''
    },
    mutations: {
        SET_CITY_LIST( state, data){
            state.cityList = data
        },
        SET_CITY_TOTAL_PAGE(state , data){
            state.totalPages = data
        }
    },
    actions: {
        async GET_CITY_LIST({ commit, state }, query) {
            const auth = JSON.parse(localStorage.getItem('user'))
            // console.log(auth)
            const options = {
                method: 'get',
                url: `${process.env.VUE_APP_BASE_URL}citys/list_of_citys`,
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }

            }
            if(query){
                options.params = query
            }
            const data = await axios(options)
            // console.log(data);
            
             commit('SET_CITY_LIST', data.data.data)
             commit('SET_CITY_TOTAL_PAGE', data.data.totalPages)
            //  console.log(state.totalPages)
        },
        async ADD_CITY({ commit }, payload){
            // console.log(payload);
            try {
                
                const auth = JSON.parse(localStorage.getItem('user'));
                const addCity = await axios({
                    method:'post',
                    url :`${process.env.VUE_APP_BASE_URL}citys/add_city`,
                    data: payload,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
    
                })
                // console.log(addCity);

            } catch (error) {
                console.log(error);
            }
            

        },
        async DELETE_CITY({ commit }, payload){
            // console.log(payload)
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                const deleteCity = await axios({
                    method:'get',
                    url :`${process.env.VUE_APP_BASE_URL}citys/delete_city/${ payload.id }`,
                
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
    
                })
                // console.log(deleteCity)

            } catch (error) {
                console.log(error)
            }
        } ,
        async EDIT_CITY({ commit }, payload){
            try{
                const auth = JSON.parse(localStorage.getItem('user'));
                const update = await axios({
                    method:'post',
                    url :`${process.env.VUE_APP_BASE_URL}citys/update_city`,
                    data: {
                        id: payload.id,
                        name: payload.name
                    },
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
    
                })
                // console.log(update)

            }catch(error){
                console.log(error)
            }
        }
    },
    getters: {
     
    }

}