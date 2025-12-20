import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Image,
  Text,
  View,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Screen } from '../../../components/layout/Screen'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { AnswerModal, type AnswerPayload } from '../../../components/AnswerModal'
import { useAuth } from '../../../contexts/auth'
import { useTheme } from '../../../contexts/theme'
import {
  answerObservation,
  closeObservation,
  fetchObservation,
  type ObservationDto,
  type ObservationDto as Observation,
} from '../../../services/api'

type MediaSource = { uri: string }

export default function ObservationDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { token, user } = useAuth()
  const { colors } = useTheme()
  const router = useRouter()
  const [obs, setObs] = useState<Observation | null>(null)
  const [loading, setLoading] = useState(true)
  const [answerOpen, setAnswerOpen] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!token || !id) return
      try {
        const res = await fetchObservation(token, id)
        setObs(res)
      } catch (err) {
        Alert.alert('Ошибка', err instanceof Error ? err.message : 'Не удалось загрузить наблюдение')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [token, id])

  const formatDate = (val?: string) => {
    if (!val) return '—'
    const d = new Date(val)
    return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString()
  }

  const details = useMemo(
    () => [
      { label: 'Проект', value: obs?.projectName || obs?.projectId },
      { label: 'Отдел', value: obs?.departmentName || obs?.departmentId },
      { label: 'Категория', value: obs?.categoryName || obs?.categoryId },
      { label: 'Компания', value: obs?.companyName || obs?.companyId },
      { label: 'Ответственный', value: obs?.supervisorName || obs?.supervisorId },
      { label: 'Статус', value: obs?.status },
      { label: 'Дедлайн', value: formatDate(obs?.deadline) },
      { label: 'Создано', value: formatDate(obs?.createdAt) },
    ],
    [obs],
  )

  const initialMedia = obs?.media?.filter(m => !m.isCorrective) ?? []
  const correctiveMedia = obs?.media?.filter(m => m.isCorrective) ?? []
  const hasAnswer = Boolean(obs?.supervisorAnswer) || correctiveMedia.length > 0
  const isAssignee = obs?.supervisorId === user?.id
  const isCreator = obs?.createdByUserId === user?.id

  const sendAnswer = async (payload: AnswerPayload) => {
    if (!token || !obs) throw new Error('Сессия истекла, войдите снова')
    const updated = await answerObservation(token, obs.id, payload)
    setObs(updated)
    Alert.alert('Отправлено', 'Ответ отправлен и доступен пользователю')
    setAnswerOpen(false)
  }

  const handleClose = async () => {
    if (!token || !obs) return
    setClosing(true)
    try {
      const updated = await closeObservation(token, obs.id)
      setObs(updated)
      Alert.alert('Закрыто', 'Наблюдение закрыто')
    } catch (err) {
      Alert.alert('Ошибка', err instanceof Error ? err.message : 'Не удалось закрыть')
    } finally {
      setClosing(false)
    }
  }

  return (
    <Screen scrollable>
      <View style={{ gap: 10 }}>
        <Text style={{ color: '#4E8DFF', fontSize: 22, fontWeight: '800' }}>Наблюдение</Text>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>{obs?.workerFullName}</Text>
      </View>

      {loading ? (
        <Text style={{ color: colors.muted }}>Загрузка...</Text>
      ) : !obs ? (
        <Text style={{ color: colors.muted }}>Наблюдение не найдено</Text>
      ) : (
        <>
          <Card style={{ gap: 10, backgroundColor: '#0F1C31', borderColor: '#1E3357' }}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{obs.description || 'Без описания'}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Pill>{obs.categoryName || obs.categoryId || 'Без категории'}</Pill>
              <Pill>Риск {obs.riskLevel ?? '-'}</Pill>
              {obs.companyName ? <Pill>{obs.companyName}</Pill> : null}
            </View>
            <View style={{ gap: 10, marginTop: 8 }}>
              {details.map(
                d =>
                  d.value && (
                    <InfoRow key={d.label} label={d.label} value={String(d.value)} />
                  ),
              )}
              <InfoRow label="Работник" value={obs.workerFullName || '—'} />
              <InfoRow label="Профессия" value={obs.workerProfession || '—'} />
            </View>
          </Card>

          {initialMedia.length ? (
            <Card style={{ gap: 10 }}>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>Медиа</Text>
              <View style={{ gap: 10 }}>
                {initialMedia.map(m => (
                  <MediaRow key={m.id} media={m} />
                ))}
              </View>
            </Card>
          ) : null}

          {hasAnswer ? (
            <Card style={{ gap: 8 }}>
              <Text style={{ color: colors.text, fontWeight: '800', fontSize: 16 }}>
                Ответ супервизора
              </Text>
              {obs.supervisorAnswer ? <Text style={{ color: colors.text }}>{obs.supervisorAnswer}</Text> : null}
              {obs.answeredAt ? (
                <Text style={{ color: colors.muted, fontSize: 12 }}>{formatDate(obs.answeredAt)}</Text>
              ) : null}
              {correctiveMedia.length ? (
                <View style={{ gap: 10 }}>
                  {correctiveMedia.map(m => (
                    <MediaRow key={m.id} media={m} />
                  ))}
                </View>
              ) : null}
            </Card>
          ) : null}

          {isAssignee && obs.status !== 'CLOSED' ? (
            <Button
              label="ОТВЕТИТЬ"
              fullWidth
              onPress={() => setAnswerOpen(true)}
              style={{ backgroundColor: '#4E8DFF', borderColor: '#4E8DFF' }}
            />
          ) : null}

          {isCreator &&
          (obs.status === 'FIXED_PENDING_CHECK' || obs.status === 'REJECTED') ? (
            <Button
              label="ПОДТВЕРДИТЬ (ЗАКРЫТЬ)"
              fullWidth
              onPress={handleClose}
              loading={closing}
              style={{ backgroundColor: colors.success, borderColor: colors.success }}
            />
          ) : null}

          <Button label="Назад" variant="secondary" fullWidth onPress={() => router.back()} />
        </>
      )}

      {obs ? (
        <AnswerModal
          visible={answerOpen}
          onClose={() => setAnswerOpen(false)}
          onSubmit={sendAnswer}
        />
      ) : null}
    </Screen>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme()
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
      <Text style={{ color: colors.muted }}>{label}</Text>
      <Text style={{ color: colors.text, fontWeight: '700', flex: 1, textAlign: 'right' }}>{value}</Text>
    </View>
  )
}

function Pill({ children }: { children: string }) {
  return (
    <View
      style={{
        backgroundColor: '#10284D',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ color: '#7AA5FF', fontSize: 12, fontWeight: '700' }}>{children}</Text>
    </View>
  )
}

function MediaRow({ media }: { media: NonNullable<Observation['media']>[number] }) {
  const { colors } = useTheme()
  const isImage = media.type === 'IMAGE'

  const getImageSource = (): MediaSource => {
    if (!media.url) return { uri: '' }
    if (
      media.url.startsWith('http://') ||
      media.url.startsWith('https://') ||
      media.url.startsWith('file://') ||
      media.url.startsWith('data:')
    ) {
      return { uri: media.url }
    }
    const base64Data = media.url.replace(/^data:image\/[a-z]+;base64,/, '')
    return { uri: `data:image/jpeg;base64,${base64Data}` }
  }

  return (
    <View
      style={{
        gap: 10,
        borderRadius: 12,
        backgroundColor: '#0F1C31',
        borderWidth: 1,
        borderColor: '#1E3357',
        padding: 10,
      }}
    >
      {isImage ? (
        <Image
          source={getImageSource()}
          style={{
            width: '100%',
            height: 220,
            borderRadius: 10,
            backgroundColor: '#122135',
          }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: '100%',
            height: 220,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#122135',
          }}
        >
          <Ionicons name="videocam-outline" size={48} color="#7AA5FF" />
          <Text style={{ color: '#E5EDFF', marginTop: 8 }}>Видео</Text>
        </View>
      )}
      <Text style={{ color: '#6B7DA5', fontSize: 12 }}>
        {media.isCorrective ? 'Корректирующее действие' : 'Первоначальное медиа'}
      </Text>
    </View>
  )
}
