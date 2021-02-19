<template>
  <div>
    <div class="login-container">
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

<style>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box {
  width: 350px;
}
</style>

<script>
export default {
  name: "Login",
  beforeCreate() {
    if (this.$store.state.isLoggedIn) this.$router.push({ name: "Timetable" });
  },
  methods: {
    login() {
      this.$store.dispatch('login', {username: this.username, password: this.password})
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