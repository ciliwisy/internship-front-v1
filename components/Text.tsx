/**
 * @author zhouzhixin
 * @date 2025-1-1 21:51
 * 文本组件
 *
 * @component
 * @description 一个可定制的文本组件,支持不同的变体样式和颜色
 *
 * @prop {React.ReactNode} children - 子元素内容
 * @prop {TextStyle | TextStyle[]} style - 自定义样式
 * @prop {'header' | 'body' | 'caption'} variant - 文本变体类型
 *   - header: 标题文本,24号字体,加粗
 *   - b晋6ody: 正文文本,16号字体
 *   - caption: 说明文本,12号字体,灰色
 * @prop {string} color - 自定义文本颜色
 */

import { fp } from "@/constants/Adapt";
import { GRAY } from "@/constants/Colors";
import React from "react";
import { Text as RNText, TextStyle, TextProps } from "react-native";

interface StalinTextProps extends TextProps {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
  variant?: "header" | "body" | "caption";
  color?: string;
}

const defaultStyles = {
  header: {
    fontSize: fp(24),
    fontWeight: "bold",
  },
  body: {
    fontSize: fp(16),
  },
  caption: {
    fontSize: fp(12),
    color: GRAY,
  },
  
  T0: {
    fontSize: fp(62),///订单上方支付金额（大）
  },
  T1: {
    fontSize: fp(56),///我的优惠券金额数字
  },
  T2: {
    fontSize: fp(42),///填写服务未填写金额显示
  },
  T3: {
    fontSize: fp(40),///投递详情“去加价”我的界面收入金额“数字”
  },
  T4: {
    fontSize: fp(36),///订单下方支付金额（小）  选择优惠券优惠券、有效期  金额我的界面用户名字
  },
  T5: { ///首页岗位名字  投递详情岗位名字  订单支付题头“订单”  选择优惠券优惠券名字  我的优惠券优惠券名字  我的优惠券金额单位  我的界面求职客服名字
    fontSize: fp(30),
  },
  T6: { ///订单支付“立即支付”
    fontSize: fp(28),
  },
  T7:{///首页“推荐”  投递详情金额、截止时间、“实时排名”  订单内容  订单支付小标题下内容
    fontSize: fp(26),
  },
  T8:{///首页岗位单位名字、“底价”  投递详情岗位单位、备注、实时排名内容、“申请退款”“如有帮助...”  “请填写金额”  订单支付协议确认 “预估付费后排名...”  我的优惠券有效期、门槛  选择优惠券门槛
    fontSize: fp(24),
  },
  T9: {///首页“筛选”、岗位备注  投递详情“我的排名”“剩余名额”“候补人数”“已为您发起...”  出价备注  订单支付“备注”、展示小标题  我的界面功能名称、收入“累计收入”“未入账”  “暂无优惠券” 
    fontSize: fp(22),
  },
  T10: {
    fontSize: fp(20),///我的优惠券优惠券备注
  },


  bottomBar: {
    fontSize: fp(18),
  },

};

export const StainText: React.FC<StalinTextProps> = ({
  children,
  style,
  variant = "body",
  color,
  ...props
}) => {
  return (
    <RNText
      style={[defaultStyles[variant], color && { color }, style]}
      {...props}
    >
      {children}
    </RNText>
  );
};
