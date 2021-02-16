<template>
  <div>
    <div class="container">
      <form class="box" @submit.prevent="login()">
        <b-field label="Student ID">
          <b-input
            v-model="username"
            minlength="8"
            maxlength="8"
            required="required"
          ></b-input>
        </b-field>

        <b-field label="Password">
          <b-input
            v-model="password"
            type="password"
            required="required"
            password-reveal
          >
          </b-input>
        </b-field>

        <b-button
          style="margin-top: 20px"
          native-type="submit"
          label="Sign in"
          type="is-primary is-light"
        />
        <b-message v-if="errorText" type="is-danger" style="margin-top: 40px">{{
          errorText
        }}</b-message>
      </form>
    </div>
  </div>
</template>

<script>
const qs = require("querystring");

export default {
  name: "Login",
  beforeCreate() {
    if (this.$store.state.isLoggedIn) this.$router.push({ name: "Timetable" });
  },
  methods: {
    async login() {
      this.$parent.$refs.topProgress.start();
      this.errorText = "";
      let res = await fetch(".netlify/functions/login", {
        method: "post",
        body: qs.stringify({
          username: this.username,
          password: this.password,
        }),
      });

      if (res.status != 200) {
        this.errorText = await res.text();
        this.$parent.$refs.topProgress.fail();
        this.$buefy.toast.open({
          duration: 5000,
          message: this.errorText,
          position: "is-top",
          type: "is-danger",
        });
      } else {
        this.$parent.$refs.topProgress.done();
        this.$router.push({ name: "Timetable" });
      }
    },
  },
  data() {
    return {
      username: "",
      password: "",
      errorText: "",
    };
  },
};
</script>

<style lang="sass" scoped>
</style>