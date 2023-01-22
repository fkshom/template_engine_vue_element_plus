<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
