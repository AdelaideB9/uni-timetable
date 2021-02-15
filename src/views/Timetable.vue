<template>
  <div>
    <TopProgress ref="topProgress"></TopProgress>
    <div class="container">
      <div class="box">
        <b-datepicker
          @input="loadTimetable()"
          v-model="date"
          inline
          :unselectable-days-of-week="[0, 6]"
        >
        </b-datepicker>
      </div>
    </div>
  </div>
</template>

<script>
const qs = require("querystring");
import TopProgress from "@/components/top-progress.vue";

export default {
  name: "Timetable",
  components: {
    TopProgress,
  },
  methods: {
    async loadTimetable() {
      this.$refs.topProgress.start();
      this.errorText = "";
      let res = await fetch(".netlify/functions/getpage", {
        method: "post",
        body: qs.stringify({
          url: `student/Week.asp?term=4110&career=UGRD&dt=${this.date.getDate()}/${this.date.getMonth() + 1}/${this.date.getFullYear()}`}),
      });
      if (res.status == 500) {
        this.errorText = await res.text();
        this.$refs.topProgress.fail();
        this.$buefy.toast.open({
          duration: 5000,
          message: this.errorText,
          position: "is-top",
          type: "is-danger",
        });
      } else {
        console.log(res);
        this.$refs.topProgress.done();
      }
    },
  },
  data() {
    return {
      date: new Date(),
    };
  },
};
</script>
