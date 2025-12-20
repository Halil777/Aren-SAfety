import { useState } from 'react'
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../contexts/theme'
import { Button } from './ui/Button'

type Attachment = {
  uri: string
  type: 'IMAGE' | 'VIDEO'
  base64?: string
  mime?: string
}

export type AnswerPayload = {
  answer?: string
  media: { url: string; type: 'IMAGE' | 'VIDEO'; isCorrective: boolean }[]
}

type Props = {
  visible: boolean
  onClose: () => void
  onSubmit: (payload: AnswerPayload) => Promise<void>
}

const ensureDataUri = (value: string, mime: string) =>
  value.startsWith('data:') ? value : `data:${mime};base64,${value}`

export function AnswerModal({ visible, onClose, onSubmit }: Props) {
  const { colors } = useTheme()
  const [description, setDescription] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [submitting, setSubmitting] = useState(false)

  const reset = () => {
    setDescription('')
    setAttachments([])
  }

  const pickMedia = async (type: 'IMAGE' | 'VIDEO', source: 'library' | 'camera') => {
    const perm =
      source === 'library'
        ? await ImagePicker.requestMediaLibraryPermissionsAsync()
        : await ImagePicker.requestCameraPermissionsAsync()
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow media access to attach files.')
      return
    }

    const launcher =
      source === 'library' ? ImagePicker.launchImageLibraryAsync : ImagePicker.launchCameraAsync

    const result = await launcher({
      mediaTypes:
        type === 'IMAGE'
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      quality: 0.7,
      base64: type === 'IMAGE',
      videoMaxDuration: 60,
    })
    if (result.canceled) return
    const asset = result.assets?.[0]
    if (!asset?.uri) return

    if (type === 'IMAGE') {
      const imageBase64 = asset.base64 ?? undefined
      if (!imageBase64) {
        Alert.alert('Could not read image', 'Please try attaching the image again.')
        return
      }
      setAttachments(prev => [
        ...prev,
        { uri: asset.uri, type, base64: imageBase64, mime: asset.mimeType ?? 'image/jpeg' },
      ])
      return
    }

    try {
      const base64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: 'base64',
      })
      setAttachments(prev => [
        ...prev,
        { uri: asset.uri, type, base64, mime: asset.mimeType ?? 'video/mp4' },
      ])
    } catch (err) {
      console.warn('Failed to read video:', err)
      Alert.alert('Could not read video', 'Please try attaching the video again.')
    }
  }

  const handleSubmit = async () => {
    if (submitting) return
    if (!description.trim() && attachments.length === 0) {
      Alert.alert('Add details', 'Provide a description or attach media.')
      return
    }

    setSubmitting(true)
    try {
      const media = attachments.map(att => ({
        url: ensureDataUri(
          att.base64 ?? '',
          att.mime ?? (att.type === 'IMAGE' ? 'image/jpeg' : 'video/mp4'),
        ),
        type: att.type,
        isCorrective: true,
      }))
      await onSubmit({
        answer: description.trim() || undefined,
        media,
      })
      reset()
      onClose()
    } catch (err) {
      Alert.alert('Failed to send answer', err instanceof Error ? err.message : 'Try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={handleClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
        <View
          style={{
            backgroundColor: colors.card,
            padding: 20,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            gap: 12,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800' }}>Answer observation</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" color={colors.text} size={22} />
            </TouchableOpacity>
          </View>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Add a description"
            placeholderTextColor={colors.muted}
            multiline
            style={{
              minHeight: 120,
              color: colors.text,
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.subtle,
              padding: 12,
              textAlignVertical: 'top',
            }}
          />

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            <PickButton label="Image (Gallery)" onPress={() => pickMedia('IMAGE', 'library')} />
            <PickButton label="Image (Camera)" onPress={() => pickMedia('IMAGE', 'camera')} />
            <PickButton label="Video (Gallery)" onPress={() => pickMedia('VIDEO', 'library')} />
            <PickButton label="Video (Camera)" onPress={() => pickMedia('VIDEO', 'camera')} />
          </View>

          {attachments.length ? (
            <View style={{ gap: 8 }}>
              {attachments.map((att, idx) => (
                <View
                  key={`${att.uri}-${idx}`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.subtle,
                  }}
                >
                  <Text style={{ color: colors.text, flex: 1 }}>
                    {att.type === 'IMAGE' ? 'Image' : 'Video'} {idx + 1}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                    hitSlop={8}
                  >
                    <Ionicons name="trash-outline" size={18} color="#FF7B95" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : null}

          <Button
            label={submitting ? 'Sending...' : 'Send answer'}
            fullWidth
            onPress={handleSubmit}
            loading={submitting}
            style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
          />
        </View>
      </View>
    </Modal>
  )
}

function PickButton({ label, onPress }: { label: string; onPress: () => void }) {
  const { colors } = useTheme()
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.subtle,
      }}
      activeOpacity={0.9}
    >
      <Text style={{ color: colors.text, fontWeight: '700' }}>{label}</Text>
    </TouchableOpacity>
  )
}
