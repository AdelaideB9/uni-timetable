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
            <b>Class</b>: {{ c.course }}, {{ c.type }}
            <br />
            <b>Room</b>: {{ c.room.join("/") }}
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
  name: "SettingsPopup",
};
</script>

<style lang="scss" scoped></style>
