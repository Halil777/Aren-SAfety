import { Pressable, Text, type PressableProps } from 'react-native'
import { useTheme } from '../../contexts/theme'

type ChipProps = PressableProps & {
  label: string
  selected?: boolean
}

export function Chip({ label, selected, style, ...rest }: ChipProps) {
  const { colors } = useTheme()
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: selected ? colors.primary : colors.subtle,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: selected ? colors.primary : colors.surface,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        style as any,
      ]}
      {...rest}
    >
      <Text
        style={{
          color: selected ? '#0B0C10' : colors.text,
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </Pressable>
  )
}
