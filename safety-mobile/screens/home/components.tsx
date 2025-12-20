import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/theme";
import { Card } from "@/components/ui/Card";
import { type ObservationDto } from "@/services/api";
import { FilterOption, HomeTexts, Period, ThemeTokens } from "@/utils/types";

export function getThemeTokens(
  colors: ReturnType<typeof useTheme>["colors"],
  mode: ReturnType<typeof useTheme>["mode"]
): ThemeTokens {
  const isDark = mode === "dark";
  return {
    isDark,
    panelBg: isDark ? "#0F1C31" : "#E8F1E8",
    panelBorder: isDark ? "#1E3357" : "#C9D7C9",
    cardBg: isDark ? "#0F1C31" : "#F7FAF7",
    cardBorder: isDark ? "#1E3357" : "#D5E2D5",
    chipBg: isDark ? "#1B2F4D" : "#DCE8DC",
    pillBg: isDark ? "#10284D" : "#E0EBE0",
    iconTint: isDark ? "#7AA5FF" : colors.primary,
    placeholder: isDark ? "#6B7DA5" : colors.muted,
    headerAccent: isDark ? "#4E8DFF" : colors.success,
    primary: colors.primary,
  };
}

export function LogCard({
  item,
  texts,
  theme,
}: {
  item: ObservationDto;
  texts: HomeTexts;
  theme: ThemeTokens;
}) {
  const { colors } = useTheme();
  const formattedDate = useMemo(() => {
    const d = item.createdAt ? new Date(item.createdAt) : null;
    return d && !Number.isNaN(d.getTime()) ? d.toLocaleString() : "";
  }, [item.createdAt]);
  const riskHelper = useMemo(
    () => getRiskLevelText(Number(item.riskLevel) || 1, texts),
    [item.riskLevel, texts]
  );
  const firstImage = useMemo(() => {
    const media = item.media ?? [];
    const picture =
      media.find((m) => m.type === "IMAGE" && !m.isCorrective) ??
      media.find((m) => m.type === "IMAGE");
    if (!picture || !picture.url) return null;
    if (
      picture.url.startsWith("http://") ||
      picture.url.startsWith("https://") ||
      picture.url.startsWith("file://") ||
      picture.url.startsWith("data:") ||
      picture.url.startsWith("blob:")
    ) {
      return picture.url;
    }
    return `data:image/jpeg;base64,${picture.url.replace(
      /^data:image\/[a-z]+;base64,/,
      ""
    )}`;
  }, [item.media]);
  const status = getStatusMeta(item.status, texts);

  return (
    <Card
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.cardBorder,
        gap: 8,
        padding: 14,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "800" }}>
          {item.workerFullName || texts.unknownWorker}
        </Text>
        <View style={{ alignItems: "flex-end" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: theme.chipBg,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 12,
            }}
          >
            <Ionicons name="alert-circle" color={colors.primary} size={16} />
            <Text style={{ color: colors.primary, fontWeight: "800" }}>
              {item.riskLevel ?? 0}
            </Text>
          </View>
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>
            {riskHelper}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {firstImage ? (
          <Image
            source={{ uri: firstImage }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              backgroundColor: theme.panelBg,
            }}
            resizeMode="cover"
          />
        ) : null}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              alignSelf: "flex-start",
              backgroundColor: theme.pillBg,
              color: colors.primary,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 10,
              fontSize: 12,
              fontWeight: "700",
            }}
          >
            {item.categoryName || item.categoryId || texts.unknownCategory}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              gap: 8,
              marginTop: 8,
            }}
          >
            <Ionicons name={status.icon} color={status.color} size={16} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: "600" }}>
                {item.supervisorName ||
                  item.supervisorId ||
                  texts.unknownSupervisor}
              </Text>
              <Text style={{ color: colors.muted, fontSize: 12 }}>
                {status.label}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginTop: 6,
            }}
          >
            <Ionicons name="time-outline" color={colors.muted} size={16} />
            <Text style={{ color: colors.muted, fontSize: 12 }}>
              {formattedDate}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

function getRiskLevelText(level: number, texts: HomeTexts): string {
  return texts.riskLevels[level - 1] || texts.riskLevels[0];
}

const getStatusMeta = (status: string | undefined, texts: HomeTexts) => {
  switch (status) {
    case "NEW":
      return {
        icon: "ellipse-outline" as const,
        label: texts.status.new,
        color: "#7AA5FF",
      };
    case "IN_PROGRESS":
      return {
        icon: "time-outline" as const,
        label: texts.status.inProgress,
        color: "#F3C969",
      };
    case "FIXED_PENDING_CHECK":
      return {
        icon: "checkmark-done-outline" as const,
        label: texts.status.fixed,
        color: "#7AE2FF",
      };
    case "REJECTED":
      return {
        icon: "close-circle-outline" as const,
        label: texts.status.rejected,
        color: "#FF7B95",
      };
    case "CLOSED":
      return {
        icon: "shield-checkmark-outline" as const,
        label: texts.status.closed,
        color: "#7CE7B9",
      };
    default:
      return {
        icon: "help-circle-outline" as const,
        label: texts.status.unknown,
        color: "#6B7DA5",
      };
  }
};

export function IconButton({
  icon,
  onPress,
  background,
  iconColor,
  borderColor,
  spinning,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  background: string;
  iconColor: string;
  borderColor: string;
  spinning?: boolean;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: background,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor,
      }}
    >
      {spinning ? (
        <ActivityIndicator color={iconColor} />
      ) : (
        <Ionicons name={icon} size={20} color={iconColor} />
      )}
    </TouchableOpacity>
  );
}

type FiltersModalProps = {
  visible: boolean;
  onClose: () => void;
  filters: {
    period: Period;
    riskLevels: Set<number>;
    departmentId?: string;
    categoryId?: string;
    companyId?: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      period: Period;
      riskLevels: Set<number>;
      departmentId?: string;
      categoryId?: string;
      companyId?: string;
    }>
  >;
  reset: () => void;
  options: {
    depts: FilterOption[];
    cats: FilterOption[];
    companies: FilterOption[];
  };
  texts: HomeTexts;
  theme: ThemeTokens;
};

export function FiltersModal({
  visible,
  onClose,
  filters,
  setFilters,
  reset,
  options,
  texts,
  theme,
}: FiltersModalProps) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: theme.cardBg,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            gap: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ color: colors.primary, fontSize: 20, fontWeight: "800" }}
            >
              {texts.filtersTitle}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={{ gap: 12 }}>
            <Text style={{ color: colors.text, fontWeight: "700" }}>
              {texts.periodLabel}
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {[
                { label: texts.periodAll, value: "ALL" },
                { label: texts.periodClosed, value: "CLOSED" },
                { label: texts.periodOpen, value: "OPEN" },
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() =>
                    setFilters((prev) => ({
                      ...prev,
                      period: opt.value as Period,
                    }))
                  }
                  style={{
                    backgroundColor:
                      filters.period === opt.value
                        ? colors.primary
                        : theme.panelBg,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.panelBorder,
                  }}
                >
                  <Text
                    style={{
                      color:
                        filters.period === opt.value ? "#0B0C10" : colors.text,
                      fontWeight: "700",
                    }}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={{ color: colors.text, fontWeight: "700" }}>
              {texts.riskLabel}
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              {[1, 2, 3, 4, 5].map((level) => {
                const active = filters.riskLevels.has(level);
                return (
                  <TouchableOpacity
                    key={level}
                    onPress={() =>
                      toggleSet(filters.riskLevels, level, (next) =>
                        setFilters((prev) => ({ ...prev, riskLevels: next }))
                      )
                    }
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: active ? colors.primary : theme.panelBorder,
                      backgroundColor: active ? colors.primary : "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: active ? "#0B0C10" : colors.text,
                        fontWeight: "700",
                      }}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Dropdown
              label={texts.deptLabel}
              placeholder={texts.deptPlaceholder}
              value={filters.departmentId}
              options={options.depts}
              onSelect={(val) =>
                setFilters((prev) => ({ ...prev, departmentId: val }))
              }
              theme={theme}
              texts={texts}
            />
            <Dropdown
              label={texts.catLabel}
              placeholder={texts.catPlaceholder}
              value={filters.categoryId}
              options={options.cats}
              onSelect={(val) =>
                setFilters((prev) => ({ ...prev, categoryId: val }))
              }
              theme={theme}
              texts={texts}
            />
            <Dropdown
              label={texts.companyLabel}
              placeholder={texts.companyPlaceholder}
              value={filters.companyId}
              options={options.companies}
              onSelect={(val) =>
                setFilters((prev) => ({ ...prev, companyId: val }))
              }
              theme={theme}
              texts={texts}
            />
          </View>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={reset}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: theme.panelBorder,
                alignItems: "center",
                backgroundColor: theme.panelBg,
              }}
            >
              <Text style={{ color: colors.primary, fontWeight: "700" }}>
                {texts.reset}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 14,
                backgroundColor: colors.primary,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#0B0C10", fontWeight: "800" }}>
                {texts.apply}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function toggleSet(
  current: Set<number>,
  val: number,
  cb: (next: Set<number>) => void
) {
  const next = new Set(current);
  if (next.has(val)) next.delete(val);
  else next.add(val);
  cb(next);
}

function Dropdown({
  label,
  placeholder,
  value,
  options,
  onSelect,
  theme,
  texts,
}: {
  label: string;
  placeholder: string;
  value?: string;
  options: FilterOption[];
  onSelect: (val: string | undefined) => void;
  theme: ThemeTokens;
  texts: HomeTexts;
}) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const selectedLabel = value
    ? options.find((o) => o.value === value)?.label
    : undefined;
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: colors.text, fontWeight: "700" }}>{label}</Text>
      <TouchableOpacity
        onPress={() => setOpen((o) => !o)}
        style={{
          backgroundColor: theme.panelBg,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.panelBorder,
          paddingHorizontal: 12,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: value ? colors.text : theme.placeholder }}>
          {selectedLabel || placeholder}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          color={theme.placeholder}
          size={18}
        />
      </TouchableOpacity>
      {open && options.length > 0 ? (
        <View
          style={{
            backgroundColor: theme.panelBg,
            borderColor: theme.panelBorder,
            borderWidth: 1,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {options.map((opt, idx) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 12,
                borderBottomColor: theme.panelBorder,
                borderBottomWidth: idx === options.length - 1 ? 0 : 1,
              }}
            >
              <Text style={{ color: colors.text }}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => {
              onSelect(undefined);
              setOpen(false);
            }}
            style={{ padding: 12, alignItems: "center" }}
          >
            <Text style={{ color: theme.placeholder }}>{texts.clear}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}
