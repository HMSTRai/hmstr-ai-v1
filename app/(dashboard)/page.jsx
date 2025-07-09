import ClientDashboard from './ClientDashboard';

export default function DashboardPage() {
  return (
    <ClientDashboard
      startDate="2025-01-01"
      endDate="2025-08-01"
      client={123} // Replace with valid client ID
    />
  );
}
