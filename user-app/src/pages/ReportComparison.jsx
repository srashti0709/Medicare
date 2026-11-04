
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftRight,
  FileText,
  GitCompareArrows,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Clock3,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  Activity,
  MessageCircle,
  ClipboardList,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import api from "../api";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

.report-comparison {
  min-height: 100vh;
  padding: 36px;
  background: #F5F8F6;
  color: #404848;
  font-family: 'Manrope', sans-serif;
}

.report-comparison * {
  box-sizing: border-box;
}

.rc-container {
  max-width: 1250px;
  margin: 0 auto;
}

.rc-heading {
  margin-bottom: 28px;
}

.rc-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #256862;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

.rc-heading h1 {
  margin: 12px 0 8px;
  color: #003435;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(30px, 4vw, 42px);
  font-weight: 700;
  letter-spacing: -1.2px;
}

.rc-heading p {
  max-width: 680px;
  margin: 0;
  color: #687674;
  font-size: 15px;
  line-height: 1.8;
}

.rc-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 25px;
  padding: 16px 18px;
  border: 1px solid #CBDAD6;
  border-radius: 14px;
  background: #E7F4F1;
  color: #315D58;
  font-size: 13px;
  line-height: 1.7;
}

.rc-info svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.rc-card {
  padding: 25px;
  border: 1px solid #CBDAD6;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 5px 20px rgba(0, 52, 53, 0.035);
}

.rc-card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  color: #003435;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 21px;
  font-weight: 700;
}

.rc-card-title svg {
  color: #256862;
}

.rc-select-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.rc-field label {
  display: block;
  margin-bottom: 9px;
  color: #52615E;
  font-size: 13px;
  font-weight: 800;
}

.rc-field select {
  width: 100%;
  min-height: 49px;
  padding: 0 14px;
  border: 1px solid #CBDAD6;
  border-radius: 11px;
  outline: none;
  background: #F8FBF9;
  color: #164B4D;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.rc-field select:focus {
  border-color: #256862;
  box-shadow: 0 0 0 3px rgba(37, 104, 98, 0.12);
}

.rc-report-meta {
  margin-top: 10px;
  color: #84918D;
  font-size: 12px;
}

.rc-empty {
  padding: 35px 20px;
  border: 1px dashed #B9CDC6;
  border-radius: 15px;
  background: #F8FBF9;
  text-align: center;
}

.rc-empty-icon {
  display: grid;
  width: 54px;
  height: 54px;
  margin: 0 auto 14px;
  place-items: center;
  border-radius: 16px;
  background: #E7F4F1;
  color: #256862;
}

.rc-empty h3 {
  margin: 0 0 7px;
  color: #003435;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 20px;
}

.rc-empty p {
  max-width: 440px;
  margin: 0 auto;
  color: #71807B;
  font-size: 14px;
  line-height: 1.7;
}

.rc-results {
  margin-top: 25px;
}

.rc-section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 30px 0 15px;
}

.rc-section-heading h2 {
  margin: 0;
  color: #003435;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 22px;
}

.rc-section-heading span {
  color: #84918D;
  font-size: 12px;
}

.rc-overview-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.rc-overview-card {
  min-width: 0;
  padding: 19px;
  border: 1px solid #DCE7E2;
  border-radius: 16px;
  background: #fff;
}

.rc-overview-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 17px;
}

.rc-overview-icon {
  display: grid;
  width: 39px;
  height: 39px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 12px;
  background: #E7F4F1;
  color: #256862;
}

.rc-overview-card:nth-child(2) .rc-overview-icon {
  background: #EAF5EF;
  color: #397C5A;
}

.rc-overview-card:nth-child(3) .rc-overview-icon {
  background: #FFF1EA;
  color: #B66A49;
}

.rc-overview-card:nth-child(4) .rc-overview-icon {
  background: #F0EFFA;
  color: #7167A5;
}

.rc-overview-label {
  color: #71807B;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.5;
}

.rc-overview-counts {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 7px;
  color: #003435;
  font-family: 'Bricolage Grotesque', sans-serif;
}

.rc-overview-counts strong {
  font-size: 27px;
  font-weight: 700;
}

.rc-overview-counts span {
  color: #84918D;
  font-family: 'Manrope', sans-serif;
  font-size: 12px;
}

.rc-overview-change {
  margin-top: 9px;
  color: #84918D;
  font-size: 11px;
  line-height: 1.5;
}

.rc-chart-card {
  padding: 23px;
  border: 1px solid #CBDAD6;
  border-radius: 18px;
  background: #fff;
}

.rc-chart-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 23px;
}

.rc-chart-header h3 {
  margin: 0 0 6px;
  color: #003435;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 19px;
}

.rc-chart-header p {
  margin: 0;
  color: #84918D;
  font-size: 12px;
  line-height: 1.6;
}

.rc-chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.rc-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #64716E;
  font-size: 12px;
  white-space: nowrap;
}

.rc-legend-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.rc-chart-rows {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.rc-chart-row {
  display: grid;
  grid-template-columns: 155px minmax(0, 1fr);
  align-items: center;
  gap: 18px;
}

.rc-chart-label {
  color: #52615E;
  font-size: 13px;
  font-weight: 800;
}

.rc-chart-bars {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.rc-chart-bar-line {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 28px;
  align-items: center;
  gap: 9px;
}

.rc-chart-track {
  height: 11px;
  overflow: hidden;
  border-radius: 20px;
  background: #EDF3F0;
}

.rc-chart-fill {
  height: 100%;
  min-width: 0;
  border-radius: 20px;
  transition: width 0.25s ease;
}

.rc-chart-value {
  color: #52615E;
  font-size: 12px;
  font-weight: 800;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.rc-chart-empty {
  padding: 22px;
  border-radius: 12px;
  background: #F8FBF9;
  color: #84918D;
  font-size: 13px;
  text-align: center;
}

.rc-chart-footnote {
  margin: 20px 0 0;
  padding-top: 15px;
  border-top: 1px solid #E8EFEB;
  color: #84918D;
  font-size: 11px;
  line-height: 1.7;
}

.rc-coverage-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.rc-coverage-card {
  padding: 20px;
  border: 1px solid #DCE7E2;
  border-radius: 15px;
  background: #fff;
}

.rc-coverage-card h3 {
  margin: 0 0 5px;
  color: #164B4D;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 17px;
  overflow-wrap: anywhere;
}

.rc-coverage-date {
  margin-bottom: 17px;
  color: #84918D;
  font-size: 12px;
}

.rc-coverage-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rc-coverage-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 11px;
  border-bottom: 1px solid #EDF2EF;
}

.rc-coverage-item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.rc-coverage-name {
  color: #52615E;
  font-size: 12px;
  font-weight: 700;
}

.rc-coverage-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #397C5A;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
}

.rc-coverage-status.missing {
  color: #899590;
}

.rc-followup {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  margin-top: 20px;
  padding: 18px;
  border: 1px solid #D8D5EC;
  border-radius: 15px;
  background: #F5F4FB;
}

.rc-followup-icon {
  display: grid;
  width: 39px;
  height: 39px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 12px;
  background: #E9E7F5;
  color: #7167A5;
}

.rc-followup h3 {
  margin: 0 0 5px;
  color: #3E3A68;
  font-size: 14px;
}

.rc-followup p {
  margin: 0;
  color: #6D698C;
  font-size: 12px;
  line-height: 1.7;
}

.rc-summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.rc-summary-card {
  padding: 20px;
  border: 1px solid #DCE7E2;
  border-radius: 15px;
  background: #FBFDFC;
}

.rc-summary-card h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 13px;
  color: #164B4D;
  font-size: 14px;
}

.rc-summary-card p {
  margin: 0;
  color: #64716E;
  font-size: 13px;
  line-height: 1.8;
  overflow-wrap: anywhere;
}

.rc-diff-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
}

.rc-diff-card {
  min-width: 0;
  padding: 19px;
  border: 1px solid #DCE7E2;
  border-radius: 15px;
  background: #fff;
}

.rc-diff-card h3 {
  margin: 0 0 5px;
  color: #164B4D;
  font-size: 14px;
}

.rc-diff-description {
  margin: 0 0 15px;
  color: #84918D;
  font-size: 12px;
  line-height: 1.6;
}

.rc-diff-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 27px;
  height: 25px;
  margin-bottom: 13px;
  padding: 0 8px;
  border-radius: 8px;
  background: #E7F4F1;
  color: #256862;
  font-size: 12px;
  font-weight: 800;
}

.rc-diff-list {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.rc-diff-list li {
  padding: 10px 11px;
  border-radius: 9px;
  background: #F5F8F6;
  color: #53615D;
  font-size: 12px;
  line-height: 1.65;
  overflow-wrap: anywhere;
}

.rc-no-items {
  color: #87938F;
  font-size: 12px;
  line-height: 1.6;
}

.rc-category {
  margin-top: 24px;
}

.rc-category h3 {
  margin: 0 0 12px;
  color: #003435;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 19px;
}

.rc-category-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.rc-category-panel {
  padding: 17px;
  border: 1px solid #DCE7E2;
  border-radius: 13px;
  background: #FBFDFC;
}

.rc-category-panel h4 {
  margin: 0 0 12px;
  color: #52615E;
  font-size: 13px;
}

.rc-category-panel ul {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 18px;
  margin: 0;
}

.rc-category-panel li {
  color: #64716E;
  font-size: 12px;
  line-height: 1.7;
  overflow-wrap: anywhere;
}

.rc-category-panel p {
  margin: 0;
  color: #899590;
  font-size: 12px;
}

.rc-loading,
.rc-error {
  display: flex;
  min-height: 280px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 13px;
  color: #64716E;
  text-align: center;
}

.rc-loading svg {
  color: #256862;
  animation: rc-spin 1s linear infinite;
}

@keyframes rc-spin {
  to { transform: rotate(360deg); }
}

.rc-error svg {
  color: #B65D51;
}

.rc-retry {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 10px 15px;
  border: 1px solid #CBDAD6;
  border-radius: 9px;
  background: #fff;
  color: #164B4D;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.rc-retry:hover {
  background: #E7F4F1;
}

@media (max-width: 1000px) {
  .rc-overview-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .rc-diff-grid {
    grid-template-columns: 1fr 1fr;
  }

  .rc-diff-card:last-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 850px) {
  .rc-diff-grid {
    grid-template-columns: 1fr;
  }

  .rc-diff-card:last-child {
    grid-column: auto;
  }
}

@media (max-width: 650px) {
  .report-comparison {
    padding: 24px 15px;
  }

  .rc-card {
    padding: 18px;
  }

  .rc-select-grid,
  .rc-summary-grid,
  .rc-category-grid,
  .rc-coverage-grid {
    grid-template-columns: 1fr;
  }

  .rc-section-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .rc-overview-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .rc-overview-card {
    padding: 14px;
  }

  .rc-overview-counts strong {
    font-size: 23px;
  }

  .rc-chart-card {
    padding: 17px;
  }

  .rc-chart-header {
    flex-direction: column;
  }

  .rc-chart-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}

@media (max-width: 390px) {
  .rc-overview-grid {
    grid-template-columns: 1fr;
  }
}
`;

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const normalizeItems = (items = []) =>
  (Array.isArray(items) ? items : [])
    .filter((item) => typeof item === "string" && item.trim())
    .map((item) => item.trim());

const getDiscussionItems = (report) =>
  normalizeItems(report?.questionsToDiscuss);

const compareItems = (olderItems = [], newerItems = []) => {
  const older = normalizeItems(olderItems);
  const newer = normalizeItems(newerItems);

  const olderMap = new Map(
    older.map((item) => [item.toLowerCase(), item])
  );

  const newerMap = new Map(
    newer.map((item) => [item.toLowerCase(), item])
  );

  return {
    common: newer
      .filter((item) => olderMap.has(item.toLowerCase()))
      .map((item) => olderMap.get(item.toLowerCase())),

    newlyListed: newer.filter(
      (item) => !olderMap.has(item.toLowerCase())
    ),

    notListedInNewer: older.filter(
      (item) => !newerMap.has(item.toLowerCase())
    ),
  };
};

const OverviewCard = ({
  icon: Icon,
  label,
  olderCount,
  newerCount,
}) => (
  <article className="rc-overview-card">
    <div className="rc-overview-top">
      <div className="rc-overview-icon">
        <Icon size={19} />
      </div>
      <span className="rc-overview-label">{label}</span>
    </div>

    <div className="rc-overview-counts">
      <strong>{olderCount}</strong>
      <span>→</span>
      <strong>{newerCount}</strong>
    </div>

    <div className="rc-overview-change">
      Older report → Newer report
    </div>
  </article>
);

const FindingsChart = ({ olderReport, newerReport }) => {
  const chartRows = [
    {
      label: "Key findings",
      older: normalizeItems(olderReport.keyFindings).length,
      newer: normalizeItems(newerReport.keyFindings).length,
    },
    {
      label: "Normal findings",
      older: normalizeItems(olderReport.normalValues).length,
      newer: normalizeItems(newerReport.normalValues).length,
    },
    {
      label: "Abnormal findings",
      older: normalizeItems(olderReport.abnormalValues).length,
      newer: normalizeItems(newerReport.abnormalValues).length,
    },
    {
      label: "Discussion points",
      older: getDiscussionItems(olderReport).length,
      newer: getDiscussionItems(newerReport).length,
    },
  ];

  const maximum = Math.max(
    1,
    ...chartRows.flatMap((row) => [row.older, row.newer])
  );

  const hasFindings = chartRows.some(
    (row) => row.older > 0 || row.newer > 0
  );

  return (
    <div className="rc-chart-card">
      <div className="rc-chart-header">
        <div>
          <h3>Findings distribution</h3>
          <p>Number of text findings returned in each report analysis.</p>
        </div>

        <div className="rc-chart-legend">
          <span className="rc-legend-item">
            <span
              className="rc-legend-dot"
              style={{ background: "#9CBDB3" }}
            />
            Older report
          </span>

          <span className="rc-legend-item">
            <span
              className="rc-legend-dot"
              style={{ background: "#256862" }}
            />
            Newer report
          </span>
        </div>
      </div>

      {!hasFindings ? (
        <div className="rc-chart-empty">
          No findings are available to display in this chart.
        </div>
      ) : (
        <div className="rc-chart-rows">
          {chartRows.map((row) => (
            <div className="rc-chart-row" key={row.label}>
              <div className="rc-chart-label">{row.label}</div>

              <div className="rc-chart-bars">
                <div className="rc-chart-bar-line">
                  <div className="rc-chart-track">
                    <div
                      className="rc-chart-fill"
                      style={{
                        width: `${(row.older / maximum) * 100}%`,
                        background: "#9CBDB3",
                      }}
                    />
                  </div>

                  <span className="rc-chart-value">{row.older}</span>
                </div>

                <div className="rc-chart-bar-line">
                  <div className="rc-chart-track">
                    <div
                      className="rc-chart-fill"
                      style={{
                        width: `${(row.newer / maximum) * 100}%`,
                        background: "#256862",
                      }}
                    />
                  </div>

                  <span className="rc-chart-value">{row.newer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="rc-chart-footnote">
        These bars represent counts of written findings, not measured
        laboratory values, medical severity, or evidence that a condition
        has improved or worsened.
      </p>
    </div>
  );
};

const ReportCoverage = ({ report, title }) => {
  const sections = [
    {
      label: "Key findings",
      count: normalizeItems(report.keyFindings).length,
    },
    {
      label: "Normal findings",
      count: normalizeItems(report.normalValues).length,
    },
    {
      label: "Abnormal findings",
      count: normalizeItems(report.abnormalValues).length,
    },
    {
      label: "Doctor discussion points",
      count: getDiscussionItems(report).length,
    },
  ];

  return (
    <article className="rc-coverage-card">
      <h3>{title}</h3>

      <div className="rc-coverage-date">
        <CalendarDays
          size={13}
          style={{
            display: "inline",
            marginRight: 5,
            verticalAlign: "middle",
          }}
        />
        {formatDate(report.createdAt)}
      </div>

      <div className="rc-coverage-list">
        {sections.map((section) => (
          <div className="rc-coverage-item" key={section.label}>
            <span className="rc-coverage-name">{section.label}</span>

            <span
              className={`rc-coverage-status ${
                section.count === 0 ? "missing" : ""
              }`}
            >
              {section.count > 0 ? (
                <CheckCircle2 size={14} />
              ) : (
                <AlertCircle size={14} />
              )}

              {section.count > 0
                ? `${section.count} item${section.count === 1 ? "" : "s"}`
                : "No items returned"}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
};

const ReportComparison = () => {
  const [reports, setReports] = useState([]);
  const [olderReportId, setOlderReportId] = useState("");
  const [newerReportId, setNewerReportId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/reports/history");
      const reportList = response.data?.data || [];

      setReports(reportList);

      if (reportList.length >= 2) {
        setNewerReportId(reportList[0]._id);
        setOlderReportId(reportList[1]._id);
      } else if (reportList.length === 1) {
        setNewerReportId(reportList[0]._id);
        setOlderReportId("");
      } else {
        setNewerReportId("");
        setOlderReportId("");
      }
    } catch (err) {
      console.error("Report comparison history error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your saved reports. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const olderReport = useMemo(
    () => reports.find((report) => report._id === olderReportId),
    [reports, olderReportId]
  );

  const newerReport = useMemo(
    () => reports.find((report) => report._id === newerReportId),
    [reports, newerReportId]
  );

  const comparisons = useMemo(() => {
    if (!olderReport || !newerReport) return null;

    return {
      keyFindings: compareItems(
        olderReport.keyFindings,
        newerReport.keyFindings
      ),
      normalValues: compareItems(
        olderReport.normalValues,
        newerReport.normalValues
      ),
      abnormalValues: compareItems(
        olderReport.abnormalValues,
        newerReport.abnormalValues
      ),
      discussion: compareItems(
        getDiscussionItems(olderReport),
        getDiscussionItems(newerReport)
      ),
    };
  }, [olderReport, newerReport]);

  const renderList = (items, emptyMessage) => {
    if (!items.length) {
      return <p className="rc-no-items">{emptyMessage}</p>;
    }

    return (
      <ul className="rc-diff-list">
        {items.map((item, index) => (
          <li key={`${index}-${item}`}>{item}</li>
        ))}
      </ul>
    );
  };

  const renderCategory = (title, olderItems, newerItems) => (
    <div className="rc-category">
      <h3>{title}</h3>

      <div className="rc-category-grid">
        <div className="rc-category-panel">
          <h4>Older report</h4>
          {renderList(olderItems, "No entries listed in this report.")}
        </div>

        <div className="rc-category-panel">
          <h4>Newer report</h4>
          {renderList(newerItems, "No entries listed in this report.")}
        </div>
      </div>
    </div>
  );

  const canCompare =
    olderReport &&
    newerReport &&
    olderReportId !== newerReportId &&
    comparisons;

  return (
    <>
      <style>{styles}</style>

      <main className="report-comparison">
        <div className="rc-container">
          <header className="rc-heading">
            <div className="rc-eyebrow">
              <GitCompareArrows size={16} />
              Health records
            </div>

            <h1>Report Comparison</h1>

            <p>
              Review your saved health reports side by side and explore
              how their recorded findings differ.
            </p>
          </header>

          <div className="rc-info">
            <ShieldCheck size={19} />
            <span>
              This feature compares the written findings saved from your
              reports. It does not determine whether a medical condition has
              improved or worsened. Please discuss changes with your doctor.
            </span>
          </div>

          <section className="rc-card">
            <div className="rc-card-title">
              <ArrowLeftRight size={21} />
              Select reports to compare
            </div>

            {loading ? (
              <div className="rc-loading">
                <LoaderCircle size={30} />
                <span>Loading your saved reports...</span>
              </div>
            ) : error ? (
              <div className="rc-error">
                <AlertCircle size={30} />
                <span>{error}</span>

                <button className="rc-retry" onClick={fetchReports}>
                  <RefreshCw size={15} />
                  Try again
                </button>
              </div>
            ) : reports.length === 0 ? (
              <div className="rc-empty">
                <div className="rc-empty-icon">
                  <FileText size={25} />
                </div>

                <h3>No saved reports yet</h3>

                <p>
                  Upload and analyze a health report first. Your saved reports
                  will appear here for comparison.
                </p>
              </div>
            ) : reports.length === 1 ? (
              <div className="rc-empty">
                <div className="rc-empty-icon">
                  <FileText size={25} />
                </div>

                <h3>One report saved</h3>

                <p>
                  You have one saved report:{" "}
                  <strong>{reports[0].originalFilename}</strong>. Upload
                  another report to compare findings between two reports.
                </p>
              </div>
            ) : (
              <>
                <div className="rc-select-grid">
                  <div className="rc-field">
                    <label htmlFor="older-report">Older report</label>

                    <select
                      id="older-report"
                      value={olderReportId}
                      onChange={(event) =>
                        setOlderReportId(event.target.value)
                      }
                    >
                      {reports.map((report) => (
                        <option
                          key={report._id}
                          value={report._id}
                          disabled={report._id === newerReportId}
                        >
                          {report.originalFilename} —{" "}
                          {formatDate(report.createdAt)}
                        </option>
                      ))}
                    </select>

                    {olderReport && (
                      <div className="rc-report-meta">
                        <CalendarDays
                          size={13}
                          style={{
                            display: "inline",
                            marginRight: 5,
                            verticalAlign: "middle",
                          }}
                        />
                        {formatDate(olderReport.createdAt)}
                      </div>
                    )}
                  </div>

                  <div className="rc-field">
                    <label htmlFor="newer-report">Newer report</label>

                    <select
                      id="newer-report"
                      value={newerReportId}
                      onChange={(event) =>
                        setNewerReportId(event.target.value)
                      }
                    >
                      {reports.map((report) => (
                        <option
                          key={report._id}
                          value={report._id}
                          disabled={report._id === olderReportId}
                        >
                          {report.originalFilename} —{" "}
                          {formatDate(report.createdAt)}
                        </option>
                      ))}
                    </select>

                    {newerReport && (
                      <div className="rc-report-meta">
                        <CalendarDays
                          size={13}
                          style={{
                            display: "inline",
                            marginRight: 5,
                            verticalAlign: "middle",
                          }}
                        />
                        {formatDate(newerReport.createdAt)}
                      </div>
                    )}
                  </div>
                </div>

                {olderReportId === newerReportId && (
                  <p className="rc-no-items" style={{ marginTop: 15 }}>
                    Select two different reports to compare them.
                  </p>
                )}
              </>
            )}
          </section>

          {canCompare && (
            <section className="rc-results">
              <div className="rc-section-heading">
                <h2>Comparison overview</h2>
                <span>
                  {formatDate(olderReport.createdAt)} →{" "}
                  {formatDate(newerReport.createdAt)}
                </span>
              </div>

              <div className="rc-overview-grid">
                <OverviewCard
                  icon={ClipboardList}
                  label="Key findings"
                  olderCount={normalizeItems(olderReport.keyFindings).length}
                  newerCount={normalizeItems(newerReport.keyFindings).length}
                />

                <OverviewCard
                  icon={CheckCircle2}
                  label="Normal findings"
                  olderCount={normalizeItems(olderReport.normalValues).length}
                  newerCount={normalizeItems(newerReport.normalValues).length}
                />

                <OverviewCard
                  icon={Activity}
                  label="Abnormal findings"
                  olderCount={normalizeItems(olderReport.abnormalValues).length}
                  newerCount={normalizeItems(newerReport.abnormalValues).length}
                />

                <OverviewCard
                  icon={MessageCircle}
                  label="Discussion points"
                  olderCount={getDiscussionItems(olderReport).length}
                  newerCount={getDiscussionItems(newerReport).length}
                />
              </div>

              <div className="rc-section-heading">
                <h2>Visual comparison</h2>
                <span>Older report vs newer report</span>
              </div>

              <FindingsChart
                olderReport={olderReport}
                newerReport={newerReport}
              />

              <div className="rc-section-heading">
                <h2>Analysis sections</h2>
                <span>Sections containing returned findings</span>
              </div>

              <div className="rc-coverage-grid">
                <ReportCoverage
                  report={olderReport}
                  title={olderReport.originalFilename || "Older report"}
                />

                <ReportCoverage
                  report={newerReport}
                  title={newerReport.originalFilename || "Newer report"}
                />
              </div>

              <div className="rc-followup">
                <div className="rc-followup-icon">
                  <MessageCircle size={19} />
                </div>

                <div>
                  <h3>Doctor discussion reminder</h3>
                  <p>
                    {getDiscussionItems(newerReport).length > 0
                      ? `The newer report analysis returned ${
                          getDiscussionItems(newerReport).length
                        } discussion point${
                          getDiscussionItems(newerReport).length === 1
                            ? ""
                            : "s"
                        }. Consider reviewing these with your doctor.`
                      : "No doctor discussion questions were returned by the newer report analysis. You can still discuss any concerns with your doctor."}
                  </p>
                </div>
              </div>

              <div className="rc-section-heading">
                <h2>Report summaries</h2>
                <span>
                  {formatDate(olderReport.createdAt)} →{" "}
                  {formatDate(newerReport.createdAt)}
                </span>
              </div>

              <div className="rc-summary-grid">
                <article className="rc-summary-card">
                  <h3>
                    <Clock3 size={17} />
                    Older report
                  </h3>

                  <p>
                    <strong>{olderReport.originalFilename}</strong>
                  </p>

                  <p style={{ marginTop: 9 }}>
                    {olderReport.summary || "No summary available."}
                  </p>
                </article>

                <article className="rc-summary-card">
                  <h3>
                    <CheckCircle2 size={17} />
                    Newer report
                  </h3>

                  <p>
                    <strong>{newerReport.originalFilename}</strong>
                  </p>

                  <p style={{ marginTop: 9 }}>
                    {newerReport.summary || "No summary available."}
                  </p>
                </article>
              </div>

              <div className="rc-section-heading">
                <h2>Key findings comparison</h2>
                <span>Text-based comparison</span>
              </div>

              <div className="rc-diff-grid">
                <article className="rc-diff-card">
                  <h3>Present in both</h3>
                  <p className="rc-diff-description">
                    Findings listed in both reports.
                  </p>

                  <div className="rc-diff-count">
                    {comparisons.keyFindings.common.length}
                  </div>

                  {renderList(
                    comparisons.keyFindings.common,
                    "No matching key findings."
                  )}
                </article>

                <article className="rc-diff-card">
                  <h3>Newly listed</h3>
                  <p className="rc-diff-description">
                    Findings listed in the newer report but not the older one.
                  </p>

                  <div className="rc-diff-count">
                    {comparisons.keyFindings.newlyListed.length}
                  </div>

                  {renderList(
                    comparisons.keyFindings.newlyListed,
                    "No newly listed key findings."
                  )}
                </article>

                <article className="rc-diff-card">
                  <h3>Not listed in newer report</h3>
                  <p className="rc-diff-description">
                    Findings listed in the older report but absent from the
                    newer one.
                  </p>

                  <div className="rc-diff-count">
                    {comparisons.keyFindings.notListedInNewer.length}
                  </div>

                  {renderList(
                    comparisons.keyFindings.notListedInNewer,
                    "No such key findings."
                  )}
                </article>
              </div>

              {renderCategory(
                "Normal values and findings",
                olderReport.normalValues || [],
                newerReport.normalValues || []
              )}

              {renderCategory(
                "Abnormal values and findings",
                olderReport.abnormalValues || [],
                newerReport.abnormalValues || []
              )}

              {renderCategory(
                "Doctor discussion points",
                getDiscussionItems(olderReport),
                getDiscussionItems(newerReport)
              )}
            </section>
          )}
        </div>
      </main>
    </>
  );
};

export default ReportComparison;
