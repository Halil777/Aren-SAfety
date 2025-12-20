import { View, type ViewProps } from 'react-native'
import { useTheme } from '../../contexts/theme'

export function Card({ style, children, ...rest }: ViewProps) {
  const { colors } = useTheme()
  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.subtle,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 6 },
          shadowRadius: 12,
          elevation: 4,
        },
        style as any,
      ]}
      {...rest}
    >
      {children}
    </View>
  )
}
