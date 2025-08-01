import axios from 'axios';

export default {
    namespaced: true,
    state: {
        MessageList: [],
        loading: false,
        error: null,
        ChatList: [],
    },
    mutations: {
        SET_MESSAGE_LIST(state, data) {
            if (data && Array.isArray(data.data)) {
                state.MessageList = data.data;
            } else if (Array.isArray(data)) {
                state.MessageList = data;
            } else {
                state.MessageList = [];
            }
        },
        SET_LOADING(state, status) {
            state.loading = status;
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
        SET_CHAT_MESSAGES_LIST(state, data) {
            state.ChatList = data;
        },
        ADD_MESSAGE(state, message) {
            if (Array.isArray(state.MessageList)) {
                state.MessageList.push(message);
            } else {
                state.MessageList = [message];
            }
        },
        UPDATE_MESSAGE_IN_LIST(state, updatedMessage) {
            if (Array.isArray(state.MessageList)) {
                const index = state.MessageList.findIndex(msg => msg.id === updatedMessage.id);
                if (index !== -1) {
                    state.MessageList.splice(index, 1, updatedMessage);
                }
            }
        },
        REMOVE_MESSAGE_FROM_LIST(state, messageId) {
            if (Array.isArray(state.MessageList)) {
                state.MessageList = state.MessageList.filter(msg => msg.id !== messageId);
            }
        },
        ADD_SINGLE_CHAT_MESSAGE(state, chatMessage) {
            if (Array.isArray(state.ChatList)) {
                state.ChatList.push(chatMessage);
            } else {
                state.ChatList = [chatMessage];
            }
        }
    },
    actions: {
        async GET_MESSAGE_LIST({ commit }, query = {}) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                if (!auth || !auth.access_token) {
                    throw new Error('No authentication token found');
                }

                const requestConfig = {
                    method: 'get',
                    url: `${process.env.VUE_APP_BASE_URL}message/list`,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    },
                    params: query
                };

                const response = await axios(requestConfig);

                if (response.data && response.data.response === 'success' && Array.isArray(response.data.data)) {
                    commit('SET_MESSAGE_LIST', response.data.data);
                    // console.log(response);

                    return response.data;
                } else {
                    commit('SET_MESSAGE_LIST', []);
                    throw new Error(response.data.message || 'Failed to fetch messages or no data found');
                }
            } catch (error) {
                console.error('Error in GET_MESSAGE_LIST:', error);
                commit('SET_ERROR', error.message || 'Failed to fetch messages');
                commit('SET_MESSAGE_LIST', []);
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },

        // async ADD_CEOMESSAGE({ commit }, payload) {
        //     commit('SET_LOADING', true);
        //     commit('SET_ERROR', null);
        //     try {
        //         const auth = JSON.parse(localStorage.getItem('user'));
        //         if (!auth || !auth.access_token) {
        //             throw new Error('No authentication token found');
        //         }

        //         const response = await axios({
        //             method: 'post',
        //             url: `${process.env.VUE_APP_BASE_URL}message/create`,
        //             data: {
        //                 subject: payload.subject,
        //                 serviceRequestId: payload.serviceRequestId,
        //                 messages: payload.messages,
        //                 comment: payload.comment
        //             },
        //             headers: {
        //                 Authorization: 'Bearer ' + auth.access_token
        //             }
        //         });

        //         if (response.data && response.data.response === 'success') {
        //             if (response.data.data) {
        //                 commit('ADD_MESSAGE', response.data.data);
        //             }
        //             return response.data;
        //         } else {
        //             throw new Error(response.data.message || 'Failed to create CEO message');
        //         }
        //     } catch (error) {
        //         console.error('Error in ADD_CEOMESSAGE:', error);
        //         commit('SET_ERROR', error.message || 'Failed to add message');
        //         throw error;
        //     } finally {
        //         commit('SET_LOADING', false);
        //     }
        // },
        async ADD_CEOMESSAGE({ commit }, payload) {
            // console.log(payload);
            try {

                const auth = JSON.parse(localStorage.getItem('user'));
                const addCity = await axios({
                    method: 'post',
                    url: `${process.env.VUE_APP_BASE_URL}message/create`,
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
        async UPDATE_MESSAGE({ commit }, payload) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                if (!auth || !auth.access_token) {
                    throw new Error('No authentication token found');
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
                });

                if (response.data && response.data.response === 'success') {
                    if (response.data.data) {
                        commit('UPDATE_MESSAGE_IN_LIST', response.data.data);
                    }
                    return response.data;
                } else {
                    throw new Error(response.data.message || 'Failed to update message');
                }
            } catch (error) {
                console.error('Error in UPDATE_MESSAGE:', error);
                commit('SET_ERROR', error.message || 'Failed to update message');
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },

        async DELETE_MESSAGE({ commit }, messageId) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                if (!auth || !auth.access_token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios({
                    method: 'delete',
                    url: `${process.env.VUE_APP_BASE_URL}message/delete/${messageId}`,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                });

                if (response.data && response.data.response === 'success') {
                    commit('REMOVE_MESSAGE_FROM_LIST', messageId);
                    return response.data;
                } else {
                    throw new Error(response.data.message || 'Failed to delete message');
                }
            } catch (error) {
                console.error('Error in DELETE_MESSAGE:', error);
                commit('SET_ERROR', error.message || 'Failed to delete message');
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },

        async GET_MESSAGE_BY_ID({ commit }, messageId) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                if (!auth || !auth.access_token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios({
                    method: 'get',
                    url: `${process.env.VUE_APP_BASE_URL}message/${messageId}`,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                });

                if (response.data && response.data.response === 'success') {
                    return response.data.data;
                } else {
                    throw new Error(response.data.message || 'Failed to get message');
                }
            } catch (error) {
                console.error('Error in GET_MESSAGE_BY_ID:', error);
                commit('SET_ERROR', error.message || 'Failed to get message details');
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },

        async ADD_CHAT({ commit }, payload) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);

            try {
                const authString = localStorage.getItem('user');
                const auth = JSON.parse(authString);

                if (!auth || !auth.access_token) {
                    throw new Error('No authentication token found');
                }

                const userId = auth.id;
                console.log('User ID from auth.id (corrected):', userId);

                const requestData = {
                    message: payload.message,
                    messageId: payload.messageId,
                    ...(userId && { userId: userId })
                };
                console.log('Request data for ADD_CHAT:', requestData);

                const response = await axios({
                    method: 'post',
                    url: `${process.env.VUE_APP_BASE_URL}chat/create`,
                    data: requestData,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                });

                console.log('Full API response:', response.data);

                if (response.data && response.data.response === 'success') {
                    if (response.data.data) {
                        console.log('API response data for ADD_CHAT:', response.data.data);

                        // Check if userId is actually in the response
                        if (!response.data.data.userId) {
                            console.error('WARNING: userId not returned from API!');
                            console.error('Expected userId:', userId);
                            console.error('Actual response data:', response.data.data);
                        }

                        commit('ADD_SINGLE_CHAT_MESSAGE', {
                            message: response.data.data.message,
                            from: 'me',
                            userId: response.data.data.userId || userId // Fallback to local userId
                        });
                    }
                    return response.data;
                } else {
                    throw new Error(response.data.message || 'Failed to add chat message');
                }
            } catch (error) {
                console.error('Error in ADD_CHAT:', error);

                // Log additional error details
                if (error.response) {
                    console.error('Error response data:', error.response.data);
                    console.error('Error response status:', error.response.status);
                }

                commit('SET_ERROR', error.message || 'Failed to add chat message');
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },

        async GET_CHAT_MESSAGES({ commit }, payload) {
            console.log("ACTION: GET_CHAT_MESSAGES - Payload received:", payload);
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                console.log("ACTION: GET_CHAT_MESSAGES - Auth data from localStorage:", auth);

                if (!auth || !auth.access_token) {
                    console.error("ACTION: GET_CHAT_MESSAGES - No authentication token found.");
                    throw new Error('No authentication token found');
                }

                const { messageId } = payload;
                const currentUserId = auth.id; // Ensure auth.id exists and is correct
                console.log("ACTION: GET_CHAT_MESSAGES - Current User ID:", currentUserId);
                console.log("ACTION: GET_CHAT_MESSAGES - Fetching chats for messageId:", messageId);


                const response = await axios({
                    method: 'get',
                    url: `${process.env.VUE_APP_BASE_URL}chat/list`,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    },
                    params: {
                        messageId: messageId
                    }
                });

                console.log("ACTION: GET_CHAT_MESSAGES - Raw API Response:", response);
                console.log("ACTION: GET_CHAT_MESSAGES - API Response Data:", response.data);

                if (response.data && response.data.response === 'success' && Array.isArray(response.data.data)) {
                    console.log("ACTION: GET_CHAT_MESSAGES - API data.data array:", response.data.data);

                    const processedChatMessages = response.data.data.map(chat => {
                        console.log("ACTION: GET_CHAT_MESSAGES - Processing individual chat object:", chat);
                        return {
                            id: chat.id,                   // Keep the original ID
                            message: chat.message,
                            messageId: chat.messageId,     // Keep the messageId
                            senderId: chat.userId,         // IMPORTANT: Map your 'userId' from DB to 'senderId' for component
                            createdAt: chat.createdAt,     // Keep createdAt
                            updatedAt: chat.updatedAt,     // Keep updatedAt
                            // You can still add 'from' here if you need it, but the component handles 'isCurrentUser' based on senderId
                            // from: chat.userId === currentUserId ? 'me' : 'them'
                        };
                    });

                    console.log("ACTION: GET_CHAT_MESSAGES - Processed Chat Messages before commit:", processedChatMessages);
                    commit('SET_CHAT_MESSAGES_LIST', processedChatMessages);
                    return response.data;
                } else {
                    console.warn("ACTION: GET_CHAT_MESSAGES - API response was not successful or data.data is not an array:", response.data);
                    commit('SET_CHAT_MESSAGES_LIST', []);
                    throw new Error(response.data.message || 'Failed to fetch chat messages or no data found');
                }
            } catch (error) {
                console.error('ACTION: GET_CHAT_MESSAGES - Error fetching chat messages:', error);
                commit('SET_ERROR', error.message || 'Failed to fetch chat messages');
                commit('SET_CHAT_MESSAGES_LIST', []);
                throw error; // Re-throw to propagate the error if needed by the component
            } finally {
                console.log("ACTION: GET_CHAT_MESSAGES - Setting loading to false.");
                commit('SET_LOADING', false);
            }
        },
    },
    getters: {
        getAllMessages: state => state.MessageList,
        getMessageById: state => id => {
            if (Array.isArray(state.MessageList)) {
                return state.MessageList.find(message => message.id === id);
            }
            return null;
        },
        isLoading: state => state.loading,
        hasError: state => !!state.error,
        getError: state => state.error,
        getChatList: state => state.ChatList
    }
};