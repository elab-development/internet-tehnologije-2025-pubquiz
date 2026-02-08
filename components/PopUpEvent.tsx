'use client';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function PopUpEvent({ isOpen, onClose, title, children }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      <div 
        className="absolute inset-0 bg-black/80" 
        onClick={onClose} 
      />
      
      
      <div className="relative bg-neutral-950 border border-neutral-700 w-full max-w-sm rounded-xl overflow-hidden">
        
        <div className="flex items-center justify-center p-4 border-b border-neutral-800">
          <h3 className="text-xl font-bold text-yellow-500">{title}</h3>
        
        </div>

        
        <div className="p-6 text-white">
          {children}
        </div>
        
      </div>
    </div>
  );
}