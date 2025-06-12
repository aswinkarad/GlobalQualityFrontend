import axios from 'axios';

export default {
  namespaced: true,
  state: {
    notificationList: [],
    editNotificationValue: {},
    notificationTotalPages: '',
  },
  mutations: {
    SET_NOTIFICATION_LIST(state, data) {
      state.notificationList = data;
    },
    SET_EDIT_NOTIFICATION_VALUE(state, data) {
      state.editNotificationValue = data;
    },
    SET_NOTIFICATION_TOTAL_PAGES(state, data) {
      state.notificationTotalPages = data;
    },
    CLEAR_NOTIFICATION_LIST(state) {
      state.notificationList = [];
    },
    MARK_NOTIFICATION_READ(state, notificationId) {
      const notification = state.notificationList.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    },
    MARK_ALL_NOTIFICATIONS_READ(state) {
      state.notificationList.forEach(n => (n.read = true));
    },
  },
  actions: {
    async GET_NOTIFICATION_LIST({ commit }, query) {
      const auth = JSON.parse(localStorage.getItem('user'));
      if (!auth || !auth.access_token) {
        console.error('No authentication token found');
        return;
      }

      const options = {
        method: 'get',
        url: `${process.env.VUE_APP_BASE_URL}notification/list`,
        headers: {
          Authorization: 'Bearer ' + auth.access_token,
        },
        params: query || {},
      };

      try {
        const response = await axios(options);
        commit('SET_NOTIFICATION_LIST', response.data.data);
        commit('SET_NOTIFICATION_TOTAL_PAGES', response.data.totalPages);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
      }
    },
    async ADD_NOTIFICATION({ dispatch }, payload) {
      const auth = JSON.parse(localStorage.getItem('user'));
      if (!auth || !auth.access_token) {
        console.error('No authentication token found');
        return;
      }

      try {
        const response = await axios({
          method: 'post',
          url: `${process.env.VUE_APP_BASE_URL}notification/create`,
          data: payload,
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
          },
        });
        console.log('Add Notification Response:', response.data);
        await dispatch('GET_NOTIFICATION_LIST');
      } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
      }
    },
    async UPDATE_NOTIFICATION({ dispatch }, payload) {
      const auth = JSON.parse(localStorage.getItem('user'));
      if (!auth || !auth.access_token) {
        console.error('No authentication token found');
        return;
      }

      try {
        const response = await axios({
          method: 'put',
          url: `${process.env.VUE_APP_BASE_URL}notification/update/${payload.id}`,
          data: {
            subject: payload.subject,
            message: payload.message,
          },
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
          },
        });
        console.log('Update Notification Response:', response.data);
        await dispatch('GET_NOTIFICATION_LIST');
      } catch (error) {
        console.error('Error updating notification:', error);
        throw error;
      }
    },
    async DELETE_NOTIFICATION({ dispatch }, payload) {
      const auth = JSON.parse(localStorage.getItem('user'));
      if (!auth || !auth.access_token) {
        console.error('No authentication token found');
        return;
      }

      try {
        const response = await axios({
          method: 'delete',
          url: `${process.env.VUE_APP_BASE_URL}notification/delete/${payload.id}`,
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
          },
        });
        console.log('Delete Notification Response:', response.data);
        await dispatch('GET_NOTIFICATION_LIST');
      } catch (error) {
        console.error('Error deleting notification:', error);
        throw error;
      }
    },
    async GET_NOTIFICATION_WITH_ID({ commit }, payload) {
      const auth = JSON.parse(localStorage.getItem('user'));
      if (!auth || !auth.access_token) {
        console.error('No authentication token found');
        return;
      }

      try {
        const response = await axios({
          method: 'get',
          url: `${process.env.VUE_APP_BASE_URL}notification/list`,
          params: {
            id: payload.id,
          },
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
          },
        });
        // Handle single notification or array
        const notification = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
        commit('SET_EDIT_NOTIFICATION_VALUE', notification || {});
        console.log('Notification by ID:', notification);
      } catch (error) {
        console.error('Error fetching notification by ID:', error);
        throw error;
      }
    },
    async MARK_NOTIFICATION_READ({ commit }, notificationId) {
      const auth = JSON.parse(localStorage.getItem('user'));
      if (!auth || !auth.access_token) {
        console.error('No authentication token found');
        return;
      }

      try {
        await axios({
          method: 'put',
          url: `${process.env.VUE_APP_BASE_URL}notification/mark-read/${notificationId}`,
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
          },
        });
        commit('MARK_NOTIFICATION_READ', notificationId);
        console.log(`Notification ${notificationId} marked as read`);
      } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
      }
    },
    async MARK_ALL_NOTIFICATIONS_READ({ commit, dispatch }) {
      const auth = JSON.parse(localStorage.getItem('user'));
      if (!auth || !auth.access_token) {
        console.error('No authentication token found');
        return;
      }

      try {
        await axios({
          method: 'put',
          url: `${process.env.VUE_APP_BASE_URL}notification/mark-all-read`,
          headers: {
            Authorization: 'Bearer ' + auth.access_token,
          },
        });
        commit('MARK_ALL_NOTIFICATIONS_READ');
        console.log('All notifications marked as read');
        await dispatch('GET_NOTIFICATION_LIST');
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
      }
    },
  },
  getters: {
    getNotificationById: (state) => (id) => {
      return state.notificationList.find((notification) => notification.id === id);
    },
    unreadNotifications: (state) => {
      return state.notificationList.filter(n => !n.read).length;
    },
  },
};