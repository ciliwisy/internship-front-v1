import { PositionItemDTO } from '@/pages/positions/position.dto';
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { fp } from '@/utils/adapt';

interface PositionItemProps {
  data: PositionItemDTO;
  onPress?: (position: PositionItemDTO) => void;
}

export const PositionItem: React.FC<PositionItemProps> = ({ data, onPress }) => {
  const formatSalary = (min: number, max: number) => {
    return `${min}-${max}元/月`;
  };

  const formatGender = (gender: string) => {
    switch (gender) {
      case 'male':
        return '男';
      case 'female':
        return '女';
      default:
        return '男女不限';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress?.(data)}
    >
      <View style={styles.header}>
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
        <Text style={styles.basePrice}>
          底价 {data.basePrice}万
        </Text>
        {data.deadline && (
          <Text style={styles.deadline}>
            预计{data.deadline}结束
          </Text>
        )}
        {data.status && (
          <Text style={styles.status}>
            {data.status}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: adaptFontSize(16),
    fontWeight: 'bold',
    color: '#333',
  },
  salary: {
    fontSize: adaptFontSize(14),
    color: '#4A90E2',
    fontWeight: '500',
  },
  organization: {
    fontSize: adaptFontSize(14),
    color: '#666',
    marginBottom: 8,
  },
  requirements: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: adaptFontSize(12),
    color: '#666',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  basePrice: {
    fontSize: adaptFontSize(12),
    color: '#4A90E2',
  },
  deadline: {
    fontSize: adaptFontSize(12),
    color: '#999',
  },
  status: {
    fontSize: adaptFontSize(12),
    color: '#999',
  },
}); 

