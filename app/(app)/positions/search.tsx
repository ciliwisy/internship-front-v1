import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKGROUND_GRAY, GRAY, GRAY_DARK, WHITE } from '@/constants/Colors';
import { wp, fp, hp } from '@/constants/Adapt';
import { useRouter } from 'expo-router';
import { StalinText } from '@/components/Text';
import { SafeAreaView } from 'react-native-safe-area-context';

const HISTORY_KEY = 'search_history';
const MAX_HISTORY = 10;

// 热门搜索词示例
const HOT_SEARCHES = [
  '普工', '电工', '流水线', '中车集团', '量尺设计',
  '装修设计', '临时工'
];

export default function SearchScreen() {
  const [keyword, setKeyword] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const router = useRouter();

  // 历史搜索示例
  const RECENT_SEARCHES = [
    '高佣岗位', '保洁', '电工', '主播'
  ];

  useEffect(() => {
    loadHistory();
  }, []);
//加载历史搜索
  const loadHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem(HISTORY_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  };
//保存历史搜索
  const saveHistory = async (newKeyword: string) => {
    try {
      let newHistory = [newKeyword, ...history.filter(k => k !== newKeyword)];
      if (newHistory.length > MAX_HISTORY) {
        newHistory = newHistory.slice(0, MAX_HISTORY);
      }
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  };
//搜索
  const handleSearch = (text: string) => {
    if (!text.trim()) return;
    saveHistory(text);
    // 跳转回列表页并传递搜索参数
    router.push({
      pathname: '/positions',
      params: { keyword: text }
    });
  };
//清除历史搜索
  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
      setHistory([]);
    } catch (e) {
      console.error('Failed to clear history:', e);
    }
  };
//渲染搜索标签
  const renderSearchTag = (text: string) => (
    <TouchableOpacity 
      key={text} 
      style={styles.tag}
      onPress={() => handleSearch(text)}
    >
      <StalinText variant='T9' style={styles.tagText}>{text}</StalinText>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}> 
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={wp(40)} color="#000" style={{marginStart: wp(0)}}/>
          </TouchableOpacity>
          <View style={styles.searchBarWrapper}>
            <View style={styles.piSearchContainer}>
              <View style={styles.searchIconContainer}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons 
                    name="search-outline" 
                    size={hp(40)}
                    color={GRAY}
                    style={{marginStart: wp(16)}}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="搜索职位/公司"
                    value={keyword}
                    onChangeText={setKeyword}
                    onSubmitEditing={() => handleSearch(keyword)}
                    returnKeyType="search"
                    autoFocus
                  />
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <TouchableOpacity onPress={() => handleSearch(keyword)}>
                    <Image source={require('@/assets/images/搜索.png')} style={{width: wp(92), height: hp(52)}}/>
                  </TouchableOpacity>
                </View>
              </View> 
            </View>
          </View>
        </View>

        {history.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <StalinText variant='T5' style={styles.sectionTitle}>历史搜索</StalinText>
              <TouchableOpacity onPress={clearHistory}>
                <Ionicons name="trash-outline" size={wp(40)} color={GRAY} />
              </TouchableOpacity>
            </View>
            <View style={styles.tagContainer}>
              {history.map(item => renderSearchTag(item))}

            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <StalinText variant='T5' style={styles.sectionTitle}>搜索发现</StalinText>
          </View>
          <View style={styles.tagContainer}>
            {HOT_SEARCHES.map(item => renderSearchTag(item))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    paddingHorizontal: wp(16),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(0),
    marginBottom: wp(50),
  },
  searchBar: {
    flex: 1,
    marginHorizontal: wp(12),
    height: wp(64),
    backgroundColor: BACKGROUND_GRAY,
    borderRadius: wp(25),
    paddingHorizontal: wp(12),
    justifyContent: 'center',
  },
  input: {
    padding: 0,
  },
  searchButton: {
    color: '#007AFF',
    fontSize: fp(16),
  },
  section: {
    padding: wp(16),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: wp(26),
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: wp(8),
    marginBottom: wp(50),
  },
  tag: {
    backgroundColor: BACKGROUND_GRAY,
    paddingHorizontal: wp(20),
    paddingVertical: wp(10),
    borderRadius: wp(10),
    marginRight: wp(20),
    marginBottom: wp(20),
  },
  tagText: {
    color: GRAY_DARK,
  },
  
  piSearchContainer: {
    height: hp(64),
    width: wp(620),
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: wp(12),
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
    height: hp(64),
    borderRadius: wp(24),
    backgroundColor: BACKGROUND_GRAY,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
}); 