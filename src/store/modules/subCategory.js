import axios from 'axios'
export default {
    namespaced: true,
    state: {
        subCategoryListAll: {},
        subCategoryList: {},
        subcatList:{}
    },
    mutations: {
        SET_SUBCAT_ALL(state, data) {
            state.subCategoryListAll = data
        },
        SET_SUBCAT(state, data) {
            state.subCategoryList = data
        },
        SET_ALL_SUB_CATEGORY(state, data){
            state.subcatList = data
        }
    },
    actions: {
        async GET_SUB_CATEGORY({ commit, state }, payload) {
            const auth = JSON.parse(localStorage.getItem('user'));
            const options = {
                method: 'get',
                url: `${process.env.VUE_APP_BASE_URL}category/subcategory_with_category/${payload.cat_name}`,
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }

            }
            const data = await axios(options)
            // console.log(data)
            commit('SET_SUBCAT_ALL', data.data.data[0]);
            commit('SET_SUBCAT', data.data.data[0].subcategories);
            // console.log(state.subCategoryListAll)
            // console.log(state.subCategoryListAll)
            

        },
        async ADD_SUB_CATEGORY({ commit, state }, payload) {
            try {
                // console.log(payload)
                // console.log(state.subCategoryListAll.id)
                const auth = JSON.parse(localStorage.getItem('user'));
                // console.log(payload)
                const data = new FormData()
                data.append("subcategoryName", payload.name);
                data.append("subcategoryImage", payload.image[0]);
                data.append("categoryId", state.subCategoryListAll.id)
                const addSub = await axios({
                    method: 'post',
                    url: `${process.env.VUE_APP_BASE_URL}category/add_subcategory`,
                    data: data,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }

                })


            } catch (error) {
                console.log(error)
            }



        },
        async DELETE_SUBCATEGORY({ commit }, payload) {
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                const deleteSubCat = await axios({
                    method: 'get',
                    url: `${process.env.VUE_APP_BASE_URL}category/delete_subcategory/${payload.id}`,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }

                })
                // console.log(deleteSubCat)
            } catch (error) {
                console.log(error)
            }

        },
        async UPDATE_SUBCATEGORY({ commit }, payload) {
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                // console.log(payload)
                const data = new FormData()
                data.append("subcategoryName", payload.item.name);
                data.append("subcategoryImage", payload.item.image[0]);
                const update = await axios({
                    method: 'post',
                    url: `${process.env.VUE_APP_BASE_URL}category/update_subcategory/${payload.id}`,
                    data: data,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                })
            } catch (error) {
                console.log(error)
            }



        },
        async GET_ALL_SUBCATEGORY({ commit, state }){
            const auth = JSON.parse(localStorage.getItem('user'));
            await axios({
                method: 'get',
                url: `${process.env.VUE_APP_BASE_URL}category/list_of_subcategory`,
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }
            }).then((result)=>{
                commit('SET_ALL_SUB_CATEGORY', result.data.data)
                // console.log(state.subcatList);
            }).catch(err=>{
                console.log(err);
            })
        }


    },
    getters: {
        get_all_sub_cat_with_cat_id: (state)=> (catId) =>{
            return state.subcatList.filter( (state) => state.categoryId === catId )
        }
    }

}