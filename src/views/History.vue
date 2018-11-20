<template>
  <div>
    <mt-header title="交易记录">
        <router-link to="/wallet" slot="left">
            <mt-button icon="back">返回</mt-button>
        </router-link>
    </mt-header>
    <div v-bind:key="item.index" v-for = "item in list" style="text-align:left;">
        <mt-cell v-bind:title="item.time" v-bind:value="item.value"></mt-cell>
    </div>
    
  </div>
</template>

<script>
  const Client = require('wallet-base')
  
  export default {
    data () {
      return {
        list:[],
        address:""
      }
    },
    methods: {
      PaymentClicked (e) {
        console.log(e)
        this.$router.push('/payment');
      },
      HistoryClicked (e) {
        this.$router.push('/history');
      }
    },
    created:function(){
      var storage=window.localStorage;
      var private_key = storage.getItem("private_key");
      if (private_key == null){
        console.log("privatekey!",private_key)
        //window.location.href = '/'
        this.$router.push('/'); //不知道为什么这个不起作用。。。
      }
    },
    mounted:function(){

        var storage=window.localStorage;
        this.address = storage.getItem("address");
        
        //get
        var url = "http://150.109.57.242:6001/api/v1/asset/txhistory/"+this.address+"/TTT/1/10";
        this.$http.get(url).then(response => {
            // get body data
            var json = response.body;
            console.log("history:",json.data.history);
            var history = json.data.history;
            history.forEach(element => {
                var unit = element.unit;
                var timestamp = unit.timestamp;
                var date = new Date(timestamp * 1000);
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                var D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
                var h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
                var m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':';
                var s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds()) + '';
                var type = "+"
                var amount = 0;
                if (unit.authors[0].address === this.address) {
                    //out
                    type = "-";
                    var outputs = unit.messages[unit.messages.length-1].payload.outputs;
                    outputs.forEach(element => {
                        if (element.address === this.address){
                            //找零
                        }else{
                            //支付给别人
                            amount = element.amount;
                            this.list.push({
                                time:Y + M + D + h + m + s,
                                value:type + amount/1000000
                            })
                        }
                    });
                }else{
                    //in
                    type = "+";
                    console.log("+",unit.messages[unit.messages.length-1]);
                    //
                    var outputs = unit.messages[unit.messages.length-1].payload.outputs;
                    outputs.forEach(element => {
                        if (element.address === this.address){
                            //别人支付给自己
                            amount = element.amount;
                            this.list.push({
                                time:Y + M + D + h + m + s,
                                value:type + parseFloat(amount/1000000)
                            })
                        }else{
                            //别人utxo找零
                        }
                    });
                }
                
            });
            
        }, response => {
            // error callback
        });
    }
  }
</script>

<style scoped>
    .mint-cell-wrapper{
        text-align:left;
    }
  .center{
    text-align: center;
  }
  .balance{
      font-size: 20px;
  }
  h1{
    text-align: center;
    font-size: 30px;
  }
  p{
    width: 90%;
    margin: 10px auto;
    font-size: 22px;
    font-weight: lighter;
  }
  .address{
      font-size:14px;
      text-align: center;
      width: 100%;
  }
  textarea{
    width: 90%;
    margin: 10px auto;
    height: 100px;
    border: solid 1px #ddd;
  }
</style>