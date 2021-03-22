<template>
  <div id="timetable">
    <div class="container">
      <nav>
        <b-dropdown aria-role="list" class="menu-button">
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
        <b-field grouped position="is-centered" v-if="isOnline">
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

        <b-field grouped position="is-centered" v-else>
          Offline
        </b-field>
      </nav>

      <WeekTimetable
        :table="timetable.classes"
        :earliestTime="timetable.earliestTime"
        :latestTime="timetable.latestTime"
      >
      </WeekTimetable>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu-button {
  float: left;
}
#table {
  min-height: 90vh;
}
@media only screen and (min-device-width: 480px) {
  #table {
    min-height: 92vh;
  }

  nav {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 8vh;
  }

  .menu-button {
    left: 0;
    position: absolute;
  }
}
</style>

<script>
import WeekTimetable from "@/components/WeekTimetable.vue";
// import SettingsPopup from "@/components/SettingsPopup.vue";
import http from "@/services/http";
import common from "/common";
import { ToastProgrammatic as Toast } from "buefy";
const seedrandom = require("seedrandom");

let hues = {};
let careers = {
  Undergraduate: "UGRD",
  "Non Award": "NAWD",
  "Undergraduate Law (LLB)": "ULAW",
  Postgraduate: "PGRD"
};

export default {
  name: "Timetable",
  methods: {
    changeWeek(direction) {
      this.date.setDate(this.date.getDate() + 7 * direction);
      this.$refs.picker.onChange(this.date.toString());
    },

    async getCareers() {
      let url = encodeURIComponent(`student/StudyList.asp`);

      try {
        let res = await http.get(".netlify/functions/getpage?url=" + url);
        let element = document.createElement("html");
        element.innerHTML = res.data;

        let documentElements = element.getElementsByClassName("tbdr");
        let studentCareers = [];

        for (var table of documentElements) {
          // temp++;
          // if (documentElements[temp].name == "CAR_0") {
          //   break;
          // }
          let career = table.getElementsByTagName("td")[0];
          if (career != undefined) {
            studentCareers.push(careers[career.innerText]);
          }
        }

        // [...documentElements].slice(18, temp).forEach(e => {
        //   studentCareers.push(careers[e.innerText]);
        // });

        return studentCareers;
      } catch (err) {
        // this.$store.dispatch("logout");
        return null;
      }
    },

    async fetchTimetable(studentCareer, term) {
      let url = encodeURIComponent(
        `student/Week.asp?term=${term}&career=${studentCareer}&dt=${this.date.getDate()}/${this.date.getMonth() +
          1}/${this.date.getFullYear()}`
      );

      try {
        let res = await http.get(".netlify/functions/getpage?url=" + url);
        return res.data;
      } catch (err) {
        // this.$store.dispatch("logout");
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
          type: "is-danger"
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
      let studentCareers = await this.getCareers();
      let term =
        (this.date.getFullYear() - 1980) * 100 +
        (this.date.getMonth() < 6 ? 10 : 20);

      let tbs = [];

      for (const studentCareer of studentCareers) {
        let tb = await this.fetchTimetable(studentCareer, term);
        if (tb != null) {
          tbs.push(tb);
        }
      }

      let classes = [];
      hues = {};
      let earliestTime = 999;
      let latestTime = 0;

      for (const tb of tbs) {
        let result = this.parseTimetable(tb);
        classes = classes.concat(result.classes);
        if (earliestTime > result.earliestTime) {
          earliestTime = result.earliestTime;
        }
        if (latestTime < result.latestTime) {
          latestTime = result.latestTime;
        }
      }

      this.timetable = {
        classes: classes,
        earliestTime: earliestTime,
        latestTime: latestTime
      };
      // if (tbs != []) {
      //   hues = {};
      //   this.timetable = this.parseTimetable(tbs[0]);
      // }
    }

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
      timetable: { classes: [], earliestTime: 0, latestTime: 0 }
    };
  },
  mounted() {
    this.loadTimetable();
  },
  components: {
    WeekTimetable
    // SettingsPopup,
  }
};
</script>
