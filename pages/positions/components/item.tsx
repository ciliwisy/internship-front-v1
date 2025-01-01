/**
 * @file PositionItem.tsx
 * @description 职位列表项组件，用于展示职位的基本信息，包括职位名称、薪资、机构名称等
 * @author zhouzhixin
 * @date 2025-01-01 13:39
 *
 * @component
 * @param {object} props
 * @param {PositionMetaDTO} props.data - 职位数据对象，包含职位的详细信息
 * @param {function} [props.onPress] - 点击事件回调函数，参数为职位数据对象
 *
 * @example
 * <PositionItem
 *   data={positionData}
 *   onPress={(position) => handlePositionPress(position)}
 * />
 */

import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { PositionMetaDTO } from "../dto/position.meta.dto";
import { fp, wp } from "@/utils/adapt";
import {
  PRIMARY_BLUE,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  BACKGROUND_WHITE,
  BACKGROUND_LIGHT,
} from "@/constants/Colors";

interface PositionItemProps {
  data: PositionMetaDTO;
  onPress?: (position: PositionMetaDTO) => void;
}

export const PositionItem: React.FC<PositionItemProps> = ({
  data,
  onPress,
}) => {
  const formatSalary = (min: number, max: number) => {
    return `${min}-${max}元/月`;
  };

  const formatGender = (gender: string) => {
    switch (gender) {
      case "male":
        return "男";
      case "female":
        return "女";
      default:
        return "男女不限";
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress?.(data)}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.salary}>
          {formatSalary(data.salary.min, data.salary.max)}
        </Text>
      </View>

      <Text style={styles.organization}>{data.organization}</Text>

      <View style={styles.requirements}>
        <Text style={styles.requirementText}>
          {formatGender(data.requirements.gender)}
        </Text>
        <Text style={styles.requirementText}>
          {data.requirements.education}
        </Text>
        <Text style={styles.requirementText}>
          {`${data.requirements.ageRange.min}-${data.requirements.ageRange.max}岁`}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.basePrice}>底价 {data.basePrice}万</Text>
        {data.deadline && (
          <Text style={styles.deadline}>预计{data.deadline}结束</Text>
        )}
        {data.status && <Text style={styles.status}>{data.status}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_WHITE,
    padding: wp(16),
    borderRadius: wp(8),
    marginBottom: wp(8),
  },
  title: {
    fontSize: fp(16),
    fontWeight: "bold",
    color: TEXT_PRIMARY,
  },
  salary: {
    fontSize: fp(14),
    color: PRIMARY_BLUE,
    fontWeight: "500",
  },
  organization: {
    fontSize: fp(14),
    color: TEXT_SECONDARY,
    marginBottom: wp(8),
  },
  requirements: {
    flexDirection: "row",
    marginBottom: wp(8),
  },
  requirementText: {
    fontSize: fp(12),
    color: TEXT_SECONDARY,
    backgroundColor: BACKGROUND_LIGHT,
    paddingHorizontal: wp(8),
    paddingVertical: wp(4),
    borderRadius: wp(4),
    marginRight: wp(8),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  basePrice: {
    fontSize: fp(12),
    color: PRIMARY_BLUE,
  },
  deadline: {
    fontSize: fp(12),
    color: TEXT_TERTIARY,
  },
  status: {
    fontSize: fp(12),
    color: TEXT_TERTIARY,
  },
});
