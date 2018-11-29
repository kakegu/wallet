<template>
  <div class="first" :style="{backgroundColor:'#EEF0F6',backgroundImage: 'url(' + bg + ')'}">
    <span class="center">
      <h1>
        <span class="balance">{{balance}}</span>
      </h1>
      <p>({{net}})</p>
      <div class="pan">
        <qrcode v-bind:value="'TTT:'+address" :options="{ size: 100 }"></qrcode>
        <p class="address">{{address}}</p>
        <p></p>
        <mu-button color="primary" @click="PaymentClicked">Transfer</mu-button>
        <p></p>
        <mu-button color="primary" @click="HistoryClicked">History</mu-button>
        <p></p>
        <mu-button color="primary" @click="SettingClicked">Setting</mu-button>
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
      dialog: {
        title: "",
        message: "",
        display: false
      },
      bg: require("../assets/bg.png"),
      balance: "",
      private_key: "",
      public_key: "",
      wallet_public_key: "",
      api_base_url: "",
      address: "",
      net: "",
      isgetvalueok: false
    };
  },
  methods: {
    openSimpleDialog() {
      this.dialog.display = true;
    },
    closeSimpleDialog() {
      this.dialog.display = false;
    },
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
      } else {
        var net = storage.getItem("net");
        if (net == null) {
          //setting testnet
          storage.setItem("net", "ZeroNet");
          storage.setItem("api_base_url", "http://150.109.47.45:6002");
        }
        this.net = storage.getItem("net");
        //storage.removeItem("is_registered");
        this.private_key = storage.getItem("private_key");
        this.public_key = storage.getItem("public_key");
        this.wallet_public_key = storage.getItem("wallet_public_key");
        this.address = storage.getItem("address");
        this.api_base_url = storage.getItem("api_base_url");
        this.isgetvalueok = true;
      }
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
          this.openSimpleDialog();
          this.dialog.title = "error";
          this.dialog.message = "network error";
        }
      );
      setTimeout(() => {
        this.GetBalance()
      }, 20000);
    }
  },
  created: function() {

    //get setting value
    this.GetSettingValue();
    //get balance
    if (this.isgetvalueok) {
      this.GetBalance();
    }
  },
  mounted: function() {}
};
</script>

<style scoped>
.balance {
  font-size: 20px;
}
.address {
  font-size: 14px;
  text-align: center;
  width: 100%;
  word-break: break-word;
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