import router from '@/router'
import axios from 'axios'
export default {
    namespaced: true,
    state: {
        categoryList: {},
        result: {},
        delResp: {},
    },
    mutations: {
        SET_CATEGORY_LIST(state, data) {
            // localStorage.setItem('user', JSON.stringify(user) )
            state.categoryList = data
        },
        SET_ADD_CAT_RESULT(state, data){
            state.result = data

        },
        SET_CAT_DELETE_RESPONSE(state, data){
            state.delResp = data

        },
    },
    actions: {
        async GET_ALL_CATEGORY({ commit, state }, query) {
            try{
                const auth = JSON.parse(localStorage.getItem('user'))
            // console.log(auth)
            const options = {
                method: 'get',
                url: `${process.env.VUE_APP_BASE_URL}category/list_of_category`,
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }


            }
            if(query){
                options.params = query 
            }
            const data = await axios(options)

            commit('SET_CATEGORY_LIST', data.data.data)
            }catch(err){
                console.log(err)
                if(err.response.data.message == 'Unauthorized'){
                    return router.push({ name: 'signIn' })
                }
            }
            
            // console.log(state.categoryList)
        },
        async ADD_CATEGORY({ commit, state }, payload){
            const auth =  JSON.parse(localStorage.getItem('user'));
            // console.log(payload)
            const data = new FormData()
            data.append("categoryName", payload.name);
            data.append("categoryImage", payload.image[0]);
            await axios({
                method: 'post',
                url: `${process.env.VUE_APP_BASE_URL}category/add_category`,
                data: data,
                headers:{
                    Authorization: 'Bearer ' + auth.access_token
                }
            }).then((result)=>{
                console.log(result)
                commit('SET_ADD_CAT_RESULT', result.data)
            }).catch(err => {
                console.log(err)
            })
            // console.log(payload)


        },
        async UPDATE_CATEGORY( { commit }, payload){
            const auth =  JSON.parse(localStorage.getItem('user'));
            // console.log(payload)
            const data = new FormData()
            data.append("categoryName", payload.item.name);
            data.append("categoryImage", payload.item.image[0]);
           const update =  await axios({
                method: 'post',
                url: `${process.env.VUE_APP_BASE_URL}category/update_category/${ payload.id }`,
                data: data,
                headers:{
                    Authorization: 'Bearer ' + auth.access_token
                }
            })
           
        },
        async DELETE_CATEGORY({ commit }, payload){
            const auth =  JSON.parse(localStorage.getItem('user'));
            const delet = await axios({
                method: 'get',
                url: `${process.env.VUE_APP_BASE_URL}category/delete_category/${ payload.id }`,
                headers:{
                    Authorization: 'Bearer ' + auth.access_token
                }
            })
            commit('SET_CAT_DELETE_RESPONSE', delet.data)
            console.log(delet)
        }
    },
    getters: {

    }

}