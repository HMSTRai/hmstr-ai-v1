import DashboardSectionLayout from '@/components/ui/DashboardSectionLayout';

export const metadata = {
  title: 'Google Ads QLead Metrics',
  description: '',
};

const layout = ({ children }) => {
  return (
    <DashboardSectionLayout title="">
      {children}
    </DashboardSectionLayout>
  );
};

export default layout;
