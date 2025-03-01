"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

export const CAGRCalculator = () => {
  const [initialAmount, setInitialAmount] = useState(10000);
  const [growthRate, setGrowthRate] = useState(12);
  const [years, setYears] = useState(5);
  const [finalAmount, setFinalAmount] = useState(0);
  const [totalGrowth, setTotalGrowth] = useState(0);
  const [yearlyBreakdown, setYearlyBreakdown] = useState([]);

  useEffect(() => {
    calculateCAGR();
  }, [initialAmount, growthRate, years]);

  const calculateCAGR = () => {
    const principal = parseFloat(initialAmount);
    const rate = parseFloat(growthRate) / 100;
    const time = parseFloat(years);

    if (principal > 0 && rate >= 0 && time > 0) {
      const finalValue = principal * Math.pow(1 + rate, time);
      const growth = finalValue - principal;

      setFinalAmount(finalValue.toFixed(2));
      setTotalGrowth(growth.toFixed(2));

      // Calculate yearly breakdown
      const breakdown = [];
      let currentValue = principal;
      for (let i = 1; i <= time; i++) {
        currentValue = currentValue * (1 + rate);
        breakdown.push({
          year: i,
          value: currentValue.toFixed(2),
        });
      }
      setYearlyBreakdown(breakdown);
    } else {
      setFinalAmount(0);
      setTotalGrowth(0);
      setYearlyBreakdown([]);
    }
  };

  return (
    <Card className="w-full transition-all hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">
          Investment Growth Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Initial Investment</label>
            <div className="flex items-center space-x-4">
              <Input
                type="number"
                value={initialAmount}
                onChange={(e) =>
                  setInitialAmount(parseFloat(e.target.value) || 0)
                }
                className="flex-1"
              />
              <Slider
                value={[initialAmount]}
                min={1000}
                max={1000000}
                step={1000}
                onValueChange={(value) => setInitialAmount(value[0])}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Annual Growth Rate (%)
            </label>
            <div className="flex items-center space-x-4">
              <Select
                value={growthRate.toString()}
                onValueChange={(value) => setGrowthRate(parseFloat(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Growth Rate" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Investment Period (Years)
            </label>
            <div className="flex items-center space-x-4">
              <Select
                value={years.toString()}
                onValueChange={(value) => setYears(parseFloat(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Years" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 30 }, (_, i) => (
                    <SelectItem key={i} value={(i + 1).toString()}>
                      {i + 1} {i === 0 ? "Year" : "Years"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <motion.div
              className="bg-gradient-to-br from-indigo-50 to-cyan-50 p-4 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-gray-500 mb-1">Final Amount</p>
              <p className="text-xl font-bold text-indigo-700">
                ₹{Number(finalAmount).toLocaleString()}
              </p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-indigo-50 to-cyan-50 p-4 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <p className="text-sm text-gray-500 mb-1">Total Growth</p>
              <p className="text-xl font-bold text-indigo-700">
                ₹{Number(totalGrowth).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {((totalGrowth / initialAmount) * 100).toFixed(1)}% increase
              </p>
            </motion.div>
          </div>

          {/* Animated Growth Visualization */}
          <div className="mt-6">
            <p className="text-sm font-medium mb-2">Growth Projection</p>
            <div className="h-40 relative bg-gray-50 rounded-lg p-4 overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-px bg-gray-200"></div>
              <div className="absolute left-0 top-0 h-full w-px bg-gray-200"></div>

              {/* Initial Amount Marker */}
              <div className="absolute bottom-0 left-0 w-full flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <div className="ml-1 text-xs text-gray-500">
                  ₹{Number(initialAmount).toLocaleString()}
                </div>
              </div>

              {/* Growth Chart */}
              <div className="absolute bottom-0 left-0 top-0 h-full w-full">
                <svg
                  className="w-full h-full"
                  viewBox={`0 0 ${years} 1`}
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="growthGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="rgba(79, 70, 229, 0.6)" />
                      <stop offset="100%" stopColor="rgba(79, 70, 229, 0.1)" />
                    </linearGradient>
                  </defs>

                  <motion.path
                    d={`M 0 1 ${yearlyBreakdown
                      .map(
                        (item, index) =>
                          `L ${index + 1} ${1 - item.value / finalAmount}`
                      )
                      .join(" ")} L ${years} 0 L ${years} 1 Z`}
                    fill="url(#growthGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />

                  <motion.path
                    d={`M 0 1 ${yearlyBreakdown
                      .map(
                        (item, index) =>
                          `L ${index + 1} ${1 - item.value / finalAmount}`
                      )
                      .join(" ")}`}
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="0.02"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                  />
                </svg>
              </div>

              {/* Final Amount Marker */}
              <div className="absolute top-0 right-0 flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <div className="ml-1 text-xs text-gray-500">
                  ₹{Number(finalAmount).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Year 0</span>
              <span>Year {years}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CAGRCalculator;
