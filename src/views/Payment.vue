<template>
  <div class="first" :style="{backgroundColor:'#EEF0F6',backgroundImage: 'url(' + bg + ')'}">
    <span class="center">
      <h1>Transfer</h1>
      <p>({{net}})</p>
      <div class="pan">
        <mu-text-field placeholder="Destination Address" v-model="to_address"></mu-text-field>
        <mu-text-field placeholder="Amount" v-model="amount"></mu-text-field>
        <mu-text-field placeholder="Message" v-model="message"></mu-text-field>
        <p class="text">{{text}}</p>
        <mu-button color="primary" :disabled="disabled" @click="PaymentClicked">OK ({{net}})</mu-button>
        <p></p>
        <mu-button @click="ReturnClicked">CANCEL</mu-button>
        <div class="full mask" v-show="display"></div>
        <div class="full" v-show="display">
          <div style="position: absolute; left: 50%;top:45%;">
            <div style="position: relative; left: -50%; color:#fff;">
              <p>Making payment</p>
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
        <p></p>
      </div>
    </span>
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
      disabled: true,
      dialog: {
        title: "",
        message: "",
        display: false
      },
      bg: require("../assets/bg.png"),
      payment_success: false,
      display: false,
      alertMSG: "",
      to_address: "",
      private_key: "",
      public_key: "",
      wallet_public_key: "",
      address: "",
      amount: "",
      message: "",
      net: "",
      text: "",
      api_base_url: "",
      state: {
        to_address: "",
        amount: ""
      }
    };
  },
  watch: {
    to_address: function(val, oldVal) {
      if (val.length != 32) {
        //   this.state.to_address = "error";
      } else {
        //   this.state.to_address = "success";
      }
      this.check();
    },
    amount: function(val, oldVal) {
      if (val > 0) {
        //   this.state.amount = "success";
      } else {
        //   this.state.amount = "error";
      }
      this.check();
    }
  },
  methods: {
    check(e) {
        if(this.to_address.length == 32 & this.amount > 0){
            this.disabled = false;
        }else{
            this.disabled = true;
        }
    },
    ReturnClicked(e) {
      this.$router.push("/wallet");
    },
    openSimpleDialog() {
      this.dialog.display = true;
    },
    closeSimpleDialog() {
      this.dialog.display = false;
      this.display = false;
      if (this.payment_success) {
        self.$router.push("/");
      }
    },
    GetSettingValue(e) {
      var storage = window.localStorage;
      this.net = storage.getItem("net");
      this.private_key = storage.getItem("private_key");
      this.public_key = storage.getItem("public_key");
      this.wallet_public_key = storage.getItem("wallet_public_key");
      this.address = storage.getItem("address");
      this.api_base_url = storage.getItem("api_base_url");
    },
    RegWallet(e) {
      var url = this.api_base_url + "/api/v1/account/register";
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
          console.log(res.body);
        })
        .catch(res => {
          //失败的回掉
          console.log(res.body);
        });
    },
    PaymentClicked(e) {
      var self = this;
      this.display = true;
      console.log(e);
      var url = this.api_base_url + "/api/v1/asset/transfer";
      this.$http
        .post(
          url,
          {
            asset: "TTT",
            payer: this.address,
            message: this.message,
            outputs: [
              {
                address: this.to_address,
                amount: parseFloat(this.amount) * 1000000
              }
            ]
          },
          {
            emulateJSON: false
          }
        )
        .then(res => {
          //成功胡回调
          console.log("payment:", res.body);
          if (res.body.errMsg.indexOf("not enough asset") == 0) {
            this.openSimpleDialog();
            this.dialog.title = "error";
            this.dialog.message = "Insufficient balance!";
          }
          if (res.body.errMsg == "success") {
            console.log("sign!!!");
            let b64_to_sign = res.body.data.b64_to_sign;
            let txid = res.body.data.txid;

            var storage = window.localStorage;
            var private_key = storage.getItem("private_key");
            let sig = Client.sign(b64_to_sign, private_key, "m/44'/0'/0'/0/0");

            console.log("sig:", sig);

            let url = self.api_base_url + "/api/v1/asset/sign";
            //
            self.$http
              .post(
                url,
                {
                  txid: txid,
                  sig: sig
                },
                {
                  emulateJSON: false
                }
              )
              .then(res => {
                //成功胡回调
                console.log("return:", res.body);
                if (res.body.errMsg == "success") {
                  console.log("unit:", res.body.data.unit);
                  this.openSimpleDialog();
                  this.dialog.title = "susscee";
                  this.dialog.message = "payment successful!";
                  this.payment_success = true;
                }
              })
              .catch(res => {
                //失败的回掉
                // reject(res.body);
                this.openSimpleDialog();
                this.dialog.title = "error";
                this.dialog.message = res.body;
              });
            //
          }
        })
        .catch(res => {
          //失败的回掉
          // reject(res.body);
          this.openSimpleDialog();
          this.dialog.title = "error";
          this.dialog.message = res.body;
        });
    }
  },
  mounted: function() {
    this.GetSettingValue();
    //reg
    this.RegWallet();
    //
  }
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
input {
  width: 90%;
  margin: 10px auto;
  padding: 5px;
  border: solid 1px #ddd;
}
.center {
  text-align: center;
}
.wxc-btn {
  margin: 10px auto;
}
.balance {
  font-size: 20px;
}
h1 {
  text-align: center;
  font-size: 30px;
}
.address {
  font-size: 14px;
  text-align: center;
  width: 100%;
}
textarea {
  width: 90%;
  margin: 10px auto;
  height: 100px;
  border: solid 1px #ddd;
}
p {
  margin: 20px auto;
}
button {
  width: 90%;
}
body {
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
  font-size: 20px;
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