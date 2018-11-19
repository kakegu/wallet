<template>
  <div>
    <h1>请把助记词抄在纸上</h1>
    <p>{{word}}</p>
    <b-button @click="ImportClicked">我已备份</b-button>
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