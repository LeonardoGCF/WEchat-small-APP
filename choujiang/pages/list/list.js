//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    awardsList: {},
    userInfo: {}
  },
  //事件处理函数
  gotoLottery: function() {
  wx.switchTab({
    url: '../canvas/canvas',
  })
    console.log(0)
  },
  onLoad: function () {
    var that = this
    var list = wx.getStorageSync('winAwards') || {data:[]}

    if (list && list.data && list.data.length > 0) {
      list = list.data
    }else {
      list = []
    }

    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo,
        awardsList: list || []
      })
    })
  },
  onShow:function(){
    var _this=this;
    /**
     * 回到奖品中奖记录时刷新列表
     */
    wx.startPullDownRefresh();
    setTimeout(function(){
      _this.onLoad();  //手动调用onload重新渲染页面
      wx.stopPullDownRefresh();
    },500);
  }
})
