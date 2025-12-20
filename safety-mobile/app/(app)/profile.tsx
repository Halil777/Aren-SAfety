import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { useState, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Screen } from "../../components/layout/Screen";
import { Card } from "../../components/ui/Card";
import { Select } from "../../components/ui/Select";
import { useTheme } from "../../contexts/theme";
import { useAuth } from "../../contexts/auth";
import { useRouter } from "expo-router";
import { useObservationsQuery } from "../../query/hooks";
import { useLanguage } from "../../contexts/language";

type ObservationStats = {
  today: number;
  week: number;
  month: number;
  total: number;
};

type Language = "en" | "tr" | "ru";

type ProfileTexts = {
  title: string;
  statsTitle: string;
  today: string;
  week: string;
  month: string;
  total: string;
  project: string;
  company: string;
  phone: string;
  email: string;
  position: string;
  observations: string;
  loading: string;
  unknownUser: string;
  unknownProject: string;
  unknownCompany: string;
  unknownPhone: string;
  unknownEmail: string;
  unknownPosition: string;
  unknownTotal: string;
  pickTitle: string;
  pickMessage: string;
  pickCamera: string;
  pickLibrary: string;
  cancel: string;
  permissionTitle: string;
  permissionBody: string;
  subtitle: string;
};

export const translations = {
  en: {
    title: "Profile",
    statsTitle: "Observation stats",
    today: "Today",
    week: "This week",
    month: "This month",
    total: "Total",
    project: "Project",
    company: "Company",
    phone: "Phone",
    email: "Email",
    position: "Position",
    observations: "Observations",
    loading: "Loading...",
    unknownUser: "No name",
    unknownProject: "No project",
    unknownCompany: "No company",
    unknownPhone: "No phone",
    unknownEmail: "No email",
    unknownPosition: "No position",
    unknownTotal: "0",
    pickTitle: "Change photo",
    pickMessage: "Choose a source",
    pickCamera: "Camera",
    pickLibrary: "Gallery",
    cancel: "Cancel",
    permissionTitle: "Permission needed",
    permissionBody: "Please allow access to continue.",
    subtitle: "Your account overview",
  },

  tr: {
    title: "Profil",
    statsTitle: "GГ¶zlem istatistikleri",
    today: "BugГјn",
    week: "Bu hafta",
    month: "Bu ay",
    total: "Toplam",
    project: "Proje",
    company: "Ећirket",
    phone: "Telefon",
    email: "E-posta",
    position: "Pozisyon",
    observations: "GГ¶zlemler",
    loading: "YГјkleniyor...",
    unknownUser: "Д°sim yok",
    unknownProject: "Proje yok",
    unknownCompany: "Ећirket yok",
    unknownPhone: "Telefon yok",
    unknownEmail: "E-posta yok",
    unknownPosition: "Pozisyon yok",
    unknownTotal: "0",
    pickTitle: "FotoДџraf deДџiЕџtir",
    pickMessage: "Kaynak seГ§",
    pickCamera: "Kamera",
    pickLibrary: "Galeri",
    cancel: "Д°ptal",
    permissionTitle: "Д°zin gerekli",
    permissionBody: "Devam etmek iГ§in eriЕџim izni verin.",
    subtitle: "Hesap Г¶zeti",
  },

  ru: {
    title: "РџСЂРѕС„РёР»СЊ",
    statsTitle: "РЎС‚Р°С‚РёСЃС‚РёРєР° РЅР°Р±Р»СЋРґРµРЅРёР№",
    today: "РЎРµРіРѕРґРЅСЏ",
    week: "Р­С‚Р° РЅРµРґРµР»СЏ",
    month: "Р­С‚РѕС‚ РјРµСЃСЏС†",
    total: "Р’СЃРµРіРѕ",
    project: "РџСЂРѕРµРєС‚",
    company: "РљРѕРјРїР°РЅРёСЏ",
    phone: "РўРµР»РµС„РѕРЅ",
    email: "Email",
    position: "Р”РѕР»Р¶РЅРѕСЃС‚СЊ",
    observations: "РќР°Р±Р»СЋРґРµРЅРёСЏ",
    loading: "Р—Р°РіСЂСѓР·РєР°...",
    unknownUser: "РќРµС‚ РёРјРµРЅРё",
    unknownProject: "РќРµС‚ РїСЂРѕРµРєС‚Р°",
    unknownCompany: "РќРµС‚ РєРѕРјРїР°РЅРёРё",
    unknownPhone: "РќРµС‚ С‚РµР»РµС„РѕРЅР°",
    unknownEmail: "РќРµС‚ email",
    unknownPosition: "РќРµС‚ РґРѕР»Р¶РЅРѕСЃС‚Рё",
    unknownTotal: "0",
    pickTitle: "РР·РјРµРЅРёС‚СЊ С„РѕС‚Рѕ",
    pickMessage: "Р’С‹Р±РµСЂРёС‚Рµ РёСЃС‚РѕС‡РЅРёРє",
    pickCamera: "РљР°РјРµСЂР°",
    pickLibrary: "Р“Р°Р»РµСЂРµСЏ",
    cancel: "РћС‚РјРµРЅР°",
    permissionTitle: "РўСЂРµР±СѓРµС‚СЃСЏ СЂР°Р·СЂРµС€РµРЅРёРµ",
    permissionBody: "РџРѕР¶Р°Р»СѓР№СЃС‚Р°, СЂР°Р·СЂРµС€РёС‚Рµ РґРѕСЃС‚СѓРї, С‡С‚РѕР±С‹ РїСЂРѕРґРѕР»Р¶РёС‚СЊ.",
    subtitle: "РћР±Р·РѕСЂ Р°РєРєР°СѓРЅС‚Р°",
  },
} satisfies Record<Language, ProfileTexts>;

type ThemeTokens = {
  cardBg: string;
  border: string;
  chipBg: string;
  icon: string;
};

function getThemeTokens(
  colors: ReturnType<typeof useTheme>["colors"],
  mode: "dark" | "light"
): ThemeTokens {
  const isDark = mode === "dark";
  return {
    cardBg: isDark ? "#0F1C31" : "#F4F7F4",
    border: isDark ? "#1E3357" : "#D2E0D2",
    chipBg: isDark ? "#1E3357" : "#E5EFE5",
    icon: isDark ? "#E5EDFF" : colors.text,
  };
}

export default function ProfileScreen() {
  const { colors, toggle, mode } = useTheme();
  const theme = getThemeTokens(colors, mode);
  const { user, role, logout, token } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const [avatar, setAvatar] = useState<string | null>(null);
  const observationsQuery = useObservationsQuery({ token, scope: user?.id });
  const observations = observationsQuery.data ?? [];
  const stats = useMemo<ObservationStats>(() => {
    if (!observations.length) return { today: 0, week: 0, month: 0, total: 0 };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    let todayCount = 0;
    let weekCount = 0;
    let monthCount = 0;

    for (const obs of observations) {
      if (!obs.createdAt) continue;
      const createdAt = new Date(obs.createdAt);
      if (Number.isNaN(createdAt.getTime())) continue;
      if (createdAt >= monthAgo) monthCount++;
      if (createdAt >= weekAgo) weekCount++;
      if (createdAt >= today) todayCount++;
    }

    return { today: todayCount, week: weekCount, month: monthCount, total: observations.length };
  }, [observations]);

  if (!user) {
    return (
      <Screen>
        <Text style={{ color: colors.muted }}>{t.loading}</Text>
      </Screen>
    );
  }

  const displayName = (
    user?.fullName ||
    user?.id ||
    t.unknownUser
  ).toUpperCase();
  const position =
    user?.profession ||
    (role === "SUPERVISOR" ? t.position : t.position) ||
    t.unknownPosition;
  const email = user?.email || t.unknownEmail;
  const project =
    user?.projectName || user?.projects?.[0]?.name || t.unknownProject;
  const company = user?.companyName || user?.company?.name || t.unknownCompany;
  const phone = user?.phoneNumber || t.unknownPhone;

  const pickAvatar = async () => {
    const choice = await new Promise<"camera" | "library" | null>((resolve) => {
      Alert.alert(t.pickTitle, t.pickMessage, [
        { text: t.pickCamera, onPress: () => resolve("camera") },
        { text: t.pickLibrary, onPress: () => resolve("library") },
        { text: t.cancel, style: "cancel", onPress: () => resolve(null) },
      ]);
    });
    if (!choice) return;

    const permission =
      choice === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t.permissionTitle, t.permissionBody);
      return;
    }

    const result =
      choice === "camera"
        ? await ImagePicker.launchCameraAsync({ quality: 0.6 })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
          });

    if (!result.canceled) {
      setAvatar(result.assets[0]?.uri ?? null);
    }
  };

  const languageOptions = [
    { label: "English", value: "en" },
    { label: "TГјrkГ§e", value: "tr" },
    { label: "Р СѓСЃСЃРєРёР№", value: "ru" },
  ];

  return (
    <Screen scrollable>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: "800" }}>
            {t.title}
          </Text>
          <Text style={{ color: colors.muted }}>{t.subtitle}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <ActionIcon
            icon={mode === "dark" ? "sunny-outline" : "moon-outline"}
            onPress={toggle}
            theme={theme}
          />
          <ActionIcon
            icon="log-out-outline"
            onPress={async () => {
              await logout();
              router.replace("/login");
            }}
            theme={theme}
          />
        </View>
      </View>


      <Card
        style={{
          alignItems: "center",
          gap: 12,
          backgroundColor: theme.cardBg,
          borderColor: theme.border,
        }}
      >
        <TouchableOpacity onPress={pickAvatar} activeOpacity={0.8}>
          <Image
            source={
              avatar
                ? { uri: avatar }
                : require("../../assets/images/react-logo.png")
            }
            style={{
              width: 110,
              height: 110,
              borderRadius: 60,
              borderWidth: 2,
              borderColor: theme.border,
            }}
          />
        </TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 22, fontWeight: "800" }}>
          {displayName}
        </Text>
        <View style={{ width: "100%", gap: 10 }}>
          <InfoRow
            icon="grid-outline"
            label={t.project}
            value={project}
            theme={theme}
            colors={colors}
          />
          {role === "SUPERVISOR" && company ? (
            <InfoRow
              icon="business-outline"
              label={t.company}
              value={company}
              theme={theme}
              colors={colors}
            />
          ) : null}
          <InfoRow
            icon="call-outline"
            label={t.phone}
            value={phone}
            theme={theme}
            colors={colors}
          />
          <InfoRow
            icon="mail-outline"
            label={t.email}
            value={email}
            theme={theme}
            colors={colors}
          />
          <InfoRow
            icon="briefcase-outline"
            label={t.position}
            value={position}
            theme={theme}
            colors={colors}
          />
          <InfoRow
            icon="eye-outline"
            label={t.observations}
            value={`${stats.total}`}
            theme={theme}
            colors={colors}
          />
        </View>
      </Card>

      <View style={{ gap: 10 }}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "800" }}>
          {t.statsTitle}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <StatsCard
            title={t.today}
            value={String(stats.today)}
            subtitle={t.observations}
            theme={theme}
            colors={colors}
          />
          <StatsCard
            title={t.week}
            value={String(stats.week)}
            subtitle={t.observations}
            theme={theme}
            colors={colors}
          />
        </View>
        <View style={{ width: "100%" }}>
          <StatsCard
            title={t.month}
            value={String(stats.month)}
            subtitle={t.observations}
            fullWidth
            theme={theme}
            colors={colors}
          />
        </View>
      </View>
    </Screen>
  );
}

function InfoRow({
  icon,
  label,
  value,
  theme,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  theme: ThemeTokens;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <Ionicons name={icon} size={18} color={theme.icon} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.muted, fontSize: 13 }}>{label}</Text>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function ActionIcon({
  icon,
  onPress,
  theme,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  theme: ThemeTokens;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.border,
        borderWidth: 1,
        width: 42,
        height: 42,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name={icon} size={18} color={colors.text} />
    </TouchableOpacity>
  );
}

function StatsCard({
  title,
  value,
  subtitle,
  fullWidth,
  theme,
  colors,
}: {
  title: string;
  value: string;
  subtitle: string;
  fullWidth?: boolean;
  theme: ThemeTokens;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  return (
    <Card
      style={{
        flex: fullWidth ? undefined : 1,
        width: fullWidth ? "100%" : undefined,
        alignItems: "center",
        backgroundColor: theme.cardBg,
        borderColor: theme.border,
      }}
    >
      <Text style={{ color: colors.muted, fontSize: 13 }}>{title}</Text>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: "800" }}>
        {value}
      </Text>
      <Text style={{ color: colors.muted, fontSize: 12 }}>{subtitle}</Text>
    </Card>
  );
}

