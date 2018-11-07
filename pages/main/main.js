// pages/main/main.js
var QR = require("../../utils/qrcode.js");  //QRCode.js 是一个用于生成二维码图片的插件。
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskHidden:true,    //遮罩层
    canvasHidden:false, //二维码画布层
    placeholder:'http://wxapp-union.com',  //默认二维码生成文本
    imagePath:'',
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //页面初始化：生成初始二维码
    var size=this.setCanvasSize();  //动态设置画布大小
    var initUrl=this.data.placeholder;  //设置初始网址
    this.createQrCode(initUrl,"mycanvas",size.w,size.h);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //自定义函数
  
  //适配不同屏幕的canvas
  setCanvasSize:function(){
    var size={};  //用来存储画布的长宽
    try{
      var res=wx.getSystemInfoSync();   //获取系统信息
      var scale = 750 / 686;  //不同屏幕下canvas的适配比例；设计稿是750宽
      var width=res.windowWidth/scale;
      var height=width; //正方形画布
      size.w=width;
      size.h=height;
    }catch(e){
      console.log('获取设备信息失败！');
    }
    return size;
  },
  //绘制二维码图片并存储
  createQrCode:function(url,canvasId,cavW,cavH){
    QR.api.draw(url, canvasId, cavW, cavH);
    //调用canvasToTempImage自定义函数，将临时缓存照片路径存入data中
    setTimeout(()=>{
      this.canvasToTempImage();
    },1000);
  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage:function(){
    var that=this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success:function(res){
        var tempFilePath = res.tempFilePath //生成文件的临时路径
        console.log(tempFilePath);
        that.setData({
          imagePath:tempFilePath,
        })
      },
      fail:function(res){
        console.log(res);
      }
    });
  },

  //提交“生成二维码”时间
  formSubmit:function(e){
    var that=this;
    var url=e.detail.value.url;
    wx.showToast({
      title: '生成中',
      icon:'loading',
      duration:1000,
      mask:true,
    })
    var st=setTimeout(function(){
      wx.hideToast();
      var size = that.setCanvasSize();
      that.createQrCode(url,'mycanvas',size.w,size.h);
      clearTimeout(st);
    },1000)
  },


})