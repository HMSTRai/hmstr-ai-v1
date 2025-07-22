import DashboardSectionLayout from '@/components/ui/DashboardSectionLayout';

export const metadata = {
  title: 'Analytics | HMSTR Dashboard',
  description: 'Explore analytical insights and trends.',
};

const layout = ({ children }) => {
  return (
    <DashboardSectionLayout title="HMSTR Dashboard">
      {children}
    </DashboardSectionLayout>
  );
};

export default layout;
