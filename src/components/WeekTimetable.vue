<template>
  <div
    id="table"
    :style="
      `grid-template-rows: repeat(${latestTime - earliestTime + 1}, 1fr);`
    "
  >
    <div
      v-for="(day, i) in days"
      class="dayCell"
      :style="{ 'grid-row': 1, 'grid-column': i + 2 }"
    >
      <b>{{ day }}</b>
    </div>
    <div
      v-for="time in latestTime - earliestTime + 1"
      class="timeCell"
      :style="{ 'grid-row': time + 1, 'grid-column': 1 }"
    >
      <p>{{ to12HourTime(earliestTime + time - 1) }}</p>
    </div>
    <div
      v-for="event in table"
      @click="clickEvent(event)"
      class="eventCell"
      :style="{
        'grid-row': `${event.time - earliestTime + 2} / ${event.time -
          earliestTime +
          event.duration +
          2}`,
        'grid-column': event.day + 2,
        'background-color': `hsl(${event.colour}, 100%, 80%)`
      }"
    >
      <p>
        <b>{{ event.course }}</b> <br />
        {{ event.type }}
      </p>
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
    latestTime: Number
  },
  data() {
    return {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
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
        trapFocus: true
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#table {
  display: grid;
  grid-template-columns:
    [times] 4em
    repeat(5, 1fr);
  font-size: 12px;
}

.eventCell {
  border-radius: 0.25rem;
  margin: 5px;
  padding: 10px;
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
    0 0px 0 1px rgba(10, 10, 10, 0.02);
}

.dayCell {
  text-align: center;
}
</style>
