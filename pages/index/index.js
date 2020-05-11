
// 0 引入  用来发送请求的  方法   一定要把路径补全
import { request } from "../../request/index.js";

//Page Object
Page({
  data: {
    // 轮播图数组
    swiperList:[],
    // 导航  数组
    catesList:[],
    // 楼层 数组
    floorList:[]
  },


  // 页面开始加载  就会触发
  onLoad: function(options){
    // 1 发送异步请求获取轮播图数据     优化的手段可以通过es6的  promise来解决这个问题
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result)=>{
    //     console.log(result);
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   }
    // });

    // promise  优化代码
    // 获取轮播图数据
    this.getSwiperList();

    // 获取  分类导航数据
    this.getCatesList();

    // 获取 楼层数据
    this.getFloorList();

  },
  
  // 获取轮播图数据
  getSwiperList(){
    request({url:"/home/swiperdata"})
    .then(result=>{
      this.setData({
        swiperList:result
      })
    })
  },

  // 获取  分类导航数据
  getCatesList(){
    request({url:"/home/catitems"})
    .then(result=>{
      this.setData({
        catesList:result
      })
    })
  },

  // 获取 楼层数据
  getFloorList(){
    request({url:"/home/floordata"})
    .then(result=>{

      const that = this;

      //console.log(this.result.product_list.navigator_url);
      this.setData({
        floorList:result,
      });

      let {floorList} = that.data;
      floorList.forEach((v,i) => {
        // 截取product_list 的字符串
        let product_list = floorList[i].product_list;
        product_list.forEach((v2,i2)=>{
          const url = 'floorList[' + i +'].product_list[' + i2 + '].navigator_url';
          const newUrl = product_list[i2].navigator_url.substring(24, product_list[i2].navigator_url.length);
          that.setData({
            [url]:newUrl
          });
        });
      });

    });

  },

  
});