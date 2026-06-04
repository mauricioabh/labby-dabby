'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Upload, FileText, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadReportModal } from './upload-report-modal';
import { ConnectGmailModal } from './connect-gmail-modal';
import type { LabReport } from '@/db/schema';

interface LabReportsPageProps {
  reports: LabReport[];
}

export function LabReportsPage({ reports }: LabReportsPageProps) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [gmailOpen, setGmailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const total = reports.length;
  const normal = reports.filter((r) => r.status === 'normal').length;
  const abnormal = reports.filter((r) => r.status === 'abnormal').length;
  const critical = reports.filter((r) => r.status === 'critical').length;
  const lastReport = reports[0];
  const normalPct = total > 0 ? Math.round((normal / total) * 100) : 0;

  return (
    <>
      <div className="p-xl">
        <div className="flex flex-col gap-lg sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Lab Report Analysis
            </h1>
            <p className="mt-sm text-muted-foreground">
              Upload and analyze your lab test results with AI-powered insights.
            </p>
          </div>
          <div className="flex gap-md">
            <Button variant="outline" onClick={() => setGmailOpen(true)} className="gap-sm">
              <Mail className="h-4 w-4" />
              Connect Gmail
            </Button>
            <Button onClick={() => setUploadOpen(true)} className="gap-sm">
              <Upload className="h-4 w-4" />
              Upload Report
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-xl">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recent">Recent Reports</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-xl">
            <div className="grid gap-lg sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border bg-card p-lg">
                <div className="flex items-center justify-between">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="mt-md text-2xl font-bold">{total}</p>
                <p className="text-sm text-muted-foreground">
                  Last uploaded{' '}
                  {lastReport
                    ? new Date(lastReport.createdAt).toLocaleDateString()
                    : '—'}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-lg">
                <div className="flex items-center justify-between">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <p className="mt-md text-2xl font-bold text-green-600">
                  {normal}
                </p>
                <p className="text-sm text-muted-foreground">
                  {normalPct}% of all reports
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-lg">
                <div className="flex items-center justify-between">
                  <TrendingDown className="h-5 w-5 text-amber-600" />
                </div>
                <p className="mt-md text-2xl font-bold text-amber-600">
                  {abnormal}
                </p>
                <p className="text-sm text-muted-foreground">
                  Requires attention
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-lg">
                <div className="flex items-center justify-between">
                  <Info className="h-5 w-5 text-red-600" />
                </div>
                <p className="mt-md text-2xl font-bold text-red-600">
                  {critical}
                </p>
                <p className="text-sm text-muted-foreground">
                  Action needed
                </p>
              </div>
            </div>

            <div className="mt-xl rounded-lg border border-border bg-card p-xl">
              <h2 className="text-lg font-semibold text-foreground">
                Latest Report Analysis
              </h2>
              <p className="mt-sm text-sm text-muted-foreground">
                AI-powered analysis of your most recent lab results.
              </p>
              <div className="mt-lg rounded-lg border border-border bg-muted/30 p-lg">
                {lastReport?.analysisSummary ? (
                  <p className="whitespace-pre-wrap text-foreground">
                    {lastReport.analysisSummary}
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    No reports yet. Upload your first lab report to get an
                    AI-powered analysis.
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recent" className="mt-xl">
            <div className="rounded-lg border border-border bg-card p-lg">
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
                      <Link
                        href={`/lab-reports/${r.id}`}
                        className="flex items-center justify-between rounded-lg border border-border p-lg transition-colors hover:bg-muted/50"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">
                            {r.originalFilename}
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
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="mt-xl">
            <div className="rounded-lg border border-border bg-card p-lg">
              <h3 className="font-medium">Detailed analysis</h3>
              <p className="mt-sm text-sm text-muted-foreground">
                View the full breakdown of your most recent report.
              </p>
              {lastReport ? (
                <Link
                  href={`/lab-reports/${lastReport.id}`}
                  className="mt-lg inline-flex items-center text-primary hover:underline"
                >
                  View full analysis →
                </Link>
              ) : (
                <p className="py-xl text-center text-muted-foreground">
                  No reports yet. Upload a PDF to get started.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <UploadReportModal open={uploadOpen} onOpenChange={setUploadOpen} />
      <ConnectGmailModal open={gmailOpen} onOpenChange={setGmailOpen} />
    </>
  );
}
