<template>
  <div>
    <mt-header title="转账">
        <router-link to="/wallet" slot="left">
            <mt-button icon="back">返回</mt-button>
        </router-link>
    </mt-header>
    <mt-field label="地址" v-bind:state="state.to_address" placeholder="输入转账地址" v-model="to_address"></mt-field>
    <mt-field label="金额" type="number" v-bind:state="state.amount" placeholder="输入转账金额" v-model="amount"></mt-field>
    <mt-field label="信息" type="textarea" placeholder="输入转账信息" v-model="message"></mt-field>
    <p class="text">{{text}}</p>
    <mt-button type="primary" @click="PaymentClicked">支付</mt-button>
    <div class="full mask" v-show="display"></div>
    <div class="full" v-show="display">
        <div style="position: absolute; left: 50%;top:45%;">
            <div style="position: relative; left: -50%; color:#fff;">
                <p>正在支付</p>
            </div>
        </div>
        <div style="position: absolute; left: 50%;top:55%;">
            <div style="position: relative; left: -50%; color:#fff;">
                <p>
                    <mt-spinner style="margin:20px auto;" type="fading-circle"></mt-spinner>
                </p>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
  const Client = require('wallet-base')
  import { MessageBox } from 'mint-ui';
  export default {
    data () {
      return {
        display:false,
        alertMSG:"",
        to_address:"",
        private_key:"",
        public_key:"",
        wallet_public_key:"",
        address:"",
        amount:"",
        message:"",
        text:"",
        state:{
            to_address:"",
            amount:""
        }
      }
    },
    watch: {
        to_address: function (val, oldVal) {
            if(val.length!=32){
                this.state.to_address = "error";
            }else{
                this.state.to_address = "success";
            }
        },
        amount: function (val, oldVal) {
            if(val>0){
                this.state.amount = "success";
            }else{
                this.state.amount = "error";
            }
        }
    },
    methods: {
      PaymentClicked (e) {
        var self = this;
        this.display = true;
        console.log(e)
        var url = "http://150.109.57.242:6001/api/v1/asset/transfer";
        this.$http.post(url,{
            asset: "TTT",
            payer: this.address,
            message: this.message,
            outputs:[
                {
                    address: this.to_address,
                    amount: parseFloat(this.amount)*1000000
                }
            ]
        },
        {
            emulateJSON: false}
        ).then((res) => {    //成功胡回调
            console.log("payment:",res.body);
            if (res.body.errMsg.indexOf("not enough asset")==0){
                MessageBox.alert('余额不足！').then(action => {
                    this.display = false;
                });
                
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
                        MessageBox.alert('支付成功！').then(action => {
                            //window.location.href = '/'
                            self.$router.push('/'); //不知道为什么这个不起作用。。。
                        });
                        
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
.mask{
    background: #000;
    opacity: 0.8;
}
.full{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
}
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