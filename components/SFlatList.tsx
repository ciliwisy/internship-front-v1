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
import { wp, hp, fp } from '../utils/adapt';
import { TEXT_TERTIARY, BACKGROUND_WHITE, BACKGROUND_LIGHT } from '../constants/Colors';

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

export function SFlatList<T>({
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
  refreshControlColors = [TEXT_TERTIARY],
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
          <ActivityIndicator size="small" color={TEXT_TERTIARY} />
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
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
      {...restProps}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_WHITE,
  },
  emptyContentContainer: {
    flex: 1,
  },
  footer: {
    padding: wp(16),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_LIGHT,
  },
  footerText: {
    color: TEXT_TERTIARY,
    fontSize: fp(14),
    marginLeft: wp(8),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_WHITE,
    paddingVertical: hp(20),
  },
  emptyText: {
    color: TEXT_TERTIARY,
    fontSize: fp(14),
  },
});

export default SFlatList; 