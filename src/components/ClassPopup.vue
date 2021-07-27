<template>
  <div>
    <!-- <form action="">
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p style="text-align: center;" class="modal-card-title">
            {{ c.name }} <br />
            {{ c.classType }}
          </p>
          <button type="button" class="delete" @click="$emit('close')" />
        </header>
        <section class="modal-card-body">
          <p>
            <b>Class</b>: {{ c.course }}, {{ c.type }}
            <br />
            <b>Room</b>: {{ c.room }}
            <br />
            <b>Duration</b>: {{ timeToText(c.duration) }}
            <br />
          </p>
        </section>
        <footer class="modal-card-foot"></footer>
      </div>
    </form> -->
    <form action="">
      <div class="modal-card">
        <button type="button" class="delete" @click="$emit('close')" />
        <div class="modal-text">
          <p>
            <b> {{ c.course }} </b>
            <br />
            {{ $common.to12HourTime(c["start_time"]) }} -
            {{ $common.to12HourTime(c["end_time"]) }} ({{
              timeToText(c.duration)
            }})
            <br />
            {{ c.date }}
            <br />
            {{ c.type }}
          </p>
          <br />
          <b>{{ c.room }}</b> ({{ c.building }})
          <br />
          {{ c["facility_description"] }}
          <br />
          <a
            v-if="c.latitude != 0"
            :href="
              'https://maps.google.com/maps?q=' + c.latitude + ',' + c.longitude
            "
            target="_blank"
            >Map</a
          >
        </div>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.modal-card {
  width: 375px;
  background-color: white;
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
    0 0px 0 1px rgba(10, 10, 10, 0.02);
  border-radius: 0.25rem;
  padding: 0 40px;
}

.modal-text {
  padding: 40px 0;
}

.delete {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>

<script>
export default {
  name: "ClassPopup",
  props: { event: Object },
  methods: {
    timeToText(time) {
      return time == 1 ? "1 hour" : String(time) + " hours";
    }
  },
  computed: {
    c: function() {
      return this.event;
    }
  }
};
</script>
