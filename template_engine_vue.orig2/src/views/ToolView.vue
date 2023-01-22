<script setup>

import Datepicker from 'vuejs3-datepicker';

</script>

<template>
  <div>
    <v-container class="grey lighten-5 pa-5">
      <v-row class="mt-5">
        <v-col cols="12">
          <h1 class="display-2 font-weight-bold mb-3">作業通知ジェネレータ</h1>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="4">
          <v-select v-model="selected_template" item-text="title" :items="templates" label="templates" return-object v-on:change="templateChanged"></v-select>
          <v-select v-model="selected_content" item-text="title" :items="contents" label="contents" return-object></v-select>
          <v-radio-group v-model="impact" row mandatory v-on:change="impactChanged">
            <template v-slot:label>
              <div>作業影響</div>
            </template>
            <v-radio label="アリ" color="red" value="yes"></v-radio>
            <v-radio label="ナシ" color="green" value="no"> </v-radio>
          </v-radio-group>
          <v-select v-model="selected_targets" item-text="text" :items="targets" label="targets" :disabled="isTargetsDisabled" persistent-hint multiple chips return-object></v-select>
          <v-row>
            <v-col cols="6">
              <v-text-field label="date" placeholder="Placeholder" v-model="date"></v-text-field>
            </v-col>
            <v-col col="6">
              <v-text-field label="time" v-model="time" placeholder="Placeholder"></v-text-field>
            </v-col>
          </v-row>
          <!-- <v-date-picker v-model="date" year-icon="mdi-calendar-blank" prev-icon="mdi-skip-previous" next-icon="mdi-skip-next"></v-date-picker> -->
          <datepicker v-model="date"></datepicker>
          <v-select v-model="selected_places" item-text="text" :items="places" label="作業場所（places）" persistent-hint multiple chips return-object></v-select>
          <v-text-field label="作業者（name）" v-model="name" placeholder="Placeholder"></v-text-field>
          <v-text-field label="連絡先（tel）" v-model="tel" placeholder="Placeholder"></v-text-field>
        </v-col>
        <v-col cols="8">
          <v-row>
            <v-col cols="6">
              <v-textarea name="template" rows="30" filled label="template" auto-grow v-model="template_text"></v-textarea>
            </v-col>
            <v-col cols="6">
              <v-textarea name="rendered" rows="30" filled label="rendered" auto-grow v-bind:value="renderedstring"></v-textarea>
              <v-btn color="primary" block v-on:click="copyToClipboard">テキストをコピー</v-btn>
              通知先は「作業通知」チャンネルとすること。
            </v-col>
          </v-row>
        </v-col>
      </v-row>

    <v-snackbar
      v-model="show_snacbakbar"
      :timeout="2000"
    >
      テキストをクリップボードにコピーしました

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="show_snacbakbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    </v-container>
  </div>
</template>

<script>
  import Handlebars from 'handlebars';

  import Data from './data/tool2data';
  export default {
    name: 'Tool',

    components: {
      Datepicker
    },
    data() {
      return {
        text: '',
        date: new Date().toISOString().substr(0, 10),
        time: 'xx:xx',
        selected_targets: [],
        template_text: '',
        targets: [],
        places: [],
        selected: null,
        templates: [],
        name: '',
        selected_places: [],
        tel: '',
        contents: null,
        selected_content: null,
        impact: 'yes',
        isTargetsDisabled: false,
        show_snacbakbar: false,
      };
    },
    computed: {
      renderedstring: function () {
        var template = Handlebars.compile(this.template_text);
        return template(this.args());
      },
    },
    methods: {
      args: function () {
        return {
          name: this.name,
          places_str: this.selected_places.map((t) => t.text).join(', '),
          places_arr: this.selected_places.map((t) => t.text),
          tel: this.tel,
          date: this.date,
          time: this.time,
          machines: this.selected_targets.map((t) => t.text).join('\n'),
          targets_str: this.impact === 'yes' ? this.selected_targets.map((t) => t.value).join(' ') : "",
          targets_arr: this.impact === 'yes' ? this.selected_targets.map((t) => t.value) : [],
          username: this.name,
          content: this.selected_content !== null && this.selected_content.text || "",
        };
      },
      templateChanged(template) {
        var ts = this.targets.filter((t) => {
          return template.targets.includes(t.id);
        });
        this.selected_targets = ts;
        this.template_text = template.text;
      },
      impactChanged(value){
        if(value === 'yes'){
          this.isTargetsDisabled = false
        } else {
          this.isTargetsDisabled = true
        }
      },
      set_template() {
        console.log(Data);
        this.$data.templates = Data.templates
        this.$data.targets = Data.targets
        this.$data.places = Data.places
        this.$data.contents = Data.contents
      },
      copyToClipboard(event) {
        navigator.clipboard.writeText(this.renderedstring).catch((e) => {
          console.error(e);
        });
        this.$data.show_snacbakbar = true
      },
    },
    created() {
      this.set_template();
      this.selected_template = this.templates[0]
      this.templateChanged(this.selected_template)
      this.selected_content = this.contents[0]
    },
  };
</script>
