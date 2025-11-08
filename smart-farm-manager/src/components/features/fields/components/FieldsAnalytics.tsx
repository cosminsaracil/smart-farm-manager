import { useState, useMemo } from "react";
import { X, BarChart3, TrendingUp, MapPin, Users } from "lucide-react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/Select";
import ContentWrapper from "@/components/ui/content-wrapper";

import type { FieldsAnalyticsProps } from "./types";
import { COLORS } from "@/utils/constants";

export const FieldsAnalytics = ({
  fields,
  open,
  onClose,
}: FieldsAnalyticsProps) => {
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedSoilType, setSelectedSoilType] = useState("all");
  const [selectedFarmer, setSelectedFarmer] = useState("all");

  // Extract unique values for filters
  const { locations, soilTypes, farmers } = useMemo(() => {
    const locs = new Set();
    const soils = new Set();
    const farmersMap = new Map();

    fields.forEach((field) => {
      locs.add(field.location);
      soils.add(field.soil_type);
      if (field.farmer_id && typeof field.farmer_id === "object") {
        farmersMap.set(field.farmer_id._id, field.farmer_id.name);
      }
    });

    return {
      locations: Array.from(locs),
      soilTypes: Array.from(soils),
      farmers: Array.from(farmersMap.entries()).map(([id, name]) => ({
        id,
        name,
      })),
    };
  }, [fields]);

  // Filter fields based on selections
  const filteredFields = useMemo(() => {
    return fields.filter((field) => {
      const locationMatch =
        selectedLocation === "all" || field.location === selectedLocation;
      const soilMatch =
        selectedSoilType === "all" || field.soil_type === selectedSoilType;
      const farmerMatch =
        selectedFarmer === "all" ||
        (field.farmer_id &&
          typeof field.farmer_id === "object" &&
          field.farmer_id._id === selectedFarmer);
      return locationMatch && soilMatch && farmerMatch;
    });
  }, [fields, selectedLocation, selectedSoilType, selectedFarmer]);

  // Calculate statistics
  const stats = useMemo(() => {
    // Top farmers by total area
    const farmerAreas = new Map();
    const farmerFieldCounts = new Map();

    filteredFields.forEach((field) => {
      if (field.farmer_id && typeof field.farmer_id === "object") {
        const farmerId = field.farmer_id._id;
        const farmerName = field.farmer_id.name;
        const currentArea = farmerAreas.get(farmerId) || {
          name: farmerName,
          totalArea: 0,
        };
        farmerAreas.set(farmerId, {
          name: farmerName,
          totalArea: currentArea.totalArea + field.area,
        });

        const currentCount = farmerFieldCounts.get(farmerId) || {
          name: farmerName,
          count: 0,
        };
        farmerFieldCounts.set(farmerId, {
          name: farmerName,
          count: currentCount.count + 1,
        });
      }
    });

    const topFarmersByArea = Array.from(farmerAreas.values())
      .sort((a, b) => b.totalArea - a.totalArea)
      .slice(0, 10)
      .map((f) => ({ farmer: f.name, "Total Area": f.totalArea }));

    const topFarmersByFieldCount = Array.from(farmerFieldCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((f) => ({ farmer: f.name, "Field Count": f.count }));

    // Area by location
    const locationAreas = new Map();
    filteredFields.forEach((field) => {
      const current = locationAreas.get(field.location) || 0;
      locationAreas.set(field.location, current + field.area);
    });

    const areaByLocation = Array.from(locationAreas.entries()).map(
      ([id, value]) => ({
        id,
        label: id,
        value,
      })
    );

    // Fields by soil type
    const soilTypeCounts = new Map();
    filteredFields.forEach((field) => {
      const current = soilTypeCounts.get(field.soil_type) || 0;
      soilTypeCounts.set(field.soil_type, current + 1);
    });

    const fieldsBySoilType = Array.from(soilTypeCounts.entries()).map(
      ([id, value]) => ({
        id,
        label: id,
        value,
      })
    );

    // Total statistics
    const totalArea = filteredFields.reduce(
      (sum, field) => sum + field.area,
      0
    );
    const totalFields = filteredFields.length;
    const avgFieldSize = totalFields > 0 ? totalArea / totalFields : 0;

    return {
      topFarmersByArea,
      topFarmersByFieldCount,
      areaByLocation,
      fieldsBySoilType,
      totalArea,
      totalFields,
      avgFieldSize,
    };
  }, [filteredFields]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <ContentWrapper className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Fields Analytics
            </h2>
          </div>
          <Button onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Filters */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Soil Type
              </label>
              <select
                value={selectedSoilType}
                onChange={(e) => setSelectedSoilType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Soil Types</option>
                {soilTypes.map((soil) => (
                  <option key={soil} value={soil}>
                    {soil}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Farmer
              </label>
              <select
                value={selectedFarmer}
                onChange={(e) => setSelectedFarmer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Farmers</option>
                {farmers.map((farmer) => (
                  <option key={farmer.id} value={farmer.id}>
                    {farmer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">
                    Total Fields
                  </p>
                  <p className="text-3xl font-bold text-blue-900 mt-1">
                    {stats.totalFields}
                  </p>
                </div>
                <MapPin className="w-10 h-10 text-blue-400" />
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">
                    Total Area
                  </p>
                  <p className="text-3xl font-bold text-green-900 mt-1">
                    {stats.totalArea.toFixed(1)} ha
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-400" />
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">
                    Avg Field Size
                  </p>
                  <p className="text-3xl font-bold text-purple-900 mt-1">
                    {stats.avgFieldSize.toFixed(1)} ha
                  </p>
                </div>
                <Users className="w-10 h-10 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Farmers by Total Area */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Farmers by Total Area
              </h3>
              <div style={{ height: 300 }}>
                {stats.topFarmersByArea.length > 0 ? (
                  <ResponsiveBar
                    data={stats.topFarmersByArea}
                    keys={["Total Area"]}
                    indexBy="farmer"
                    margin={{ top: 10, right: 20, bottom: 80, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: "linear" }}
                    colors={["#3b82f6"]}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: -45,
                      legend: "Farmers",
                      legendPosition: "middle",
                      legendOffset: 70,
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
                    enableLabel={false}
                    tooltip={({ id, value, indexValue }) => (
                      <div className="bg-white px-3 py-2 shadow-lg rounded border border-gray-200">
                        <strong>{indexValue}</strong>
                        <div>{value.toFixed(1)} ha</div>
                      </div>
                    )}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No data available
                  </div>
                )}
              </div>
            </div>

            {/* Top Farmers by Field Count */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Farmers by Field Count
              </h3>
              <div style={{ height: 300 }}>
                {stats.topFarmersByFieldCount.length > 0 ? (
                  <ResponsiveBar
                    data={stats.topFarmersByFieldCount}
                    keys={["Field Count"]}
                    indexBy="farmer"
                    margin={{ top: 10, right: 20, bottom: 80, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: "linear" }}
                    colors={["#10b981"]}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: -45,
                      legend: "Farmers",
                      legendPosition: "middle",
                      legendOffset: 70,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Number of Fields",
                      legendPosition: "middle",
                      legendOffset: -50,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    enableLabel={false}
                    tooltip={({ id, value, indexValue }) => (
                      <div className="bg-white px-3 py-2 shadow-lg rounded border border-gray-200">
                        <strong>{indexValue}</strong>
                        <div>{value} fields</div>
                      </div>
                    )}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No data available
                  </div>
                )}
              </div>
            </div>

            {/* Area by Location */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Area Distribution by Location
              </h3>
              <div style={{ height: 300 }}>
                {stats.areaByLocation.length > 0 ? (
                  <ResponsivePie
                    data={stats.areaByLocation}
                    margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    colors={COLORS}
                    borderWidth={1}
                    borderColor={{
                      from: "color",
                      modifiers: [["darker", 0.2]],
                    }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: "color" }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{
                      from: "color",
                      modifiers: [["darker", 2]],
                    }}
                    tooltip={({ datum }) => (
                      <div className="bg-white px-3 py-2 shadow-lg rounded border border-gray-200">
                        <strong>{datum.label}</strong>
                        <div>
                          {datum.value.toFixed(1)} ha (
                          {((datum.value / stats.totalArea) * 100).toFixed(1)}%)
                        </div>
                      </div>
                    )}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No data available
                  </div>
                )}
              </div>
            </div>

            {/* Fields by Soil Type */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Fields by Soil Type
              </h3>
              <div style={{ height: 300 }}>
                {stats.fieldsBySoilType.length > 0 ? (
                  <ResponsivePie
                    data={stats.fieldsBySoilType}
                    margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    colors={COLORS}
                    borderWidth={1}
                    borderColor={{
                      from: "color",
                      modifiers: [["darker", 0.2]],
                    }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: "color" }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{
                      from: "color",
                      modifiers: [["darker", 2]],
                    }}
                    tooltip={({ datum }) => (
                      <div className="bg-white px-3 py-2 shadow-lg rounded border border-gray-200">
                        <strong>{datum.label}</strong>
                        <div>
                          {datum.value} fields (
                          {((datum.value / stats.totalFields) * 100).toFixed(1)}
                          %)
                        </div>
                      </div>
                    )}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};
