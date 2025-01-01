/**
 * @file PositionsScreen.tsx
 * @description 职位列表页面
 * @author zhouzhixin
 * @date 2025-01-01 13:39
 * 
 * 主要功能:
 * - 展示职位列表
 * - 支持下拉刷新和上拉加载更多
 * - 顶部搜索栏
 * - 职位卡片展示
 */



import React, { useState, useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import { SFlatList } from "../../components/SFlatList";
import { SearchHeader } from "./components/search";
import { PositionItem } from "./components/item";
import { PositionMetaDTO } from "./dto/position.meta.dto";
import { fp, wp } from "../../utils/adapt";
import { BACKGROUND_LIGHT, TEXT_TERTIARY } from "../../constants/Colors";

const PositionsScreen = () => {
  const [positions, setPositions] = useState<PositionMetaDTO[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // 模拟获取数据
  const fetchPositions = async (
    isRefresh = false
  ): Promise<PositionMetaDTO[]> => {
    // 这里应该是实际的API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData: PositionMetaDTO[] = [
          {
            id: "1",
            title: "后勤",
            organization: "某部队医院",
            salary: { min: 4000, max: 5000 },
            requirements: {
              gender: "any",
              education: "专科",
              ageRange: { min: 18, max: 35 },
            },
            basePrice: 10,
            deadline: "12-23 10:24结束",
          },
          {
            id: "2",
            title: "内勤文员",
            organization: "绿园区交警队",
            salary: { min: 5000, max: 8000 },
            requirements: {
              gender: "male",
              education: "专科",
              ageRange: { min: 18, max: 40 },
            },
            basePrice: 22,
            deadline: "12-23 10:24结束",
          },
          // ... 可以添加更多模拟数据
        ];
        resolve(mockData);
      }, 1000);
    });
  };

  const handleRefresh = async () => {
    const newData = await fetchPositions(true);
    setPositions(newData);
    setHasMore(true);
  };

  const handleLoadMore = async () => {
    const moreData = await fetchPositions(false);
    setPositions([...positions, ...moreData]);
    setHasMore(moreData.length > 0);
  };

  const renderItem = useCallback(
    ({ item }: { item: PositionMetaDTO }) => (
      <PositionItem
        data={item}
        onPress={(position) => {
          // 处理职位点击事件
          console.log("Position clicked:", position);
        }}
      />
    ),
    []
  );

  const ListHeaderComponent = useCallback(
    () => (
      <View style={styles.headerContainer}>
        <SearchHeader />
        <View style={styles.filterContainer}>{/* 这里可以添加筛选组件 */}</View>
      </View>
    ),
    []
  );

  const EmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>暂无职位信息</Text>
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <SFlatList
        data={positions}
        renderItem={renderItem}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        ListHeaderComponent={ListHeaderComponent}
        EmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无职位信息</Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_LIGHT,
  },
  headerContainer: {
    backgroundColor: BACKGROUND_LIGHT,
  },
  filterContainer: {
    paddingHorizontal: wp(16),
    paddingVertical: wp(8),
  },
  listContainer: {
    paddingHorizontal: wp(16),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: wp(40),
  },
  emptyText: {
    fontSize: fp(14),
    color: TEXT_TERTIARY,
  },
});

export default PositionsScreen;
