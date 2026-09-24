import React, { useState, useMemo } from 'react';
import { ChevronRight, Settings } from 'lucide-react';
import { mainTabs, subTabs, allPets, dates, dateLabels, petOptions, shippingOptions, volumeOptions } from '../data/petData';
import MultiSelectDropdown from './MultiSelectDropdown';
import RadioSelectDropdown from './RadioSelectDropdown';
import DatePicker from './DatePicker';

const Version3 = React.memo(() => {
  const [activeTab, setActiveTab] = useState('Тарифы на корм');
  const [activeSubTab, setActiveSubTab] = useState('Тарифы на еду');
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>('Попросить друга');
  const [selectedFoodType, setSelectedFoodType] = useState<string>('Сухой корм');
  const [selectedVolume, setSelectedVolume] = useState<string>('Более 1 кг');
  const [startDate, setStartDate] = useState('2026-09-21');
  const [endDate, setEndDate] = useState('2026-09-22');

  const filteredPets = useMemo(() => allPets.filter((pet) => {
    if (selectedPets.length > 0) {
      const matchesPet = selectedPets.some((selected) => pet.name.replace(' ⚡', '') === selected.replace(' ⚡', ''));
      if (!matchesPet) return false;
    }
    if (checkbox1 || checkbox2) {
      const badge = pet.hungerBadge;
      const isReadyToEat = /^×\d+$/.test(badge);
      const willEatAll = badge === 'Съест всё';
      if (checkbox1 && !checkbox2) return isReadyToEat;
      if (checkbox2 && !checkbox1) return willEatAll;
      if (checkbox1 && checkbox2) return isReadyToEat || willEatAll;
    }
    return true;
  }), [selectedPets, checkbox1, checkbox2]);

  const visibleDates = useMemo(() => dates.filter((d) => {
    if (!startDate) return true;
    if (!endDate) return d >= startDate;
    return d >= startDate && d <= endDate;
  }), [startDate, endDate]);

  return (
    <div className="py-6">
      <div className="flex gap-0 overflow-x-auto scrollbar-hide border-b border-gray-200">
        {mainTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab ? 'border-purple-600 text-black' : 'border-transparent hover:text-black'
            }`}
            style={{ fontSize: '18px', color: activeTab === tab ? '#000000' : '#767386' }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 cursor-pointer transition-shadow" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-black" style={{ fontSize: '18px', fontWeight: 560, lineHeight: '24px' }}>Рейтинг хозяина — 1</h3>
              <p className="text-black mt-0.5 max-w-xl" style={{ fontSize: '16px', fontWeight: 440, lineHeight: '20px' }}>
                Эффективность распределения продуктов между вашими питомцами. Влияет на любовь ваших питомцев
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3 mt-8">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {subTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-4 py-2 font-medium rounded-md transition-colors ${
                activeSubTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
              style={{ fontSize: '16px' }}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="px-4 py-2 text-sm font-medium rounded-lg hover:opacity-80 transition-opacity" style={{ backgroundColor: '#E6E6E6', color: '#000000' }}>
          Базовые тарифы
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mt-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="pt-6 pb-8 px-6">
          <div className="flex flex-wrap items-end gap-3">
            <MultiSelectDropdown label="Питомцы" options={petOptions} selected={selectedPets} onChange={setSelectedPets} width={200} />
            <RadioSelectDropdown label="Отгрузка через" options={shippingOptions} selected={selectedShipping} onChange={setSelectedShipping} width={200} />
            <RadioSelectDropdown label="Тип еды" options={['Вся еда', 'Сухой корм', 'Влажный корм', 'Смешанный']} selected={selectedFoodType} onChange={setSelectedFoodType} width={200} />
            <RadioSelectDropdown label="Объём продукта, кг" options={volumeOptions} selected={selectedVolume} onChange={setSelectedVolume} width={200} />
            <DatePicker startDate={startDate} endDate={endDate} onChange={(s: string, e: string) => { setStartDate(s); setEndDate(e); }} />
            <div className="flex flex-col justify-end ml-auto">
              <button className="flex items-center justify-center rounded-lg" style={{ backgroundColor: '#F6F6F8', width: '44px', height: '44px' }}>
                <Settings className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={checkbox1} onChange={() => setCheckbox1(!checkbox1)} className="text-purple-600 accent-purple-600" style={{ width: '20px', height: '20px', borderRadius: '6px', borderColor: '#F0F0F2' }} />
              <span className="text-black font-semibold" style={{ fontSize: '14px' }}>Готовы есть</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={checkbox2} onChange={() => setCheckbox2(!checkbox2)} className="text-purple-600 accent-purple-600" style={{ width: '20px', height: '20px', borderRadius: '6px', borderColor: '#F0F0F2' }} />
              <span className="text-black font-semibold" style={{ fontSize: '14px' }}>Съест всё</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 relative">
        <div className="absolute left-[120px] top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div className="space-y-8">
          {visibleDates.map((date) => (
            <div key={date} className="relative flex items-start gap-6">
              <div className="w-[100px] flex-shrink-0 text-right">
                <div className="inline-block px-3 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: '#9A41FE', color: '#FFFFFF' }}>
                  {date.split('-')[2]}.{date.split('-')[1]}
                </div>
                <div className="text-xs text-gray-500 mt-1">{dateLabels[date].split(', ')[1]}</div>
              </div>
              <div className="absolute left-[116px] top-3 w-3 h-3 rounded-full bg-purple-600 border-2 border-white"></div>
              <div className="flex-1 ml-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredPets.map((pet, index) => {
                    const dayData = pet.days[date];
                    return (
                      <div key={index} className="bg-white rounded-lg border border-gray-100 p-4 transition-shadow hover:shadow-md" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="text-black font-semibold text-sm">{pet.name}</h4>
                            <p className="text-gray-500 text-xs">{pet.location}</p>
                          </div>
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${pet.hungerBadgeColor}`}>{pet.hungerBadge}</span>
                        </div>
                        {pet.isFull ? (
                          <div className="text-center py-2"><span style={{ color: '#767386' }} className="text-sm">Пока сыт</span></div>
                        ) : dayData ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 text-xs">Логистика</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-black font-medium text-xs">{dayData.logistics}</span>
                                <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-semibold ${dayData.logisticsPctColor}`}>{dayData.logisticsPct}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 text-xs">Съедено</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-black font-medium text-xs">{dayData.eaten}</span>
                                <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-semibold ${dayData.eatenPctColor}`}>{dayData.eatenPct}</span>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

Version3.displayName = 'Version3';

export default Version3;
