import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type {  Feedback } from "@prisma/client";

export async function POST(req: Request) {
  try {
    // Get all resumes with old feedback
    const resumes = await prisma.resume.findMany({
      where: {
        feedbacks: {
          some: {} // Has any feedback
        }
      },
      include: {
        feedbacks: true // No need to include actionableFeedbacks anymore
      }
    });

    const results = await Promise.all(
      resumes.map(async (resume) => {
        // Convert each feedback into an improvement
        const migrationPromises = resume.feedbacks.map(async (feedback: Feedback) => {
          // Create new improvement
          const improvement = await prisma.improvement.create({
            data: {
              userId: resume.userId,
              title: feedback.title,
              text: feedback.text || "",
              priority: 1, // Default priority since old schema didn't have it
              resumeId: resume.id,
            }
          });

          return improvement;
        });

        const migratedImprovements = await Promise.all(migrationPromises);
        
        // Mark old feedback as migrated
        await prisma.feedback.updateMany({
          where: {
            resumeId: resume.id
          },
          data: {
            status: "migrated"
          }
        });

        return {
          resumeId: resume.id,
          migratedCount: migratedImprovements.length,
          improvementIds: migratedImprovements.map((improvement) => improvement.id)
        };
      })
    );

    return NextResponse.json({
      message: "Feedback migration completed",
      results
    });
  } catch (error) {
    console.error("Error migrating feedback:", error);
    return NextResponse.json(
      { error: "Failed to migrate feedback" },
      { status: 500 }
    );
  }
} 