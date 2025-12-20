import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/theme";
import { useAuth } from "../contexts/auth";
import { type ObservationDto } from "../services/api";
import {
  useAnswerObservationMutation,
  useCloseObservationMutation,
  useObservationQuery,
  useRejectObservationMutation,
} from "../query/hooks";
import { AnswerModal, type AnswerPayload } from "./AnswerModal";
import { Button } from "./ui/Button";

type Language = "en" | "tr" | "ru";

type DrawerTexts = {
  headerTitle: string;
  headerSubtitle: string;
  loading: string;
  notFound: string;
  descriptionFallback: string;
  riskPrefix: string;
  workerLabel: string;
  professionLabel: string;
  mediaTitle: string;
  answerTitle: string;
  sendAnswer: string;
  closeObservation: string;
  rejectObservation: string;
  rejectPlaceholder: string;
  sendReject: string;
  initialMediaTag: string;
  correctiveMediaTag: string;
  answerSentTitle: string;
  answerSentBody: string;
  closeSuccessTitle: string;
  closeErrorTitle: string;
  closeErrorBody: string;
  rejectSuccessTitle: string;
  rejectErrorTitle: string;
  rejectErrorBody: string;
  rejectionLabel: string;
  statuses: {
    NEW: string;
    IN_PROGRESS: string;
    FIXED_PENDING_CHECK: string;
    REJECTED: string;
    CLOSED: string;
    UNKNOWN: string;
  };
  meta: {
    project: string;
    department: string;
    category: string;
    company: string;
    supervisor: string;
    status: string;
    deadline: string;
    created: string;
  };
};

const translations: Record<Language, DrawerTexts> = {
  en: {
    headerTitle: "Observation",
    headerSubtitle: "Details & updates",
    loading: "Loading...",
    notFound: "Observation not found.",
    descriptionFallback: "No description",
    riskPrefix: "Risk",
    workerLabel: "Worker",
    professionLabel: "Profession",
    mediaTitle: "Media",
    answerTitle: "Supervisor response",
    sendAnswer: "Add response",
    closeObservation: "Confirm & close",
    rejectObservation: "Reject & request fix",
    rejectPlaceholder: "Describe what needs to be fixed",
    sendReject: "Send rejection",
    initialMediaTag: "Initial evidence",
    correctiveMediaTag: "Corrective action",
    answerSentTitle: "Answer sent",
    answerSentBody: "Your response has been shared with the creator.",
    closeSuccessTitle: "Observation closed",
    closeErrorTitle: "Error",
    closeErrorBody: "Could not close observation",
    rejectSuccessTitle: "Rejection sent",
    rejectErrorTitle: "Error",
    rejectErrorBody: "Could not reject observation",
    rejectionLabel: "Rejection note",
    statuses: {
      NEW: "New",
      IN_PROGRESS: "In progress",
      FIXED_PENDING_CHECK: "Fixed pending check",
      REJECTED: "Rejected",
      CLOSED: "Closed",
      UNKNOWN: "Unknown",
    },
    meta: {
      project: "Project",
      department: "Department",
      category: "Category",
      company: "Company",
      supervisor: "Supervisor",
      status: "Status",
      deadline: "Deadline",
      created: "Created",
    },
  },
  tr: {
    headerTitle: "G\u00f6zlem",
    headerSubtitle: "Detaylar ve g\u00fcncellemeler",
    loading: "Y\u00fckleniyor...",
    notFound: "G\u00f6zlem bulunamad\u0131.",
    descriptionFallback: "A\u00e7\u0131klama yok",
    riskPrefix: "Risk",
    workerLabel: "\u00c7al\u0131\u015fan",
    professionLabel: "Meslek",
    mediaTitle: "Medya",
    answerTitle: "Sorumlu yan\u0131t\u0131",
    sendAnswer: "Yan\u0131t ekle",
    closeObservation: "Onayla ve kapat",
    rejectObservation: "Reddet ve d\u00fczeltme iste",
    rejectPlaceholder: "Neyin d\u00fczeltilmesi gerekti\u011fini yaz\u0131n",
    sendReject: "Red g\u00f6nder",
    initialMediaTag: "\u0130lk kan\u0131t",
    correctiveMediaTag: "D\u00fczeltici aksiyon",
    answerSentTitle: "Yan\u0131t g\u00f6nderildi",
    answerSentBody: "Yan\u0131t\u0131n\u0131z olusturan kisiyle paylasildi.",
    closeSuccessTitle: "G\u00f6zlem kapat\u0131ld\u0131",
    closeErrorTitle: "Hata",
    closeErrorBody: "G\u00f6zlem kapat\u0131lamad\u0131",
    rejectSuccessTitle: "Red g\u00f6nderildi",
    rejectErrorTitle: "Hata",
    rejectErrorBody: "Red g\u00f6nderilemedi",
    rejectionLabel: "Red notu",
    statuses: {
      NEW: "Yeni",
      IN_PROGRESS: "Devam ediyor",
      FIXED_PENDING_CHECK: "Kontrol bekliyor",
      REJECTED: "Reddedildi",
      CLOSED: "Kapal\u0131",
      UNKNOWN: "Bilinmiyor",
    },
    meta: {
      project: "Proje",
      department: "Departman",
      category: "Kategori",
      company: "\u015eirket",
      supervisor: "Sorumlu",
      status: "Durum",
      deadline: "Son tarih",
      created: "Olu\u015fturulma",
    },
  },
  ru: {
    headerTitle: "\u041d\u0430\u0431\u043b\u044e\u0434\u0435\u043d\u0438\u0435",
    headerSubtitle: "\u0414\u0435\u0442\u0430\u043b\u0438 \u0438 \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u044f",
    loading: "\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430...",
    notFound: "\u041d\u0430\u0431\u043b\u044e\u0434\u0435\u043d\u0438\u0435 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e.",
    descriptionFallback: "\u041d\u0435\u0442 \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u044f",
    riskPrefix: "\u0420\u0438\u0441\u043a",
    workerLabel: "\u0420\u0430\u0431\u043e\u0442\u043d\u0438\u043a",
    professionLabel: "\u041f\u0440\u043e\u0444\u0435\u0441\u0441\u0438\u044f",
    mediaTitle: "\u041c\u0435\u0434\u0438\u0430",
    answerTitle: "\u041e\u0442\u0432\u0435\u0442 \u0440\u0443\u043a\u043e\u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044f",
    sendAnswer: "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043e\u0442\u0432\u0435\u0442",
    closeObservation: "\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044c \u0438 \u0437\u0430\u043a\u0440\u044b\u0442\u044c",
    rejectObservation: "\u041e\u0442\u043a\u043b\u043e\u043d\u0438\u0442\u044c \u0438 \u0437\u0430\u043f\u0440\u043e\u0441\u0438\u0442\u044c \u0438\u0441\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435",
    rejectPlaceholder: "\u041e\u043f\u0438\u0448\u0438\u0442\u0435, \u0447\u0442\u043e \u043d\u0443\u0436\u043d\u043e \u0438\u0441\u043f\u0440\u0430\u0432\u0438\u0442\u044c",
    sendReject: "\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u043e\u0442\u043a\u0430\u0437",
    initialMediaTag: "\u041f\u0435\u0440\u0432\u0438\u0447\u043d\u044b\u0435 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b",
    correctiveMediaTag: "\u041a\u043e\u0440\u0440\u0435\u043a\u0442\u0438\u0440\u0443\u044e\u0449\u0435\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435",
    answerSentTitle: "\u041e\u0442\u0432\u0435\u0442 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d",
    answerSentBody: "\u0412\u0430\u0448 \u043e\u0442\u0432\u0435\u0442 \u0442\u0435\u043f\u0435\u0440\u044c \u0432\u0438\u0434\u0438\u0442 \u0441\u043e\u0437\u0434\u0430\u0442\u0435\u043b\u044c.",
    closeSuccessTitle: "\u041d\u0430\u0431\u043b\u044e\u0434\u0435\u043d\u0438\u0435 \u0437\u0430\u043a\u0440\u044b\u0442\u043e",
    closeErrorTitle: "\u041e\u0448\u0438\u0431\u043a\u0430",
    closeErrorBody: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u043a\u0440\u044b\u0442\u044c \u043d\u0430\u0431\u043b\u044e\u0434\u0435\u043d\u0438\u0435",
    rejectSuccessTitle: "\u041e\u0442\u043a\u0430\u0437 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d",
    rejectErrorTitle: "\u041e\u0448\u0438\u0431\u043a\u0430",
    rejectErrorBody: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043e\u0442\u043a\u043b\u043e\u043d\u0438\u0442\u044c \u043d\u0430\u0431\u043b\u044e\u0434\u0435\u043d\u0438\u0435",
    rejectionLabel: "\u041f\u0440\u0438\u0447\u0438\u043d\u0430 \u043e\u0442\u043a\u0430\u0437\u0430",
    statuses: {
      NEW: "\u041d\u043e\u0432\u0430\u044f",
      IN_PROGRESS: "\u0412 \u0440\u0430\u0431\u043e\u0442\u0435",
      FIXED_PENDING_CHECK: "\u0418\u0441\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u043e, \u0436\u0434\u0451\u0442 \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0438",
      REJECTED: "\u041e\u0442\u043a\u043b\u043e\u043d\u0435\u043d\u043e",
      CLOSED: "\u0417\u0430\u043a\u0440\u044b\u0442\u0430",
      UNKNOWN: "\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u043e",
    },
    meta: {
      project: "\u041f\u0440\u043e\u0435\u043a\u0442",
      department: "\u041e\u0442\u0434\u0435\u043b",
      category: "\u041a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u044f",
      company: "\u041a\u043e\u043c\u043f\u0430\u043d\u0438\u044f",
      supervisor: "\u0420\u0443\u043a\u043e\u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044c",
      status: "\u0421\u0442\u0430\u0442\u0443\u0441",
      deadline: "\u0414\u0435\u0434\u043b\u0430\u0439\u043d",
      created: "\u0421\u043e\u0437\u0434\u0430\u043d\u043e",
    },
  },
};

type ThemeTokens = {
  isDark: boolean;
  panelBg: string;
  panelBorder: string;
  cardBg: string;
  cardBorder: string;
  chipBg: string;
  surface: string;
  placeholder: string;
};

function getThemeTokens(
  colors: ReturnType<typeof useTheme>["colors"],
  mode: ReturnType<typeof useTheme>["mode"]
): ThemeTokens {
  const isDark = mode === "dark";
  return {
    isDark,
    panelBg: isDark ? "#0F1C31" : "#EEF4EE",
    panelBorder: isDark ? "#1E3357" : "#D5E2D5",
    cardBg: isDark ? colors.card : "#F9FBF9",
    cardBorder: isDark ? "#1E3357" : "#D5E2D5",
    chipBg: isDark ? colors.subtle : "#E3EDE3",
    surface: isDark ? colors.surface : "#E8F1E8",
    placeholder: isDark ? "#6B7DA5" : colors.muted,
  };
}

type Props = {
  visible: boolean;
  observationId: string | null;
  token: string | null;
  onClose: () => void;
  colors?: ReturnType<typeof useTheme>["colors"];
  language?: Language;
};

export function ObservationDrawer({
  visible,
  observationId,
  token,
  onClose,
  colors: colorsProp,
  language = "en",
}: Props) {
  const { colors, mode } = useTheme();
  const palette = colorsProp ?? colors;
  const theme = getThemeTokens(palette, mode);
  const texts = translations[language] ?? translations.en;
  const { user } = useAuth();
  const [answerOpen, setAnswerOpen] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectionNote, setRejectionNote] = useState("");

  const observationQuery = useObservationQuery({
    token,
    scope: user?.id,
    id: observationId,
    enabled: visible,
  });
  const observation = observationQuery.data ?? null;
  const loading = observationQuery.isPending;

  const answerMutation = useAnswerObservationMutation({
    token,
    scope: user?.id,
    observationId,
  });
  const closeMutation = useCloseObservationMutation({
    token,
    scope: user?.id,
    observationId,
  });
  const rejectMutation = useRejectObservationMutation({
    token,
    scope: user?.id,
    observationId,
  });

  useEffect(() => {
    setShowReject(false);
    setRejectionNote("");
  }, [observationId, visible, observation?.status]);

  const sendAnswer = async (payload: AnswerPayload) => {
    try {
      await answerMutation.mutateAsync(payload);
      Alert.alert(texts.answerSentTitle, texts.answerSentBody);
      setAnswerOpen(false);
    } catch (err) {
      Alert.alert(
        texts.closeErrorTitle,
        err instanceof Error ? err.message : texts.closeErrorBody
      );
    }
  };

  const closeForUser = async () => {
    if (!token || !observationId) return;
    try {
      await closeMutation.mutateAsync();
      Alert.alert(texts.closeSuccessTitle);
    } catch (err) {
      Alert.alert(
        texts.closeErrorTitle,
        err instanceof Error ? err.message : texts.closeErrorBody
      );
    }
  };

  const rejectForUser = async () => {
    if (!token || !observationId) return;
    if (!rejectionNote.trim()) {
      Alert.alert(texts.rejectErrorTitle, texts.rejectPlaceholder);
      return;
    }
    try {
      await rejectMutation.mutateAsync(rejectionNote.trim());
      setShowReject(false);
      setRejectionNote("");
      Alert.alert(texts.rejectSuccessTitle);
    } catch (err) {
      Alert.alert(
        texts.rejectErrorTitle,
        err instanceof Error ? err.message : texts.rejectErrorBody
      );
    }
  };

  const formattedMeta = useMemo(
    () => [
      { label: texts.meta.project, value: observation?.projectName || observation?.projectId },
      { label: texts.meta.department, value: observation?.departmentName || observation?.departmentId },
      { label: texts.meta.category, value: observation?.categoryName || observation?.categoryId },
      { label: texts.meta.company, value: observation?.companyName || observation?.companyId },
      { label: texts.meta.supervisor, value: observation?.supervisorName || observation?.supervisorId },
      {
        label: texts.meta.status,
        value: observation?.status
          ? texts.statuses[observation.status as keyof DrawerTexts["statuses"]] ??
            texts.statuses.UNKNOWN
          : undefined,
      },
      { label: texts.meta.deadline, value: formatDate(observation?.deadline) },
      { label: texts.meta.created, value: formatDate(observation?.createdAt) },
    ],
    [observation, texts]
  );

  const media = observation?.media ?? [];
  const initialMedia = media.filter((m) => !m.isCorrective);
  const correctiveMedia = media.filter((m) => m.isCorrective);
  const hasAnswer = Boolean(observation?.supervisorAnswer) || correctiveMedia.length > 0;
  const isAssignee = observation?.supervisorId === user?.id;
  const isCreator = observation?.createdByUserId === user?.id;

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        presentationStyle="overFullScreen"
        onRequestClose={onClose}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}>
          <View
            style={{
              flex: 1,
              backgroundColor: palette.background,
              paddingTop: 48,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: theme.panelBorder,
              }}
            >
              <View>
                <Text style={{ color: palette.text, fontSize: 18, fontWeight: "800" }}>
                  {texts.headerTitle}
                </Text>
                <Text style={{ color: palette.muted, fontSize: 12 }}>{texts.headerSubtitle}</Text>
              </View>
              <TouchableOpacity onPress={onClose} hitSlop={12}>
                <Ionicons name="close" size={22} color={palette.text} />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator color={palette.primary} />
                <Text style={{ color: palette.muted, marginTop: 8 }}>{texts.loading}</Text>
              </View>
            ) : !observation ? (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: palette.muted }}>{texts.notFound}</Text>
              </View>
            ) : (
              <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
                <View style={{ gap: 6 }}>
                  <Text style={{ color: palette.primary, fontSize: 20, fontWeight: "800" }}>
                    {observation.workerFullName || texts.workerLabel}
                  </Text>
                  <Text style={{ color: palette.muted }}>
                    {observation.workerProfession || texts.professionLabel}
                  </Text>
                </View>

                <View
                  style={{
                    gap: 10,
                    borderWidth: 1,
                    borderColor: theme.panelBorder,
                    borderRadius: 12,
                    padding: 12,
                    backgroundColor: theme.cardBg,
                  }}
                >
                  <Text style={{ color: palette.text, fontWeight: "700", marginBottom: 6 }}>
                    {observation.description || texts.descriptionFallback}
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    <Tag
                      label={`${texts.riskPrefix} ${observation.riskLevel ?? "-"}`}
                      colors={palette}
                      theme={theme}
                    />
                    {observation.categoryName ? (
                      <Tag label={observation.categoryName} colors={palette} theme={theme} />
                    ) : null}
                    {observation.companyName ? (
                      <Tag label={observation.companyName} colors={palette} theme={theme} />
                    ) : null}
                  </View>
                </View>

                <View style={{ gap: 8 }}>
                  {formattedMeta
                    .filter((m) => m.value)
                    .map((m) => (
                      <InfoRow key={m.label} label={m.label} value={String(m.value)} colors={palette} />
                    ))}
                  <InfoRow
                    label={texts.workerLabel}
                    value={observation.workerFullName || "-"}
                    colors={palette}
                  />
                  <InfoRow
                    label={texts.professionLabel}
                    value={observation.workerProfession || "-"}
                    colors={palette}
                  />
                </View>

                {initialMedia.length ? (
                  <View style={{ gap: 10 }}>
                    <Text style={{ color: palette.text, fontWeight: "700", fontSize: 16 }}>
                      {texts.mediaTitle}
                    </Text>
                    {initialMedia.map((item) => (
                      <MediaItem
                        key={item.id}
                        media={item}
                        label={texts.initialMediaTag}
                        theme={theme}
                        colors={palette}
                      />
                    ))}
                  </View>
                ) : null}

                {hasAnswer ? (
                  <View
                    style={{
                      gap: 8,
                      borderWidth: 1,
                      borderColor: theme.panelBorder,
                      borderRadius: 12,
                      padding: 12,
                      backgroundColor: theme.cardBg,
                    }}
                  >
                    <Text style={{ color: palette.text, fontWeight: "800", fontSize: 16 }}>
                      {texts.answerTitle}
                    </Text>
                    {observation.supervisorAnswer ? (
                      <Text style={{ color: palette.text }}>{observation.supervisorAnswer}</Text>
                    ) : null}
                    {observation.answeredAt ? (
                      <Text style={{ color: palette.muted, fontSize: 12 }}>
                        {formatDate(observation.answeredAt)}
                      </Text>
                    ) : null}
                    {correctiveMedia.length ? (
                      <View style={{ gap: 8 }}>
                        {correctiveMedia.map((item) => (
                          <MediaItem
                            key={item.id}
                            media={item}
                            label={texts.correctiveMediaTag}
                            theme={theme}
                            colors={palette}
                          />
                        ))}
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {observation?.rejectionReason ? (
                  <View
                    style={{
                      gap: 6,
                      borderWidth: 1,
                      borderColor: theme.panelBorder,
                      borderRadius: 12,
                      padding: 12,
                      backgroundColor: theme.cardBg,
                    }}
                  >
                    <Text style={{ color: palette.text, fontWeight: "800", fontSize: 16 }}>
                      {texts.rejectionLabel}
                    </Text>
                    <Text style={{ color: palette.text }}>{observation.rejectionReason}</Text>
                  </View>
                ) : null}

                {isAssignee && observation.status !== "CLOSED" ? (
                  <Button
                    label={texts.sendAnswer}
                    onPress={() => setAnswerOpen(true)}
                    fullWidth
                    style={{ backgroundColor: palette.primary, borderColor: palette.primary }}
                  />
                ) : null}

                {isCreator &&
                (observation.status === "FIXED_PENDING_CHECK" ||
                  observation.status === "REJECTED") ? (
                  <View style={{ gap: 10 }}>
                    <Button
                      label={texts.closeObservation}
                      onPress={closeForUser}
                      loading={closeMutation.isPending}
                      fullWidth
                      backgroundColor={palette.success}
                      borderColor={palette.success}
                    />
                    <Button
                      label={texts.rejectObservation}
                      onPress={() => setShowReject((v) => !v)}
                      fullWidth
                      variant="ghost"
                      borderColor={palette.danger}
                      textColor={palette.danger}
                    />
                    {showReject ? (
                      <View style={{ gap: 8 }}>
                        <TextInput
                          value={rejectionNote}
                          onChangeText={setRejectionNote}
                          placeholder={texts.rejectPlaceholder}
                          placeholderTextColor={palette.muted}
                          multiline
                          style={{
                            minHeight: 120,
                            color: palette.text,
                            backgroundColor: theme.surface,
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: theme.panelBorder,
                            padding: 12,
                            textAlignVertical: "top",
                          }}
                        />
                        <Button
                          label={texts.sendReject}
                          onPress={rejectForUser}
                          loading={rejectMutation.isPending}
                          fullWidth
                          style={{ backgroundColor: palette.danger, borderColor: palette.danger }}
                        />
                      </View>
                    ) : null}
                  </View>
                ) : null}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {observation ? (
        <AnswerModal
          visible={answerOpen}
          onClose={() => setAnswerOpen(false)}
          onSubmit={sendAnswer}
        />
      ) : null}
    </>
  );
}

const InfoRow = ({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useTheme>["colors"];
}) => (
  <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
    <Text style={{ color: colors.muted, fontWeight: "700" }}>{label}</Text>
    <Text
      style={{
        color: colors.text,
        fontWeight: "700",
        flex: 1,
        textAlign: "right",
        textTransform: "uppercase",
      }}
    >
      {value}
    </Text>
  </View>
);

const Tag = ({
  label,
  colors,
  theme,
}: {
  label: string;
  colors: ReturnType<typeof useTheme>["colors"];
  theme: ThemeTokens;
}) => (
  <View
    style={{
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: theme.chipBg,
      borderColor: theme.panelBorder,
      borderWidth: 1,
    }}
  >
    <Text style={{ color: colors.text, fontSize: 12 }}>{label}</Text>
  </View>
);

const MediaItem = ({
  media,
  label,
  theme,
  colors,
}: {
  media: NonNullable<ObservationDto["media"]>[number];
  label: string;
  theme: ThemeTokens;
  colors: ReturnType<typeof useTheme>["colors"];
}) => {
  const [open, setOpen] = useState(false);
  const isImage = media.type === "IMAGE";

  const getUri = () => {
    if (!media.url) return "";
    if (
      media.url.startsWith("http://") ||
      media.url.startsWith("https://") ||
      media.url.startsWith("file://") ||
      media.url.startsWith("data:") ||
      media.url.startsWith("blob:")
    ) {
      return media.url;
    }
    const cleaned = media.url.replace(/^data:image\/[a-z]+;base64,/i, "");
    return `data:image/jpeg;base64,${cleaned}`;
  };

  const uri = getUri();

  return (
    <View
      style={{
        gap: 10,
        borderRadius: 12,
        backgroundColor: theme.cardBg,
        borderWidth: 1,
        borderColor: theme.panelBorder,
        padding: 10,
      }}
    >
      {isImage ? (
        <>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setOpen(true)}
            style={{ borderRadius: 10, overflow: "hidden" }}
          >
            <Image
              source={{ uri }}
              style={{
                width: "100%",
                height: 220,
                backgroundColor: theme.surface,
              }}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <Modal
            visible={open}
            transparent
            presentationStyle="overFullScreen"
            onRequestClose={() => setOpen(false)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.9)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{ position: "absolute", top: 50, right: 24 }}
                onPress={() => setOpen(false)}
              >
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
              <Image
                source={{ uri }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            </View>
          </Modal>
        </>
      ) : (
        <View
          style={{
            width: "100%",
            height: 220,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.surface,
          }}
        >
          <Ionicons name="videocam-outline" size={48} color={colors.primary} />
          <Text style={{ color: colors.text, marginTop: 8 }}>Video</Text>
        </View>
      )}
      <Text style={{ color: colors.muted, fontSize: 12 }}>{label}</Text>
    </View>
  );
};

const formatDate = (val?: string) => {
  if (!val) return "";
  const d = new Date(val);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString();
};
