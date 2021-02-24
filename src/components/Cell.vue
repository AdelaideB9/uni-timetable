<template>
  <div
    :style="`
    box-sizing: border-box;
    height: ${height * rowSpan}px; 
    top: ${y * height}px;
    left: calc(${(x - 1) * 19}% + 5%);
    padding: 10px;`"
  >
    <div
      :style="`
      width: 90%;
      background-color: hsl(${colour}, 100%, 80%);
      border-radius: 0.25rem;
      height: calc(100% - 20px);`"
    >
      <div style="padding: 5px;">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Cell",
  props: {
    x: Number,
    y: Number,
    height: Number,
    width: Number,
    colour: Number,
    rowSpan: Number,
  },
};
</script>

<style lang="scss" scoped>
div {
  position: absolute;
}
</style>