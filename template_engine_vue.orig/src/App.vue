<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
const drawer = {drawer: null}
const menu_items = [
      ["mdi-email", "Home", "/"],
      ["mdi-account-supervisor-circle", "App", "HelloWorld"],
      // ["mdi-account-supervisor-circle", "Tool1", "Tool1"],
      ["mdi-account-supervisor-circle", "Tool2", "Tool2"],
      // ["mdi-clock-start", "About", "About"],
]
</script>

<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer.drawer = !drawer.drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>My Apps</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item
          v-for="([icon, text, link], i) in menu_items"
          :key="i"
          link
          :to="link"
          :title="text"
          :prepend-icon="icon"
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main><RouterView /></v-main>
  </v-app>
</template>
