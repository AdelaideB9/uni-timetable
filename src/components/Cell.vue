<template>
  <div :style="`
    height: ${height * rowSpan}px; 
    width: ${width}px; 
    top: ${y * height}px;
    left: ${x * width}px;
    background-color: hsl(${colour}, 100%, 80%);`"
  >
    <slot />
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