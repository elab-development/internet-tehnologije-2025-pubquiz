import { Instagram, Facebook, Mail } from 'lucide-react';

export default function Footer() {

  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 pt-4 pb-6 flex flex-col items-center gap-3">
        
        <div className="flex items-center gap-6">
          <a 
            href="https://instagram.com" 
            target="_blank" 
            className="hover:text-yellow-500 transition-colors duration-300"
          >
            <Instagram size={20} />
          </a>

          <a 
            href="https://facebook.com" 
            target="_blank" 
            className="hover:text-yellow-500 transition-colors duration-300"
          >
            <Facebook size={20} />
          </a>
        </div>

        <div className="flex flex-col items-center gap-2">
          <a 
            href="mailto:pubquiz@gmail.com" 
            className="flex items-center gap-2 hover:text-white transition-colors text-sm font-medium"
          >
            <Mail size={16} />
            pubquiz@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}