import DashboardSectionLayout from '@/components/ui/DashboardSectionLayout';

export const metadata = {
  title: 'QLead Bed Bug Composit',
  description: 'QLead Bed Bug Composit',
};

const layout = ({ children }) => {
  return (
    <DashboardSectionLayout title="">
      {children}
    </DashboardSectionLayout>
  );
};

export default layout;
