import { TextInput, View, Text, type TextInputProps } from 'react-native'
import { useTheme } from '../../contexts/theme'

type Props = TextInputProps & {
  label?: string
  helperText?: string
}

export function Input({ label, helperText, style, ...rest }: Props) {
  const { colors } = useTheme()
  return (
    <View style={{ gap: 6 }}>
      {label ? (
        <Text style={{ color: colors.muted, fontSize: 13, fontWeight: '600' }}>{label}</Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.muted}
        style={[
          {
            backgroundColor: colors.subtle,
            color: colors.text,
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: colors.surface,
          },
          style as any,
        ]}
        {...rest}
      />
      {helperText ? (
        <Text style={{ color: colors.muted, fontSize: 12 }}>{helperText}</Text>
      ) : null}
    </View>
  )
}
