import { Lock, X } from "lucide-react";

export type SecuredUtilityLayerModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SecuredUtilityLayerModal({
  open,
  onClose,
}: SecuredUtilityLayerModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#071A33]/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="secured-layer-title"
      onClick={onClose}
    >
      <div
        className="max-w-md rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-[#0B2545]">
            <Lock className="h-5 w-5" aria-hidden />
            <h2 id="secured-layer-title" className="text-lg font-semibold">
              Secured utility layer
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#667085] hover:bg-[#F5F8FC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1570EF]"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-[#667085]">
          Precise feeder, transformer, and other asset-level infrastructure detail
          would be visible only in an authorized utility deployment. This public
          prototype displays{" "}
          <strong className="font-medium text-[#101828]">
            generalized neighbourhood risk zones
          </strong>{" "}
          only — not real utility asset locations or operational control data.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-[#0B2545] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#071A33] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]"
        >
          Understood
        </button>
      </div>
    </div>
  );
}
