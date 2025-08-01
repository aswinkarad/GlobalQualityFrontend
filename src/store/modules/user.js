// store/modules/user.module.js
import axios from 'axios';

export default {
    namespaced: true, // Ensures this module is namespaced within the Vuex store
    state: {
        userData: {}, // Stores currently logged-in user data
        allUsers: [], // Stores the list of all users fetched from the API
        usersPagination: {}, // Stores pagination details for the user list
        singleUser: null, // Stores data for a single user fetched by ID
        loading: false, // Indicates if an async operation (e.g., API call) is in progress
        error: null, // Stores any error messages from API calls
        UserLogs: [],
        totalPages: 1,
    },
    mutations: {
        /**
         * Sets the authenticated user data and stores it in localStorage.
         * @param {object} state - The current state of the module.
         * @param {object} user - The user object to set.
         */
        SET_USER(state, user) {
            // console.log('[User Module] Mutation: SET_USER called with user:', user);
            localStorage.setItem('user', JSON.stringify(user)); // Store user in local storage
            state.userData = user;
            // console.log('[User Module] State updated: userData =', state.userData);
        },
        /**
         * Sets the array of all users.
         * @param {object} state - The current state of the module.
         * @param {Array} users - The array of all user objects.
         */
        SET_ALL_USERS(state, users) {
            // console.log('[User Module] Mutation: SET_ALL_USERS called with users:', users);
            state.allUsers = users;
            // console.log('[User Module] State updated: allUsers =', state.allUsers);
        },
        /**
         * Sets the pagination information for the allUsers list.
         * @param {object} state - The current state of the module.
         * @param {object} pagination - Pagination object {totalItems, totalPages, currentPage}.
         */
        SET_USERS_PAGINATION(state, pagination) {
            // console.log('[User Module] Mutation: SET_USERS_PAGINATION called with pagination:', pagination);
            state.usersPagination = pagination;
            // console.log('[User Module] State updated: usersPagination =', state.usersPagination);
        },
        /**
         * Sets the data for a single fetched user.
         * @param {object} state - The current state of the module.
         * @param {object|null} user - The single user object or null.
         */
        SET_SINGLE_USER(state, user) {
            // console.log('[User Module] Mutation: SET_SINGLE_USER called with user:', user);
            state.singleUser = user;
            // console.log('[User Module] State updated: singleUser =', state.singleUser);
        },
        /**
         * Sets the loading status.
         * @param {object} state - The current state of the module.
         * @param {boolean} status - True if loading, false otherwise.
         */
        SET_LOADING(state, status) {
            // console.log('[User Module] Mutation: SET_LOADING called with status:', status);
            state.loading = status;
            // console.log('[User Module] State updated: loading =', state.loading);
        },
        /**
         * Sets an error message.
         * @param {object} state - The current state of the module.
         * @param {string|null} error - The error message or null.
         */
        SET_ERROR(state, error) {
            // console.log('[User Module] Mutation: SET_ERROR called with error:', error);
            state.error = error;
            // console.log('[User Module] State updated: error =', state.error);
        },
       SET_USER_LOGS(state, data) {
            state.UserLogs = Array.isArray(data) ? data : [];
        },
        SET_USER_TOTAL_PAGES(state, totalPages) {
            state.totalPages = totalPages || 1;
        }
    },
    actions: {
        /**
         * Handles user login.
         * @param {object} { commit, state } - Vuex context object.
         * @param {object} payload - Contains username and password.
         * @returns {Promise<object>} - Resolves with user data on success.
         */
        async USER_LOGIN({ commit, state }, payload) {
            // console.log('[User Module] Action: USER_LOGIN called with payload:', payload);
            commit('SET_LOADING', true);
            commit('SET_ERROR', null); // Clear previous errors
            try {
                const login = await axios({
                    method: 'post',
                    url: `${process.env.VUE_APP_BASE_URL}auth/sign_in`, // API endpoint for login
                    data: {
                        username: payload.username,
                        password: payload.password
                    }
                });

                // console.log('[User Module] USER_LOGIN: API response received:', login.data);
                commit('SET_USER', login.data); // Commit user data to state and localStorage
                commit('SET_LOADING', false);
                return login.data;
            } catch (error) {
                // console.error('[User Module] USER_LOGIN: Error during login:', error);
                const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
                commit('SET_ERROR', errorMessage);
                commit('SET_LOADING', false);
                throw error; // Re-throw for component to handle if needed
            }
        },


        async GET_USER_LIST({ commit }, { page = 1, size = 100 } = {}) {
            // console.log('[User Module] Action: GET_USER_LIST called with params - page:', page, 'size:', size);
            commit('SET_LOADING', true);
            commit('SET_ERROR', null); // Clear previous errors
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                if (!auth || !auth.access_token) {
                    throw new Error('Authentication token not found. Please log in.');
                }
                // console.log('[User Module] GET_USER_LIST: Authentication token retrieved.');

                const response = await axios({
                    method: 'get',
                    url: `${process.env.VUE_APP_BASE_URL}users`, // API endpoint for getting all users
                    params: {
                        page,
                        size
                    },
                    headers: {
                        'Authorization': `Bearer ${auth.access_token}` // Authorization header
                    }
                });

                // console.log('[User Module] GET_USER_LIST: API response received:', response.data);

                // Correctly access the 'data' array within the response for users
                if (response.data && Array.isArray(response.data.data)) {
                    commit('SET_ALL_USERS', response.data.data);
                } else {
                    // console.warn('[User Module] GET_USER_LIST: Response does not contain a "data" array or is not in expected format.', response.data);
                    commit('SET_ALL_USERS', []); // Set to empty array if format is unexpected
                }

                // Set pagination data if available
                if (response.data) {
                    commit('SET_USERS_PAGINATION', {
                        totalItems: response.data.totalCount,
                        totalPages: response.data.totalPages,
                        currentPage: response.data.currentPage
                    });
                } else {
                    console.warn('[User Module] GET_USER_LIST: Pagination data missing from response.', response.data);
                    commit('SET_USERS_PAGINATION', {}); // Set to empty object if missing
                }

                commit('SET_LOADING', false);
                // console.log('[User Module] GET_USER_LIST: Action completed successfully.');
                return response.data;
            } catch (error) {
                console.error('[User Module] GET_USER_LIST: Error fetching all users:', error);
                const errorMessage = error.message || 'Failed to fetch user list.';
                commit('SET_ERROR', errorMessage);
                commit('SET_LOADING', false);
                throw error; // Re-throw for component to handle
            }
        },


        async FETCH_USER_BY_ID({ commit }, userId) {
            console.log('[User Module] Action: FETCH_USER_BY_ID called with userId:', userId);
            commit('SET_LOADING', true);
            commit('SET_ERROR', null); // Clear previous errors
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                if (!auth || !auth.access_token) {
                    throw new Error('Authentication token not found. Please log in.');
                }
                console.log('[User Module] FETCH_USER_BY_ID: Authentication token retrieved.');

                const response = await axios({
                    method: 'get',
                    url: `${process.env.VUE_APP_BASE_URL}users/get_user/${userId}`, // API endpoint for single user
                    headers: {
                        'Authorization': `Bearer ${auth.access_token}`
                    }
                });

                console.log('[User Module] FETCH_USER_BY_ID: API response received:', response.data);

                // Handle different response structures for single user
                if (response.data && response.data.rows && response.data.rows.length > 0) {
                    commit('SET_SINGLE_USER', response.data.rows[0]); // If nested in 'rows' array
                } else if (response.data && !response.data.rows) {
                    commit('SET_SINGLE_USER', response.data); // If direct user object
                } else {
                    console.warn('[User Module] FETCH_USER_BY_ID: No user found or response not in expected format.', response.data);
                    commit('SET_SINGLE_USER', null);
                }

                commit('SET_LOADING', false);
                // console.log('[User Module] FETCH_USER_BY_ID: Action completed successfully.');
                return response.data;
            } catch (error) {
                console.error('[User Module] FETCH_USER_BY_ID: Error fetching user by ID:', error);
                const errorMessage = error.message || `Failed to fetch user with ID ${userId}.`;
                commit('SET_ERROR', errorMessage);
                commit('SET_LOADING', false);
                throw error;
            }
        },

        //   async GET_USERLOG_LIST({ commit, state }, query) {
        //     const auth = JSON.parse(localStorage.getItem('user'))
        //     // console.log(auth)
        //     const options = {
        //         method: 'get',
        //         url: `${process.env.VUE_APP_BASE_URL}track_activity/list`,
        //         headers: {
        //             Authorization: 'Bearer ' + auth.access_token
        //         }

        //     }
        //     if(query){
        //         options.params = query
        //     }
        //     const data = await axios(options)
        //     console.log(data);

        //      commit('SET_USER_LOGS', data.data.data)
        //      commit('SET_CITY_TOTAL_PAGE', data.data.totalPages)
        //      console.log(state.totalPages)
        // },
        async GET_USERLOG_LIST({ commit }, query) {
            try {
                const auth = JSON.parse(localStorage.getItem('user'));
                const options = {
                    method: 'get',
                    url: `${process.env.VUE_APP_BASE_URL}track_activity/list`,
                    headers: {
                        Authorization: 'Bearer ' + auth.access_token
                    }
                };

                if (query) {
                    options.params = query;
                }

                const { data } = await axios(options);
                console.log('API Response:', data);
                
                // Commit the data to store
                commit('SET_USER_LOGS', data.data || []);
                commit('SET_USER_TOTAL_PAGES', data.totalPages || 1);

                // Return the full response for component use
                return {
                    data: data.data || [],
                    totalPages: data.totalPages || 1,
                    ...data
                };
            } catch (error) {
                console.error('Error fetching user logs:', error);
                commit('SET_USER_LOGS', []);
                commit('SET_USER_TOTAL_PAGES', 1);
                throw error;
            }
        }

    },
    getters: {
        /**
         * Returns the array of all users.
         * @param {object} state - The current state of the module.
         * @returns {Array} - Array of all user objects.
         */
        getAllUsers: state => {
            // console.log('[User Module] Getter: getAllUsers accessed. Returning:', state.allUsers);
            return state.allUsers;
        },
        /**
         * Returns the pagination information for users.
         * @param {object} state - The current state of the module.
         * @returns {object} - Pagination object.
         */
        getUsersPagination: state => {
            console.log('[User Module] Getter: getUsersPagination accessed. Returning:', state.usersPagination);
            return state.usersPagination;
        },
        /**
         * Returns the single fetched user.
         * @param {object} state - The current state of the module.
         * @returns {object|null} - Single user object or null.
         */
        getSingleUser: state => {
            console.log('[User Module] Getter: getSingleUser accessed. Returning:', state.singleUser);
            return state.singleUser;
        },
        /**
         * Returns the loading status for user operations.
         * @param {object} state - The current state of the module.
         * @returns {boolean} - Loading status.
         */
        isLoadingUsers: state => {
            console.log('[User Module] Getter: isLoadingUsers accessed. Returning:', state.loading);
            return state.loading;
        },
        /**
         * Returns the current error message for user operations.
         * @param {object} state - The current state of the module.
         * @returns {string|null} - Error message or null.
         */
        getUserError: state => {
            console.log('[User Module] Getter: getUserError accessed. Returning:', state.error);
            return state.error;
        }
    }
};