<template>
    <div class="login">
      <div class="top">
        <img src="https://server.yphtoy.com/img/wx/logo.png" alt="波菲"/>
        <span>幼儿体育与健康</span>
      </div>
      <div class="con">
        <h1>快捷认证</h1>
        <div class="input_box">
          <label for="phone">手机号:</label>
          <input type="number" id="phone" placeholder="请输入手机号" v-model="phone">
          <span @tap="get_code">{{code_span}}</span>
        </div>
        <div class="input_box">
          <label for="code">验证码:</label>
          <input type="text" id="code" placeholder="请输入验证码" v-model="code">
        </div>
        <div class="btn" @tap="login">登录</div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data(){
            return{
                phone:"",
                code:"",
                code_num:60,
                code_span:"发送验证码",
                code_flag:true ,//是否允许发送验证码
            }
        },
        //加载完成事件
        onLoad(){
          let s = wx.getStorageSync("openid");//获取openid
            if(s!==undefined&&s!==null&&s!==""){
                mpvue.reLaunch({ url:'../index/main' })
            }
        },
        methods:{
            //获取二维码
            get_code(){
                wx.hideLoading();
                //是否允许发送验证码
                if(this.code_flag){
                    //检查并判断手机号格式
                    let flag = this.$check("phone",this.phone);
                    if(flag||1==1){//验证通过
                        this.code_flag = false;
                        //时间函数
                        let t = setInterval(()=>{
                            if(this.code_num>0){
                                this.code_num --;
                                this.code_span = this.code_num + "秒之后重发";
                            }else {
                                clearInterval(t);
                                this.code_span = "发送验证码";
                                this.code_flag = true;
                            }
                        },1000);
                        this.$httpWX.post({
                            url: 'sendCode',
                            data: { mobile:this.phone }
                        }).then(res => {
                            console.log(res);
                            let d = JSON.parse(res.d);
                            if(!d.success){
                                wx.showToast({
                                    title:d.err, mask:true
                                })
                            }else{
                                wx.showToast({
                                    title:d.msg, mask:true
                                })
                            }
                        });
                    }else{
                        wx.showToast({
                            title:"手机号格式错误",
                            //https://server.yphtoy.com/img/wx/warn.png
                            image:"/static/images/warn.png",
                            mask:true,
                        });
                    }
                }else{
                    wx.showToast({
                        title:"请在"+this.code_num + "秒后再试",
                        image:"/static/images/warn.png",
                        mask:true
                    })
                }

            },
            //登录
            login(){
                if(this.phone === ""){
                    wx.showModal({
                        title:"提示信息",content:"请输入手机号",confirmColor:"#53536f",cancelColor:"gray"
                    });
                    return;
                }
                if(this.code === ""){
                    wx.showModal({
                        title:"提示信息",content:"请输入验证码",confirmColor:"#53536f",cancelColor:"gray"
                    });
                    return;
                }
                //调用登录
                let that = this;
                wx.login({
                    success:function (e) {
                        console.log(e);
                        that.$httpWX.post({//--获取openid
                            url: 'GetOpenId',
                            data: {wxCode:e.code}
                        }).then(res => {
                            let d = JSON.parse(res.d);
                            let sess = d.openid;//-
                            console.log(d);
                            wx.setStorageSync("openid",d.openid);
                            //---------------------------------------------开始注册
                            that.$httpWX.post({//--
                                url: 'Region',
                                data: {mobile:that.phone, smscode:that.code, openid :sess}//--手机号验证码openid
                            }).then(res => {
                                let d = JSON.parse(res.d);
                                console.log(d);
                                if(!d.success){
                                    wx.showModal({
                                        title:"提示信息",content:d.msg,confirmColor:"#53536f",cancelColor:"gray"
                                    });
                                }else{
                                    mpvue.navigateTo({ url:'../index/main' })
                                }
                            });
                        });
                    }
                })

            },

        }
    }
</script>

<style scoped>
.login{
  width: 100%;height: 100%;overflow: hidden;background: #f7f7f7;
}
  .top{
    width: 100%;height:200rpx;background: linear-gradient(to left,rgb(82,82,110),rgb(125,128,156));padding-top: 150rpx;
  }
.top > img{
  width: 125rpx;height: 120rpx;margin-left: 100rpx;float: left;display: block;
}
.top > span{
  color: #fff;display: block;float: left;margin-top: 30rpx;margin-left:20rpx;font-size: 50rpx;
}
  .con{
    width: 90%;height: auto;overflow: hidden;margin: 20rpx auto;
  }
  .input_box{
    width: 100%;height: 100rpx;margin-bottom: 50rpx;border: 1rpx solid #ccc;border-radius: 50rpx;box-sizing: border-box;
    position: relative;
  }
  h1{
    font-size: 50rpx;font-weight: 800;margin-bottom: 50rpx;margin-top: 50rpx;color: rgb(77,77,110);
  }
.input_box > label{
  float: left;height: 100rpx;line-height: 100rpx;width: 30%;text-align: center;color: #999;
}
.input_box > input{
  display: block;float: left;width: 70%;height: 80rpx;margin-top: 10rpx;color: #666;
}
.input_box > span{
  border-left: 1rpx solid #ccc;position: absolute;right: 20rpx;top:0;color: rgba(22,211,138,1);
  display: block;height: 100%;line-height: 100rpx;font-size: 30rpx;padding-left: 20rpx;z-index: 10;
}
  .btn{
    width: 100%;height: 100rpx;border-radius: 50rpx;background: linear-gradient(to left,rgb(82,82,110),rgb(125,128,156));
    text-align: center;line-height: 100rpx;color: #fff;
  }
</style>
