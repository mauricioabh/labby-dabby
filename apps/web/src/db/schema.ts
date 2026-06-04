import {
  pgTable,
  text,
  uuid,
  timestamp,
  date,
  jsonb,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';

const labReportStatusEnum = pgEnum('lab_report_status', [
  'normal',
  'abnormal',
  'critical',
]);

const sharePermissionEnum = pgEnum('share_permission', ['view_only']);

const chatRoleEnum = pgEnum('chat_role', ['user', 'assistant']);

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const labReports = pgTable(
  'lab_reports',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    fileUrl: text('file_url').notNull(),
    originalFilename: text('original_filename').notNull(),
    extractedText: text('extracted_text'),
    analysisSummary: text('analysis_summary'),
    analysisDetailed: text('analysis_detailed'),
    suggestedQuestions: jsonb('suggested_questions').$type<string[]>(),
    status: labReportStatusEnum('status').notNull().default('normal'),
    reportDate: date('report_date'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    index('lab_reports_user_created').on(t.userId, t.createdAt),
    index('lab_reports_user_status').on(t.userId, t.status),
  ]
);

export const reportShares = pgTable(
  'report_shares',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    labReportId: uuid('lab_report_id')
      .notNull()
      .references(() => labReports.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    shareToken: text('share_token').notNull().unique(),
    recipientEmail: text('recipient_email'),
    expiresAt: timestamp('expires_at').notNull(),
    permission: sharePermissionEnum('permission').notNull().default('view_only'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('report_shares_token').on(t.shareToken)]
);

export const notes = pgTable(
  'notes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    content: text('content').notNull(),
    tags: text('tags').array(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [index('notes_user_updated').on(t.userId, t.updatedAt)]
);

export const chatMessages = pgTable(
  'chat_messages',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    labReportId: uuid('lab_report_id').references(() => labReports.id, {
      onDelete: 'set null',
    }),
    role: chatRoleEnum('role').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('chat_messages_user_created').on(t.userId, t.createdAt)]
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type LabReport = typeof labReports.$inferSelect;
export type NewLabReport = typeof labReports.$inferInsert;
export type ReportShare = typeof reportShares.$inferSelect;
export type NewReportShare = typeof reportShares.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;
