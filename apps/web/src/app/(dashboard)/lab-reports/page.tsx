import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getLabReports } from '@/actions/lab-reports';
import { LabReportsPage } from '@/components/lab-reports/lab-reports-page';

export default async function LabReportsPageRoute() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const reports = await getLabReports();

  return <LabReportsPage reports={reports} />;
}
