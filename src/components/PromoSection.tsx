import React from 'react';
import PromoCard from '../components/PromoCard';
import promoData from '../data/promos.json';
import { Gift } from 'lucide-react';

const PromoSection: React.FC = () => {
  return (
    <div className="mt-12 mb-8">
      <div className="flex items-center mb-4">
        <Gift className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Special Offers & Promotions
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promoData.map((promo: any) => (
          <PromoCard
            key={promo.id}
            title={promo.title}
            description={promo.description}
            code={promo.code}
            expiryDate={promo.expiryDate}
            airline={promo.airline}
            discount={promo.discount}
            bgColor={promo.bgColor}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoSection;
