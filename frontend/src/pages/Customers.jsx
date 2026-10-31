import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getOrderHistory } from "../services/api";

function Customers() {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await getOrderHistory();
                setOrders(response.orders || []);
            } catch (err) {
                setError("Unable to load customer information.");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const customers = useMemo(() => {
        const customerMap = new Map();

        orders.forEach((order) => {
            const name = (order.customer_name || "Unknown").trim();
            const key = name.toLowerCase();

            if (!customerMap.has(key)) {
                customerMap.set(key, {
                    name,
                    orderCount: 0,
                    totalValue: 0,
                    totalRisk: 0,
                    latestAction: order.recommended_action,
                    latestOrderId: order.order_id,
                    highRiskCount: 0
                });
            }

            const customer = customerMap.get(key);

            customer.orderCount += 1;
            customer.totalValue += Number(order.order_value || 0);
            customer.totalRisk += Number(order.rto_probability || 0);

            if (Number(order.rto_probability || 0) >= 0.70) {
                customer.highRiskCount += 1;
            }

            customer.latestAction = order.recommended_action;
            customer.latestOrderId = order.order_id;
        });

        return Array.from(customerMap.values()).map((customer) => ({
            ...customer,
            averageRisk:
                customer.totalRisk / customer.orderCount
        }));
    }, [orders]);

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(search.toLowerCase())
    );

    const totalValue = customers.reduce(
        (sum, customer) => sum + customer.totalValue,
        0
    );

    const attentionCount = customers.filter(
        (customer) => customer.highRiskCount > 0
    ).length;

    const formatCurrency = (value) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(value);

    const getRiskClass = (risk) => {
        if (risk >= 0.70) return "customer-risk-high";
        if (risk >= 0.30) return "customer-risk-medium";
        return "customer-risk-low";
    };

    return (
        <div className="app-layout">
            <Sidebar />

            <main className="main-content customers-main">

                <header className="customers-header">
                    <div>
                        <div className="oe-breadcrumb">
                            Management <span>/</span> Customers
                        </div>

                        <h1>Customer Management</h1>

                        <p>
                            Review customer activity and identify potential
                            COD delivery risks.
                        </p>
                    </div>

                    <div className="customers-live-badge">
                        CUSTOMER INSIGHTS
                    </div>
                </header>

                {error && (
                    <div className="oe-error">
                        {error}
                    </div>
                )}

                {/* Summary Cards */}

                <div className="customers-stats">

                    <div className="customer-stat-card">
                        <span>Total Customers</span>
                        <h2>{customers.length}</h2>
                        <p>Unique evaluated customer names</p>
                    </div>

                    <div className="customer-stat-card">
                        <span>Evaluated Order Value</span>
                        <h2>{formatCurrency(totalValue)}</h2>
                        <p>Combined value of evaluated orders</p>
                    </div>

                    <div className="customer-stat-card">
                        <span>Customers Requiring Attention</span>
                        <h2>{attentionCount}</h2>
                        <p>Customers with at least one high-risk evaluation</p>
                    </div>

                </div>

                {/* Customer Table */}

                <section className="customers-table-card">

                    <div className="customers-table-header">
                        <div>
                            <h2>Customer Directory</h2>
                            <p>
                                Customer insights derived from evaluated orders.
                            </p>
                        </div>

                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {loading ? (
                        <div className="customers-empty">
                            Loading customers...
                        </div>
                    ) : (
                        <div className="customers-table-wrapper">

                            <table className="customers-table">

                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Evaluated Orders</th>
                                        <th>Total Order Value</th>
                                        <th>Average RTO Risk</th>
                                        <th>High-risk Orders</th>
                                        <th>Latest Decision</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {filteredCustomers.map((customer, index) => (
                                        <tr key={customer.name + index}>

                                            <td>
                                                <div className="customer-identity">
                                                    <div className="customer-avatar">
                                                        {customer.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {customer.name}
                                                        </strong>

                                                        <small>
                                                            {customer.latestOrderId}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>{customer.orderCount}</td>

                                            <td>
                                                {formatCurrency(customer.totalValue)}
                                            </td>

                                            <td>
                                                <span className={getRiskClass(
                                                    customer.averageRisk
                                                )}>
                                                    {(customer.averageRisk * 100).toFixed(1)}%
                                                </span>
                                            </td>

                                            <td>{customer.highRiskCount}</td>

                                            <td>
                                                <span className="customer-decision">
                                                    {customer.latestAction?.replaceAll(
                                                        "_",
                                                        " "
                                                    )}
                                                </span>
                                            </td>

                                        </tr>
                                    ))}

                                    {!loading && filteredCustomers.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="customers-empty">
                                                No customers found.
                                            </td>
                                        </tr>
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}

                </section>

                <p className="customers-note">
                    Customer records are grouped by customer name.
                    Order counts and risk scores represent evaluated orders
                    stored by OrderGuard AI, not verified purchase history.
                </p>

            </main>
        </div>
    );
}

export default Customers;