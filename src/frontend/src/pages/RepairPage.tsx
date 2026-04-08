import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Capacity, ServiceType } from "../backend";
import BookingForm from "../components/BookingForm";
import ChatBot from "../components/ChatBot";
import { useRepairConversation } from "../hooks/useRepairConversation";

const ISSUE_TYPES = [
  { emoji: "🛑", label: "Brakes", desc: "Squealing, weak, or spongy brakes" },
  { emoji: "⚙️", label: "Engine", desc: "Knocking, misfiring, hard start" },
  { emoji: "⚡", label: "Electrical", desc: "Battery, lights, starter issues" },
  { emoji: "🔄", label: "Tyres", desc: "Puncture, wear, alignment" },
  { emoji: "💬", label: "Other", desc: "Something else — describe below" },
];

export default function RepairPage() {
  const {
    messages,
    isComplete,
    currentQuickReplies,
    handleReply,
    handleFreeText,
    getIssueSummary,
    isOtherStep,
  } = useRepairConversation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm">Back to Home</span>
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
          ⚡
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-display font-black text-2xl md:text-3xl text-foreground">
              Repair Service
            </h1>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs font-semibold">
              AI Powered
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            AI-assisted diagnosis & expert repair at your doorstep
          </p>
        </div>
      </div>

      {/* Issue type grid — visible before chat completes */}
      {!isComplete && messages.length <= 1 && (
        <div className="mb-6">
          <p className="text-xs text-muted-foreground font-medium mb-3 uppercase tracking-wide">
            Common issues we fix
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ISSUE_TYPES.map((issue) => (
              <div
                key={issue.label}
                className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2.5"
              >
                <span className="text-base flex-shrink-0">{issue.emoji}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {issue.label}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {issue.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chatbot */}
      <div className="mb-6" data-ocid="repair.chatbot">
        <ChatBot
          messages={messages}
          currentQuickReplies={currentQuickReplies}
          onReply={handleReply}
          onFreeText={handleFreeText}
          isOtherStep={isOtherStep}
          isComplete={isComplete}
        />
      </div>

      {/* Booking Form after chat completes */}
      {isComplete && (
        <div
          className="bg-card border border-border rounded-2xl p-6 animate-fade-in-up"
          data-ocid="repair.booking_form"
        >
          <h2 className="font-display font-bold text-xl text-foreground mb-1">
            Book Your Repair
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Fill in your details and we'll send a certified technician to your
            doorstep.
          </p>

          {/* Confirmation note */}
          <div className="flex items-start gap-2 p-3 bg-brand-orange/5 border border-brand-orange/20 rounded-xl mb-6">
            <span className="text-base flex-shrink-0">📞</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              After booking, our team will{" "}
              <span className="text-foreground font-semibold">
                call you to confirm
              </span>{" "}
              the repair details and provide an estimated cost.
            </p>
          </div>

          <BookingForm
            serviceType={ServiceType.repair}
            repairDetails={getIssueSummary()}
            defaultCapacity={Capacity.upTo200cc}
            showCapacitySelector={true}
            showPricing={false}
          />
        </div>
      )}

      {!isComplete && (
        <div className="text-center py-4">
          <p className="text-muted-foreground text-sm">
            💬 Answer the bot's questions to proceed with booking
          </p>
        </div>
      )}
    </div>
  );
}
