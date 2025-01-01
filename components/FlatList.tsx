/**
 * @author zhouzhixin
 * @date 2025-1-1 22:01
 * 列表组件
 * 
 * @component
 * @description 一个可定制的列表组件,支持不同的变体样式和颜色
 * 
 * @prop {React.ReactNode} children - 子元素内容
 * @prop {TextStyle | TextStyle[]} style - 自定义样式
 * @prop {'header' | 'body' | 'caption'} variant - 文本变体类型
 *   - header: 标题文本,24号字体,加粗
 *   - body: 正文文本,16号字体
 *   - caption: 说明文本,12号字体,灰色
 * @prop {string} color - 自定义文本颜色
 */ 



import { fp, hp, wp } from '@/constants/Adapt';
import { GRAY, LIGHT, WHITE } from '@/constants/Colors';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  ViewStyle,
  ListRenderItem,
} from 'react-native';



interface SFlatListProps<T> {
  data: T[];
  renderItem: ListRenderItem<T>;
  onRefresh?: () => Promise<void>;
  onLoadMore?: () => Promise<void>;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
  LoadingComponent?: React.ReactElement;
  EmptyComponent?: React.ReactElement;
  hasMore?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  refreshControlColors?: string[];
  onEndReachedThreshold?: number;
}

export function StalinFlatList<T>({
  data,
  renderItem,
  onRefresh,
  onLoadMore,
  ListHeaderComponent,
  ListFooterComponent,
  LoadingComponent,
  EmptyComponent,
  hasMore = true,
  style,
  contentContainerStyle,
  refreshControlColors = [GRAY],
  onEndReachedThreshold = 0.2,
  ...restProps
}: SFlatListProps<T>) {
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh || refreshing) return;
    
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh, refreshing]);

  const handleLoadMore = useCallback(async () => {
    if (!onLoadMore || loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      await onLoadMore();
    } finally {
      setLoadingMore(false);
    }
  }, [onLoadMore, loadingMore, hasMore]);

  const renderFooter = useCallback(() => {
    if (LoadingComponent && loadingMore) {
      return LoadingComponent;
    }

    if (loadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color={GRAY} />
          <Text style={styles.footerText}>加载中...</Text>
        </View>
      );
    }

    if (!hasMore && data.length > 0) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>没有更多数据了</Text>
        </View>
      );
    }

    return ListFooterComponent || null;
  }, [loadingMore, hasMore, data.length, ListFooterComponent, LoadingComponent]);

  const renderEmpty = useCallback(() => {
    if (EmptyComponent) return EmptyComponent;

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>暂无数据</Text>
      </View>
    );
  }, [EmptyComponent]);
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      style={[styles.container, style]}
      contentContainerStyle={[
        data.length === 0 && styles.emptyContentContainer,
        contentContainerStyle,
      ]}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={onEndReachedThreshold}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={refreshControlColors}
            tintColor={refreshControlColors[0]}
          />
        ) : undefined
      }
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent??renderFooter()}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
      {...restProps}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  emptyContentContainer: {
    flex: 1,
  },
  footer: {
    padding: wp(16),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LIGHT,
  },
  footerText: {
    color: GRAY,
    fontSize: fp(14),
    marginLeft: wp(8),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE,
    paddingVertical: hp(20),
  },
  emptyText: {
    color: GRAY,
    fontSize: fp(14),
  },
});

export default StalinFlatList; 