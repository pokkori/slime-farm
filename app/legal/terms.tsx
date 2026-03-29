import { ScrollView, Text, View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Pressable
          style={styles.back}
          onPress={() => router.back()}
          accessibilityLabel="戻る"
          accessibilityRole="button"
        >
          <Text style={styles.backText}>← 戻る</Text>
        </Pressable>
        <Text style={styles.title}>利用規約</Text>
        <Text style={styles.updated}>最終更新: 2026年3月</Text>
        <Text style={styles.body}>
          本アプリ「スライム牧場」（以下「本アプリ」）をご利用いただく前に、以下の利用規約をお読みください。{'\n\n'}
          【利用条件】{'\n'}
          ・本アプリは個人の娯楽目的でのみ使用できます。{'\n'}
          ・不正行為・チート行為は禁止します。{'\n\n'}
          【免責事項】{'\n'}
          ・本アプリの利用により生じた損害について、運営は責任を負いません。{'\n'}
          ・サービスは予告なく変更・終了する場合があります。{'\n\n'}
          【著作権】{'\n'}
          ・本アプリのコンテンツの著作権は運営に帰属します。{'\n\n'}
          【仮想通貨の有効期限】{'\n'}
          本アプリ内で取得したコイン・ジェム等の仮想通貨は、取得日から180日間有効です。有効期限を過ぎた仮想通貨は自動的に失効し、返金はいたしません。{'\n\n'}
          【未成年者の利用】{'\n'}
          未成年者が本アプリを利用する場合は、保護者の同意を得た上でご利用ください。未成年者による課金は、保護者の同意があるものとみなします。15歳以下の月額課金上限は5,000円、16〜17歳は10,000円を推奨します。
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  scroll: { padding: 20 },
  back: { marginBottom: 16, minHeight: 44, justifyContent: 'center' },
  backText: { color: '#60A5FA', fontSize: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 8 },
  updated: { fontSize: 12, color: '#9CA3AF', marginBottom: 20 },
  body: { color: '#D1D5DB', fontSize: 14, lineHeight: 22 },
});
