import { ref, computed } from 'vue'
import { defineStore } from 'pinia'


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

function dedent(callSite, ...args) {
  function format(str) {
    let size = -1;
    return str.replace(/\n(\s+)/g, (m, m1) => {
      if (size < 0)
        size = m1.replace(/\t/g, "    ").length;
      return "\n" + m1.slice(Math.min(m1.length, size));
    });
  }
  if (typeof callSite === "string")
    return format(callSite);
  if (typeof callSite === "function")
    return (...args) => format(callSite(...args));
  let output = callSite
    .slice(0, args.length + 1)
    .map((text, i) => (i === 0 ? "" : args[i - 1]) + text)
    .join("");
  return format(output);
}

export const useTemplateStore = defineStore('templates', () => {
  const isLoading = ref(false)

  const templates = ref<Template[]>([])
  const descriptions = ref<Description[]>([])
  const places = ref<Place[]>([])
  const mentionGroups = ref<MentionGroup[]>()

  async function loadSample() {

    mentionGroups.value = [
      {
        id: "group1",
        title: "group1",
        mentions: [{
          name: "person1a",
          value: "@p1a",
        },
        {
          name: "person1b",
          value: "@p1b",
        }]
      },
      {
        id: "group2",
        title: "group2",
        mentions: [{
          name: "person2a",
          value: "@p2a",
        },
        {
          name: "person2b",
          value: "@p2b",
        },
        {
          name: "person1a",
          value: "@p1a",
        }]
      }
    ]

    templates.value = [
      {
        title: '作業通知1',
        value: dedent`
          {{mentions}}
          # 作業通知
          {{description}}
          日時：{{date}} {{timeFrom}} 〜 {{timeTo}}
          作業場所：{{places}}
          作業者：{{name}}
          連作先：{{tel}}
        `.trim(),
        mentionGroupIds: ['group1', 'group2'],
        places: ["場所1", "場所2"],
      }, 
      {
        title: '作業通知2',
        value: dedent`
        {{mentions}}
        なし`,
        mentionGroupIds: ['group1'],
        places: ["場所1"],
      },
    ]

    descriptions.value = [
      {
        title: '内容テンプレート1',
        value: dedent`
          下記作業を実施します。
          - 作業1
          - 作業2
          影響範囲：
          - 影響1
          - 影響2
        `.trim(),
      },
      {
        title: '内容テンプレート2',
        value: dedent`
          下記作業を実施します
          - 作業a
          - 作業b
          影響範囲：
          - 影響a
          - 影響b
        `.trim(),
      },
    ]

    places.value = ["場所1", "場所2"]
  }

  async function load() {
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
  return { isLoading, loadSample, load, templates, descriptions, places, mentionGroups }
})