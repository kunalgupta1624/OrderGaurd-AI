import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { evaluateOrder } from "../services/api";

const initialForm = {
order_id: "",
customer_name: "",
phone: "",
address: "",
city: "",
state: "",
pincode: "",
order_value: "",
num_items: "1",
customer_prior_orders: "0",
customer_prior_rto: "0",
order_datetime: new Date().toISOString().slice(0, 16),
courier: "",
utm_source: ""
};

function OrderEvaluation() {


const [form, setForm] = useState(initialForm);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [result, setResult] = useState(null);

const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
        ...previous,
        [name]: value
    }));
};

const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
        const orderData = {
            ...form,
            order_value: Number(form.order_value),
            num_items: Number(form.num_items),
            customer_prior_orders: Number(form.customer_prior_orders),
            customer_prior_rto: Number(form.customer_prior_rto),
            order_datetime: new Date(form.order_datetime).toISOString()
        };

        const response = await evaluateOrder(orderData);
        setResult(response);

    } catch (err) {
        console.error("Order evaluation error:", err);

        setError(
            err.response?.data?.detail ||
            "Unable to evaluate order. Please check the backend."
        );

    } finally {
        setLoading(false);
    }
};

const handleReset = () => {
    setForm(initialForm);
    setResult(null);
    setError("");
};

const getActionColor = (action) => {
    const colors = {
        SHIP_AS_IS: "text-emerald-700 bg-emerald-50",
        CONFIRM_ORDER: "text-amber-700 bg-amber-50",
        NUDGE_PREPAID: "text-blue-700 bg-blue-50",
        HOLD_REVIEW: "text-red-700 bg-red-50"
    };

    return colors[action] || "text-slate-700 bg-slate-100";
};

const fieldClass =
    "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

const renderField = (label, name, type = "text", required = true) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
            {label}
        </label>

        <input
            className={fieldClass}
            type={type}
            name={name}
            value={form[name]}
            onChange={handleChange}
            required={required}
            min={type === "number" ? 0 : undefined}
            step={type === "number" ? "any" : undefined}
        />
    </div>
);

return (
    <div className="dashboard-layout">

        <Sidebar />

        <main className="main-content">

            <div className="mb-8">
                <p className="breadcrumb">
                    Workspace / Order Evaluation
                </p>

                <h1 className="page-title">
                    Evaluate New Order
                </h1>

                <p className="page-description">
                    Analyze COD order details and identify potential RTO risk.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Order Form */}

                <section className="xl:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-slate-900">
                            Order Information
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Enter the customer's order and delivery details.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <h3 className="text-sm font-semibold text-slate-800 mb-4">
                            Basic Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {renderField("Order ID", "order_id")}
                            {renderField("Customer Name", "customer_name")}

                            {renderField("Phone Number", "phone", "tel")}
                            {renderField("Order Date & Time", "order_datetime", "datetime-local")}

                        </div>

                        <hr className="my-7 border-slate-100" />

                        <h3 className="text-sm font-semibold text-slate-800 mb-4">
                            Delivery Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {renderField("Delivery Address", "address")}
                            {renderField("City", "city")}
                            {renderField("State", "state")}
                            {renderField("Pincode", "pincode")}

                        </div>

                        <hr className="my-7 border-slate-100" />

                        <h3 className="text-sm font-semibold text-slate-800 mb-4">
                            Order & Customer History
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {renderField("Order Value (₹)", "order_value", "number")}
                            {renderField("Number of Items", "num_items", "number")}

                            {renderField("Previous Orders", "customer_prior_orders", "number")}
                            {renderField("Previous RTO Orders", "customer_prior_rto", "number")}

                            {renderField("Courier", "courier")}
                            {renderField("UTM Source", "utm_source")}

                        </div>

                        <div className="flex gap-3 mt-8">

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg text-sm font-semibold transition"
                            >
                                {loading ? "Analyzing Order..." : "Analyze Order"}
                            </button>

                            <button
                                type="button"
                                onClick={handleReset}
                                className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-lg text-sm font-semibold transition"
                            >
                                Reset
                            </button>

                        </div>

                    </form>

                </section>

                {/* Results */}

                <section className="space-y-5">

                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

                        <h2 className="font-bold text-slate-900">
                            AI Evaluation Result
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Prediction and recommended action.
                        </p>

                        {!result && !loading && (
                            <div className="py-12 text-center">
                                <div className="text-4xl mb-4">◈</div>

                                <p className="text-sm font-medium text-slate-700">
                                    No evaluation yet
                                </p>

                                <p className="text-xs text-slate-400 mt-2">
                                    Submit an order to see its risk analysis.
                                </p>
                            </div>
                        )}

                        {loading && (
                            <p className="text-sm text-blue-600 mt-8">
                                Analyzing order risk...
                            </p>
                        )}

                        {error && (
                            <div className="mt-5 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        {result && (
                            <div className="mt-6">

                                <p className="text-xs text-slate-500">
                                    PREDICTED RTO PROBABILITY
                                </p>

                                <h2 className="text-4xl font-bold text-slate-900 mt-2">
                                    {result.rto_percentage}%
                                </h2>

                                <div className="w-full h-2 bg-slate-100 rounded-full mt-4 overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 rounded-full"
                                        style={{
                                            width: `${Math.min(
                                                Math.max(Number(result.rto_percentage), 0),
                                                100
                                            )}%`
                                        }}
                                    />
                                </div>

                                <div className="mt-7">
                                    <p className="text-xs text-slate-500 mb-2">
                                        RECOMMENDED ACTION
                                    </p>

                                    <span className={`inline-block px-3 py-2 rounded-lg text-xs font-bold ${getActionColor(result.recommended_action)}`}>
                                        {result.recommended_action?.replaceAll("_", " ")}
                                    </span>
                                </div>

                                <div className="mt-6">
                                    <p className="text-xs text-slate-500 mb-2">
                                        EXPLANATION
                                    </p>

                                    <p className="text-sm text-slate-700 leading-6">
                                        {result.explanation}
                                    </p>
                                </div>

                            </div>
                        )}

                    </div>

                    {/* Validation */}

                    {result?.customer_validation && (
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

                            <h3 className="font-bold text-slate-900">
                                Customer Validation
                            </h3>

                            <p className="text-sm text-slate-500 mt-2">
                                Status:{" "}
                                <strong>
                                    {result.customer_validation.validation_summary?.overall_status}
                                </strong>
                            </p>

                            <div className="mt-4 text-sm text-slate-600 space-y-2">

                                <p>
                                    High-risk issues:{" "}
                                    {result.customer_validation.validation_summary?.high_risk_count ?? 0}
                                </p>

                                <p>
                                    Medium-risk issues:{" "}
                                    {result.customer_validation.validation_summary?.medium_risk_count ?? 0}
                                </p>

                            </div>

                        </div>
                    )}

                    {/* Prepaid Offer */}

                    {result?.prepaid_offer && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">

                            <h3 className="font-bold text-blue-900">
                                Prepaid Discount Offer
                            </h3>

                            <p className="text-sm text-blue-700 mt-3">
                                Recommended discount: ₹
                                {result.prepaid_offer.recommended_discount}
                            </p>

                            <p className="text-2xl font-bold text-blue-900 mt-2">
                                ₹{result.prepaid_offer.final_prepaid_amount}
                            </p>

                            <p className="text-xs text-blue-700 mt-2">
                                Suggested prepaid amount
                            </p>

                        </div>
                    )}

                </section>

            </div>

        </main>

    </div>
);


}

export default OrderEvaluation;
