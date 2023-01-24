<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <v-app>
    <v-app-bar>
      ツール集
    </v-app-bar>
    <v-navigation-drawer>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </v-navigation-drawer>
    <v-main>
      <v-container>
      <RouterView />
    </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
</style>
