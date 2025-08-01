<template>
    <v-container class="px-4 px-md-10" fluid style="height:100vh; background:#e7f0f7;">
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
        <br><br>

        <searchAndFilterToolbar :placeholder="placeholder" @search="filterByName" @addItem="dialog = true" />

        <v-table class="rounded-lg mt-4">
            <thead>
                <tr>
                    <th class="text-left">SUBJECT</th>
                    <th class="text-left">REQUESTED TYPE</th>
                    <th class="text-left">MESSAGE</th>
                    <th class="text-left">COMMENT</th>
                    <th class="text-left">MESSAGE FROM</th>
                    <th class="text-left">CHAT</th>
                    <!-- <th class="text-left">ACTIONS</th> -->
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in filteredMessageList" :key="item.id">
                    <td>{{ item.subject }}</td>
                    <td>{{ item.requested_type }}</td>
                    <td>{{ item.message }}</td>
                    <td>{{ item.comment }}</td>
                    <td>{{ item.service_request?.user?.username || 'N/A' }}</td>
                    <td>
                        <v-btn icon color="primary" @click="openChat(item)" title="Open Chat">
                            <v-icon>mdi-chat</v-icon>
                        </v-btn>
                    </td>
                    <!-- <td>
                        <v-menu transition="scale-transition">
                            <template v-slot:activator="{ props }">
                                <v-btn icon v-bind="props">
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                            </template>
                            <v-list dense>
                                <v-list-item @click="openEditDialog(item)" v-if="showToolbar">
                                    <v-list-item-title>
                                        <v-icon left>mdi-pencil-outline</v-icon> Edit
                                    </v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="openDeleteDialog(item)" v-if="showToolbar">
                                    <v-list-item-title>
                                        <v-icon left color="red">mdi-trash-can-outline</v-icon> Delete
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </td> -->
                </tr>
            </tbody>
        </v-table>
        <paginationVue :length="totalPages" @chanegePage="changePage" />

        <!-- Half Screen Chat Modal -->
        <v-dialog v-model="chat_dialog" persistent class="custom-dialog-width" transition="dialog-bottom-transition">
            <v-card class="chatopenmenu">
                <v-card-title style="background:#2196F3;" class="text-white d-flex justify-space-between align-center">
                    Chat with {{ selectedChatItem?.service_request?.user?.username || 'User' }}
                    <v-btn icon @click="chat_dialog = false" color="white" small>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>


                <v-card-text class="flex-grow-1 overflow-y-auto pa-4" style="height: calc(70vh - 120px);"
                    ref="chatScroll">
                    <div v-for="(msg, index) in ChatList" :key="index" class="mb-3 d-flex"
                        :class="{ 'justify-end': msg.from === 'me' }">
                        <div :class="['d-inline-block px-4 py-2 rounded', msg.from === 'me' ? 'bg-blue-lighten-4 text-right' : 'bg-grey-lighten-3']"
                            style="max-width: 80%;">
                            {{ msg.message }}
                        </div>
                    </div>
                </v-card-text>

                <v-divider></v-divider>
                <v-card-actions class="pa-4 d-flex align-center" style="min-height: 80px;">
                    <v-text-field v-model="chatMessage" placeholder="Type a message..." dense hide-details outlined
                        class="flex-grow-1 mr-2" @keyup.enter="submitChatMessage"></v-text-field>
                    <v-btn icon color="primary" @click="submitChatMessage">
                        <v-icon>mdi-send</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Delete Confirmation Dialog -->
        <!-- <v-dialog v-model="delete_dialog" max-width="500px">
            <v-card>
                <v-card-title class="headline">Confirm Delete</v-card-title>
                <v-card-text>
                    Are you sure you want to delete this message?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="delete_dialog = false">Cancel</v-btn>
                    <v-btn color="red darken-1" text @click="deleteMessage">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog> -->

        <!-- Edit Message Dialog -->
        <!-- <v-dialog v-model="edit_dialog" class="custom-dialog-width">
            <v-card>
                <v-card-title class="headline">Edit Message</v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="editValue.subject" label="Subject" required
                                    maxlength="25"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="editValue.message" label="Message" required></v-textarea>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="editValue.comment" label="Comment"></v-textarea>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="edit_dialog = false">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="updateMessage">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog> -->

        <!-- Add New Message Dialog -->
        <v-dialog v-model="dialog" class="custom-dialog-width">
            <v-card>
                <v-card-title class="headline">Add New Message</v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="newMessage.subject" label="Subject" required
                                    maxlength="25"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="newMessage.messages" label="Message" required></v-textarea>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="newMessage.comment" label="Comment"></v-textarea>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="addMessage">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import paginationVue from '@/components/pagination.vue';
import searchAndFilterToolbar from '@/components/searchAndFilterToolbar.vue';

export default {
    name: 'MESSAGELIST',
    components: {
        searchAndFilterToolbar,
        paginationVue
    },
    data() {
        return {
            breadcrumbs: [
                { text: 'Home', disabled: false, href: '/' },
                { text: 'Messages', disabled: true, href: '/messages' },
            ],
            placeholder: 'Search by subject',
            dialog: false,
            delete_dialog: false,
            edit_dialog: false,
            deleteValue: {},
            editValue: {},
            newMessage: {
                subject: '',
                messages: '',
                comment: ''
            },
            showToolbar: false,
            showMessage: true,
            totalPages: 1,
            currentPage: 1,
            serviceRequestId: null,
            chat_dialog: false,
            chatMessage: '',
            selectedChatItem: null,
            currentUserId: null,
        };
    },
    computed: {
        ...mapState('message', ['MessageList', 'loading', 'error', 'ChatList']),
        ...mapGetters('message', ['isLoading', 'hasError', 'getError']),
        filteredMessageList() {
            if (this.serviceRequestId) {
                if (Array.isArray(this.MessageList)) {
                    return this.MessageList.filter(
                        (item) => item.serviceRequestId === parseInt(this.serviceRequestId)
                    );
                }
                return [];
            }
            return Array.isArray(this.MessageList) ? this.MessageList : [];
        }
    },
    methods: {
        isAdmin() {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.role) {
                const userRole = user.role[0];
                this.showToolbar = userRole === 'admin';
                this.showMessage = userRole !== 'admin';
            } else {
                this.showToolbar = false;
                this.showMessage = true;
            }
        },
        getCurrentUserId() {
            const user = JSON.parse(localStorage.getItem('user'));
            this.currentUserId = user ? user.id : null;
        },
        ...mapActions('message', ['GET_MESSAGE_LIST', 'ADD_CEOMESSAGE', 'UPDATE_MESSAGE', 'DELETE_MESSAGE', 'ADD_CHAT', 'GET_CHAT_MESSAGES']),

        async addMessage() {
            try {
                if (this.serviceRequestId) {
                    this.newMessage.serviceRequestId = parseInt(this.serviceRequestId);
                }
                await this.ADD_CEOMESSAGE(this.newMessage);
                await this.fetchMessageList();
                this.dialog = false;
                this.newMessage = { subject: '', messages: '', comment: '' };
            } catch (error) {
                console.error('Error adding message:', error);
            }
        },

        openDeleteDialog(item) {
            this.deleteValue = item;
            this.delete_dialog = true;
        },

        async deleteMessage() {
            try {
                await this.DELETE_MESSAGE(this.deleteValue.id);
                await this.fetchMessageList();
                this.delete_dialog = false;
                this.deleteValue = {};
            } catch (error) {
                console.error("Error deleting message:", error);
            }
        },

        openEditDialog(item) {
            this.editValue = { ...item };
            this.edit_dialog = true;
        },

        async updateMessage() {
            try {
                await this.UPDATE_MESSAGE(this.editValue);
                await this.fetchMessageList();
                this.edit_dialog = false;
                this.editValue = {};
            } catch (error) {
                console.error('Error updating message:', error);
            }
        },

        viewMessage(item) {
            console.log("View message:", item);
        },

        filterByName(text) {
            const payload = {
                name: text || '',
                size: 15,
                page: 1,
                serviceRequestId: this.serviceRequestId || undefined
            };
            this.GET_MESSAGE_LIST(payload);
        },

        changePage(page) {
            this.currentPage = page;
            this.fetchMessageList(page);
        },

        async fetchMessageList(page = 1) {
            const query = {
                page: page,
                size: 15,
                serviceRequestId: this.serviceRequestId || undefined
            };
            try {
                const response = await this.GET_MESSAGE_LIST(query);
                // Assuming your GET_MESSAGE_LIST action returns pagination info, update totalPages here.
                // For example, if response.data contains a total_pages property:
                // this.totalPages = response.data.total_pages || 1;
            } catch (error) {
                console.error('Error fetching message list:', error);
            }
        },

        async openChat(item) {
            this.selectedChatItem = item;
            this.chat_dialog = true;
            this.chatMessage = '';

            // The GET_CHAT_MESSAGES action will fetch and commit the data to this.ChatList directly
            await this.GET_CHAT_MESSAGES({ messageId: item.id, currentUserId: this.currentUserId });

            this.$nextTick(() => {
                const container = this.$refs.chatScroll;
                if (container) container.scrollTop = container.scrollHeight;
            });
        },

        async submitChatMessage() {
            const messageText = this.chatMessage.trim();
            if (!messageText) return;

            const messageId = this.selectedChatItem.id;

            try {
                // The ADD_CHAT action will now handle fetching userId internally if needed by the backend
                await this.ADD_CHAT({
                    message: messageText,
                    messageId: messageId,
                    userId: this.currentUserId // Pass currentUserId to action
                });

                this.chatMessage = '';

                // After successfully sending, re-fetch all chat messages for this conversation
                await this.GET_CHAT_MESSAGES({ messageId: messageId, currentUserId: this.currentUserId });

                this.$nextTick(() => {
                    const container = this.$refs.chatScroll;
                    if (container) container.scrollTop = container.scrollHeight;
                });

            } catch (err) {
                console.error("Failed to send message:", err);
            }
        }
    },
    mounted() {
        this.isAdmin();
        this.getCurrentUserId(); // Fetch current user ID on mount
        this.serviceRequestId = this.$route.params.serviceRequestId || null;
        this.fetchMessageList();
    },
    watch: {
        '$route.params.serviceRequestId'(newId) {
            this.serviceRequestId = newId || null;
            this.fetchMessageList();
        }
    }
};
</script>

<style scoped>
/* Breadcrumbs styling */
.chatopenmenu {
    display: flex;
    flex-direction: column;
    height: 70vh;
    max-height: 70vh;
    width: 210%;
}
@media (max-width: 960px) {
    .chatopenmenu {
        width: 100%; /* Full width on smaller screens */
    }
}

.breadcrumbs-container {
    background-color: #3f51b5;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
}

.custom-breadcrumb-item {
    color: white !important;
}

.custom-breadcrumb-item.v-breadcrumbs-item--disabled {
    opacity: 0.8;
}

/* Chat styling */
.chat-container {
    height: 60vh;
    display: flex;
    flex-direction: column;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    background-color: #f5f5f5;
}

.message-bubble {
    border-radius: 18px;
    padding: 8px 16px;
    margin: 4px 0;
    word-wrap: break-word;
}

.message-me {
    background-color: #1976d2;
    color: white;
    margin-left: auto;
}

.message-other {
    background-color: white;
    color: #333;
    margin-right: auto;
    border: 1px solid #e0e0e0;
}

/* Fixed Dialog Width - This was the main issue */
:deep(.custom-dialog-width .v-dialog) {
    width: 90vw !important;
    max-width: 1200px !important;
}

/* Alternative approach for better browser compatibility */
.custom-dialog-width>>>.v-dialog {
    width: 90vw !important;
    max-width: 1200px !important;
}

/* Responsive dialog widths */
@media (max-width: 768px) {
    :deep(.custom-dialog-width .v-dialog) {
        width: 95vw !important;
        max-width: none !important;
    }
}

@media (min-width: 1400px) {
    :deep(.custom-dialog-width .v-dialog) {
        width: 80vw !important;
        max-width: 1400px !important;
    }
}

/* Ensure dialogs don't overflow on small screens */
:deep(.v-dialog) {
    margin: 16px !important;
}
</style>