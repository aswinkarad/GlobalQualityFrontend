import axios from 'axios'
export default {
    namespaced: true,
    state: {
        equipmentListAll: {},
        editValue:{},
        allEquipments:{},
        statusList: {},
        equipmentTotalPage: ''
    },
    mutations: {
        SET_EQUIPMENTS_ALL(state, data) {
            state.equipmentListAll = data
        },
        SET_EDIT_EQUIPMET_VALUE(state, data) {
            state.editValue = data
        },
        SET_ALL_EQUIPMENTS(state, data){
            state.allEquipments = data
        },
        SET_EQUIPMETS_TOTAL_PAGE(state, data){
            state.equipmentTotalPage = data
        },
        SET_STATUS_LIST( state, data){
            state.statusList = data
        }
    },
    actions: {
        async GET_EQUIPMENT({ commit, state }, payload) {
            // console.log(payload)
            const auth = JSON.parse(localStorage.getItem('user'));
            const options = {
                method: 'get',
                url: `${process.env.VUE_APP_BASE_URL}equipment/equipment_by_subcategory`,
                params:{
                    cat: payload.cat_name,
                    sub: payload.sub_name,
                    
                },
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }

            }
            if(payload.query){
                options.params.cat = payload.params.cat_name
                options.params.sub = payload.params.sub_name
                options.params.page = payload.query.page;
                options.params.size = payload.query.size;
                // console.log(options.params)
            }

            const data = await axios(options)

            
            commit('SET_EQUIPMENTS_ALL', data.data.data);
            commit('SET_EQUIPMETS_TOTAL_PAGE', data.data.totalPages)
            // console.log(data)
            // commit('SET_EQUIPMENT', data.data.data.sub_categories);
            // console.log(state.subCategoryList)

        },
        async ADD_EQUIPMENT({ commit }, payload){
            // console.log(payload);
            try {
                
                const auth = JSON.parse(localStorage.getItem('user'));
                // console.log(payload)
                const data = new FormData()
                data.append("equipmentName", payload.name);
                data.append("equipmentImage", payload.image[0]);
                data.append("subcategoryId", payload.id);
                data.append("model", payload.model);
                data.append("warrantyStatusId", payload.warrantyStatus);
                const addEquipment = await axios({
                    method: 'post',
                    url: `${process.env.VUE_APP_BASE_URL}/equipment/add_equipment`,
                    data: data,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }

                })
            //   console.log(addEquipment);

            } catch (error) {
                console.log(error);
            }
            

        },
        async DELETE_EQUIPMENT({ commit }, payload){
            // console.log(payload)
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                const deleteEquipment = await axios({
                    method:'get',
                    url :`${process.env.VUE_APP_BASE_URL}equipment/delete_equipment/${ payload.id }`,
                
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
    
                })
                // console.log(deleteEquipment)

            } catch (error) {
                console.log(error)
            }
        } ,
        async GET_EQUIPMENT_BY_ID({ commit, state }, payload){
            // console.log(payload)
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                const equipmentWithId = await axios({
                    method:'get',
                    url :`${process.env.VUE_APP_BASE_URL}equipment/equipment_by_id/${ payload.id }`,
                
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
    
                })
                commit('SET_EDIT_EQUIPMET_VALUE', equipmentWithId.data)
                //  console.log(equipmentWithId)

            } catch (error) {
                console.log(error)
            }
        } ,
        async UPDATE_EQUIPMENT({ commit }, payload){
            try{
                // console.log(payload)
                const auth = JSON.parse(localStorage.getItem('user'));
                const data = new FormData()
                data.append("equipmentName", payload.name);
                data.append("equipmentImage", payload.image[0]);
                data.append("model", payload.model);
                data.append("warrantyStatusId", payload.warrantyStatusId);
                const update = await axios({
                    method:'post',
                    url :`${process.env.VUE_APP_BASE_URL}equipment/update_equipment/ ${ payload.id }`,
                    data: data,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
    
                })
                // console.log(update)

            }catch(error){
                console.log(error)
            }
        },
        async GET_ALL_EQUIPMENT({ commit, state }){
            const auth = JSON.parse(localStorage.getItem('user'));
            const options = {
                method: 'get',
                url: `${process.env.VUE_APP_BASE_URL}equipment/all_equipments`,
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                },
                params:{
                    size: 1000
                }

            }
            // if(query){
            //     options.params = query
            // }
            await axios(options).then((res)=>{
                commit('SET_ALL_EQUIPMENTS', res.data.data)
                console.log(state.allEquipments)
                // console.log(options)
            }).catch(err=>{
                console.log(err);
            })
        },
        async GET_STATUS_LIST({ commit, state }) {
            const auth = JSON.parse(localStorage.getItem('user'))
            // console.log(auth)
            const data = await axios({
                method: 'get',
                url: `${process.env.VUE_APP_BASE_URL}equipment/list_of_warrantystatus`,
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }
            })

             commit('SET_STATUS_LIST', data.data)
            //  console.log(data)
            //  console.log(state.statusList)
        },
    },
    getters: {
        get_all_equipment_with_sub_catId: (state)=> (scatId) =>{
            return state.allEquipments.filter( (state) => state.subcategoryId === scatId )
        }
        
    }

}