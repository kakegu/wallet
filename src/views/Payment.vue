<template>
  <div>
    <mt-header v-bind:title="'Transfer (' + net+')'">
      <router-link to="/wallet" slot="left">
        <mt-button icon="back">Back</mt-button>
      </router-link>
    </mt-header>
    <mt-field
      label="Address"
      v-bind:state="state.to_address"
      placeholder="Please enter the address of the recipient"
      v-model="to_address"
    ></mt-field>
    <mt-field
      label="Amount"
      type="number"
      v-bind:state="state.amount"
      placeholder="Please enter the amount of the transfer"
      v-model="amount"
    ></mt-field>
    <mt-field
      label="Description"
      type="textarea"
      placeholder="Please enter the description of the transfer"
      v-model="message"
    ></mt-field>
    <p class="text">{{text}}</p>
    <mt-button type="primary" @click="PaymentClicked">Transfer ({{net}})</mt-button>
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
            <mt-spinner style="margin:20px auto;" type="fading-circle"></mt-spinner>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const Client = require("wallet-base");
import { MessageBox } from "mint-ui";
export default {
  data() {
    return {
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
        this.state.to_address = "error";
      } else {
        this.state.to_address = "success";
      }
    },
    amount: function(val, oldVal) {
      if (val > 0) {
        this.state.amount = "success";
      } else {
        this.state.amount = "error";
      }
    }
  },
  methods: {
    GetSettingValue(e) {
      var storage = window.localStorage;
      this.net = storage.getItem("net");
      this.private_key = storage.getItem("private_key");
      this.public_key = storage.getItem("public_key");
      this.wallet_public_key = storage.getItem("wallet_public_key");
      this.address = storage.getItem("address");
      this.api_base_url = storage.getItem("api_base_url");
    },
    RegWallet(e){
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
            MessageBox.alert("Insufficient balance!").then(action => {
              this.display = false;
            });
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
                  MessageBox.alert("payment successful!").then(action => {
                    self.$router.push("/");
                  });
                }
              })
              .catch(res => {
                //失败的回掉
                // reject(res.body);
              });
            //
          }
        })
        .catch(res => {
          //失败的回掉
          // reject(res.body);
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
</style>