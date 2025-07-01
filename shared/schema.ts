import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  tokenId: text("token_id").notNull().unique(),
  recruiterEmail: text("recruiter_email").notNull(),
  
  // Personal Information
  fullName: text("full_name").notNull(),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  sinNumber: text("sin_number").notNull(),
  streetAddress: text("street_address").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  postalCode: text("postal_code").notNull(),
  majorIntersection: text("major_intersection").notNull(),
  
  // Contact Information
  mobileNumber: text("mobile_number").notNull(),
  whatsappNumber: text("whatsapp_number"),
  email: text("email").notNull(),
  emergencyName: text("emergency_name").notNull(),
  emergencyContact: text("emergency_contact").notNull(),
  emergencyRelationship: text("emergency_relationship").notNull(),
  
  // Legal Status & Education
  legalStatus: text("legal_status").notNull(),
  classSchedule: json("class_schedule"),
  
  // Transportation & Equipment
  transportation: text("transportation").notNull(),
  hasSafetyShoes: boolean("has_safety_shoes").notNull(),
  safetyShoeType: text("safety_shoe_type"),
  hasForklifCert: boolean("has_forklift_cert").notNull(),
  forkliftValidity: timestamp("forklift_validity"),
  backgroundCheckConsent: boolean("background_check_consent").notNull(),
  
  // Work History
  lastCompanyName: text("last_company_name"),
  companyType: text("company_type"),
  jobResponsibilities: text("job_responsibilities"),
  agencyOrDirect: text("agency_or_direct"),
  reasonForLeaving: text("reason_for_leaving"),
  
  // Physical Capabilities
  liftingCapability: text("lifting_capability").notNull(),
  
  // Job Preferences
  jobType: text("job_type").notNull(),
  commitmentMonths: integer("commitment_months").notNull(),
  morningDays: json("morning_days").$type<string[]>().notNull(),
  afternoonDays: json("afternoon_days").$type<string[]>().notNull(),
  nightDays: json("night_days").$type<string[]>().notNull(),
  
  // Referral Source
  referralSource: text("referral_source").notNull(),
  referralPersonName: text("referral_person_name"),
  referralPersonContact: text("referral_person_contact"),
  referralRelationship: text("referral_relationship"),
  referralInternetSource: text("referral_internet_source"),
  
  // Aptitude Test
  aptitudeScore: integer("aptitude_score").notNull(),
  aptitudeAnswers: json("aptitude_answers").notNull(),
  
  // Agreement
  agreementName: text("agreement_name").notNull(),
  agreementDate: timestamp("agreement_date").notNull(),
  termsAccepted: boolean("terms_accepted").notNull(),
  
  // Uploaded Documents
  uploadedDocuments: json("uploaded_documents").$type<{id: string, name: string, url: string}[]>(),
  
  // Metadata
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  status: text("status").default("pending").notNull(),
  recruiterNotes: text("recruiter_notes"),
});

export const applicationDocuments = pgTable("application_documents", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const applicationTokens = pgTable("application_tokens", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  recruiterEmail: text("recruiter_email").notNull(),
  applicantEmail: text("applicant_email"),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const recruiters = pgTable("recruiters", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  role: text("role").default("recruiter").notNull(),
});

export const applicationsRelations = relations(applications, ({ many }) => ({
  documents: many(applicationDocuments),
}));

export const applicationDocumentsRelations = relations(applicationDocuments, ({ one }) => ({
  application: one(applications, {
    fields: [applicationDocuments.applicationId],
    references: [applications.id],
  }),
}));

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  submittedAt: true,
  status: true,
  recruiterNotes: true,
});

export const insertApplicationTokenSchema = createInsertSchema(applicationTokens).omit({
  id: true,
  createdAt: true,
  usedAt: true,
});

export const insertRecruiterSchema = createInsertSchema(recruiters).omit({
  id: true,
});

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;
export type ApplicationDocument = typeof applicationDocuments.$inferSelect;
export type ApplicationToken = typeof applicationTokens.$inferSelect;
export type InsertApplicationToken = z.infer<typeof insertApplicationTokenSchema>;
export type Recruiter = typeof recruiters.$inferSelect;
export type InsertRecruiter = z.infer<typeof insertRecruiterSchema>;
