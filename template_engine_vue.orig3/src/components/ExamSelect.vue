<script setup lang="ts">
import { ref, computed } from "vue";

const options = [
  {
    title: "title1",
    value: "value1",
  },
  {
    title: "title2",
    value: "value2",
  },
  {
    title: "title3",
    value: "value3",
  },
];
const selected = ref("");

const changed = () => {
  console.log("selected", selected);
  console.log("selected.value", selected.value);
  console.log("selected.value[0]", selected.value[0]);
  console.log("selected.value[0].title", selected.value[0].title);
  console.log("selected.value[1]?.title", selected.value[1]?.title);
};
</script>

<template>
  <el-select
    v-model="selected"
    class="m-2"
    multiple
    placeholder="Select"
    value-key="title"
    v-on:change="changed"
  >
    <el-option
      v-for="item in options"
      :key="item.title"
      :label="item.title"
      :value="item"
    />
  </el-select>

  <div>selected: {{ selected }}</div>
  <div></div>
</template>

<style scoped></style>
