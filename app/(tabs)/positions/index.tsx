import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { StainText } from '@/components/Text';

import { wp, fp } from '@/constants/Adapt';
import { BACKGROUND_GRAY, BLUE_LINK, GRAY, WHITE } from '@/constants/Colors';


export interface JobPositionDTO {
    title: string;           // 职位名称
    organization: string;    // 机构名称
    salary: string;         // 薪资范围
    basePrice: string;      // 底价
    requirements: {
      gender?: '男' | '女' | '男女不限';
      education: string;
      ageRange: string;    // 例如: "18-35岁"
    };
    deadline?: string;     // 截止时间
    status?: string;       // 例如: "名额候补中"
  }


export const JobItem: React.FC<JobPositionDTO> = ({
  title,
  organization,
  salary,
  basePrice,
  requirements,
  deadline,
  status
}) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.row}>
        <StainText variant="body">{title}</StainText>
        <StainText variant="body" color={BLUE_LINK}>{salary}</StainText>
      </View>

      <View style={styles.row}>
        <StainText variant="body" color={GRAY}>{organization}</StainText>
        <StainText variant="body" color={BLUE_LINK}>底价 {basePrice}</StainText>
      </View>

      <View style={styles.requirementsRow}>
        <StainText variant="caption" color={GRAY}>{requirements.gender || '男女不限'}</StainText>
        <StainText variant="caption" color={GRAY}>{requirements.education}</StainText>
        <StainText variant="caption" color={GRAY}>{requirements.ageRange}</StainText>
        {status && <StainText variant="caption" color={GRAY}>{status}</StainText>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: WHITE,
    padding: wp(20),
    marginBottom: wp(10),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: wp(10),
  },
  requirementsRow: {
    flexDirection: 'row',
    gap: wp(15),
  },
});


const exampleJob: JobPositionDTO = {
  title: "高级前端工程师",
  organization: "字节跳动",
  salary: "25-35K",
  basePrice: "2000",
  requirements: {
    gender: "男女不限",
    education: "本科及以上",
    ageRange: "25-35岁"
  },
  deadline: "2024-02-01",
  status: "急聘"
};

export const ExampleJobItem = () => (
  <JobItem {...exampleJob} />
);


// export default function PositionsScreen() {
//   return (
//     <ScrollView style={{ backgroundColor: BACKGROUND_GRAY }}>
//       {/* Add JobItem components here with actual data */}
//     </ScrollView>
//   );
// }


