import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import templatesLocalData from '@/assets/templates_local_data'


export interface Mention {
  name: string
  value: string
}

export interface MentionGroup {
  id: string
  title: string
  mentions: Mention[]
}

export interface Template {
  title: string
  value: string
  mentionGroupIds: string[]
  places: string[]
}

export interface Description {
  title: string
  value: string
}

type Place = string

export const useTemplateStore = defineStore('templates', () => {
  const isLoading = ref(false)

  const templates = ref<Template[]>([])
  const descriptions = ref<Description[]>([])
  const places = ref<Place[]>([])
  const mentionGroups = ref<MentionGroup[]>([])

  async function loadFromLocalFile() {
    mentionGroups.value = templatesLocalData.mentionGroups
    templates.value = templatesLocalData.templates
    descriptions.value = templatesLocalData.descriptions
    places.value = templatesLocalData.places
  }

  async function loadFromURL() {
    isLoading.value = true
    fetch('http://localhost:5000/api/v2/templates', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.text())
      .then(data => {
        const tmp = JSON.parse(data)
        templates.value = tmp.templates
      })
    isLoading.value = false
  }

  async function load() {
    // loadFromURL()
    await loadFromLocalFile()
  }

  return { isLoading, load, templates, descriptions, places, mentionGroups }
})