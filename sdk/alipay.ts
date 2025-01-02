/**
 * @author zhouzhixin
 * @date 2025-1-2 08:07
 * 支付宝SDK
 *
 * @component
 * @description 支付宝SDK的封装,提供支付宝支付、登录等功能
 *
 * 
 * @function pay - 发起支付宝支付
 * @param {string} orderInfo - 从服务端获取的支付字符串,包含商户的订单信息
 * @returns {Promise<object>} 支付结果,包含success、message和原始支付结果数据
 * 
 */

import Alipay from "@uiw/react-native-alipay";

class AlipayService {
  /**
   * 支付宝支付
   * @param orderInfo 从服务端获取的支付字符串
   * @returns Promise<支付结果>
   */
  static async pay(orderInfo: string) {
    try {
      const result = await Alipay.alipay(orderInfo);
      
      // 支付结果解析
      switch (result.resultStatus) {
        case '9000': // 支付成功
          return {
            success: true,
            message: '支付成功',
            data: result
          };
        case '8000': // 正在处理中
          return {
            success: false,
            message: '支付处理中',
            data: result
          };
        case '4000': // 订单支付失败
          return {
            success: false,
            message: '支付失败',
            data: result
          };
        case '5000': // 重复请求
          return {
            success: false,
            message: '重复请求',
            data: result
          };
        case '6001': // 用户中途取消
          return {
            success: false,
            message: '已取消支付',
            data: result
          };
        case '6002': // 网络连接出错
          return {
            success: false,
            message: '网络连接出错',
            data: result
          };
        default:
          return {
            success: false,
            message: '未知错误',
            data: result
          };
      }
    } catch (error) {
      console.error('Alipay error:', error);
      throw error;
    }
  }

  /**
   * 获取支付宝认证信息
   */
  static async authInfo(authInfoStr: string) {
    try {
      return await Alipay.authInfo(authInfoStr);
    } catch (error) {
      console.error('Alipay auth error:', error);
      throw error;
    }
  }
}

export default AlipayService;
