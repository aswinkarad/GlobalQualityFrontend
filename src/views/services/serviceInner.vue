<template>
  <v-container class="main-container" fluid>
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

    <v-card class="detail-card mt-6 rounded-lg pa-6" elevation="8">
      <v-card-title class="card-title">
        Service Request Details
      </v-card-title>
      <v-divider class="card-divider"></v-divider>
      <v-row class="detail-row">
        <v-col cols="12" md="4" class="detail-column">
          <div class="detail-item">
            <span class="detail-label">Client Name:</span>
            <span class="detail-value">{{ editServicetValue.sale?.client?.name || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Serial Number:</span>
            <span class="detail-value">{{ editServicetValue.sale?.serialNo || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Machine Name:</span>
            <span class="detail-value">{{ editServicetValue.sale?.equipment?.equipmentName || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Call Register Date:</span>
            <span class="detail-value">{{ editServicetValue.callRegisterDate?.split('T')[0] || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Call Handle:</span>
            <span class="detail-value">{{ editServicetValue.call_handle?.callHandle || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Priority:</span>
            <span class="detail-value">{{ editServicetValue.priority?.priority || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Service Type:</span>
            <span class="detail-value">{{ editServicetValue.service_type?.type || 'N/A' }}</span>
          </div>
        </v-col>
        <v-col cols="12" md="4" class="detail-column">
          <div class="detail-item">
            <span class="detail-label">City:</span>
            <span class="detail-value">{{ editServicetValue.sale?.client?.city?.city || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Working Condition:</span>
            <span class="detail-value">{{ editServicetValue.working_condition?.workingCondition || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Assigned To:</span>
            <span class="detail-value">{{ editServicetValue.user?.username || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Service By:</span>
            <span class="detail-value">{{ editServicetValue.service_by || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Request Type:</span>
            <span class="detail-value">{{ editServicetValue.request_type?.type || 'N/A' }}</span>
          </div>
        </v-col>
        <v-col cols="12" md="4" class="detail-column">
          <div class="detail-item">
            <span class="detail-label">Status:</span>
            <v-chip :color="getStatusColor(editServicetValue.working_status?.workingStatus)" class="status-chip">
              {{ editServicetValue.working_status?.workingStatus || 'N/A' }}
            </v-chip>
          </div>
          <div class="detail-item">
            <span class="detail-label">Created At:</span>
            <span class="detail-value">{{ editServicetValue.createdAt?.split('T')[0] || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Updated At:</span>
            <span class="detail-value">{{ editServicetValue.updatedAt?.split('T')[0] || 'N/A' }}</span>
          </div>
          <div class="detail-item detail-item-full">
            <span class="detail-label">Problem Description:</span>
            <span class="detail-value">{{ editServicetValue.description || 'N/A' }}</span>
          </div>
          <div class="detail-item detail-item-full">
            <span class="detail-label">Solution Provided:</span>
            <span class="detail-value">{{ editServicetValue.solutionProvided || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Is Approved by CEO:</span>
            <span class="detail-value">{{ editServicetValue.isApprovedByCEO ? 'Yes' : 'No' }}</span>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="detail-card mt-6 rounded-lg pa-6" elevation="8">
      <v-card-title class="card-title">
        <v-icon left color="#4d90fe">mdi-file-document-multiple-outline</v-icon>
        Documents
      </v-card-title>
      <v-divider class="card-divider"></v-divider>
      <v-row>
        <v-col cols="12">
          <div v-if="processedDocuments && processedDocuments.length > 0">
            <v-list dense class="document-list">
              <v-list-item v-for="(doc, docIndex) in processedDocuments" :key="'doc-' + docIndex"
                class="document-list-item">
                <template v-slot:prepend>
                  <v-icon :color="getFileIconColor(doc.name || doc.filename || doc.originalName)">{{
                    getFileIcon(doc.name || doc.filename || doc.originalName) }}</v-icon>
                </template>
                <v-list-item-title class="document-name">
                  {{ doc.name || doc.filename || doc.originalName || `Document ${docIndex + 1}` }}
                </v-list-item-title>
                <template v-slot:append>
                  <div class="document-actions">
                    <v-btn icon size="small" @click="handleDocumentView(doc)" class="action-button"
                      title="View Document" :disabled="!doc.url && !doc.path">
                      <v-icon color="primary">mdi-eye</v-icon>
                    </v-btn>
                    <v-btn v-if="doc.url || doc.path" icon size="small" @click="downloadDocument(doc)"
                      class="action-button" title="Download Document" :disabled="!doc.url && !doc.path">
                      <v-icon color="success">mdi-download</v-icon>
                    </v-btn>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </div>
          <span v-else class="no-data-message">
            <v-icon left>mdi-information-outline</v-icon>
            No documents available
          </span>
        </v-col>
      </v-row>
    </v-card>

    <v-dialog v-model="imageViewDialog" max-width="800" :fullscreen="$vuetify.display.xs">
      <v-card>
        <v-card-title class="headline dialog-title">
          Image Preview
          <v-spacer></v-spacer>
          <v-btn v-if="$vuetify.display.xs" icon @click="imageViewDialog = false" aria-label="Close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-img :src="currentDocumentUrl" contain :max-height="$vuetify.display.xs ? '70vh' : '600'"></v-img>
        </v-card-text>
        <v-card-actions v-if="!$vuetify.display.xs">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="imageViewDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="pdfViewDialog" max-width="900" fullscreen content-class="pdf-dialog-fullscreen">
      <v-card>
        <v-card-title class="headline d-flex justify-space-between align-center dialog-title">
          PDF Preview
          <v-btn icon @click="pdfViewDialog = false" aria-label="Close PDF viewer">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pdf-viewer-container">
          <iframe :src="currentDocumentUrl" width="100%" height="100%" frameborder="0"></iframe>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-card class="detail-card mt-6 rounded-lg pa-6" elevation="8">
      <v-card-title class="card-title">
        <v-icon left color="#4d90fe">mdi-timeline-text-outline</v-icon>
        Activity Log
      </v-card-title>
      <v-divider class="card-divider"></v-divider>
      <v-row class="align-center mb-4">
        <v-col cols="12" sm="8" md="6">
          <v-text-field v-model="activitySearch" append-inner-icon="mdi-magnify" label="Search Activity" single-line
            hide-details outlined dense clearable class="activity-search-field"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div v-if="paginatedActivity && paginatedActivity.length > 0">
            <v-timeline dense clipped class="activity-timeline">
              <v-timeline-item v-for="(activity, index) in paginatedActivity" :key="activity.id || index" size="small"
                :color="getActivityColor(activity.action)" class="activity-timeline-item" icon="mdi-circle-small"
                fill-dot>
                <template v-slot:opposite>
                  <span class="text-caption activity-date clickable-date"
                    @click="toggleActivityDetails(activity.id || index)">
                    {{ formatActivityDate(activity.actionDate) }}
                    <v-icon small class="ml-1">
                      {{ expandedActivities.includes(activity.id || index) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                    </v-icon>
                  </span>
                </template>
                <div class="activity-content">
                  <div class="font-weight-bold activity-action-by">
                    <v-icon small left :color="getActivityColor(activity.action)">{{ getActivityIcon(activity.action)
                    }}</v-icon>
                    {{ getUserName(activity.actionBy) }}
                    <span class="text-caption grey--text ml-2">({{ activity.action }})</span>
                  </div>
                  <v-expand-transition>
                    <div v-if="expandedActivities.includes(activity.id || index)" class="activity-details mt-2">
                      <p class="mb-0 text-caption activity-changes-label">Changes:</p>
                      <div class="activity-details-list">
                        <div v-for="(detail, key) in filteredActivityDetails(activity)" :key="key" class="activity-detail-item">
                          <strong>{{ formatDetailKey(key) }}:</strong>
                          <span v-if="detail && typeof detail === 'object' && 'old' in detail && 'new' in detail"
                            class="change-tracking">
                            <span class="old-value">"{{ formatDetailValue(detail.old, key) }}"</span>
                            <v-icon small class="mx-1 change-arrow">mdi-arrow-right</v-icon>
                            <span class="new-value">"{{ formatDetailValue(detail.new, key) }}"</span>
                          </span>
                          <span v-else class="single-value">
                            {{ formatDetailValue(detail, key) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </v-expand-transition>
                  <div
                    v-if="expandedActivities.includes(activity.id || index) && (!filteredActivityDetails(activity) || Object.keys(filteredActivityDetails(activity)).length === 0)"
                    class="text-caption no-activity-details mt-2">
                    <v-icon small left>mdi-information-outline</v-icon>
                    No specific details available.
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>
            <div class="d-flex justify-center mt-4" v-if="totalActivityPages > 1">
              <v-pagination v-model="activityCurrentPage" :length="totalActivityPages" :total-visible="$vuetify.display.xs ? 5 : 7"
                color="primary" rounded="circle"></v-pagination>
            </div>
          </div>
          <span v-else class="no-data-message">
            <v-icon left>mdi-information-outline</v-icon>
            No activity log available for the current search/filters.
          </span>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="detail-card mt-6 rounded-lg pa-6" elevation="8">
      <v-card-title class="card-title">
        <v-icon left color="#4d90fe">mdi-message-text-outline</v-icon>
        Messages & Chat
      </v-card-title>
      <v-divider class="card-divider"></v-divider>
      
      <!-- Mobile: Stack messages and chat vertically -->
      <div class="mobile-message-layout">
        <v-row>
          <v-col cols="12" :md="6" class="message-threads-col">
            <h3 class="section-subtitle">
              <v-icon left color="#78909C">mdi-email-multiple-outline</v-icon>
              Message Threads
            </h3>
            <div v-if="isLoadingMessages" class="loading-message">
              <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
              Loading messages...
            </div>
            <div v-else-if="messageError" class="error-message">
              <v-icon left color="error">mdi-alert-circle-outline</v-icon>
              Error: {{ messageError }}
            </div>
            <div v-else-if="messages && messages.length > 0">
              <v-list dense class="message-threads-list">
                <v-list-item v-for="message in messages" :key="message.id" @click="fetchChatMessages(message.id)"
                  :class="{ 'selected-message-thread': selectedMessageId === message.id }" class="message-thread-item">
                  <v-list-item-content>
                    <v-list-item-title class="font-weight-medium message-subject">
                      <v-icon small left color="#42A5F5">mdi-message-outline</v-icon>
                      {{ message.subject }}
                      <v-chip v-if="message.unreadCount > 0" color="red" size="small" class="unread-chip">
                        {{ message.unreadCount }} New
                      </v-chip>
                    </v-list-item-title>
                    <v-list-item-subtitle class="message-preview">{{ message.message }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
            <div v-else class="no-data-message">
              <v-icon left>mdi-information-outline</v-icon>
              No message threads available for this service request.
            </div>
          </v-col>

          <v-col cols="12" :md="6" class="chat-history-col">
            <h3 class="section-subtitle">
              <v-icon left color="#78909C">mdi-chat-processing-outline</v-icon>
              Chat History
            </h3>
            <div v-if="isLoadingChats" class="loading-message">
              <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
              Loading chat...
            </div>
            <div v-else-if="chatError" class="error-message">
              <v-icon left color="error">mdi-alert-circle-outline</v-icon>
              Error: {{ chatError }}
            </div>
            <div v-else-if="selectedMessageId && chatMessagesWithSenderInfo.length > 0">
              <div class="chat-history-container">
                <div class="chat-history-list">
                  <div v-for="chat in chatMessagesWithSenderInfo" :key="chat.id"
                    :class="{ 'my-message': chat.isCurrentUser, 'other-message': !chat.isCurrentUser }"
                    class="chat-bubble-item">
                    <div :class="chat.isCurrentUser ? 'my-message-content' : 'other-message-content'" class="chat-bubble">
                      <div class="font-weight-bold chat-sender">
                        <v-icon small left
                          :color="chat.isCurrentUser ? 'white' : '#607D8B'">mdi-account-circle-outline</v-icon>
                        {{ chat.sender?.username || 'Unknown User' }}
                      </div>
                      <div class="chat-message-text">
                        {{ chat.message }}
                      </div>
                      <div class="text-caption chat-timestamp">
                        <v-icon x-small left :color="chat.isCurrentUser ? 'white' : '#999'">mdi-clock-outline</v-icon>
                        {{ formatChatDate(chat.createdAt) }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="chat-input-area">
                  <v-text-field v-model="newChatMessage" label="Type your message" outlined dense hide-details
                    @keyup.enter="sendChatMessage" class="chat-text-field"></v-text-field>
                  <v-btn icon color="primary" @click="sendChatMessage" :disabled="!newChatMessage.trim()"
                    class="send-button">
                    <v-icon>mdi-send</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
            <div v-else-if="selectedMessageId" class="no-data-message">
              <v-icon left>mdi-information-outline</v-icon>
              No chat messages for this thread yet. Start a conversation!
              <div class="chat-input-area mt-3">
                <v-text-field v-model="newChatMessage" label="Type your message" outlined dense hide-details
                  @keyup.enter="sendChatMessage" class="chat-text-field"></v-text-field>
                <v-btn icon color="primary" @click="sendChatMessage" :disabled="!newChatMessage.trim()"
                  class="send-button">
                  <v-icon>mdi-send</v-icon>
                </v-btn>
              </div>
            </div>
            <div v-else class="no-data-message">
              <v-icon left>mdi-message-arrow-right-outline</v-icon>
              Select a message thread to view chat history.
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';

export default {
  name: 'ServiceInner',
  data() {
    return {
      selectedMessageId: null,
      newChatMessage: '',
      currentUser: null,
      users: [],
      expandedActivities: [],
      activitySearch: '',
      activityCurrentPage: 1,
      activityItemsPerPage: 5,
      imageViewDialog: false,
      pdfViewDialog: false,
      currentDocumentUrl: '',
      isLoadingService: false,
      isSendingMessage: false,
    };
  },

  computed: {
    ...mapState('service', ['editServicetValue']),
    ...mapState('message', {
      rawMessages: 'MessageList',
      chatMessages: 'ChatList',
      isLoadingMessages: 'loading',
      isLoadingChats: 'loading',
      messageError: 'error',
      chatError: 'error',
    }),
    ...mapGetters('message', ['getAllMessages', 'getChatMessages']),
    ...mapGetters('user', {
      allUsers: 'getAllUsers'
    }),

    breadcrumbs() {
      return [
        { text: 'Home', disabled: false, href: '/' },
        { text: 'Service Requests', disabled: false, href: '/service-requests' },
        {
          text: this.editServicetValue?.sale?.serialNo || 'Service Request',
          disabled: true,
          href: '#'
        },
      ];
    },

    processedDocuments() {
      const rawDocuments = this.editServicetValue?.documents;
      if (!rawDocuments?.length) return [];

      let documents = [];
      if (typeof rawDocuments === 'string') {
        try {
          documents = JSON.parse(rawDocuments);
        } catch {
          documents = [rawDocuments];
        }
      } else {
        documents = Array.isArray(rawDocuments) ? rawDocuments : [rawDocuments];
      }

      return documents
        .map((doc, index) => this.normalizeDocumentObject(doc, index))
        .filter(doc => doc.url || doc.path);
    },

    filteredActivity() {
      const allActivity = this.editServicetValue?.all_activity;
      if (!Array.isArray(allActivity)) return [];

      let filtered = [...allActivity];
      if (this.activitySearch) {
        const searchTerm = this.activitySearch.toLowerCase();
        filtered = filtered.filter(activity =>
          this.activityMatchesSearch(activity, searchTerm)
        );
      }
      return filtered.sort((a, b) => new Date(b.actionDate) - new Date(a.actionDate));
    },

    paginatedActivity() {
      const start = (this.activityCurrentPage - 1) * this.activityItemsPerPage;
      return this.filteredActivity.slice(start, start + this.activityItemsPerPage);
    },

    totalActivityPages() {
      return Math.ceil(this.filteredActivity.length / this.activityItemsPerPage);
    },

    messages() {
      const currentServiceId = this.editServicetValue?.id;
      if (!currentServiceId || !this.rawMessages?.length) {
        return [];
      }
      return this.rawMessages.filter(message => message.serviceRequestId === currentServiceId);
    },

    chatMessagesWithSenderInfo() {
      if (!this.chatMessages?.length || !this.currentUser) {
        return [];
      }

      const processedChats = this.chatMessages.map(chat => ({
        ...chat,
        isCurrentUser: chat.senderId === this.currentUser.id,
        sender: this.findUserById(chat.senderId),
      }));
      return processedChats;
    },

    filteredActivityDetails() {
      return (activity) => {
        if (!activity.details || typeof activity.details !== 'object') return {};
        return Object.fromEntries(
          Object.entries(activity.details).filter(
            ([key]) => !['attendedOn', 'completedOn', 'type'].includes(key)
          )
        );
      };
    },
  },

  watch: {
    editServicetValue: {
      handler(newValue) {
        if (newValue?.id && this.shouldFetchMessages(newValue.id)) {
          this.fetchMessagesForServiceRequest(newValue.id);
        }
      },
      deep: true,
      immediate: true,
    },

    activitySearch() {
      this.activityCurrentPage = 1;
    },

    allUsers: {
      handler(newUsers) {
        if (newUsers?.length > 0) {
          this.$nextTick(() => {
            this.updateCombinedUsers();
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    ...mapActions('service', ['GET_SERVICE_WITH_ID']),
    ...mapActions('message', [
      'GET_MESSAGE_LIST',
      'GET_CHAT_MESSAGES',
      'ADD_CHAT',
      'MARK_CHATS_AS_READ'
    ]),
    ...mapActions('user', ['GET_USER_LIST']),

    formatActivityDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    formatChatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    async getServiceDetails() {
      try {
        this.isLoadingService = true;
        const serviceId = String(this.$route.params.id);
        await this.GET_SERVICE_WITH_ID(serviceId);
      } catch (error) {
        this.$toast?.error('Failed to load service details');
      } finally {
        this.isLoadingService = false;
      }
    },

    shouldFetchMessages(serviceId) {
      return true;
    },

    async fetchMessagesForServiceRequest(serviceRequestId) {
      try {
        await this.GET_MESSAGE_LIST({ serviceRequestId });
      } catch (error) {
        this.$toast?.error('Failed to load messages');
      }
    },

    async fetchChatMessages(messageId) {
      this.selectedMessageId = messageId;
      try {
        await this.GET_CHAT_MESSAGES({ messageId });
        await this.markUnreadChatsAsRead();
      } catch (error) {
        this.$toast?.error('Failed to load chat messages');
      }
    },

    async markUnreadChatsAsRead() {
      const unreadChatIds = this.chatMessages
        .filter(chat => !chat.readStatus && chat.senderId !== this.currentUser?.id)
        .map(chat => chat.id);

      if (unreadChatIds.length > 0) {
        await this.MARK_CHATS_AS_READ(unreadChatIds);
        await this.fetchMessagesForServiceRequest(this.editServicetValue.id);
      }
    },

    async sendChatMessage() {
      if (!this.canSendMessage()) return;

      try {
        this.isSendingMessage = true;
        const payload = {
          message: this.newChatMessage.trim(),
          messageId: this.selectedMessageId,
          senderId: this.currentUser.id,
        };

        await this.ADD_CHAT(payload);
        this.newChatMessage = '';

        await this.GET_CHAT_MESSAGES({ messageId: this.selectedMessageId });
        await this.fetchMessagesForServiceRequest(this.editServicetValue.id);

        this.$toast?.success('Message sent successfully');
      } catch (error) {
        this.$toast?.error('Failed to send message');
      } finally {
        this.isSendingMessage = false;
      }
    },

    canSendMessage() {
      return this.newChatMessage.trim() &&
        this.selectedMessageId &&
        this.currentUser &&
        !this.isSendingMessage;
    },

    loadCurrentUser() {
      try {
        const userStr = localStorage.getItem('user');
        this.currentUser = userStr ? JSON.parse(userStr) : null;
      } catch (error) {
        this.currentUser = null;
        console.error("Error parsing user from localStorage:", error);
      }
    },

    updateCombinedUsers() {
      if (!this.allUsers?.length) {
        this.users = [];
        return;
      }

      const userMap = new Map();
      this.allUsers.forEach(user => {
        if (user?.id && user?.username && !userMap.has(user.id)) {
          userMap.set(user.id, user);
        }
      });
      this.users = Array.from(userMap.values());
    },

    findUserById(userId) {
      return this.users.find(user => user.id === userId);
    },

    getUserName(userId) {
      if (userId == null) return 'N/A';
      const user = this.findUserById(userId);
      return user?.username || `User ${userId} (Unknown)`;
    },

    normalizeDocumentObject(doc, index) {
      if (typeof doc === 'string') {
        const filename = doc.split('/').pop() || `Document ${index + 1}`;
        return {
          name: filename,
          filename,
          url: doc,
          path: doc,
          originalName: filename,
        };
      }

      if (doc && typeof doc === 'object') {
        return {
          name: doc.name || doc.filename || doc.originalName || `Document ${index + 1}`,
          filename: doc.filename || doc.name || `Document ${index + 1}`,
          url: doc.url || doc.path,
          path: doc.path || doc.url,
          originalName: doc.originalName || doc.name || doc.filename || `Document ${index + 1}`,
        };
      }
      return {};
    },

    getFileIcon(filename) {
      if (!filename) return 'mdi-file';
      const ext = filename.toLowerCase().split('.').pop();
      const iconMap = {
        pdf: 'mdi-file-pdf-box',
        doc: 'mdi-file-word-box',
        docx: 'mdi-file-word-box',
        txt: 'mdi-file-document',
        jpg: 'mdi-file-image',
        jpeg: 'mdi-file-image',
        png: 'mdi-file-image',
        gif: 'mdi-file-image',
        bmp: 'mdi-file-image',
        zip: 'mdi-file-zip',
        rar: 'mdi-file-zip',
        xls: 'mdi-file-excel',
        xlsx: 'mdi-file-excel',
      };
      return iconMap[ext] || 'mdi-file';
    },

    getFileIconColor(filename) {
      if (!filename) return 'grey';
      const ext = filename.toLowerCase().split('.').pop();
      const colorMap = {
        pdf: 'red darken-2',
        doc: 'blue darken-1',
        docx: 'blue darken-1',
        txt: 'grey darken-1',
        jpg: 'purple darken-1',
        jpeg: 'purple darken-1',
        png: 'purple darken-1',
        gif: 'purple darken-1',
        bmp: 'purple darken-1',
        zip: 'orange darken-2',
        rar: 'orange darken-2',
        xls: 'green darken-2',
        xlsx: 'green darken-2',
      };
      return colorMap[ext] || 'grey';
    },

    handleDocumentView(doc) {
      const url = doc.url || doc.path;
      if (!url) return;
      const fullUrl = this.buildFullDocumentUrl(url);
      const ext = (doc.name || doc.filename || '').toLowerCase().split('.').pop();
      this.currentDocumentUrl = fullUrl;
      if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext)) {
        this.imageViewDialog = true;
      } else if (ext === 'pdf') {
        this.pdfViewDialog = true;
      } else {
        window.open(fullUrl, '_blank');
      }
    },

    downloadDocument(doc) {
      const url = doc.url || doc.path;
      if (!url) return;
      try {
        const link = document.createElement('a');
        link.href = this.buildFullDocumentUrl(url);
        link.download = doc.name || doc.filename || doc.originalName || 'document';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        this.$toast?.error('Failed to download document');
      }
    },

    buildFullDocumentUrl(url) {
      if (url.startsWith('http')) return url;
      const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3025';
      const separator = url.startsWith('/') ? '' : '/';
      return `${baseUrl}${separator}${url}`;
    },

    activityMatchesSearch(activity, searchTerm) {
      const actionMatch = activity.action?.toLowerCase().includes(searchTerm);
      const userMatch = this.getUserName(activity.actionBy).toLowerCase().includes(searchTerm);
      const detailsMatch = this.filteredActivityDetails(activity) ?
        JSON.stringify(this.filteredActivityDetails(activity)).toLowerCase().includes(searchTerm) : false;
      return actionMatch || userMatch || detailsMatch;
    },

    getActivityColor(action) {
      const colorMap = {
        CREATE: 'green',
        UPDATE: 'blue',
        DELETE: 'red',
      };
      return colorMap[action] || 'grey';
    },

    getActivityIcon(action) {
      const iconMap = {
        CREATE: 'mdi-plus-circle-outline',
        UPDATE: 'mdi-pencil-circle-outline',
        DELETE: 'mdi-delete-circle-outline',
      };
      return iconMap[action] || 'mdi-information-outline';
    },

    toggleActivityDetails(activityIdOrIndex) {
      const index = this.expandedActivities.indexOf(activityIdOrIndex);
      if (index > -1) {
        this.expandedActivities.splice(index, 1);
      } else {
        this.expandedActivities.push(activityIdOrIndex);
      }
    },

    getStatusColor(status) {
      const statusColors = {
        'Open': '#1985d0',
        'In Progress': '#20ad8c',
        'Completed': '#fd5e00',
        'Canceled': '#dc3545',
        'Verified': '#1ad539'
      };
      return statusColors[status] || 'grey';
    },

    formatDetailKey(key) {
      const customKeys = {
        callHandleId: 'Call Handle',
        priorityId: 'Priority',
        serviceTypeId: 'Name',
        workingStatusId: 'Working Status',
        workingConditionId: 'Working Condition',
        saleId: 'Name',
        userId: 'User',
        description: 'Problem Description',
        solutionProvided: 'Solution Provided',
        isApprovedByCEO: 'Approved by CEO',
        serialNo: 'Serial Number',
        equipmentName: 'Machine Name',
        clientName: 'Client Name',
        city: 'City',
        callRegisterDate: 'Call Register Date',
        service_by: 'Service By',
        requestTypeId: 'Request Type',
        createdAt: 'Created At',
        updatedAt: 'Updated At',
        documents: 'Documents',
        id: 'Name',
      };
      return customKeys[key] || (key.endsWith('Id') ? 'Name' : key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
    },

    formatDetailValue(value, key) {
      if (['attendedOn', 'completedOn', 'type'].includes(key)) {
        return null;
      }
      if (value === null || value === undefined) {
        return 'N/A';
      }
      const userRelatedKeys = ['userId', 'actionBy', 'senderId', 'assignedToId'];
      if (userRelatedKeys.includes(key)) {
        if (typeof value === 'object' && value !== null) {
          return value.username || this.getUserName(value.id) || 'Unknown User';
        }
        return this.getUserName(value);
      }
      if (key === 'service_by') {
        if (typeof value === 'object' && value !== null) {
          return value.username || value.name || 'Unknown';
        }
        return value || 'N/A';
      }
      if (key.endsWith('Id') && typeof value === 'number') {
        const displayValue = this.getDisplayValueForId(key, value);
        if (displayValue) {
          return displayValue;
        }
      }
      if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
      }
      if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
        return new Date(value).toLocaleDateString();
      }
      if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString();
        }
      }
      if (Array.isArray(value)) {
        if (key === 'documents') {
          const docNames = value.map(url => {
            try {
              const parsed = typeof url === 'string' ? url : (url.path || url.url);
              return parsed ? parsed.split('/').pop() : '';
            } catch (e) {
              return '';
            }
          }).filter(Boolean);
          return docNames.length > 0 ? docNames.join(', ') : 'None';
        }
        return value.map(item => this.extractValueFromObject(item) || item).join(', ');
      }
      if (typeof value === 'object' && value !== null) {
        if (value.hasOwnProperty('old') && value.hasOwnProperty('new')) {
          const oldValue = this.formatDetailValue(value.old, key);
          const newValue = this.formatDetailValue(value.new, key);
          if ((oldValue === 'N/A' || oldValue === null) && newValue !== 'N/A' && newValue !== null) {
            return `"${newValue}"`;
          }
          return oldValue === newValue ? `"${newValue}"` : `"${oldValue}" → "${newValue}"`;
        }
        if (this.isLookupObject(value)) {
          return this.extractDisplayValue(value);
        }
        if (key === 'createdData' || !key.endsWith('Id')) {
          try {
            let parsedData = value;
            if (typeof value === 'string') {
              parsedData = JSON.parse(value);
            }
            if (typeof parsedData === 'object' && parsedData !== null) {
              const formattedEntries = Object.entries(parsedData)
                .map(([k, v]) => {
                  const formattedValue = this.formatDetailValue(v, k);
                  if (formattedValue === null) {
                    return null;
                  }
                  const formattedKey = this.formatDetailKey(k);
                  if (k.endsWith('Id') && typeof v === 'number' && formattedValue === 'N/A') {
                    return null;
                  }
                  return `${formattedKey}: "${formattedValue}"`;
                })
                .filter(entry => entry !== null)
                .join('; ');
              return formattedEntries || 'No details';
            }
          } catch (e) {
            return JSON.stringify(value);
          }
        }
        return this.extractValueFromObject(value);
      }
      if (typeof value === 'string') {
        return value.replace(/^"(.*)"$/, '$1');
      }
      return value;
    },

    isLookupObject(obj) {
      const lookupPatterns = [
        'name', 'username', 'priority', 'callHandle', 'workingStatus',
        'workingCondition', 'type', 'equipmentName', 'city'
      ];
      return obj.id !== undefined && lookupPatterns.some(prop => obj[prop] !== undefined);
    },

    extractDisplayValue(obj) {
      const displayProps = [
        'username', 'name', 'priority', 'callHandle', 'workingStatus',
        'workingCondition', 'type', 'equipmentName', 'city', 'serialNo'
      ];
      for (const prop of displayProps) {
        if (obj[prop] !== undefined && obj[prop] !== null) {
          return obj[prop];
        }
      }
      return obj.id;
    },

    getDisplayValueForId(idKey, idValue) {
      if (!this.editServicetValue || idValue === null || idValue === undefined) return null;
      const lookupMap = {
        'priorityId': () => this.editServicetValue.priority?.priority,
        'callHandleId': () => this.editServicetValue.call_handle?.callHandle,
        'workingStatusId': () => this.editServicetValue.working_status?.workingStatus,
        'workingConditionId': () => this.editServicetValue.working_condition?.workingCondition,
        'serviceTypeId': () => this.editServicetValue.service_type?.type,
        'requestTypeId': () => this.editServicetValue.request_type?.type,
        'saleId': () => this.editServicetValue.sale?.serialNo,
        'userId': () => this.getUserName(idValue),
      };
      const lookup = lookupMap[idKey];
      return lookup ? lookup() : null;
    },

    extractValueFromObject(obj) {
      if (this.isLookupObject(obj)) {
        return this.extractDisplayValue(obj);
      }
      const specificKeys = [
        'username', 'name', 'filename', 'originalName',
        'priority', 'callHandle', 'workingCondition', 'workingStatus', 'type',
        'serialNo', 'equipmentName', 'city', 'description', 'solutionProvided',
      ];
      for (const key of specificKeys) {
        if (obj[key] !== undefined && obj[key] !== null) {
          return obj[key];
        }
      }
      if ('old' in obj && 'new' in obj) {
        const oldValue = this.extractValueFromObject(obj.old);
        const newValue = this.extractValueFromObject(obj.new);
        return `"${oldValue}" → "${newValue}"`;
      }
      if (obj.id && obj.name) return obj.name;
      if (obj.id && obj.value) return obj.value;
      if (Object.keys(obj).length === 1 && obj[Object.keys(obj)[0]]) {
        return obj[Object.keys(obj)[0]];
      }
      try {
        const simpleObj = {};
        for (const k in obj) {
          if (typeof obj[k] !== 'object' && !Array.isArray(obj[k])) {
            simpleObj[this.formatDetailKey(k)] = obj[k];
          }
        }
        return Object.keys(simpleObj).length > 0
          ? JSON.stringify(simpleObj).replace(/[{}"']/g, '')
          : JSON.stringify(obj);
      } catch (e) {
        return String(obj);
      }
    },
  },

  async mounted() {
    this.loadCurrentUser();
    try {
      await this.GET_USER_LIST();
      await this.getServiceDetails();
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  },
};
</script>

<style scoped>
/* ===== MOBILE-FIRST RESPONSIVE DESIGN ===== */

/* Base Mobile Styles (320px and up) */
.main-container {
  padding: 12px;
  background: linear-gradient(to right bottom, #eef7ff, #f7fdff);
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #333;
}

/* Breadcrumbs - Mobile First */
.breadcrumbs-container {
  background-color: #3f51b5;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 0.85rem;
}

.custom-breadcrumb-item {
  color: white !important;
  font-size: 0.85rem !important;
}

.custom-breadcrumb-item.v-breadcrumbs-item--disabled {
  opacity: 0.7;
}

/* Cards - Mobile First */
.detail-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.card-title .v-icon {
  margin-right: 8px;
  font-size: 1.4rem;
}

.card-divider {
  margin: 12px 0;
  border-color: rgba(0, 0, 0, 0.08);
}

/* Service Request Details - Mobile First */
.detail-row {
  margin: 0;
}

.detail-column {
  padding: 8px 0;
}

.detail-item {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
  margin-bottom: 2px;
}

.detail-value {
  color: #555;
  font-weight: 400;
  font-size: 0.9rem;
  word-break: break-word;
}

.detail-item-full {
  grid-column: 1 / -1;
}

.status-chip {
  height: 24px;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 12px;
  padding: 0 10px;
  align-self: flex-start;
}

/* Documents Section - Mobile First */
.document-list {
  background-color: #fcfcfc;
  border-radius: 8px;
  padding: 4px 0;
  border: 1px solid #e0e0e0;
  max-height: 250px;
  overflow-y: auto;
}

.document-list-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 10px 12px;
  transition: background-color 0.2s;
}

.document-list-item:hover {
  background-color: #eef7ff;
}

.document-list-item:last-child {
  border-bottom: none;
}

.document-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #424242;
  word-break: break-word;
}

.document-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.action-button {
  min-width: 32px !important;
  width: 32px !important;
  height: 32px !important;
}

.action-button .v-icon {
  font-size: 1.1rem;
}

/* Activity Log - Mobile First */
.activity-search-field {
  width: 100%;
}

.activity-timeline {
  padding-left: 12px;
}

.activity-timeline-item {
  padding-bottom: 20px;
}

.activity-date {
  font-size: 0.75rem;
  color: #78909C;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  user-select: none;
  font-weight: 500;
  word-break: break-word;
}

.activity-date:hover {
  color: #4d90fe;
}

.activity-content {
  background-color: #fefefe;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  margin-left: 8px;
  border-left: 3px solid #4d90fe;
}

.activity-action-by {
  font-size: 0.95rem;
  color: #37474F;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  font-weight: 600;
  flex-wrap: wrap;
}

.activity-action-by .v-icon {
  margin-right: 6px;
  font-size: 1.1rem;
}

.activity-details {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #e5e5e5;
}

.activity-changes-label {
  color: #607D8B;
  font-weight: 600;
  font-size: 0.8rem;
  margin-bottom: 6px;
}

.activity-details-list {
  font-size: 0.85rem;
  color: #607D8B;
}

.activity-detail-item {
  margin-bottom: 6px;
  padding-left: 12px;
  position: relative;
  word-break: break-word;
}

.activity-detail-item::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #4d90fe;
  font-size: 1.1em;
  top: 0;
}

.change-tracking .old-value {
  color: #e74c3c;
  text-decoration: line-through;
}

.change-tracking .new-value {
  color: #28a745;
  font-weight: bold;
}

.change-tracking .change-arrow {
  color: #555;
  margin: 0 2px;
}

.no-activity-details {
  display: flex;
  align-items: center;
  color: #90A4AE;
  font-style: italic;
  font-size: 0.8rem;
}

/* Messages & Chat - Mobile First */
.mobile-message-layout {
  width: 100%;
}

.message-threads-col,
.chat-history-col {
  padding: 8px 0;
}

.section-subtitle {
  font-size: 1.1rem;
  font-weight: 600;
  color: #263238;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.section-subtitle .v-icon {
  margin-right: 6px;
  font-size: 1.3rem;
}

.loading-message,
.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 8px;
  margin: 8px 0;
  font-style: italic;
  font-size: 0.9rem;
}

.loading-message {
  background-color: #e3f2fd;
  color: #2196f3;
}

.error-message {
  background-color: #ffebee;
  color: #f44336;
}

/* Message Threads - Mobile First */
.message-threads-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
  padding: 4px;
}

.message-thread-item {
  border-bottom: 1px solid #f5f5f5;
  padding: 12px;
  transition: all 0.2s;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom: 4px;
}

.message-thread-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.message-thread-item:hover {
  background-color: #eef7ff;
}

.selected-message-thread {
  background-color: #e3f2fd !important;
  border-left: 3px solid #2196F3;
}

.message-subject {
  font-size: 0.95rem;
  color: #37474F;
  display: flex;
  align-items: center;
  font-weight: 600;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.message-subject .v-icon {
  margin-right: 6px;
}

.message-preview {
  font-size: 0.85rem;
  color: #607D8B;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.unread-chip {
  height: 20px;
  font-size: 0.7rem;
  margin-left: 8px;
  border-radius: 10px;
  font-weight: 700;
  background-color: #EF5350 !important;
  color: white !important;
}

/* Chat History - Mobile First */
.chat-history-container {
  display: flex;
  flex-direction: column;
  height: 400px;
}

.chat-history-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  background-color: #fcfcfc;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 320px;
}

.chat-bubble-item {
  display: flex;
  width: 100%;
}

.my-message {
  justify-content: flex-end;
}

.other-message {
  justify-content: flex-start;
}

.chat-bubble {
  padding: 10px 14px;
  border-radius: 16px;
  max-width: 85%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  word-wrap: break-word;
}

.my-message-content {
  background-color: #2196F3;
  color: white;
  border-bottom-right-radius: 6px;
}

.other-message-content {
  background-color: #ECEFF1;
  color: #37474F;
  border-bottom-left-radius: 6px;
}

.chat-sender {
  font-size: 0.8rem;
  margin-bottom: 3px;
  display: flex;
  align-items: center;
  opacity: 0.9;
}

.chat-sender .v-icon {
  margin-right: 4px;
}

.chat-message-text {
  font-size: 0.9rem;
  word-wrap: break-word;
  line-height: 1.4;
}

.chat-timestamp {
  font-size: 0.7rem;
  text-align: right;
  margin-top: 4px;
  opacity: 0.8;
}

.chat-timestamp .v-icon {
  margin-right: 3px;
}

/* Chat Input - Mobile First */
.chat-input-area {
  padding: 12px 0 0 0;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  border-top: 1px solid #e0e0e0;
  margin-top: 8px;
}

.chat-text-field {
  flex: 1;
}

.send-button {
  background-color: #2196F3;
  color: white;
  min-width: 40px !important;
  width: 40px !important;
  height: 40px !important;
  flex-shrink: 0;
}

.send-button:hover {
  background-color: #1976D2;
}

.send-button:disabled {
  background-color: #ccc !important;
}

/* No Data Message */
.no-data-message {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #90A4AE;
  font-style: italic;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 8px;
  margin: 12px 0;
  border: 1px dashed #e0e0e0;
  font-size: 0.9rem;
}

.no-data-message .v-icon {
  margin-right: 8px;
  font-size: 1.3rem;
  color: #B0BEC5;
}

/* Dialog Styles */
.dialog-title {
  background-color: #2196F3;
  color: white;
  font-weight: 600;
  padding: 12px 16px;
}

.pdf-dialog-fullscreen .v-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.pdf-viewer-container {
  flex-grow: 1;
  padding: 0;
}

/* ===== TABLET STYLES (768px and up) ===== */
@media (min-width: 768px) {
  .main-container {
    padding: 20px;
  }

  .detail-card {
    padding: 20px;
  }

  .card-title {
    font-size: 1.4rem;
  }

  .card-title .v-icon {
    font-size: 1.6rem;
  }

  .detail-item {
    flex-direction: row;
    align-items: flex-start;
    gap: 8px;
  }

  .detail-label {
    min-width: 140px;
    flex-shrink: 0;
  }

  .detail-value {
    flex: 1;
  }

  .section-subtitle {
    font-size: 1.2rem;
  }

  .section-subtitle .v-icon {
    font-size: 1.4rem;
  }

  .activity-content {
    margin-left: 12px;
    padding: 16px;
  }

  .chat-history-container {
    height: 450px;
  }

  .chat-history-list {
    max-height: 370px;
  }

  .document-list {
    max-height: 300px;
  }

  .message-threads-list {
    max-height: 350px;
  }
}

/* ===== DESKTOP STYLES (960px and up) ===== */
@media (min-width: 960px) {
  .main-container {
    padding: 30px;
  }

  .detail-card {
    padding: 25px;
  }

  .card-title {
    font-size: 1.5rem;
  }

  .card-title .v-icon {
    font-size: 1.8rem;
  }

  .detail-label {
    min-width: 160px;
    font-size: 0.95rem;
  }

  .detail-value {
    font-size: 0.95rem;
  }

  .section-subtitle {
    font-size: 1.3rem;
  }

  .section-subtitle .v-icon {
    font-size: 1.5rem;
  }

  .activity-content {
    margin-left: 15px;
    padding: 18px;
  }

  .activity-action-by {
    font-size: 1.05rem;
  }

  .chat-history-container {
    height: 500px;
  }

  .chat-history-list {
    max-height: 420px;
  }

  .document-list {
    max-height: 350px;
  }

  .message-threads-list {
    max-height: 400px;
  }

  .message-threads-col {
    padding-right: 12px;
  }

  .chat-history-col {
    padding-left: 12px;
  }

  .document-actions {
    gap: 8px;
  }

  .action-button {
    min-width: 36px !important;
    width: 36px !important;
    height: 36px !important;
  }

  .action-button .v-icon {
    font-size: 1.2rem;
  }
}

/* ===== LARGE DESKTOP STYLES (1200px and up) ===== */
@media (min-width: 1200px) {
  .main-container {
    padding: 40px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .detail-card {
    padding: 30px;
  }

  .card-title {
    font-size: 1.6rem;
  }

  .card-title .v-icon {
    font-size: 2rem;
  }

  .detail-label {
    min-width: 180px;
    font-size: 1rem;
  }

  .detail-value {
    font-size: 1rem;
  }

  .section-subtitle {
    font-size: 1.4rem;
  }

  .activity-content {
    margin-left: 20px;
    padding: 20px;
  }

  .chat-history-container {
    height: 550px;
  }

  .chat-history-list {
    max-height: 470px;
  }

  .document-list {
    max-height: 400px;
  }

  .message-threads-list {
    max-height: 450px;
  }
}

/* ===== EXTRA SMALL MOBILE (320px - 480px) ===== */
@media (max-width: 480px) {
  .main-container {
    padding: 8px;
  }

  .detail-card {
    padding: 12px;
    margin-bottom: 12px;
  }

  .breadcrumbs-container {
    padding: 6px 10px;
    margin-bottom: 12px;
    font-size: 0.8rem;
  }

  .card-title {
    font-size: 1.1rem;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .card-title .v-icon {
    margin-right: 0;
    margin-bottom: 4px;
    font-size: 1.3rem;
  }

  .detail-item {
    margin-bottom: 10px;
    gap: 2px;
  }

  .detail-label {
    font-size: 0.85rem;
    font-weight: 700;
  }

  .detail-value {
    font-size: 0.85rem;
  }

  .status-chip {
    height: 22px;
    font-size: 0.75rem;
    padding: 0 8px;
  }

  .section-subtitle {
    font-size: 1rem;
    flex-direction: column;
    align-items: flex-start;
  }

  .section-subtitle .v-icon {
    margin-right: 0;
    margin-bottom: 4px;
    font-size: 1.2rem;
  }

  .document-list-item {
    padding: 8px 10px;
  }

  .document-name {
    font-size: 0.85rem;
  }

  .action-button {
    min-width: 28px !important;
    width: 28px !important;
    height: 28px !important;
  }

  .action-button .v-icon {
    font-size: 1rem;
  }

  .document-actions {
    gap: 2px;
  }

  .activity-content {
    margin-left: 6px;
    padding: 10px;
  }

  .activity-action-by {
    font-size: 0.9rem;
    flex-direction: column;
    align-items: flex-start;
  }

  .activity-action-by .v-icon {
    margin-right: 4px;
    margin-bottom: 2px;
  }

  .activity-date {
    font-size: 0.7rem;
  }

  .activity-detail-item {
    font-size: 0.8rem;
    padding-left: 10px;
  }

  .message-thread-item {
    padding: 10px;
  }

  .message-subject {
    font-size: 0.9rem;
    flex-direction: column;
    align-items: flex-start;
  }

  .message-subject .v-icon {
    margin-right: 4px;
    margin-bottom: 2px;
  }

  .message-preview {
    font-size: 0.8rem;
  }

  .unread-chip {
    height: 18px;
    font-size: 0.65rem;
    margin-left: 0;
    margin-top: 4px;
    align-self: flex-start;
  }

  .chat-bubble {
    max-width: 95%;
    padding: 8px 12px;
  }

  .chat-sender {
    font-size: 0.75rem;
  }

  .chat-message-text {
    font-size: 0.85rem;
  }

  .chat-timestamp {
    font-size: 0.65rem;
  }

  .chat-input-area {
    gap: 6px;
  }

  .send-button {
    min-width: 36px !important;
    width: 36px !important;
    height: 36px !important;
  }

  .no-data-message {
    padding: 16px;
    font-size: 0.85rem;
    flex-direction: column;
    text-align: center;
  }

  .no-data-message .v-icon {
    margin-right: 0;
    margin-bottom: 6px;
    font-size: 1.2rem;
  }

  .loading-message,
  .error-message {
    padding: 12px;
    font-size: 0.85rem;
    flex-direction: column;
    text-align: center;
  }

  .chat-history-container {
    height: 350px;
  }

  .chat-history-list {
    max-height: 270px;
    padding: 8px;
    gap: 8px;
  }

  .message-threads-list {
    max-height: 250px;
  }

  .document-list {
    max-height: 200px;
  }
}

/* ===== ACCESSIBILITY & FOCUS STATES ===== */
.action-button:focus,
.send-button:focus,
.message-thread-item:focus {
  outline: 2px solid #2196F3;
  outline-offset: 2px;
}

.clickable-date:focus {
  outline: 1px solid #2196F3;
  outline-offset: 1px;
  border-radius: 4px;
}

/* ===== LOADING STATES ===== */
.v-progress-circular {
  margin-right: 8px;
}

/* ===== HOVER EFFECTS FOR TOUCH DEVICES ===== */
@media (hover: none) and (pointer: coarse) {
  .action-button:hover,
  .send-button:hover,
  .message-thread-item:hover,
  .document-list-item:hover {
    transform: none;
    background-color: inherit;
  }
  
  .action-button:active,
  .send-button:active {
    transform: scale(0.95);
  }
  
  .message-thread-item:active,
  .document-list-item:active {
    background-color: #eef7ff;
  }
}

/* ===== PRINT STYLES ===== */
@media print {
  .main-container {
    padding: 0;
    background: white;
  }
  
  .detail-card {
    box-shadow: none;
    border: 1px solid #ccc;
    page-break-inside: avoid;
  }
  
  .action-button,
  .send-button,
  .chat-input-area {
    display: none;
  }
  
  .breadcrumbs-container {
    background: white;
    color: black;
    border: 1px solid #ccc;
  }
}

/* ===== DARK MODE SUPPORT (if needed) ===== */
@media (prefers-color-scheme: dark) {
  .main-container {
    background: linear-gradient(to right bottom, #1a1a1a, #2d2d2d);
    color: #ffffff;
  }
  
  .detail-card {
    background-color: #2d2d2d;
    border-color: #404040;
  }
  
  .card-title {
    color: #ffffff;
    border-bottom-color: #404040;
  }
  
  .detail-label {
    color: #ffffff;
  }
  
  .detail-value {
    color: #cccccc;
  }
  
  .activity-content {
    background-color: #333333;
  }
  
  .chat-bubble.other-message-content {
    background-color: #404040;
    color: #ffffff;
  }
  
  .document-list,
  .message-threads-list,
  .chat-history-list {
    background-color: #2d2d2d;
    border-color: #404040;
  }
  
  .no-data-message {
    background-color: #333333;
    border-color: #404040;
    color: #cccccc;
  }
}
</style>