import axios from 'axios'

export default {
    namespaced: true,
    state: {
        MessageList: {},
        loading: false,
        error: null,
        ChatList: {},
    },
    mutations: {
        SET_MESSAGE_LIST(state, data) {
            state.MessageList = data
        },
        SET_LOADING(state, status) {
            state.loading = status
        },
        SET_ERROR(state, error) {
            state.error = error
        },
        SET_CHAT_MESSAGES_LIST( state, data){
            state.ChatList = data
        },
        ADD_MESSAGE(state, message) {
            if (Array.isArray(state.MessageList)) {
                state.MessageList.push(message)
            } else {
                state.MessageList = [message]
            }
        },
        UPDATE_MESSAGE_IN_LIST(state, updatedMessage) {
            if (Array.isArray(state.MessageList)) {
                const index = state.MessageList.findIndex(msg => msg.id === updatedMessage.id)
                if (index !== -1) {
                    state.MessageList.splice(index, 1, updatedMessage)
                }
            }
        },
        REMOVE_MESSAGE_FROM_LIST(state, messageId) {
            if (Array.isArray(state.MessageList)) {
                state.MessageList = state.MessageList.filter(msg => msg.id !== messageId)
            }
        }
    },
    actions: {
        async GET_MESSAGE_LIST({ commit }) {
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)
            try {
                // Step 1: Retrieve authentication data from localStorage
                console.log('Step 1: Retrieving auth from localStorage')
                const auth = JSON.parse(localStorage.getItem('user'))
                console.log('Auth data:', auth)
                if (!auth || !auth.access_token) {
                    console.log('Step 1 Error: No auth or access_token found')
                    throw new Error('No authentication token found')
                }
          
                // Step 2: Construct the API request
                console.log('Step 2: Preparing Axios request')
                const requestConfig = {
                    method: 'get',
                    url: `${process.env.VUE_APP_BASE_URL}message/list`,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                }
                console.log('Request config:', requestConfig)
          
                // Step 3: Send the request to the server
                console.log('Step 3: Sending GET request to', requestConfig.url)
                const response = await axios(requestConfig)
                console.log('Step 3 Response:', response)
                console.log('Response data:', response.data)
          
                // Step 4: Extract and commit the data
                console.log('Step 4: Extracting data from response')
                const messageData = response.data.data
                console.log('Message data to commit:', messageData)
                if (!messageData) {
                    console.log('Step 4 Warning: No "data" field in response.data')
                }
          
                // Step 5: Commit the data to the Vuex store
                console.log('Step 5: Committing data to SET_MESSAGE_LIST')
                commit('SET_MESSAGE_LIST', messageData)
          
                // Step 6: Final confirmation
                console.log('Step 6: GET_MESSAGE_LIST completed successfully')
                return messageData
            } catch (error) {
                // Step 7: Error handling
                console.log('Step 7: Error occurred in GET_MESSAGE_LIST')
                console.log('Error details:', error)
                if (error.response) {
                    console.log('Server response error:', error.response.data)
                    console.log('Status code:', error.response.status)
                } else if (error.request) {
                    console.log('No response received:', error.request)
                } else {
                    console.log('Error setting up request:', error.message)
                }
                commit('SET_ERROR', error.message || 'Failed to fetch messages')
                throw error // Re-throw to allow calling code to handle it
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async ADD_CEOMESSAGE({ commit }, payload) {
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)
            try {
                const auth = JSON.parse(localStorage.getItem('user'))
                if (!auth || !auth.access_token) {
                    throw new Error('No authentication token found')
                }

                const response = await axios({
                    method: 'post',
                    url: `${process.env.VUE_APP_BASE_URL}message/create`,
                    data: {
                        subject: payload.subject,
                        serviceRequestId: payload.serviceRequestId,
                        messages: payload.message,
                        comment: payload.comment
                    },
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                })
        
                console.log('CEO Message Response:', response.data)
                
                // Check the response and handle accordingly
                if (response.data && response.data.response === 'success') {
                    // If the data includes the created message, add it to the state
                    if (response.data.data) {
                        commit('ADD_MESSAGE', response.data.data)
                    }
                    return response.data
                } else {
                    throw new Error(response.data.message || 'Failed to create CEO message')
                }
            } catch (error) {
                console.error('Error in ADD_CEOMESSAGE:', error)
                commit('SET_ERROR', error.message || 'Failed to add message')
                throw error // Re-throw to allow error handling in the component
            } finally {
                commit('SET_LOADING', false)
            }
        },
        
        async UPDATE_MESSAGE({ commit }, payload) {
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)
            try {
                const auth = JSON.parse(localStorage.getItem('user'))
                if (!auth || !auth.access_token) {
                    throw new Error('No authentication token found')
                }
                
                const response = await axios({
                    method: 'put',
                    url: `${process.env.VUE_APP_BASE_URL}message/update/${payload.id}`,
                    data: {
                        subject: payload.subject,
                        requested_type: payload.requested_type,
                        serviceRequestId: payload.serviceRequestId,
                        message: payload.message,
                        comment: payload.comment

                       
                    },
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                })
                
                console.log('Update Message Response:', response.data)
                
                if (response.data && response.data.response === 'success') {
                    // Update the message in the state if it's returned
                    if (response.data.data) {
                        commit('UPDATE_MESSAGE_IN_LIST', response.data.data)
                    }
                    return response.data
                } else {
                    throw new Error(response.data.message || 'Failed to update message')
                }
            } catch (error) {
                console.error('Error in UPDATE_MESSAGE:', error)
                commit('SET_ERROR', error.message || 'Failed to update message')
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },
        
        async DELETE_MESSAGE({ commit }, messageId) {
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)
            try {
                const auth = JSON.parse(localStorage.getItem('user'))
                if (!auth || !auth.access_token) {
                    throw new Error('No authentication token found')
                }
                
                const response = await axios({
                    method: 'delete',
                    url: `${process.env.VUE_APP_BASE_URL}message/delete/${messageId}`,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                })
                
                console.log('Delete Message Response:', response.data)
                
                if (response.data && response.data.response === 'success') {
                    // Remove the message from the state
                    commit('REMOVE_MESSAGE_FROM_LIST', messageId)
                    return response.data
                } else {
                    throw new Error(response.data.message || 'Failed to delete message')
                }
            } catch (error) {
                console.error('Error in DELETE_MESSAGE:', error)
                commit('SET_ERROR', error.message || 'Failed to delete message')
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        // Get a specific message by ID
        async GET_MESSAGE_BY_ID({ commit }, messageId) {
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)
            try {
                const auth = JSON.parse(localStorage.getItem('user'))
                if (!auth || !auth.access_token) {
                    throw new Error('No authentication token found')
                }
                
                const response = await axios({
                    method: 'get',
                    url: `${process.env.VUE_APP_BASE_URL}message/${messageId}`,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                })
                
                console.log('Get Message By ID Response:', response.data)
                
                if (response.data && response.data.response === 'success') {
                    return response.data.data
                } else {
                    throw new Error(response.data.message || 'Failed to get message')
                }
            } catch (error) {
                console.error('Error in GET_MESSAGE_BY_ID:', error)
                commit('SET_ERROR', error.message || 'Failed to get message details')
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },
        async ADD_CHAT({ commit }, payload){
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                const addCity = await axios({
                    method:'post',
                    url :`${process.env.VUE_APP_BASE_URL}chat/create`,
                    data: payload,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
    
                })
                console.log(addCity);

            } catch (error) {
                console.log(error);
            }
        }, 
        // async GET_CHAT_MESSAGES({ commit, state }) {
        //     const auth = JSON.parse(localStorage.getItem('user'))
        //     // console.log(auth)
        //     const data = await axios({
        //         method: 'get',
        //         url: `${process.env.VUE_APP_BASE_URL}chat/list`,
        //         headers: {
        //             Authorization: 'Bearer ' + auth.access_token
        //         }
        //     })

        //      commit('SET_CHAT_MESSAGES_LIST', data.data.data)
        //      console.log(data)
        //     //  console.log(state.statusList)
        // },
        async GET_CHAT_MESSAGES({ commit, state }, payload) {
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                // Add loading state if needed
                commit('SET_LOADING', true);
                
                // Use the messageId parameter passed from the component
                const { messageId } = payload;
                
                const response = await axios({
                    method: 'get',
                    url: `${process.env.VUE_APP_BASE_URL}chat/list`,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    },
                    params: {
                        messageId: messageId // Pass the messageId as a query parameter
                    }
                });
                
                // Process the data and commit to store
                commit('SET_CHAT_MESSAGES_LIST', response.data.rows || []);
                commit('SET_LOADING', false);
                console.log(response.data);
                
                return response.data;
            } catch (error) {
                commit('SET_LOADING', false);
                commit('SET_ERROR', error.message || 'Failed to fetch chat messages');
                console.error('Error fetching chat messages:', error);
                throw error;
            }
        },
    },
    getters: {
        getAllMessages: state => state.MessageList,
        getMessageById: state => id => {
            if (Array.isArray(state.MessageList)) {
                return state.MessageList.find(message => message.id === id)
            }
            return null
        },
        isLoading: state => state.loading,
        hasError: state => !!state.error,
        getError: state => state.error
    }
}