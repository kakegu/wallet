<template>
  <div>
    <h1>Please write down your mnemonic on a piece of paper</h1>
    <p>{{word}}</p>
    <mt-button type="primary" @click="ImportClicked">Next</mt-button>
  </div>
</template>

<script>
  const Client = require('wallet-base')
  export default {
    data () {
      return {
        word: ''
      }
    },
    methods: {
      ImportClicked (e) {
        console.log(e)
        this.$router.push({
            path: '/import', 
            name: 'import',
        })
      }
    },
    mounted:function(){
        let mnemonic = Client.mnemonic();
        this.word = mnemonic;
    }
  }
</script>

<style scoped>
  .btn{
    margin:10px;
  }
  h1{
    text-align: center;
    font-size: 30px;
  }
  p{
    width: 90%;
    margin: 10px auto;
    font-size: 22px;
    font-weight: lighter;
  }
</style>