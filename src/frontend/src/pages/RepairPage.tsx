import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Capacity, ServiceType } from "../backend";
import BookingForm from "../components/BookingForm";
import ChatBot from "../components/ChatBot";
import { useRepairConversation } from "../hooks/useRepairConversation";

export default function RepairPage() {
  const navigate = useNavigate();
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
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate({ to: "/" })}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm">Back to Home</span>
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl flex items-center justify-center text-2xl">
          ⚡
        </div>
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl text-foreground">
            Repair Service
          </h1>
          <p className="text-muted-foreground text-sm">
            AI-assisted diagnosis & expert repair
          </p>
        </div>
      </div>

      {/* Chatbot */}
      <div className="mb-6">
        <ChatBot
          messages={messages}
          currentQuickReplies={currentQuickReplies}
          onReply={handleReply}
          onFreeText={handleFreeText}
          isOtherStep={isOtherStep}
          isComplete={isComplete}
        />
      </div>

      {/* Booking Form - shown after chat is complete */}
      {isComplete && (
        <div className="bg-card border border-border rounded-2xl p-6 animate-fade-in-up">
          <h2 className="font-display font-bold text-xl text-foreground mb-2">
            Book Your Repair
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Fill in your details and we'll send a technician to your doorstep.
          </p>
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
