<template>
  <div class="about">
    <h1>This is an about page</h1>
    <b-button>Click Me</b-button>
    <b-datepicker v-model="date" 
      inline 
      :unselectable-days-of-week="[0, 6]">
    </b-datepicker>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                date: new Date()
            }
        }
    }
</script>
