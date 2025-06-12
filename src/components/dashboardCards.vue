<template>
  <v-row class="">
    <v-col cols="12" md="3" sm="6" v-for="item in dash" :key="item.id">
      <v-card class="mx-auto"  rounded="lg" height="150">
        <v-card-header class=" justify-center flex-column" style="height: 100%;">
          <div class="card_text text-h3 " style="color:#00284a;">
            {{ item.data }}
          </div>
          <div class="card_text_sub text-h6 pt-2" style="color:#00284a;">
            
              {{ item.title }}
            
          </div>
        </v-card-header>
      </v-card>
    </v-col>
  </v-row>

</template>

<script>
export default {
  name: 'dashCard',
  props:{
    dash:{
      type: Array
    }
  },
  data: () => ({
    items: [
      {
        id: 1,
        title: 'Clients',
        data: 1024
      },
      {
        id: 2,
        title: 'Equipments',
        data: 987
      },
      {
        id: 3,
        title: 'Categories',
        data: 56
      },
      {
        id: 4,
        title: 'Calibrations',
        data: 453
      },
      {
        id: 5,
        title: 'Breakdown Maintenance',
        data: 678
      },
      {
        id: 6,
        title: 'Premitive Maintenance',
        data: 89
      },
      {
        id: 7,
        title: 'Premitive Reminders',
        data: 15
      },
      {
        id: 8,
        title: 'Calibrations Reminder',
        data: 45
      },
    ]
  })
}
</script>

<style scoped>
.card_text {
  font-family: Montserrat, sans-serif !important;

}

.card_text_sub {
  font-family: Montserrat, sans-serif !important;
  font-weight: 500;
  width: min-content;
  text-align: center;

line-height: normal
;
}
</style>