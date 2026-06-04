export type LabReportStatus = 'normal' | 'abnormal' | 'critical';

export interface LabReportSummary {
  id: string;
  status: LabReportStatus;
  reportDate: string;
  analysisSummary: string | null;
  createdAt: string;
}

export interface NoteSummary {
  id: string;
  title: string;
  tags: string[];
  updatedAt: string;
}
