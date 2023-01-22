<script setup lang="ts">
import { ref, reactive, computed } from "vue";
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

import { ElNotification } from "element-plus";
const copy_to_clipboard = () => {
  ElNotification({
    title: "Success",
    message: "テキストをクリップボードにコピーしました",
    type: "success",
    position: 'bottom-left',
  });
};

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

<template>
  <el-container>
    <el-header> 作業通知ジェネレータ </el-header>
    <el-main>
      <el-row>
        <el-col :span="5">
          <el-form label-width="120px">
            <el-form-item label="テンプレート">
              <el-select
                v-model="selected_template"
                class="m-2"
                placeholder="Template"
                value-key="name"
                v-on:change="templateChanged"
              >
                <el-option
                  v-for="item in templates"
                  :key="item.name"
                  :label="item.name"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="本文">
              <el-select
                v-model="selected_description"
                class="m-2"
                placeholder="Description"
                value-key="title"
                v-on:change="templateChanged"
              >
                <el-option v-for="item in descriptions" :key="item.title" :label="item.title" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="作業影響">
              <el-radio-group
                v-model="impact"
                class="ml-4"
                :disabled="impact_is_disabled"
              >
                <el-radio label="yes" color="red">アリ</el-radio>
                <el-radio label="no" color="green">ナシ</el-radio>
              </el-radio-group>
              <!-- <el-switch
                v-model="impact"
                class="ml-2"
                inline-prompt
                style="--el-switch-on-color: #ff4949; --el-switch-off-color: #13ce66"
                active-text="アリ"
                inactive-text="ナシ"
              /> -->
            </el-form-item>
            <el-form-item label="メンション">
              <el-select
                v-model="selected_mentions"
                placeholder="Mentions"
                multiple
                style="width: 240px"
                value-key="id"
              >
                <el-option
                  v-for="item in mentions"
                  :key="item.title"
                  :label="item.title"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="作業日時">
              <el-date-picker
                v-model="selected_date"
                type="date"
                placeholder="Pick a day"
                format="YYYY/MM/DD"
                value-format="YYYY/MM/DD"
              />
              <el-input
                v-model="inputed_time"
                placeholder="xx:xx"
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item label="場所">
              <el-select
                v-model="selected_places"
                placeholder="places"
                multiple
              >
                <el-option
                  v-for="item in places"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="作業者">
              <el-input
        v-model="inputed_name"
        placeholder="作業者"
        style="width: 120px"
      />

            </el-form-item>
            <el-form-item label="連絡先">
      <el-input
        v-model="inputed_tel"
        placeholder="連絡先"
        style="width: 120px"
      />
            </el-form-item>
            <el-form-item>
    <el-button type="primary" plain @click="copy_to_clipboard"
        >テキストをコピー</el-button
      >
            </el-form-item>

          </el-form>
        </el-col>
        <el-col :span="8">

      <el-input
        v-model="selected_template.content"
        placeholder="content"
        type="textarea"
        :autosize="{ minRows: 30, maxRows: 50 }"
      /></el-col>
        <el-col :span="8">
        <el-input
        v-bind:value="template_rendered"
        placeholder="content"
        type="textarea"
        :autosize="{ minRows: 30, maxRows: 50 }"
      />
        </el-col>
      </el-row>

    </el-main>
  </el-container>
</template>

<style scoped>
.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}
.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}
.demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
