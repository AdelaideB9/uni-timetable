<template>
  <div
    id="table"
    :style="`grid-template-rows: repeat(${
      latestTime - earliestTime + 1
    }, 1fr);`"
  >
    <div
      v-for="(day, i) in days"
      class="day-cell"
      :style="{ 'grid-row': 1, 'grid-column': i + 2 }"
    >
      <b>{{ day }}</b>
    </div>
    <div
      v-for="time in latestTime - earliestTime + 1"
      class="time-cell"
      :style="{ 'grid-row': time + 1, 'grid-column': 1 }"
    >
      <p>{{ to12HourTime(earliestTime + time - 1) }}</p>
    </div>
    <div
      v-for="event in table"
      @click="clickEvent(event)"
      class="event-cell"
      :style="{
        'grid-row': `${event.time - earliestTime + 2} / ${
          event.time - earliestTime + event.duration + 2
        }`,
        'grid-column': event.day + 2,
        'background-color': `hsl(${event.colour}, 100%, 80%)`,
      }"
    >
      <p class="hide-on-mobile">
        <b>{{ event.name }}</b>
      </p>
      <p class="show-on-mobile hide-on-desktop">
        <b>{{ event.course }}</b>
      </p>
      <p>{{ event.type }} <span class="hide-on-mobile">({{ event.room[0] }})</span></p>
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
  },
  data() {
    return {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    };
  },
  methods: {
    to12HourTime(time) {
      return time >= 12
        ? String(((time - 1) % 12) + 1) + "pm"
        : String(time) + "am";
    },
    clickEvent(event) {
      this.$buefy.modal.open({
        parent: this,
        props: { event: event },
        component: ClassPopup,
        hasModalCard: true,
        customClass: "custom-class custom-class-2",
        trapFocus: true,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#table {
  min-height: 90vh;
  display: grid;
  grid-template-columns:
    [times] 4em
    repeat(5, 1fr);
  font-size: 12px;
}

.event-cell {
  border-radius: 0.25rem;
  margin: 5px;
  padding: 10px;
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
    0 0px 0 1px rgba(10, 10, 10, 0.02);
}

.day-cell {
  text-align: center;
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
      [times] 3em
      repeat(5, 1fr);
  }
}
</style>
