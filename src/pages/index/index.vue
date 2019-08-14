<template>
  <div id="main">
    <div class="top">
      <open-data type="userAvatarUrl" class="img"></open-data>
      <span><b>{{userinfo.name}}</b><b style="font-size: 30rpx;color: rgb(156,156,176);padding-top: 5rpx">{{userinfo.class_name}}</b><b style="font-size: 30rpx;color: rgb(156,156,176);padding-top: 5rpx">{{userinfo.sex}}</b></span>
      <view class="birth">{{userinfo.birthday}}</view>
      <div class="set_up" @tap="to_setup"><img src="https://server.yphtoy.com/img/wx/01.png" alt=""></div>
    </div>
    <div class="con">
      <div class="title">
        <img src="http://server.yphtoy.com/img/wx/05.png" alt="">
        <span>测试成绩</span>
        <span>最近一次</span>
        <div>当前页：<text>{{page_index}}</text>/{{page_total}}</div>
      </div>
<!--      左右滚动-->
      <div class="swiperz">
        <swiper class="swiper"  :duration="duration" previous-margin="200rpx" next-margin="200rpx" easing-function="easeInOutCubic" :circular="true" @change="swiper_change">
          <block v-for="(item, index) in data_list" :key="index">
            <swiper-item class="s_child"  @tap="to_detail(item,index)">
              <view style="position: relative">
                <text class="pro">{{item.name}}</text>
                <text class="test_mark">{{item.mark}}<text class="unit">/{{item.unit}}</text></text>
                <text class="test_time">{{item.intime}}</text>
                <img :src="item.img_url" alt="" class="test_img"/>
              </view>
            </swiper-item>
          </block>
        </swiper>
      </div>
      <div class="card">
        <text v-for="(item,index) in card_data" :key="index" :class="current == (index)?'text_selected':null" @tap="card_change(index)">{{item.name}}</text>
      </div>
      <div class="card_info">
        <div class="card_info_top">
          <img src="https://server.yphtoy.com/img/wx/c.png" class="img_icon" alt="">
          <text>{{compare_data.length!==0?compare_data[current]['name']:""}}</text>
          <text>{{userinfo.sex}}生：{{compare_data.length!==0?compare_data[current]['cou']:""}}人</text>
          <text>项目:{{compare_data.length!=0?compare_data[current]['typename']:""}}</text>
          <img :src="img_arr[current]" class="right_img" alt="">
        </div>
        <div class="card_info_bot">
          <div>
            <view>{{compare_data.length!==0?compare_data[current]['rank']:""}}</view>
            <view>排名</view>
          </div>
          <div>
            <view>{{compare_data.length!==0?compare_data[current]['avg']:""}}</view>
            <view>平均</view>
          </div>
          <div>
            <view>{{compare_data.length!==0?compare_data[current]['max']:""}}</view>
            <view>最好</view>
          </div>
          <div>
            <view>{{compare_data.length!==0?compare_data[current]['max_del']:""}}</view>
            <view>最好差距</view>
          </div>
        </div>
      </div>
      <div class="title" style="margin-bottom: 0">
        <img src="http://server.yphtoy.com/img/wx/04.png" alt="">
        <span>综合评定分析</span>
        <span>百分制</span>
        <div @tap="select_info">查看详细报告</div>
      </div>
      <div class="score">
        <view class="score_child">
          <view v-for="(item,index) in score_data1" :key="index">
            <text>{{item.type}}</text>
            <text class="score_num">{{item.value}}</text>
            <text>{{item.score_text}}</text>
            <img :src="item.img_url" alt="">
          </view>
        </view>
        <view class="score_child">
          <view v-for="(item,index) in score_data2" :key="index">
            <text>{{item.type}}</text>
            <text class="score_num">{{item.value}}</text>
            <text>{{item.score_text}}</text>
            <img :src="item.img_url" alt="">
          </view>
        </view>
      </div>
      <text class="bot">我是有底线的</text>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
        userinfo:{
            name:"",
            sex:"",
            class_name:"",
            birthday:"",
            height:"",
            weight:"",
            school_name: "",
            group_name:"",
            mobile:""
        },
        nomal_mark:"0",//--------------默认成绩
        nomal_sex:"",//性别
        nomal_type:"",//----------------------------默认的type类型
        page_index:"1",
        page_total:"20",
        current:0,//-班级年级 省级 等
        card_data:[
            {type:1,name:"班级"},
            {type:2,name:"年级"},
            {type:3,name:"市级"},
            {type:4,name:"省级"},
            {type:5,name:"全国"}
        ],
        duration:400,
        data_list:[],
        score_data1:[],//综合评定分析1
        score_data2:[],//综合评定分析2
        time_list:[],//学期
        now_year:"",//当前处于的年份学期
        now_term:"",
        compare_data:[],//--数据对比
        img_arr:[
            "https://server.yphtoy.com/img/wx/class_1.png",
            "https://server.yphtoy.com/img/wx/class_2.png",
            "https://server.yphtoy.com/img/wx/class_3.png",
            "https://server.yphtoy.com/img/wx/class_4.png",
            "https://server.yphtoy.com/img/wx/class_5.png",
        ]
    }
  },

  components: {},

  methods: {
      //跳转到详情页
      to_detail(item,index){
          let data = {
              name:item.name,
              type:item.id,
              sex:this.nomal_sex,
              data_list:this.data_list,
              data_index:index  //控制显示第几条
          };
          mpvue.navigateTo({
              url:'../detail/main?data=' + JSON.stringify(data)
          })
      },
      //查看详细报告
      select_info(){
          let d = this.data_list[this.page_index];
          let data = {
              name:d.name,
              type:d.id,
              sex:this.nomal_sex,
              data_list:this.data_list,
              data_index:this.page_index  //控制显示第几条
          };
          mpvue.navigateTo({
              url:'../detail/main?data=' + JSON.stringify(data)
          })
      },
      card_change(type){ //qiehuan
          this.current = type;
      },
      //轮播图切换，改变page_index type 种类切换
      swiper_change(e){
          this.page_index = e.target.current;
          //班级年级省级等 0 班级 1 年级 2 市级 3 省级 4 全国。
          this.nomal_type = this.data_list[e.target.current]['id'];

          //切换的时候存下当前成绩
          this.nomal_mark = this.data_list[e.target.current]['mark'];
          this.get_compare_data(wx.getStorageSync("openid"),this.nomal_type,this.nomal_sex,this.now_year,this.now_term);
      },
      //获取比较数据 - 班级 年级 省级 全国
      get_compare_data(openid, type,sex, year, term){
          this.$httpWX.post({
              url: 'Compare',
              data: { openid, type,sex, year, term }
          }).then((e)=>{
            let data = JSON.parse(e.d);
            //处理mark avg
              data.list.forEach((item,index)=>{
                 let mult = this.get_unit(item.type).mult;
                 let arr = [3,4,14,5,6,8];//时间
                 if(arr.indexOf(parseInt(item.type)) > -1){ //根据类型区分时间和非时间，如果是时间 最大值和最小值 进行交换
                    let temp = item.max;
                     item.max = item.min;
                     item.min = temp;
                 }
                 item.avg = parseFloat(item.avg/ mult).toFixed(2);
                 item.max = parseFloat(item.max / mult).toFixed(2);
                 item.min = parseFloat(item.min / mult).toFixed(2);
                 item.max_del = Math.abs(parseFloat(item.max - this.nomal_mark).toFixed(2));
                  if(isNaN(item.max_del)){
                      item.max_del = '0.00'
                  }
              });
            this.compare_data = data.list
          })
      },
      //--跳转到setup
      to_setup(){
          // 传值
          let data = {
              name:this.userinfo.name,
              birthday:this.userinfo.birthday,
              class_name:this.userinfo.class_name,
              school_name:this.userinfo.school_name + this.userinfo.group_name,
              height: this.userinfo.height,
              weight: this.userinfo.weight,
              mobile:this.userinfo.mobile
          };
          mpvue.navigateTo({
              url:'../setup/main?data=' + JSON.stringify(data)
          })
      },
  },

  onLoad () {
      //获取年级学期
      this.$httpWX.post({
          url: 'timeConfig',
          data: { }
      }).then((e)=>{
          this.time_list=[];
          let data = JSON.parse(e.d);
          let now_year = ((new Date()).toLocaleDateString()).replace(/\//g, "-");
          data.list.forEach((item,index)=>{
              if(item.end < now_year){
                  this.time_list.push(item);
                  if(new Date(now_year) < new Date(item.end)  && new Date(now_year) >=new Date(item.start)){ //大于开始日期，小于结束日期
                      this.now_year=item.year;//当前处于的年份学期
                      this.now_term=item.term;
                  }
              }
          });
      }).then(()=>{
          //获取测试数据
          this.$httpWX.post({
              url: 'Login',
              data: { openid:wx.getStorageSync('openid'),  year:this.now_year, term:this.now_term }
          }).then((e)=>{
              let d = JSON.parse(e.d);
              this.score_data2 = [];
              this.score_data1 = [];
              this.userinfo['name'] = d.name;
              this.userinfo['sex'] = (d.sex==="1"?"男":"女");
              this.nomal_sex = d.sex; //性别请求数据用
              this.userinfo['class_name'] = d.class_name;
              this.userinfo['group_name'] = d.groupname;
              this.userinfo['school_name'] = d.school_name;
              this.userinfo['mobile'] = d.mobile; //--手机号
              d.birthday = d.birthday.split(" ")[0];
              this.userinfo['birthday'] = d.birthday.split("/")[0] + "年"+ d.birthday.split("/")[1]+"月"+d.birthday.split("/")[2] + "日";
              this.page_total = d.test.length; //总页数
              //20项测试数据
              d.test.forEach((item,index)=>{
                  item.unit = this.get_unit(item.id)['unit'];
                  item.mult = this.get_unit(item.id)['mult'];
                  if(index === 0){
                      this.nomal_type = item.id;
                      this.nomal_mark = item.mark / item.mult;
                  }
                  item.img_url = "http://server.yphtoy.com/img/wx/parent/"+(index+1)+".png";
                  if(item.mark === null ||item.mark === undefined ||item.mark === ""){
                      item.mark = "未测试";
                      item.score = "未测试";
                      item.score_text = "";
                      item.up_down = "--";
                      item.change_mark = "--";
                  }else{
                      item.mark = item.mark / item.mult;
                      item.score_text = this.score_text(item.score);
                      item.up_down = "--";
                      item.change_mark = "--";
                  }
                  if(item.id ==="98"){//身高
                      this.userinfo.height = item.mark+ 'cm';
                      this.score_data1.push({
                          type: item.name,
                          value:Math.abs(item.score),//评分1
                          score_text:item.score_text,
                          img_url:"http://server.yphtoy.com/img/wx/parent/3_1.png"
                      });
                  }
                  if(item.id ==="99"){//体重
                      this.userinfo.weight = item.mark + 'kg';
                      this.score_data1.push({
                          type: item.name,
                          value:Math.abs(item.score),//评分1
                          score_text:item.score_text,
                          img_url:"http://server.yphtoy.com/img/wx/parent/3_2.png"
                      });
                  }
              });
              //下面的评分和是否优秀

              d.evaluate.forEach((item,index)=>{
                  if(item.value === "" ){
                      item.value ="未测试";
                      item.score_text = "";
                  }else{
                      item.score_text = this.score_text(item.value);
                      item.value = Math.abs(item.value);//取绝对值
                  }
                  if(index === 3){
                      item.img_url= "http://server.yphtoy.com/img/wx/parent/3_3.png";
                      this.score_data1.push(item);
                  }else{
                      if(index===4){
                          item.img_url= "http://server.yphtoy.com/img/wx/parent/4_4.png";
                      }else{
                          item.img_url= "http://server.yphtoy.com/img/wx/parent/4_"+(index+1)+".png";
                      }

                      this.score_data2.push(item);
                  }
              });
              this.data_list = d.test;
          }).then(()=>{//-----------------------------------------获取比较数据
              this.get_compare_data(wx.getStorageSync("openid"),this.nomal_type,this.nomal_sex,this.now_year,this.now_term);
          })
      });

  }
}
</script>

<style scoped>
  #main{
    width: 100%;height: 100%;overflow: hidden;background: #f7f7f7;
  }
  .top{
    width: 100%;height:200rpx;background: linear-gradient(to left,rgb(82,82,110),rgb(125,128,156));padding-top: 150rpx;
    position: relative;
  }
  .top > .img{
    width: 125rpx;height: 125rpx;margin-left: 50rpx;float: left;display: block;border-radius: 50%;overflow: hidden;
  }
  .top > span{
    color: #fff;display: block;float: left;margin-left:10rpx;font-size: 35rpx;
    width: 62%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;
  }
  .top > span >b{
    color: #fff;display: block;float: left;margin-top: 20rpx;margin-left:10rpx;font-size: 35rpx;margin-right: 20rpx;
  }
  .set_up{
    width: 40rpx;height: 40rpx;
    position: absolute;right: 50rpx;bottom: 110rpx;
  }
  .set_up > img{
    width: 100%;height: 100%;
  }
  .con{
    position: fixed;bottom: 0;left: 0;right: 0;top:350rpx;overflow-y: auto;overflow-x: hidden;
    background: #f7f7f7;
  }
  .title{
    width: 100%;background: #fff;height: 100rpx;margin-bottom: 20rpx;
  }
  .title > img{
    width: 35rpx;height: 35rpx;display: block;margin-left: 20rpx;float: left;margin-top: 39rpx;
  }
  .title> span:nth-of-type(1){
    line-height: 90rpx;font-size: 35rpx;color: #666;margin-left: 10rpx;
  }
  .title> span:nth-of-type(2){
    line-height: 120rpx;font-size: 20rpx;color: gray;margin-left: 10rpx;
  }
  .title >div{
    width: auto;padding: 0 20rpx;float: right;
  }
  .title >div{
    font-size: 25rpx;line-height: 120rpx;color: #666;
  }
  .s_child {
    padding-top: 10rpx;
  }
  .s_child > view{
    height: 100%;width: 100%;background: #fff;border-radius: 10rpx;margin:0 5%;
  }
  .pro{
    font-size: 35rpx;font-weight: 800;color: #666;display: block;width: 95%;padding: 5% 0 0 5%;
  }
  .test_mark{
    display: block;color: rgb(0,191,86);font-size: 55rpx;font-weight: 800;padding-left: 5%;margin-bottom: 5rpx;margin-top: 5rpx;
  }
  .unit{
    font-size: 27rpx;color: #999;
  }
  .test_time{
    font-size: 27rpx;color: #999;padding-left: 5%;
  }
  .swiperz{
    margin-bottom: 30rpx;height: 235rpx;
  }
  .swiper{
    height: 235rpx;
  }
  .card{
    width: 95%;margin: 0 auto;display: flex;justify-content: space-around;padding-bottom: 20rpx;
  }
  .card > text{
    background: #fff;color: rgb(77,77,110);border-radius: 20rpx;padding: 15rpx 27rpx;font-size: 30rpx;
  }
  .text_selected{
    background: rgb(188,188,200)!important;color: #fff!important;
  }
  .card_info{
    width: 90%;height: 300rpx;border-radius: 20rpx;margin: 50rpx auto;box-shadow: 0 0 30rpx 1rpx #ccc;margin-top: 15rpx;
    background: #fff;
  }
  .card_info_top{
    height: 80rpx;width: 95%;margin: 0 auto;padding-top: 20rpx;position: relative;
  }
  .card_info_top > .img_icon{
    width: 35rpx;height: 35rpx;display: block;float: left;margin: 22rpx 10rpx 0 20rpx;
  }
  .card_info_top > text{
    font-size: 30rpx;line-height: 80rpx;margin-right: 10rpx;
  }
  .card_info_top > text:last-child{
    font-weight: 800;
  }
  .right_img{
    position: absolute;right: 8rpx;top:39rpx;height: 45rpx;width: 60rpx;
  }
  .card_info_bot{
    height: 200rpx;width: 87%;margin: 10rpx auto;font-size: 27rpx;
    color: #999;display: flex;
    justify-content: space-around;
  }

  .card_info_bot > div > view{
    width: 100%;height: 60rpx;text-align: center;line-height: 100rpx;
  }
  .card_info_bot > div > view:first-child{
    font-weight: 800;color: rgb(59,134,199);font-size: 40rpx;margin-bottom: 10rpx;
  }
  .score{
    width: 90%;height: 300rpx;margin: 0 auto;padding: 5%;background: #fff;
  }
  .score_child{
    width: 100%;height: 140rpx;display: flex;justify-content: space-around;
  }

  .score_child > view{
    width: 24%;height: 130rpx;border: 1rpx solid #ccc;border-radius: 7rpx;background: #fff;overflow: hidden;
    position: relative;
  }
  .score_child > view > img{
    width: 50rpx;height:65rpx ;position: absolute;right: 10rpx;top:10rpx;opacity: 0.2;
  }
  .score_child > view > text:first-child{
    font-size: 27rpx;color: #666;display: block;width: 100%;margin-left: 10rpx;padding-top: 17rpx;padding-bottom: 10rpx;
  }
  .score_child > view > text:nth-of-type(2){
    font-weight: 800;color:rgb(150,150,250) ;font-size: 45rpx;margin-left: 10rpx;
  }
  .score_child > view > text:nth-of-type(3){
    font-size: 27rpx;margin-left: 5rpx;
  }
  .bot{
    display: block;padding-bottom: 30rpx;width: 100%;text-align: center;color: #ccc;font-size: 20rpx;padding-top: 20rpx;
  }
  .test_img{
    position: absolute;width: 50rpx;max-height: 60rpx;right: 36rpx;top:28rpx;opacity: 0.2;
  }
  .birth{
    float: left;font-size: 30rpx;
    margin-left: 20rpx;color: rgb(156,156,176);
  }
</style>
