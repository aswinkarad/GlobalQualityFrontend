<template>
  <div class="app-layout">
    <v-navigation-drawer 
      v-if="isSidebarOpen" 
      permanent 
      theme="dark" 
      class="modern-sidebar"
      :width="280"
    >
      <v-list-item height="80" class="sidebar-header">
        <v-img 
          :src="logoSrc" 
          height="40"
          width="150"
          contain
          class="logo"
          @error="onLogoError"
        ></v-img>
        <v-spacer></v-spacer>
        <v-btn variant="text" icon="mdi-chevron-left" @click="toggleSidebar" class="toggle-btn"></v-btn>
      </v-list-item>
      
      <div class="user-profile">
        <div class="avatar-container">
          <v-avatar size="60" class="profile-avatar">
            <v-img 
              :src="userAvatar" 
              alt="User Avatar"
              class="avatar-image"
              @error="onAvatarError"
            ></v-img>
          </v-avatar>
        </div>
        <div class="user-info">
          <div class="user-name">{{ userName }}</div>
          <div class="user-role">{{ userRole }}</div>
        </div>
      </div>
      
      <v-divider class="sidebar-divider"></v-divider>
      
      <v-list density="default" nav class="sidebar-list">
        <!-- Menu Items -->
        <v-list-item 
          v-for="item in menuItems" 
          :key="item.title" 
          :to="item.to" 
          :prepend-icon="item.icon" 
          :title="item.title"
          :value="item.value" 
          class="sidebar-item" 
          :class="{ 'active-item': $route.name === item.to.name }"
        >
          <template v-slot:append>
            <div class="item-indicator" v-if="$route.name === item.to.name"></div>
          </template>
        </v-list-item>

        <!-- Menu Groups -->
        <v-list-group 
          v-for="group in visibleMenuGroups" 
          :key="group.title" 
          class="sidebar-group"
          :value="isGroupActive(group)"
        >
          <template v-slot:activator="{ props }">
            <v-list-item 
              v-bind="props" 
              :prepend-icon="group.icon" 
              :title="group.title" 
              :value="group.value"
              class="sidebar-group-header"
            ></v-list-item>
          </template>
          <v-list-item 
            v-for="subItem in group.items" 
            :key="subItem.title" 
            :to="subItem.to" 
            :title="subItem.title"
            :value="subItem.value" 
            class="sidebar-subitem"
            :class="{ 'active-subitem': $route.name === subItem.to.name }"
          >
            <template v-slot:prepend>
              <v-icon size="18" class="subitem-icon">mdi-circle-small</v-icon>
            </template>
            <template v-slot:append>
              <div class="subitem-indicator" v-if="$route.name === subItem.to.name"></div>
            </template>
          </v-list-item>
        </v-list-group>
      </v-list>
      
      <div class="logout-container">
        <v-divider class="sidebar-divider"></v-divider>
        <v-list-item prepend-icon="mdi-logout" title="Log Out" value="logout" @click="logoutWarn" class="logout-item">
          <template v-slot:append>
            <v-icon class="logout-arrow">mdi-arrow-right</v-icon>
          </template>
        </v-list-item>
      </div>
    </v-navigation-drawer>

    <!-- Main content area -->
    <v-container fluid class="pa-0 content-container">
      <!-- Toggle button when sidebar is closed -->
      <v-btn 
        v-if="!isSidebarOpen" 
        icon="mdi-menu" 
        @click="toggleSidebar" 
        class="floating-toggle-btn"
      ></v-btn>
      <deleteWarnVue 
        :visible="log_dialog" 
        @close="log_dialog = false" 
        :item="deleteValue" 
        @delete="logOut" 
        :log="true" 
      />
      <div class="page-content">
        <router-view />
      </div>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
import deleteWarnVue from './deleteWarn.vue';

export default {
  name: 'Sidebar',
  components: { deleteWarnVue },
  data: () => ({
    isSidebarOpen: true,
    log_dialog: false,
    deleteValue: 'logout',
    logoSrc: '',
    defaultLogo: 'https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740',
    defaultAvatar: 'https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740',
    menuItems: [
      { title: 'Dashboard', icon: 'mdi-view-dashboard', to: { name: 'dash' }, value: 'dashboard' },
      { title: 'Category', icon: 'mdi-shape', to: { name: 'category' }, value: 'category' },
      { title: 'Clients', icon: 'mdi-account-multiple', to: { name: 'client' }, value: 'clients' },
      { title: 'Equipment', icon: 'mdi-tools', to: { name: 'equipment' }, value: 'equipment' },
      { title: 'Services', icon: 'mdi-cog', to: { name: 'serviceRequest' }, value: 'services' }
    ],
    menuGroups: [
      {
        title: 'Reminders', icon: 'mdi-bell', value: 'reminders',
        items: [
          { title: 'Preventive Reminders', to: { name: 'preventiveReminders' }, value: 'preventiveReminders' },
        ],
      },
      {
        title: 'Reports', icon: 'mdi-chart-box', value: 'reports',
        items: [
          { title: 'Client Report', to: { name: 'clientReport' }, value: 'clientReport' },
          { title: 'Equipment Report', to: { name: 'equipmentReport' }, value: 'equipmentReport' },
          { title: 'Service Report', to: { name: 'servicetReport' }, value: 'servicetReport' },
          { title: 'Technician Report', to: { name: 'technicianReport' }, value: 'technicianReport' },
        ],
      },
      {
        title: 'Users', icon: 'mdi-account-group', value: 'users',
        items: [
          { title: 'Admin', to: { name: 'admin' }, value: 'admin' },
          { title: 'Sub Admin', to: { name: 'subAdmin' }, value: 'subAdmin' },
          { title: 'Technician', to: { name: 'technician' }, value: 'technician' },
        ],
        visible: () => JSON.parse(localStorage.getItem('user'))?.role[0] === 'admin',
      },
      {
        title: 'Settings', icon: 'mdi-cog', value: 'settings',
        items: [
          { title: 'City', to: { name: 'cityPage' }, value: 'city' },
          { title: 'Care Of', to: { name: 'careOfPage' }, value: 'careOff' },
        ],
        visible: () => JSON.parse(localStorage.getItem('user'))?.role[0] !== 'Engineer',
      },
    ],
  }),
  computed: {
    visibleMenuGroups() {
      return this.menuGroups.filter(group => !group.visible || group.visible());
    },
    userInfo() {
      return JSON.parse(localStorage.getItem('user')) || { name: 'User', role: ['Guest'], avatar: '' };
    },
    userName() {
      return this.userInfo.name || 'User';
    },
    userRole() {
      return this.userInfo.role?.[0] || 'Guest';
    },
    userAvatar() {
      return this.userInfo.avatar || this.defaultAvatar;
    },
    isAdmin() {
      return this.userRole === 'admin';
    },
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    onAvatarError(event) {
      event.target.src = this.defaultAvatar;
    },
    onLogoError(event) {
      event.target.src = this.defaultLogo;
    },
    logoutWarn() {
      this.log_dialog = true;
    },
    isGroupActive(group) {
      return group.items.some(item => item.to.name === this.$route.name);
    },
    async logOut() {
      const auth = JSON.parse(localStorage.getItem('user'));
      try {
        await axios.get(`${process.env.VUE_APP_BASE_URL}auth/log_out`, {
          headers: { Authorization: 'Bearer ' + auth.access_token },
        });
        localStorage.clear();
        this.$router.push({ name: 'signIn' });
      } catch (error) {
        console.error('Logout error:', error);
        localStorage.clear();
        this.$router.push({ name: 'signIn' });
      }
    },
  },
  mounted() {
    try {
      this.logoSrc = require('../../public/LogoGQTC.png');
    } catch (e) {
      this.logoSrc = this.defaultLogo;
    }
  },
};
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  background-color: #e5e7eb;
  position: relative;
}

.modern-sidebar {
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%) !important;
  border-radius: 0 24px 24px 0;
  box-shadow: 5px 0 25px rgba(30, 64, 175, 0.3);
  position: relative;
  overflow: hidden;
  animation: slideIn 0.5s ease-out;
}

.modern-sidebar::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 800 800"><g fill="none" stroke="%231e40af" stroke-width="1"><path d="M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63"/><path d="M-31 229L237 261 390 382 731 737M520 660L309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63"/><path d="M520 660L309 538 295 764 731 737M520 660L309 538 40 599M520 660L731 737"/></g></svg>');
  opacity: 0.12;
  z-index: 0;
}

.sidebar-header {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.4), rgba(30, 64, 175, 0.15));
  height: 80px !important;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  position: relative;
  z-index: 1;
}

.logo {
  filter: brightness(1.4) contrast(1.3);
  transition: transform 0.3s ease, filter 0.3s ease;
}

.logo:hover {
  transform: scale(1.1);
  filter: brightness(1.6) contrast(1.4);
}

.toggle-btn {
  color: #93c5fd !important;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  transform: rotate(90deg);
  background: rgba(59, 130, 246, 0.4);
  color: white !important;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.user-profile {
  padding: 24px 20px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  background: linear-gradient(145deg, rgba(59, 130, 246, 0.15), transparent);
  border-radius: 12px;
  margin: 0 12px;
  animation: fadeIn 0.5s ease-out;
}

.avatar-container {
  margin-right: 15px;
}

.profile-avatar {
  border: 3px solid rgba(59, 130, 246, 0.5);
  box-shadow: 0 8px 16px rgba(30, 64, 175, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: glow 2s infinite;
}

.profile-avatar:hover {
  transform: scale(1.15);
  box-shadow: 0 12px 24px rgba(30, 64, 175, 0.6);
}

.avatar-image {
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  overflow: hidden;
}

.user-name {
  color: #ffffff;
  font-weight: 700;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.user-role {
  color: #93c5fd;
  font-size: 13px;
  font-weight: 500;
  opacity: 0.9;
}

.sidebar-divider {
  border-color: rgba(147, 197, 253, 0.15) !important;
  margin: 12px 0;
}

.sidebar-list {
  padding: 12px;
  position: relative;
  z-index: 1;
  overflow-y: auto;
  max-height: calc(100vh - 260px);
}

.sidebar-list::-webkit-scrollbar {
  width: 6px;
}

.sidebar-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
}

.sidebar-list::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.4);
  border-radius: 10px;
}

.sidebar-list::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.6);
}

.sidebar-item, .sidebar-group-header {
  border-radius: 12px;
  margin-bottom: 6px;
  color: #e0f2fe !important;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background: transparent;
}

.sidebar-item:hover, .sidebar-group-header:hover {
  background: rgba(59, 130, 246, 0.2) !important;
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
}

.active-item {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.25), rgba(30, 64, 175, 0.15)) !important;
  color: white !important;
  font-weight: 600;
}

.item-indicator {
  width: 4px;
  height: 25px;
  background: linear-gradient(to bottom, #60a5fa, #1e40af);
  border-radius: 4px;
  position: absolute;
  right: 0;
  transition: all 0.3s ease;
}

.sidebar-group {
  margin-bottom: 8px;
}

.sidebar-subitem {
  color: #bfdbfe !important;
  border-radius: 8px;
  margin-left: 12px;
  margin-bottom: 4px;
  padding-left: 12px !important;
  transition: all 0.3s ease;
  font-size: 14px;
  opacity: 0.9;
}

.sidebar-subitem:hover {
  background: rgba(59, 130, 246, 0.15) !important;
  opacity: 1;
}

.subitem-icon {
  color: #93c5fd;
  margin-right: -12px;
}

.active-subitem {
  background: rgba(59, 130, 246, 0.2) !important;
  color: white !important;
  font-weight: 500;
  opacity: 1;
}

.subitem-indicator {
  width: 3px;
  height: 18px;
  background: linear-gradient(to bottom, #60a5fa, #1e40af);
  border-radius: 3px;
}

.logout-container {
  position: absolute;
  bottom: 20px;
  width: 100%;
  padding: 0 12px;
  z-index: 5;
}

.logout-item {
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1));
  color: #fecaca !important;
  border-radius: 12px;
  margin-top: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.logout-item:hover {
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.15));
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.logout-arrow {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.logout-item:hover .logout-arrow {
  opacity: 1;
  transform: translateX(0);
}

.floating-toggle-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: linear-gradient(135deg, #60a5fa, #1e40af);
  color: white;
  border-radius: 12px;
  width: 50px;
  height: 50px;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  transition: all 0.3s ease;
  animation: glow 2s infinite;
}

.floating-toggle-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.6);
}

.content-container {
  flex: 1;
  position: relative;
  background-color: #e5e7eb;
  transition: all 0.3s ease;
}

.page-content {
  padding: 24px;
  height: 100%;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes glow {
  0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.6); }
  100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
}

/* Mobile Responsiveness */
@media (max-width: 960px) {
  .modern-sidebar {
    width: 240px !important;
  }
  
  .sidebar-header {
    height: 70px !important;
  }
  
  .user-profile {
    padding: 16px;
    margin: 0 8px;
  }
  
  .profile-avatar {
    width: 50px !important;
    height: 50px !important;
  }
  
  .sidebar-list {
    max-height: calc(100vh - 230px);
  }
}

@media (max-width: 600px) {
  .modern-sidebar {
    width: 100% !important;
    position: fixed !important;
    z-index: 999;
  }
  
  .floating-toggle-btn {
    width: 45px;
    height: 45px;
    top: 15px;
    left: 15px;
  }
  
  .page-content {
    padding: 16px;
  }
  
  .user-profile {
    padding: 12px;
  }
  
  .user-name {
    font-size: 14px;
  }
  
  .user-role {
    font-size: 12px;
  }
}
</style>