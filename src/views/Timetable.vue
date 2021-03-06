<template>
  <div id="timetable">
    <div class="container">
      <b-dropdown aria-role="list" style="float: left">
        <template #trigger>
          <b-button icon-left="bars" />
        </template>
        <b-dropdown-item aria-role="listitem">
          <b-icon icon="cog"></b-icon>
          Settings
        </b-dropdown-item>
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
// import SettingsPopup from "@/components/SettingsPopup.vue";
import http from "@/services/http";
import common from "/common";
import { ToastProgrammatic as Toast } from "buefy";
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
      // let term = (this.date.getFullYear() - 1980) * 100 + (this.date.getMonth() < 6 ? 10 : 20);
      let term = 4110;
      let url = encodeURIComponent(
        `student/Week.asp?term=${term}&career=UGRD&dt=${this.date.getDate()}/${
          this.date.getMonth() + 1
        }/${this.date.getFullYear()}`
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
      let toast_message;
      if (message.startsWith("Note:")) {
        if (message.includes("is invalid or outside the selected semester")) {
          toast_message = "There are no scheduled classes on this date";
        } else {
          toast_message = message;
        }
        Toast.open({
          duration: 5000,
          message: toast_message,
          position: "is-bottom",
          type: "is-danger",
        });
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
        name = name.slice(-3) == " UG" ? name.substr(0, name.length - 3) : name; // removes 'UG' from the end of course names
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
        while (startTime - prevSpans[day].index < prevSpans[day].span) {
          day++;
        }
        prevSpans[day] = { span: duration, index: startTime };

        parsedClasses.push({
          name: name,
          time: startTime,
          day: day,
          duration: duration,
          course: textSeperated[0].trim(),
          room: textSeperated[3].trim().split("/"),
          type: textSeperated[2].split("(")[0].trim(),
          classNumber: Number(textSeperated[2].split("(")[1].substr(0, 5)),
          colour: this.genColours(name),
        });
      }
      return {
        classes: parsedClasses,
        earliestTime: earliestTime,
        latestTime: latestTime,
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
    },

    // openSettingsMenu() {
    //   this.$buefy.modal.open({
    //     parent: this,
    //     component: SettingsPopup,
    //     hasModalCard: true,
    //     customClass: "custom-class custom-class-2",
    //     trapFocus: true,
    //   });
    // },
  },
  data() {
    return {
      date: new Date(),
      timetable: { classes: [], earliestTime: 0, latestTime: 0 },
    };
  },
  mounted() {
    this.loadTimetable();
  },
  components: {
    WeekTimetable,
    // SettingsPopup,
  },
};
</script>
