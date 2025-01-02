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
 *   - body: 正文文本,16号字体
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
