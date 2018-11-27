<template>
  <div>
    <h1>Please enter the mnemonic</h1>
    <textarea v-model="word"></textarea>
    <mt-button type="primary" @click="ImportClicked">Enter</mt-button>
    <div class="full mask" v-show="display"></div>
    <div class="full" v-show="display">
        <div style="position: absolute; left: 50%;top:45%;">
            <div style="position: relative; left: -50%; color:#fff;">
                <p>Importing</p>
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
        if((this.word.split(" ")).length != 12){
            MessageBox('提示', '助记词长度不正确');
            return false;
        }else{
            this.display = true
            setTimeout(() => {
                // 根私钥
                this.private_key = Client.xPrivKey(this.word)
                // 根公钥
                this.public_key = Client.xPubKey(this.private_key)
                // 钱包公钥
                this.wallet_public_key = Client.walletPubKey(this.private_key, 0)
                // 地址
                this.address = Client.walletAddress(this.wallet_public_key, 0, 0)

                var url = "http://150.109.57.242:6002/api/v1/account/register"
                this.$http.post(url,{
                    pubkey:this.wallet_public_key
                },
                {
                    emulateJSON: false}
                ).then((res) => {    //成功胡回调
                    // resolve(res.body);
                }).catch((res) => {   //失败的回掉
                    // reject(res.body);
                });
                
                //存储（不保存助记词）
                var storage=window.localStorage;
                storage.setItem("private_key",this.private_key);
                storage.setItem("public_key",this.public_key);
                storage.setItem("wallet_public_key",this.wallet_public_key);
                storage.setItem("address",this.address);
                //跳转到 wallet
                this.$router.push('/wallet');
            }, 2000);
            
        }
      }
    },
    mounted:function(){
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
.center{
    margin:20px auto;
}
  .btn{
    margin:10px;
  }
  h1{
    text-align: center;
    font-size: 30px;
  }
  textarea{
    width: 90%;
    margin: 10px auto;
    height: 100px;
    border: solid 1px #ddd;
  }
</style>