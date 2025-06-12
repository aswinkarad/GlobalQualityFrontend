<template>
  <v-container fluid class="hmmsdashboard">
    <!-- Top Bar -->
    <v-row align="center" class="top-bar">
      <v-col cols="12" md="6">
        <v-breadcrumbs :items="breadcrumbs" class="breadcrumbs-container">
          <template v-slot:divider>
            <v-icon color="white">mdi-chevron-right</v-icon>
          </template>
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :href="item.href" :disabled="item.disabled" class="custom-breadcrumb-item">
              {{ item.text }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-col>
      <v-col cols="12" md="6" class="user-bell-container">
        <div class="user-bell-wrapper">
          <span class="user-greeting">Hello, {{ userName }}!</span>
          <v-btn icon class="bell-icon-container" @click="toggleNotifications">
            <v-icon color="orange" class="bell-icon">mdi-bell</v-icon>
            <v-badge
              :content="unreadNotifications"
              color="error"
              overlap
              class="notification-badge"
              v-if="unreadNotifications > 0"
            ></v-badge>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Notification Dropdown -->
    <v-card v-if="showNotifications" class="notification-dropdown" elevation="10">
      <v-card-title class="notification-header">
        Notifications
        <v-spacer></v-spacer>
        <v-btn
          v-if="isAdmin"
          icon="mdi-plus"
          size="small"
          @click="openCreateNotificationDialog"
          class="add-notification-btn"
        ></v-btn>
        <v-btn
          icon="mdi-close"
          size="small"
          @click="toggleNotifications"
          class="close-notification-btn"
        ></v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-list class="notification-list">
        <v-list-item
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item"
          :class="{ 'unread': !notification.read }"
        >
          <template v-slot:prepend>
            <div class="notification-content" :style="getSlideStyle(notification)" @click="showFullMessage(notification)">
              <v-list-item-title class="notification-title">
                {{ notification.subject || notification.title }}
              </v-list-item-title>
              <v-list-item-subtitle class="notification-message">
                {{ truncateMessage(notification.message) }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="notification-time">
                {{ formatTime(notification.createdAt || notification.timestamp) }}
              </v-list-item-subtitle>
            </div>
          </template>
          <template v-slot:append>
            <div class="append-content">
              <div class="notification-actions" v-if="isAdmin">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  color="#3B82F6"
                  @click.stop="openEditNotificationDialog(notification)"
                  class="edit-btn"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  color="#EF4444"
                  @click.stop="startSlideDelete(notification)"
                  class="delete-btn"
                ></v-btn>
              </div>
              <v-icon
                :color="notification.read ? '#6b7280' : '#1e40af'"
                size="16"
              >mdi-circle</v-icon>
              <div class="delete-action" :style="getSlideStyle(notification)">
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  color="#FFFFFF"
                  class="slide-delete-btn"
                  @click.stop="confirmDelete(notification)"
                ></v-btn>
              </div>
            </div>
          </template>
        </v-list-item>
        <v-list-item v-if="notifications.length === 0">
          <v-list-item-title>No new notifications</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-btn
          text
          color="white"
          @click="markAllAsRead"
          :disabled="unreadNotifications === 0"
          class="mark-all-btn"
        >
          Mark All as Read
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Notification Create/Edit Dialog -->
    <v-dialog
      v-model="notificationDialog"
      max-width="900px"
      max-height="700px"
      persistent
      :fullscreen="$vuetify.display.xs"
      scrollable
    >
      <v-card class="notification-modal enhanced-modal">
        <v-card-title class="notification-header modal-header">
          {{ editMode ? 'Edit Notification' : 'Create Notification' }}
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            size="small"
            @click="notificationDialog = false"
            class="close-notification-btn"
          ></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="modal-content enhanced-modal-content">
          <v-form ref="notificationForm">
            <v-text-field
              v-model="newNotification.subject"
              label="Subject"
              required
              :rules="[v => !!v || 'Subject is required']"
              variant="outlined"
              class="modal-input"
            ></v-text-field>
            <v-textarea
              v-model="newNotification.message"
              label="Message"
              required
              :rules="[v => !!v || 'Message is required']"
              variant="outlined"
              class="modal-input enhanced-textarea"
              rows="8"
              auto-grow
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions class="modal-actions">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="text"
            @click="notificationDialog = false"
            class="cancel-btn"
          >
            Cancel
          </v-btn>
          <v-btn
            color="white"
            variant="flat"
            @click="saveNotification"
            class="save-btn"
          >
            {{ editMode ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Full Message Dialog -->
    <v-dialog
      v-model="fullMessageDialog"
      max-width="1200px"
      max-height="800px"
      persistent
      :fullscreen="$vuetify.display.xs"
      scrollable
    >
      <v-card class="notification-modal extra-large-modal">
        <v-card-title class="notification-header modal-header">
          {{ selectedNotification.subject || selectedNotification.title }}
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            size="small"
            @click="fullMessageDialog = false"
            class="close-notification-btn"
          ></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="modal-content extra-large-modal-content">
          <div class="message-header">
            <h2 class="full-message-title">{{ selectedNotification.subject || selectedNotification.title }}</h2>
            <p class="notification-time">{{ formatTime(selectedNotification.createdAt || selectedNotification.timestamp) }}</p>
            <v-chip
              v-if="selectedNotification.priority"
              :color="getPriorityColor(selectedNotification.priority)"
              class="priority-chip"
            >
              Priority: {{ selectedNotification.priority }}
            </v-chip>
          </div>
          <v-divider class="my-4"></v-divider>
          <div class="message-body">
            <p class="full-message enhanced-message-text">{{ selectedNotification.message }}</p>
          </div>
          <div class="message-actions mt-6">
            <v-btn
              v-if="!selectedNotification.read"
              color="primary"
              variant="flat"
              @click="markAsRead(selectedNotification)"
              class="mark-read-btn"
              size="large"
            >
              Mark as Read
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Welcome Header -->
    <div class="welcome-header">
      <div class="overlay"></div>
      <h1 class="animated-text">Dashboard Overviewyyyy</h1>
      <p class="sub-text">Manage your services efficiently</p>
    </div>

    <!-- Dashboard Cards -->
    <div class="dashboard-cards">
      <v-row>
        <v-col v-for="card in dashValue" :key="card.id" cols="12" sm="6" md="3">
          <v-card
            class="modern-dashboard-card"
            elevation="0"
            @click="navigateTo(card.title)"
            style="cursor: pointer;"
          >
            <div class="card-overlay"></div>
            <v-card-title class="modern-card-title">
              <v-icon class="card-icon" :color="getIconColor(card.title)">mdi-{{ getIcon(card.title) }}</v-icon>
              <span class="title-text">{{ card.title }}</span>
            </v-card-title>
            <v-card-text class="modern-card-data">
              <span class="data-value">{{ card.data }}</span>
            </v-card-text>
            <div class="card-accent"></div>
            <div class="card-glow"></div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Services Section -->
    <div class="services-section">
      <div class="section-header">
        <span class="title-gradient">SERVICE REQUESTS</span>
        <v-btn icon class="refresh-btn" @click="GET_SERVICE_LIST">
          <v-icon color="#3B82F6">mdi-refresh</v-icon>
        </v-btn>
      </div>
      <v-table class="modern-table rounded-lg mt-4">
        <thead>
          <tr>
            <th v-for="header in headers" :key="header" class="text-left">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in serviceList" :key="item.id" class="table-row-hover">
            <td>{{ i + 1 }}</td>
            <td>{{ item.sale.equipment.equipmentName }}</td>
            <td>{{ item.sale.client.name }}</td>
            <td>{{ item.sale.client.city.city }}</td>
            <td>{{ item.call_handle.callHandle }}</td>
            <td>{{ item.workingcondition.workingCondition }}</td>
            <td>{{ item.sale.serialNo }}</td>
            <td>{{ item.callRegisterDate.split('T')[0] }}</td>
            <td>{{ item.priority.priority }}</td>
            <td><span v-if="item.user">{{ item.user.username }}</span></td>
            <td>
              <v-chip :color="getStatusColor(item.working_status.workingStatus)" class="status-chip">
                {{ item.working_status.workingStatus }}
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>

    <!-- Messages Section -->
    <div class="messages-section">
      <div class="section-header">
        <span class="title-gradient">SERVICE MESSAGES</span>
        <v-btn icon class="refresh-btn" @click="fetchMessageList">
          <v-icon color="#3B82F6">mdi-refresh</v-icon>
        </v-btn>
      </div>
      <v-table class="modern-table rounded-lg mt-4">
        <thead>
          <tr>
            <th class="text-left">SUBJECT</th>
            <th class="text-left">MESSAGE</th>
            <th class="text-left">COMMENT</th>
            <th class="text-left">MESSAGE FROM</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredMessageList" :key="item.id" class="table-row-hover">
            <td>{{ item.subject }}</td>
            <td>{{ item.message }}</td>
            <td>{{ item.comment }}</td>
            <td>{{ item.service_request?.user?.username || 'Unknown' }}</td>
          </tr>
        </tbody>
      </v-table>
      <paginationVue :length="totalPages" @changePage="changePage" />
    </div>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import paginationVue from '@/components/pagination.vue';

export default {
  name: 'Dashboard',
  components: {
    paginationVue,
  },
  data() {
    return {
      userName: '',
      dashValue: [],
      breadcrumbs: [
        { text: 'Home', disabled: false, href: '/' },
        { text: 'Dashboard', disabled: true, href: '/dashboard' },
      ],
      headers: ['#', 'Equipment Name', 'Client', 'City', 'Call Handle', 'Working Status', 'Serial Number', 'Registration Date', 'Priority', 'Assigned To', 'Status'],
      totalPages: 1,
      currentPage: 1,
      serviceRequestId: null,
      showNotifications: false,
      notificationDialog: false,
      fullMessageDialog: false,
      editMode: false,
      selectedNotification: {},
      newNotification: {
        subject: '',
        message: '',
        id: null,
        priority: 'Medium',
      },
      slidingNotification: null,
      slideOffset: 0,
    };
  },
  computed: {
    ...mapState('service', ['serviceList']),
    ...mapState('dashboard', ['dashboardValue']),
    ...mapState('clients', ['clientList']),
    ...mapState('equipments', ['allEquipments']),
    ...mapState('PreventiveReminders', ['preventiveTotalPage']),
    ...mapState('message', ['MessageList', 'totalPages']),
    ...mapState('notifications', ['notificationList']),
    ...mapGetters('notifications', ['unreadNotifications']),
    filteredMessageList() {
      if (this.serviceRequestId) {
        return this.MessageList.filter(
          (item) => item.serviceRequestId === parseInt(this.serviceRequestId)
        );
      }
      return this.MessageList;
    },
    isAdmin() {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.role?.[0] === 'admin';
    },
    notifications() {
      return this.$store.state.notifications.notificationList;
    },
  },
  methods: {
    ...mapActions('service', ['GET_SERVICE_LIST']),
    ...mapActions('dashboard', ['GET_DASHBOARD']),
    ...mapActions('clients', ['GET_CLIENT_LIST']),
    ...mapActions('equipments', ['GET_ALL_EQUIPMENT']),
    ...mapActions('PreventiveReminders', ['GET_PREVENTIVE_LIST']),
    ...mapActions('message', ['GET_MESSAGE_LIST']),
    ...mapActions('notifications', [
      'GET_NOTIFICATION_LIST',
      'ADD_NOTIFICATION',
      'UPDATE_NOTIFICATION',
      'DELETE_NOTIFICATION',
      'MARK_NOTIFICATION_READ',
      'MARK_ALL_NOTIFICATIONS_READ',
      'GET_NOTIFICATION_WITH_ID',
    ]),
    async getDashValue() {
      await Promise.all([
        this.GET_DASHBOARD(),
        this.GET_PREVENTIVE_LIST(),
      ]).then(() => {
        this.dashValue = [
          { id: 1, title: 'Clients', data: this.dashboardValue.clientcount || 0 },
          { id: 2, title: 'Reminders', data: this.preventiveTotalPage || 0 },
          { id: 3, title: 'Equipments', data: this.dashboardValue.salescount || 0 },
          { id: 4, title: 'Service', data: this.dashboardValue.servicecount || 0 },
        ];
      });
    },
    getStatusColor(status) {
      const colors = {
        Open: '#EF4444',
        InProgress: '#F59E0B',
        Completed: '#10B981',
        Verified: '#06B6D4',
      };
      return colors[status] || '#6B7280';
    },
    getPriorityColor(priority) {
      const colors = {
        Low: '#10B981',
        Medium: '#F59E0B',
        High: '#EF4444',
      };
      return colors[priority] || '#6B7280';
    },
    getIcon(title) {
      const icons = {
        Clients: 'account-group',
        Reminders: 'bell-ring',
        Equipments: 'cog',
        Service: 'wrench',
      };
      return icons[title] || 'information';
    },
    getIconColor(title) {
      const colors = {
        Clients: '#EF4444',
        Reminders: '#F59E0B',
        Equipments: '#10B981',
        Service: '#06B6D4',
      };
      return colors[title] || '#6B7280';
    },
    navigateTo(title) {
      switch (title) {
        case 'Clients':
          this.$router.push({ name: 'client' });
          break;
        case 'Reminders':
          this.$router.push({ name: 'preventiveReminders' });
          break;
        case 'Equipments':
          this.$router.push({ name: 'equipment' });
          break;
        case 'Service':
          this.$router.push({ name: 'serviceRequest' });
          break;
        default:
          console.log('No route defined for this card');
      }
    },
    changePage(page) {
      this.currentPage = page;
      this.fetchMessageList(page);
    },
    async fetchMessageList(page = 1) {
      const query = {
        page: page,
        size: 15,
        serviceRequestId: this.serviceRequestId || undefined,
      };
      try {
        await this.GET_MESSAGE_LIST(query);
        this.totalPages = this.$store.state.message.totalPages || 1;
      } catch (error) {
        console.error('Error fetching message list:', error);
      }
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
      if (this.showNotifications) {
        this.$store.dispatch('notifications/GET_NOTIFICATION_LIST');
      }
      this.slidingNotification = null;
      this.slideOffset = 0;
    },
    async markAsRead(notification) {
      if (!notification.read) {
        await this.$store.dispatch('notifications/MARK_NOTIFICATION_READ', notification.id);
        this.selectedNotification.read = true;
      }
      this.fullMessageDialog = false;
    },
    async markAllAsRead() {
      await this.$store.dispatch('notifications/MARK_ALL_NOTIFICATIONS_READ');
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    },
    truncateMessage(message) {
      const maxLength = window.innerWidth <= 600 ? 50 : 100;
      return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
    },
    showFullMessage(notification) {
      this.selectedNotification = { ...notification };
      this.fullMessageDialog = true;
      this.slidingNotification = null;
      this.slideOffset = 0;
    },
    openCreateNotificationDialog() {
      this.editMode = false;
      this.newNotification = { subject: '', message: '', id: null, priority: 'Medium' };
      this.notificationDialog = true;
    },
    async openEditNotificationDialog(notification) {
      await this.$store.dispatch('notifications/GET_NOTIFICATION_WITH_ID', { id: notification.id });
      this.newNotification = { ...this.$store.state.notifications.editNotificationValue, priority: this.$store.state.notifications.editNotificationValue.priority || 'Medium' };
      this.editMode = true;
      this.notificationDialog = true;
    },
    startSlideDelete(notification) {
      if (this.slidingNotification === notification.id) {
        this.slidingNotification = null;
        this.slideOffset = 0;
      } else {
        this.slidingNotification = notification.id;
        this.slideOffset = -100;
      }
    },
    async confirmDelete(notification) {
      await this.$store.dispatch('notifications/DELETE_NOTIFICATION', { id: notification.id });
      this.slidingNotification = null;
      this.slideOffset = 0;
    },
    getSlideStyle(notification) {
      if (this.slidingNotification === notification.id) {
        return {
          transform: `translateX(${this.slideOffset}px)`,
          transition: 'transform 0.3s ease',
        };
      }
      return {
        transform: 'translateX(0)',
        transition: 'transform 0.3s ease',
      };
    },
    async saveNotification() {
      if (this.$refs.notificationForm.validate()) {
        if (this.editMode) {
          await this.$store.dispatch('notifications/UPDATE_NOTIFICATION', this.newNotification);
        } else {
          await this.$store.dispatch('notifications/ADD_NOTIFICATION', this.newNotification);
        }
        this.notificationDialog = false;
        this.newNotification = { subject: '', message: '', id: null, priority: 'Medium' };
      }
    },
  },
  mounted() {
    this.getDashValue();
    this.GET_SERVICE_LIST();
    this.GET_CLIENT_LIST();
    this.GET_ALL_EQUIPMENT();
    this.userName = JSON.parse(localStorage.getItem('user'))?.username || '';
    this.fetchMessageList();
    this.GET_NOTIFICATION_LIST();
  },
  watch: {
    '$route.params.serviceRequestId'(newId) {
      this.serviceRequestId = newId || null;
      this.fetchMessageList();
    },
  },
};
</script>

<style>
/* Dashboard Container - Fixed scrolling issue */
.hmmsdashboard {
  background: #F9FAFB;
  padding: 24px;
  color: #1F2937;
  font-family: 'Inter', sans-serif;
  overflow-y: auto;
  height: 100vh;
  box-sizing: border-box;
}

/* Top Bar */
.top-bar {
  margin-bottom: 24px;
  padding: 0 12px;
}

.breadcrumbs-container {
  background: linear-gradient(90deg, #3B82F6, #1E3A8A);
  border-radius: 10px;
  padding: 10px 20px;
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.25);
  transition: transform 0.3s ease;
}

.breadcrumbs-container:hover {
  transform: scale(1.02);
}

.custom-breadcrumb-item {
  color: #FFFFFF;
  font-weight: 700;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.custom-breadcrumb-item:hover {
  color: #DBEAFE;
}

/* User Bell Container */
.user-bell-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.user-bell-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-greeting {
  color: #1E3A8A;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.bell-icon-container {
  background-color: transparent;
  border-radius: 50%;
  padding: 10px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.bell-icon-container:hover {
  background-color: rgba(249, 115, 22, 0.15);
  transform: scale(1.1);
}

.bell-icon {
  font-size: 24px;
}

.notification-badge {
  font-size: 0.8rem;
  font-weight: 700;
}

/* Notification Dropdown */
.notification-dropdown {
  position: absolute;
  top: 110px;
  right: 24px;
  width: 380px;
  max-height: 450px;
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(59, 130, 246, 0.3);
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;
}

/* Notification Header */
.notification-header {
  background: linear-gradient(135deg, #3B82F6, #1E3A8A);
  color: #FFFFFF;
  font-weight: 700;
  font-size: 1.2rem;
  padding: 16px 20px;
  border-radius: 16px 16px 0 0;
}

/* Notification Modal Styles */
.notification-modal {
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(59, 130, 246, 0.3);
}

.modal-header {
  background: linear-gradient(135deg, #3B82F6, #1E3A8A);
  color: #FFFFFF;
  font-weight: 700;
  font-size: 1.2rem;
  padding: 16px 20px;
  border-radius: 16px 16px 0 0;
}

.modal-content {
  padding: 24px;
  color: #1F2937;
  font-size: 1rem;
  line-height: 1.6;
}

.modal-input {
  margin-bottom: 20px;
  border-radius: 10px;
}

.full-message-title {
  font-weight: 800;
  font-size: 1.3rem;
  color: #1E3A8A;
  margin-bottom: 10px;
}

.full-message {
  color: #1F2937;
  font-size: 1.1rem;
  line-height: 1.7;
  padding: 16px;
  border-radius: 10px;
  border-left: 4px solid #3B82F6;
  background: #F1F5F9;
}

.priority-chip {
  color: #FFFFFF;
  font-weight: 700;
  border-radius: 16px;
  padding: 6px 12px;
  margin: 10px 0;
}

.modal-actions {
  padding: 16px 20px;
  border-top: 1px solid rgba(59, 130, 246, 0.15);
}

.cancel-btn, .save-btn, .mark-read-btn {
  border-radius: 10px;
  padding: 8px 20px;
  font-weight: 700;
  transition: all 0.3s ease;
}

.cancel-btn {
  color: #6B7280;
  background: #E5E7EB;
}

.cancel-btn:hover {
  color: #1F2937;
  background: #D1D5DB;
}

.save-btn, .mark-read-btn {
  background: linear-gradient(90deg, #3B82F6, #1E3A8A);
  color: #FFFFFF;
}

.save-btn:hover, .mark-read-btn:hover {
  background: linear-gradient(90deg, #1E3A8A, #1E40AF);
  transform: scale(1.05);
}

/* Notification Buttons */
.close-notification-btn, .add-notification-btn {
  color: #FFFFFF;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  transition: all 0.3s ease;
}

.close-notification-btn:hover, .add-notification-btn:hover {
  background: #60A5FA;
  transform: scale(1.1);
}

/* Notification List */
.notification-list {
  max-height: 340px;
  overflow-y: auto;
  background: #F1F5F9;
  padding: 10px;
}

.notification-list::-webkit-scrollbar {
  width: 8px;
}

.notification-list::-webkit-scrollbar-track {
  background: #E5E7EB;
  border-radius: 10px;
}

.notification-list::-webkit-scrollbar-thumb {
  background: #93C5FD;
  border-radius: 10px;
}

/* Notification Item */
.notification-item {
  padding: 14px 18px;
  margin: 6px 0;
  border-radius: 10px;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  background: #FFFFFF;
  position: relative;
  overflow: hidden;
}

.notification-item:hover {
  background: rgba(59, 130, 246, 0.1);
  border-left: 4px solid #3B82F6;
}

.unread {
  background: rgba(59, 130, 246, 0.15);
  border-left: 4px solid #1E3A8A;
}

/* Notification Content and Delete Action */
.notification-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  cursor: pointer;
}

.append-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.delete-action {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 80px;
  background: #EF4444;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(80px);
  transition: transform 0.3s ease;
}

.slide-delete-btn {
  background: #B91C1C;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  transition: all 0.3s ease;
}

.slide-delete-btn:hover {
  background: #991B1B;
  transform: scale(1.1);
}

/* Notification Title */
.notification-title {
  font-weight: 700;
  font-size: 1rem;
  color: #1E3A8A;
}

/* Notification Message */
.notification-message {
  color: #4B5563;
  font-size: 0.95rem;
  margin-top: 6px;
}

/* Notification Time */
.notification-time {
  color: #6B7280;
  font-size: 0.85rem;
  margin-top: 6px;
}

/* Notification Actions */
.notification-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.edit-btn, .delete-btn {
  width: 36px;
  height: 36px;
  background: #FFFFFF;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: #1E40AF;
  color: #FFFFFF;
}

.delete-btn:hover {
  background: #B91C1C;
  color: #FFFFFF;
}

/* Mark All Button */
.mark-all-btn {
  width: 100%;
  text-align: center;
  background: linear-gradient(90deg, #3B82F6, #1E3A8A);
  color: #FFFFFF;
  border-radius: 10px;
  padding: 10px;
  font-weight: 700;
  transition: all 0.3s ease;
}

.mark-all-btn:hover {
  background: linear-gradient(90deg, #1E3A8A, #1E40AF);
  transform: scale(1.05);
}

/* Welcome Header */
.welcome-header {
  position: relative;
  background: linear-gradient(145deg, #1E3A8A, #1D4ED8);
  padding: 48px 24px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
  animation: fadeIn 0.5s ease-in-out;
}

.overlay {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(30, 64, 175, 0.25));
  position: absolute;
  inset: 0;
  opacity: 0.7;
  z-index: 0;
}

.animated-text {
  color: #FFFFFF;
  font-size: 2.5rem;
  font-weight: 800;
  z-index: 1;
  letter-spacing: 1px;
  animation: slideIn 0.5s ease-in-out;
}

.sub-text {
  color: #DBEAFE;
  font-size: 1.2rem;
  z-index: 1;
  margin-top: 10px;
  font-weight: 500;
}

/* Dashboard Cards */
.dashboard-cards {
  margin-top: 32px;
  animation: fadeIn 0.5s ease-in-out;
}

.modern-dashboard-card {
  position: relative;
  background: #FFFFFF;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, rgba(59, 130, 246, 0.1), rgba(30, 64, 175, 0.1));
  z-index: 0;
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modern-dashboard-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.modern-dashboard-card:hover .card-glow {
  opacity: 1;
}

.modern-card-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 1.2rem;
  font-weight: 700;
  z-index: 1;
  margin-bottom: 16px;
}

.card-icon {
  font-size: 2rem;
}

.title-text {
  color: #1E3A8A;
}

.modern-card-data {
  font-size: 2.5rem;
  font-weight: 800;
  z-index: 1;
}

.data-value {
  color: #F59E0B;
  transition: color 0.3s ease;
}

.modern-dashboard-card:hover .data-value {
  color: #D97706;
}

.card-accent {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #3B82F6, #1E3A8A);
  border-radius: 0 0 16px 16px;
}

/* Services & Messages Sections */
.services-section, .messages-section {
  margin-top: 40px;
  padding: 16px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title-gradient {
  color: transparent;
  background: linear-gradient(90deg, #1E3A8A, #3B82F6);
  -webkit-background-clip: text;
  background-clip: text;
  font-weight: 800;
  font-size: 1.5rem;
  letter-spacing: 0.5px;
}

.refresh-btn {
  background: rgba(59, 130, 246, 0.15);
  transition: all 0.3s ease;
  border-radius: 50%;
}

.refresh-btn:hover {
  background: rgba(59, 130, 246, 0.3);
  transform: rotate(180deg);
}

.modern-table {
  background: #FFFFFF;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  overflow-x: auto;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.modern-table th {
  padding: 12px 16px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.95rem;
  color: #3B82F6;
  background: rgba(59, 130, 246, 0.1);
}

.modern-table td {
  padding: 12px 16px;
  font-size: 0.95rem;
  color: #1F2937;
}

.table-row-hover {
  transition: all 0.3s ease;
}

.table-row-hover:hover {
  background: rgba(59, 130, 246, 0.1);
  transform: translateX(5px);
}

.status-chip {
  min-width: 90px;
  text-align: center;
  color: #FFFFFF;
  font-weight: 700;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 0.9rem;
  transition: transform 0.3s ease;
}

.status-chip:hover {
  transform: scale(1.05);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive Design */
@media (max-width: 960px) {
  .hmmsdashboard { padding: 20px; }
  .animated-text { font-size: 2rem; }
  .sub-text { font-size: 1.1rem; }
  .welcome-header { padding: 36px 20px; }
  .title-gradient { font-size: 1.3rem; }
  .modern-dashboard-card { padding: 16px; }
  .modern-card-title { font-size: 1.1rem; }
  .card-icon { font-size: 1.8rem; }
  .modern-card-data { font-size: 2.2rem; }
  .notification-dropdown { width: 340px; top: 100px; }
}

@media (max-width: 600px) {
  .hmmsdashboard { padding: 16px; }
  .user-bell-wrapper { flex-direction: column; align-items: center; }
  .user-greeting { font-size: 1rem; }
  .bell-icon { font-size: 22px; }
  .animated-text { font-size: 1.8rem; }
  .sub-text { font-size: 1rem; }
  .welcome-header { padding: 28px 16px; }
  .title-gradient { font-size: 1.2rem; }
  .modern-table { display: block; overflow-x: auto; white-space: nowrap; }
  .modern-table th, .modern-table td { padding: 10px 8px; font-size: 0.85rem; min-width: 110px; }
  .notification-dropdown { width: 90%; right: 5%; top: 90px; }
}

/* Enhanced Modal Styles */
.enhanced-modal {
  min-width: 450px;
  min-height: 400px;
  border-radius: 16px;
}

.enhanced-modal-content {
  padding: 24px;
  min-height: 300px;
}

.enhanced-textarea {
  min-height: 180px;
}

.extra-large-modal {
  min-width: 500px;
  min-height: 500px;
}

.extra-large-modal-content {
  padding: 32px;
  min-height: 400px;
  font-size: 1.1rem;
}

.enhanced-message-text {
  font-size: 1.1rem;
  line-height: 1.7;
  padding: 16px;
  border-radius: 10px;
  border-left: 4px solid #3B82F6;
  background: #F1F5F9;
}

.modal-input {
  margin-bottom: 20px;
}

.full-message-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1E3A8A;
  margin-bottom: 8px;
}

.message-header, .message-textarea, .message-actions {
  padding: 16px 0;
}

.message-actions {
  text-align: center;
}

.mark-read-btn {
  font-size: 1rem;
  padding: 12px 24px;
  border-radius: 8px;
}

/* Responsive Adjustments */
@media (max-width: 1400px) {
  .extra-large-modal {
    min-width: 400px;
    margin: 12px;
  }
}

@media (max-width: 1000px) {
  .enhanced-modal {
    min-width: 80vw;
    margin: 12px;
  }
}

@media (max-max-width: 768px) {
  .enhanced-modal, .extra-large-modal {
    min-width: 90vw;
    min-height: 500px;
    margin: 8px;
  }
  .enhanced-modal-content, .extra-large-modal-content {
    padding: 16px;
  }
  .enhanced-message-text {
    font-size: 1rem;
    padding: 12px;
  }
}
</style>