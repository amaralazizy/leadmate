/**
 * Time-based batch processing for lead extraction
 */

import { createServiceClient } from "@/lib/supabase/service";
import { processLeadExtraction } from "./extraction";
import { shouldExtractByTime, getConversationTimestamps } from "./triggers";

/**
 * Process conversations based on time-based rules:
 * - 10 minutes since last message (inactivity)
 * - 30 minutes since first message (timeout)
 */
export async function processTimeBasedExtractions(
  batchSize: number = 5 // Vercel-friendly batch size
): Promise<{
  processed: number;
  errors: number;
  hasMore: boolean;
  results: Array<{
    conversationId: string;
    success: boolean;
    extractionType?: string;
    error?: string;
  }>;
}> {
  const supabase = createServiceClient();
  const results = [];
  let processed = 0;
  let errors = 0;

  try {
    // Find active conversations that haven't been extracted yet (limited batch)
    const { data: activeConversations } = await supabase
      .from("conversations")
      .select("id, user_id, created_at, updated_at")
      .eq("status", "active")
      .limit(batchSize);

    console.log("activeConversations", activeConversations);

    if (!activeConversations || activeConversations.length === 0) {
      return { processed: 0, errors: 0, hasMore: false, results: [] };
    }

    console.log(
      `🔄 Processing ${activeConversations.length} conversations (batch size: ${batchSize})`
    );

    // Process each conversation
    for (const conversation of activeConversations) {
      try {
        // Get messages to determine timing
        const { data: messages } = await supabase
          .from("messages")
          .select("timestamp, sender")
          .eq("conversation_id", conversation.id)
          .order("timestamp", { ascending: true });

        if (!messages || messages.length === 0) continue;

        const timestamps = getConversationTimestamps(messages);
        const timeTrigger = shouldExtractByTime(
          timestamps.lastMessageTime,
          timestamps.firstMessageTime,
          false
        );

        if (timeTrigger.shouldExtract) {
          const extractionResult = await processLeadExtraction(
            conversation.id,
            conversation.user_id,
            false // Use time-based logic, not force
          );

          if (extractionResult.error) {
            errors++;
            results.push({
              conversationId: conversation.id,
              success: false,
              error: extractionResult.error,
            });
          }

          if (extractionResult.success && !extractionResult.skipped) {
            processed++;
            results.push({
              conversationId: conversation.id,
              success: true,
              extractionType: timeTrigger.extractionType,
            });

            console.log(
              `✅ Time-based extraction completed for conversation ${conversation.id} (${timeTrigger.extractionType})`
            );
          } else if (extractionResult.skipped) {
            // This shouldn't happen if our time logic is correct, but log it
            console.log(
              `⚠️ Unexpected skip for conversation ${conversation.id}: ${extractionResult.skipReason}`
            );
          } else {
            errors++;
            results.push({
              conversationId: conversation.id,
              success: false,
              error: "Extraction failed",
            });
          }
        }
      } catch (error) {
        console.error(
          `Error processing conversation ${conversation.id}:`,
          error
        );
        errors++;
        results.push({
          conversationId: conversation.id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Check if there might be more conversations to process
    const { count } = await supabase
      .from("conversations")
      .select("id", { count: "exact" })
      .eq("status", "active");

    const hasMore = (count || 0) > batchSize;

    if (processed > 0 || errors > 0) {
      console.log(
        `🎯 Batch complete: ${processed} processed, ${errors} errors${
          hasMore ? " (more pending)" : ""
        }`
      );
    }

    return { processed, errors, hasMore, results };
  } catch (error) {
    console.error("Error in time-based extraction:", error);
    return { processed: 0, errors: 1, hasMore: false, results: [] };
  }
}

/**
 * Vercel-friendly processing function with timeout protection
 * Processes small batches to stay under 10-second limit
 */
export async function scheduledLeadProcessing(): Promise<{
  success: boolean;
  processed: number;
  hasMore: boolean;
  message: string;
}> {
  console.log("🔄 Starting Vercel-friendly lead processing");

  const startTime = Date.now();

  try {
    // Process small batch (3-5 conversations max for Vercel)
    const results = await processTimeBasedExtractions(3);

    const duration = Date.now() - startTime;
    console.log(`📊 Batch processed in ${duration}ms:`, results);

    return {
      success: true,
      processed: results.processed,
      hasMore: results.hasMore,
      message: `Processed ${results.processed} conversations${
        results.hasMore ? " (more pending)" : ""
      }`,
    };
  } catch (error) {
    console.error("Error in scheduled processing:", error);
    return {
      success: false,
      processed: 0,
      hasMore: false,
      message: `Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}
