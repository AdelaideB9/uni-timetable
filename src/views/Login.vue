<template>
  <div class="bg-img">
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

        <b-field style="margin-top: 32px" grouped>
          <b-button
            expanded
            native-type="submit"
            label="Sign in"
            type="is-primary is-light"
            :loading="loading"
          />
          <p class="control" style="margin-left: 10px">
            <b-button
              icon-right="question"
              type="is-light"
              @click="$router.push('about')"
            />
          </p>
        </b-field>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bg-img {
  position: relative;
  overflow: hidden;
}

.bg-img::before {
  content: "";
  position: absolute;
  width: 110%;
  height: 110%;
  transform: translate(-5%, -5%);
  z-index: -1;
  filter: blur(10px);
  background-image: url("~@/assets/background.jpg");
  background-size: cover;
  background-repeat: repeat;
  background-position: center;
  opacity: 0.5;
}

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
      this.loading = true;
      this.$store
        .dispatch("login", { username: this.username, password: this.password })
        .then(() => {
          this.loading = false;
        });
    }
  },
  data() {
    return {
      username: "",
      password: "",
      loading: false
    };
  }
};
</script>
