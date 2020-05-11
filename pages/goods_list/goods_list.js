
/**
 * 1 用户上滑页面  滚动条触底  开始加载下一页数据
 *    1 找到滚动条触底事件    微信小程序官方文档查找
 *    2 判断还有没有下一页数据
 *      1 获取到总页数    只有总条数
 *          总页数 = Math.ceil( 总条数 / 页容量 )
 *          总页数 = Math.ceil( 23 / 10 ) = 3
 *      2 获取奥当前的页码
 *      3 判断一下  当前的页码是否大于等于  总页数
 *        表示  没有下一页数据
 *    3 加入没有下一页数据  弹出一个提示
 *    4 加入还有下一页数据  来加载下一页数据
 *      1 当前的页码 ++
 *      2 重新发送请求
 *      3 数据请求回来    要对data中的数组  进行  拼接 而不是全部替换！！！！
 *        
 * 
 */

// 0 引入  用来发送请求的  方法   一定要把路径补全
import { request } from "../../request/index.js";

import regeneratorRuntime from "../../lib/runtime/runtime";
// pages/goods_list/goods_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],

    goodsList:[]
  },

  // 接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },

  //总页数
  totalPages:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //
    this.QueryParams.cid = options.cid||"";
    this.QueryParams.query = options.query||"";

    this.getGoodsList();

    // wx.showLoading({
    //   title: '加载中',
    // })
    
    // setTimeout(function () {
    //   wx.hideLoading()
    // }, 5000)
  },

  // 获取商品列表数据
  async getGoodsList(){
    const res = await request({url:"/goods/search",data:this.QueryParams});
    // 获取  总条数
    const total = res.total;
    //计算  总页数
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    //console.log(this.totalPages);
    
    this.setData({
      // 拼接了数组
      goodsList:[...this.data.goodsList,...res.goods]
    })
    
  },

  // 标题点击事件  从子组件传递过来的
  handleTabsItemChange(e){
    // 1 获取被点击的标题索引
    const {index} = e.detail;
    // 2 修改原数组
    let {tabs} = this.data;
    tabs.forEach((v,i) => i === index?v.isActive=true:v.isActive=false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },


  //页面上滑  滚动条触底事件
  onReachBottom(){
    // 1 判断还有没有下一页数据
    if(this.QueryParams.pagenum >= this.totalPages){
      // 没有下一页数据
      // console.log("没有下一页数据");
      wx.showToast({
        title: '没有下一页数据',
      });
    }else{
      // 还有下一页数据
      console.log("还有下一页数据");
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  }

  
})