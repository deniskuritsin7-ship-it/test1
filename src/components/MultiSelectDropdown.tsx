import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  width?: number;
}

function MultiSelectDropdown({ label, options, selected, onChange, width }: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const displayValue = selected.length === 0 
    ? `Все ${label.toLowerCase()}` 
    : selected.length === 1 
    ? selected[0] 
    : `${selected.length} выбрано`;

  return (
    <div className="flex flex-col relative" ref={dropdownRef}>
      <label className="text-base font-semibold text-black mb-1">{label}</label>
      <div
        className="flex items-center gap-2 px-3 cursor-pointer hover:opacity-80 transition-opacity rounded-lg"
        style={{ height: '44px', backgroundColor: '#F6F6F8', width: width ? `${width}px` : 'auto', minWidth: '140px' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-base font-semibold text-black truncate">{displayValue}</span>
        <ChevronDown className={`w-4 h-4 text-black ml-auto flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full min-w-[200px] bg-white border border-gray-200 rounded-lg py-1" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 100 }}>
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => handleToggle(option)}
                className="text-purple-600 focus:ring-purple-500 accent-purple-600"
                style={{ width: '20px', height: '20px', borderRadius: '6px', borderColor: '#F0F0F2' }}
              />
              <span className="text-sm text-gray-700">{option}</span>
              {selected.includes(option) && (
                <Check className="w-4 h-4 text-purple-600 ml-auto" />
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default MultiSelectDropdown;
