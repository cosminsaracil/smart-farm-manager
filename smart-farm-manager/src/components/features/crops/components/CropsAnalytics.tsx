import { useState, useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";
import { Calendar, MapPin, Sprout, TrendingUp, Filter } from "lucide-react";
import type { Crop } from "@/utils/hooks/api/crops/types";

// Mock theme constants - replace with your actual imports
const NIVO_THEME_DARK = {
  axis: { ticks: { text: { fill: "#9ca3af" } } },
  grid: { line: { stroke: "#374151" } },
  legends: { text: { fill: "#9ca3af" } },
};

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export const CropsAnalytics = ({ data }: { data: Crop[] }) => {
  const [filters, setFilters] = useState({
    cropType: "all",
    location: "all",
    soilType: "all",
    status: "all",
  });

  const [sortBy, setSortBy] = useState("name");

  // Extract unique values for filters
  const filterOptions = useMemo(() => {
    const types = new Set();
    const locations = new Set();
    const soils = new Set();

    data?.forEach((crop) => {
      types.add(crop.type);
      locations.add(crop.field_id?.location);
      soils.add(crop.field_id?.soil_type);
    });

    return {
      types: Array.from(types).filter(Boolean),
      locations: Array.from(locations).filter(Boolean),
      soils: Array.from(soils).filter(Boolean),
    };
  }, [data]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    if (!data) return [];

    let filtered = data.filter((crop) => {
      if (filters.cropType !== "all" && crop.type !== filters.cropType)
        return false;
      if (
        filters.location !== "all" &&
        crop.field_id?.location !== filters.location
      )
        return false;
      if (
        filters.soilType !== "all" &&
        crop.field_id?.soil_type !== filters.soilType
      )
        return false;

      if (filters.status !== "all") {
        const isHarvested =
          crop.harvest_date && new Date(crop.harvest_date) < new Date();
        const isActive =
          crop.planting_date &&
          new Date(crop.planting_date) <= new Date() &&
          (!crop.harvest_date || new Date(crop.harvest_date) >= new Date());
        const isPlanned =
          crop.planting_date && new Date(crop.planting_date) > new Date();

        if (filters.status === "harvested" && !isHarvested) return false;
        if (filters.status === "active" && !isActive) return false;
        if (filters.status === "planned" && !isPlanned) return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "area":
          return (b.field_id?.area || 0) - (a.field_id?.area || 0);
        case "planting_date":
          return new Date(b.planting_date) - new Date(a.planting_date);
        default:
          return 0;
      }
    });

    return filtered;
  }, [data, filters, sortBy]);

  // Statistics calculations
  const statistics = useMemo(() => {
    if (!filteredData.length) return null;

    const totalArea = filteredData.reduce(
      (sum, crop) => sum + (crop.field_id?.area || 0),
      0
    );
    const avgArea = totalArea / filteredData.length;

    const harvested = filteredData.filter(
      (c) => c.harvest_date && new Date(c.harvest_date) < new Date()
    ).length;
    const active = filteredData.filter((c) => {
      const planted = new Date(c.planting_date) <= new Date();
      const notHarvested =
        !c.harvest_date || new Date(c.harvest_date) >= new Date();
      return planted && notHarvested;
    }).length;
    const planned = filteredData.filter(
      (c) => new Date(c.planting_date) > new Date()
    ).length;

    return {
      total: filteredData.length,
      totalArea: totalArea.toFixed(2),
      avgArea: avgArea.toFixed(2),
      harvested,
      active,
      planned,
    };
  }, [filteredData]);

  // Crop type distribution
  const cropTypeData = useMemo(() => {
    const distribution = {};
    filteredData.forEach((crop) => {
      distribution[crop.type] = (distribution[crop.type] || 0) + 1;
    });

    return Object.entries(distribution).map(([type, count], idx) => ({
      id: type,
      label: type,
      value: count,
      color: COLORS[idx % COLORS.length],
    }));
  }, [filteredData]);

  // Area by location
  const areaByLocation = useMemo(() => {
    const locationData = {};
    filteredData.forEach((crop) => {
      const loc = crop.field_id?.location || "Unknown";
      locationData[loc] = (locationData[loc] || 0) + (crop.field_id?.area || 0);
    });

    return Object.entries(locationData).map(([location, area]) => ({
      location,
      area: parseFloat(area.toFixed(2)),
    }));
  }, [filteredData]);

  // Timeline data (crops by month)
  const timelineData = useMemo(() => {
    const monthCounts = {};

    filteredData.forEach((crop) => {
      const date = new Date(crop.planting_date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
    });

    const sorted = Object.entries(monthCounts).sort();

    return [
      {
        id: "Plantings",
        data: sorted.map(([month, count]) => ({
          x: month,
          y: count,
        })),
      },
    ];
  }, [filteredData]);

  // Soil type distribution
  const soilTypeData = useMemo(() => {
    const distribution = {};
    filteredData.forEach((crop) => {
      const soil = crop.field_id?.soil_type || "Unknown";
      distribution[soil] = (distribution[soil] || 0) + 1;
    });

    return Object.entries(distribution).map(([type, count]) => ({
      soil: type,
      count,
    }));
  }, [filteredData]);

  if (!data || data.length === 0) {
    return <div className="p-6 text-gray-400">No crops data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">
            Filters & Sorting
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Crop Type
            </label>
            <select
              value={filters.cropType}
              onChange={(e) =>
                setFilters({ ...filters, cropType: e.target.value })
              }
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="all">All Types</option>
              {filterOptions.types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Location</label>
            <select
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="all">All Locations</option>
              {filterOptions.locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Soil Type
            </label>
            <select
              value={filters.soilType}
              onChange={(e) =>
                setFilters({ ...filters, soilType: e.target.value })
              }
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="all">All Soils</option>
              {filterOptions.soils.map((soil) => (
                <option key={soil} value={soil}>
                  {soil}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="harvested">Harvested</option>
              <option value="planned">Planned</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="name">Name</option>
              <option value="area">Area (Largest)</option>
              <option value="planting_date">Planting Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Sprout className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Total Crops</span>
            </div>
            <p className="text-2xl font-bold text-white">{statistics.total}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Total Area</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {statistics.totalArea} ha
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400">Avg Area</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {statistics.avgArea} ha
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-green-700 bg-green-900/20">
            <span className="text-sm text-gray-400">Active</span>
            <p className="text-2xl font-bold text-green-400">
              {statistics.active}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-blue-700 bg-blue-900/20">
            <span className="text-sm text-gray-400">Harvested</span>
            <p className="text-2xl font-bold text-blue-400">
              {statistics.harvested}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-yellow-700 bg-yellow-900/20">
            <span className="text-sm text-gray-400">Planned</span>
            <p className="text-2xl font-bold text-yellow-400">
              {statistics.planned}
            </p>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crop Type Distribution */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Crop Type Distribution
          </h3>
          <div className="h-80">
            <ResponsivePie
              data={cropTypeData}
              margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ datum: "data.color" }}
              borderWidth={1}
              borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#9ca3af"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: "color" }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor="#ffffff"
              theme={NIVO_THEME_DARK}
            />
          </div>
        </div>

        {/* Area by Location */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Total Area by Location
          </h3>
          <div className="h-80">
            <ResponsiveBar
              data={areaByLocation}
              keys={["area"]}
              indexBy="location"
              margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: "linear" }}
              colors={COLORS[0]}
              borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: "Location",
                legendPosition: "middle",
                legendOffset: 45,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Area (ha)",
                legendPosition: "middle",
                legendOffset: -50,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor="#ffffff"
              theme={NIVO_THEME_DARK}
              role="application"
            />
          </div>
        </div>

        {/* Planting Timeline */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Planting Timeline
          </h3>
          <div className="h-80">
            <ResponsiveLine
              data={timelineData}
              margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
              xScale={{ type: "point" }}
              yScale={{
                type: "linear",
                min: "auto",
                max: "auto",
                stacked: false,
              }}
              curve="monotoneX"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: "Month",
                legendOffset: 45,
                legendPosition: "middle",
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Number of Crops",
                legendOffset: -50,
                legendPosition: "middle",
              }}
              colors={COLORS}
              pointSize={10}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              pointLabelYOffset={-12}
              useMesh={true}
              theme={NIVO_THEME_DARK}
            />
          </div>
        </div>

        {/* Soil Type Distribution */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Crops by Soil Type
          </h3>
          <div className="h-80">
            <ResponsiveBar
              data={soilTypeData}
              keys={["count"]}
              indexBy="soil"
              margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
              padding={0.3}
              layout="horizontal"
              valueScale={{ type: "linear" }}
              colors={COLORS[2]}
              borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Number of Crops",
                legendPosition: "middle",
                legendOffset: 40,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Soil Type",
                legendPosition: "middle",
                legendOffset: -50,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor="#ffffff"
              theme={NIVO_THEME_DARK}
            />
          </div>
        </div>
      </div>

      {/* Crops List */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Crops List ({filteredData.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-700">
              <tr className="text-left text-gray-400">
                <th className="pb-3 font-medium">Crop Name</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Field</th>
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium">Area (ha)</th>
                <th className="pb-3 font-medium">Soil</th>
                <th className="pb-3 font-medium">Planted</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {filteredData.map((crop) => {
                const isHarvested =
                  crop.harvest_date && new Date(crop.harvest_date) < new Date();
                const isActive =
                  new Date(crop.planting_date) <= new Date() &&
                  (!crop.harvest_date ||
                    new Date(crop.harvest_date) >= new Date());
                const status = isHarvested
                  ? "Harvested"
                  : isActive
                  ? "Active"
                  : "Planned";
                const statusColor = isHarvested
                  ? "text-blue-400"
                  : isActive
                  ? "text-green-400"
                  : "text-yellow-400";

                return (
                  <tr
                    key={crop._id}
                    className="border-b border-gray-700/50 hover:bg-gray-700/30"
                  >
                    <td className="py-3 font-medium text-white">{crop.name}</td>
                    <td className="py-3">{crop.type}</td>
                    <td className="py-3">{crop.field_id?.name}</td>
                    <td className="py-3 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {crop.field_id?.location}
                    </td>
                    <td className="py-3">{crop.field_id?.area || 0}</td>
                    <td className="py-3">{crop.field_id?.soil_type}</td>
                    <td className="py-3">
                      {new Date(crop.planting_date).toLocaleDateString()}
                    </td>
                    <td className={`py-3 font-medium ${statusColor}`}>
                      {status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
