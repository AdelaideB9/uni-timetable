<template>
  <div>
    <br />
    <div class="container">
      <b-field grouped position="is-centered">
        <b-button
          class="control"
          icon-left="angle-left"
          @click="changeWeek(-1)"
        >
        </b-button>
        <b-datepicker
          @input="loadTimetable()"
          placeholder="Type or select a date..."
          icon="calendar"
          v-model="date"
          :unselectable-days-of-week="[0, 6]"
          ref="picker"
          editable
        >
        </b-datepicker>
        <b-button
          class="control"
          icon-left="angle-right"
          @click="changeWeek(1)"
        >
        </b-button>
      </b-field>
      <br />
      <!-- <pre>{{ timetable }}</pre> -->
      <!-- <div id="badidea"></div> -->

      <table>
        <tr>
          <th class="time"></th>
          <th>Monday</th>
          <th>Tuesday</th>
          <th>Wednesday</th>
          <th>Thursday</th>
          <th>Friday</th>
        </tr>
        <tr v-for="i in 26" :key="i">
          <td class="time">
            {{ timeIndexToTime(i) }}
          </td>
          <td
            v-for="j in 5"
            :key="26 * (j - 1) + i - 1"
            :rowspan="classAndRowspan(26 * j + i - 27)"
          >
            <div
              v-if="classes[26 * j + i - 27]"
              :set="(c = classes[26 * j + i - 27])"
              class="event-container"
              :key="26 * j + i - 27"
              :style="
                'background-color: hsl(' +
                classes[26 * j + i - 27].colour +
                ', 100%, 80%)'
              "
            >
              <div class="event" @click="t(26 * j + i - 27)">
                <p>
                  <b>{{ c.course }}</b>
                </p>
                <p>{{ c.classType }}</p>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style lang="scss">
table {
  // table-layout: fixed;
  width: 100%;
  height: 100%;
  font-size: 12px;

  border-collapse: unset !important;
  border-spacing: 10px !important;
}

.event {
  height: inherit;
  padding: 10%;
}

.event-container {
  height: 100%;
  border-radius: 0.25rem;
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
    0 0px 0 1px rgba(10, 10, 10, 0.02);
}

.time {
  max-width: "50%" !important;
}

th {
  text-align: center !important;
}

tr {
  height: 30px !important;
}
</style>

<script>
import ClassPopup from "@/components/ClassPopup.vue";
const seedrandom = require("seedrandom");

let hues = {};

export default {
  name: "Timetable",
  methods: {
    changeWeek(direction) {
      this.date.setDate(this.date.getDate() + 7 * direction);
      this.$refs.picker.onChange(this.date.toString());
    },

    timeIndexToTime(i) {
      if (i % 2 == 0) {
        return "";
      } else if (i <= 8) {
        return String(8 + (i - 1) / 2) + "am";
      } else if (i >= 11) {
        return String((8 + (i - 1) / 2) % 12) + "pm";
      }
      return "12pm";
    },

    async fetchTimetable() {
      this.$parent.$refs.topProgress.start();
      this.errorText = "";
      let url = encodeURIComponent(
        `student/Week.asp?term=4110&career=UGRD&dt=${this.date.getDate()}/${
          this.date.getMonth() + 1
        }/${this.date.getFullYear()}`
      );
      let res = await fetch(".netlify/functions/getpage?url=" + url);
      if (res.status == 500) {
        this.errorText = await res.text();
        this.$parent.$refs.topProgress.fail();
        this.$buefy.toast.open({
          duration: 5000,
          message: this.errorText,
          position: "is-top",
          type: "is-danger",
        });
        return null;
      }

      this.$parent.$refs.topProgress.done();
      return res.text();
    },

    parseTimetable(HTMLtable) {
      let element = document.createElement("html");
      element.innerHTML = HTMLtable;

      element.innerHTML = element.getElementsByTagName("table")[18].outerHTML;

      let classes = element.getElementsByClassName("altbdr");

      let parsedClasses = {};

      for (var i = 0; i < classes.length; i++) {
        let text = classes[i].getElementsByTagName("span")[0];

        text.innerHTML = text.innerHTML.replaceAll("<br>", "\n");
        let textSeperated = text.innerText.split("\n");

        let name = textSeperated[1].trim();

        let day = classes[i].cellIndex - 1;
        let hour = classes[i].parentNode.rowIndex - 1;
        let id = 26 * day + hour;

        parsedClasses[id] = {
          name: name,
          duration: Number(classes[i].getAttribute("rowspan")),
          time: [day, hour],
          course: textSeperated[0].trim(),
          room: textSeperated[3].trim(),
          classType: textSeperated[2].split("(")[0].trim(),
          classNumber: Number(textSeperated[2].split("(")[1].substr(0, 5)),
          colour: this.genColours(name),
          id: 26 * day + hour,
        };
      }
      return parsedClasses;
    },
    t(i) {
      let c = this.classes[i];
      console.log(c);

      this.$buefy.modal.open({
        parent: this,
        props: {event: c},
        component: ClassPopup,
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true,
      });
    },

    genColours(name) {
      let random_num = new seedrandom(name);

      for (;;) {
        let hue = Math.floor(random_num.quick() * 360);

        let validColour = true;
        for (const val in hues) {
          if (val == name) {
            return hues[name];
          }
          if (val != name && Math.abs(hues[val] - hue) < 20)
            validColour = false;
        }

        if (validColour) {
          hues[name] = hue;
          return hue;
        }
      }
    },

    classAndRowspan(i) {
      if (this.classes[i]) {
        this.currentClass = this.classes[i];
        return this.classes[i].duration;
      }
      this.currentClass = null;
      return 1;
    },

    async loadTimetable() {
      let tb = await this.fetchTimetable();
      if (tb != null) {
        this.classes = this.parseTimetable(tb);
      }
    },
  },
  data() {
    return {
      date: new Date(),
      classes: {},
    };
  },
  mounted() {
    this.loadTimetable();
  },
};
</script>
