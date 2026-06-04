'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { LabReport } from '@/db/schema';

interface LabReportsTabsProps {
  reports: LabReport[];
}

export function LabReportsTabs({ reports }: LabReportsTabsProps) {
  const [value, setValue] = useState('overview');

  return (
    <Tabs value={value} onValueChange={setValue} className="mt-xl">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="recent">Recent Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="rounded-lg border border-border p-lg">
          <h3 className="font-medium">Your reports</h3>
          <p className="mt-sm text-sm text-muted-foreground">
            {reports.length === 0
              ? 'Upload your first PDF lab report to get an AI-powered analysis.'
              : `You have ${reports.length} report${reports.length === 1 ? '' : 's'}.`}
          </p>
          <div className="mt-lg grid gap-md sm:grid-cols-3">
            <div className="rounded-lg border border-border p-lg">
              <p className="text-2xl font-bold">{reports.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <div className="rounded-lg border border-border p-lg">
              <p className="text-2xl font-bold text-green-600">
                {reports.filter((r) => r.status === 'normal').length}
              </p>
              <p className="text-sm text-muted-foreground">Normal</p>
            </div>
            <div className="rounded-lg border border-border p-lg">
              <p className="text-2xl font-bold text-amber-600">
                {reports.filter((r) => r.status === 'abnormal').length +
                  reports.filter((r) => r.status === 'critical').length}
              </p>
              <p className="text-sm text-muted-foreground">Need attention</p>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="recent">
        <div className="rounded-lg border border-border p-lg">
          <h3 className="font-medium">Recent reports</h3>
          <p className="mt-sm text-sm text-muted-foreground">
            Click a report to view the full analysis.
          </p>
          {reports.length === 0 ? (
            <p className="py-xl text-center text-muted-foreground">
              No reports yet. Upload a PDF to get started.
            </p>
          ) : (
            <ul className="mt-lg space-y-md">
              {reports.map((r) => (
                <li key={r.id}>
                  <a
                    href={`/lab-reports/${r.id}`}
                    className="flex items-center justify-between rounded-lg border border-border p-lg transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {r.originalFilename}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {r.analysisSummary
                          ? `${r.analysisSummary.slice(0, 80)}...`
                          : 'Processing...'}
                      </p>
                      <p className="mt-sm text-xs text-muted-foreground">
                        {r.reportDate
                          ? new Date(r.reportDate).toLocaleDateString()
                          : 'No date'}{' '}
                        • {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`ml-md shrink-0 rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                        r.status === 'normal'
                          ? 'bg-green-500/15 text-green-700'
                          : r.status === 'abnormal'
                            ? 'bg-amber-500/15 text-amber-700'
                            : 'bg-red-500/15 text-red-700'
                      }`}
                    >
                      {r.status}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
