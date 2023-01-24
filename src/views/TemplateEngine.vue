<script setup lang="ts">
import { ref, reactive, computed, watch, watchEffect } from "vue"
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useCookies } from "vue3-cookies";
import Handlebars from 'handlebars'
import { useTemplateStore } from '@/stores/templates'
import type { Mention, MentionGroup } from '@/stores/templates'

const { cookies } = useCookies()

const templateStore = useTemplateStore()

templateStore.load()

// from store
const templateItems = ref(templateStore.templates)
const descriptionItems = ref(templateStore.descriptions)
const mentionGroupItems = ref(templateStore.mentionGroups)
const placesItems = ref(templateStore.places)

// model
const templateValue = ref()
const descriptionValue = ref()
const impactValue = ref(true)
const impactLabel = computed(() => {
  if (impactValue.value === true) {
    return "作業影響：アリ"
  } else {
    return "作業影響：ナシ"
  }
})
const mentionGroupsValue = ref<MentionGroup[]>([])
const dateValue = ref(new Date())
const dateFormatYYYYMMDD = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}/${month}/${day}`;
}
const dateFormatMMDD = (date: Date) => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}/${day}`;
}
const textInputOptions = ref({
  format: 'yyyy/MM/dd'
})

const timeFromValue = ref("")
const timeToValue = ref("")
const placesValue = ref([])
const nameValue = ref(cookies.get("name"))
const telValue = ref(cookies.get("tel"))

const copy_to_clipboard_message_shown = ref(false)
const copy_to_clipboard = () => {
  copy_to_clipboard_message_shown.value = true
  setTimeout(() => {
    copy_to_clipboard_message_shown.value = false
  }, 1 * 1000)
}

const Text2MMDD = (str: string) => {
  const idx = 2
  const val = ":"
  return str.slice(0, idx) + val + str.slice(idx);
}

const renderedText = computed(() => {
  if (templateText.value === undefined) {
    return ""
  }

  let template = Handlebars.compile(templateText.value)
  return template({
    mentions: mentions_str.value,
    description: descriptionValue.value.value,
    date: dateFormatMMDD(dateValue.value),
    timeFrom: Text2MMDD(timeFromValue.value),
    timeTo: Text2MMDD(timeToValue.value),
    places: placesValue.value.join(", "),
    name: nameValue.value,
    tel: telValue.value,
  })
})

const mentions_str = computed(() => {
  if (impactValue.value == true && mentionGroupsValue.value.length > 0) {
    const ms: string[] = mentionGroupsValue.value
      .map((mg: MentionGroup) => mg.mentions)
      .flat()
      .map((m: Mention) => m.value)
      .sort()
    const ms_uniqued = Array.from(new Set(ms))
    return ms_uniqued.join(" ")
  } else {
    return ""
  }
})


const templateText = ref()
watch(templateValue, async (newTemplate, oldTemplate) => {
  // apply to templateText
  templateText.value = newTemplate.value

  // apply to mentionGroupsValue
  mentionGroupsValue.value = newTemplate.mentionGroupIds.map((mgid: string) => {
    return mentionGroupItems.value.find((mg: MentionGroup) => {
      if(mg.id == mgid){
        return true
      }
      return false
    })
  })

  // apply to places
  placesValue.value = newTemplate.places
})

// when initial load
watchEffect(() => {
  if(templateValue.value === undefined){
    templateValue.value = templateItems.value[0]
  }
  if(descriptionValue.value === undefined){
    descriptionValue.value = descriptionItems.value[0]
  }
})

// save cookie
watchEffect(() => {
  cookies.set("name", nameValue.value)
  cookies.set("tel", telValue.value)
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" no-gutters>
        <v-row :dense="true">
          <v-col cols="12" xl="6">
            <v-autocomplete v-model="templateValue" return-object label="テンプレート" :items="templateItems"></v-autocomplete>
          </v-col>
          <v-col cols="12" xl="6">
            <v-autocomplete v-model="descriptionValue" return-object label="本文" :items="descriptionItems"></v-autocomplete>
          </v-col>
        </v-row>
        <v-row :dense="true">
          <v-col>
            <v-switch v-model="impactValue" hide-details inset color="red" :label="impactLabel"></v-switch>
            <v-autocomplete v-model="mentionGroupsValue" multiple return-object label="メンション"
              :items="mentionGroupItems">
            </v-autocomplete>
            <Datepicker v-model="dateValue" inline text-input inline-with-input auto-apply :enable-time-picker="false"
              placeholder="日時" :format="dateFormatYYYYMMDD" :text-input-options="textInputOptions"></Datepicker>
          </v-col>
        </v-row>

        <v-row :dense="true" align="center">
          <v-col>
            <v-text-field v-model="timeFromValue" label="HHMM"></v-text-field>
          </v-col>
          <v-col cols="1">
            〜
          </v-col>
          <v-col>
            <v-text-field v-model="timeToValue" label="HHMM"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-autocomplete v-model="placesValue" multiple chips label="場所" :items="placesItems">
            </v-autocomplete>

            <v-text-field v-model="nameValue" label="作業者"></v-text-field>

            <v-text-field v-model="telValue" label="連絡先"></v-text-field>

            <v-tooltip v-model="copy_to_clipboard_message_shown" end :open-on-hover="false">
              <template v-slot:activator="{ props }">
                <v-btn color="success" v-bind="props" @click="copy_to_clipboard">テキストをコピー</v-btn>
              </template>
              <span>コピーしました</span>
            </v-tooltip>
          </v-col>
        </v-row>

      </v-col>
      <v-col cols="12" sm="6">
        <v-textarea label="テンプレート" rows="10" v-model="templateText"></v-textarea>
        <v-textarea label="出力" rows="30" auto-grow v-model="renderedText"></v-textarea>
      </v-col>
    </v-row>
  </v-container>
</template>