import DashboardSectionLayout from '@/components/ui/DashboardSectionLayout';

export const metadata = {
  title: 'Cost Per Lead Data',
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
