<template>
  <div class="first" :style="{backgroundImage: 'url(' + bg + ')'}">
    <span class="center">
      <div class="pan">
        <img alt="logo" width="100" src="../assets/logo.png">
        <h1>TrustNote Fusion Wallet</h1>
        <p></p>
        <mt-button type="primary" @click="MakeClicked">Create New Wallet</mt-button>
        <p></p>
        <mt-button type="primary" @click="ImportClicked">Import Existing Wallet</mt-button>
      </div>
    </span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      bg: require("../assets/bg.jpg")
    };
  },
  methods: {
    MakeClicked(e) {
      console.log(e);
      this.$router.push("/create");
    },
    ImportClicked(e) {
      console.log(e);
      this.$router.push("/import");
    }
  },
  created: function() {
    var storage = window.localStorage;
    var private_key = storage.getItem("private_key");
    if (private_key != null) {
      console.log("privatekey!", private_key);
      //window.location.href = '/wallet'
      this.$router.push("/wallet"); //不知道为什么这个不起作用。。。
    }
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
  width: 220px;
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
}
.center {
  display: table-cell;
  vertical-align: middle;
}
.pan{
      padding: 40px;
    background: #fff;
    width: 320px;
    margin: 0 auto;
    border-radius: 10px;
}
</style>