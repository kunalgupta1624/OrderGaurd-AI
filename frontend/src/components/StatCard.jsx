function StatCard({ title, value, subtitle, icon, color, background }) {

    return (
        <div className="stat-card">

            <div className="stat-top">

                <p className="stat-title">
                    {title}
                </p>

                <div
                    className="stat-icon"
                    style={{
                        color: color,
                        background: background
                    }}
                >
                    {icon}
                </div>

            </div>

            <h2 className="stat-value">
                {value}
            </h2>

            <p className="stat-subtitle">
                {subtitle}
            </p>

        </div>
    );
}

export default StatCard;