<template>
  <div>
    <TopProgress ref="topProgress"></TopProgress>
    <form @submit.prevent @submit="login()">
      <input v-model="username" type="text" name="username"><br>
      <input v-model="password" type="password" name="password"><br>
      <input type="submit" value="Log in">
    </form>
    <p v-if="errorText">{{ errorText }}</p>
  </div>
</template>

<script>
const qs = require('querystring')
import TopProgress from '@/components/top-progress.vue'

export default {
  name: "Login",
  components: {
    TopProgress
  },
  methods: {
    async login() {
      this.$refs.topProgress.start()
      this.errorText = ''
      let res = await fetch('.netlify/functions/login', {
        method: 'post',
        body: qs.stringify({username: this.username, password: this.password})
      })

      if (res.status != 200) {
        this.errorText = await res.text()
        this.$refs.topProgress.fail()
      } else {
        this.$refs.topProgress.done()
      }
    }
  },
  data() {
    return {
      username: '',
      password: '',
      errorText: ''
    }
  }
};
</script>

<style lang="sass" scoped>
</style>