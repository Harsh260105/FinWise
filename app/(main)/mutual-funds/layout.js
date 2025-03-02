'use client';

import MutualFundsPage from "./page";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";

export default function Layout() {
    return (
        <div className="px-5">
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-6xl font-bold tracking-tight gradient-title">
                    Investment Hub
                </h1>
                <p className="text-muted-foreground">
                    Explore funds and get personalized recommendations
                </p>
            </div>
            <Suspense
                fallback={
                    <div className="flex items-center justify-center min-h-[400px]">
                        <BarLoader color="#9333ea" />
                    </div>
                }
            >
                <MutualFundsPage />
            </Suspense>
        </div>
    );
} 