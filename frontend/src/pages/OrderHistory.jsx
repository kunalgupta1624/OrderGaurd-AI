import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getOrderHistory } from "../services/api";

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrderHistory();
                setOrders(data.orders || []);
            } catch (err) {
                setError("Unable to load order history.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.order_id?.toLowerCase().includes(search.toLowerCase()) ||
            order.customer_name?.toLowerCase().includes(search.toLowerCase());

        const matchesFilter =
            filter === "ALL" ||
            order.recommended_action === filter;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="app-layout">
            <Sidebar />

            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h1>Order History</h1>
                        <p>Review previously evaluated COD orders.</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="order-toolbar">
                        <input
                            type="text"
                            placeholder="Search by order ID or customer..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="ALL">All Decisions</option>
                            <option value="SHIP_AS_IS">Ship as-is</option>
                            <option value="CONFIRM_ORDER">Confirm order</option>
                            <option value="NUDGE_PREPAID">Nudge prepaid</option>
                            <option value="HOLD_REVIEW">Hold for review</option>
                        </select>
                    </div>

                    {loading && <p>Loading orders...</p>}

                    {error && <p>{error}</p>}

                    {!loading && !error && (
                        <div className="table-container">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Order Value</th>
                                        <th>RTO Risk</th>
                                        <th>Decision</th>
                                        <th>Validation</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredOrders.map((order, index) => (
                                        <tr key={order.order_id || index}>
                                            <td>{order.order_id}</td>
                                            <td>{order.customer_name}</td>
                                            <td>
                                                ₹{order.order_value}
                                            </td>
                                            <td>
                                                {(
                                                    order.rto_probability * 100
                                                ).toFixed(2)}%
                                            </td>
                                            <td>
                                                <span className="decision-badge">
                                                    {order.recommended_action}
                                                </span>
                                            </td>
                                            <td>{order.validation_status}</td>
                                        </tr>
                                    ))}

                                    {filteredOrders.length === 0 && (
                                        <tr>
                                            <td colSpan="6">
                                                No matching orders found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default OrderHistory;