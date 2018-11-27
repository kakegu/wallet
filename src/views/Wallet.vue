<template>
  <div>
    <p class="center">
      <span class="balance">{{balance}}</span>
      TTT ({{net}})
    </p>

    <p>
      <qrcode v-bind:value="'TTT:'+address" :options="{ size: 100 }"></qrcode>
    </p>
    <p class="address">{{address}}</p>

    <mt-button type="primary" @click="PaymentClicked">Transfer</mt-button>
    <p></p>
    <mt-button type="primary" @click="HistoryClicked">History</mt-button>
    <p></p>
    <mt-button type="primary" @click="SettingClicked">Setting</mt-button>
  </div>
</template>

<script>
const Client = require("wallet-base");
import { MessageBox } from "mint-ui";
export default {
  data() {
    return {
      balance: "",
      private_key: "",
      public_key: "",
      wallet_public_key: "",
      api_base_url: "",
      address: "",
      net: ""
    };
  },
  methods: {
    PaymentClicked(e) {
      console.log(e);
      this.$router.push("/payment");
    },
    HistoryClicked(e) {
      this.$router.push("/history");
    },
    SettingClicked(e) {
      this.$router.push("/setting");
    },
    GetSettingValue(e) {
      var storage = window.localStorage;
      var private_key = storage.getItem("private_key");
      if (private_key == null) {
        console.log("privatekey!", private_key);
        this.$router.push("/");
      }
      var net = storage.getItem("net");
      if (net == null) {
        //setting testnet
        storage.setItem("net", "TestNet");
        storage.setItem("api_base_url", "http://150.109.57.242:6002");
      }
      this.net = storage.getItem("net");
      //storage.removeItem("is_registered");
      this.private_key = storage.getItem("private_key");
      this.public_key = storage.getItem("public_key");
      this.wallet_public_key = storage.getItem("wallet_public_key");
      this.address = storage.getItem("address");
      this.api_base_url = storage.getItem("api_base_url");
    },
    GetBalance(e) {
      var url =
        this.api_base_url + "/api/v1/asset/balance/" + this.address + "/TTT";
      this.$http.get(url).then(
        response => {
          // get body data
          var json = response.body;
          console.log("data:", json.data.stable);
          //json = JSON.parse(data);
          this.balance = (json.data.stable + json.data.pending) / 1000000;
        },
        response => {
          // error callback
          MessageBox.alert("net error").then(action => {
            this.display = false;
          });
        }
      );
    }
  },
  created: function() {
    //get setting value
    this.GetSettingValue();
    //get balance
    this.GetBalance();
  },
  mounted: function() {}
};
</script>

<style scoped>
.center {
  text-align: center;
}
.balance {
  font-size: 20px;
}
h1 {
  text-align: center;
  font-size: 30px;
}
p {
  width: 90%;
  margin: 10px auto;
  font-size: 22px;
  font-weight: lighter;
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