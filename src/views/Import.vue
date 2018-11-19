<template>
  <div>
    <h1>输入助记词</h1>
    <textarea v-model="word"></textarea>
    <b-button @click="ImportClicked">立刻导入</b-button>
  </div>
</template>

<script>
  const Client = require('wallet-base')
  export default {
    data () {
      return {
        word:"",
        private_key:"",
        public_key:"",
        wallet_public_key:"",
        address:""
      }
    },
    methods: {
      ImportClicked (e) {
        console.log(e)
        // 根私钥
        this.private_key = Client.xPrivKey(this.word)
        // 根公钥
        this.public_key = Client.xPubKey(this.private_key)
        // 钱包公钥
        this.wallet_public_key = Client.walletPubKey(this.private_key, 0)
        // 地址
        this.address = Client.walletAddress(this.wallet_public_key, 0, 0)
        //存储
        var storage=window.localStorage;
        storage.setItem("private_key",this.private_key);
        storage.setItem("public_key",this.public_key);
        storage.setItem("wallet_public_key",this.wallet_public_key);
        storage.setItem("address",this.address);
        //不保存助记词
        this.$router.push({
            path: '/wallet', 
            name: 'wallet',
        })
      }
    },
    mounted:function(){
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
  textarea{
    width: 90%;
    margin: 10px auto;
    height: 100px;
    border: solid 1px #ddd;
  }
</style>