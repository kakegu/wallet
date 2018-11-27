<template>
  <div class="first" :style="{backgroundColor:'#EEF0F6',backgroundImage: 'url(' + bg + ')'}">
    <span class="center">
      <h1>Create wallet</h1>
      <div class="pan">
        <p class="tip">Please write down your mnemonic on a piece of paper</p>
        <span
          class="word"
          v-bind:key="item.index"
          v-for="item in wordarray"
          style="text-align:left;"
        >{{item}}</span>
        <p></p>
        <mu-button color="primary" @click="ImportClicked">CONTINUE</mu-button>
        <p></p>
        <mu-button @click="CancelClicked">CANCEL</mu-button>
      </div>
    </span>
  </div>
</template>

<script>
const Client = require("wallet-base");
export default {
  data() {
    return {
      wordarray: [],
      bg: require("../assets/bg.png")
    };
  },
  methods: {
    ImportClicked(e) {
      console.log(e);
      this.$router.push({
        path: "/import",
        name: "import"
      });
    },
    CancelClicked(e) {
      this.$router.push("/");
    }
  },
  mounted: function() {
    let mnemonic = Client.mnemonic();
    var wordarray = mnemonic.split(" ");
    var new_word_array = []
    wordarray.forEach(function(value , index , array){
      if (index != array.length - 1){
        new_word_array.push(value+" ");
      }else{
        new_word_array.push(value);
      }
    });
    this.wordarray = new_word_array;
  }
};
</script>

<style scoped>
.btn {
  margin: 10px;
}
.word {
  padding: 5px;
  /* background: bisque; */
  margin: 5px;
  display: inline-block;
  border-radius: 5px;
  font-size: 22px;
  background-color: aliceblue;
  color: #26a2ff;
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