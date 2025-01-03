////
import { View, StyleSheet, Platform, TextInput, TouchableOpacity } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import { useState, useCallback, useEffect } from 'react';
import StalinFlatList from '@/components/FlatList';
import { Text } from 'react-native';
import { GRAY } from '@/constants/Colors';
import { wp, fp } from '@/constants/Adapt';
import { Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

const ReadPosLst = gql`
  query ReadPosLst ($action: GraphQLReqAction!, $adcode: Int $mark: Timestamp, $keyword: String, $startTime: Timestamp, $endTime: Timestamp)  {
    readPosLst(
        readPositionInput: {
            action: $action
            adcode: $adcode
            endTime: $endTime
            keyword: $keyword
            mark: $mark
            startTime: $startTime
        }
    ) {
        adcode
        address
        ageMax
        ageMin
        certs
        desc
        edu
        endTime
        gender
        id
        institutionId
        postTime
        posterId
        price
        quota
        salaryMax
        salaryMin
        status
        sum
        title
        types
        welfare
        institution {
            name
        }
    }
}
`;

export interface JobPositionDTO {
    id: number;
    title: string;           
    organization: {          // 对应 institution.name
        name: string;
    };    
    salaryMin: number;      
    salaryMax: number;      
    price: number;          // 底价
    requirements: {
        gender: number;     // 性别代码
        education: number;  // 学历代码
        ageMin?: number;   
        ageMax?: number;
        certs?: number[];  // 证书要求
    };
    address: string[];     // 工作地点
    quota: number;         // 名额
    sum: number;          // 已报名人数
    status: string;       // 职位状态
    endTime: number;      // 截止时间
    postTime: number;     // 发布时间
    desc?: string;        // 职位描述
    types: number[];      // 职位类型
    welfare: string[];    // 福利待遇
    posterId: string;     // 发布者ID
    institutionId: number; // 机构ID
}

interface QueryResponse {
  readPosLst: JobPositionDTO[];
}

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


// export const JobItem: React.FC<JobPositionDTO> = ({
//   title,
//   organization,
//   salary,
//   basePrice,
//   requirements,
//   deadline,
//   status
// }) => {
//   return (
//     <View style={styles.itemContainer}>
//       <View style={styles.row}>
//         <StainText variant="body">{title}</StainText>
//         <StainText variant="body" color={BLUE_LINK}>{salary}</StainText>
//       </View>

//       <View style={styles.row}>
//         <StainText variant="body" color={GRAY}>{organization}</StainText>
//         <StainText variant="body" color={BLUE_LINK}>底价 {basePrice}</StainText>
//       </View>

//       <View style={styles.requirementsRow}>
//         <StainText variant="caption" color={GRAY}>{requirements.gender || '男女不限'}</StainText>
//         <StainText variant="caption" color={GRAY}>{requirements.education}</StainText>
//         <StainText variant="caption" color={GRAY}>{requirements.ageRange}</StainText>
//         {status && <StainText variant="caption" color={GRAY}>{status}</StainText>}
//       </View>
//     </View>
//   );
// };


export default function ExampleJobItem(){

  const [mark, setMark] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [positions, setPositions] = useState<JobPositionDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const router = useRouter();
  const params = useLocalSearchParams<{ keyword?: string }>();
  
  // 监听路由参数变化，当有关键词时执行搜索
  useEffect(() => {
    if (params.keyword) {
      setKeyword(params.keyword);
      handleRefresh(params.keyword);
    }
  }, [params.keyword]);

  const { loading, refetch } = useQuery<QueryResponse>(ReadPosLst, {
    variables: { action: "REFRESH", mark: null, keyword: keyword || undefined },
    onCompleted: (data) => {
      setError(null);
      if (data?.readPosLst) {
        setPositions(data.readPosLst);
        if (data.readPosLst.length > 0) {
          const lastItem = data.readPosLst[data.readPosLst.length - 1];
          setMark(lastItem.postTime);
        }
      }
    },
    onError: (error) => {
      setError(error.message);
      //setPositions([]);
    }
  });

  const handleRefresh = async (searchKeyword?: string) => {
    try {
      setError(null);
      setHasMore(true);
      const result = await refetch({ 
        action: "REFRESH", 
        mark: null,
        keyword: searchKeyword || keyword || undefined 
      });
      if (result.data?.readPosLst) {
        setPositions(result.data.readPosLst);
        if (result.data.readPosLst.length > 0) {
          const lastItem = result.data.readPosLst[result.data.readPosLst.length - 1];
          setMark(lastItem.postTime);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '刷新失败');
    }
  };


  const handleLoadMore = async () => {
    if (!hasMore || !mark) return;
    
    try {
      const result = await refetch({ 
        action: "FILL", 
        mark,
        keyword: keyword || undefined 
      });
      if (!result.data?.readPosLst?.length) {
        setHasMore(false);
        return;
      }

      setPositions(prev => [...prev, ...result.data.readPosLst]);
      const lastItem = result.data.readPosLst[result.data.readPosLst.length - 1];
      setMark(lastItem.postTime);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载更多失败');
    }
  };

  const handleSearch = useCallback(() => {
    handleRefresh();
  }, [keyword]);

  const renderItem = ({ item }: { item: JobPositionDTO }) => (
    <View style={styles.itemContainer}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{item.title || '无标题'}</Text>
          <Text style={styles.salary}>
            ¥{(item.salaryMin || 0)/1000}k-{(item.salaryMax || 0)/1000}k
          </Text>
        </View>
        <Text style={styles.institutionName}>
          {item.institution?.name || '未知机构'}
        </Text>
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>地址：</Text>
          <Text style={styles.infoValue}>
            {item.address?.length ? item.address.join(' ') : '地址未知'}
          </Text>
        </View>
        
        {(item.ageMin || item.ageMax) && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>年龄：</Text>
            <Text style={styles.infoValue}>
              {item.ageMin ? `${item.ageMin}岁` : '不限'} - 
              {item.ageMax ? `${item.ageMax}岁` : '不限'}
            </Text>
          </View>
        )}
        
        {item.edu !== undefined && item.edu !== null && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>学历：</Text>
            <Text style={styles.infoValue}>
              {['不限', '小学', '初中', '高中', '大专', '本科', '硕士', '博士'][item.edu] || '未知'}
            </Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>名额：</Text>
          <Text style={styles.infoValue}>{item.quota || 0}人</Text>
        </View>
      </View>

      {item.welfare?.length > 0 && (
        <View style={styles.welfareContainer}>
          {item.welfare.map((benefit, index) => (
            <View key={index} style={styles.welfareTag}>
              <Text style={styles.welfareText}>{benefit}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.time}>
          发布时间：{item.postTime ? new Date(item.postTime).toLocaleDateString() : '未知'}
        </Text>
      </View>
    </View>
  );

  const ErrorComponent = useCallback(() => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <Button 
        title="重试" 
        onPress={handleRefresh}
      />
    </View>
  ), [error]);



  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.searchInputContainer}
          onPress={() => router.push('/positions/search')}
        >
          <Ionicons name="search-outline" size={20} color={GRAY} style={styles.searchIcon} />
          <Text style={[styles.searchInput, { color: GRAY }]}>
            {keyword || '搜索职位/公司'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {Platform.OS === 'web' && (
        <View style={styles.webRefreshContainer}>
          <Button 
            title="刷新数据" 
            onPress={handleRefresh}
          />
        </View>
      )}
      <StalinFlatList
        data={positions}
        renderItem={renderItem}
        onRefresh={Platform.OS !== 'web' ? handleRefresh : undefined}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        contentContainerStyle={styles.listContainer}
        EmptyComponent={error ? <ErrorComponent /> : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    paddingHorizontal: wp(16),
    paddingVertical: wp(8),
    backgroundColor: '#fff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: wp(8),
    paddingHorizontal: wp(12),
    height: wp(40),
  },
  searchIcon: {
    marginRight: wp(8),
  },
  searchInput: {
    flex: 1,
    fontSize: fp(16),
    color: '#333',
    padding: 0,
  },
  listContainer: {
    padding: wp(16),
  },
  itemContainer: {
    padding: wp(16),
    backgroundColor: '#fff',
    borderRadius: wp(8),
    marginBottom: wp(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: wp(8),
  },
  institutionName: {
    fontSize: fp(16),
    fontWeight: 'bold',
  },
  time: {
    fontSize: fp(12),
    color: GRAY,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  id: {
    fontSize: fp(14),
    color: GRAY,
  },
  status: {
    fontSize: fp(14),
    color: GRAY,
  },
  webRefreshContainer: {
    padding: wp(16),
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(16),
  },
  errorText: {
    fontSize: fp(14),
    color: 'red',
    marginBottom: wp(16),
    textAlign: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: wp(4),
  },
  title: {
    fontSize: fp(18),
    fontWeight: 'bold',
  },
  salary: {
    fontSize: fp(16),
    color: '#ff4d4f',
    fontWeight: 'bold',
  },
  infoContainer: {
    marginVertical: wp(12),
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: wp(4),
  },
  infoLabel: {
    fontSize: fp(14),
    color: GRAY,
    width: wp(60),
  },
  infoValue: {
    fontSize: fp(14),
    flex: 1,
  },
  welfareContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: wp(12),
  },
  welfareTag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: wp(8),
    paddingVertical: wp(4),
    borderRadius: wp(4),
    marginRight: wp(8),
    marginBottom: wp(8),
  },
  welfareText: {
    fontSize: fp(12),
    color: GRAY,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
    paddingTop: wp(12),
  },
});



// export default function PositionsScreen() {
//   return (
//     <ScrollView style={{ backgroundColor: BACKGROUND_GRAY }}>
//       {/* Add JobItem components here with actual data */}
//     </ScrollView>
//   );
// }


// const styles = StyleSheet.create({
//   itemContainer: {
//     backgroundColor: WHITE,
//     padding: wp(20),
//     marginBottom: wp(10),
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: wp(10),
//   },
//   requirementsRow: {
//     flexDirection: 'row',
//     gap: wp(15),
//   },
// });