import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import OrderEvaluation from "./pages/OrderEvaluation";
import OrderHistory from "./pages/OrderHistory";
import RiskAnalytics from "./pages/RiskAnalytics";
import Customers from "./pages/Customers";
import Settings from "./pages/Settings";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/evaluate" element={<OrderEvaluation />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/analytics" element={<RiskAnalytics />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

