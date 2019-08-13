<template>
    <div class="setup">
      <!--头部组件-->
      <Headers :to_header="to_header"></Headers>
      <div class="header">
        <div class="left">
          <open-data type="userAvatarUrl" mode="cover" id="img"></open-data>
        </div>

        <div class="right">
          <text>{{user_data.name}} 的家长</text>
          <br>
          <view>手机号：{{user_data.mobile}}</view>
        </div>
      </div>
      <view id="bot">
        <div>
          <span>孩子姓名</span>
          <span>{{user_data.name}}</span>
        </div>
        <div>
          <span>孩子生日</span>
          <span>{{user_data.birthday}}</span>
        </div>
        <div>
          <span>身高</span>
          <span>{{user_data.height}}</span>
        </div>
        <div>
          <span>体重</span>
          <span>{{user_data.weight}}</span>
        </div>
        <div>
          <span>班级</span>
          <span>{{user_data.class_name}}</span>
        </div>
        <div>
          <span>园所</span>
          <span>{{user_data.school_name}}</span>
        </div>
        <div @tap="to_about_us">
          <span>关于我们</span>
          <img src="/static/images/r.png" alt=""  class="r">
          <span></span>
        </div>
      </view>
      <view class="login_out" @click="login_out">
        退出
      </view>
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
                    back_url:'/pages/index/main', //要返回的地址
                    header_text:"个人中心", //头文字
                    is_bg:true
                },
                user_data:{}
            }
        },
        onLoad(opt){
            console.log(JSON.parse(opt.data));
            this.user_data = JSON.parse(opt.data);
        },
        methods:{
            to_about_us(){
                //跳转到关于我们
                mpvue.navigateTo({
                    url:'../aboutus/main'
                })
            },
            login_out(){
                //退出登录并清除缓存
                wx.removeStorageSync("openid");
                mpvue.reLaunch({ url:'../login/main' })
            }
        }
    }
</script>

<style scoped>
  .setup{
    height: 100%;background: #f7f7f7;
  }
  .header{
    width: 94%;height: 200rpx;background-color: #fff;margin-bottom: 30rpx;padding: 0 3%;margin-top: 40rpx;
  }
  header  span{
    font-size: 30rpx;color: #999;
  }
  .left{
    width: 150rpx;height: 150rpx;float: left;margin-top: 25rpx;margin-right: 20rpx;border-radius: 50%;overflow: hidden;
  }
  #img{
    width: 100%;height: 100%;
  }
  .right{
    float: left;height: 150rpx;margin-top:51rpx;font-size: 30rpx;line-height: 50rpx;
  }
  #bot{
    width: auto;background-color: #fff;
  }
  #bot div{
    width: 92%;height: 100rpx;border-bottom: 2rpx solid #f5f5f5;line-height: 100rpx;padding: 0 4%;
  }
  #bot div span{
    display: block;float: left;font-size: 30rpx;
  }
  #bot div span:nth-of-type(1){
    width: 25%;
  }
  #bot div span:nth-of-type(2),#bot div span:nth-of-type(3){
    float: right;
  }
  .r{
    display: block;float: right;width: 30rpx;height: 30rpx;margin-top: 35rpx;margin-left: 10rpx;
  }
  .login_out{
    width: 80%;height: 80rpx;margin: 30rpx auto;background: rgb(82,82,110);text-align: center;line-height: 80rpx;color: #fff;
    border-radius: 40rpx;font-size: 30rpx;
  }
</style>
