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
        <br>
        <pre>{{ timetable }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
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
      let url = `student/Week.asp?term=4110&career=UGRD&dt=${this.date.getDate()}/${this.date.getMonth() + 1}/${this.date.getFullYear()}`;
      let res = await fetch(".netlify/functions/getpage?url=" + url, { method: "post" });
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
        this.$refs.topProgress.done();
        res.text().then(body => this.timetable = body)
      }
    },
  },
  data() {
    return {
      date: new Date(),
      timetable: ""
    };
  },
};
</script>
