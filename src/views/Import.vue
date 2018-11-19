<template>
  <div>
    <h1>输入助记词</h1>
    <p>单词之间需要有空格</p>
    <textarea v-model="word"></textarea>
    <mt-button type="primary" @click="ImportClicked">立刻导入</mt-button>
    <div class="full mask" v-show="display"></div>
    <div class="full" v-show="display">
        <div style="position: absolute; left: 50%;top:45%;">
            <div style="position: relative; left: -50%; color:#fff;">
                <p>正在导入</p>
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