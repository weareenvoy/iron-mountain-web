import { redirect } from 'next/navigation';

export const generateStaticParams = () => {
  return [{ screen: 'primary' }, { screen: 'secondary' }];
};

const LegacySummitSlideScreenRedirect = () => {
  redirect('/summit/slides');
};

export default LegacySummitSlideScreenRedirect;
