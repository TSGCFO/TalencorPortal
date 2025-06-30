import { 
  applications, 
  applicationTokens, 
  applicationDocuments,
  recruiters,
  type Application, 
  type InsertApplication,
  type ApplicationToken,
  type InsertApplicationToken,
  type ApplicationDocument,
  type Recruiter,
  type InsertRecruiter
} from "@shared/schema";
import { db } from "./db";
import { eq, and, lt, desc } from "drizzle-orm";

export interface IStorage {
  // Applications
  createApplication(application: InsertApplication): Promise<Application>;
  getApplicationByToken(tokenId: string): Promise<Application | undefined>;
  getApplicationsByRecruiter(recruiterEmail: string): Promise<Application[]>;
  
  // Application Tokens
  createApplicationToken(token: InsertApplicationToken): Promise<ApplicationToken>;
  getApplicationToken(token: string): Promise<ApplicationToken | undefined>;
  getApplicationTokensByRecruiter(recruiterEmail: string): Promise<ApplicationToken[]>;
  markTokenAsUsed(token: string): Promise<void>;
  
  // Recruiters
  createRecruiter(recruiter: InsertRecruiter): Promise<Recruiter>;
  getRecruiterByEmail(email: string): Promise<Recruiter | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createApplication(application: InsertApplication): Promise<Application> {
    const [result] = await db
      .insert(applications)
      .values(application)
      .returning();
    return result;
  }

  async getApplicationByToken(tokenId: string): Promise<Application | undefined> {
    const [result] = await db
      .select()
      .from(applications)
      .where(eq(applications.tokenId, tokenId));
    return result || undefined;
  }

  async getApplicationsByRecruiter(recruiterEmail: string): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.recruiterEmail, recruiterEmail))
      .orderBy(desc(applications.submittedAt));
  }

  async createApplicationToken(token: InsertApplicationToken): Promise<ApplicationToken> {
    const [result] = await db
      .insert(applicationTokens)
      .values(token)
      .returning();
    return result;
  }

  async getApplicationToken(token: string): Promise<ApplicationToken | undefined> {
    const [result] = await db
      .select()
      .from(applicationTokens)
      .where(eq(applicationTokens.token, token));
    return result || undefined;
  }

  async getApplicationTokensByRecruiter(recruiterEmail: string): Promise<ApplicationToken[]> {
    const results = await db
      .select()
      .from(applicationTokens)
      .where(eq(applicationTokens.recruiterEmail, recruiterEmail))
      .orderBy(desc(applicationTokens.createdAt));
    return results;
  }

  async markTokenAsUsed(token: string): Promise<void> {
    await db
      .update(applicationTokens)
      .set({ usedAt: new Date() })
      .where(eq(applicationTokens.token, token));
  }

  async createRecruiter(recruiter: InsertRecruiter): Promise<Recruiter> {
    const [result] = await db
      .insert(recruiters)
      .values(recruiter)
      .returning();
    return result;
  }

  async getRecruiterByEmail(email: string): Promise<Recruiter | undefined> {
    const [result] = await db
      .select()
      .from(recruiters)
      .where(eq(recruiters.email, email));
    return result || undefined;
  }
}

export const storage = new DatabaseStorage();
