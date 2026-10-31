import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getOrderHistory } from "../services/api";

function RiskAnalytics() {
    console.log("Risk Analytics component loaded");
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await getOrderHistory();
                setOrders(data.orders || []);
            } catch (err) {
                setError("Unable to load risk analytics.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const totalOrders = orders.length;

    const highRisk = orders.filter(
        order => order.rto_probability >= 0.70
    ).length;

    const mediumRisk = orders.filter(
        order =>
            order.rto_probability >= 0.30 &&
            order.rto_probability < 0.70
    ).length;

    const lowRisk = orders.filter(
        order => order.rto_probability < 0.30
    ).length;

    const decisions = [
        { key: "SHIP_AS_IS", label: "Ship as-is" },
        { key: "CONFIRM_ORDER", label: "Confirm order" },
        { key: "NUDGE_PREPAID", label: "Nudge prepaid" },
        { key: "HOLD_REVIEW", label: "Hold for review" }
    ];

    const getDecisionCount = (decision) =>
        orders.filter(
            order => order.recommended_action === decision
        ).length;

    const getPercentage = (value) =>
        totalOrders ? ((value / totalOrders) * 100).toFixed(1) : "0.0";

    if (loading) {
        return <div className="app-layout"><Sidebar /><main className="main-content">Loading analytics...</main></div>;
    }

    return (
        <div className="app-layout">
            <Sidebar />

            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h1>Risk Analytics</h1>
                        <p>Understand COD order risk and decision patterns.</p>
                    </div>
                </div>

                {error && <p>{error}</p>}

                {!error && (
                    <>
                        <div className="analytics-summary">
                            <div className="stat-card">
                                <p className="stat-title">Total Evaluated Orders</p>
                                <h2 className="stat-value">{totalOrders}</h2>
                            </div>

                            <div className="stat-card">
                                <p className="stat-title">High Risk Orders</p>
                                <h2 className="stat-value">{highRisk}</h2>
                                <p className="stat-subtitle">
                                    {getPercentage(highRisk)}% of orders
                                </p>
                            </div>

                            <div className="stat-card">
                                <p className="stat-title">Medium Risk Orders</p>
                                <h2 className="stat-value">{mediumRisk}</h2>
                                <p className="stat-subtitle">
                                    {getPercentage(mediumRisk)}% of orders
                                </p>
                            </div>

                            <div className="stat-card">
                                <p className="stat-title">Low Risk Orders</p>
                                <h2 className="stat-value">{lowRisk}</h2>
                                <p className="stat-subtitle">
                                    {getPercentage(lowRisk)}% of orders
                                </p>
                            </div>
                        </div>

                        <section className="analytics-panel">
                            <h2>RTO Risk Distribution</h2>

                            {[
                                { label: "High Risk", value: highRisk, color: "#ef4444" },
                                { label: "Medium Risk", value: mediumRisk, color: "#f59e0b" },
                                { label: "Low Risk", value: lowRisk, color: "#22c55e" }
                            ].map(item => (
                                <div className="analytics-bar-row" key={item.label}>
                                    <div className="analytics-bar-heading">
                                        <span>{item.label}</span>
                                        <span>{item.value} ({getPercentage(item.value)}%)</span>
                                    </div>

                                    <div className="analytics-bar-background">
                                        <div
                                            className="analytics-bar-fill"
                                            style={{
                                                width: `${getPercentage(item.value)}%`,
                                                background: item.color
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </section>

                        <section className="analytics-panel">
                            <h2>Decision Distribution</h2>

                            {decisions.map(item => {
                                const count = getDecisionCount(item.key);

                                return (
                                    <div className="analytics-bar-row" key={item.key}>
                                        <div className="analytics-bar-heading">
                                            <span>{item.label}</span>
                                            <span>{count} ({getPercentage(count)}%)</span>
                                        </div>

                                        <div className="analytics-bar-background">
                                            <div
                                                className="analytics-bar-fill"
                                                style={{
                                                    width: `${getPercentage(count)}%`,
                                                    background: "#6366f1"
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </section>

                        <p className="analytics-note">
                            Risk categories are based on predicted RTO probability:
                            Low &lt; 30%, Medium 30–69.99%, High ≥ 70%.
                            These are reporting categories, not independently
                            calibrated business thresholds.
                        </p>
                    </>
                )}
            </main>
        </div>
    );
}

export default RiskAnalytics;