import {
  FiltersModal,
  getThemeTokens,
  IconButton,
  LogCard,
} from "./components";
import { Screen } from "@/components/layout/Screen";
import { ObservationDrawer } from "@/components/ObservationDrawer";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/contexts/auth";
import { Language, useLanguage } from "@/contexts/language";
import { useTheme } from "@/contexts/theme";
import { useObservationsQuery } from "@/query/hooks";
import { type ObservationDto } from "@/services/api";
import { translations } from "@/utils/i18n";
import { Period } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const { colors, mode } = useTheme();
  const theme = getThemeTokens(colors, mode);
  const { token, user } = useAuth();

  const { language } = useLanguage();
  const t = translations[language];

  const observationsQuery = useObservationsQuery({
    token,
    scope: user?.id,
  });
  const data = observationsQuery.data ?? [];
  const loading = observationsQuery.isPending;
  const refreshing = observationsQuery.isFetching && !observationsQuery.isPending;
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<{
    period: Period;
    riskLevels: Set<number>;
    departmentId?: string;
    categoryId?: string;
    companyId?: string;
  }>({
    period: "ALL",
    riskLevels: new Set(),
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filterOptions = useMemo(() => {
    const depts = Array.from(
      new Map(
        data
          .filter((d) => d.departmentId)
          .map((d) => [
            d.departmentId!,
            {
              value: d.departmentId!,
              label: d.departmentName || d.departmentId!,
            },
          ])
      ).values()
    );
    const cats = Array.from(
      new Map(
        data
          .filter((d) => d.categoryId)
          .map((d) => [
            d.categoryId!,
            { value: d.categoryId!, label: d.categoryName || d.categoryId! },
          ])
      ).values()
    );
    const companies = Array.from(
      new Map(
        data
          .filter((d) => d.companyId)
          .map((d) => [
            d.companyId!,
            { value: d.companyId!, label: d.companyName || d.companyId! },
          ])
      ).values()
    );
    return { depts, cats, companies };
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (filters.period === "CLOSED" && item.status !== "CLOSED") return false;
      if (filters.period === "OPEN" && item.status === "CLOSED") return false;
      if (
        filters.riskLevels.size &&
        !filters.riskLevels.has(Number(item.riskLevel))
      )
        return false;
      if (filters.departmentId && item.departmentId !== filters.departmentId)
        return false;
      if (filters.categoryId && item.categoryId !== filters.categoryId)
        return false;
      if (filters.companyId && item.companyId !== filters.companyId)
        return false;
      if (search.trim()) {
        const needle = search.trim().toLowerCase();
        const hay = `${item.workerFullName || ""} ${
          item.description || ""
        }`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [data, filters, search]);

  const resetFilters = () =>
    setFilters({
      period: "ALL",
      riskLevels: new Set(),
      departmentId: undefined,
      categoryId: undefined,
      companyId: undefined,
    });


  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ gap: 2 }}>
            <Text
              style={{
                color: theme.headerAccent,
                fontSize: 22,
                fontWeight: "800",
                textTransform: "uppercase",
              }}
            >
              {t.headerTitle}
            </Text>
            <Text style={{ color: colors.muted, fontSize: 13 }}>
              {t.headerSubtitle}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <IconButton
              icon="filter-outline"
              onPress={() => setShowFilters(true)}
              background={theme.panelBg}
              iconColor={colors.text}
              borderColor={theme.panelBorder}
            />
            <IconButton
              icon="refresh-outline"
              onPress={async () => {
                await observationsQuery.refetch();
              }}
              background={theme.panelBg}
              iconColor={colors.text}
              borderColor={theme.panelBorder}
              spinning={refreshing}
            />
          </View>
        </View>


        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.panelBg,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.panelBorder,
            paddingHorizontal: 14,
            paddingVertical: 10,
            gap: 10,
          }}
        >
          <Ionicons name="search-outline" color={theme.iconTint} size={18} />
          <TextInput
            placeholder={t.searchPlaceholder}
            placeholderTextColor={theme.placeholder}
            style={{ color: colors.text, flex: 1, height: 36 }}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {loading ? (
          <View style={{ alignItems: "center", padding: 40 }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : filtered.length === 0 ? (
          <View style={{ alignItems: "center", padding: 40 }}>
            <Text style={{ color: colors.muted }}>{t.empty}</Text>
          </View>
        ) : (
          filtered.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={() => {
                setSelectedId(item.id);
                setDrawerOpen(true);
              }}
            >
              <LogCard item={item} texts={t} theme={theme} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <FiltersModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
        reset={resetFilters}
        options={filterOptions}
        texts={t}
        theme={theme}
      />

      <ObservationDrawer
        visible={drawerOpen}
        observationId={selectedId}
        token={token}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedId(null);
        }}
        colors={colors}
        language={language}
      />
    </Screen>
  );
}

