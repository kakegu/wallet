<template>
  <div>
    <h2 class="center">转账</h2>

    <b-form-input type="text" v-model="to_address" required placeholder="输入转账地址"></b-form-input>
    <b-form-input type="text" v-model="amount" required placeholder="输入转账金额"></b-form-input>
    <b-form-input type="text" v-model="message" required placeholder="输入转账信息"></b-form-input>

    <p class="text">{{text}}</p>
    <b-button @click="PaymentClicked">支付</b-button>
    <b-modal ref="alert" id="modal1" title="">
        <p class="my-4">{{alertMSG}}</p>
    </b-modal>
  </div>
</template>

<script>
  const Client = require('wallet-base')
  export default {
    data () {
      return {
        alertMSG:"",
        to_address:"",
        private_key:"",
        public_key:"",
        wallet_public_key:"",
        address:"",
        amount:"",
        message:"",
        text:""
      }
    },
    methods: {
      PaymentClicked (e) {
        var self = this
        console.log(e)
        var url = "http://150.109.57.242:6001/api/v1/asset/transfer";
        this.$http.post(url,{
            asset: "TTT",
            payer: this.address,
            message: this.message,
            outputs:[
                {
                    address: this.to_address,
                    amount: parseInt(this.amount)
                }
            ]
        },
        {
            emulateJSON: false}
        ).then((res) => {    //成功胡回调
            console.log("payment:",res.body);
            if (res.body.errMsg.indexOf("not enough asset")==0){
                this.alertMSG = "你的余额不足！"
                this.$refs.alert.show();
            }
            if (res.body.errMsg == "success"){
                console.log("sign!!!")
                let b64_to_sign = res.body.data.b64_to_sign;
                let txid = res.body.data.txid;
                
                var storage=window.localStorage;
                var private_key = storage.getItem("private_key");
                let sig = Client.sign(b64_to_sign, private_key, "m/44'/0'/0'/0/0")

                console.log("sig:",sig);

                let url = "http://150.109.57.242:6001/api/v1/asset/sign";
                //
                self.$http.post(url,{
                    txid: txid,
                    sig: sig
                },
                {
                    emulateJSON: false}
                ).then((res) => {    //成功胡回调
                    console.log("return:",res.body);
                    if (res.body.errMsg == "success"){
                        console.log("unit:",res.body.data.unit);
                        window.location.href = '/'
                        this.$router.push('/'); //不知道为什么这个不起作用。。。
                    }
                    
                
                }).catch((res) => {   //失败的回掉
                    // reject(res.body);
                });
                //
            }
        }).catch((res) => {   //失败的回掉
            // reject(res.body);
        });
      }
    },
    mounted:function(){
        var storage=window.localStorage;
        //this.$router.push('/payment');
        this.private_key = storage.getItem("private_key");
        this.address = storage.getItem("address");
    }
  }
</script>

<style scoped>
  input{
      width: 90%;
      margin: 10px auto;
      padding: 5px;
      border: solid 1px #ddd;
  }
  .center{
    text-align: center;
  }
  .wxc-btn{
    margin:10px auto;
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