import ClientDashboard from './ClientDashboard';

export default function DashboardPage() {
  return (
    <ClientDashboard
      startDate="2025-01-01"
      endDate="2025-08-01"
      client={242321125} // Use a real company_id
    />
  );
}
