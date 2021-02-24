<template>
  <div class="table">
    <div v-for="time in latestTime - earliestTime + 1" :key="time">
      <Cell
        :x="0"
        :y="time"
        :width="cellWidth"
        :height="cellHeight"
        class="time-col"
      >
        <p>{{ to12HourTime(time + earliestTime - 1) }}</p>
      </Cell>
    </div>
    <div
      v-for="(day, i) in days"
      :key="day"
    >
      <Cell
        :x="i + 1"
        :y="0"
        :width="cellWidth"
        :height="cellHeight"
        class="day-col day"
      >
        <p>
          <b>{{ day }}</b>
        </p>
      </Cell>
    </div>
    <div v-for="(event, i) in table" :key="i">
      <Cell
        class="day-col"
        :x="event.day + 1"
        :y="event.time - earliestTime + 1"
        :width="cellWidth"
        :height="cellHeight"
        :colour="event.colour"
        :rowSpan="event.duration"
      >
        <p>
          <b>{{ event.course }}</b> <br />
          {{ event.type }}
        </p>
      </Cell>
    </div>
  </div>
</template>

<script>
import Cell from "@/components/Cell.vue";

export default {
  name: "TB",
  props: {
    table: Array,
    cellHeight: Number,
    cellWidth: Number,
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
  },
  components: {
    Cell,
  },
};
</script>

<style lang="scss" scoped>
.table {
  height: 700px;
  position: relative;
  font-size: 12px;
}

.time-col {
  width: 5%;
  left: 0 !important;
}

.day p { text-align: center; }

.day-col {
  width: 19%;
}
</style>