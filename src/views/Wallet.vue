<template>
  <div>

    <p class="center"><span class="balance">{{balance}}</span> TTT</p>
    <p class="address">{{address}}</p>
    <mt-button type="primary" @click="PaymentClicked">转账</mt-button>
    <p></p>
    <mt-button type="primary" @click="HistoryClicked">记录</mt-button>
  </div>
</template>

<script>
  const Client = require('wallet-base')
  
  export default {
    data () {
      return {
        balance:"",
        private_key:"",
        public_key:"",
        wallet_public_key:"",
        address:""
      }
    },
    methods: {
      PaymentClicked (e) {
        console.log(e)
        this.$router.push('/payment');
      },
      HistoryClicked (e) {
        this.$router.push('/history');
      }
    },
    created:function(){
      var storage=window.localStorage;
      var private_key = storage.getItem("private_key");
      if (private_key == null){
        console.log("privatekey!",private_key)
        //window.location.href = '/'
        this.$router.push('/'); //不知道为什么这个不起作用。。。
      }
    },
    mounted:function(){
        var self = this;
        var storage=window.localStorage;
        //storage.removeItem("is_registered");
        this.private_key = storage.getItem("private_key");
        this.public_key = storage.getItem("public_key");
        this.wallet_public_key = storage.getItem("wallet_public_key");
        this.address = storage.getItem("address");
        //get balance
        var url = "http://150.109.57.242:6001/api/v1/asset/balance/"+this.address+"/TTT";
        this.$http.get(url).then(response => {
            // get body data
            var json = response.body;
            console.log("data:",json.data.stable);
            //json = JSON.parse(data);
            this.balance = (json.data.stable+json.data.pending)/1000000
        }, response => {
            // error callback
        });
    }
  }
</script>

<style scoped>
  .center{
    text-align: center;
  }
  .balance{
      font-size: 20px;
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
  .address{
      font-size:14px;
      text-align: center;
      width: 100%;
  }
  textarea{
    width: 90%;
    margin: 10px auto;
    height: 100px;
    border: solid 1px #ddd;
  }
</style>