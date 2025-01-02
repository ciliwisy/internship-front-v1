/**
 * @author zhouzhixin
 * @date 2025-1-2 08:07
 *
 * @component
 * @description 微信SDK的封装,提供微信支付、分享、登录等功能
 * 
 * @function init - 初始化微信SDK
 * @param {string} appId - 微信开放平台申请的应用ID
 * @returns {Promise<boolean>} 初始化是否成功
 * 
 * @function isWXAppInstalled - 检查微信是否已安装
 * @returns {Promise<boolean>} 是否已安装微信
 * 
 * @function shareText - 分享文本到微信
 * @param {string} text - 要分享的文本内容
 * @param {number} [scene=0] - 分享场景(0:会话 1:朋友圈 2:收藏)
 * @returns {Promise<void>}
 * 
 * @function shareImage - 分享图片到微信
 * @param {string} imageUrl - 图片URL地址
 * @param {number} [scene=0] - 分享场景(0:会话 1:朋友圈 2:收藏) 
 * @returns {Promise<void>}
 * 
 * @function shareWebpage - 分享网页到微信
 * @param {object} params - 分享参数
 * @param {string} params.title - 网页标题
 * @param {string} params.description - 网页描述
 * @param {string} params.thumbImageUrl - 缩略图URL
 * @param {string} params.webpageUrl - 网页链接地址
 * @param {number} [params.scene=0] - 分享场景(0:会话 1:朋友圈 2:收藏)
 * @returns {Promise<void>}
 * 
 * @function pay - 发起微信支付
 * @param {object} params - 支付参数
 * @param {string} params.partnerId - 商户号
 * @param {string} params.prepayId - 预支付交易会话ID
 * @param {string} params.nonceStr - 随机字符串
 * @param {string} params.timeStamp - 时间戳
 * @param {string} params.package - 扩展字段
 * @param {string} params.sign - 签名
 * @returns {Promise<object>} 支付结果
 * 
 * @function login - 微信登录
 * @param {string} scope - 应用授权作用域
 * @param {string} state - 用于保持请求和回调的状态
 * @returns {Promise<object>} 登录结果
 * 
 */







import * as WeChat from "react-native-wechat-lib";

class WeChatService {
  static async init(appId: string) {
    try {
      await WeChat.registerApp(appId, "universalLink"); // iOS universal link
      return true;
    } catch (e) {
      console.error("WeChat init error:", e);
      return false;
    }
  }

  static async isWXAppInstalled() {
    try {
      return await WeChat.isWXAppInstalled();
    } catch (e) {
      console.error("Check WX installed error:", e);
      return false;
    }
  }

  static async shareText(text: string, scene: number = 0) {
    try {
      return await WeChat.shareText({
        text,
        scene, // 0: 会话 1: 朋友圈 2: 收藏
      });
    } catch (e) {
      console.error("Share text error:", e);
      throw e;
    }
  }

  static async shareImage(imageUrl: string, scene: number = 0) {
    try {
      return await WeChat.shareImage({
        imageUrl,
        scene,
      });
    } catch (e) {
      console.error("Share image error:", e);
      throw e;
    }
  }

  static async shareWebpage({
    title,
    description,
    thumbImageUrl,
    webpageUrl,
    scene = 0,
  }: {
    title: string;
    description: string;
    thumbImageUrl: string;
    webpageUrl: string;
    scene?: number;
  }) {
    try {
      return await WeChat.shareWebpage({
        title,
        description,
        thumbImageUrl,
        webpageUrl,
        scene,
      });
    } catch (e) {
      console.error("Share webpage error:", e);
      throw e;
    }
  }

  static async pay({
    partnerId,
    prepayId,
    nonceStr,
    timeStamp,
    package: pkg,
    sign,
  }: {
    partnerId: string;
    prepayId: string;
    nonceStr: string;
    timeStamp: string;
    package: string;
    sign: string;
  }) {
    try {
      return await WeChat.pay({
        partnerId,
        prepayId,
        nonceStr,
        timeStamp,
        package: pkg,
        sign,
      });
    } catch (e) {
      console.error("WeChat pay error:", e);
      throw e;
    }
  }

  static async login() {
    try {
      // 登录需要认证的应用才可以使用
      const scope = "snsapi_userinfo";
      const state = "wechat_sdk_demo";
      return await WeChat.sendAuthRequest(scope, state);
    } catch (e) {
      console.error("WeChat login error:", e);
      throw e;
    }
  }
}

export default WeChatService;
