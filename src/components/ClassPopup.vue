<template>
  <div>
    <form action="">
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
            <b>Class</b>: {{ c.course }}, {{ c.classType }}
            <br />
            <b>Room</b>: {{ c.room }}
            <br />
            <b>Duration</b>: {{ timeToText(c.duration) }}
            <br />
          </p>
        </section>
        <footer class="modal-card-foot"></footer>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "ClassPopup",
  props: { event: Object },
  methods: {
    timeToText(time) {
      return time <= 1 ? String(time) + " hour" : String(time) + " hours";
    },
  },
  computed: {
    c: function () {
      return this.event;
    },
  },
};
</script>

<style lang="scss" scoped></style>
