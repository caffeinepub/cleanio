import { useState } from "react";

export interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  quickReplies?: string[];
}

export type ConversationStep =
  | "greeting"
  | "issue_category"
  | "electrical_detail"
  | "brake_detail"
  | "start_detail"
  | "engine_detail"
  | "other_detail"
  | "severity"
  | "duration"
  | "complete";

const ISSUE_CATEGORIES = [
  "Electrical Issue",
  "Brake Problem",
  "Bike Not Starting",
  "Engine Noise",
  "Other",
];

const ELECTRICAL_DETAILS = [
  "Lights not working",
  "Battery draining fast",
  "Starter motor issue",
  "Wiring problem",
  "Horn not working",
];

const BRAKE_DETAILS = [
  "Brakes feel soft/spongy",
  "Brake noise / squealing",
  "Brake lever too loose",
  "Brake pads worn out",
  "Brake fluid leaking",
];

const START_DETAILS = [
  "Engine cranks but won't start",
  "No crank at all",
  "Starts but stalls immediately",
  "Starts with difficulty",
  "Fuel issue suspected",
];

const ENGINE_DETAILS = [
  "Knocking / tapping sound",
  "Vibration at high speed",
  "Overheating",
  "Smoke from engine",
  "Loss of power",
];

const SEVERITY_OPTIONS = [
  "Minor – still rideable",
  "Moderate – affects performance",
  "Severe – cannot ride",
];
const DURATION_OPTIONS = [
  "Just started today",
  "Past few days",
  "More than a week",
  "Ongoing for a while",
];

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export function useRepairConversation() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      sender: "bot",
      text: "👋 Hi! I'm Cleanio's repair assistant. I'll help diagnose your bike's issue so our technician comes fully prepared.",
    },
    {
      id: generateId(),
      sender: "bot",
      text: "What issue are you facing with your two-wheeler?",
      quickReplies: ISSUE_CATEGORIES,
    },
  ]);

  const [step, setStep] = useState<ConversationStep>("issue_category");
  const [issueCategory, setIssueCategory] = useState("");
  const [issueDetail, setIssueDetail] = useState("");
  const [severity, setSeverity] = useState("");
  const [duration, setDuration] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const addBotMessage = (text: string, quickReplies?: string[]) => {
    setMessages((prev) => [
      ...prev,
      { id: generateId(), sender: "bot", text, quickReplies },
    ]);
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: generateId(), sender: "user", text },
    ]);
  };

  const handleReply = (reply: string) => {
    addUserMessage(reply);

    if (step === "issue_category") {
      setIssueCategory(reply);
      if (reply === "Electrical Issue") {
        setStep("electrical_detail");
        setTimeout(() => {
          addBotMessage(
            "Got it! Can you tell me more about the electrical issue?",
            ELECTRICAL_DETAILS,
          );
        }, 400);
      } else if (reply === "Brake Problem") {
        setStep("brake_detail");
        setTimeout(() => {
          addBotMessage(
            "Understood. What kind of brake problem are you experiencing?",
            BRAKE_DETAILS,
          );
        }, 400);
      } else if (reply === "Bike Not Starting") {
        setStep("start_detail");
        setTimeout(() => {
          addBotMessage(
            "Let me help with that. What happens when you try to start the bike?",
            START_DETAILS,
          );
        }, 400);
      } else if (reply === "Engine Noise") {
        setStep("engine_detail");
        setTimeout(() => {
          addBotMessage(
            "Engine issues need attention! What kind of noise or symptom are you noticing?",
            ENGINE_DETAILS,
          );
        }, 400);
      } else {
        setStep("other_detail");
        setTimeout(() => {
          addBotMessage(
            "No worries! Please describe your issue briefly. I'll note it down for our technician.",
            undefined,
          );
        }, 400);
      }
    } else if (
      step === "electrical_detail" ||
      step === "brake_detail" ||
      step === "start_detail" ||
      step === "engine_detail"
    ) {
      setIssueDetail(reply);
      setStep("severity");
      setTimeout(() => {
        addBotMessage("How severe is the issue?", SEVERITY_OPTIONS);
      }, 400);
    } else if (step === "other_detail") {
      setIssueDetail(reply);
      setStep("severity");
      setTimeout(() => {
        addBotMessage("How severe is the issue?", SEVERITY_OPTIONS);
      }, 400);
    } else if (step === "severity") {
      setSeverity(reply);
      setStep("duration");
      setTimeout(() => {
        addBotMessage(
          "How long have you been experiencing this issue?",
          DURATION_OPTIONS,
        );
      }, 400);
    } else if (step === "duration") {
      setDuration(reply);
      setStep("complete");
      setTimeout(() => {
        addBotMessage(
          `✅ Thanks! I've noted your issue:\n\n📋 **${issueCategory}** – ${issueDetail || reply}\n⚠️ Severity: ${severity}\n⏱️ Duration: ${reply}\n\nOur technician will come prepared. Please fill in your details below to confirm the booking.`,
        );
        setIsComplete(true);
      }, 400);
    }
  };

  const handleFreeText = (text: string) => {
    if (step === "other_detail") {
      handleReply(text);
    }
  };

  const getIssueSummary = () => {
    const parts = [issueCategory];
    if (issueDetail) parts.push(issueDetail);
    if (severity) parts.push(`Severity: ${severity}`);
    if (duration) parts.push(`Duration: ${duration}`);
    return parts.join(" | ");
  };

  const currentQuickReplies =
    messages.length > 0
      ? messages[messages.length - 1].quickReplies
      : undefined;

  return {
    messages,
    step,
    isComplete,
    currentQuickReplies,
    handleReply,
    handleFreeText,
    getIssueSummary,
    isOtherStep: step === "other_detail",
  };
}
