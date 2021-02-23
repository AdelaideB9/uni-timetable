<template>
  <div>
    <br />
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
      <br />

      <b-message v-if="message" type="is-danger">
        {{ message }}
      </b-message>

      <TB
        :table="classes"
        :cellHeight="60"
        :cellWidth="180"
        :earliestTime="earliestTime"
        :latestTime="latestTime"
      >
      </TB>
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
  cursor: pointer;
  height: inherit;
  padding: 5%;
}

.event-container {
  height: 100%;
  border-radius: 0.25rem;
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
    0 0px 0 1px rgba(10, 10, 10, 0.02);
}

th {
  text-align: center !important;
}

tr {
  height: 30px !important;
}

@media only screen and (max-device-width: 480px) {
  .show-on-mobile {
    display: block;
  }
  .hide-on-mobile {
    display: none;
  }
}
</style>

<script>
import ClassPopup from "@/components/ClassPopup.vue";
import TB from "@/components/Timetable.vue";
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

    timeIndexToTime(i) {
      let mod = "pm";
      if (i % 2 == 0) {
        return "";
      }
      if (i + this.earliestTime - 1 < 24) {
        mod = "am";
      }
      return String((((i + this.earliestTime - 1) / 2 - 1) % 12) + 1) + mod;
    },

    async fetchTimetable() {
      let url = encodeURIComponent(
        `student/Week.asp?term=4110&career=UGRD&dt=${this.date.getDate()}/${
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
      if (message.startsWith("Note:")) {
        this.message = message;
      } else {
        this.message = "";
      }

      element.innerHTML = element.getElementsByTagName("table")[18].outerHTML;

      let classes = element.getElementsByClassName("altbdr");

      let parsedClasses = [];
      

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
          this.earliestTime = startTime;
        }
        let duration = Number(classes[i].getAttribute("rowspan")) / 2;
        if (this.latestTime < startTime+duration) {
          this.latestTime = startTime+duration
        }

        parsedClasses.push({
          name: name,
          time: startTime,
          day: classes[i].cellIndex - 1,
          duration: duration,
          course: textSeperated[0].trim(),
          room: textSeperated[3].trim(),
          type: textSeperated[2].split("(")[0].trim(),
          classNumber: Number(textSeperated[2].split("(")[1].substr(0, 5)),
          colour: this.genColours(name),
        });
      }
      return parsedClasses;
    },
    t(i) {
      let c = this.classes[i];

      this.$buefy.modal.open({
        parent: this,
        props: { event: c },
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
        this.classes = this.parseTimetable(tb);
        console.log(this.classes);
      }
    },
  },
  data() {
    return {
      date: new Date(),
      classes: [],
      earliestTime: 0,
      latestTime: 0,
      message: "",
      test: [
        { name: "Test", day: 0, time: 7, colour: "0000FF", duration: 2 },
        { name: "Lachlan", day: 0, time: 6, colour: "FF00FF", duration: 1 },
        { name: "Hello", day: 2, time: 10, colour: "001FFF", duration: 1 },
      ],
    };
  },
  mounted() {
    this.loadTimetable();
  },
  components: {
    TB,
  },
};
</script>
