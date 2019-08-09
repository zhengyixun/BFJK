<template>
    <div class="detail">
      <!--头部组件-->
      <Headers :to_header="to_header"></Headers>
      <!--      左右滚动-->
      <div class="swiperz">
        <swiper class="swiper" :current="type_index" :duration="duration" previous-margin="100rpx" next-margin="100rpx" easing-function="easeInOutCubic" :circular="true" @change="type_change">
          <block v-for="(item, index) in data_list" :key="index">
            <swiper-item class="s_child">
              <view style="position: relative">
                <view class="test_info">
                  <text class="pro">{{item.name}}</text>
                  <text class="time">{{item.intime}}</text>
                  <view class="test_bot">
                    <view>
                      <text>{{item.mark}}<text style="font-size: 25rpx;color: #999">/{{item.unit}}</text></text>
                      <text>成绩</text>
                    </view>
                    <view>
                      <text><text class="up_down">{{item.up_down}}</text>{{item.change_mark}}</text>
                      <text>较上次</text>
                    </view>
                    <view>
                      <text>{{item.score}}分</text>
                      <text>评分</text>
                    </view>
                  </view>
                </view>
              </view>
            </swiper-item>
          </block>
        </swiper>
      </div>
<!--      切换学期-->
      <div class="term">
        <swiper :duration="duration" :current="1" previous-margin="100rpx" next-margin="100rpx" easing-function="easeInOutCubic" :circular="true" @change="term_change">
          <block v-for="(item, index) in term_list" :key="index">
            <swiper-item class="test_child">
              <view :class="term_page == index?'term_selected':''" :data="item.year + '-' + item.term">{{item.year}}{{item.term === "1"?"下":"上"}}学期</view>
            </swiper-item>
          </block>
        </swiper>
      </div>
<!--      当前时间-->
      <view class="now_time">{{now_time}}</view>
      <view class="score">
        <text>成绩：<text class="b">{{new_mark}}</text>{{unit}}</text>
        <text>评分：<text class="b">{{new_score}}</text>分</text>
      </view>
      <view class="charts"  id="canvas">
        <canvas canvas-id="canvas"></canvas>
        <view class="right">
          <text>100</text>
          <text>80</text>
          <text>60</text>
          <text>40</text>
          <text>20</text>
          <text>0</text>
        </view>
      </view>
    </div>
</template>

<script>
    //引入头组件
import Headers from "@/components/header";
    let Charts = require('../../utils/wxcharts.min.js');
    export default {
        name: "index",
        components:{ Headers },
        data(){
            return{
                to_header:{
                    back_url:'/pages/setup/main', //要返回的地址
                    header_text:" ", //头文字
                    is_bg:true
                },
                type_index:"1", //---左右滚动 控制显示第几条
                type:"",
                sex:"",
                unit:"",
                mult:"",
                now_time:"20-------- 00.00",
                duration:400,
                data_list:[],
                term_page:"1",
                term_list:[],  //--学期
                now_year:"",
                now_term:"",
                new_score:"",
                new_mark:""
            }
        },
        onLoad(opt){
            let d= JSON.parse(opt.data);
            this.to_header.header_text = d.name;
            this.type = d.type;
            this.sex = d.sex;
            this.get_term_list();
            console.log(d.data_list);
            this.data_list = d.data_list;
            this.type_index = d.data_index;//控制显示第几条-最上面的轮播


            let time = new Date();
            let arr = time.toLocaleDateString().split("/");
            this.now_time = arr[0] + '年' + arr[1] + '月' + arr[2] + '日 ' + new Date().toLocaleTimeString();

        },
        methods:{
            //学期切换
            term_change(e){
                this.term_page = e.target.current;
                this.now_year = this.term_list[e.target.current].year; //改变之后的年
                this.now_term = this.term_list[e.target.current].term; //改变之后的学期
                console.log(this.term_list[e.target.current]);
                //重新绘制图表
                this.get_type_data(this.type,this.now_year,this.now_term);
            },
            type_change(e){
              //type种类切换重新获取数据
                this.type_index = e.target.current;
                this.to_header.header_text = this.data_list[e.target.current]['name'];
                this.type = this.data_list[e.target.current]['id']; //--type值改变
                //data_list的值改变
                //重新绘制图表
                this.get_type_data(this.type,this.now_year,this.now_term);
                console.log(e)
            },
            //获取学期
            get_term_list(){
                //获取年级学期
                this.$httpWX.post({
                    url: 'timeConfig',
                    data: { }
                }).then((e)=>{
                    this.term_list=[];
                    let data = JSON.parse(e.d);
                    let now_year = ((new Date()).toLocaleDateString()).replace(/\//g, "-");
                    data.list.forEach((item,index)=>{
                        if(item.end < now_year){
                            this.term_list.push(item);
                            if(new Date(now_year) < new Date(item.end)  && new Date(now_year) >=new Date(item.start)){ //大于开始日期，小于结束日期
                                this.now_year=item.year;//当前处于的年份学期
                                this.now_term=item.term;
                            }
                        }
                    });
                }).then(()=>{
                    this.get_type_data(this.type,this.now_year,this.now_term);
                })
            },
            //获取某项测试数据
            get_type_data(type,year,term){
                this.unit = this.get_unit(this.type)['unit'];
                this.mult = this.get_unit(this.type)['mult'];
                this.new_mark = "--";
                this.new_score = "--";
                this.$httpWX.post({
                    url: 'TestDetail',
                    data: {
                        openid:wx.getStorageSync('openid'),
                        type,sex:this.sex,year, term }
                }).then((e)=>{
                    let data = JSON.parse(e.d);
                    console.log(data);
                    if(data.success===false){
                        this.data_list[this.type_index]['score'] = "未测";
                        this.data_list[this.type_index]['mark'] = "未测";
                        this.data_list[this.type_index]['up_down'] = "--";
                        this.data_list[this.type_index]['change_mark'] = "未测";
                        this.make_charts([],[],[]);
                    }else{
                        let xdata=[],y1data=[],y2data=[];
                        data.list.forEach((item,index)=>{
                            if(index === 0){
                                this.new_mark = item.mark / this.mult;//成绩
                                this.new_score = item.score;//评分
                                //data_list的值随之改变
                                this.data_list[this.type_index]['score'] = item.score;
                                this.data_list[this.type_index]['mark'] = item.mark / this.mult;
                                //在这里计算是提升还是降低
                                if(data.list[0]['mark']>=data.list[1]['mark']){
                                    console.log('升');
                                    this.data_list[this.type_index]['up_down'] = "升";
                                    console.log(this.data_list[this.type_index]['change_mark']);
                                    this.data_list[this.type_index]['change_mark'] = ((data.list[0]['mark'] - data.list[1]['mark'])/ this.mult).toFixed(1);
                                }else{
                                    console.log('降');
                                    this.data_list[this.type_index]['up_down'] = "降";
                                    this.data_list[this.type_index]['change_mark'] = ((data.list[1]['mark'] - data.list[0]['mark'])/ this.mult).toFixed(1);

                                    console.log((data.list[1]['mark'] - data.list[0]['mark'])/ this.mult);
                                }
                            }
                            xdata.push(index +1);
                            y1data.unshift(item.mark / this.mult);
                            y2data.unshift(item.score);
                        });

                        this.make_charts(xdata,y1data,y2data);
                    }
                })
            },
            make_charts(xdata,y1data,y2data){
                let h,w;
                //创建节点选择器
                let query = wx.createSelectorQuery();
                //选择id
                query.select('#canvas').boundingClientRect();
                query.exec(function (res) {
                    h = res[0].height;
                    w = res[0].width;
                    let chart= new Charts({
                        canvasId: 'canvas',
                        dataPointShape: "circle",
                        type: 'line',
                        extra: {
                            lineStyle: 'curve' //线条的形状（弧形）
                        },
                        categories: xdata,
                        series: [{
                            name: '成绩',
                            data: y1data,//成绩
                            format: function (val) {
                                return val + 's';
                            }
                        }, {
                            name: '评分',
                            data: y2data, //评分
                            format: function (val) {
                                return val + '分';
                            }
                        }],
                        yAxis: {
                            title: '成绩',
                            format: function (val) {
                                return val.toFixed(2);
                            },
                            fontColor: "#999",
                            titleFontColor: "#999",
                            min: 0,
                            max:100,
                            gridColor:"#999"
                        },
                        width:w,
                        height:h,
                        dataLabel: true
                    });
                    chart.addEventListener('tap', () => {
                        // your code here
                        console.log(1232132)
                    });
                });

            }
        }
    }
</script>

<style scoped>
.detail{
  height: 100%;
}
.swiperz{
  margin-bottom: 30rpx;background: #f7f7f7;
}
.swiper{
  height: 320rpx;
}
.s_child > view{
  width: 90%;padding: 5%;
}
.test_info{
  width: 90%;height: 80%;background: #fff;border-radius: 10rpx;overflow: hidden;padding: 5% 5% 0 5%;
}
  .test_info > .pro{
    font-weight: 800;font-size: 35rpx;
  }
.test_info > .time{
  margin-left: 20rpx;font-size: 23rpx;color: #999;
}
  .test_bot{
    width: 100%;height: 200rpx;
  }
.test_bot> view{
  width: 33.333333%;height: 90%;float: left;background: #fff;
}
.test_bot> view > text{
  display: block;width: 100%;text-align: center;
}
.test_bot> view > text:first-child{
  height: 120rpx;line-height: 150rpx;font-size: 50rpx;color: rgb(0,191,86);
}
.up_down{
  color: #999!important;font-size: 27rpx!important;
}
.test_bot> view > text:last-child{
  font-size: 25rpx;color: #999;
}
  .term{
    width: 65%;height: 60rpx;margin: 30rpx auto;
  }
.term > swiper{
  width: 100%;height: 100%;
}
  .test_child{

  }
.test_child > view{
  width: 90%;height: 100%;margin: 0 auto;font-size: 27rpx;border-radius: 30rpx;overflow: hidden;text-align: center;
  line-height: 60rpx;
}
  .term_selected{
    color: #fff!important;background: rgb(0,191,86)!important;font-size:35rpx!important;
  }
  .now_time{
    width: 100%;text-align: center;font-size: 30rpx;margin: 30rpx auto;
  }
  .charts{
    width: 90%;height: 500rpx;margin: 0 auto;
  }
.charts > canvas{
  width: 100%;height: 100%;
}
.score{
  width: 60%;margin: 0 auto;
}
.score > text{
  margin-right: 20rpx;
}
  #canvas{
    position: relative;
  }
  #canvas > .right{
    position: absolute;right: 0;width: 30rpx;height: 100%;top:10rpx;
  }
.right > text{
  font-size: 20rpx;margin-bottom: 47rpx;display: block;color: rgb(153,153,153);
}
  .b{
    font-size: 45rpx;font-weight: 800;
  }
</style>
