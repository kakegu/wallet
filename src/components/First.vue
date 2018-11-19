<template>
  <div>
    <b-button @click="MakeClicked">创建钱包</b-button>
    <p></p>
    <b-button @click="ImportClicked">导入钱包</b-button>
  </div>
</template>

<script>
  export default {
    methods: {
      MakeClicked (e) {
        console.log(e)
        this.$router.push({
            path: '/make', 
            name: 'make',
        })
      },
      ImportClicked (e) {
        console.log(e)
        this.$router.push({
            path: '/import', 
            name: 'import',
        })
      }
    },
    created:function(){
      var storage=window.localStorage;
      var private_key = storage.getItem("private_key");
      if (private_key != null){
        console.log("privatekey!",private_key)
        window.location.href = 'index.html#/wallet'
        this.$router.push('/wallet'); //不知道为什么这个不起作用。。。
      }
    }
  }
</script>

<style scoped>
  .btn{
    margin:10px auto;
  }
  h1{
    text-align: center;
    font-size: 30px;
  }
</style>