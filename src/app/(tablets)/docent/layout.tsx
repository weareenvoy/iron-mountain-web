import DocentContent from './_components/layouts/docent-content';
import { DocentProvider } from './_components/providers/docent';

const DocentLayout = ({ children }: LayoutProps<'/docent'>) => {
  return (
    <DocentProvider>
      <DocentContent>{children}</DocentContent>
    </DocentProvider>
  );
};

export default DocentLayout;
