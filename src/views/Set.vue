<template>
  <div class="first" :style="{backgroundColor:'#EEF0F6',backgroundImage: 'url(' + bg + ')'}">
    <span class="center">
      <h1>Setting Network</h1>
      <div class="pan">
        <p></p>
        <mu-button color="primary" @click="MainNetClicked">MainNet</mu-button>
        <p></p>
        <mu-button color="primary" @click="TestNetClicked">TestNet</mu-button>
        <p></p>
        <mu-button color="primary" @click="ZeroNetClicked">ZeroNet</mu-button>
        <p></p>
        <mu-button color="error" @click="ClearWalletClicked">Clear Wallet</mu-button>
        <p></p>
        <mu-button @click="ReturnClicked">RETURN</mu-button>
      </div>
    </span>
    <mu-dialog v-bind:title="dialog.title" width="360" :open.sync="dialog.display">
      {{dialog.message}}
      <mu-button slot="actions" class="dbtn" flat color="error" @click="ClearWallet">Yes!!!</mu-button>
      <mu-button slot="actions" class="dbtn" flat color="primary" @click="closeSimpleDialog">Cancel</mu-button>
    </mu-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialog: {
        title: "alert!",
        message: "Are you sure delete your wallet ?",
        display: false
      },
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
    ClearWallet(e) {
      var storage = window.localStorage;
      storage.clear();
      this.$router.push("/wallet");
    },
    ClearWalletClicked(e) {
      this.openSimpleDialog();
    },
    ReturnClicked(e) {
      this.$router.push("/wallet");
    },
    MainNetClicked(e) {
      var storage = window.localStorage;
      storage.setItem("net", "MainNet");
      storage.setItem("api_base_url", "http://150.109.50.199:6002");
      this.$router.push("/wallet");
    },
    TestNetClicked(e) {
      console.log(e);
      var storage = window.localStorage;
      storage.setItem("net", "TestNet");
      storage.setItem("api_base_url", "http://150.109.57.242:6002");
      this.$router.push("/wallet");
    },
    ZeroNetClicked(e) {
      console.log(e);
      var storage = window.localStorage;
      storage.setItem("net", "ZeroNet");
      storage.setItem("api_base_url", "http://150.109.47.45:6002");
      this.$router.push("/wallet");
    }
  },
  created: function() {
    var storage = window.localStorage;
    var private_key = storage.getItem("private_key");
  }
};
</script>

<style scoped>
p {
  margin: 20px auto;
}
h1 {
  text-align: center;
  font-size: 30px;
}
button {
  width: 90%;
}
.dbtn{
  width: 100px;
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
  font-size: 50px;
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