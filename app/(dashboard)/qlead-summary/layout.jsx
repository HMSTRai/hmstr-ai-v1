import DashboardSectionLayout from '@/components/ui/DashboardSectionLayout';

export const metadata = {
  title: 'Qualified Leads | HMSTR Dashboard',
  description: 'Explore analytical insights and trends.',
};

const layout = ({ children }) => {
  return (
    <DashboardSectionLayout title="">
      {children}
    </DashboardSectionLayout>
  );
};

export default layout;
