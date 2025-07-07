import DashboardSectionLayout from '@/components/ui/DashboardSectionLayout';

export const metadata = {
  title: 'Analytics | HMSTR Dashboard',
  description: 'Explore analytical insights and trends.',
};

const layout = ({ children }) => {
  return (
    <DashboardSectionLayout title="Analytics Overview">
      {children}
    </DashboardSectionLayout>
  );
};

export default layout;
