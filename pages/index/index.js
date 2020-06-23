//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    // 数据区，从服务端拿到的数据
    picUrl: "/images/preview.png",

    tabActive: "方形边框",
    sampleImages: [
      {
        id: 1,
        path: "/images/1-1.png",
        active: true,
      },
      {
        id: 2,
        path: "/images/1-1.png",
        active: false,
      },
      {
        id: 3,
        path: "/images/1-1.png",
        active: false,
      },
      {
        id: 4,
        path: "/images/1-1.png",
        active: false,
      },
    ],
    userAvatarUrl: "",
    ctx: null,
  },
  onLoad: function () {},
  onReady: function () {
    this.getAuth();
    this.drawPrevImage();
  },
  // 初始化全局节点信息，最后调用drawing函数
  drawPrevImage() {
    const ctx = wx.createCanvasContext("main-avatar");
    this.setData({ ctx: ctx });
    ctx.drawImage(this.data.picUrl, 0, 0, 210, 210);
    ctx.draw();
  },
  tabOnChange(event) {
    console.log("tapped");
    console.log(`tab ${event.detail.name} is tapped`);
  },
  chooseSample(event) {
    console.log(event);
    console.log(event.currentTarget.dataset["sampleid"]);
    this.data.ctx.drawImage(this.data.picUrl, 0, 0, 210, 210);
    this.data.ctx.drawImage(this.data.sampleImages[0].path, 0, 0, 210, 210);
    this.data.ctx.draw();
  },
  getAvatar() {
    let ctx = this.data.ctx;
    wx.getUserInfo({
      success: function (res) {
        console.log("getAvatar success");
        var userInfo = res.userInfo;
        var avatarUrl = userInfo.avatarUrl;
        avatarUrl = avatarUrl.slice(0, -3) + "0";
        console.log(avatarUrl);
        wx.downloadFile({
          url: avatarUrl,
          success(downloadRes) {
            console.log("download url success!");
            ctx.drawImage(downloadRes.tempFilePath, 0, 0, 210, 210);
            ctx.draw();
          },
        });
      },
    });
  },
  getAuth() {
    wx.getSetting({
      success(res) {
        console.log("get auth");
        if (!res.authSetting["scope.userInfo"]) {
          wx.authorize({
            scope: "scope.userInfo",
            success() {
              console.log("get userinfo success");
            },
          });
        }
      },
    });
  },
  saveImage() {
    wx.getSetting({
      success(res) {
        if (!res.authSetting["scope.writePhotosAlbum"]) {
          wx.authorize({
            scope: "scope.writePhotosAlbum",
            success() {
              console.log("授权成功");
            },
          });
        }
        
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 210,
          height: 210,
          canvasId: "main-avatar",
          success: function (res) {
            console.log(res.tempFilePath);
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: (res) => {
                wx.showToast({
                  title: '成功保存至相册！',
                  icon: 'success',
                  duration: 1000
                })
                console.log("save success!");
              },
            });
          },
        });
      },
    });
  },
});
