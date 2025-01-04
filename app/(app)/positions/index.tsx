////
import { View, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { wp, hp, fp } from '@/constants/Adapt';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StalinText } from '@/components/Text';
import { WHITE, GRAY, GRAY_LIGHT, LIGHT, GRAY_LIGHTER, PRIMARY_BLUE, BACKGROUND_GRAY} from '@/constants/Colors';
import StalinFlatList from '@/components/FlatList';

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

//item组件
const PositionItem: React.FC<JobPositionDTO & {
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
    <TouchableOpacity style={styles.container2} onPress={onPress}>
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
          // setMark(lastItem.postTime);
          // setMark(lastItem.postTime);
        }
      }
    }
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
  title: string;           // 职位名称
  organization: string;    // 机构名称
  salary: string;         // 薪资范围
  basePrice: string;      // 底价
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
    gender?: '男' | '女' | '男女不限';
    education: string;
    ageRange: string;    // 例如: "18-35岁"
  };
  deadline?: string;     // 截止时间
  status?: string;       // 例如: "名额候补中"
}

interface QueryResponse {
  readPosLst: JobPositionDTO[];
}

const exampleJobs: JobPositionDTO[] = [
  {
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
  },
  {
    title: "资深后端工程师",
    organization: "阿里巴巴",
    salary: "30-45K",
    basePrice: "2500",
    requirements: {
      gender: "男女不限",
      education: "本科及以上",
      ageRange: "25-40岁"
    },
    deadline: "2024-02-15",
    status: "在招"
  },
  {
    title: "产品经理",
    organization: "腾讯",
    salary: "20-35K",
    basePrice: "1800",
    requirements: {
      gender: "男女不限",
      education: "本科及以上",
      ageRange: "24-35岁"
    },
    deadline: "2024-02-10",
    status: "在招"
  }
];
const exampleJobs: JobPositionDTO[] = [
  {
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
  },
  {
    title: "资深后端工程师",
    organization: "阿里巴巴",
    salary: "30-45K",
    basePrice: "2500",
    requirements: {
      gender: "男女不限",
      education: "本科及以上",
      ageRange: "25-40岁"
    },
    deadline: "2024-02-15",
    status: "在招"
  },
  {
    title: "产品经理",
    organization: "腾讯",
    salary: "20-35K",
    basePrice: "1800",
    requirements: {
      gender: "男女不限",
      education: "本科及以上",
      ageRange: "24-35岁"
    },
    deadline: "2024-02-10",
    status: "在招"
  }
];

export default function Temp() {
  return (
    <View style={{ flex: 1 }}>
      <PISearchBar />
      <StalinFlatList
        style={{ flex: 1 }}
        data={exampleJobs}
        renderItem={({ item }) => <PositionItem {...item} />}
      />
    </View>
  );
  return (
    <View style={{ flex: 1 }}>
      <PISearchBar />
      <StalinFlatList
        style={{ flex: 1 }}
        data={exampleJobs}
        renderItem={({ item }) => <PositionItem {...item} />}
      />
    </View>
  );
}

// 将所有样式统一放在文件底部
const styles = StyleSheet.create({
  // SearchBar styles
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

  // RecommendSection styles
  recommendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(38),
    paddingHorizontal: wp(24),
  },
  recommendText: {
    fontWeight: '600',
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
    width: wp(94),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT,
    borderRadius: wp(10),
    paddingVertical: hp(8),
    paddingHorizontal: wp(12),
    marginStart: wp(12),
  },
  filterText: {
  },
  filterIcon: {
    width: wp(8),
    height: wp(8),
    marginStart: wp(8),
  },

  // PISearchBar styles
  backgroundImage: {
    width: wp(750),
  },
  safeArea: {
    width: '100%',
  },
  container: {
    paddingTop: hp(8),
    paddingHorizontal: wp(28),
  },
  container2: {
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
    fontWeight: '500',
  },
  salary: {
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
    color: GRAY,
  },
  basePrice: {
    justifyContent: 'flex-end',
  },
  basePriceNumber: {
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
    color: GRAY,
    flex: 1,
  },
  time: {
    color: GRAY_LIGHTER,
  },
  basePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
  },
});

