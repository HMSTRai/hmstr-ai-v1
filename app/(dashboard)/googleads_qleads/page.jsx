'use client';

import { useEffect, useState } from 'react';
import { ResponsiveContainer, ComposedChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';
import useDarkmode from "@/hooks/useDarkMode";

function ClientSelector({ clients, selected, onSelect }) {
  return (
    <select
      className="w-full sm:w-auto border rounded-lg px-3 sm:px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-200"
      value={selected}
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value="">Select Client</option>
      {clients.map((c) => (
        <option key={c.client_id ?? c.cr_client_id} value={c.client_id ?? c.cr_client_id}>
          {c.cr_company_name}
        </option>
      ))}
    </select>
  );
}

function DateSelector({ startDate, endDate, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
      <input
        type="date"
        className="w-full sm:w-auto border rounded-lg px-2 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-200"
        value={startDate}
        onChange={(e) => onChange('startDate', e.target.value)}
      />
      <span className="mx-2 text-gray-400 dark:text-gray-500">to</span>
      <input
        type="date"
        className="w-full sm:w-auto border rounded-lg px-2 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-200"
        value={endDate}
        onChange={(e) => onChange('endDate', e.target.value)}
      />
    </div>
  );
}

function PeriodSelector({ period, onChange }) {
  return (
    <select
      className="w-full sm:w-auto border rounded-lg px-3 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-200"
      value={period}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="day">Daily</option>
      <option value="week">Weekly</option>
      <option value="month">Monthly</option>
    </select>
  );
}

function StatCard({ label, value, sublabel, color = 'text-blue-600', changeText, changeColor, iconType }) {
  const getIcon = (type) => {
    if (type === 'bar') {
      return (
        <svg className={`w-5 h-5 ${color}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="4" y="10" width="4" height="10" />
          <rect x="10" y="4" width="4" height="16" />
          <rect x="16" y="8" width="4" height="12" />
        </svg>
      );
    }
    if (type === 'wallet') {
      return (
        <svg className={`w-5 h-5 ${color}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M20 7V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V7C4 5.89543 4.89543 5 6 5H18C19.1046 5 20 5.89543 20 7ZM4 10H20" />
          <circle cx="18" cy="12" r="1" />
        </svg>
      );
    }
    if (type === 'dollar') {
      return (
        <svg className={`w-5 h-5 ${color}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-600 p-4 flex justify-between items-start min-w-[120px] transition hover:shadow-lg hover:bg-orange-50 dark:hover:bg-slate-700">
      <div className="flex flex-col">
        <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
        {sublabel && <span className="text-xs text-gray-500 dark:text-gray-400">{sublabel}</span>}
        <span className={`text-2xl sm:text-3xl font-bold ${color}`}>{value}</span>
        {changeText && <span className={`text-sm font-medium ${changeColor}`}>{changeText}</span>}
      </div>
      {iconType && (
        <div className="ml-4">
          <div className="w-10 h-10 rounded-full border border-orange-300 dark:border-orange-600 flex items-center justify-center">
            {getIcon(iconType)}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionCard({ children, title }) {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-8">
      {title && <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 text-gray-800 dark:text-gray-200">{title}</h3>}
      {children}
    </section>
  );
}

function GoogleAdsQLeadMetrics({ metrics }) {
  const formatCurrency = (val) =>
    typeof val === 'number'
      ? `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '--';

  const formatNumber = (val) => (typeof val === 'number' ? val.toLocaleString() : '--');

  const stats = [
    { label: 'PPC QLeads', field: 'ppcQLeads', iconType: 'bar', format: formatNumber },
    { label: 'Total Spend', field: 'totalSpend', iconType: 'wallet', format: formatCurrency },
    { label: 'CPQL', field: 'cpql', iconType: 'dollar', format: formatCurrency },
  ];

  return (
    <SectionCard title="Google Ads QLead Metrics">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 md:gap-6">
        {stats.map(({ label, field, iconType, format }) => (
          <StatCard
            key={field}
            label={label}
            value={format(metrics?.[field] ?? 0)}
            color="text-orange-600 dark:text-orange-400"
            iconType={iconType}
          />
        ))}
      </div>
    </SectionCard>
  );
}

function GoogleAdsQLeadTable({ campaigns }) {
  const formatCurrency = (val) =>
    typeof val === 'number'
      ? `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '--';

  const formatDecimal = (val) => (typeof val === 'number' ? val.toFixed(2) : '--');

  return (
    <SectionCard title="Google Ads QLead Metrics by Campaign">
      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg">
          <thead className="bg-gray-100 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">Campaign</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">Spend</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">QLeads</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">CPQL</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">Avg Leads Score</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">Avg Close Score</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length > 0 ? (
              campaigns.map((campaign, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-slate-700' : 'bg-white dark:bg-slate-800'}>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{campaign.campaign || '--'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">
                    {formatCurrency(campaign.spend)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{campaign.qleads || 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">
                    {formatCurrency(campaign.cpql)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{formatDecimal(campaign.avg_lead_score)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-slate-600">{formatDecimal(campaign.avg_close_score)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No campaign data found for the selected period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

function VolumeCostChart({ data }) {
  const [isDark] = useDarkmode();
  const textColor = isDark ? '#e5e7eb' : '#374151';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  const tooltipText = isDark ? '#ffffff' : '#374151';

  return (
    <div className="h-[200px] sm:h-[250px] md:h-[300px] bg-white dark:bg-slate-800 rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="period" tick={{ fontSize: 13, fill: textColor }} interval="preserveStartEnd" />
          <YAxis yAxisId="left" label={{ value: 'QLeads Volume', angle: -90, position: 'insideLeft', fill: textColor }} allowDecimals={false} tick={{ fontSize: 13, fill: textColor }} domain={[0, 'auto']} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Cost', angle: 90, position: 'insideRight', fill: textColor }} tick={{ fontSize: 13, fill: textColor }} />
          <Tooltip
            contentStyle={{ borderRadius: 10, fontSize: 15, backgroundColor: tooltipBg, color: tooltipText, border: 'none' }}
            labelStyle={{ fontWeight: 600, color: tooltipText }}
            formatter={(value, name) => name === 'Cost' ? `$${value.toLocaleString()}` : value}
          />
          <Legend verticalAlign="bottom" height={20} wrapperStyle={{ paddingTop: '10px' }} />
          <Bar yAxisId="right" dataKey="spend" fill="#86efac" name="Cost" barSize={30}>
            <LabelList dataKey="spend" position="top" formatter={(value) => value === 0 ? '' : `$${Math.round(value)}`} fill={textColor} fontSize={12} />
          </Bar>
          <Line yAxisId="left" type="monotone" dataKey="qleads" stroke="#f37100" name="QLeads Volume" strokeWidth={3}>
            <LabelList dataKey="qleads" position="top" formatter={(value) => value === 0 ? '' : value} fill={textColor} fontSize={12} />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function CostPerChart({ data }) {
  const [isDark] = useDarkmode();
  const textColor = isDark ? '#e5e7eb' : '#374151';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  const tooltipText = isDark ? '#ffffff' : '#374151';

  return (
    <div className="h-[200px] sm:h-[250px] md:h-[300px] bg-white dark:bg-slate-800 rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="period" tick={{ fontSize: 13, fill: textColor }} interval="preserveStartEnd" />
          <YAxis label={{ value: 'Cost Per QLead', angle: -90, position: 'insideLeft', fill: textColor }} tick={{ fontSize: 13, fill: textColor }} />
          <Tooltip
            contentStyle={{ borderRadius: 10, fontSize: 15, backgroundColor: tooltipBg, color: tooltipText, border: 'none' }}
            labelStyle={{ fontWeight: 600, color: tooltipText }}
            formatter={(value) => `$${Math.round(value).toLocaleString()}`}
          />
          <Legend verticalAlign="bottom" height={20} wrapperStyle={{ paddingTop: '10px' }} />
          <Line type="monotone" dataKey="cpql" stroke="#f37100" name="Cost Per QLead" strokeWidth={3}>
            <LabelList dataKey="cpql" position="top" formatter={(value) => value === 0 ? '' : `$${Math.round(value)}`} fill={textColor} fontSize={12} />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function GoogleAdsQLead() {
  const today = new Date().toISOString().slice(0, 10);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [volumePeriod, setVolumePeriod] = useState('month');
  const [costPeriod, setCostPeriod] = useState('month');
  const [metrics, setMetrics] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [volumeCostData, setVolumeCostData] = useState([]);
  const [costPerData, setCostPerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/clients')
      .then((res) => res.json())
      .then(({ data, error }) => {
        console.log('Clients Data:', data, 'Error:', error);
        if (error) throw new Error(error);
        setClients(data || []);
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!selectedClient || !startDate || !endDate || startDate > endDate) {
      setMetrics(null);
      setCampaigns([]);
      setVolumeCostData([]);
      setCostPerData([]);
      return;
    }

    setLoading(true);
    fetch(`/api/google-ads-qlead-metrics?clientId=${selectedClient}&start=${startDate}&end=${endDate}&volumePeriod=${volumePeriod}&costPeriod=${costPeriod}`)
      .then((res) => res.json())
      .then((result) => {
        console.log('Metrics Response:', result);
        if (result.error) throw new Error(result.error);
        setMetrics(result.data.metrics);
        setCampaigns(result.data.campaignData);
        setVolumeCostData(result.data.chartData?.volumeCost ?? []);
        setCostPerData(result.data.chartData?.costPer ?? []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedClient, startDate, endDate, volumePeriod, costPeriod]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col px-2 sm:px-4 md:px-6 lg:px-8">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-3 sm:py-4 md:py-6 px-2 sm:px-4 md:px-6">
        <ClientSelector clients={clients} selected={selectedClient} onSelect={setSelectedClient} />
        <DateSelector
          startDate={startDate}
          endDate={endDate}
          onChange={(type, val) => (type === 'startDate' ? setStartDate(val) : setEndDate(val))}
        />
      </div>

      {/* Content */}
      <div className="w-full px-2 sm:px-4 md:px-6">
        <GoogleAdsQLeadMetrics metrics={metrics} />
        <GoogleAdsQLeadTable campaigns={campaigns} />
        <SectionCard title="PPC QLeads Volume & Cost by Period">
          <div className="flex justify-end mb-2 sm:mb-3 md:mb-4">
            <PeriodSelector period={volumePeriod} onChange={setVolumePeriod} />
          </div>
          {volumeCostData.length > 0 ? (
            <VolumeCostChart data={volumeCostData} />
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No data available for the selected period.</p>
          )}
        </SectionCard>
        <SectionCard title="Cost Per QLead by Period">
          <div className="flex justify-end mb-2 sm:mb-3 md:mb-4">
            <PeriodSelector period={costPeriod} onChange={setCostPeriod} />
          </div>
          {costPerData.length > 0 ? (
            <CostPerChart data={costPerData} />
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No data available for the selected period.</p>
          )}
        </SectionCard>
      </div>

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white dark:bg-slate-900 bg-opacity-60 flex items-center justify-center z-50 text-gray-900 dark:text-gray-100">
          Loading...
        </div>
      )}

      {error && (
        <div className="fixed top-0 left-0 w-full flex justify-center p-2 sm:p-3 md:p-4">
          <div className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-2 rounded">{error}</div>
        </div>
      )}
    </div>
  );
}