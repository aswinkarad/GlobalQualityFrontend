<template>
  <v-container class="px-4 hmmsdashboard" fluid style="min-height: 100vh; background: linear-gradient(135deg, #F5F7FA, #E8ECEF);">
    <v-row align="center" class="top-bar">
      <v-col cols="12">
        <v-breadcrumbs :items="breadcrumbs" class="breadcrumbs-container">
          <template v-slot:divider>
            <v-icon color="white">mdi-chevron-right</v-icon>
          </template>
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :href="item.href" :disabled="item.disabled" class="custom-breadcrumb-item">
              {{ item.text.toUpperCase() }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>

    <div class="text-h6 mb-2 category-title" style="font-family: 'Montserrat', sans-serif !important">
      CATEGORIES
    </div>

    <searchAndFilterToolbar 
      :btn_text="cl_text" 
      :show-button="showToolbar" 
      @btn_action="dialog = true" 
      class="toolbar" 
    />
    <addCat :visible="dialog" @close="dialog = false" @save="addCategory" :title="dialog_title" class="dialog-animation" />

    <div class="mt-8 category-cards">
      <categorycard @clickOnCard="toSubCat" :cat="categoryList" @delteItem="deleteCat" @editItem="editCat" />
    </div>
    <snackbarVue :visible="snackbar" :text="mssg" :button="false" :color="snackColor" @close="snackbar = false" class="snackbar-animation" />
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import categorycard from '@/components/categoryCard.vue';
import addCat from '@/components/categories/addCat.vue';
import searchAndFilterToolbar from '@/components/searchAndFilterToolbar.vue';
import snackbarVue from '@/components/snackbar.vue';

export default {
  name: 'category',
  data() {
    return {
      cl_text: 'Add Category',
      dialog_title: 'Add Category',
      dialog: false,
      snackbar: false,
      mssg: '',
      snackColor: '',
      cat_text: null,
      showToolbar: false,
      userName: '',
      breadcrumbs: [
        { text: 'Home', disabled: false, href: '/' },
        { text: 'Categories', disabled: true, href: '/categories' },
      ],
    };
  },
  components: {
    searchAndFilterToolbar,
    categorycard,
    addCat,
    snackbarVue,
  },
  computed: {
    ...mapState('category', ['categoryList', 'result']),
    ...mapState('subCategory', ['subCategoryList']),
  },
  methods: {
    ...mapActions('category', ['GET_ALL_CATEGORY', 'ADD_CATEGORY', 'UPDATE_CATEGORY', 'DELETE_CATEGORY']),
    ...mapActions('subCategory', ['GET_SUB_CATEGORY']),
    isAdmin() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.role) {
        const userRole = user.role[0];
        if (userRole === 'admin') {
          this.cat_text = 'Add Category';
          this.showToolbar = true;
        } else if (userRole === 'Engineer') {
          this.cat_text = null;
          this.showToolbar = false;
        } else {
          this.cat_text = null;
          this.showToolbar = true;
        }
      }
    },
    toSubCat(item) {
      this.$router.push({ name: 'subCat', params: { cat_name: item.categoryName } });
    },
    async addCategory(payload) {
      await this.ADD_CATEGORY(payload).then(() => {
        if (this.result.message === 'Validation error') {
          this.snackColor = 'error';
          this.mssg = `${payload.name} is Already Exist`;
          this.snackbar = true;
        } else {
          this.snackColor = 'success';
          this.mssg = 'Category Added Successfully';
          this.snackbar = true;
          this.GET_ALL_CATEGORY();
          this.dialog = false;
        }
      });
    },
    async deleteCat(cat) {
      await this.GET_SUB_CATEGORY({ cat_name: cat.categoryName }).then(() => {
        if (this.subCategoryList.length === 0) {
          this.DELETE_CATEGORY(cat).then(() => {
            this.snackColor = 'success';
            this.mssg = 'Category deleted Successfully';
            this.snackbar = true;
            this.dialog = false;
            this.GET_ALL_CATEGORY();
          });
        } else {
          this.snackColor = 'error';
          this.mssg = 'Please delete all sub-categories before deleting category.';
          this.snackbar = true;
          this.dialog = false;
        }
      });
    },
    async editCat(cat) {
      await this.UPDATE_CATEGORY(cat);
      await this.GET_ALL_CATEGORY();
    },
  },
  mounted() {
    this.isAdmin();
    this.GET_ALL_CATEGORY();
    this.userName = JSON.parse(localStorage.getItem('user'))?.username || '';
  },
};
</script>

<style scoped>
/* Base Container Styling */
.hmmsdashboard {
  min-height: 100vh;
  padding: 24px;
  position: relative;
  overflow-x: hidden;
  color: #1F2937;
}

/* Top Bar */
.top-bar {
  margin-bottom: 24px;
}

.breadcrumbs-container {
  background: linear-gradient(90deg, #4d90fe, #285bc7);
  border-radius: 12px; /* Remove rounded corners for full-width */
  padding: 10px 16px;
  box-shadow: 0 6px 15px rgba(77, 144, 254, 0.2);
  animation: slideInDown 0.8s ease-out;
  width: 95%; /* Full viewport width */
  margin-left: calc(24px); /* Offset .hmmsdashboard padding */
  margin-right: calc(24px); /* Offset .hmmsdashboard padding */
  box-sizing: border-box; /* Include padding in width */
}

.custom-breadcrumb-item {
  color: #FFFFFF;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.custom-breadcrumb-item:hover {
  color: #E5E7EB;
  transform: scale(1.05);
}

.user-greeting {
  color: #4d90fe;
  font-size: 1.1rem;
  font-weight: 600;
  animation: fadeIn 1s ease-out;
}

/* Category Title */
.category-title {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(45deg, #4d90fe, #285bc7);
  -webkit-background-clip: text;
  color: transparent;
  animation: slideInLeft 0.8s ease-out;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* Toolbar */
.toolbar {
  margin-top: 12px;
  animation: fadeInUp 0.8s ease-out;
}

/* Enhanced Modal Styling (addCat) */
.dialog-animation /deep/ .v-dialog {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(245, 247, 250, 0.9));
  backdrop-filter: blur(8px);
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(77, 144, 254, 0.3);
  padding: 12px;
  animation: zoomInPop 0.5s ease-out;
  max-width: 90%;
  width: 400px;
}

.dialog-animation /deep/ .v-card-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: #285bc7;
  background: linear-gradient(45deg, #4d90fe, #285bc7);
  -webkit-background-clip: text;
  color: transparent;
  text-align: center;
}

.dialog-animation /deep/ .v-text-field .v-input__control {
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.dialog-animation /deep/ .v-text-field .v-input__control:hover {
  background: rgba(245, 247, 250, 0.95);
  box-shadow: 0 2px 8px rgba(77, 144, 254, 0.2);
}

.dialog-animation /deep/ .v-btn {
  border-radius: 6px;
  transition: all 0.3s ease;
}

.dialog-animation /deep/ .v-btn--primary {
  background: linear-gradient(45deg, #4d90fe, #285bc7);
  color: #fff;
}

.dialog-animation /deep/ .v-btn--primary:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(77, 144, 254, 0.3);
}

/* Category Cards Container */
.category-cards {
  margin-top: 16px;
  animation: fadeIn 1s ease-out;
}

/* Enhanced Category Card Styling (categorycard) */
.category-cards /deep/ .v-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(245, 247, 250, 0.9));
  backdrop-filter: blur(6px);
  border-radius: 10px;
  padding: 12px;
  transition: all 0.4s ease;
  border: 1px solid rgba(77, 144, 254, 0.15);
  position: relative;
  overflow: hidden;
  animation: cardPopIn 0.6s ease-out forwards;
  width: 100%;
  touch-action: manipulation;
}

.category-cards /deep/ .v-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 20px rgba(77, 144, 254, 0.25);
  background: linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(245, 247, 250, 0.95));
}

.category-cards /deep/ .v-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(77, 144, 254, 0.15), transparent);
  transition: left 0.5s ease;
}

.category-cards /deep/ .v-card:hover::before {
  left: 100%;
}

.category-cards /deep/ .v-card-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #285bc7;
  background: linear-gradient(45deg, #4d90fe, #285bc7);
  -webkit-background-clip: text;
  color: transparent;
  transition: transform 0.3s ease;
}

.category-cards /deep/ .v-card:hover .v-card-title {
  transform: scale(1.05);
}

.category-cards /deep/ .v-btn {
  border-radius: 6px;
  transition: all 0.3s ease;
}

.category-cards /deep/ .v-btn--icon {
  color: #4d90fe;
}

.category-cards /deep/ .v-btn--icon:hover {
  transform: scale(1.1);
  color: #285bc7;
}

/* Snackbar Animation */
.snackbar-animation {
  animation: slideInRight 0.5s ease-out;
}

/* CSS Keyframe Animations */
@keyframes slideInDown {
  0% { opacity: 0; transform: translateY(-100%); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes zoomInPop {
  0% { opacity: 0; transform: scale(0.7); }
  60% { opacity: 1; transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes cardPopIn {
  0% { opacity: 0; transform: scale(0.8) translateY(20px); }
  60% { opacity: 1; transform: scale(1.03) translateY(-3px); }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

@keyframes slideInLeft {
  0% { opacity: 0; transform: translateX(-100px); }
  100% { opacity: 1; transform: translateX(0); }
}

@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(50px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes slideInRight {
  0% { opacity: 0; transform: translateX(100px); }
  100% { opacity: 1; transform: translateX(0); }
}

/* Responsive Design */
@media (max-width: 960px) {
  .hmmsdashboard {
    padding: 16px;
  }

  .category-title {
    font-size: 1.5rem;
  }

  .breadcrumbs-container {
    padding: 8px 12px;
    margin-left: calc(-16px); /* Match .hmmsdashboard padding */
    margin-right: calc(-16px);
  }

  .custom-breadcrumb-item {
    font-size: 0.9rem;
  }

  .user-greeting {
    font-size: 1rem;
  }

  .toolbar {
    margin-top: 10px;
  }

  .category-cards {
    margin-top: 12px;
  }

  .category-cards /deep/ .v-card {
    padding: 10px;
    margin-bottom: 10px;
  }

  .category-cards /deep/ .v-card-title {
    font-size: 1.1rem;
  }

  .dialog-animation /deep/ .v-dialog {
    width: 350px;
    padding: 10px;
  }

  .dialog-animation /deep/ .v-card-title {
    font-size: 1.3rem;
  }

  .dialog-animation /deep/ .v-btn {
    padding: 5px 12px;
  }
}

@media (max-width: 600px) {
  .hmmsdashboard {
    padding: 12px;
  }

  .category-title {
    font-size: 1.2rem;
  }

  .breadcrumbs-container {
    padding: 6px 10px;
    margin-left: calc(-12px); /* Match .hmmsdashboard padding */
    margin-right: calc(-12px);
  }

  .custom-breadcrumb-item {
    font-size: 0.8rem;
  }

  .user-greeting {
    font-size: 0.9rem;
  }

  .toolbar {
    margin-top: 8px;
  }

  .category-cards {
    margin-top: 10px;
  }

  .category-cards /deep/ .v-card {
    padding: 8px;
    margin-bottom: 8px;
  }

  .category-cards /deep/ .v-card-title {
    font-size: 0.9rem;
  }

  .category-cards /deep/ .v-btn--icon {
    width: 24px;
    height: 24px;
  }

  .dialog-animation /deep/ .v-dialog {
    width: 90%;
    padding: 8px;
  }

  .dialog-animation /deep/ .v-card-title {
    font-size: 1.1rem;
  }

  .dialog-animation /deep/ .v-text-field .v-input__control {
    font-size: 0.8rem;
  }

  .dialog-animation /deep/ .v-btn {
    padding: 4px 8px;
    font-size: 0.7rem;
  }

  .snackbar-animation {
    font-size: 0.7rem;
    padding: 5px;
  }
}
</style>