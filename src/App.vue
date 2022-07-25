<script setup lang="ts">
import { ref } from "vue";
const activeIndex = ref("1");
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
    @select="handleSelect"
  >
    <el-menu-item index="/">Home</el-menu-item>
    <el-menu-item index="/exam">Exam</el-menu-item>
    <el-menu-item index="/template_engine">TemplateEngine</el-menu-item>
  </el-menu>
  <!-- <header>
    <div class="wrapper">

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->
  <Suspense>
    <template #default>
      <RouterView />
    </template>
    <template #fallback> 読み込み中 </template>
    <template #error> えらー </template>
  </Suspense>
</template>

<style>
:root {
  --el-font-family: 'Inter,Roboto,Oxygen,Fira Sans,Helvetica Neue,sans-serif';
}
</style>
