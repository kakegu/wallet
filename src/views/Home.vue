<template>
  <div class="first" :style="{backgroundColor:'#EEF0F6',backgroundImage: 'url(' + bg + ')'}">
    <span class="center">
      <h1>Fusion Wallet</h1>
      <p>A web wallet for TrustNote</p>
      <div class="pan">
        <img alt="logo" width="100" src="../assets/logo.png">
        <p></p>
        <mu-button color="primary" :disabled="disabled" @click="MakeClicked">Create New Wallet</mu-button>
        <p></p>
        <mu-button color="primary" :disabled="disabled" @click="ImportClicked">Import Existing Wallet</mu-button>
        <p></p>
        <mu-checkbox label="I have Accepted the Terms and Privacy Policy" v-model="iagerrd"></mu-checkbox>
      </div>
    </span>
  </div>
</template>
<script>
export default {
  watch: {
    iagerrd: function(val, oldVal) {
      if (val) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
  },
  data() {
    return {
      bg: require("../assets/bg.png"),
      iagerrd:true,
      disabled:false
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