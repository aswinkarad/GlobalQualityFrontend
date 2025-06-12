import axios from 'axios'

// Helper function to clean URL and remove duplicate slashes
const cleanUrl = (url) => {
    return url.replace(/\/+/g, '/').replace(/:\//, '://')
}

export default {
    namespaced: true,
    state: {
        techList: {},
        editTechValue: {},
        techListTotalPage: ''
    },
    mutations: {
        SET_TECH_LIST(state, data) {
            state.techList = data
        },
        SET_EDIT_TECH_VALUE(state, data) {
            state.editTechValue = data
        },
        SET_TECH_TOTAL_PAGE(state, data) {
            state.techListTotalPage = data
        }
    },
    actions: {
        async GET_TECH_LIST({ commit }, query) {
            try {
                const auth = JSON.parse(localStorage.getItem('user'))
                const options = {
                    method: 'get',
                    url: cleanUrl(`${process.env.VUE_APP_BASE_URL}/users/all_users/3`),
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                }
                if (query) {
                    options.params = query
                }
                const response = await axios(options)
                commit('SET_TECH_LIST', response.data.data)
                commit('SET_TECH_TOTAL_PAGE', response.data.totalPages)
                return response.data
            } catch (error) {
                console.error('GET_TECH_LIST Error:', error.response?.data, error.message)
                throw new Error(error.response?.data?.message || 'Failed to fetch technician list')
            }
        },
        async ADD_TECH({ commit }, payload) {
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

            try {
                payload.role = 3 // Set role to technician
                const auth = JSON.parse(localStorage.getItem('user'))
                console.log('ADD_TECH Payload:', payload)
                const response = await axios({
                    method: 'post',
                    url: cleanUrl(`${process.env.VUE_APP_BASE_URL}/auth/sign_up`),
                    data: payload,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                })
                console.log('ADD_TECH Response:', response.data)
                if (response.data.response === 'success') {
                    return response.data
                } else {
                    throw new Error(response.data.message || 'Failed to add technician')
                }
            } catch (error) {
                console.error('ADD_TECH Error:', error.response?.data, error.message)
                throw new Error(error.response?.data?.message || 'An error occurred while adding technician')
            }
        },
        async DELETE_TECH({ commit }, userId) {
            // Validate userId
            if (!userId) {
                throw new Error('User ID is required to delete a technician')
            }

            try {
                console.log('DELETE_TECH User ID:', userId)
                const auth = JSON.parse(localStorage.getItem('user'))
                const response = await axios({
                    method: 'get',
                    url: cleanUrl(`${process.env.VUE_APP_BASE_URL}/users/delete_user/${userId}`),
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                })
                console.log('DELETE_TECH Response:', response.data)
                if (response.data.response === 'success') {
                    return response.data
                } else {
                    throw new Error(response.data.message || 'Failed to delete technician')
                }
            } catch (error) {
                console.error('DELETE_TECH Error:', error.response?.data, error.message)
                throw new Error(error.response?.data?.message || 'An error occurred while deleting technician')
            }
        },
        async DELETE_SUBADMIN({ commit }, payload) {
            // Validate payload
            if (!payload.id) {
                throw new Error('User ID is required to delete a subadmin')
            }

            try {
                console.log('DELETE_SUBADMIN User ID:', payload.id)
                const auth = JSON.parse(localStorage.getItem('user'))
                const response = await axios({
                    method: 'get',
                    url: cleanUrl(`${process.env.VUE_APP_BASE_URL}/users/delete_user/${payload.id}`),
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                })
                console.log('DELETE_SUBADMIN Response:', response.data)
                if (response.data.response === 'success') {
                    return response.data
                } else {
                    throw new Error(response.data.message || 'Failed to delete subadmin')
                }
            } catch (error) {
                console.error('DELETE_SUBADMIN Error:', error.response?.data, error.message)
                throw new Error(error.response?.data?.message || 'An error occurred while deleting subadmin')
            }
        },
        async GET_USER_WITH_ID({ commit }, payload) {
            // Validate payload
            if (!payload.id) {
                throw new Error('User ID is required to fetch user data')
            }

            try {
                console.log('GET_USER_WITH_ID User ID:', payload.id)
                const auth = JSON.parse(localStorage.getItem('user'))
                const response = await axios({
                    method: 'get',
                    url: cleanUrl(`${process.env.VUE_APP_BASE_URL}/users/get_user/${payload.id}`),
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                })
                commit('SET_EDIT_TECH_VALUE', response.data.data)
                console.log('GET_USER_WITH_ID Response:', response.data)
                return response.data
            } catch (error) {
                console.error('GET_USER_WITH_ID Error:', error.response?.data, error.message)
                throw new Error(error.response?.data?.message || 'An error occurred while fetching user data')
            }
        },
        async UPDATE_TECH({ commit }, payload) {
            // Validate payload
            if (!payload.id) {
                throw new Error('User ID is required to update technician')
            }

            try {
                console.log('UPDATE_TECH Payload:', payload)
                const auth = JSON.parse(localStorage.getItem('user'))
                const response = await axios({
                    method: 'post',
                    url: cleanUrl(`${process.env.VUE_APP_BASE_URL}/users/update_users`),
                    data: payload,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                })
                console.log('UPDATE_TECH Response:', response.data)
                if (response.data.response === 'success') {
                    return response.data
                } else {
                    throw new Error(response.data.message || 'Failed to update technician')
                }
            } catch (error) {
                console.error('UPDATE_TECH Error:', error.response?.data, error.message)
                throw new Error(error.response?.data?.message || 'An error occurred while updating technician')
            }
        },
        async GET_TECNICIAN_REPORT({ commit }, payload) {
            try {
                console.log('GET_TECNICIAN_REPORT Payload:', payload)
                const auth = JSON.parse(localStorage.getItem('user'))
                const response = await axios({
                    method: 'get',
                    url: cleanUrl(`${process.env.VUE_APP_BASE_URL}/users/list_of_service`),
                    params: payload,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                })
                console.log('GET_TECNICIAN_REPORT Response:', response.data)
                return response.data
            } catch (error) {
                console.error('GET_TECNICIAN_REPORT Error:', error.response?.data, error.message)
                throw new Error(error.response?.data?.message || 'An error occurred while fetching technician report')
            }
        }
    },
    getters: {}
}