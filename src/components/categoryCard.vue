<template>
  <v-row class="justify-center" style="max-width: 2571px; margin: auto;">
    <v-col cols="12" md="3" sm="6" v-for="item in cat" :key="item.id">
      <v-card 
        class="text-center card-container" 
        rounded="lg" 
        height="300" 
        elevation="0"
        max-width="600"
        @click="toSubcat(item)"
      >
        <div class="card-overlay"></div>
        <div class="card-glow"></div>
        <v-card-title class="px-2 admin-controls" style="font-size: 1rem;">
          <v-spacer></v-spacer>
          <v-btn flat size="40" v-if="isAdmin()" class="admin-btn">
            <v-icon color="#4d90fe">mdi-dots-vertical</v-icon>
            <v-menu activator="parent">
              <v-list class="pa-0 admin-menu">
                <v-list-item @click="openEditDailog(item)">
                  <v-list-item-title class="menu-item">
                    <v-icon size="20" color="#4d90fe">mdi-pencil-outline</v-icon> Edit
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="deleteItem(item)">
                  <v-list-item-title class="menu-item">
                    <v-icon size="20" color="#EF4444">mdi-trash-can-outline</v-icon> Delete
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-btn>
        </v-card-title>

        <div class="image-container">
          <v-img 
            :src="item.categoryImage || item.subcategoryImage || 'https://via.placeholder.com/600x400'" 
            class="card-image"
            cover
            height="100%"
            width="100%"
          >
            <div class="image-overlay"></div>
          </v-img>
        </div>

        <v-card-header class="justify-center flex-column card-footer">
          <div class="card_text_sub text-h6">
            {{ item.categoryName || item.subcategoryName }}
          </div>
        </v-card-header>
        <div class="card-accent"></div>
      </v-card>
    </v-col>
  </v-row>
  <editCategoryVue 
    :visible="edit_dialog" 
    @close="edit_dialog = false" 
    :item="cat_name" 
    @update="upadateCategory" 
  />
  <deleteWarnVue 
    :visible="delete_dialog" 
    @close="delete_dialog = false" 
    :item="deleteValue" 
    @delete="deleteCat" 
  />
</template>

<script>
import editCategoryVue from './categories/editCategory.vue';
import deleteWarnVue from './deleteWarn.vue';

export default {
  name: 'catCard',
  components: {
    editCategoryVue,
    deleteWarnVue
  },
  props: {
    cat: {
      type: Array
    }
  },
  data: () => ({
    edit_dialog: false,
    delete_dialog: false,
    deleteValue: {},
    cat_name: '',
    cat_id: '',
  }),
  methods: {
    isAdmin() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        return user.role[0] === 'admin';
      }
      return false;
    },
    toSubcat(item) {
      this.$emit("clickOnCard", item);
    },
    deleteItem(item) {
      this.deleteValue = item;
      this.delete_dialog = true;
    },
    deleteCat(item) {
      this.$emit('delteItem', item); // Note: 'delteItem' is a typo in the original code; consider correcting to 'deleteItem'
      this.delete_dialog = false;
    },
    openEditDailog(item) {
      this.cat_name = item.categoryName || item.subcategoryName;
      this.cat_id = item.id;
      this.edit_dialog = true;
    },
    upadateCategory(item) {
      this.$emit('editItem', { item: item, id: this.cat_id }); // Note: 'upadateCategory' is a typo in the original; consider correcting to 'updateCategory'
      this.edit_dialog = false;
    }
  }
}
</script>

<style scoped>
/* Card Container */
.card-container {
  font-family: 'Montserrat', sans-serif !important;
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(245, 247, 250, 0.9));
  backdrop-filter: blur(6px);
  border-radius: 12px;
  transition: all 0.4s ease;
  border: 1px solid rgba(77, 144, 254, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  animation: cardPopIn 0.6s ease-out forwards;
  cursor: pointer;
}

.card-container:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 8px 20px rgba(77, 144, 254, 0.25);
  background: linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(245, 247, 250, 0.95));
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, rgba(77, 144, 254, 0.05), rgba(40, 91, 199, 0.05));
  z-index: 0;
  transition: opacity 0.4s ease;
}

.card-container:hover .card-overlay {
  opacity: 0.8;
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(77, 144, 254, 0.15), transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.card-container:hover .card-glow {
  opacity: 1;
}

/* Admin Controls */
.admin-controls {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
}

.admin-btn {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.admin-btn:hover {
  background: #4d90fe;
  transform: scale(1.1);
}

.admin-btn:hover .v-icon {
  color: #FFFFFF;
}

.admin-menu {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(245, 247, 250, 0.9));
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.menu-item {
  color: #1F2937;
  font-weight: 600;
  padding: 8px 16px;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background: linear-gradient(90deg, rgba(77, 144, 254, 0.1), rgba(40, 91, 199, 0.1));
  color: #4d90fe;
}

/* Image Container */
.image-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  height: 70%;
}

.card-image {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.4s ease;
}

.card-container:hover .card-image {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.2), transparent 70%);
  z-index: 1;
  transition: opacity 0.4s ease;
}

.card-container:hover .image-overlay {
  opacity: 0.5;
}

/* Card Footer */
.card-footer {
  height: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  z-index: 1;
}

.card_text_sub {
  font-weight: 700;
  width: 100%;
  text-align: center;
  line-height: 1.2;
  text-transform: capitalize;
  letter-spacing: 0.5px;
  padding: 0 12px;
  background: linear-gradient(45deg, #4d90fe, #285bc7);
  -webkit-background-clip: text;
  color: transparent;
  transition: transform 0.3s ease;
}

.card-container:hover .card_text_sub {
  transform: scale(1.05);
}

/* Card Accent */
.card-accent {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #4d90fe, #285bc7);
  opacity: 0.9;
  transition: height 0.4s ease;
}

.card-container:hover .card-accent {
  height: 8px;
}

/* Animations */
@keyframes cardPopIn {
  0% { opacity: 0; transform: scale(0.8) translateY(20px); }
  60% { opacity: 1; transform: scale(1.03) translateY(-3px); }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

/* Responsive Design */
@media (max-width: 960px) {
  .card-container {
    height: 280px;
    margin-bottom: 16px;
  }

  .card_text_sub {
    font-size: 1.1rem;
    padding: 0 10px;
  }

  .admin-controls {
    top: 6px;
    right: 6px;
  }

  .admin-btn {
    size: 36px;
  }
}

@media (max-width: 600px) {
  .card-container {
    height: 260px;
    margin-bottom: 12px;
  }

  .card_text_sub {
    font-size: 0.95rem;
    padding: 0 8px;
  }

  .admin-controls {
    top: 4px;
    right: 4px;
  }

  .admin-btn {
    size: 32px;
  }

  .menu-item {
    font-size: 0.85rem;
    padding: 6px 12px;
  }
}
</style>