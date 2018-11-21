<template>
  <div>
    <img alt="logo" width="100" src="../assets/logo.png">
    <h1>TrustNote Fusion Wallet</h1>
    <mt-button type="primary" @click="MakeClicked">Create New Wallet</mt-button>
    <p></p>
    <mt-button type="primary" @click="ImportClicked">Import Existing Wallet</mt-button>
  </div>
</template>
<script>
  export default {
    methods: {
      MakeClicked (e) {
        console.log(e)
        this.$router.push('/create'); 
      },
      ImportClicked (e) {
        console.log(e)
        this.$router.push('/import'); 
      }
    },
    created:function(){
      var storage=window.localStorage;
      var private_key = storage.getItem("private_key");
      if (private_key != null){
        console.log("privatekey!",private_key)
        //window.location.href = '/wallet'
        this.$router.push('/wallet'); //不知道为什么这个不起作用。。。
      }
    }
  }
</script>

<style scoped>
  p{
    margin:20px auto;
  }
  h1{
    text-align: center;
    font-size: 30px;
  }
</style>