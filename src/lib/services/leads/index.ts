// Main lead extraction and processing
export {
  extractLeadInformation,
  updateLeadWithExtractedInfo,
  processLeadExtraction,
  type ExtractedUserInfo,
  type LeadExtractionResult,
} from "./extraction";

// Lead scoring and analysis
export {
  calculateLeadScore,
  categorizeLead,
  getLeadPriorities,
  generateFollowUpQuestions,
  analyzeConversationQuality,
  DEFAULT_SCORING_WEIGHTS,
  type LeadScoringWeights,
} from "./scoring";

// Time-based extraction triggers
export {
  shouldExtractByTime,
  getConversationTimestamps,
  isConversationReadyForExtraction,
  type TimeBasedTrigger,
} from "./triggers";

// Time-based batch processing
export { processTimeBasedExtractions, scheduledLeadProcessing } from "./batch";
