<template>
  <div>
    <mt-header title="Setting">
        <router-link to="/wallet" slot="left">
            <mt-button icon="back">Back</mt-button>
        </router-link>
    </mt-header>
    <p></p>
    <mt-button type="primary" @click="MainNetClicked">MainNet (open soon)</mt-button>
    <p></p>
    <mt-button type="primary" @click="TestNetClicked">TestNet</mt-button>
    <p></p>
    <mt-button type="default" disabled @click="ZeroNetClicked">ZeroNet</mt-button>
  </div>
</template>
<script>
  export default {
    methods: {
      MainNetClicked (e) {
        var storage=window.localStorage;
        storage.setItem("net","MainNet");
        storage.setItem("api_base_url","http://150.109.50.199:6002");
        this.$router.push('/wallet'); 
      },
      TestNetClicked (e) {
        console.log(e)
        var storage=window.localStorage;
        storage.setItem("net","TestNet");
        storage.setItem("api_base_url","http://150.109.57.242:6002");
        this.$router.push('/wallet'); 
      },
      ZeroNetClicked (e) {
        console.log(e)
        var storage=window.localStorage;
        storage.setItem("net","ZeroNet");
        storage.setItem("api_base_url","http://dev.trustnote.org:6002");
        this.$router.push('/wallet'); 
      }
    },
    created:function(){
      var storage=window.localStorage;
      var private_key = storage.getItem("private_key");
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