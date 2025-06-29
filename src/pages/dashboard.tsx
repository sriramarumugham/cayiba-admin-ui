import { useState } from "react";
import { useDashboardStats, useDashboardGraph } from "@/api/query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Package, ShoppingCart, AlertTriangle } from "lucide-react";

const PERIOD_OPTIONS = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "1y", label: "Last 1 year" },
] as const;

const chartConfig = {
  advertisements: {
    label: "Advertisements",
    color: "hsl(var(--chart-1))",
  },
  views: {
    label: "Views",
    color: "hsl(var(--chart-2))",
  },
};

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "7d" | "30d" | "90d" | "1y"
  >("30d");

  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats();
  const {
    data: graphData,
    isLoading: graphLoading,
    error: graphError,
  } = useDashboardGraph(selectedPeriod);

  const stats = statsData?.data;
  const graph = graphData?.data;

  if (statsError || graphError) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold text-destructive mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-muted-foreground">
            Failed to load dashboard data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of your advertisement platform performance
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Advertisements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Advertisements
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {stats?.totalAdvertisements?.toLocaleString() || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              All time advertisements
            </p>
          </CardContent>
        </Card>

        {/* Active Advertisements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Advertisements
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {stats?.activeAdvertisements?.toLocaleString() || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        {/* Blocked Advertisements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Blocked Advertisements
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-red-600">
                {stats?.blockedAdvertisements?.toLocaleString() || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Currently blocked</p>
          </CardContent>
        </Card>

        {/* Available Inventory */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Inventory
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-blue-600">
                {stats?.availableInventory?.toLocaleString() || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Items available for sale
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Advertisement Status */}
        <Card>
          <CardHeader>
            <CardTitle>Advertisement Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {statsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">
                      {stats?.activeAdvertisements || 0}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {stats?.totalAdvertisements
                        ? Math.round(
                            (stats.activeAdvertisements /
                              stats.totalAdvertisements) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Blocked</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">
                      {stats?.blockedAdvertisements || 0}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {stats?.totalAdvertisements
                        ? Math.round(
                            (stats.blockedAdvertisements /
                              stats.totalAdvertisements) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Deleted</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {stats?.deletedAdvertisements || 0}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {stats?.totalAdvertisements
                        ? Math.round(
                            (stats.deletedAdvertisements /
                              stats.totalAdvertisements) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Inventory Status */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {statsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Available</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">
                      {stats?.availableInventory || 0}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {stats?.totalAdvertisements
                        ? Math.round(
                            (stats.availableInventory /
                              stats.totalAdvertisements) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sold</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">
                      {stats?.soldInventory || 0}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {stats?.totalAdvertisements
                        ? Math.round(
                            (stats.soldInventory / stats.totalAdvertisements) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Unlisted</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {stats?.unlistedInventory || 0}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {stats?.totalAdvertisements
                        ? Math.round(
                            (stats.unlistedInventory /
                              stats.totalAdvertisements) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Advertisement Trends</CardTitle>
            <Select
              value={selectedPeriod}
              onValueChange={(value: "7d" | "30d" | "90d" | "1y") =>
                setSelectedPeriod(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {PERIOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {graphLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <Skeleton className="h-[400px] w-full" />
            </div>
          ) : graph?.data && graph.data.length > 0 ? (
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={graph.data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString()
                    }
                  />
                  <YAxis className="text-xs" />
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;

                      return (
                        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium text-sm">
                            {label ? new Date(label).toLocaleDateString() : ""}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Advertisements: {payload[0]?.value || 0}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No data available for the selected period</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
