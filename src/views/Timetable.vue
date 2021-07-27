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
            @click="changeDay(-1)"
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
            @click="changeDay(1)"
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
        :offset="timetable.offset"
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
import common from "/common";
//import { ToastProgrammatic as Toast } from "buefy";
const seedrandom = require("seedrandom");

let hues = {};

export default {
  name: "Timetable",
  methods: {
    changeDay(direction) {
      this.date.setDate(this.date.getDate() + direction);
      while(!(this.date.getDay() % 6)) {
        this.date.setDate(this.date.getDate() + direction);
      }
      this.$refs.picker.onChange(this.date.toString());
    },

    genColours(name) {
      let random_num = new seedrandom(name);

      for (;;) {
        let hue = Math.floor(random_num.quick() * 360);

        let validColour = true;
        for (const val in hues) {
          if (val == name) return hues[name];

          if (val != name && common.angularDistance(hues[val], hue) < 40)
            validColour = false;
        }

        if (validColour) {
          hues[name] = hue;
          return hue;
        }
      }
    },

    async loadTimetable() {
      var todayUTC = new Date(
        Date.UTC(
          this.date.getFullYear(),
          this.date.getMonth(),
          this.date.getDate()
        )
      );
      while (!(todayUTC.getDay() % 6)) {
        todayUTC.setDate(todayUTC.getDate() + 1);
      }

      let timetable = this.$store.getters.timetable(todayUTC);
      let classes = [];

      timetable.forEach((day, i) => {
        for (c of day) {
          c.time = parseInt(c["start_time"].split(":")[0]);
          c.duration =
            parseInt(c["end_time"].split(":")[0]) -
            parseInt(c["start_time"].split(":")[0]);
          c.colour = this.genColours(c.course);
          c.day = i;
          classes.push(c);
        }
      });

      let earliestTime = 999;
      let latestTime = 0;

      for (var c of classes) {
        if (earliestTime > c.time) {
          earliestTime = c.time;
        }
        if (latestTime < c.time + c.duration) {
          latestTime = c.time + c.duration;
        }
      }

      if (earliestTime == 999) earliestTime = 9;
      if (latestTime == 0) latestTime = 17;

      this.timetable = {
        classes: classes,
        earliestTime: earliestTime,
        latestTime: latestTime,
        offset: todayUTC.getDay() - 1
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
      timetable: { classes: [], earliestTime: 9, latestTime: 15, offset: 0 }
    };
  },
  mounted() {
    this.$store.dispatch("getTimetable").then(() => {
      this.loadTimetable();
    });
  },
  components: {
    WeekTimetable
    // SettingsPopup,
  }
};
</script>
