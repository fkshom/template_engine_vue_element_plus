<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import yaml from "js-yaml";
const impact = ref("yes");
import yaml from "js-yaml";
import { defaultDocument } from "@vueuse/core";
const impact = ref("yes");
const impact_is_disabled = ref(false);
const templates = ref([]);
const descriptions = ref([]);
const places = ref([]);
const mentions = ref([]);
const selected_template = ref("");
const selected_mentions = ref([]);
const selected_description = ref("");

const fetchData = async () => {
  const res = await fetch("/templates.yaml");
  const data = yaml.load(await res.text());
  templates.value = data.templates;
  selected_template.value = templates.value[0];
  descriptions.value = data.descriptions;
  selected_description.value = descriptions.value[0];
  places.value = data.places;
  selected_places.value = [places.value[0]];
  mentions.value = data.mentions;
  selected_mentions.value = [mentions.value[0]];
};
fetchData();

// 日付をYYYY/MM/DDの書式で返すメソッド
function formatDate(dt) {
  const y = dt.getFullYear();
  const m = ("00" + (dt.getMonth() + 1)).slice(-2);
  const d = ("00" + dt.getDate()).slice(-2);
  return y + "/" + m + "/" + d;
}
const selected_date = ref(formatDate(new Date()));
const inputed_time = ref("");

const selected_places = ref([]);
const inputed_name = ref("");
const inputed_tel = ref("");

import Handlebars from "handlebars";

const template_rendered = computed(() => {
  const content = selected_template.value.content || "";
  const template = Handlebars.compile(content);

  const mentions_str = (() => {
    let names = [];
    if (selected_mentions.value.length == 0) {
      names = [];
    } else {
      names = selected_mentions.value
        .map((m) => {
          return m.names;
        })
        .flat();
    }
    if (impact.value == "no") {
      names = [];
    }

    console.log("names", names);
    return names.join(" ");
  })();
  return template({
    places_str: selected_places.value.join(", "),
    places_arr: selected_places.value,
    tel: inputed_tel.value,
    date: selected_date.value,
    time: inputed_time.value,
    mentions_str: mentions_str,
    name: inputed_name.value,
    description: selected_description.value.text,
  });
});
const templateChanged = () => {
  console.log("change");
  console.log("templates");
  console.log(templates);
  console.log("selected_template");
  console.log(selected_template);
};
</script>

<template></template>
