import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';


import HomeView from '../views/HomeView.vue';
import dashboard from '../views/dashboard.vue';
import category from '../views/categories/category.vue';
import subcat from '../views/categories/subCategories.vue';
import subEquipment from '../views/categories/equipment.vue';
import equipment from '../views/equipments/equipment.vue';
import saleEquip from '../views/equipments/saleEquipInner.vue';
import client from '../views/client/client.vue';
import clientInnerPage from '../views/client/clientInnerPage.vue';
import admin from '../views/users/admin.vue';
import subAdmin from '../views/users/subAdmin.vue';
import technician from '../views/users/technician.vue';
import serviceRequest from '../views/services/serviceRequest.vue';
import serviceInner from '../views/services/serviceInner.vue';
import calibration from '../views/services/calibration.vue';
import preventiveReminders from '../views/reminders/preventiveReminders.vue';
import calibrationReminders from '../views/reminders/calibrationReminders.vue';
import cityPage from '../views/city/city.vue';
import careOfPage from '../views/careOf/careOf.vue';
import signIn from '../views/signIn.vue';
import clientReport from '@/views/reports/clientByCity.vue';
import equipmentReport from '@/views/reports/equipmentWithClient.vue';
import servicetReport from '@/views/reports/serviceReport.vue';
import technicianReport from '@/views/reports/technicianReport.vue'
import serviceType from '@/views/ServiceType/serviceType.vue'
import MessageList from '@/views/services/Messages/MessageList.vue'



const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    redirect: 'service',
    children: [
      {
        path: 'dashboard',
        name: 'dash',
        component: dashboard
      },
      {
        path: 'category',
        name: 'category',
        component: category
      },
      {
        path: 'category/:cat_name',
        name: 'subCat',
        component: subcat,

      },
      {
        path: 'category/:cat_name/:sub_name/:id',
        name: 'subEquipment',
        component: subEquipment,
      },
      {
        path: 'equipments',
        name: 'equipment',
        component: equipment,
      },
      {
        path: 'equipments/:id',
        name: 'saleEquip',
        component: saleEquip
      },
      {
        path: 'client',
        name: 'client',
        component: client,
      },
      {
        path: 'client/:id',
        name: 'clientInnerPage',
        component: clientInnerPage
      },
      {
        path: 'admin',
        name: 'admin',
        component: admin,
      },
      {
        path: 'subAdmin',
        name: 'subAdmin',
        component: subAdmin
      },
      {
        path: 'technician',
        name: 'technician',
        component: technician
      },
      {
        path: 'service',
        name: 'serviceRequest',
        component: serviceRequest
      },
      {
        path: 'service/:id',
        name: 'serviceInner',
        component: serviceInner
      },
      {
        path: 'service/calibrations',
        name: 'calibration',
        component: calibration
      },
      {
        path: 'reminder/Preventive_reminder',
        name: 'preventiveReminders',
        component: preventiveReminders
      },
      {
        path: 'reminder/calibration_reminders',
        name: 'calibrationReminders',
        component: calibrationReminders
      },
      {
        path: 'reports/client',
        name: 'clientReport',
        component: clientReport
      },
      {
        path: 'reports/equipment',
        name: 'equipmentReport',
        component: equipmentReport
      },
      {
        path: 'reports/service',
        name: 'servicetReport',
        component: servicetReport
      },
      {
        path: 'reports/technician',
        name: 'technicianReport',
        component: technicianReport
      },
      {
        path: 'city',
        name: 'cityPage',
        component: cityPage
      },
      {
        path: 'careOf',
        name: 'careOfPage',
        component: careOfPage
      },
      {
        path: 'serviceType',
        name: 'serviceType',
        component: serviceType
      },
      {
        path: 'MessageList',
        name: 'MessageList',
        component: MessageList
      },
    ],
    beforeEnter: (to, from, next) => {
      const auth = JSON.parse(localStorage.getItem('user'))
      if (auth) {
        axios({
          method: 'get',
          url: `${process.env.VUE_APP_BASE_URL}users/all_users/1`,
          headers: {
            Authorization: 'Bearer ' + auth.access_token
          }
        }).then(() => {
          next()
        }).catch(err => {
          next({ name: 'signIn' })
        })
      } else {
        next({ name: 'signIn' })

      }
    }
  },
  {
    path: '/signIn',
    name: 'signIn',
    component: signIn
  }

]
const history = createWebHistory();
const router = createRouter({
  scrollBehavior() {
    return { top: 0 };
  },
  history,
  routes
})

export default router
