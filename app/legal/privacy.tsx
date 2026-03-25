import { ScrollView, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyScreen() {
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
        <Text style={styles.title}>プライバシーポリシー</Text>
        <Text style={styles.updated}>最終更新: 2026年3月</Text>
        <Text style={styles.body}>
          本アプリ「スライム牧場」は、ユーザーのプライバシーを尊重し、適切に個人情報を管理します。{'\n\n'}
          【収集する情報】{'\n'}
          ・ゲームの進行データ（端末内にのみ保存）{'\n'}
          ・アプリの利用状況（広告配信のみに使用）{'\n\n'}
          【第三者提供】{'\n'}
          ・収集した情報を第三者に販売することはありません。{'\n'}
          ・AdMob（Google社）の広告SDKを使用しています。{'\n\n'}
          【お問い合わせ】{'\n'}
          support@example.com
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
