<template>
  <div class="back" :style="height" :class="to_header.is_bg === false?'no_bg':''">
    <img @tap="backs" :style="to_header.back_url == ''?'display:none':'display:block;float:left'" src="https://server.yphtoy.com/img/wx/back.png"/>
    <text>{{to_header.header_text}}</text>
  </div>
</template>

<script>
  /*
  * to_header:{
  *     back_url:"", //要返回的地址
  *     header_text:"" //头文字
  * }
  * */
    export default {
        name: "header",
      props:{
        to_header:Object,
        require:true
      },
      data(){
          return{
            height:"",
          }
      },
      onLoad(){
        wx.getSystemInfo({
          success: e => {
            this.height ="padding-top:"+(parseInt(e.statusBarHeight) + 15) + "px";//状态栏高度
          }
        });
      },
      methods:{
        //返回上一级
        backs(){
          mpvue.navigateBack({url:this.to_header.back_url});
        },
      }
    }
</script>

<style scoped>
  .back{
    width: 94%;color: #444;padding-left:3%;padding-right:3%;font-size: 30rpx;
    background: linear-gradient(to left,rgb(82,82,110),rgb(125,128,156));padding-bottom: 50rpx;
  }
  .no_bg{
    background: none!important;
  }
  .back img,.back text{
    color: #fff;font-size: 35rpx;
  }
  .back img{
    width: 20rpx;height:40rpx;padding-right: 20rpx;padding-top: 5rpx;
  }
</style>
