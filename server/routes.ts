import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertApplicationSchema, insertApplicationTokenSchema } from "@shared/schema";
import crypto from "crypto";
import { upload, uploadFile, getFileUrl, listApplicationFiles } from './file-storage';

const generateLinkSchema = z.object({
  applicantEmail: z.string().email(),
  recruiterEmail: z.string().email(),
});

const validateTokenSchema = z.object({
  token: z.string(),
});

function generateSecureToken(): string {
  return 'tk_' + crypto.randomBytes(16).toString('hex');
}

function calculateAptitudeScore(answers: Record<string, string>): number {
  const correctAnswers = {
    aptitude1: "60",
    aptitude2: "Nail",
    aptitude3: "3 hours",
    aptitude4: "32",
    aptitude5: "Ocean"
  };
  
  let score = 0;
  Object.entries(correctAnswers).forEach(([question, correct]) => {
    if (answers[question] === correct) {
      score++;
    }
  });
  
  return score;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate secure application link
  app.post("/api/generate-link", async (req, res) => {
    try {
      const { applicantEmail, recruiterEmail } = generateLinkSchema.parse(req.body);
      
      const token = generateSecureToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      
      await storage.createApplicationToken({
        token,
        recruiterEmail,
        applicantEmail,
        expiresAt,
      });
      
      const baseUrl = process.env.REPLIT_DOMAINS 
        ? `https://${process.env.REPLIT_DOMAINS}` 
        : 'http://localhost:5000';
      const applicationUrl = `${baseUrl}/apply/${token}`;
      
      res.json({
        success: true,
        token,
        applicationUrl,
        expiresAt,
      });
    } catch (error) {
      console.error('Generate link error:', error);
      res.status(500).json({ error: 'Failed to generate link' });
    }
  });

  // Get generated tokens for a recruiter
  app.get("/api/tokens/:recruiterEmail", async (req, res) => {
    try {
      const { recruiterEmail } = req.params;
      const tokens = await storage.getApplicationTokensByRecruiter(recruiterEmail);
      
      const baseUrl = process.env.REPLIT_DOMAINS 
        ? `https://${process.env.REPLIT_DOMAINS}` 
        : 'http://localhost:5000';
      
      const tokensWithUrls = tokens.map(token => ({
        ...token,
        applicationUrl: `${baseUrl}/apply/${token.token}`
      }));
      
      res.json(tokensWithUrls);
    } catch (error) {
      console.error('Get tokens error:', error);
      res.status(500).json({ error: 'Failed to fetch tokens' });
    }
  });

  // Validate token
  app.post("/api/validate-token", async (req, res) => {
    try {
      const { token } = validateTokenSchema.parse(req.body);
      
      const tokenData = await storage.getApplicationToken(token);
      if (!tokenData || tokenData.expiresAt < new Date()) {
        return res.status(404).json({ error: 'Invalid or expired token' });
      }
      
      res.json({ valid: true, tokenData });
    } catch (error) {
      console.error('Validate token error:', error);
      res.status(500).json({ error: 'Failed to validate token' });
    }
  });

  // Submit application
  app.post("/api/applications", async (req, res) => {
    try {
      // Convert date strings to Date objects and ensure required fields before validation
      const requestData = {
        ...req.body,
        dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined,
        agreementDate: req.body.agreementDate ? new Date(req.body.agreementDate) : undefined,
        // Ensure jobType has a default value if not provided
        jobType: req.body.jobType || 'general',
      };
      
      const applicationData = insertApplicationSchema.parse(requestData);
      
      // Validate token
      const tokenData = await storage.getApplicationToken(applicationData.tokenId);
      if (!tokenData || tokenData.expiresAt < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }
      
      // Calculate aptitude score
      const aptitudeScore = calculateAptitudeScore(applicationData.aptitudeAnswers as Record<string, string>);
      
      const application = await storage.createApplication({
        ...applicationData,
        aptitudeScore,
        recruiterEmail: tokenData.recruiterEmail,
        // Use the jobType from the application data itself
        jobType: applicationData.jobType || 'general',
      });
      
      // Mark token as used
      await storage.markTokenAsUsed(applicationData.tokenId);
      
      res.json({ success: true, application });
    } catch (error) {
      console.error('Submit application error:', error);
      res.status(500).json({ error: 'Failed to submit application' });
    }
  });

  // Get applications for recruiter
  app.get("/api/applications", async (req, res) => {
    try {
      const recruiterEmail = req.query.recruiterEmail as string;
      if (!recruiterEmail) {
        return res.status(400).json({ error: 'Recruiter email is required' });
      }
      
      const applications = await storage.getApplicationsByRecruiter(recruiterEmail);
      res.json(applications);
    } catch (error) {
      console.error('Get applications error:', error);
      res.status(500).json({ error: 'Failed to get applications' });
    }
  });

  // File upload endpoint
  app.post("/api/upload/:token", upload.array('files', 5), async (req, res) => {
    try {
      const { token } = req.params;
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      // Validate token
      const tokenData = await storage.getApplicationToken(token);
      if (!tokenData || tokenData.expiresAt < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }

      const uploadedFiles = [];
      
      for (const file of files) {
        try {
          const result = await uploadFile(file, token);
          uploadedFiles.push({
            id: result.fileId,
            name: file.originalname,
            size: file.size,
            type: file.mimetype,
            url: result.url
          });
        } catch (error) {
          console.error('File upload error:', error);
          // Continue with other files even if one fails
        }
      }

      res.json({ 
        success: true, 
        files: uploadedFiles 
      });
    } catch (error) {
      console.error('Upload endpoint error:', error);
      res.status(500).json({ error: 'Failed to upload files' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
