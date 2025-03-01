'use client';

import MutualFundsPage from "./page";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";

export default function Layout() {
    return (
        <div className="px-5">
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-6xl font-bold tracking-tight gradient-title">
                    Mutual Funds
                </h1>
            </div>
            <Suspense
                fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
            >
                <MutualFundsPage />
            </Suspense>
        </div>
    );
} 