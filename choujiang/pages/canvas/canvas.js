var app = getApp()
Page({
  data: {
    awardsList: {},
    animationData: {},
    chanceRemain:null,
    disabled:"disabled",
    able:"able",
    turning:false,
    scale:1,
    contentHeight:null
  },
  gotoList: function() {
    wx.switchTab({
      url: '../list/list'
    })
  },

  /**
   * 抽奖处理函数：
   */
  getLottery: function () {
    var that = this;
  
    //减少抽奖次数：
    this.setData({
      chanceRemain:that.data.chanceRemain-1,
      turning:true
    });
    setTimeout(function(){
      that.setData({
        turning:false
      })
    },4500)
    // var awardIndex = Math.random() * 6 >>> 0;
    // 获取奖品配置
    var awardsConfig = app.awardsConfig,
        runNum = 8,
        awardIndex=0;
    // if (awardIndex < 2) awardsConfig.chance = false
    // console.log(awardIndex)
    //设置概率：随机从数组中抽取一个数，数组中越大的数出现的次数越少，以此实现概率差异
    var Parr=[0,0,0,0,0,0,0,10,10,10,10,30,30,30,30,60,60,60,100,150];
    var PrandomNum = Math.random() * 19 >>> 0;
    switch (Parr[PrandomNum]){
      case 0: //谢谢参与
        awardIndex=5
        break
      case 10://2欧代金劵
        awardIndex = 0
        break
      case 30://33cl饮料
        awardIndex = 1
        break
      case 60://5欧代金劵
        awardIndex = 2
        break
      case 100://10欧代金劵
        awardIndex = 3
        break
      case 150://免配送费
        awardIndex = 4
        break
    }
    console.log("奖品序号："+awardIndex);
    // 旋转抽奖
    app.runDegs = app.runDegs || 0
    console.log('deg', app.runDegs)
    app.runDegs = app.runDegs + (360 - app.runDegs % 360) + (360 * runNum - awardIndex * (360 / 6))
    console.log('deg', app.runDegs)

    var animationRun = wx.createAnimation({
      duration: 4000,
      timingFunction: 'ease'
    })
    that.animationRun = animationRun
    animationRun.rotate(app.runDegs).step()
    that.setData({
      animationData: animationRun.export()
    })

     // 记录奖品
    var winAwards = wx.getStorageSync('winAwards') || {data:[]}
    winAwards.data.push(awardsConfig.awards[awardIndex].name + '1个')
    wx.setStorageSync('winAwards', winAwards)

    // 中奖提示
    setTimeout(function() {
      wx.showModal({
        title: awardsConfig.awards[awardIndex].name==="谢谢惠顾" ?"很遗憾,并没有中奖":'恭喜',
        content: awardsConfig.awards[awardIndex].name==="谢谢惠顾"?"再接再厉吧" :'获得' + (awardsConfig.awards[awardIndex].name),
        showCancel: false
      })

    }, 4000);
    

    /*wx.request({
      url: '../../data/getLottery.json',
      data: {},
      header: {
          'Content-Type': 'application/json'
      },
      success: function(data) {
        console.log(data)
      },
      fail: function(error) {
        console.log(error)
        wx.showModal({
          title: '抱歉',
          content: '网络异常，请重试',
          showCancel: false
        })
      }
    })*/
  },
  onReady: function (e) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
        contentHeight:res.windowHeight
        });
        if(res.windowWidth<360){
          that.setData({
            scale:0.9
          })
        }else if(res.windowWidth>500){
          that.setData({
            scale: 1.4
          })
        }
      },
    })
    // getAwardsConfig
    app.awardsConfig = {
      chance:1,
      awards:[
        { 'index': 0, 'name': '2欧外卖代金劵', 'img':'../../image/10欧代金劵.png'},
        { 'index': 1, 'name': '33cl饮料自选', 'img': '../../image/配送.png'},
        { 'index': 2, 'name': '5欧外卖代金劵', 'img': '../../image/谢谢参与.png'},
        { 'index': 3, 'name': '10欧外卖代金劵', 'img': '../../image/2欧代金劵.png'},
        { 'index': 4, 'name': '免配送费', 'img': '../../image/饮料.png'},
        { 'index': 5, 'name': '谢谢惠顾', 'img':'../../image/5欧代金劵.png'}
      ]
    }
    
    // wx.setStorageSync('awardsConfig', JSON.stringify(awardsConfig))
    that.setData({
      chanceRemain: app.awardsConfig.chance
    })

    // 绘制转盘
    var awardsConfig = app.awardsConfig.awards,
        len = awardsConfig.length,
        rotateDeg = 360 / len / 2 + 90,
        html = [],
        turnNum = 1 / len;  // 文字旋转 turn 值
    var ctx = wx.createContext();
    for (var i = 0; i < len; i++) {
      // 保存当前状态
      ctx.save();
      // 开始一条新路径
      ctx.beginPath();
      // 位移到圆心，下面需要围绕圆心旋转
      ctx.translate(150, 150);
      // 从(0, 0)坐标开始定义一条新的子路径
      ctx.moveTo(0, 0);
      // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
      ctx.rotate((360 / len * i - rotateDeg) * Math.PI/180);
      // 绘制圆弧
      ctx.arc(0, 0, 150, 0,  2 * Math.PI / len, false);

      // 颜色间隔
      if (i % 2 == 0) {
          ctx.setFillStyle('rgba(255,184,32,.1)');
      }else{
          ctx.setFillStyle('rgba(255,203,63,.1)');
      }

      // 填充扇形
      ctx.fill();
      // 绘制边框
      ctx.setLineWidth(0.5);
      ctx.setStrokeStyle('rgba(228,55,14,.1)');
      ctx.stroke();

      // 恢复前一个状态
      ctx.restore();

      // 奖项列表
      html.push({ turn: i * turnNum + 'turn', lineTurn: i * turnNum + turnNum / 2 + 'turn', award: awardsConfig[i].name, img: awardsConfig[i].img });      
    };

    that.setData({
        awardsList: html
      });

    // 对 canvas 支持度太差，换种方式实现
    // wx.drawCanvas({
    //   canvasId: 'lotteryCanvas',
    //   actions: ctx.getActions()
    // })
  }
})
