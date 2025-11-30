"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import {
  Card,
  CardBody,
  Progress,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link as HeroLink,
  Button,
  Chip,
} from "@heroui/react";
import { RESEARCH_SAMPLE_STATS } from "@/lib/assessment/scoring";
import { USER_DIMENSIONS } from "@/lib/assessment/constructs";

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "bg-radium-green";
      case "Moderate":
        return "bg-yellow-400";
      case "High":
        return "bg-orange-500";
      case "Severe":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gradient-start via-gradient-mid to-gradient-end flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-radium-purple border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">
            Loading researcher data...
          </p>
        </div>
      </div>
    );
  }

  if (!stats) return <div>Error loading stats</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gradient-start via-gradient-mid to-gradient-end">
      {/* Header */}
      {/* Header */}
      <Navbar
        maxWidth="xl"
        className="bg-white/60 backdrop-blur-md border-b border-white/50"
      >
        <NavbarBrand>
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Icon name="Smartphone" className="w-8 h-8 text-radium-purple" />
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-radium-purple to-radium-blue">
                Doomscroll Check
              </span>
            </Link>
            <Chip color="secondary" variant="flat" size="sm">
              Researcher Portal
            </Chip>
          </div>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <HeroLink
              as={Link}
              href="/"
              color="foreground"
              className="hover:text-radium-purple transition-colors font-medium"
            >
              Home
            </HeroLink>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Research Dashboard
            </h1>
            <p className="text-gray-600">
              Overview of aggregated user data and assessment trends.
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Key metrics */}
        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          <Card className="glass-panel hover:shadow-lg transition-shadow">
            <CardBody className="p-6">
              <p className="text-sm font-medium text-gray-500 mb-2">
                Total Users
              </p>
              <p className="text-4xl font-bold text-gray-800">
                {stats.overview.totalUsers}
              </p>
            </CardBody>
          </Card>
          <Card className="glass-panel hover:shadow-lg transition-shadow">
            <CardBody className="p-6">
              <p className="text-sm font-medium text-gray-500 mb-2">
                Total Assessments
              </p>
              <p className="text-4xl font-bold text-gray-800">
                {stats.overview.totalAssessments}
              </p>
            </CardBody>
          </Card>
          <Card className="glass-panel hover:shadow-lg transition-shadow">
            <CardBody className="p-6">
              <p className="text-sm font-medium text-gray-500 mb-2">
                Average Score
              </p>
              <p className="text-4xl font-bold text-radium-purple">
                {stats.overview.averageScore.toFixed(2)}
              </p>
            </CardBody>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Severity distribution */}
          {/* Severity distribution */}
          <Card className="glass-panel">
            <CardBody className="p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Severity Distribution
              </h2>
              <div className="space-y-5">
                {Object.entries(stats.distribution).map(
                  ([severity, count]: [string, any]) => {
                    const total = Object.values(stats.distribution).reduce(
                      (a: any, b: any) => a + b,
                      0
                    ) as number;
                    const percentage = (count / total) * 100;

                    let color: "success" | "warning" | "danger" | "default" =
                      "default";
                    if (severity === "Low") color = "success";
                    if (severity === "Moderate") color = "warning";
                    if (severity === "High" || severity === "Severe")
                      color = "danger";

                    return (
                      <div key={severity}>
                        <div className="flex justify-between text-sm mb-2 font-medium">
                          <span className="text-gray-700">{severity}</span>
                          <span className="text-gray-900">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress
                          value={percentage}
                          color={color}
                          className="h-3"
                          aria-label={`${severity} distribution`}
                        />
                      </div>
                    );
                  }
                )}
              </div>
            </CardBody>
          </Card>

          {/* Dimension averages */}
          {/* Dimension averages */}
          <Card className="glass-panel">
            <CardBody className="p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Average Scores by Dimension
              </h2>
              <div className="space-y-5">
                {USER_DIMENSIONS.map((dim) => {
                  const score =
                    stats.averages[dim.constructs[0]] ||
                    stats.averages[dim.constructs[1]] ||
                    0; // Simplified mapping
                  const researchMean =
                    RESEARCH_SAMPLE_STATS.dimensions[
                      dim.id as keyof typeof RESEARCH_SAMPLE_STATS.dimensions
                    ]?.mean || 3.5;
                  const percentage = (score / 7) * 100;

                  return (
                    <div key={dim.id}>
                      <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-gray-700">{dim.name}</span>
                        <span className="text-gray-900">
                          {score.toFixed(2)}
                          <span className="text-gray-400 text-xs ml-2 font-normal">
                            (study: {researchMean.toFixed(2)})
                          </span>
                        </span>
                      </div>
                      <Progress
                        value={percentage}
                        color="secondary"
                        className="h-3"
                        aria-label={`${dim.name} average`}
                      />
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Export section */}
        <Card className="bg-gradient-to-r from-radium-purple/10 to-radium-blue/10 border border-radium-purple/20">
          <CardBody className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  Export Data
                </h3>
                <p className="text-sm text-gray-600">
                  Download aggregated assessment data for further analysis
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="bordered"
                  className="bg-white font-medium shadow-sm"
                >
                  Export CSV
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
