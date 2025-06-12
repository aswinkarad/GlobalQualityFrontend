import axios from 'axios'

// Helper function to clean URL and remove duplicate slashes
const cleanUrl = (url) => {
    return url.replace(/\/+/g, '/').replace(/:\//, '://')
}

export default {
    namespaced: true,
    state: {
        subAdminList: {},
        editUserValue: {},
        subAdminTotalPage: ''
    },
    mutations: {
        SET_SUBADMIN_LIST(state, data) {
            state.subAdminList = data
        },
        SET_EDIT_USER_VALUE(state, data) {
            state.editUserValue = data
        },
        SET_SUBADMIN_TOTAL_PAGE(state, data) {
            state.subAdminTotalPage = data
        },
    },
    actions: {
        async GET_SABADMIN_LIST({ commit }, query) {
            const auth = JSON.parse(localStorage.getItem('user'))
            const options = {
                method: 'get',
                url: cleanUrl(`${process.env.VUE_APP_BASE_URL}/users/all_users/2`),
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }
            }
            if (query) {
                options.params = query
            }
            const data = await axios(options)
            commit('SET_SUBADMIN_LIST', data.data.data)
            commit('SET_SUBADMIN_TOTAL_PAGE', data.data.totalPages)
        },
        async ADD_SUBADMIN({ commit }, payload) {
            // Validate payload
            if (!payload.username || !payload.email || !payload.password || !payload.mobile) {
                throw new Error('Missing required fields: username, email, password, and mobile are required')
            }
            if (!/\S+@\S+\.\S+/.test(payload.email)) {
                throw new Error('Invalid email format')
            }
            if (payload.password.length < 6) {
                throw new Error('Password must be at least 6 characters long')
            }

            // Log payload for debugging
            console.log('ADD_SUBADMIN Payload:', payload)

            try {
                payload.role = 2 // Set role to sub-admin
                const auth = JSON.parse(localStorage.getItem('user'))
                const response = await axios({
                    method: 'post',
                    url: cleanUrl(`${process.env.VUE_APP_BASE_URL}/auth/sign_up`),
                    data: payload,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                })

                // Log response for debugging
                console.log('ADD_SUBADMIN Response:', response.data)

                if (response.data.response === 'success') {
                    return response.data
                } else {
                    throw new Error(response.data.message || 'Failed to add sub-admin')
                }
            } catch (error) {
                // Log error for debugging
                console.error('ADD_SUBADMIN Error:', error.response?.data, error.message)
                
                const status = error.response?.status
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred while adding sub-admin'
                throw new Error(errorMessage)
            }
        },
        async DELETE_SUBADMIN({ commit }, payload) {
            try {
                const auth = JSON.parse(localStorage.getItem('user'))
                await axios({
                    method: 'get',
                    url: cleanUrl(`${process.env.VUE_APP_BASE_URL}/users/delete_user/${payload.id}`),
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                })
            } catch (error) {
                throw new Error(error.response?.data?.message || 'Failed to delete sub-admin')
            }
        },
        async GET_USER_WITH_ID({ commit }, payload) {
            try {
                const auth = JSON.parse(localStorage.getItem('user'))
                const userWithId = await axios({
                    method: 'get',
                    url: cleanUrl(`${process.env.VUE_APP_BASE_URL}/users/get_user/${payload.id}`),
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                })
                const userData = userWithId.data.rows && userWithId.data.rows.length > 0 
                    ? userWithId.data.rows[0] 
                    : userWithId.data
                if (!userData.id) throw new Error('No valid user data found in response')
                commit('SET_EDIT_USER_VALUE', userData)
                return userData
            } catch (error) {
                throw new Error(error.response?.data?.message || 'Failed to fetch user data')
            }
        },
        async UPDATE_SUBADMIN({ commit }, payload) {
            try {
                const auth = JSON.parse(localStorage.getItem('user'))
                const response = await axios({
                    method: 'post',
                    url: cleanUrl(`${process.env.VUE_APP_BASE_URL}/users/update_users`),
                    data: payload,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                })
                if (response.data.response === 'success') {
                    return response.data
                } else {
                    throw new Error(response.data.message || 'Failed to update sub-admin')
                }
            } catch (error) {
                throw new Error(error.response?.data?.message || 'An error occurred while updating sub-admin')
            }
        }
    },
    getters: {}
}