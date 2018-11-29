<template>
  <div class="first" :style="{backgroundColor:'#EEF0F6',backgroundImage: 'url(' + bg + ')'}">
    <span class="center">
      <h1>Import wallet</h1>
      <div class="pan">
        <p class="tip">Mnenomic (leave a space between each word)</p>
        <mu-text-field
          placeholder="Please enter the mnemonic"
          class="textarea"
          multi-line
          :rows="3"
          :rows-max="6"
          v-model="word"
        ></mu-text-field>
        <p></p>
        <mu-button color="primary" @click="ImportClicked">IMPORT</mu-button>
        <p></p>
        <mu-button @click="CancelClicked">CANCEL</mu-button>
      </div>
    </span>
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
            <mu-circular-progress class="demo-circular-progress" :size="36"></mu-circular-progress>
          </p>
        </div>
      </div>
    </div>
    <mu-dialog v-bind:title="dialog.title" width="360" :open.sync="dialog.display">
      {{dialog.message}}
      <mu-button slot="actions" flat color="primary" @click="closeSimpleDialog">Close</mu-button>
    </mu-dialog>
  </div>
</template>

<script>
const Client = require("wallet-base");
export default {
  data() {
    return {
      dialog: {
        title: "",
        message: "",
        display: false
      },
      display: false,
      word: "",
      private_key: "",
      public_key: "",
      wallet_public_key: "",
      address: "",
      bg: require("../assets/bg.png")
    };
  },
  methods: {
    openSimpleDialog() {
      this.dialog.display = true;
    },
    closeSimpleDialog() {
      this.dialog.display = false;
    },
    CancelClicked(e) {
      this.$router.push("/");
    },
    ImportClicked(e) {
      console.log(e);
      if (this.word.split(" ").length != 12) {
        this.openSimpleDialog();
        this.dialog.title = "error";
        this.dialog.message = "Mnenomic length error";
        return false;
      } else {
        this.display = true;
        setTimeout(() => {
          // 根私钥
          this.private_key = Client.xPrivKey(this.word);
          // 根公钥
          this.public_key = Client.xPubKey(this.private_key);
          // 钱包公钥
          this.wallet_public_key = Client.walletPubKey(this.private_key, 0);
          // 地址
          this.address = Client.walletAddress(this.wallet_public_key, 0, 0);

          var url = "http://150.109.57.242:6002/api/v1/account/register";
          this.$http
            .post(
              url,
              {
                pubkey: this.wallet_public_key
              },
              {
                emulateJSON: false
              }
            )
            .then(res => {
              //成功胡回调
              // resolve(res.body);
            })
            .catch(res => {
              //失败的回掉
              // reject(res.body);
            });

          //存储（不保存助记词）
          var storage = window.localStorage;
          storage.setItem("private_key", this.private_key);
          storage.setItem("public_key", this.public_key);
          storage.setItem("wallet_public_key", this.wallet_public_key);
          storage.setItem("address", this.address);
          //跳转到 wallet
          this.$router.push("/wallet");
        }, 1000);
      }
    }
  },
  mounted: function() {}
};
</script>

<style scoped>
.mask {
  background: #000;
  opacity: 0.8;
}
.full {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
.textarea {
  width: 90%;
  margin: 10px auto;
  height: 100px;
}
h1 {
  text-align: center;
  font-size: 50px;
}
p {
  width: 90%;
  margin: 10px auto;
  font-size: 22px;
  font-weight: lighter;
}
button {
  width: 90%;
}
.first {
  display: table;
  width: 100%;
  height: 100%;
  text-align: center;
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  background-repeat: no-repeat;
  background-size: cover;
}
.center {
  display: table-cell;
  vertical-align: middle;
}
.tip {
  color: #666;
  text-align: left;
  font-size: 16px;
}
h1 {
  color: #26a2ff;
  margin-bottom: 20px;
}
.pan {
  padding: 20px;
  background: #fff;
  width: 80%;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 10px;
}
</style>