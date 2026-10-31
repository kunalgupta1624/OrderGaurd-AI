import { NavLink } from "react-router-dom";

function Sidebar() {
    const navigation = [
        { name: "Overview", path: "/", icon: "▦" },
        { name: "Order Evaluation", path: "/evaluate", icon: "▤" },
        { name: "Order History", path: "/orders", icon: "◈" },
        { name: "Risk Analytics", path: "/analytics", icon: "⌁" },
    ];

    const management = [
        { name: "Customers", path: "/customers", icon: "◉" },
        { name: "Settings", path: "/settings", icon: "⚙" },
    ];

    const renderLinks = (items) =>
        items.map((item) => (
            <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : ""}`
                }
            >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.name}</span>
                <span className="active-indicator"></span>
            </NavLink>
        ));

    return (
        <aside className="sidebar">

            <div className="brand">
                <div className="brand-logo">O</div>

                <div className="brand-details">
                    <h2 className="brand-name">OrderGuard AI</h2>
                    <p className="brand-subtitle">INTELLIGENCE PLATFORM</p>
                </div>
            </div>

            <div className="sidebar-section">
                <p className="nav-label">WORKSPACE</p>
                <nav className="sidebar-nav">
                    {renderLinks(navigation)}
                </nav>
            </div>

            <div className="sidebar-section management-section">
                <p className="nav-label">MANAGEMENT</p>
                <nav className="sidebar-nav">
                    {renderLinks(management)}
                </nav>
            </div>

            <div className="sidebar-version">
                <span className="version-line"></span>
                <span>ORDERGUARD AI</span>
                <span className="version-number">v1.0.0</span>
            </div>

        </aside>
    );
}

export default Sidebar;