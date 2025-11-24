import DashboardSectionLayout from '@/components/ui/DashboardSectionLayout';

export const metadata = {
  title: 'Lead Quality By Source',
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
