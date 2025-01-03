import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GRAY } from '@/constants/Colors';
import { wp, fp } from '@/constants/Adapt';
import { useRouter } from 'expo-router';

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

  const handleSearch = (text: string) => {
    if (!text.trim()) return;
    saveHistory(text);
    // 跳转回列表页并传递搜索参数
    router.push({
      pathname: '/positions',
      params: { keyword: text }
    });
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
      setHistory([]);
    } catch (e) {
      console.error('Failed to clear history:', e);
    }
  };

  const renderSearchTag = (text: string) => (
    <TouchableOpacity 
      key={text} 
      style={styles.tag}
      onPress={() => handleSearch(text)}
    >
      <Text style={styles.tagText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
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
        <TouchableOpacity onPress={() => handleSearch(keyword)}>
          <Text style={styles.searchButton}>搜索</Text>
        </TouchableOpacity>
      </View>

      {history.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>历史搜索</Text>
            <TouchableOpacity onPress={clearHistory}>
              <Ionicons name="trash-outline" size={20} color={GRAY} />
            </TouchableOpacity>
          </View>
          <View style={styles.tagContainer}>
            {history.map(item => renderSearchTag(item))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>搜索发现</Text>
        </View>
        <View style={styles.tagContainer}>
          {HOT_SEARCHES.map(item => renderSearchTag(item))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(16),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  searchBar: {
    flex: 1,
    marginHorizontal: wp(12),
    height: wp(36),
    backgroundColor: '#f5f5f5',
    borderRadius: wp(18),
    paddingHorizontal: wp(12),
    justifyContent: 'center',
  },
  input: {
    fontSize: fp(16),
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
    marginBottom: wp(12),
  },
  sectionTitle: {
    fontSize: fp(16),
    fontWeight: 'bold',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: wp(8),
  },
  tag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: wp(12),
    paddingVertical: wp(6),
    borderRadius: wp(16),
    marginRight: wp(8),
    marginBottom: wp(8),
  },
  tagText: {
    fontSize: fp(14),
    color: '#333',
  },
}); 