import { useState, useMemo, Fragment } from 'react';
import { ChevronRight, ChevronDown, Settings } from 'lucide-react';
import { mainTabs, subTabs, allPets, dates, dateLabels, petOptions, shippingOptions, volumeOptions } from '../data/petData';
import MultiSelectDropdown from './MultiSelectDropdown';
import RadioSelectDropdown from './RadioSelectDropdown';
import DatePicker from './DatePicker';

const GAP = 48;

function Version1() {
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
  const [sortState, setSortState] = useState<{
    hunger: 'none' | 'asc' | 'desc';
    logistics: 'none' | 'asc' | 'desc';
    eaten: 'none' | 'asc' | 'desc';
  }>({ hunger: 'none', logistics: 'none', eaten: 'none' });
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({ hunger: true, logistics: true, eaten: true });
  const [tempColumns, setTempColumns] = useState({ hunger: true, logistics: true, eaten: true });

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

  const sortedPets = useMemo(() => [...filteredPets].sort((a, b) => {
    const firstDate = visibleDates[0];
    if (sortState.hunger !== 'none') {
      const getHungerValue = (badge: string) => {
        if (badge === 'Съест всё') return 999;
        if (badge === 'Пока сыт') return 0;
        const match = badge.match(/×(\d+)/);
        return match ? parseInt(match[1]) : 0;
      };
      const aVal = getHungerValue(a.hungerBadge);
      const bVal = getHungerValue(b.hungerBadge);
      return sortState.hunger === 'asc' ? aVal - bVal : bVal - aVal;
    }
    if (sortState.logistics !== 'none' && firstDate) {
      const getLogisticsValue = (pet: typeof allPets[0], date: string) => {
        const data = pet.days[date];
        if (!data) return 0;
        const parts = data.logistics.split(' / ');
        return parseInt(parts[0]) || 0;
      };
      const aVal = getLogisticsValue(a, firstDate);
      const bVal = getLogisticsValue(b, firstDate);
      return sortState.logistics === 'asc' ? aVal - bVal : bVal - aVal;
    }
    if (sortState.eaten !== 'none' && firstDate) {
      const getEatenValue = (pet: typeof allPets[0], date: string) => {
        const data = pet.days[date];
        if (!data) return 0;
        const parts = data.eaten.split(' / ');
        return parseFloat(parts[0]) || 0;
      };
      const aVal = getEatenValue(a, firstDate);
      const bVal = getEatenValue(b, firstDate);
      return sortState.eaten === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return 0;
  }), [filteredPets, sortState, visibleDates]);

  const totalWidth = useMemo(() => {
    const hungerWidth = visibleColumns.hunger ? 140 : 0;
    const logisticsWidth = visibleColumns.logistics ? 170 : 0;
    const eatenWidth = visibleColumns.eaten ? 170 : 0;
    return visibleDates.length > 0
      ? 200 + visibleDates.length * (hungerWidth + logisticsWidth + eatenWidth + GAP) - GAP
      : 200;
  }, [visibleDates.length, visibleColumns]);

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
              <button className="flex items-center justify-center rounded-lg hover:opacity-80 transition-opacity" style={{ backgroundColor: '#F6F6F8', width: '44px', height: '44px' }} onClick={() => { setTempColumns(visibleColumns); setShowSettingsModal(true); }}>
                <Settings className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={checkbox1} onChange={() => setCheckbox1(!checkbox1)} className="text-purple-600 focus:ring-purple-500 accent-purple-600" style={{ width: '20px', height: '20px', borderRadius: '6px', borderColor: '#F0F0F2' }} />
              <span className="text-black font-semibold" style={{ fontSize: '14px' }}>Готовы есть</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={checkbox2} onChange={() => setCheckbox2(!checkbox2)} className="text-purple-600 focus:ring-purple-500 accent-purple-600" style={{ width: '20px', height: '20px', borderRadius: '6px', borderColor: '#F0F0F2' }} />
              <span className="text-black font-semibold" style={{ fontSize: '14px' }}>Съест всё</span>
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div style={{ minWidth: `${totalWidth}px` }}>
            <table className="w-full" style={{ tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '200px', position: 'sticky', left: 0, zIndex: 10, backgroundColor: 'white' }} />
                {visibleDates.map((d, i) => (
                  <Fragment key={d}>
                    {visibleColumns.hunger && <col style={{ width: '140px' }} />}
                    {visibleColumns.logistics && <col style={{ width: '170px' }} />}
                    {visibleColumns.eaten && <col style={{ width: '170px' }} />}
                    {i < visibleDates.length - 1 && <col style={{ width: `${GAP}px` }} />}
                  </Fragment>
                ))}
              </colgroup>
              <thead>
                <tr className="bg-white" style={{ borderTop: 'none' }}>
                  <th className="p-3" style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: 'white' }}></th>
                  {visibleDates.map((d, i) => {
                    const activeCols = [visibleColumns.hunger, visibleColumns.logistics, visibleColumns.eaten].filter(Boolean).length;
                    return (
                      <Fragment key={d}>
                        <th className="p-3 text-center text-sm font-semibold text-black" colSpan={activeCols} style={{ backgroundColor: '#F7F7FA', borderRadius: '12px 12px 0 0' }}>
                          {dateLabels[d]}
                        </th>
                        {i < visibleDates.length - 1 && <th className="bg-white"></th>}
                      </Fragment>
                    );
                  })}
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <th className="p-2 text-xs font-semibold uppercase text-left border-r border-gray-200" style={{ paddingLeft: '24px', position: 'sticky', left: 0, zIndex: 10, backgroundColor: 'white', color: '#767386' }}>
                    Питомец ↓
                  </th>
                  {visibleDates.map((d, i) => (
                    <Fragment key={d}>
                      {visibleColumns.hunger && (
                        <th className="text-xs font-semibold uppercase text-left cursor-pointer hover:bg-gray-50 transition-colors" style={{ color: '#767386', padding: '16px' }} onClick={() => { setSortState(prev => ({ ...prev, hunger: prev.hunger === 'none' ? 'desc' : prev.hunger === 'desc' ? 'asc' : 'none', logistics: 'none', eaten: 'none' })); }}>
                          Голод {sortState.hunger === 'desc' ? '↓' : sortState.hunger === 'asc' ? '↑' : '↓'}
                        </th>
                      )}
                      {visibleColumns.logistics && (
                        <th className="text-xs font-semibold uppercase text-right cursor-pointer hover:bg-gray-50 transition-colors" style={{ color: '#767386', padding: '16px' }} onClick={() => { setSortState(prev => ({ ...prev, hunger: 'none', logistics: prev.logistics === 'none' ? 'desc' : prev.logistics === 'desc' ? 'asc' : 'none', eaten: 'none' })); }}>
                          <div className="flex flex-col items-end gap-0.5">
                            <span>Логистика ₽ {sortState.logistics === 'desc' ? '↓' : sortState.logistics === 'asc' ? '↑' : '↓'}</span>
                            <span className="font-normal text-gray-400 normal-case">первый кг / доп кг</span>
                          </div>
                        </th>
                      )}
                      {visibleColumns.eaten && (
                        <th className="text-xs font-semibold uppercase text-right cursor-pointer hover:bg-gray-50 transition-colors" style={{ color: '#767386', padding: '16px' }} onClick={() => { setSortState(prev => ({ ...prev, hunger: 'none', logistics: 'none', eaten: prev.eaten === 'none' ? 'desc' : prev.eaten === 'desc' ? 'asc' : 'none' })); }}>
                          <div className="flex flex-col items-end gap-0.5">
                            <span>Съедено в день ₽ {sortState.eaten === 'desc' ? '↓' : sortState.eaten === 'asc' ? '↑' : '↓'}</span>
                            <span className="font-normal text-gray-400 normal-case">(утро / день)</span>
                          </div>
                        </th>
                      )}
                      {i < visibleDates.length - 1 && <th></th>}
                    </Fragment>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {sortedPets.length === 0 ? (
                  <tr>
                    <td colSpan={1 + visibleDates.length * 3 + Math.max(0, visibleDates.length - 1)} className="p-8 text-center text-gray-400 text-sm">
                      Нет питомцев по выбранным фильтрам
                    </td>
                  </tr>
                ) : (
                  sortedPets.map((pet, index) => (
                    <tr key={index} className={`border-b border-gray-100 hover:bg-purple-50/30 transition-colors ${index % 2 === 1 ? 'bg-gray-50/40' : 'bg-white'}`}>
                      <td className="p-3 border-r border-gray-200" style={{ paddingLeft: '24px', position: 'sticky', left: 0, zIndex: 10, backgroundColor: index % 2 === 1 ? 'rgba(249, 250, 251, 0.4)' : 'white' }}>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{pet.name}</span>
                          <span className="text-xs text-gray-400">{pet.location}</span>
                        </div>
                      </td>
                      {visibleDates.map((d, i) => {
                        const dayData = pet.days[d];
                        return (
                          <Fragment key={d}>
                            {visibleColumns.hunger && (
                              <td className="text-left" style={{ padding: '16px' }}>
                                <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${pet.hungerBadgeColor}`}>{pet.hungerBadge}</span>
                              </td>
                            )}
                            {visibleColumns.logistics && (
                              <td className="text-right" style={{ padding: '16px' }}>
                                {pet.isFull ? <span style={{ color: '#767386' }}>—</span> : (
                                  <div className="flex flex-col items-end gap-1">
                                    <span className="text-sm text-gray-700 font-medium">{dayData?.logistics}</span>
                                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${dayData?.logisticsPctColor}`}>{dayData?.logisticsPct}</span>
                                  </div>
                                )}
                              </td>
                            )}
                            {visibleColumns.eaten && (
                              <td className="text-right" style={{ padding: '16px' }}>
                                {pet.isFull ? <span style={{ color: '#767386' }}>—</span> : (
                                  <div className="flex flex-col items-end gap-1">
                                    <span className="text-sm text-gray-700 font-medium">{dayData?.eaten}</span>
                                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${dayData?.eatenPctColor}`}>{dayData?.eatenPct}</span>
                                  </div>
                                )}
                              </td>
                            )}
                            {i < visibleDates.length - 1 && <td></td>}
                          </Fragment>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showSettingsModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          <div className="bg-white rounded-xl p-6 w-[400px]" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <h2 className="text-lg font-semibold text-black mb-4">Настройки столбцов</h2>
            <div className="space-y-3 mb-6">
              {(['hunger', 'logistics', 'eaten'] as const).map((col) => (
                <label key={col} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempColumns[col]}
                    onChange={() => {
                      const activeCount = [tempColumns.hunger, tempColumns.logistics, tempColumns.eaten].filter(Boolean).length;
                      if (activeCount > 1 || !tempColumns[col]) {
                        setTempColumns({ ...tempColumns, [col]: !tempColumns[col] });
                      }
                    }}
                    disabled={[tempColumns.hunger, tempColumns.logistics, tempColumns.eaten].filter(Boolean).length === 1 && tempColumns[col]}
                    className="text-purple-600 focus:ring-purple-500 accent-purple-600"
                    style={{ width: '20px', height: '20px', borderRadius: '6px', borderColor: '#F0F0F2' }}
                  />
                  <span className="text-black font-semibold" style={{ fontSize: '14px' }}>
                    {col === 'hunger' ? 'Голод' : col === 'logistics' ? 'Логистика' : 'Съедено в день'}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex gap-3 justify-start">
              <button onClick={() => { setVisibleColumns(tempColumns); setShowSettingsModal(false); }} className="px-4 py-2 text-sm font-medium rounded-lg hover:opacity-80 transition-opacity" style={{ backgroundColor: '#9A41FE', color: '#FFFFFF' }}>
                Сохранить
              </button>
              <button onClick={() => { setShowSettingsModal(false); setTempColumns(visibleColumns); }} className="px-4 py-2 text-sm font-medium rounded-lg hover:opacity-80 transition-opacity" style={{ backgroundColor: '#E6E6E6', color: '#000000' }}>
                Отменить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Version1;
