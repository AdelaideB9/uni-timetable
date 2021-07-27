<template>
  <div
    id="table"
    :style="
      `grid-template-rows: [days] min-content repeat(${latestTime -
        earliestTime}, 1fr);`
    "
  >
    <div
      v-for="(day, i) in days"
      class="day-cell"
      :style="{ 'grid-row': 1, 'grid-column': i + 2 }"
    >
      <b>{{ getDayFormat(day) }}</b>
    </div>
    <div
      v-for="time in latestTime - earliestTime"
      class="time-cell"
      :style="{ 'grid-row': time + 1, 'grid-column': 1 }"
    >
      <p class="hide-on-mobile">
        {{ getTimeString(earliestTime + time - 1).join("") }}
      </p>
      <p class="show-on-mobile hide-on-desktop">
        {{ getTimeString(earliestTime + time - 1)[0] }}<br />{{
          getTimeString(earliestTime + time - 1)[1]
        }}
      </p>
    </div>
    <div
      v-for="event in table"
      @click="clickEvent(event)"
      class="event-cell"
      :style="{
        'grid-row': `${event.time - earliestTime + 2} / ${event.time +
          event.duration -
          earliestTime +
          2}`,
        'grid-column': event.day + 2,
        'background-color': `hsl(${event.colour}, 100%, 80%)`
      }"
    >
      <p class="hide-on-mobile">
        <b>{{ event.course }}</b>
      </p>
      <p class="show-on-mobile hide-on-desktop">
        <b>{{ event.course }}</b>
      </p>
      <p>
        {{ $common.to12HourTime(event["start_time"]) }}
        ({{ timeToText(event.duration) }})
      </p>
      <p>
        <b>{{ event.room }}</b> ({{ event.building }})
        <!--<span class="hide-on-mobile">({{ event.room }})</span>-->
      </p>
      {{ event.type }}
    </div>
  </div>
</template>

<script>
import ClassPopup from "@/components/ClassPopup.vue";

export default {
  name: "WeekTimetable",
  props: {
    table: Array,
    earliestTime: Number,
    latestTime: Number,
    offset: Number
  },
  methods: {
    getDayFormat(day) {
      return window.screen.width < 480 ? day.slice(0, 3) : day;
    },
    clickEvent(event) {
      this.$buefy.modal.open({
        parent: this,
        props: { event: event },
        component: ClassPopup,
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true
      });
    },
    getTimeString(time) {
      return time >= 12
        ? [String(((time - 1) % 12) + 1) + ":00", "pm"]
        : [String(time) + ":00", "am"];
    },
    timeToText(time) {
      return time == 1 ? "1 hour" : String(time) + " hours";
    }
  },
  computed: {
    days() {
      return [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ].slice(this.offset, this.offset + 5);
    }
  }
};
</script>

<style lang="scss" scoped>
#table {
  display: grid;
  grid-template-columns:
    [times] 6em
    repeat(5, 1fr);
  font-size: 12px;
}

.event-cell {
  cursor: pointer;
  border-radius: 0.25rem;
  margin: 5px;
  padding: 10px;
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
    0 0px 0 1px rgba(10, 10, 10, 0.02);
}

.day-cell {
  text-align: center;
  position: sticky;
  top: 0;
  padding: 10px 0;
  background-color: white;
  border-bottom: #dbdbdb 1px solid;
}

.time-cell {
  position: sticky;
  left: 0;
  text-align: right;
  padding-right: 10px;
  background-color: white;
  border-right: #dbdbdb 1px solid;
}

.hide-on-desktop {
  display: none;
}

@media only screen and (max-device-width: 480px) {
  .show-on-mobile {
    display: block !important;
  }

  .hide-on-mobile {
    display: none !important;
  }

  .event-cell {
    padding: 5px;
  }

  #table {
    grid-template-columns:
      [times] 2em
      repeat(5, 1fr);
  }

  .time-cell {
    text-align: center;
  }
}
</style>
