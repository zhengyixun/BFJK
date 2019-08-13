<template>
    <div class="aboutus">
      <!--头部组件-->
      <Headers :to_header="to_header"></Headers>
      <text>服务热线：400-1800-333</text>
      <view class="company">浙江波菲教育玩具有限公司 · 版权所有</view>
    </div>
</template>

<script>
    //引入头组件
import Headers from "@/components/header";
    export default {
        name: "index",
        components:{ Headers },
        data(){
            return{
                to_header:{
                    back_url:'/pages/setup/main', //要返回的地址
                    header_text:"关于我们", //头文字
                    is_bg:false
                },
            }
        },
    }
</script>

<style scoped>
.aboutus{
  height: 100%;overflow: hidden;
  background-image: url("http://server.yphtoy.com/img/wx/02.png");
  background-position: center center;background-size: cover;
}
  .aboutus > text{
    display: block;width: 100%;text-align: center;font-size: 40rpx;color: #fff;margin-top: 100rpx;
  }
  .company{
    position: fixed;text-align: center;left: 0;right: 0;bottom:20rpx;height: 100rpx;line-height: 100rpx;
    color: #fff;font-size: 30rpx;
  }
</style>
