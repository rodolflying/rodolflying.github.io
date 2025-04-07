import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10)
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form endpoint
  app.post('/api/contact', async (req, res) => {
    try {
      // Validate the request body
      const validatedData = contactSchema.parse(req.body);
      
      // Here you would typically save to a database or send an email
      // For demo purposes, we'll just log the data and send a success response
      console.log('Contact form submission:', validatedData);
      
      // Simulate a delay for the API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: 'Invalid form data', errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: 'Server error processing your request' });
      }
    }
  });

  // Download CV route
  app.get('/CV-Rodolfo-Sepulveda.pdf', (req, res) => {
    // In production, this would serve an actual PDF file
    // For this demo, we'll respond with a message
    res.status(200).json({ 
      message: 'This endpoint would serve Rodolfo Sepúlveda\'s CV as a PDF in production' 
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
