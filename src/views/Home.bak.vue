<template>
  <div class="home">
    <img alt="logo" width="100" src="../assets/logo.png">
    <h1>trustnote开源钱包</h1>
    <First />
  </div>
</template>

<script>
// @ is an alias to /src
import First from '@/components/First.vue'

export default {
  name: 'home',
  components: {
    First
  }
}
</script>
