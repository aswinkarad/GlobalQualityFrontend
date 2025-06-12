<template>
    <v-breadcrumbs :items="items" class="breadcrumbs-container">
      <template v-slot:divider>
        <v-icon color="white">mdi-chevron-right</v-icon>
      </template>
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item 
          :href="item.href" 
          :disabled="item.disabled" 
          class="custom-breadcrumb-item"
          @click.prevent="navigate(item)"
        >
          {{ item.text }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </template>
  
  <script>
  export default {
    name: 'Breadcrumbs',
    props: {
      items: {
        type: Array,
        required: true,
        default: () => [],
      },
    },
    methods: {
      navigate(item) {
        if (!item.disabled && item.href) {
          this.$router.push(item.href);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .breadcrumbs-container {
    background: linear-gradient(90deg, #FF5733, #2A4066);
    border-radius: 12px;
    padding: 15px;
    box-shadow: 0 6px 15px rgba(255, 87, 51, 0.4);
    animation: slideInDown 0.6s ease-out;
  }
  
  .custom-breadcrumb-item {
    color: #fcfcfc;
    font-weight: 700;
    transition: all 0.3s ease;
  }
  
  .custom-breadcrumb-item:hover {
    color: #E8ECEF;
    transform: scale(1.05);
  }
  
  @keyframes slideInDown {
    0% {
      opacity: 0;
      transform: translateY(-100%);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 960px) {
    .breadcrumbs-container {
      padding: 10px;
    }
  }
  
  @media (max-width: 600px) {
    .breadcrumbs-container {
      padding: 8px;
    }
  }
  </style>