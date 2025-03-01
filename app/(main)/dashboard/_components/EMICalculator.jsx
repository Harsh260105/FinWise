"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

export const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(10);
  const [loanTerm, setLoanTerm] = useState(5);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, loanTerm]);

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const time = parseFloat(loanTerm) * 12; // Total months

    // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    if (principal > 0 && rate > 0 && time > 0) {
      const emiValue = principal * rate * Math.pow(1 + rate, time) / (Math.pow(1 + rate, time) - 1);
      const totalPayment = emiValue * time;
      const interestPayment = totalPayment - principal;
      
      setEmi(emiValue.toFixed(2));
      setTotalInterest(interestPayment.toFixed(2));
      setTotalAmount(totalPayment.toFixed(2));
    } else {
      setEmi(0);
      setTotalInterest(0);
      setTotalAmount(0);
    }
  };

  return (
    <Card className="w-full transition-all hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">EMI Calculator</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Loan Amount</label>
            <div className="flex items-center space-x-4">
              <Input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                className="flex-1"
              />
              <Slider
                value={[loanAmount]}
                min={1000}
                max={10000000}
                step={1000}
                onValueChange={(value) => setLoanAmount(value[0])}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Interest Rate (%)</label>
            <div className="flex items-center space-x-4">
              <Select
                value={interestRate.toString()}
                onValueChange={(value) => setInterestRate(parseFloat(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Interest Rate" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 21 }, (_, i) => (
                    <SelectItem key={i} value={(i + 5).toString()}>
                      {i + 5}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Loan Term (Years)</label>
            <div className="flex items-center space-x-4">
              <Select
                value={loanTerm.toString()}
                onValueChange={(value) => setLoanTerm(parseFloat(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Loan Term" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 30 }, (_, i) => (
                    <SelectItem key={i} value={(i + 1).toString()}>
                      {i + 1} {i === 0 ? 'Year' : 'Years'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <motion.div
              className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-gray-500 mb-1">Monthly EMI</p>
              <p className="text-xl font-bold text-purple-700">₹{Number(emi).toLocaleString()}</p>
            </motion.div>
            
            <motion.div
              className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <p className="text-sm text-gray-500 mb-1">Total Interest</p>
              <p className="text-xl font-bold text-purple-700">₹{Number(totalInterest).toLocaleString()}</p>
            </motion.div>
            
            <motion.div
              className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-xl font-bold text-purple-700">₹{Number(totalAmount).toLocaleString()}</p>
            </motion.div>
          </div>
          
          {/* Animated Payment Breakdown */}
          <div className="mt-6">
            <p className="text-sm font-medium mb-2">Payment Breakdown</p>
            <motion.div 
              className="h-8 bg-gray-100 rounded-full overflow-hidden flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div 
                className="h-full bg-purple-500"
                initial={{ width: '0%' }}
                animate={{ width: `${loanAmount / (parseFloat(totalAmount) || 1) * 100}%` }}
                transition={{ duration: 1, delay: 0.4 }}
              />
              <motion.div 
                className="h-full bg-blue-500"
                initial={{ width: '0%' }}
                animate={{ width: `${parseFloat(totalInterest) / (parseFloat(totalAmount) || 1) * 100}%` }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </motion.div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
                <span>Principal</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                <span>Interest</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EMICalculator;