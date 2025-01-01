/**
 * @file Adapt.tsx
 * @description 屏幕适配工具函数
 * @author zhouzhixin
 * @date 2025-01-01 13:39
 *
 * 本文件导出了以下函数:
 * - wp: 宽度适配函数,将设计稿px转换为实际dp
 * - hp: 高度适配函数,将设计稿px转换为实际dp
 * - fp: 字体适配函数,将设计稿字体大小转换为实际字体大小
 *
 * 使用方法:
 * import { wp, hp, fp } from '@/components/Adapt';
 *
 * style={{
 *   width: wp(100),
 *   height: hp(200),
 *   fontSize: fp(16)
 * }}
 */

import { Dimensions, PixelRatio, Platform } from "react-native";

// 设计稿尺寸
const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;

// 获取屏幕尺寸
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

// 获取屏幕像素密度
const pixelRatio = PixelRatio.get();

/**
 * 将 px 转换为适配后的 dp
 * @param size - 设计稿中的尺寸 (px)
 * @returns number - 适配后的尺寸 (dp)
 */
export const wp = (size: number): number => {
  return (screenWidth * size) / DESIGN_WIDTH;
};

/**
 * 将 px 转换为适配后的 dp (基于高度)
 * @param size - 设计稿中的尺寸 (px)
 * @returns number - 适配后的尺寸 (dp)
 */
export const hp = (size: number): number => {
  return (screenHeight * size) / DESIGN_HEIGHT;
};

/**
 * 字体适配方法
 * @param size - 设计稿中的字体大小 (px)
 * @returns number - 适配后的字体大小 (dp)
 */
export const fp = (size: number): number => {
  if (Platform.OS === "ios") {
    return size;
  }
  // Android 需要特殊处理
  if (pixelRatio >= 3) {
    return size * 0.9;
  }
  return size;
};

/**
 * 判断是否是 iPhone X 或更新的机型
 */
export const isIphoneX = (): boolean => {
  const dimen = Dimensions.get("window");
  return (
    Platform.OS === "ios" &&
    !Platform.isPad &&
    !Platform.isTV &&
    (dimen.height === 780 ||
      dimen.width === 780 ||
      dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 844 ||
      dimen.width === 844 ||
      dimen.height === 896 ||
      dimen.width === 896 ||
      dimen.height === 926 ||
      dimen.width === 926)
  );
};

/**
 * 获取状态栏高度
 */
export const getStatusBarHeight = (): number => {
  if (Platform.OS === "ios") {
    return isIphoneX() ? 44 : 20;
  }
  return 0;
};

/**
 * 获取底部安全区域高度
 */
export const getBottomSpace = (): number => {
  return isIphoneX() ? 34 : 0;
};
