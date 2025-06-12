<template>
    <v-container class="px-4 px-md-10" fluid style="height:100vh; background:#e7f0f7;">
        <!-- Breadcrumb Navigation -->
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

        <!-- Search and Filter Toolbar -->
        <searchAndFilterToolbar :placeholder="placeholder" @search="filterByName" @addItem="dialog = true" />

        <v-table class="rounded-lg mt-4">
            <thead>
                <tr>
                    <th class="text-left">SUBJECT</th>
                    <th class="text-left">MESSAGE</th>
                    <th class="text-left">COMMENT</th>
                    <th class="text-left">MESSAGE FROM</th>
                    <th class="text-left">CHAT</th>
                    <th class="text-left">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in filteredMessageList" :key="item.id">
                    <td>{{ item.subject }}</td>
                    <td>{{ item.message }}</td>
                    <td>{{ item.comment }}</td>
                    <td>{{ item.service_request.user.username }}</td>
                    <td> <v-btn icon color="primary" @click="openChat(item)" title="Open Chat">
                            <v-icon>mdi-chat</v-icon>
                        </v-btn></td>
                    <td>
                        <v-menu transition="scale-transition">
                            <template v-slot:activator="{ props }">
                                <v-btn icon v-bind="props">
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                            </template>
                            <v-list dense>
                                <!-- <v-list-item @click="viewMessage(item)">
                                    <v-list-item-title>
                                        <v-icon left>mdi-eye-outline</v-icon> View
                                    </v-list-item-title>
                                </v-list-item> -->
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
                    </td>
                </tr>
            </tbody>
        </v-table>
        <paginationVue :length="totalPages" @chanegePage="changePage" />

        <!-- Chat Dialog -->
        <v-dialog v-model="chat_dialog" max-width="600px" persistent>
            <v-card style="height: 500px; display: flex; flex-direction: column;">
                <!-- Header -->
                <v-card-title class="bg-primary text-white">
                    Chat with {{ selectedChatItem?.service_request?.user?.username || 'User' }}
                </v-card-title>

                <!-- Chat Messages Area -->
                <v-card-text class="flex-grow-1 overflow-y-auto" style="padding: 16px;" ref="chatScroll">
                    <div v-for="(msg, index) in ChatList" :key="index" class="mb-3">
                        <div :class="['d-inline-block px-4 py-2 rounded', msg.from === 'me' ? 'bg-blue lighten-4 text-right ml-auto' : 'bg-grey lighten-3']"
                            style="max-width: 80%;">
                            {{ msg.message }}
                        </div>
                    </div>
                </v-card-text>

                <!-- Message Input -->
                <v-divider></v-divider>
                <v-card-actions class="pa-2">
                    <v-text-field v-model="chatMessage" placeholder="Type a message..." dense hide-details outlined
                        class="flex-grow-1" @keyup.enter="submitChatMessage"></v-text-field>
                    <v-btn icon color="primary" @click="submitChatMessage">
                        <v-icon>mdi-send</v-icon>
                    </v-btn>
                    <v-btn icon @click="chat_dialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="delete_dialog" max-width="400px">
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
        </v-dialog>

        <!-- Edit Message Dialog -->
        <v-dialog v-model="edit_dialog" max-width="600px">
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
        </v-dialog>

        <!-- Add Message Dialog -->
        <v-dialog v-model="dialog" max-width="600px">
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
                message: '',
                comment: ''
            },
            showToolbar: false,
            showMessage: true, // Kept for consistency, though unused in template
            totalPages: 1,
            currentPage: 1,
            serviceRequestId: null,// Store the serviceRequestId from route params
            chat_dialog: false,
            chatMessage: '',
            selectedChatItem: null,
        }
    },
    computed: {
        ...mapState('message', ['MessageList', 'loading', 'error', 'ChatList']),
        ...mapGetters('message', ['isLoading', 'hasError', 'getError']),
        filteredMessageList() {
            // Filter messages based on serviceRequestId if it exists
            if (this.serviceRequestId) {
                return this.MessageList.filter(
                    (item) => item.serviceRequestId === parseInt(this.serviceRequestId)
                );
            }
            return this.MessageList; // Return all messages if no serviceRequestId
        }
    },
    methods: {
        isAdmin() {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.role) {
                const userRole = user.role[0];
                // Only 'admin' can see Edit and Delete buttons
                this.showToolbar = userRole === 'admin';
                // Optional: Keep showMessage logic if you plan to use it
                this.showMessage = userRole !== 'admin';
            } else {
                this.showToolbar = false; // Default to false if no user/role
                this.showMessage = true;
            }
        },
        ...mapActions('message', ['GET_MESSAGE_LIST', 'ADD_MESSAGE', 'UPDATE_MESSAGE', 'DELETE_MESSAGE', 'ADD_CHAT', 'GET_CHAT_MESSAGES']),

        async addMessage() {
            try {
                if (this.serviceRequestId) {
                    this.newMessage.serviceRequestId = parseInt(this.serviceRequestId);
                }
                await this.ADD_MESSAGE(this.newMessage);
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
                await this.GET_MESSAGE_LIST(query);
                this.totalPages = this.$store.state.message.totalPages || 1;
            } catch (error) {
                console.error('Error fetching message list:', error);
            }
        },
     
        async openChat(item) {
            this.selectedChatItem = item;
            this.chat_dialog = true;
            this.chatMessage = '';
            this.ChatList = [];

            // Fetch chat messages from the store
            await this.GET_CHAT_MESSAGES({ messageId: item.id });

            // Populate ChatList
            this.ChatList = this.ChatList.map(chat => ({
                text: chat.message,
                from: chat.from === 'me' ? 'me' : 'them' // Adjust based on your backend
            }));

            this.$nextTick(() => {
                const container = this.$refs.chatScroll;
                if (container) container.scrollTop = container.scrollHeight;
            });
        },

        async submitChatMessage() {
            const messageText = this.chatMessage.trim();
            if (!messageText) return;

            const messageId = this.selectedChatItem.id;

            // Optimistically update UI
            this.ChatList.push({ text: messageText, from: 'me' });
            this.chatMessage = '';

            this.$nextTick(() => {
                const container = this.$refs.chatScroll;
                if (container) container.scrollTop = container.scrollHeight;
            });

            try {
                await this.ADD_CHAT({
                    message: messageText,
                    messageId: messageId
                });
            } catch (err) {
                console.error("Failed to send message:", err);
                // Optionally show an error toast or remove the message from ChatList
            }
        }


    },
    mounted() {
        this.isAdmin();
        this.serviceRequestId = this.$route.params.serviceRequestId || null;
        this.fetchMessageList();
        this.GET_CHAT_MESSAGES({});
    },
    watch: {
        '$route.params.serviceRequestId'(newId) {
            this.serviceRequestId = newId || null;
            this.fetchMessageList();
        }
    }
}
</script>