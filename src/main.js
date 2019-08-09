import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false;
App.mpType = 'app';
//ajax请求
import WXrequest from './utils/require'
Vue.prototype.$httpWX = WXrequest;
//手机号验证
Vue.prototype.$check=function(type,str){
  //字符串去空
  let st = str.replace(/\s+/g,"");
  if(type === "phone"){
    let myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(st)) {
      return false;
    } else {
      return true;
    }
  }else{
    return "-1";
  }

};
//根据输入的分数，返回 完美 不错 一般 努力
Vue.prototype.score_text=function(score){
  if(score ===""||score === null||score === undefined){
    return "请传入分数";
  }else{
    if(isNaN(score)){
      return "请输入数字"
    }else{
      let num = parseInt(score);
      if(num>=0 && num <25){
        return "努力";
      }else if(num>=25 && num <50){
        return "一般";
      }else if(num>=50 && num <85){
        return "不错";
      }else if(num>=85 && num <=100){
        return "完美";
      }else{
        return "未知"
      }
    }
  }
};

//根据type 返回缩放倍数和单位
Vue.prototype.get_unit=function(type){
  let obj = { mult: 100, unit: '--' };
  if (type == 1) {//立定跳远
    obj.mult = 100;
    obj.unit = "cm";
  } else if (type == 2) {//网球掷远
    obj.mult = 10000;
    obj.unit = "m";
  } else if (type == 3 || type == 4 || type == 15) {//10米折返跑  10米折返爬  15米障碍跑
    obj.mult = 100;
    obj.unit = "s";
  } else if (type == 5) {//单脚站
    obj.mult = 100;
    obj.unit = "s";
  } else if (type == 6) {//6双脚跳
    obj.mult = 100;
    obj.unit = "s";
  } else if (type == 7) {//坐位体前屈
    obj.mult = 100;
    obj.unit = "cm";
  } else if (type == 8) {//平衡木
    obj.mult = 100;
    obj.unit = "s";
  } else if (type == 98) {//98 身高 测试成绩
    obj.mult = 100;
    obj.unit = "cm";
  } else if (type == 99) {//99 体重
    obj.mult = 100;
    obj.unit = "kg";
  }
  return obj
};
const app = new Vue(App);
app.$mount();
