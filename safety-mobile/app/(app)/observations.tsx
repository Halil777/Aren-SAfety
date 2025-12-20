import { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Screen } from "../../components/layout/Screen";
import { Card } from "../../components/ui/Card";
import { Chip } from "../../components/ui/Chip";
import { useTheme } from "../../contexts/theme";
import { useAuth } from "../../contexts/auth";
import { useLanguage } from "../../contexts/language";
import { useObservationsQuery } from "../../query/hooks";
import { type ObservationDto } from "../../services/api";
import { ObservationDrawer } from "../../components/ObservationDrawer";

export default function ObservationsScreen() {
  const { colors } = useTheme();
  const { token, user } = useAuth();
  const { language } = useLanguage();
  const observationsQuery = useObservationsQuery({ token, scope: user?.id });
  const data = observationsQuery.data ?? [];
  const loading = observationsQuery.isPending;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const statusColor = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return colors.secondary;
      case "FIXED_PENDING_CHECK":
        return colors.accent;
      case "REJECTED":
        return colors.danger ?? colors.accent;
      case "CLOSED":
        return colors.success;
      default:
        return colors.muted;
    }
  };

  const formatDate = (val?: string) => {
    if (!val) return "";
    const d = new Date(val);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleString();
  };

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 12 }}
        refreshControl={
          <RefreshControl
            refreshing={observationsQuery.isFetching && !observationsQuery.isPending}
            tintColor={colors.primary}
            onRefresh={async () => {
              await observationsQuery.refetch();
            }}
          />
        }
      >
        <View style={{ gap: 8 }}>
          <Text style={{ color: colors.text, fontSize: 22, fontWeight: "800" }}>
            Observations
          </Text>
          <Text style={{ color: colors.muted }}>
            Live view of assigned and submitted observations.
          </Text>
        </View>

        {loading ? (
          <View style={{ alignItems: "center", padding: 24 }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : data.length === 0 ? (
          <View style={{ alignItems: "center", padding: 24 }}>
            <Text style={{ color: colors.muted }}>No observations yet.</Text>
          </View>
        ) : (
          data.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={() => {
                setSelectedId(item.id);
                setDrawerOpen(true);
              }}
            >
              <Card style={{ gap: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: colors.text,
                      fontWeight: "700",
                      fontSize: 16,
                    }}
                  >
                    {item.workerFullName}
                  </Text>
                  <Chip
                    label={item.status.replace(/_/g, " ")}
                    selected
                    style={{ backgroundColor: statusColor(item.status) }}
                  />
                </View>
                <Text style={{ color: colors.muted, fontSize: 13 }}>
                  {item.description}
                </Text>
                <View
                  style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                >
                  <Tag
                    label={`Project: ${item.projectName ?? item.projectId}`}
                  />
                  <Tag
                    label={`Dept: ${item.departmentName ?? item.departmentId}`}
                  />
                  {item.companyId ? (
                    <Tag
                      label={`Company: ${item.companyName ?? item.companyId}`}
                    />
                  ) : null}
                  <Tag label={`Risk ${item.riskLevel}`} />
                  <Tag label={`Deadline ${formatDate(item.deadline)}`} />
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

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

const Tag = ({ label }: { label: string }) => (
  <View
    style={{
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: "rgba(255,255,255,0.06)",
      borderColor: "rgba(255,255,255,0.08)",
      borderWidth: 1,
    }}
  >
    <Text style={{ color: "#E5E7EB", fontSize: 12 }}>{label}</Text>
  </View>
);

