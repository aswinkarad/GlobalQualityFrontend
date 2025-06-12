import axios from 'axios'
export default {
    namespaced: true,
    state: {
        serviceList: [],
        serviceReportList: {},
        editServicetValue: {},
        serviceTotalPages: ''
    },
    mutations: {
        SET_SERVICE_LIST(state, data) {
            state.serviceList = data
        },
        SET_SERVICE_REPORT_LIST(state, data) {
            state.serviceReportList = data
        },
        REMOVE_ALL_SERVICE_LIST(state) {
            state.serviceList = {}
        },
        SET_EDIT_SERVICE_VALUE(state, data) {
            state.editServicetValue = data
        },
        SET_SERVIEC_TOTAL_PAGES(state, data) {
            state.serviceTotalPages = data
        }
    },
    actions: {
        // async GET_SERVICE_LIST({ commit, state }, query) {
        //     const auth = JSON.parse(localStorage.getItem('user'))
        //     // console.log(auth)
        //     const options = {
        //         method: 'get',
        //         url: `${process.env.VUE_APP_BASE_URL}service/list_of_servicereq`,
                
        //         headers: {
        //             Authorization: 'Bearer ' + auth.access_token
        //         }
        //     }
        //     if (query) {
        //         options.params = query
        //     }
        //     const data = await axios(options);
        //     commit('SET_SERVICE_LIST', data.data.data);
        //     commit('SET_SERVIEC_TOTAL_PAGES', data.data.totalPages);
        //     console.log(data.data)
        // },
        async GET_SERVICE_LIST({ commit, state }, query) {
            const auth = JSON.parse(localStorage.getItem('user'));
            
            // console.log("Query Params:", query);
        
            const options = {
                method: 'get',
                url: `${process.env.VUE_APP_BASE_URL}service/list_of_servicereq`,
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                },
                params: query || {}  // Ensure params are properly passed
            };
        
            try {
                const response = await axios(options);
                console.log("API Response:", response.data);
        
                commit('SET_SERVICE_LIST', response.data.data);
                commit('SET_SERVIEC_TOTAL_PAGES', response.data.totalPages);
            } catch (error) {
                console.error("API Error:", error);
            }
        },
        
        async GET_SERVICE_REPORT_LIST({ commit, state }, query) {
            const auth = JSON.parse(localStorage.getItem('user'))
            // console.log(auth)
            const options = {
                method: 'get',
                url: `${process.env.VUE_APP_BASE_URL}service/list_of_servicereq`,
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }
            }
            if (query) {
                options.params = query
            }
            const data = await axios(options);
            commit('SET_SERVICE_REPORT_LIST', data.data.data);

            console.log(data)
        },
        async ADD_SERVICE({ commit }, payload) {
            // console.log(payload);
            try {
                console.log(payload)
                const auth = JSON.parse(localStorage.getItem('user'));
                console.log(payload)
                const addService = await axios({
                    method: 'post',
                    url: `${process.env.VUE_APP_BASE_URL}service/add_servicereq`,
                    data: payload,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }

                })
                console.log(addService);

            } catch (error) {
                console.log(error);
            }


        },
        async CHENGE_SERVICE_STATUS({ commit }, payload) {
            // console.log(payload)
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                const data = new FormData()
                data.append("workingStatusId", payload.workingStatusId);
                data.append("saleId", payload.saleId);
                const changeStatus = await axios({
                    method: 'post',
                    url: `${process.env.VUE_APP_BASE_URL}service/update_servicereq/${payload.id}`,
                    data: data,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                })
                // console.log(changeStatus)
            } catch (error) {
                console.log(error)
            }
        },
        async DELETE_SERVICE_REQUEST({ commit }, payload) {
            // console.log(payload)
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                const deleteServiceRequest = await axios({
                    method: 'get',
                    url: `${process.env.VUE_APP_BASE_URL}service/delete_servicereq/${payload.id}`,

                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }

                })
                // console.log(deleteServiceRequest)

            } catch (error) {
                console.log(error)
            }
        },
        async GET_SERVICE_WITH_ID({ commit, state }, payload) {
            // console.log(payload)
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                const service = await axios({
                    method: 'get',
                    url: `${process.env.VUE_APP_BASE_URL}service/list_of_servicereq`,
                    params: {
                        id: payload.id
                    },
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }

                })
                commit('SET_EDIT_SERVICE_VALUE', service.data.data[0]);
                // console.log(state.editServicetValue)

            } catch (error) {
                console.log(error)
            }
        },
        async UPDATE_SERVICE({ commit }, payload) {
            try {
                const auth = JSON.parse(localStorage.getItem('user'));

                // console.log(payload)
                const data = new FormData()
                data.append("saleId", payload.saleId);
                data.append("description", payload.description);
                data.append("staffId", payload.staffId);
                data.append("callHandleId", payload.callHandleId);
                // data.append("statusId", payload.statusId);
                data.append("workingConditionId", payload.workingConditionId);
                data.append("priorityId", payload.priorityId);
                // data.append("callRegisterDate", payload.callRegisterDate);
                data.append("document1", payload.doc1[0]);
                data.append("document2", payload.doc2[0]);
                data.append("document3", payload.doc3[0]);


                const update = await axios({
                    method: 'post',
                    url: `${process.env.VUE_APP_BASE_URL}service/update_servicereq/${payload.id}`,
                    data: data,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }

                })
                // console.log(update)

            } catch (error) {
                console.log(error)
            }
        }
    },
    getters: {
        getClientById: (state) => (id) => {
            return state.clientList.find(list => list.id === id)
        }

    }

}