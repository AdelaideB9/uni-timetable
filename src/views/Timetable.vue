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
        <br />
        <!-- <pre>{{ timetable }}</pre> -->
        <div id="badidea"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
table {
  table-layout: fixed;
  width: 100%;
  height: 100%;
  font-size: 12px;

  background-color: white;
  border-radius: 10px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

  border-collapse: unset !important;
  border-spacing: 10px !important;
}

table, td, th { border: none !important; }

tr {
  height: 60px;
}

.altbdr {
  padding: 20px;
  border-radius: 10px;
}
</style>

<script>
const seedrandom = require('seedrandom');
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
      let url = encodeURIComponent(
        `student/Week.asp?term=4110&career=UGRD&dt=${this.date.getDate()}/${
          this.date.getMonth() + 1
        }/${this.date.getFullYear()}`
      );
      let res = await fetch(".netlify/functions/getpage?url=" + url, {
        method: "post",
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
        this.$refs.topProgress.done();

        let element = document.createElement("html");
        res.text().then((body) => {
          element.innerHTML = body;

          let table = element.getElementsByTagName("table")[18];
          console.log(table);
          // this.timetable = table;

          document.getElementById("badidea").innerHTML = table.outerHTML;
          // this.timetable = element.getElementsByClassName('tbdr');

          var classes = document.getElementsByClassName("altbdr");

          for (var i = 0; i < classes.length; i++) {
            let name = classes[i]
              .getElementsByTagName("span")[0]
              .innerText.split("\n")[1]; // class name (e.g. Music Technology Foundations)

            let random_num = new seedrandom(name);
            let hue = Math.floor(random_num.quick() * 360);
            let colour = `hsl(${hue.toString()}, 100%, 80%)`;

            classes[i].style.backgroundColor = colour;
          }
        });
      }
    },
  },
  data() {
    return {
      date: new Date(),
      timetable: "",
    };
  },
};
</script>
