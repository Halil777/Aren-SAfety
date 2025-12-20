import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native'
import { useTheme } from '../../contexts/theme'

type ButtonProps = PressableProps & {
  label: string
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
  fullWidth?: boolean
  backgroundColor?: string
  textColor?: string
  borderColor?: string
}

export function Button({
  label,
  variant = 'primary',
  loading,
  fullWidth,
  style,
  disabled,
  backgroundColor,
  textColor,
  borderColor,
  ...rest
}: ButtonProps) {
  const { colors } = useTheme()
  const baseBg =
    variant === 'primary'
      ? colors.primary
      : variant === 'secondary'
        ? colors.subtle
        : 'transparent'
  const baseText = variant === 'primary' ? '#0B0C10' : colors.text
  const baseBorder = variant === 'ghost' ? colors.subtle : 'transparent'

  const indicatorColor = textColor ?? baseText

  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: backgroundColor ?? baseBg,
          borderRadius: 14,
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderWidth: 1,
          borderColor: borderColor ?? baseBorder,
          opacity: disabled ? 0.5 : 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: fullWidth ? '100%' : undefined,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        style as any,
      ]}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor} />
      ) : (
        <Text
          style={{
            color: indicatorColor,
            fontWeight: '700',
            letterSpacing: 0.2,
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  )
}
