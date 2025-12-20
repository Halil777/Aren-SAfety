import { useMemo, useState } from "react";
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { useObservationsQuery } from "@/features/observations/api/hooks";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type DateRange = {
  startDate: string;
  endDate: string;
};

export function ObservationsDashboard() {
  const { t } = useTranslation();
  const { data: observations, isLoading } = useObservationsQuery();
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "",
    endDate: "",
  });
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<number | "all">(
    "all"
  );

  // Filter observations based on date range and risk level
  const filteredObservations = useMemo(() => {
    if (!observations) return [];

    let filtered = observations;

    if (dateRange.startDate) {
      filtered = filtered.filter((obs) => {
        const createdAt = obs.createdAt ? new Date(obs.createdAt) : null;
        return createdAt && createdAt >= new Date(dateRange.startDate);
      });
    }

    if (dateRange.endDate) {
      filtered = filtered.filter((obs) => {
        const createdAt = obs.createdAt ? new Date(obs.createdAt) : null;
        return createdAt && createdAt <= new Date(dateRange.endDate);
      });
    }

    if (selectedRiskLevel !== "all") {
      filtered = filtered.filter((obs) => obs.riskLevel === selectedRiskLevel);
    }

    return filtered;
  }, [observations, dateRange, selectedRiskLevel]);

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();

    const opened = filteredObservations.filter(
      (obs) => obs.status !== "CLOSED"
    ).length;
    const closed = filteredObservations.filter(
      (obs) => obs.status === "CLOSED"
    ).length;
    const overdue = filteredObservations.filter((obs) => {
      if (obs.status === "CLOSED") return false;
      const deadline = obs.deadline ? new Date(obs.deadline) : null;
      return deadline && deadline < now;
    }).length;

    return { opened, closed, overdue };
  }, [filteredObservations]);

  // Department data for chart
  const departmentData = useMemo(() => {
    const departmentMap = new Map<string, number>();

    filteredObservations.forEach((obs) => {
      const deptName = obs.department?.name || "Unknown";
      departmentMap.set(deptName, (departmentMap.get(deptName) || 0) + 1);
    });

    return Array.from(departmentMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredObservations]);

  // Project data for chart
  const projectData = useMemo(() => {
    const projectMap = new Map<string, number>();

    filteredObservations.forEach((obs) => {
      const projectName = obs.project?.name || "Unknown";
      projectMap.set(projectName, (projectMap.get(projectName) || 0) + 1);
    });

    return Array.from(projectMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredObservations]);

  // Location data
  const locationData = useMemo(() => {
    const locationMap = new Map<string, number>();

    filteredObservations.forEach((obs) => {
      const locationName = obs.location?.name || "Unknown";
      locationMap.set(locationName, (locationMap.get(locationName) || 0) + 1);
    });

    return Array.from(locationMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredObservations]);

  // Top 5 Supervisors data
  const supervisorData = useMemo(() => {
    const supervisorMap = new Map<string, number>();

    filteredObservations.forEach((obs) => {
      const supervisorName = obs.supervisor?.fullName || "Unassigned";
      supervisorMap.set(
        supervisorName,
        (supervisorMap.get(supervisorName) || 0) + 1
      );
    });

    return Array.from(supervisorMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredObservations]);

  const CHART_COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f97316",
  ];

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange((prev) => ({ ...prev, startDate: e.target.value }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange((prev) => ({ ...prev, endDate: e.target.value }));
  };

  const resetFilters = () => {
    setDateRange({ startDate: "", endDate: "" });
    setSelectedRiskLevel("all");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">
          {t("dashboard.loadingObservations")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {t("dashboard.observationsDashboard")}
        </h2>
        <p className="text-muted-foreground mt-2">
          {t("dashboard.observationsDashboardDescription")}
        </p>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {t("dashboard.filters")}
          </CardTitle>
          <CardDescription>
            {t("dashboard.filterByDateAndRisk")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label
                  htmlFor="startDate"
                  className="text-sm font-medium mb-2 block"
                >
                  {t("dashboard.startDate")}
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={dateRange.startDate}
                  onChange={handleStartDateChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="endDate"
                  className="text-sm font-medium mb-2 block"
                >
                  {t("dashboard.endDate")}
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={dateRange.endDate}
                  onChange={handleEndDateChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="riskLevel"
                  className="text-sm font-medium mb-2 block"
                >
                  {t("dashboard.riskLevel")}
                </label>
                <select
                  id="riskLevel"
                  value={selectedRiskLevel}
                  onChange={(e) =>
                    setSelectedRiskLevel(
                      e.target.value === "all" ? "all" : Number(e.target.value)
                    )
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="all">{t("dashboard.allLevels")}</option>
                  <option value="1">{t("dashboard.level1Low")}</option>
                  <option value="2">{t("dashboard.level2")}</option>
                  <option value="3">{t("dashboard.level3Medium")}</option>
                  <option value="4">{t("dashboard.level4")}</option>
                  <option value="5">{t("dashboard.level5High")}</option>
                </select>
              </div>
              <button
                onClick={resetFilters}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                {t("dashboard.resetFilters")}
              </button>
            </div>
            <div className="text-sm text-muted-foreground">
              {t("dashboard.showingObservations", {
                filtered: filteredObservations.length,
                total: observations?.length || 0,
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-blue-500/25 bg-blue-500/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm">
                {t("dashboard.openObservationsCard")}
              </CardDescription>
              <div className="rounded-full bg-blue-500/20 p-2">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-4xl font-bold">{stats.opened}</CardTitle>
            <p className="text-xs text-muted-foreground mt-2">
              {t("dashboard.currentlyActiveObservations")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-500/25 bg-green-500/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm">
                {t("dashboard.closedObservationsCard")}
              </CardDescription>
              <div className="rounded-full bg-green-500/20 p-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-4xl font-bold">{stats.closed}</CardTitle>
            <p className="text-xs text-muted-foreground mt-2">
              {t("dashboard.successfullyCompleted")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/25 bg-amber-500/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm">
                {t("dashboard.overdueObservationsCard")}
              </CardDescription>
              <div className="rounded-full bg-amber-500/20 p-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-4xl font-bold">
              {stats.overdue}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-2">
              {t("dashboard.pastDeadline")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Departments Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.observationsByDepartment")}</CardTitle>
            <CardDescription>
              {t("dashboard.distributionAcrossDepartments")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {departmentData.length === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                {t("dashboard.noDataAvailable")}
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departmentData}
                    margin={{ left: 0, right: 0, top: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projects Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.observationsByProject")}</CardTitle>
            <CardDescription>
              {t("dashboard.distributionAcrossProjects")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projectData.length === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                {t("dashboard.noDataAvailable")}
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Pie
                      data={projectData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      label={(entry) => entry.name}
                    >
                      {projectData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
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

      {/* Location and Supervisor Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Location Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {t("dashboard.observationsByLocation")}
            </CardTitle>
            <CardDescription>
              {t("dashboard.numberOfObservationsAtEachLocation")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {locationData.length === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                {t("dashboard.noDataAvailable")}
              </div>
            ) : (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={locationData}
                    margin={{ left: 0, right: 0, top: 10, bottom: 60 }}
                    layout="horizontal"
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {locationData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top 5 Supervisors Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {t("dashboard.top5Supervisors")}
            </CardTitle>
            <CardDescription>
              {t("dashboard.supervisorsWithMostObservations")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {supervisorData.length === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                {t("dashboard.noDataAvailable")}
              </div>
            ) : (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={supervisorData}
                    margin={{ left: 0, right: 0, top: 10, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
