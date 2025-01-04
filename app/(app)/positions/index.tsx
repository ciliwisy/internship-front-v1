////
import { View, StyleSheet, Platform, TextInput, TouchableOpacity, Image } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import React, { useState, useCallback, useEffect } from 'react';
import StalinFlatList from '@/components/FlatList';
import { wp, hp, fp } from '@/constants/Adapt';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
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

function PISearchBar() {

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
      // handleRefresh(params.keyword);
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

  return (
    <View>
      <View style={styles.searchBarWrapper}>
        <TouchableOpacity onPress={() => router.push('/positions/search')}>
          <View style={styles.piSearchContainer}>
            <View style={styles.searchIconContainer}>
              <Ionicons name="search-outline" size={wp(40)} color={GRAY}/>
              <StalinText variant="T8" color={GRAY_LIGHT} style={styles.searchContent}>
                搜索职位/公司
              </StalinText>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.chatIconContainer}>
          <Ionicons name="chatbox-outline" size={wp(40)} color={GRAY}/>
        </View>
      </View>
      
      <View style={styles.recommendContainer}>
        <StalinText variant='T7' style={styles.recommendText}>
          推荐
        </StalinText>
        <View>
          <View style={styles.filterContainer}>
            <View style={styles.filterItem}>
              <StalinText variant='T9'>
                长春 
              </StalinText>
              <Image 
                source={require('@/assets/images/展开选项.png')} 
                style={{ width: wp(8), height: wp(8), marginStart: wp(12), marginTop: hp(15)}}
              />
            </View>
            <View style={styles.filterItem}>
              <StalinText variant='T9'>
                筛选
              </StalinText>
              <Image 
                source={require('@/assets/images/展开选项.png')} 
                style={{ width: wp(8), height: wp(8), marginStart: wp(12), marginTop: hp(15)}}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
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
  return <SafeAreaView>
    <PISearchBar />
  </SafeAreaView>
}

const styles = StyleSheet.create({
  piSearchContainer: {
    width: wp(620),
    height: wp(64),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(12),
    marginStart: wp(28),
    paddingStart: wp(14),
    backgroundColor: WHITE,
    borderRadius: wp(20),
  },
  searchContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  locationText: {
    backgroundColor: WHITE, 
    marginEnd: wp(70), 
    width: wp(94), 
    height: hp(50),
    borderRadius: wp(20),
    paddingStart: wp(16),
    alignContent: 'center',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignContent: 'center'
  },
  searchIconContainer: {
    backgroundColor: WHITE,
    flexDirection: 'row',
    alignItems: 'center'
  },
  chatIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: wp(30),
    marginTop: hp(12)
  },
  recommendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(38)
  },
  recommendText: {
    marginTop: hp(38),
    marginStart: wp(36),
    marginEnd: wp(328)
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(43)
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,///背景颜色重复 先用WHITE测试 改成LIGHT
    borderRadius: wp(20),
    width: wp(94),
    height: hp(50),
    marginEnd: wp(46),
    paddingStart: wp(16)
  }
});