import { ScrollView, StatusBar, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../contexts/theme'

type Props = {
  children: React.ReactNode
  scrollable?: boolean
  padded?: boolean
}

export function Screen({ children, scrollable = false, padded = true }: Props) {
  const { colors, mode } = useTheme()
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      {scrollable ? (
        <ScrollView
          contentContainerStyle={{ padding: padded ? 16 : 0, gap: 16, paddingTop: padded ? 16 : 12 }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            padding: padded ? 16 : 0,
            paddingTop: padded ? 16 : 12,
            gap: 16,
          }}
        >
          {children}
        </View>
      )}
    </SafeAreaView>
  )
}
