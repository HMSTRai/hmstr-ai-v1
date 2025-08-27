'use client'

import { useEffect, useState } from 'react'
import { ComposedChart, Area, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ResponsiveContainer } from 'recharts'
import useDarkmode from "@/hooks/useDarkMode";

function DateSelector({ startDate, endDate, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
      <input
        type="date"
        className="w-full sm:w-auto border border-[#f36622] rounded-lg px-2 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f36622] focus:border-[#f36622] dark:bg-slate-800 dark:border-[#f36622] dark:text-gray-200 dark:[&::-webkit-calendar-picker-indicator]:brightness-0 dark:[&::-webkit-calendar-picker-indicator]:saturate-100 dark:[&::-webkit-calendar-picker-indicator]:invert-[100%] dark:[&::-webkit-calendar-picker-indicator]:sepia-[93%] dark:[&::-webkit-calendar-picker-indicator]:saturate-[1773%] dark:[&::-webkit-calendar-picker-indicator]:hue-rotate-[345deg] dark:[&::-webkit-calendar-picker-indicator]:brightness-[92%] dark:[&::-webkit-calendar-picker-indicator]:contrast-[91%]"
        value={startDate}
        onChange={e => onChange('startDate', e.target.value)}
      />
      <span className="mx-2 text-gray-400 dark:text-gray-500">to</span>
      <input
        type="date"
        className="w-full sm:w-auto border border-[#f36622] rounded-lg px-2 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f36622] focus:border-[#f36622] dark:bg-slate-800 dark:border-[#f36622] dark:text-gray-200 dark:[&::-webkit-calendar-picker-indicator]:brightness-0 dark:[&::-webkit-calendar-picker-indicator]:saturate-100 dark:[&::-webkit-calendar-picker-indicator]:invert-[100%] dark:[&::-webkit-calendar-picker-indicator]:sepia-[93%] dark:[&::-webkit-calendar-picker-indicator]:saturate-[1773%] dark:[&::-webkit-calendar-picker-indicator]:hue-rotate-[345deg] dark:[&::-webkit-calendar-picker-indicator]:brightness-[92%] dark:[&::-webkit-calendar-picker-indicator]:contrast-[91%]"
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
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4 flex justify-between items-start min-w-[120px] transition hover:shadow-lg hover:bg-[#f36622]/5 dark:hover:bg-slate-700 border border-[#f36622]">
      <div className="flex flex-col">
        <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
        {sublabel && <span className="text-xs text-gray-500 dark:text-gray-400">{sublabel}</span>}
        <span className={`text-2xl sm:text-3xl font-bold ${color}`}>{value}</span>
        {changeText && <span className={`text-sm font-medium ${changeColor}`}>{changeText}</span>}
      </div>
      {iconType && (
        <div className="ml-4">
          <div className="w-10 h-10 rounded-full border border-[#f36622]/30 dark:border-[#f36622] flex items-center justify-center">
            {getIcon(iconType)}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionCard({ children, title }) {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-8 border border-[#f36622]">
      {title && <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 text-gray-800 dark:text-gray-200">{title}</h3>}
      {children}
    </section>
  )
}

function getDatesInRange(start, end, groupBy = 'day') {
  const dates = [];
  let current = new Date(start);
  const endDate = new Date(end);

  while (current <= endDate) {
    let dateStr = current.toISOString().slice(0, 10);
    if (groupBy === 'week') {
      // Set to the start of the week (Monday)
      const day = current.getDay();
      const daysToSubtract = day === 0 ? 6 : day - 1;
      current.setDate(current.getDate() - daysToSubtract);
      dateStr = current.toISOString().slice(0, 10);
    } else if (groupBy === 'month') {
      current.setDate(1);
      dateStr = current.toISOString().slice(0, 10);
    }
    if (!dates.includes(dateStr) && new Date(dateStr) <= endDate) {
      dates.push(dateStr);
    }
    if (groupBy === 'week') {
      current.setDate(current.getDate() + 7);
    } else if (groupBy === 'month') {
      current.setMonth(current.getMonth() + 1);
    } else {
      current.setDate(current.getDate() + 1);
    }
  }
  return dates;
}

function createEmptyChartData(start, end, groupBy) {
  const dates = getDatesInRange(start, end, groupBy);
  return dates.map(date => ({
    date,
    total: 0,
    ppc: 0,
    lsa: 0,
    seo: 0,
  }));
}

function createEmptyVolumeCostData(start, end, groupBy) {
  const dates = getDatesInRange(start, end, groupBy);
  return dates.map(date => ({
    date,
    volume: 0,
    cost: 0,
  }));
}

function createEmptyCostPerData(start, end, groupBy) {
  const dates = getDatesInRange(start, end, groupBy);
  return dates.map(date => ({
    date,
    costper: 0,
  }));
}

export default function BedBugCompositeDashboard() {
  const [isDark] = useDarkmode();
  const today = new Date().toISOString().slice(0, 10)
  const [startDate, setStartDate] = useState('2025-01-01')
  const [endDate, setEndDate] = useState(today)
  const [metrics, setMetrics] = useState(null)
  const [previousMetrics, setPreviousMetrics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [generalVolumeGroupBy, setGeneralVolumeGroupBy] = useState('month')
  const [generalCostGroupBy, setGeneralCostGroupBy] = useState('month')
  const [ppcVolumeGroupBy, setPpcVolumeGroupBy] = useState('month')
  const [ppcCostGroupBy, setPpcCostGroupBy] = useState('month')

  useEffect(() => {
    if (!startDate || !endDate || startDate > endDate) {
      setMetrics(null)
      setPreviousMetrics(null)
      return
    }

    const currentStartDate = new Date(startDate)
    const currentEndDate = new Date(endDate)
    const length = Math.floor((currentEndDate - currentStartDate) / (1000 * 60 * 60 * 24)) + 1

    const previousEndDateObj = new Date(currentStartDate)
    previousEndDateObj.setDate(previousEndDateObj.getDate() - 1)
    const previousEnd = previousEndDateObj.toISOString().slice(0, 10)

    const previousStartDateObj = new Date(previousEndDateObj)
    previousStartDateObj.setDate(previousStartDateObj.getDate() - length + 1)
    const previousStart = previousStartDateObj.toISOString().slice(0, 10)

    setLoading(true)
    Promise.all([
      fetch(`/api/bedbug_composit?start=${startDate}&end=${endDate}&volumeGroupBy=${generalVolumeGroupBy}&costPerLeadGroupBy=${generalCostGroupBy}`)
        .then(res => res.json()),
      fetch(`/api/bedbug_composit?start=${startDate}&end=${endDate}&volumeGroupBy=${ppcVolumeGroupBy}&costPerLeadGroupBy=${ppcCostGroupBy}`)
        .then(res => res.json()),
      fetch(`/api/bedbug_composit?start=${previousStart}&end=${previousEnd}&volumeGroupBy=${generalVolumeGroupBy}&costPerLeadGroupBy=${generalCostGroupBy}`)
        .then(res => res.json())
    ])
      .then(([generalCur, ppcCur, previous]) => {
        if (generalCur.error) throw new Error(generalCur.error)
        if (ppcCur.error) throw new Error(ppcCur.error)
        if (previous.error) throw new Error(previous.error)
        setMetrics({
          sourceMetrics: generalCur.data.sourceMetrics,
          volume_chart: generalCur.data.volume_chart,
          cost_per_lead_chart: generalCur.data.cost_per_lead_chart,
          ppc_volume_cost_chart: ppcCur.data.ppc_volume_cost_chart,
          ppc_cost_per_chart: ppcCur.data.ppc_cost_per_chart
        })
        setPreviousMetrics({sourceMetrics: previous.data.sourceMetrics})
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [startDate, endDate, generalVolumeGroupBy, generalCostGroupBy, ppcVolumeGroupBy, ppcCostGroupBy])

  const volumeChartData = metrics?.volume_chart?.length > 0 ? metrics.volume_chart : createEmptyChartData(startDate, endDate, generalVolumeGroupBy)
  const costPerLeadChartData = metrics?.cost_per_lead_chart?.length > 0 ? metrics.cost_per_lead_chart : createEmptyChartData(startDate, endDate, generalCostGroupBy)
  const ppcVolumeCostData = metrics?.ppc_volume_cost_chart?.length > 0 ? metrics.ppc_volume_cost_chart : createEmptyVolumeCostData(startDate, endDate, ppcVolumeGroupBy)
  const ppcCostPerData = metrics?.ppc_cost_per_chart?.length > 0 ? metrics.ppc_cost_per_chart : createEmptyCostPerData(startDate, endDate, ppcCostGroupBy)

  const formatCurrency = val =>
    typeof val === 'number'
      ? `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '--'

  const formatNumber = val => (typeof val === 'number' ? val.toLocaleString() : '--')

  const stats = [
    { label: 'Qualified Leads', field: 'qualified_leads', iconType: 'bar' },
    { label: 'PPC Leads', field: 'qualified_leads_ppc', iconType: 'bar' },
    { label: 'LSA Leads', field: 'qualified_leads_lsa', iconType: 'bar' },
    { label: 'SEO Leads', field: 'qualified_leads_seo', iconType: 'bar' },
    { label: 'Total Spend', field: 'spend_total', iconType: 'wallet' },
    { label: 'Total PPC Spend', field: 'spend_ppc', iconType: 'wallet' },
    { label: 'LSA Spend', field: 'spend_lsa', iconType: 'wallet' },
    { label: 'SEO Spend', field: 'spend_seo', iconType: 'wallet' },
    { label: 'CPQL Total', field: 'cpql_total', iconType: 'dollar' },
    { label: 'CPQL PPC', field: 'cpql_ppc', iconType: 'dollar' },
    { label: 'CPQL LSA', field: 'cpql_lsa', iconType: 'dollar' },
    { label: 'CPQL SEO', field: 'cpql_seo', iconType: 'dollar' },
  ]

  const textColor = isDark ? '#e5e7eb' : '#374151';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  const tooltipText = isDark ? '#ffffff' : '#374151';

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-3 sm:py-4 md:py-6 px-2 sm:px-4 md:px-6">
        <DateSelector
          startDate={startDate}
          endDate={endDate}
          onChange={(type, val) => (type === 'startDate' ? setStartDate(val) : setEndDate(val))}
        />
      </div>

      {/* QLead Data by Source */}
      <div className="w-full px-2 sm:px-4 md:px-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 md:mb-6 mt-2 sm:mt-4 text-gray-900 dark:text-gray-100">QLead Data by Source</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          {stats.map(({ label, field, iconType }) => {
            const currentValue = metrics?.sourceMetrics?.[field] ?? 0
            const previousValue = previousMetrics?.sourceMetrics?.[field] ?? 0
            const change = previousValue === 0 ? 0 : ((currentValue - previousValue) / previousValue * 100)
            const changeAbs = Math.abs(change).toFixed(0)
            const changeText = change === 0 ? '0%' : (change > 0 ? `↑ ${changeAbs}%` : `↓ ${changeAbs}%`)
            const changeColor = change > 0 ? 'text-green-600 dark:text-green-400' : change < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
            const isCurrency = field.includes('spend') || field.includes('cpql')
            const formattedValue = isCurrency ? formatCurrency(currentValue) : formatNumber(currentValue)

            return (
              <StatCard
                key={field}
                label={label}
                value={formattedValue}
                color="text-[#f36622] dark:text-[#f36622]"
                changeText={changeText}
                changeColor={changeColor}
                iconType={iconType}
              />
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 px-2 sm:px-4 md:px-6 mt-4 sm:mt-6 md:mt-10 w-full">
        <SectionCard title="QLeads Volume by Period">
          <div className="flex justify-end mb-2 sm:mb-3 md:mb-4">
            <select
              className="w-full sm:w-auto border border-[#f36622] rounded-lg px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f36622] focus:border-[#f36622] dark:bg-slate-800 dark:border-[#f36622] dark:text-gray-200"
              value={generalVolumeGroupBy}
              onChange={e => setGeneralVolumeGroupBy(e.target.value)}
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
          <div className="h-[200px] sm:h-[250px] md:h-[300px] bg-white dark:bg-slate-800 rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={volumeChartData}
                margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPpc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLsa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSeo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 13, fill: textColor }} interval="preserveStartEnd" />
                <YAxis label={{ angle: -90, position: 'insideLeft', fill: textColor }} allowDecimals={false} tick={{ fontSize: 13, fill: textColor }} domain={[0, 'auto']} />
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, fontSize: 15, backgroundColor: tooltipBg, color: tooltipText, border: 'none' }}
                  labelStyle={{ fontWeight: 600, color: tooltipText }}
                />
                <Legend verticalAlign="bottom" height={20} wrapperStyle={{ paddingTop: '10px' }} />
                <Area type="monotone" dataKey="ppc" stroke="#10b981" strokeWidth={2} fill="url(#colorPpc)" name="PPC" />
                <Area type="monotone" dataKey="lsa" stroke="#f59e0b" strokeWidth={2} fill="url(#colorLsa)" name="LSA" />
                <Area type="monotone" dataKey="seo" stroke="#ec4899" strokeWidth={2} fill="url(#colorSeo)" name="SEO" />
                <Line type="monotone" dataKey="total" stroke="#6366f1" name="Total" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Cost Per Lead by Period">
          <div className="flex justify-end mb-2 sm:mb-3 md:mb-4">
            <select
              className="w-full sm:w-auto border border-[#f36622] rounded-lg px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f36622] focus:border-[#f36622] dark:bg-slate-800 dark:border-[#f36622] dark:text-gray-200"
              value={generalCostGroupBy}
              onChange={e => setGeneralCostGroupBy(e.target.value)}
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
          <div className="h-[200px] sm:h-[250px] md:h-[300px] bg-white dark:bg-slate-800 rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={costPerLeadChartData}
                margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPpc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLsa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSeo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 13, fill: textColor }} interval="preserveStartEnd" />
                <YAxis label={{ angle: -90, position: 'insideLeft', fill: textColor }} tick={{ fontSize: 13, fill: textColor }} domain={[0, 'auto']} />
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, fontSize: 15, backgroundColor: tooltipBg, color: tooltipText, border: 'none' }}
                  labelStyle={{ fontWeight: 600, color: tooltipText }}
                  formatter={(value) => `$${value.toFixed(2)}`}
                />
                <Legend verticalAlign="bottom" height={20} wrapperStyle={{ paddingTop: '10px' }} />
                <Area type="monotone" dataKey="ppc" stroke="#10b981" strokeWidth={2} fill="url(#colorPpc)" name="PPC" />
                <Area type="monotone" dataKey="lsa" stroke="#f59e0b" strokeWidth={2} fill="url(#colorLsa)" name="LSA" />
                <Area type="monotone" dataKey="seo" stroke="#ec4899" strokeWidth={2} fill="url(#colorSeo)" name="SEO" />
                <Line type="monotone" dataKey="total" stroke="#6366f1" name="Total" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="PPC QLeads Volume & Cost by Period">
          <div className="flex justify-end mb-2 sm:mb-3 md:mb-4">
            <select
              className="w-full sm:w-auto border border-[#f36622] rounded-lg px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f36622] focus:border-[#f36622] dark:bg-slate-800 dark:border-[#f36622] dark:text-gray-200"
              value={ppcVolumeGroupBy}
              onChange={e => setPpcVolumeGroupBy(e.target.value)}
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
          <div className="h-[200px] sm:h-[250px] md:h-[300px] bg-white dark:bg-slate-800 rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={ppcVolumeCostData}
                margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="date" tick={{ fontSize: 13, fill: textColor }} interval="preserveStartEnd" />
                <YAxis yAxisId="left" label={{ value: 'Cost', angle: -90, position: 'insideLeft', fill: textColor }} tick={{ fontSize: 13, fill: textColor }} domain={[0, 'auto']} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'QLeads Volume', angle: 90, position: 'insideRight', fill: textColor }} allowDecimals={false} tick={{ fontSize: 13, fill: textColor }} domain={[0, 'auto']} />
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, fontSize: 15, backgroundColor: tooltipBg, color: tooltipText, border: 'none' }}
                  labelStyle={{ fontWeight: 600, color: tooltipText }}
                  formatter={(value, name) => name === 'Cost' ? `$${value.toFixed(2)}` : value}
                />
                <Legend verticalAlign="bottom" height={20} wrapperStyle={{ paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="cost" fill="#0ea5e9" name="Cost" barSize={30}>
                  <LabelList dataKey="cost" position="top" formatter={(value) => `$${Math.round(value)}`} fill={textColor} fontSize={12} />
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#f97316" name="QLeads Volume" strokeWidth={3}>
                  <LabelList dataKey="volume" position="top" formatter={(value) => value > 0 ? Math.round(value) : ''} fill={textColor} fontSize={12} />
                </Line>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Cost Per QLead by Period">
          <div className="flex justify-end mb-2 sm:mb-3 md:mb-4">
            <select
              className="w-full sm:w-auto border border-[#f36622] rounded-lg px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f36622] focus:border-[#f36622] dark:bg-slate-800 dark:border-[#f36622] dark:text-gray-200"
              value={ppcCostGroupBy}
              onChange={e => setPpcCostGroupBy(e.target.value)}
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
          <div className="h-[200px] sm:h-[250px] md:h-[300px] bg-white dark:bg-slate-800 rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={ppcCostPerData}
                margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="date" tick={{ fontSize: 13, fill: textColor }} interval="preserveStartEnd" />
                <YAxis label={{ value: 'Cost Per QLead', angle: -90, position: 'insideLeft', fill: textColor }} tick={{ fontSize: 13, fill: textColor }} domain={[0, 'auto']} />
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, fontSize: 15, backgroundColor: tooltipBg, color: tooltipText, border: 'none' }}
                  labelStyle={{ fontWeight: 600, color: tooltipText }}
                  formatter={(value) => `$${value.toFixed(2)}`}
                />
                <Legend verticalAlign="bottom" height={20} wrapperStyle={{ paddingTop: '10px' }} />
                <Line type="monotone" dataKey="costper" stroke="#f97316" name="Cost Per QLead" strokeWidth={3} >
                  <LabelList dataKey="costper" position="top" formatter={(value) => `$${Math.round(value)}`} fill={textColor} fontSize={12} />
                </Line>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
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
  )
}