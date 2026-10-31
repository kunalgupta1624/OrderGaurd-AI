import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";

import { getDashboardSummary } from "../services/api";

function Dashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadDashboard = async () => {

            try {
                const data = await getDashboardSummary();
                setDashboard(data);
                setError("");

            } catch (err) {
                console.error("Dashboard API error:", err);
                setError("Unable to connect to the dashboard API.");

            } finally {
                setLoading(false);
            }
        };

        loadDashboard();

    }, []);

    const counts = dashboard?.decision_breakdown || {};

    const total = dashboard?.total_orders_evaluated || 0;

    const getPercentage = (value) => {
        if (!total) return 0;
        return (value / total) * 100;
    };

    const decisions = [
        {
            name: "Ship As Is",
            value: counts.SHIP_AS_IS || 0,
            color: "#12b76a"
        },
        {
            name: "Confirm Order",
            value: counts.CONFIRM_ORDER || 0,
            color: "#f79009"
        },
        {
            name: "Nudge Prepaid",
            value: counts.NUDGE_PREPAID || 0,
            color: "#2e90fa"
        },
        {
            name: "Hold Review",
            value: counts.HOLD_REVIEW || 0,
            color: "#f04438"
        }
    ];

    return (

        <div className="dashboard-layout">

            <Sidebar />

            <main className="main-content">

                {/* Header */}

                <header className="topbar">

                    <div>
                        <p className="breadcrumb">
                            Workspace / Overview
                        </p>

                        <h1 className="page-title">
                            Dashboard Overview
                        </h1>

                        <p className="page-description">
                            Monitor COD orders, RTO risk and business performance.
                        </p>
                    </div>

                    <div className="header-right">
                        <div className="live-badge">
                            <span className="status-dot"></span>
                            System Live
                        </div>
                    </div>

                </header>


                {loading && (
                    <div className="loading-text">
                        Loading dashboard analytics...
                    </div>
                )}


                {!loading && error && (
                    <div className="error-box">
                        {error}
                    </div>
                )}


                {!loading && !error && dashboard && (

                    <>

                        {/* KPI Section */}

                        <section>

                            <h2 className="section-heading">
                                Order Performance
                            </h2>

                            <div className="stats-grid">

                                <StatCard
                                    title="Total Orders"
                                    value={total}
                                    subtitle="Total evaluated orders"
                                    icon="▤"
                                    color="#2563eb"
                                    background="#eff6ff"
                                />

                                <StatCard
                                    title="Ship As Is"
                                    value={counts.SHIP_AS_IS || 0}
                                    subtitle="Low-risk orders"
                                    icon="✓"
                                    color="#039855"
                                    background="#ecfdf3"
                                />

                                <StatCard
                                    title="Confirm Order"
                                    value={counts.CONFIRM_ORDER || 0}
                                    subtitle="Require customer confirmation"
                                    icon="◷"
                                    color="#dc6803"
                                    background="#fffaeb"
                                />

                                <StatCard
                                    title="Hold Review"
                                    value={counts.HOLD_REVIEW || 0}
                                    subtitle="Require manual review"
                                    icon="!"
                                    color="#d92d20"
                                    background="#fef3f2"
                                />

                            </div>

                        </section>


                        {/* Financial Impact */}

                        <section className="mt-8">

                            <h2 className="section-heading">
                                Financial Impact
                            </h2>

                            <div className="financial-grid">

                                <div className="financial-card">

                                    <p className="financial-title text-slate-600">
                                        Estimated RTO Savings
                                    </p>

                                    <h2 className="financial-value text-emerald-600">
                                        ₹{dashboard.estimated_rto_savings}
                                    </h2>

                                    <p className="financial-description">
                                        Model-based estimated savings
                                    </p>

                                </div>


                                <div className="financial-card dark">

                                    <p className="financial-title">
                                        Net Estimated Impact
                                    </p>

                                    <h2 className="financial-value">
                                        ₹{dashboard.net_estimated_impact}
                                    </h2>

                                    <p className="financial-description">
                                        Estimated savings minus value held for review
                                    </p>

                                </div>


                                <div className="financial-card">

                                    <p className="financial-title text-slate-600">
                                        Prepaid Nudges
                                    </p>

                                    <h2 className="financial-value text-blue-600">
                                        {counts.NUDGE_PREPAID || 0}
                                    </h2>

                                    <p className="financial-description">
                                        Orders recommended for prepaid payment
                                    </p>

                                </div>


                                <div className="financial-card">

                                    <p className="financial-title text-slate-600">
                                        Orders Held for Review
                                    </p>

                                    <h2 className="financial-value text-orange-600">
                                        ₹{dashboard.value_of_orders_held_for_review}
                                    </h2>

                                    <p className="financial-description">
                                        Order value under review, not confirmed losses
                                    </p>

                                </div>

                            </div>

                        </section>


                        {/* Decision Distribution */}

                        <section className="distribution-card">

                            <h2 className="section-heading">
                                Order Decision Distribution
                            </h2>

                            <p className="text-xs text-slate-500">
                                Breakdown of evaluated orders by recommended action.
                            </p>

                            {decisions.map((item) => (

                                <div className="distribution-row" key={item.name}>

                                    <div className="distribution-info">

                                        <span>{item.name}</span>

                                        <strong>
                                            {item.value} ({getPercentage(item.value).toFixed(1)}%)
                                        </strong>

                                    </div>

                                    <div className="progress-track">

                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${getPercentage(item.value)}%`,
                                                background: item.color
                                            }}
                                        ></div>

                                    </div>

                                </div>

                            ))}

                        </section>

                    </>

                )}

            </main>

        </div>

    );
}

export default Dashboard;