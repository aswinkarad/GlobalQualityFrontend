import { createStore } from 'vuex'

import user from './modules/user';
import category from './modules/category';
import subCategory from './modules/subCategory';
import city from './modules/city';
import careof from './modules/careof';
import admin from './modules/users/admin';
import subAdmin from './modules/users/subAdmin';
import technician from './modules/users/technician';
import clients from './modules/clients';
import equipments from './modules/equipments';
import salesEquipment from './modules/salesEquipment';
import service from './modules/service';
import PreventiveReminders from './modules/reminders/PreventiveReminders';
import calibrationReminter from './modules/reminders/calibrationReminter';
import dashboard from './modules/dashboard';

import workingCondition from './modules/services/workingCondition';
import callHandle from './modules/services/callHandle';
import priority from './modules/services/priority';
import status from './modules/services/status';
import servicetype from './modules/servicetype';
import message from './modules/services/message';
import notifications from './modules/notifications';

export default createStore({
  namespaced: true,
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user,
    category,
    subCategory,
    city,
    careof,
    admin,
    subAdmin,
    technician,
    clients,
    equipments,
    salesEquipment,
    service,
    PreventiveReminders,
    dashboard,
    calibrationReminter,
    notifications,
    workingCondition,
    callHandle,
    priority,
    status,
    servicetype,
    message
  }
})
