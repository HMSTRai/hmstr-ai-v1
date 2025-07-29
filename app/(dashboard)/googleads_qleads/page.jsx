'use client'

import { useEffect, useState } from 'react'

function ClientSelector({ clients, selected, onSelect }) {
  return (
    <select
      className="w-full sm:w-auto border rounded-lg px-3 sm:px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      value={selected}
      onChange={e => onSelect(e.target.value)}
    >
      <option value="">Select Client</option>
      {clients.map(c => (
        <option key={c.client_id ?? c.cr_client_id} value={c.client_id ?? c.cr_client_id}>
          {c.cr_company_name}
        </option>
      ))}
    </select>
  )
}

function DateSelector({ startDate, endDate, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
      <input
        type="date"
        className="w-full sm:w-auto border rounded-lg px-2 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        value={startDate}
        onChange={e => onChange('startDate', e.target.value)}
      />
      <span className="mx-2 text-gray-400">to</span>
      <input
        type="date"
        className="w-full sm:w-auto border rounded-lg px-2 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        value={endDate}
        onChange={e => onChange('endDate', e.target.value)}
      />
    </div>
  )
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
    <div className="bg-white rounded-xl shadow-md p-4 flex justify-between items-start min-w-[120px] transition hover:shadow-lg hover:bg-orange-50">
      <div className="flex flex-col">
        <span className="text-sm text-gray-600">{label}</span>
        {sublabel && <span className="text-xs text-gray-500">{sublabel}</span>}
        <span className={`text-2xl sm:text-3xl font-bold ${color}`}>{value}</span>
        {changeText && <span className={`text-sm font-medium ${changeColor}`}>{changeText}</span>}
      </div>
      {iconType && (
        <div className="ml-4">
          <div className="w-10 h-10 rounded-full border border-orange-300 flex items-center justify-center">
            {getIcon(iconType)}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionCard({ children, title }) {
  return (
    <section className="bg-white rounded-2xl shadow p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-8">
      {title && <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 text-gray-800">{title}</h3>}
      {children}
    </section>
  )
}

function GoogleAdsQLeadMetrics({ metrics }) {
  const formatCurrency = val =>
    typeof val === 'number'
      ? `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '--';

  const formatNumber = val => (typeof val === 'number' ? val.toLocaleString() : '--');

  const stats = [
    { label: 'PPC QLeads', field: 'ppc_qleads', iconType: 'bar', format: formatNumber },
    { label: 'Total Spend', field: 'total_spend', iconType: 'wallet', format: formatCurrency },
    { label: 'CPQL', field: 'cpql', iconType: 'dollar', format: formatCurrency },
  ];

  return (
    <SectionCard title="Google Ads QLead Metrics">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 md:gap-6">
        {stats.map(({ label, field, iconType, format }) => (
          <StatCard
            key={field}
            label={label}
            value={format(metrics?.sourceMetrics?.[field] ?? 0)}
            color="text-orange-600"
            iconType={iconType}
          />
        ))}
      </div>
    </SectionCard>
  )
}

function GoogleAdsQLeadTable({ campaigns }) {
  return (
    <SectionCard title="Google Ads QLead Metrics by Campaign">
      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Campaign</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Spend</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">QLeads</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">CPQL</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Avg Leads Score</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Avg Close Score</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length > 0 ? (
              campaigns.map((campaign, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-4 text-sm text-gray-900 border-b">{campaign.campaign || '--'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 border-b">
                    {typeof campaign.spend === 'number' ? `$${campaign.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '--'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 border-b">{campaign.qleads || 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 border-b">
                    {typeof campaign.cpql === 'number' ? `$${campaign.cpql.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '--'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 border-b">{campaign.avg_leads_score || 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 border-b">{campaign.avg_close_score || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No campaign data found for the selected period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}

function createEmptyChartData(start, end) {
  if (!start || !end || start > end) return [];
  const result = [];
  let current = new Date(start);
  const endDateObj = new Date(end);
  while (current <= endDateObj) {
    const dateStr = current.toISOString().slice(0, 10);
    result.push({
      date: dateStr,
      total: 0,
      ppc: 0,
      lsa: 0,
      seo: 0,
    });
    current.setDate(current.getDate() + 1);
  }
  return result;
}

export default function GoogleAdsQLead() {
  const today = new Date().toISOString().slice(0, 10); // July 29, 2025
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [metrics, setMetrics] = useState(null);
  const [previousMetrics, setPreviousMetrics] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/clients')
      .then(res => res.json())
      .then(({ data, error }) => {
        console.log('Clients Data:', data, 'Error:', error);
        if (error) throw new Error(error);
        setClients(data || []);
      })
      .catch(err => setError(err.message));
  }, []);

  useEffect(() => {
    if (!selectedClient || !startDate || !endDate || startDate > endDate) {
      setMetrics(null);
      setPreviousMetrics(null);
      setCampaigns([]);
      return;
    }

    const currentStartDate = new Date(startDate);
    const currentEndDate = new Date(endDate);
    const length = Math.floor((currentEndDate - currentStartDate) / (1000 * 60 * 60 * 24)) + 1;

    const previousEndDateObj = new Date(currentStartDate);
    previousEndDateObj.setDate(previousEndDateObj.getDate() - 1);
    const previousEnd = previousEndDateObj.toISOString().slice(0, 10);

    const previousStartDateObj = new Date(previousEndDateObj);
    previousStartDateObj.setDate(previousStartDateObj.getDate() - length + 1);
    const previousStart = previousStartDateObj.toISOString().slice(0, 10);

    setLoading(true);
    Promise.all([
      fetch(`/api/googleads-qleads?clientId=${selectedClient}&start=${startDate}&end=${endDate}&type=metrics`)
        .then(res => res.json()),
      fetch(`/api/googleads-qleads?clientId=${selectedClient}&start=${startDate}&end=${endDate}&type=bycampaign`)
        .then(res => res.json()),
      fetch(`/api/googleads-qleads?clientId=${selectedClient}&start=${previousStart}&end=${previousEnd}&type=metrics`)
        .then(res => res.json())
    ])
      .then(([currentRes, campaignsRes, previousRes]) => {
        console.log('Current Metrics Response:', currentRes);
        console.log('Campaigns Response:', campaignsRes);
        console.log('Previous Metrics Response:', previousRes);
        if (currentRes.error) throw new Error(currentRes.error);
        if (campaignsRes.error) throw new Error(campaignsRes.error);
        if (previousRes.error) throw new Error(previousRes.error);
        setMetrics(currentRes.data || null);
        setCampaigns(campaignsRes.data?.campaigns || []);
        setPreviousMetrics(previousRes.data || null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedClient, startDate, endDate]);

  const formatCurrency = val =>
    typeof val === 'number'
      ? `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '--';

  const formatNumber = val => (typeof val === 'number' ? val.toLocaleString() : '--');

  const stats = [
    { label: 'PPC QLeads', field: 'ppc_qleads', iconType: 'bar' },
    { label: 'Total Spend', field: 'total_spend', iconType: 'wallet' },
    { label: 'CPQL', field: 'cpql', iconType: 'dollar' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col px-2 sm:px-4 md:px-6 lg:px-8">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-3 sm:py-4 md:py-6 px-2 sm:px-4 md:px-6">
        <ClientSelector clients={clients} selected={selectedClient} onSelect={setSelectedClient} />
        <DateSelector
          startDate={startDate}
          endDate={endDate}
          onChange={(type, val) => (type === 'startDate' ? setStartDate(val) : setEndDate(val))}
        />
      </div>

      {/* Google Ads QLead Metrics */}
      <div className="w-full px-2 sm:px-4 md:px-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 md:mb-6 mt-2 sm:mt-4">Google Ads QLead Metrics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          {stats.map(({ label, field, iconType }) => {
            const currentValue = metrics?.sourceMetrics?.[field] ?? 0;
            const previousValue = previousMetrics?.sourceMetrics?.[field] ?? 0;
            const change = previousValue === 0 ? 0 : ((currentValue - previousValue) / previousValue * 100);
            const changeAbs = Math.abs(change).toFixed(0);
            const changeText = change === 0 ? '0%' : (change > 0 ? `↑ ${changeAbs}%` : `↓ ${changeAbs}%`);
            const changeColor = change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600';
            const isCurrency = field.includes('spend') || field.includes('cpql');
            const formattedValue = isCurrency ? formatCurrency(currentValue) : formatNumber(currentValue);

            return (
              <StatCard
                key={field}
                label={label}
                value={formattedValue}
                color="text-orange-600"
                changeText={changeText}
                changeColor={changeColor}
                iconType={iconType}
              />
            );
          })}
        </div>
        <GoogleAdsQLeadTable campaigns={campaigns} />
      </div>

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-60 flex items-center justify-center z-50">
          Loading...
        </div>
      )}

      {error && (
        <div className="fixed top-0 left-0 w-full flex justify-center p-2 sm:p-3 md:p-4">
          <div className="bg-red-100 text-red-600 px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-2 rounded">{error}</div>
        </div>
      )}
    </div>
  );
}