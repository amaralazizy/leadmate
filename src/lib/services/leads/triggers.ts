/**
 * Simple time-based lead extraction triggers
 */

export interface TimeBasedTrigger {
  shouldExtract: boolean;
  reason: string;
  extractionType: "inactivity" | "timeout" | "none";
}

/**
 * Check if conversation should be extracted based on time rules
 */
export function shouldExtractByTime(
  lastMessageTime: Date,
  firstMessageTime: Date,
  extractionCompleted: boolean = false
): TimeBasedTrigger {
  if (extractionCompleted) {
    return {
      shouldExtract: false,
      reason: "Extraction already completed",
      extractionType: "none",
    };
  }

  const now = new Date();
  const timeSinceLastMessage =
    (now.getTime() - lastMessageTime.getTime()) / (1000 * 60); // minutes
  const timeSinceFirstMessage =
    (now.getTime() - firstMessageTime.getTime()) / (1000 * 60); // minutes

  // Rule 1: Extract after 10 minutes of inactivity
  if (timeSinceLastMessage >= 10) {
    return {
      shouldExtract: true,
      reason: `${Math.round(timeSinceLastMessage)} minutes of inactivity`,
      extractionType: "inactivity",
    };
  }

  // Rule 2: Extract after 30 minutes from first message (safety net)
  if (timeSinceFirstMessage >= 30) {
    return {
      shouldExtract: true,
      reason: `${Math.round(
        timeSinceFirstMessage
      )} minutes since conversation started`,
      extractionType: "timeout",
    };
  }

  return {
    shouldExtract: false,
    reason: `Only ${Math.round(
      timeSinceLastMessage
    )}min since last message, ${Math.round(
      timeSinceFirstMessage
    )}min since start`,
    extractionType: "none",
  };
}

/**
 * Get conversation timestamps for time-based analysis
 */
export function getConversationTimestamps(
  messages: Array<{ timestamp: string; sender: string }>
): {
  firstMessageTime: Date;
  lastMessageTime: Date;
  messageCount: number;
} {
  if (!messages || messages.length === 0) {
    const now = new Date();
    return {
      firstMessageTime: now,
      lastMessageTime: now,
      messageCount: 0,
    };
  }

  const sortedMessages = messages.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return {
    firstMessageTime: new Date(sortedMessages[0].timestamp),
    lastMessageTime: new Date(
      sortedMessages[sortedMessages.length - 1].timestamp
    ),
    messageCount: messages.length,
  };
}

/**
 * Check if conversation is ready for extraction based on timing
 */
export function isConversationReadyForExtraction(
  lastMessageTime: Date,
  firstMessageTime: Date,
  extractionCompleted: boolean = false
): boolean {
  const trigger = shouldExtractByTime(
    lastMessageTime,
    firstMessageTime,
    extractionCompleted
  );
  return trigger.shouldExtract;
}
