"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function InvestRecommend() {
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        income: '',
        riskTolerance: '',
        financialLiteracy: '',
        individualGoals: ''
    });
    const [loading, setLoading] = useState(false);
    const [recommendation, setRecommendation] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5001/predict_investment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setRecommendation(data.recommendation);
                toast.success("Investment recommendation generated successfully!");
            } else {
                toast.error(data.error || "Failed to get recommendation");
            }
        } catch (error) {
            toast.error("Error connecting to recommendation service");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                    Get Personalized Investment Advice
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Age</label>
                            <Input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                placeholder="Enter your age"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Gender</label>
                            <Select name="gender" value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Annual Income</label>
                            <Input
                                type="number"
                                name="income"
                                value={formData.income}
                                onChange={handleInputChange}
                                placeholder="Annual income in ₹"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Risk Tolerance</label>
                            <Select name="riskTolerance" value={formData.riskTolerance} onValueChange={(value) => handleSelectChange("riskTolerance", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select risk level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low Risk</SelectItem>
                                    <SelectItem value="medium">Medium Risk</SelectItem>
                                    <SelectItem value="high">High Risk</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Financial Literacy</label>
                            <Select name="financialLiteracy" value={formData.financialLiteracy} onValueChange={(value) => handleSelectChange("financialLiteracy", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select literacy level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="beginner">Beginner</SelectItem>
                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                    <SelectItem value="advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Investment Goals</label>
                            <Input
                                name="individualGoals"
                                value={formData.individualGoals}
                                onChange={handleInputChange}
                                placeholder="What are your investment goals?"
                                required
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Generating Recommendation..." : "Get Investment Advice"}
                    </Button>
                </form>

                {recommendation && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Your Personalized Recommendation</h3>
                        <div className="whitespace-pre-wrap text-sm">
                            {recommendation}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}