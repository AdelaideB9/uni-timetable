<template>
  <div id="timetable">
    <div class="container">
      <b-dropdown aria-role="list" style="float: left">
        <template #trigger>
          <b-button icon-left="bars" />
        </template>

        <b-dropdown-item
          aria-role="listitem"
          @click="$store.dispatch('logout')"
          value="logout"
        >
          <b-icon icon="sign-out-alt"></b-icon>
          Logout
        </b-dropdown-item>
      </b-dropdown>
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

      <b-message v-if="message" type="is-danger">
        {{ message }}
      </b-message>

      <WeekTimetable
        :table="timetable.classes"
        :earliestTime="timetable.earliestTime"
        :latestTime="timetable.latestTime"
      >
      </WeekTimetable>
    </div>
  </div>
</template>

<script>
import WeekTimetable from "@/components/WeekTimetable.vue";
import http from "@/services/http";
import common from "/common";
const seedrandom = require("seedrandom");

let hues = {};

export default {
  name: "Timetable",
  methods: {
    changeWeek(direction) {
      this.date.setDate(this.date.getDate() + 7 * direction);
      this.$refs.picker.onChange(this.date.toString());
    },

    async fetchTimetable() {
      let url = encodeURIComponent(
        `student/Week.asp?term=4110&career=UGRD&dt=${this.date.getDate()}/${this.date.getMonth() +
          1}/${this.date.getFullYear()}`
      );

      try {
        let res = await http.get(".netlify/functions/getpage?url=" + url);
        return res.data;
      } catch (err) {
        this.$store.dispatch("logout");
        return null;
      }
    },

    parseTimetable(HTMLtable) {
      let element = document.createElement("html");
      element.innerHTML = HTMLtable;

      let message = element.getElementsByTagName("p")[0].innerText;
      if (message.startsWith("Note:")) {
        this.message = message;
      } else {
        this.message = "";
      }

      element.innerHTML = element.getElementsByTagName("table")[18].outerHTML;

      let classes = element.getElementsByClassName("altbdr");

      let parsedClasses = [];
      let earliestTime = 0;
      let latestTime = 0;
      let prevSpans = new Array(5).fill({ span: 0, index: 0 });

      for (var i = 0; i < classes.length; i++) {
        let text = classes[i].getElementsByTagName("span")[0];

        text.innerHTML = text.innerHTML.replaceAll("<br>", "\n");
        let textSeperated = text.innerText.split("\n");

        let name = textSeperated[1].trim();
        let startTime = textSeperated[4]
          .split("-")[0]
          .replace("noon", "12:00am")
          .split(":00");

        startTime =
          startTime[1].trim() == "am"
            ? Number(startTime[0])
            : Number(startTime[0]) + 12;

        if (i == 0) {
          earliestTime = startTime;
        }
        let duration = Number(classes[i].getAttribute("rowspan")) / 2;
        if (latestTime < startTime + duration) {
          latestTime = startTime + duration;
        }

        let day = classes[i].cellIndex - 1;
        day =
          startTime - prevSpans[day].index < prevSpans[day].span
            ? day + 1
            : day;
        prevSpans[day] = { span: duration, index: startTime };

        parsedClasses.push({
          name: name,
          time: startTime,
          day: day,
          duration: duration,
          course: textSeperated[0].trim(),
          room: textSeperated[3].trim(),
          type: textSeperated[2].split("(")[0].trim(),
          classNumber: Number(textSeperated[2].split("(")[1].substr(0, 5)),
          colour: this.genColours(name)
        });
      }
      return {
        classes: parsedClasses,
        earliestTime: earliestTime,
        latestTime: latestTime
      };
    },

    genColours(name) {
      let random_num = new seedrandom(name);

      for (;;) {
        let hue = Math.floor(random_num.quick() * 360);

        let validColour = true;
        for (const val in hues) {
          if (val == name) return hues[name];

          if (val != name && common.angularDistance(hues[val], hue) < 50)
            validColour = false;
        }

        if (validColour) {
          hues[name] = hue;
          return hue;
        }
      }
    },

    async loadTimetable() {
      let tb = await this.fetchTimetable();
      if (tb != null) {
        this.timetable = this.parseTimetable(tb);
      }
    }
  },
  data() {
    return {
      date: new Date(),
      timetable: { classes: [], earliestTime: 0, latestTime: 0 },
      message: ""
    };
  },
  mounted() {
    this.loadTimetable();
  },
  components: {
    WeekTimetable
  }
};
</script>

<style lang="scss">
@media only screen and (max-device-width: 480px) {
  .show-on-mobile {
    display: block;
  }
  .hide-on-mobile {
    display: none;
  }
}
.container {
  height: inherit;
}

#timetable {
  height: inherit;
}
</style>
