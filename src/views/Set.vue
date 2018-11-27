<template>
  <div class="first" :style="{backgroundColor:'#EEF0F6',backgroundImage: 'url(' + bg + ')'}">
    <span class="center">
      <h1>Setting Network</h1>
      <p>select Network For TrustNote</p>
      <div class="pan">
        <img alt="logo" width="100" src="../assets/logo.png">
        <p></p>
        <mu-button color="primary" @click="MainNetClicked">MainNet</mu-button>
        <p></p>
        <mu-button color="primary" @click="TestNetClicked">TestNet</mu-button>
        <p></p>
        <mu-button color="default" disabled @click="ZeroNetClicked">ZeroNet (open soon)</mu-button>
        <p></p>
        <mu-button color="primary" @click="ReturnClicked">RETURN</mu-button>
      </div>
    </span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      bg: require("../assets/bg.png")
    };
  },
  methods: {
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
      storage.setItem("api_base_url", "http://dev.trustnote.org:6002");
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