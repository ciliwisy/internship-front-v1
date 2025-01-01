import { View, TouchableOpacity, TextInput, Image } from 'react-native';
import { StyleSheet } from 'react-native';
import { wp, fp } from '../../../utils/adapt';
import { BACKGROUND_WHITE, TEXT_TERTIARY } from '../../../constants/Colors';

export const SearchHeader = () => {
  return (
    <View style={styles.container}>
      {/* Search Input Area */}
      <TouchableOpacity style={styles.searchBox} activeOpacity={0.7}>
        <Image 
          source={require('../../../assets/icons/search.png')}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="搜索职位/公司"
          placeholderTextColor={TEXT_TERTIARY}
          editable={false}
        />
      </TouchableOpacity>

      {/* Message Icon */}
      <TouchableOpacity style={styles.messageButton} activeOpacity={0.7}>
        <Image 
          source={require('../../../assets/icons/message.png')}
          style={styles.messageIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(16),
    paddingVertical: wp(8),
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BACKGROUND_WHITE,
    borderRadius: wp(20),
    paddingHorizontal: wp(12),
    paddingVertical: wp(8),
    height: wp(40),
  },
  searchIcon: {
    width: wp(20),
    height: wp(20),
    marginRight: wp(8),
    tintColor: TEXT_TERTIARY,
  },
  input: {
    flex: 1,
    fontSize: fp(14),
    color: TEXT_TERTIARY,
  },
  messageButton: {
    marginLeft: wp(12),
    padding: wp(4),
  },
  messageIcon: {
    width: wp(24),
    height: wp(24),
  },
});
