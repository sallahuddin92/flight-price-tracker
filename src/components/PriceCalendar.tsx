import React from 'react';
import { DayPicker, DateRange, DayContentProps } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';

interface PriceData {
  date: Date;
  price: number;
  currency: string;
}

interface PriceCalendarProps {
  prices: PriceData[];
  selectedRange: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  currency: string;
}

const PriceCalendar: React.FC<PriceCalendarProps> = ({
  prices,
  selectedRange,
  onSelect,
  currency,
}) => {
  const modifiers = {
    hasPrice: (date: Date) =>
      prices.some(
        (price) =>
          price.date.getDate() === date.getDate() &&
          price.date.getMonth() === date.getMonth() &&
          price.date.getFullYear() === date.getFullYear()
      ),
  };

  const modifiersStyles = {
    hasPrice: {
      position: 'relative' as const,
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '2px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '4px',
        height: '4px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary)',
      },
    },
  };

  const renderDay = (props: DayContentProps) => {
    const { date } = props;
    const priceData = prices.find(
      (price) =>
        price.date.getDate() === date.getDate() &&
        price.date.getMonth() === date.getMonth() &&
        price.date.getFullYear() === date.getFullYear()
    );

    return (
      <div className="relative">
        <time dateTime={format(date, 'yyyy-MM-dd')}>{format(date, 'd')}</time>
        {priceData && (
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-primary-600 dark:text-primary-400">
            {priceData.currency} {priceData.price}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <DayPicker
        mode="range"
        selected={selectedRange}
        onSelect={onSelect}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        components={{ DayContent: renderDay }}
        className="custom-calendar"
        styles={{
          caption: { color: 'var(--foreground)' },
          day: { color: 'var(--foreground)' },
          head_cell: { color: 'var(--muted-foreground)' },
        }}
      />
    </div>
  );
};

export default PriceCalendar; 