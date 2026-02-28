"use client";

interface BtnSaveAndCancelProps {
  onCancel: () => void; 
}

export default function BtnSaveAndCancel({ onCancel }: BtnSaveAndCancelProps) {
  return (
    <div className="flex gap-3 mt-6">
      <button 
        type="button" 
        onClick={onCancel} 
        className="flex-1 bg-neutral-800 text-white font-bold py-3 rounded uppercase text-xs hover:bg-neutral-700 transition-colors"
      >
        Cancel
      </button>
      <button 
        type="submit" 
        className="flex-1 bg-yellow-500 text-black font-bold py-3 rounded uppercase text-xs hover:bg-yellow-400 transition-colors"
      >
        Save
      </button>
    </div>
  );
}