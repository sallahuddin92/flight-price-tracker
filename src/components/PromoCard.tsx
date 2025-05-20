import React from 'react';
import { Tag, Ticket, ExternalLink } from 'lucide-react';

interface PromoCardProps {
  title: string;
  description: string;
  code: string;
  expiryDate: string;
  airline: string;
  discount: string;
  bgColor: string;
}

const PromoCard: React.FC<PromoCardProps> = ({
  title,
  description,
  code,
  expiryDate,
  airline,
  discount,
  bgColor,
}) => {
  return (
    <div className={`rounded-lg shadow-md overflow-hidden ${bgColor} text-white mb-4`}>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg">{title}</h3>
          <span className="bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-bold">
            {discount}
          </span>
        </div>
        <p className="text-sm mt-2 opacity-90">{description}</p>
        
        <div className="mt-4 flex items-center">
          <Ticket className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">{airline}</span>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="bg-white/20 rounded px-2 py-1 flex items-center">
            <Tag className="h-3 w-3 mr-1" />
            <code className="text-xs font-mono">{code}</code>
          </div>
          <span className="text-xs">Expires: {expiryDate}</span>
        </div>
      </div>
      
      <div className="bg-black/20 p-3 flex justify-center">
        <button className="text-xs flex items-center hover:underline">
          View Details <ExternalLink className="h-3 w-3 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default PromoCard;
