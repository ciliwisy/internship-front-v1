////
import { View, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { wp, hp, fp } from '@/constants/Adapt';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StalinText } from '@/components/Text';
import { WHITE, GRAY, GRAY_LIGHT, LIGHT} from '@/constants/Colors';

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





/**
 * @author mabohao
 * @time 2025-01-01 13:39
 * @description 首页上面的那个searchbar
*/

// SearchBar 组件
const SearchBar = () => {
  const router = useRouter();

  const styles = StyleSheet.create({
    searchButton: {
      flex: 1,
    },
  
    piSearchContainer: {
      height: hp(64),
      width: wp(600),
      flexDirection: 'row',
      alignItems: 'center',
      marginStart: wp(24),
      paddingHorizontal: wp(16),
      backgroundColor: WHITE,
      borderRadius: wp(24),
    },
  
    searchContent: {
      flex: 1,
      marginStart: wp(8),
      fontSize: fp(14),
      flexShrink: 1,
    },
  
    searchBarWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: hp(8),
    },
  
    searchIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
  
    chatIconContainer: {
      padding: wp(12),
      marginStart: wp(30),
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  
  return (
    <View style={styles.searchBarWrapper}>
      <TouchableOpacity 
        style={styles.searchButton} 
        onPress={() => router.push('/positions/search')}
      >
        <View style={styles.piSearchContainer}>
          <View style={styles.searchIconContainer}>
            <Ionicons 
              name="search-outline" 
              size={hp(40)}
              color={GRAY}
            />
            <StalinText 
              variant="T8" 
              color={GRAY_LIGHT} 
              style={[styles.searchContent, { flexShrink: 1 }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
            >
              搜索职位/公司
            </StalinText>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.chatIconContainer}>
        <Ionicons 
          name="chatbox-outline" 
          size={hp(40)} 
          color={GRAY}
        />
      </TouchableOpacity>
    </View>
  );
};

// RecommendSection 组件
const RecommendSection = () => {

  const styles = StyleSheet.create({
    recommendContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: hp(38),
      paddingHorizontal: wp(24),
    },
  
    recommendText: {
      fontWeight: '600',
      fontSize: fp(16),
    },
  
    filterWrapper: {
      flex: 1,
      alignItems: 'flex-end',
    },
  
    filterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  
    filterItem: {
      width:wp(94),
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: LIGHT,
      borderRadius: wp(10),
      paddingVertical: hp(8),
      paddingHorizontal: wp(12),
      marginStart: wp(12),
    },
  
    filterText: {
      fontSize: fp(12),
    },
  
    filterIcon: {
      width: wp(8),
      height: wp(8),
      marginStart: wp(8),
    },
  });

  return (
    <View style={styles.recommendContainer}>
      <StalinText variant='T7' style={styles.recommendText}>
        推荐
      </StalinText>
      <View style={styles.filterWrapper}>
        <View style={styles.filterContainer}>
          <View style={styles.filterItem}>
            <StalinText variant='T9' style={styles.filterText}>
              长春 
            </StalinText>
            <Image 
              source={require('@/assets/images/展开选项.png')} 
              style={styles.filterIcon}
            />
          </View>
          <View style={styles.filterItem}>
            <StalinText variant='T9' style={styles.filterText}>
              筛选
            </StalinText>
            <Image 
              source={require('@/assets/images/展开选项.png')} 
              style={styles.filterIcon}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

// 主组件
function PISearchBar() {
  const [mark, setMark] = useState<number | null>(null);
  const [keyword, setKeyword] = useState('');
  const params = useLocalSearchParams<{ keyword?: string }>();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (params.keyword) {
      setKeyword(params.keyword);
    }
  }, [params.keyword]);

  const { loading, refetch } = useQuery<QueryResponse>(ReadPosLst, {
    variables: { action: "REFRESH", mark: null, keyword: keyword || undefined },
    onCompleted: (data) => {
      if (data?.readPosLst) {
        if (data.readPosLst.length > 0) {
          const lastItem = data.readPosLst[data.readPosLst.length - 1];
          setMark(lastItem.postTime);
        }
      }
    }
  });

  const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      width: wp(750),
    },
    
    safeArea: {
      flex: 1,
    },
  
    container: {
      flex: 1,
      paddingTop: hp(8),
      paddingHorizontal: wp(28),
    },  
  });


  return (
    <ImageBackground 
      source={require('@/assets/images/bg1.png')}
      style={[styles.backgroundImage, { height: hp(182) + insets.top }]}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <SearchBar />
          <RecommendSection />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}


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

// const exampleJob: JobPositionDTO = {
//   title: "高级前端工程师",
//   organization: "字节跳动",
//   salary: "25-35K",
//   basePrice: "2000",
//   requirements: {
//     gender: "男女不限",
//     education: "本科及以上",
//     ageRange: "25-35岁"
//   },
//   deadline: "2024-02-01",
//   status: "急聘"
// };


export default function Temp() {
  return <PISearchBar />;
}

