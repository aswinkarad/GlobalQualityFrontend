<template>
  <v-container class="px-4 hmmsdashboard" fluid style="min-height: 100vh; background: linear-gradient(135deg, #F5F7FA, #E8ECEF);">
    <v-row align="center" class="top-bar">
      <v-col cols="12" md="6">
        <v-breadcrumbs :items="bread" class="breadcrumbs-container">
          <template v-slot:divider>
            <v-icon color="white">mdi-chevron-right</v-icon>
          </template>
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :to="item.to" :disabled="item.disabled" exact class="custom-breadcrumb-item">
              {{ item.text.toUpperCase() }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>

    <div class="text-h6 mb-2 category-title" style="font-family: 'Montserrat', sans-serif !important">
      SUB CATEGORIES
    </div>

    <searchAndFilterToolbar 
      :btn_text="cl_text" 
      :show-button="showToolbar" 
      :show-filter-icon="false" 
      @btn_action="dialog = true" 
      class="toolbar" 
    />
    <addCat :visible="dialog" @close="dialog = false" @save="addSubCategory" :title="dialog_title" class="dialog-animation" />

    <div class="mt-8 category-cards">
      <categoryCard @clickOnCard="toEquipment" :cat="subCategoryList" @delteItem="deleteSubCat" @editItem="editSubCat" />
    </div>
    <snackbarVue :visible="snackbar" :text="mssg" :button="false" :color="snackColor" @close="snackbar = false" class="snackbar-animation" />
  </v-container>
</template>

<script>
import addCat from '@/components/categories/addCat.vue';
import searchAndFilterToolbar from '@/components/searchAndFilterToolbar.vue';
import categoryCard from '@/components/categoryCard.vue';
import snackbarVue from '@/components/snackbar.vue';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'subCategory',
  components: {
    searchAndFilterToolbar,
    categoryCard,
    addCat,
    snackbarVue,
  },
  data() {
    return {
      cl_text: 'Add Sub Category',
      dialog_title: 'Add Sub Category',
      dialog: false,
      snackbar: false,
      mssg: '',
      snackColor: '',
      showToolbar: false,
      sub_text: 'Add Sub Category',
      bread: [
        {
          text: 'Home',
          disabled: false,
          exact: true,
          to: '/',
        },
        {
          text: 'Categories',
          disabled: false,
          exact: true,
          to: { name: 'category' },
        },
        {
          text: 'Sub Categories',
          disabled: true,
        },
      ],
    };
  },
  computed: {
    ...mapState('subCategory', ['subCategoryList', 'result']),
  },
  methods: {
    ...mapActions('subCategory', ['GET_SUB_CATEGORY', 'ADD_SUB_CATEGORY', 'DELETE_SUBCATEGORY', 'UPDATE_SUBCATEGORY']),
    isAdmin() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.role) {
        const userRole = user.role[0];
        if (userRole === 'admin') {
          this.sub_text = 'Add Sub Category';
          this.showToolbar = true;
        } else if (userRole === 'Engineer') {
          this.sub_text = null;
          this.showToolbar = false;
        } else {
          this.sub_text = null;
          this.showToolbar = true;
        }
      }
    },
    toEquipment(item) {
      this.$router.push({ name: 'subEquipment', params: { sub_name: item.subcategoryName, id: item.id } });
    },
    async addSubCategory(payload) {
      await this.ADD_SUB_CATEGORY(payload).then(() => {
        if (this.result && this.result.message === 'Validation error') {
          this.snackColor = 'error';
          this.mssg = `${payload.name} is Already Exist`;
          this.snackbar = true;
        } else {
          this.snackColor = 'success';
          this.mssg = 'Sub Category Added Successfully';
          this.snackbar = true;
          this.GET_SUB_CATEGORY(this.$route.params);
          this.dialog = false;
        }
      });
    },
    async deleteSubCat(payload) {
      await this.DELETE_SUBCATEGORY(payload).then(() => {
        this.snackColor = 'success';
        this.mssg = 'Sub Category Deleted Successfully';
        this.snackbar = true;
        this.GET_SUB_CATEGORY(this.$route.params);
      });
    },
    async editSubCat(item) {
      await this.UPDATE_SUBCATEGORY(item).then(() => {
        this.snackColor = 'success';
        this.mssg = 'Sub Category Updated Successfully';
        this.snackbar = true;
        this.GET_SUB_CATEGORY(this.$route.params);
      });
    },
  },
  mounted() {
    this.isAdmin();
    this.GET_SUB_CATEGORY(this.$route.params);
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
  border-radius: 12px;
  padding: 10px 16px;
  box-shadow: 0 6px 15px rgba(77, 144, 254, 0.2);
  animation: slideInDown 0.8s ease-out;
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
  }

  .custom-breadcrumb-item {
    font-size: 0.9rem;
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
  }

  .custom-breadcrumb-item {
    font-size: 0.8rem;
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