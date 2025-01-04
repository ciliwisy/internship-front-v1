import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { JobPositionDTO } from '.';
import { StalinText } from '@/components/Text';
import { fp, wp } from '@/constants/Adapt';
import { BACKGROUND_GRAY, GRAY, GRAY_LIGHTER, PRIMARY_BLUE, WHITE } from '@/constants/Colors';

export const PositionItem: React.FC<JobPositionDTO & {
  onPress?: () => void;
}> = ({
  title,
  organization,
  salary,
  basePrice,
  requirements,
  deadline,
  status,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <StalinText variant="T5" style={styles.title}>{title}</StalinText>
        <StalinText variant="T6" style={styles.salary}>{salary}元/月</StalinText>
      </View>
      <View style={styles.infoContainer}>
        <StalinText variant="T8" style={styles.company}>{organization}</StalinText>
        <View style={styles.basePriceContainer}>
          <StalinText variant="T8" style={styles.basePrice}>底价</StalinText>
          <StalinText variant="T6" style={styles.basePriceNumber}>{basePrice}万</StalinText>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.tagContainer}>
          <View style={styles.tag}>
            <StalinText variant="T9" style={styles.tagText}>{requirements.gender}</StalinText>
          </View>
          <View style={styles.tag}>
            <StalinText variant="T9" style={styles.tagText}>{requirements.education}</StalinText>
          </View>
          <View style={styles.tag}>
            <StalinText variant="T9" style={styles.tagText}>{requirements.ageRange}</StalinText>
          </View>
        </View>
        <StalinText variant="T9" style={styles.time}>{deadline}</StalinText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(718),
    height: wp(210),
    padding: wp(30),
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginHorizontal: wp(16),
    marginVertical: wp(8),
    borderRadius: wp(16),
    backgroundColor: WHITE,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: fp(16),
    fontWeight: '500',
  },
  salary: {
    fontSize: fp(16),
    fontWeight: '600',
    color: PRIMARY_BLUE,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: wp(8),
  },
  tagContainer: {
    flexDirection: 'row',
    gap: wp(8),
  },
  tag: {
    paddingHorizontal: wp(8),
    paddingVertical: wp(4),
    borderRadius: wp(8),
    backgroundColor: BACKGROUND_GRAY,
  },
  tagText: {
    fontSize: fp(12),
    color: GRAY,
  },
  basePrice: {
    fontSize: fp(12),
    justifyContent: 'flex-end',
  },
  basePriceNumber: {
    fontSize: fp(12),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    color: PRIMARY_BLUE,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  company: {
    fontSize: fp(14),
    color: GRAY,
    flex: 1,
  },
  time: {
    fontSize: fp(12),
    color: GRAY_LIGHTER,
  },
  basePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
  },
});
