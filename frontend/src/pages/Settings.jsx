import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getThresholds, updateThresholds } from "../services/api";

function Settings() {
  const [settings, setSettings] = useState({
    confirm_threshold: 0.30,
    prepaid_threshold: 0.50,
    hold_threshold: 0.85,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getThresholds();
        setSettings(data);
      } catch {
        setError("Unable to load settings. Check whether the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: Number(value) / 100,
    }));

    setMessage("");
    setError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await updateThresholds(settings);
      setMessage("Decision thresholds updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to save settings. Please check the threshold values."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <p>Loading settings...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content settings-page">
        <div className="page-header">
          <div>
            <h1>System Settings</h1>
            <p>Configure how OrderGuard AI evaluates COD orders.</p>
          </div>
        </div>

        <section className="settings-card">
          <h2>RTO Decision Thresholds</h2>
          <p className="settings-description">
            Adjust the predicted RTO probability at which the system
            recommends different actions.
          </p>

          <div className="threshold-field">
            <label htmlFor="confirm_threshold">
              Order Confirmation Threshold
            </label>

            <div className="threshold-value">
              {Math.round(settings.confirm_threshold * 100)}%
            </div>

            <input
              id="confirm_threshold"
              name="confirm_threshold"
              type="range"
              min="0"
              max="100"
              value={settings.confirm_threshold * 100}
              onChange={handleChange}
            />

            <small>
              Orders above this risk level may require manual confirmation.
            </small>
          </div>

          <div className="threshold-field">
            <label htmlFor="prepaid_threshold">
              Prepaid Nudge Threshold
            </label>

            <div className="threshold-value">
              {Math.round(settings.prepaid_threshold * 100)}%
            </div>

            <input
              id="prepaid_threshold"
              name="prepaid_threshold"
              type="range"
              min="0"
              max="100"
              value={settings.prepaid_threshold * 100}
              onChange={handleChange}
            />

            <small>
              Orders above this risk level may receive a prepaid offer.
            </small>
          </div>

          <div className="threshold-field">
            <label htmlFor="hold_threshold">
              Hold for Review Threshold
            </label>

            <div className="threshold-value">
              {Math.round(settings.hold_threshold * 100)}%
            </div>

            <input
              id="hold_threshold"
              name="hold_threshold"
              type="range"
              min="0"
              max="100"
              value={settings.hold_threshold * 100}
              onChange={handleChange}
            />

            <small>
              Orders above this risk level are held for manual review.
            </small>
          </div>

          <div className="threshold-actions">
            <button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {message && <div className="settings-success">{message}</div>}
          {error && <div className="settings-error">{error}</div>}
        </section>

        <section className="settings-note">
          <h3>Important</h3>
          <p>
            These thresholds control the decision engine. A hold recommendation
            means manual review, not automatic cancellation. Thresholds should
            be calibrated against business costs and model performance before
            production use.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Settings;