<template>
  <div class="first" :style="{backgroundColor:'#EEF0F6',backgroundImage: 'url(' + bg + ')'}">
    <span class="center">
      <h1>History</h1>
      <p>({{net}})</p>
      <div class="pan">
        <div v-bind:key="item.index" v-for="item in list" style="text-align:left;">
          <mu-list-item-content>
            <mu-list-item-title>{{item.time}}</mu-list-item-title>
            <mu-list-item-sub-title>
              <div>{{item.address}}</div>
              <div>{{item.value}}</div>
            </mu-list-item-sub-title>
          </mu-list-item-content>
        </div>

        <p></p>
        <mu-button color="primary" @click="ReturnClicked">RETURN</mu-button>
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
      list: [],
      address: "",
      net: "",
      api_base_url: ""
    };
  },
  methods: {
    ReturnClicked() {
      this.$router.push("/wallet");
    },
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
    GetSettingValue(e) {
      var storage = window.localStorage;
      this.net = storage.getItem("net");
      //   this.private_key = storage.getItem("private_key");
      //   this.public_key = storage.getItem("public_key");
      //   this.wallet_public_key = storage.getItem("wallet_public_key");
      this.address = storage.getItem("address");
      this.api_base_url = storage.getItem("api_base_url");
    },
    GetHistory(e) {
      var url =
        this.api_base_url +
        "/api/v1/asset/txhistory/" +
        this.address +
        "/TTT/1/10";
      this.$http.get(url).then(
        response => {
          // get body data
          var json = response.body;
          console.log("history:", json.data.history);
          var history = json.data.history;
          history.forEach(element => {
            var unit = element.unit;
            var timestamp = unit.timestamp;
            var date = new Date(timestamp * 1000);
            var Y = date.getFullYear() + "-";
            var M =
              (date.getMonth() + 1 < 10
                ? "0" + (date.getMonth() + 1)
                : date.getMonth() + 1) + "-";
            var D =
              (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
              " ";
            var h =
              (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
              ":";
            var m =
              (date.getMinutes() < 10
                ? "0" + date.getMinutes()
                : date.getMinutes()) + ":";
            var s =
              (date.getSeconds() < 10
                ? "0" + date.getSeconds()
                : date.getSeconds()) + "";
            var type = "+";
            var amount = 0;
            if (unit.authors[0].address === this.address) {
              //out
              type = "-";
              var outputs =
                unit.messages[unit.messages.length - 1].payload.outputs;
              outputs.forEach(element => {
                if (element.address === this.address) {
                  //找零
                } else {
                  //支付给别人
                  amount = element.amount;
                  this.list.push({
                    time: Y + M + D + h + m + s,
                    value: type + amount / 1000000,
                    address:element.address
                  });
                }
              });
            } else {
              //in
              type = "+";
              console.log("+", unit.messages[unit.messages.length - 1]);
              //
              var outputs =
                unit.messages[unit.messages.length - 1].payload.outputs;
              outputs.forEach(element => {
                if (element.address === this.address) {
                  //别人支付给自己
                  amount = element.amount;
                  this.list.push({
                    time: Y + M + D + h + m + s,
                    value: type + parseFloat(amount / 1000000),
                    address:element.address
                  });
                } else {
                  //别人utxo找零
                }
              });
            }
          });
        },
        response => {
          // error callback
          this.openSimpleDialog();
          this.dialog.title = "error";
          this.dialog.message = "network error";
        }
      );
    }
  },
  created: function() {
    var storage = window.localStorage;
    var private_key = storage.getItem("private_key");
    if (private_key == null) {
      console.log("privatekey!", private_key);
      //window.location.href = '/'
      this.$router.push("/"); //不知道为什么这个不起作用。。。
    }
  },
  mounted: function() {
    this.GetSettingValue();
    this.GetHistory();
  }
};
</script>

<style scoped>
.mint-cell-wrapper {
  text-align: left;
}
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