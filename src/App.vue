<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/timetable">Timetable</router-link>
    </div> -->
    <TopProgress :trickleSpeed="50"></TopProgress>
    <router-view />
  </div>
</template>

<style lang="scss">
@import "@/assets/overrides";
@import url("https://use.fontawesome.com/releases/v5.2.0/css/all.css");

* {
  outline: none;
}

html,
body {
  height: 100%;
  overflow: auto;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}

#nav {
  padding: 30px;
  text-align: center;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script>
import TopProgress from "@/components/TopProgress.vue";

export default {
  name: "App",
  components: {
    TopProgress
  }
};
</script>
