import axios from 'axios'

// Helper function to clean URL and remove duplicate slashes
const cleanUrl = (url) => {
    return url.replace(/\/+/g, '/').replace(/:\//, '://')
}

export default {
    namespaced: true,
    state: {
        adminList: {},
        adminTotalPages: '',
        RoleList: {},
        UserList: {},
    },
    mutations: {
        SET_ADMIN_LIST(state, data) {
            state.adminList = data
        },
        SET_ADMIN_TOTAL_PAGES(state, data) {
            state.adminTotalPages = data
        },
        SET_ROLES_LIST(state, data) {
            state.RoleList = data
        },
        SET_USER_LIST(state, data) {
            state.UserList = data
        }
    },
    actions: {
        async GET_ADMIN_LIST({ commit }, query) {
            const auth = JSON.parse(localStorage.getItem('user'))
            const options = {
                method: 'get',
                url: cleanUrl(`${process.env.VUE_APP_BASE_URL}/users/all_users/1`),
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }
            }
            if (query) {
                options.params = query
            }
            const data = await axios(options)
            commit('SET_ADMIN_TOTAL_PAGES', data.data.totalPages)
            commit('SET_ADMIN_LIST', data.data.data)
        },
        async GET_ROLES_LIST({ commit }, query) {
            const auth = JSON.parse(localStorage.getItem('user'))
            const options = {
                method: 'get',
                url: cleanUrl(`${process.env.VUE_APP_BASE_URL}/Role/AllRoles`),
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }
            }
            if (query) {
                options.params = query
            }
            const data = await axios(options)
            commit('SET_ROLES_LIST', data.data.data)
        },
        async GET_USERS_LIST({ commit }, query) {
            const auth = JSON.parse(localStorage.getItem('user'))
            const options = {
                method: 'get',
                url: cleanUrl(`${process.env.VUE_APP_BASE_URL}/users`),
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                }
            }
            if (query) {
                options.params = query
            }
            const data = await axios(options)
            commit('SET_USER_LIST', data.data.data)
        },
        async ADD_ADMIN({ commit }, payload) {
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
            console.log('ADD_ADMIN Payload:', payload)

            try {
                payload.role = 1 // Set role to admin
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
                console.log('ADD_ADMIN Response:', response.data)

                if (response.data.response === 'success') {
                    return response.data
                } else {
                    throw new Error(response.data.message || 'Failed to add admin')
                }
            } catch (error) {
                // Log error for debugging
                console.error('ADD_ADMIN Error:', error.response?.data, error.message)
                
                const status = error.response?.status
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred while adding admin'
                throw new Error(errorMessage)
            }
        },
        async UPDATE_ADMIN({ commit }, payload) {
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
                    throw new Error(response.data.message || 'Failed to update admin')
                }
            } catch (error) {
                console.error('UPDATE_ADMIN Error:', error.response?.data, error.message)
                throw new Error(error.response?.data?.message || 'An error occurred while updating admin')
            }
        },
        async DELETE_ADMIN({ commit }, userId) {
            // Validate userId
            if (!userId) {
                throw new Error('User ID is required to delete an admin')
            }

            // Log userId for debugging
            console.log('DELETE_ADMIN User ID:', userId)

            try {
                const auth = JSON.parse(localStorage.getItem('user'))
                const response = await axios({
                    method: 'get',
                    url: cleanUrl(`${process.env.VUE_APP_BASE_URL}/users/delete_user/${userId}`),
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                })

                // Log response for debugging
                console.log('DELETE_ADMIN Response:', response.data)

                if (response.data.response === 'success') {
                    return response.data
                } else {
                    throw new Error(response.data.message || 'Failed to delete admin')
                }
            } catch (error) {
                // Log error for debugging
                console.error('DELETE_ADMIN Error:', error.response?.data, error.message)
                
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred while deleting admin'
                throw new Error(errorMessage)
            }
        }
    },
    getters: {}
}