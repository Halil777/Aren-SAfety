import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Filter,
  RefreshCw,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { PageHeader } from "@/shared/ui/page-header";
import { useDashboardStats } from "../api/use-dashboard-stats";
import { useObservationsQuery } from "@/features/observations/api/hooks";
import type { Observation } from "@/features/observations/types/observation";
import type { MonthlyActivityPoint } from "../types";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function formatMonthLabel(value: string): string {
  const [yearStr, monthStr] = value.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  if (!Number.isNaN(year) && !Number.isNaN(month) && months[month - 1]) {
    return `${months[month - 1]} ${String(year).slice(2)}`;
  }
  return value;
}

/** ---------- Small UI primitives (pure Tailwind) ---------- */

function Surface({
  title,
  description,
  right,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div className="space-y-1">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        {description ? (
          <div className="text-xs text-muted-foreground">{description}</div>
        ) : null}
      </div>
      {right ? (
        <div className="flex flex-wrap items-center gap-2">{right}</div>
      ) : null}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  icon,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
        "hover:-translate-y-0.5 hover:shadow-sm",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background text-foreground hover:border-primary/40 hover:text-primary"
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="inline-flex rounded-full border border-border bg-muted/30 p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cx(
              "rounded-full px-3 py-1.5 text-xs font-semibold transition",
              active
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function StatTile({
  label,
  value,
  sub,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "neutral" | "info" | "warn" | "good";
}) {
  const toneBorder =
    tone === "info"
      ? "border-primary/25"
      : tone === "warn"
      ? "border-amber-500/25"
      : tone === "good"
      ? "border-emerald-500/25"
      : "border-border/60";

  const toneGlow =
    tone === "info"
      ? "from-primary/12 via-primary/6 to-transparent"
      : tone === "warn"
      ? "from-amber-500/12 via-amber-500/6 to-transparent"
      : tone === "good"
      ? "from-emerald-500/12 via-emerald-500/6 to-transparent"
      : "from-muted/40 via-muted/10 to-transparent";

  return (
    <Card
      className={cx(
        "group relative overflow-hidden transition",
        "hover:-translate-y-0.5 hover:shadow-lg",
        toneBorder
      )}
    >
      <div
        className={cx(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition group-hover:opacity-100",
          toneGlow
        )}
      />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardDescription className="text-xs">{label}</CardDescription>
            <CardTitle className="text-3xl font-semibold tracking-tight">
              {value}
            </CardTitle>
          </div>
          <div className="rounded-2xl border border-border bg-background/60 p-2 shadow-sm">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {sub ? <p className="text-sm text-muted-foreground">{sub}</p> : null}
        {/* micro “sparkline” placeholder: purely decorative */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted/40">
          <div className="h-2 w-2/3 rounded-full bg-primary/60 transition group-hover:w-3/4" />
        </div>
      </CardContent>
    </Card>
  );
}

/** ---------- Page ---------- */

export function DashboardPageV2() {
  const { t } = useTranslation();
  const { data, isLoading, refetch, isFetching } = useDashboardStats();
  const { data: observations, isLoading: isObservationsLoading } =
    useObservationsQuery();

  const [statusFilter, setStatusFilter] = useState<"ALL" | "OPEN" | "CLOSED">(
    "ALL"
  );
  const [rangeFilter, setRangeFilter] = useState<30 | 90 | 180 | "ALL">("ALL");

  const now = useMemo(() => new Date(), []);
  const rangeDate = useMemo(() => {
    if (rangeFilter === "ALL") return null;
    const d = new Date();
    d.setDate(d.getDate() - rangeFilter);
    return d;
  }, [rangeFilter]);

  const filteredObservations = useMemo(() => {
    if (!observations) return [];
    return observations.filter((obs) => {
      if (statusFilter === "OPEN" && obs.status === "CLOSED") return false;
      if (statusFilter === "CLOSED" && obs.status !== "CLOSED") return false;
      if (rangeDate) {
        const created = obs.createdAt ? new Date(obs.createdAt) : null;
        if (!created || Number.isNaN(created.getTime()) || created < rangeDate)
          return false;
      }
      return true;
    });
  }, [observations, statusFilter, rangeDate]);

  const windowOpenCount = filteredObservations.filter(
    (o) => o.status !== "CLOSED"
  ).length;
  const windowClosedCount = filteredObservations.filter(
    (o) => o.status === "CLOSED"
  ).length;

  const windowOverdueCount = filteredObservations.filter((obs) => {
    if (obs.status === "CLOSED") return false;
    const deadline = obs.deadline ? new Date(obs.deadline) : null;
    return deadline ? deadline < now : false;
  }).length;

  const statusBreakdown = useMemo(() => {
    const map = new Map<Observation["status"], number>();
    filteredObservations.forEach((obs) =>
      map.set(obs.status, (map.get(obs.status) ?? 0) + 1)
    );
    return Array.from(map.entries())
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredObservations]);

  const monthlyFlow = useMemo(() => {
    const byMonth = new Map<string, { opened: number; closed: number }>();
    filteredObservations.forEach((obs) => {
      const createdAt = obs.createdAt ? new Date(obs.createdAt) : null;
      if (createdAt && !Number.isNaN(createdAt.getTime())) {
        const key = `${createdAt.getFullYear()}-${String(
          createdAt.getMonth() + 1
        ).padStart(2, "0")}`;
        const cur = byMonth.get(key) ?? { opened: 0, closed: 0 };
        cur.opened += 1;
        byMonth.set(key, cur);
      }
      if (obs.status === "CLOSED" && obs.closedAt) {
        const closedAt = new Date(obs.closedAt);
        if (!Number.isNaN(closedAt.getTime())) {
          const key = `${closedAt.getFullYear()}-${String(
            closedAt.getMonth() + 1
          ).padStart(2, "0")}`;
          const cur = byMonth.get(key) ?? { opened: 0, closed: 0 };
          cur.closed += 1;
          byMonth.set(key, cur);
        }
      }
    });

    return Array.from(byMonth.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, counts]) => ({
        month,
        ...counts,
        total: counts.opened + counts.closed,
      }));
  }, [filteredObservations]);

  const activity = (data?.monthlyActivity ?? []) as MonthlyActivityPoint[];
  const pieData = statusBreakdown.map((x) => ({
    name: x.status,
    value: x.count,
  }));

  const closedCount =
    data?.observationStatus?.find((x) => x.status === "CLOSED")?.count ?? 0;

  const loading = isLoading || isObservationsLoading;

  const PIE_COLORS = [
    "#0ea5e9",
    "#22c55e",
    "#f59e0b",
    "#a855f7",
    "#ef4444",
    "#64748b",
  ];

  const activeFilterLabel = useMemo(() => {
    const statusLabel =
      statusFilter === "ALL"
        ? t("common.all", { defaultValue: "All" })
        : statusFilter === "OPEN"
        ? t("common.open", { defaultValue: "Open" })
        : t("common.closed", { defaultValue: "Closed" });

    const rangeLabel =
      rangeFilter === "ALL"
        ? t("dashboard.allTime", { defaultValue: "All time" })
        : t("dashboard.lastDays", {
            defaultValue: "Last {{days}} days",
            days: rangeFilter,
          });

    return `${statusLabel} · ${rangeLabel}`;
  }, [statusFilter, rangeFilter, t]);

  const resetFilters = () => {
    setStatusFilter("ALL");
    setRangeFilter("ALL");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <PageHeader
          title={t("pages.dashboard.title")}
          description={t("pages.dashboard.description")}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Chip active icon={<Filter className="h-4 w-4" />}>
            {activeFilterLabel}
          </Chip>

          <Chip
            onClick={() => refetch()}
            icon={
              <RefreshCw
                className={cx("h-4 w-4", isFetching && "animate-spin")}
              />
            }
          >
            {t("common.refresh", { defaultValue: "Refresh" })}
          </Chip>

          <Chip onClick={resetFilters} icon={<X className="h-4 w-4" />}>
            {t("common.reset", { defaultValue: "Reset" })}
          </Chip>
        </div>
      </div>

      {/* “Health / Overview” tiles (GLOBAL) */}
      <Surface
        title={
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            {t("pages.dashboard.title")} ·{" "}
            {t("dashboard.allTime", { defaultValue: "All time" })}
          </span>
        }
        description={t("pages.dashboard.description")}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatTile
          label={t("dashboard.activeUsers")}
          value={
            loading ? "…" : (data?.counts?.activeUsers ?? 0).toLocaleString()
          }
          sub={
            loading
              ? ""
              : t("dashboard.activeUsersHelper", {
                  supervisors: data?.counts?.supervisors ?? 0,
                })
          }
          icon={Users}
          tone="info"
        />
        <StatTile
          label={t("dashboard.openObservations")}
          value={
            loading
              ? "…"
              : (data?.counts?.openObservations ?? 0).toLocaleString()
          }
          sub={
            loading
              ? ""
              : t("dashboard.closedObservationsHelper", { count: closedCount })
          }
          icon={ClipboardList}
          tone="warn"
        />
        <StatTile
          label={t("dashboard.supervisors")}
          value={
            loading ? "…" : (data?.counts?.supervisors ?? 0).toLocaleString()
          }
          sub={loading ? "" : t("dashboard.supervisorsHelper")}
          icon={ShieldCheck}
          tone="good"
        />
      </div>

      {/* Filter panel (new UX) */}
      <Card className="border-border/60 bg-gradient-to-br from-background to-muted/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            {t("dashboard.filters", { defaultValue: "Filters" })}
          </CardTitle>
          <CardDescription>
            {t("dashboard.filtersHelper", {
              defaultValue: "Tune the view by status and period.",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="text-xs font-semibold text-muted-foreground">
              {t("dashboard.status", { defaultValue: "Status" })}
            </div>
            <Segmented
              value={statusFilter}
              onChange={(v) => setStatusFilter(v as any)}
              options={[
                {
                  value: "ALL",
                  label: t("common.all", { defaultValue: "All" }),
                },
                {
                  value: "OPEN",
                  label: t("common.open", { defaultValue: "Open" }),
                },
                {
                  value: "CLOSED",
                  label: t("common.closed", { defaultValue: "Closed" }),
                },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-xs font-semibold text-muted-foreground">
              {t("dashboard.period", { defaultValue: "Period" })}
            </div>
            <div className="flex flex-wrap gap-2">
              {[30, 90, 180, "ALL" as const].map((opt: any) => (
                <Chip
                  key={String(opt)}
                  active={rangeFilter === opt}
                  onClick={() => setRangeFilter(opt)}
                  icon={<CalendarDays className="h-4 w-4" />}
                >
                  {opt === "ALL"
                    ? t("dashboard.allTime", { defaultValue: "All time" })
                    : t("dashboard.lastDays", {
                        defaultValue: "Last {{days}} days",
                        days: opt,
                      })}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-border bg-background/60 px-4 py-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">
                {t("dashboard.datasetSize", {
                  defaultValue: "Records in view",
                })}
              </div>
              <div className="text-lg font-semibold">
                {filteredObservations.length.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Window insights (no duplicate global KPI vibe) */}
      <Surface
        title={t("dashboard.insights", { defaultValue: "Insights" })}
        description={t("dashboard.activeWindow", {
          defaultValue: "Within selected window",
        })}
        right={
          <>
            <Chip active icon={<AlertTriangle className="h-4 w-4" />}>
              {t("dashboard.overdue", { defaultValue: "Overdue" })}:{" "}
              {windowOverdueCount}
            </Chip>
            <Chip active icon={<ClipboardList className="h-4 w-4" />}>
              {t("common.open", { defaultValue: "Open" })}: {windowOpenCount}
            </Chip>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/25 bg-primary/5 transition hover:-translate-y-0.5 hover:shadow-lg">
          <CardHeader className="pb-2">
            <CardDescription>
              {t("common.open", { defaultValue: "Open" })}
            </CardDescription>
            <CardTitle className="text-3xl">
              {windowOpenCount.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {t("dashboard.activeWindow", {
              defaultValue: "Within selected window",
            })}
          </CardContent>
        </Card>

        <Card className="border-emerald-500/25 bg-emerald-500/5 transition hover:-translate-y-0.5 hover:shadow-lg">
          <CardHeader className="pb-2">
            <CardDescription>
              {t("common.closed", { defaultValue: "Closed" })}
            </CardDescription>
            <CardTitle className="text-3xl">
              {windowClosedCount.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {t("dashboard.closedHelper", {
              defaultValue: "Completed in the selected window",
            })}
          </CardContent>
        </Card>

        <Card className="border-amber-500/25 bg-amber-500/5 transition hover:-translate-y-0.5 hover:shadow-lg">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardDescription>
                {t("dashboard.overdue", { defaultValue: "Overdue" })}
              </CardDescription>
              <CardTitle className="text-3xl">
                {windowOverdueCount.toLocaleString()}
              </CardTitle>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-500/15 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {t("dashboard.overdueHelper", {
              defaultValue: "Open items past deadline",
            })}
          </CardContent>
        </Card>
      </div>

      {/* Charts (same datasets, new framing) */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 border-border/60 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {t("dashboard.tenantActivity")}
            </CardTitle>
            <CardDescription>
              {t("dashboard.tenantActivityDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activity.length === 0 ? (
              <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                {t("dashboard.emptyState")}
              </div>
            ) : (
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={activity.map((x) => ({
                      month: formatMonthLabel(x.month),
                      observations: x.observations,
                      tasks: x.tasks,
                    }))}
                    margin={{ left: 8, right: 8, top: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 12 }} />
                    <Bar dataKey="observations" radius={[10, 10, 0, 0]} />
                    <Bar dataKey="tasks" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              {t("dashboard.statusBreakdown", {
                defaultValue: "Status breakdown",
              })}
            </CardTitle>
            <CardDescription>
              {t("dashboard.statusBreakdownHelper", {
                defaultValue: "Share of observations by status",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <div className="flex h-52 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                {t("dashboard.emptyState")}
              </div>
            ) : (
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip contentStyle={{ borderRadius: 12 }} />
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={46}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {pieData.map((_, idx) => (
                        <Cell
                          key={idx}
                          fill={PIE_COLORS[idx % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {t("dashboard.flow", { defaultValue: "Opened vs closed" })}
          </CardTitle>
          <CardDescription>
            {t("dashboard.flowHelper", {
              defaultValue: "Trend by month within selected filters",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {monthlyFlow.length === 0 ? (
            <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              {t("dashboard.emptyState")}
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyFlow.map((x) => ({
                    month: formatMonthLabel(x.month),
                    opened: x.opened,
                    closed: x.closed,
                  }))}
                  margin={{ left: 8, right: 8, top: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 12 }} />
                  <Area
                    type="monotone"
                    dataKey="opened"
                    strokeWidth={2}
                    fillOpacity={0.18}
                  />
                  <Area
                    type="monotone"
                    dataKey="closed"
                    strokeWidth={2}
                    fillOpacity={0.18}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
