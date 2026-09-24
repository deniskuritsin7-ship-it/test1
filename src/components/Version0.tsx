import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Settings,
  Calendar,
  Star,
  Zap,
} from 'lucide-react';
import { mainTabs, subTabs } from '../data/petData';

function FilterDropdown({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className="flex flex-col">
      {label && <label className="text-xs text-gray-500 mb-1">{label}</label>}
      <div
        className={`flex items-center gap-2 px-3 ${
          compact ? 'py-1.5' : 'py-2'
        } border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-gray-300 transition-colors min-w-[140px]`}
      >
        <span className="text-sm text-gray-700 truncate">{value}</span>
        <ChevronDown className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0" />
      </div>
    </div>
  );
}

function Version0() {
  const [activeTab, setActiveTab] = React.useState('Тарифы на корм');
  const [activeSubTab, setActiveSubTab] = React.useState('Тарифы на еду');
  const [checkbox1, setCheckbox1] = React.useState(false);
  const [checkbox2, setCheckbox2] = React.useState(false);

  const petRows = React.useMemo(() => [
    {
      name: 'Собака',
      emoji: '🐕',
      location: 'У тебя дома',
      badge: '×1',
      badgeColor: 'bg-gray-100 text-gray-700',
      logistics: '100 / 80',
      logisticsPct: '180%',
      logisticsPctColor: 'text-red-500',
      eaten: '1 / 0.8',
      eatenPct: '180%',
      eatenPctColor: 'text-red-500',
    },
    {
      name: 'Котяра',
      emoji: '🐈',
      location: 'У тебя дома',
      badge: 'Съест всё',
      badgeColor: 'bg-green-100 text-green-700',
      logistics: '80 / 70',
      logisticsPct: '80%',
      logisticsPctColor: 'text-green-600',
      eaten: '0.8 / 0.8',
      eatenPct: '200%',
      eatenPctColor: 'text-red-500',
    },
    {
      name: 'Попугай',
      emoji: '🦜',
      location: 'Уганда',
      badge: '×4',
      badgeColor: 'bg-gray-100 text-gray-700',
      logistics: '60 / 51',
      logisticsPct: '80%',
      logisticsPctColor: 'text-green-600',
      eaten: '1 / 1',
      eatenPct: '200%',
      eatenPctColor: 'text-red-500',
    },
    {
      name: 'Жираф',
      emoji: '🦒',
      location: 'Африка',
      badge: '',
      badgeColor: '',
      logistics: '—',
      logisticsPct: '',
      logisticsPctColor: '',
      eaten: '—',
      eatenPct: '',
      eatenPctColor: '',
      isFull: true,
    },
  ], []);

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#F7F7FA' }}>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-3xl font-bold text-gray-900 mb-5">Питомцы</h1>
          <div className="flex gap-0 overflow-x-auto">
            {mainTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Рейтинг хозяина — 1
                </h3>
                <p className="text-sm text-gray-500 mt-0.5 max-w-xl">
                  Эффективность распределения продуктов между вашими питомцами.
                  Влияет на любовь ваших питомцев
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {subTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeSubTab === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="px-4 py-2 text-sm font-medium text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
            Базовые тарифы
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-wrap items-end gap-3">
            <FilterDropdown label="Отгрузка через" value="Ручное кормление" />
            <FilterDropdown label="Тип еды" value="Сухой корм" />
            <FilterDropdown label="Объём продукта, кг" value="0,201 - 0,400" />
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Дата кормления</label>
              <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-white min-w-[160px] cursor-pointer hover:border-gray-300 transition-colors">
                <span className="text-sm text-gray-700">12.08.2026</span>
                <Calendar className="w-4 h-4 text-gray-400 ml-auto" />
              </div>
            </div>
            <div className="flex flex-col justify-end">
              <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="flex items-center gap-4 ml-auto pb-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checkbox1}
                  onChange={() => setCheckbox1(!checkbox1)}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 accent-purple-600"
                />
                <span className="text-sm text-gray-700">Готовы есть</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checkbox2}
                  onChange={() => setCheckbox2(!checkbox2)}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 accent-purple-600"
                />
                <span className="text-sm text-gray-700">Съест всё</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-3 border-b border-gray-100 flex items-center">
            <FilterDropdown label="" value="Все питомцы" compact />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="p-3 w-[220px]" rowSpan={2}></th>
                  <th className="p-3 text-center text-sm font-semibold text-gray-700 border-l border-gray-100" colSpan={3}>
                    21 сентября, понедельник
                  </th>
                  <th className="p-3 text-center text-sm font-semibold text-gray-700 border-l border-gray-100" colSpan={3}>
                    22 сентября, вторник
                  </th>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="p-2 text-xs font-semibold text-gray-500 uppercase text-center border-l border-gray-200 w-[80px]">
                    <div className="flex items-center justify-center gap-0.5">
                      Голод <ChevronDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-2 text-xs font-semibold text-gray-500 uppercase text-center border-l border-gray-200 w-[130px]">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="flex items-center gap-0.5">
                        Логистика ₽ <ChevronDown className="w-3 h-3" />
                      </span>
                      <span className="font-normal text-gray-400 normal-case">первый кг / доп кг</span>
                    </div>
                  </th>
                  <th className="p-2 text-xs font-semibold text-gray-500 uppercase text-center border-l border-gray-200 w-[130px]">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="flex items-center gap-0.5">
                        Съедено в день ₽ <ChevronDown className="w-3 h-3" />
                      </span>
                      <span className="font-normal text-gray-400 normal-case">(утро / день)</span>
                    </div>
                  </th>
                  <th className="p-2 text-xs font-semibold text-gray-500 uppercase text-center border-l border-gray-200 w-[80px]">
                    <div className="flex items-center justify-center gap-0.5">
                      Голод <ChevronDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-2 text-xs font-semibold text-gray-500 uppercase text-center border-l border-gray-200 w-[130px]">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="flex items-center gap-0.5">
                        Логистика ₽ <ChevronDown className="w-3 h-3" />
                      </span>
                      <span className="font-normal text-gray-400 normal-case">первый кг / доп кг</span>
                    </div>
                  </th>
                  <th className="p-2 text-xs font-semibold text-gray-500 uppercase text-center border-l border-gray-200 w-[130px]">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="flex items-center gap-0.5">
                        Съедено в день ₽ <ChevronDown className="w-3 h-3" />
                      </span>
                      <span className="font-normal text-gray-400 normal-case">(утро / день)</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {petRows.map((pet, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-100 hover:bg-purple-50/30 transition-colors ${
                      index % 2 === 1 ? 'bg-gray-50/40' : ''
                    }`}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{pet.emoji}</span>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-gray-900">{pet.name}</span>
                            {pet.name === 'Жираф' && <Zap className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />}
                          </div>
                          <span className="text-xs text-gray-400">{pet.location}</span>
                          {pet.badge && (
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium w-fit ${pet.badgeColor}`}>
                              {pet.badge}
                            </span>
                          )}
                          {pet.isFull && (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 w-fit">
                              Пока сыт
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center border-l border-gray-100">
                      {pet.isFull ? <span className="text-gray-300">—</span> : <span className="text-sm text-gray-600">—</span>}
                    </td>
                    <td className="p-3 text-center border-l border-gray-100">
                      {pet.isFull ? (
                        <span className="text-gray-300">—</span>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-sm text-gray-700 font-medium">{pet.logistics}</span>
                          <span className={`text-xs font-semibold ${pet.logisticsPctColor}`}>({pet.logisticsPct})</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center border-l border-gray-100">
                      {pet.isFull ? (
                        <span className="text-gray-300">—</span>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-sm text-gray-700 font-medium">{pet.eaten}</span>
                          <span className={`text-xs font-semibold ${pet.eatenPctColor}`}>({pet.eatenPct})</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center border-l border-gray-100">
                      {pet.isFull ? <span className="text-gray-300">—</span> : <span className="text-sm text-gray-600">—</span>}
                    </td>
                    <td className="p-3 text-center border-l border-gray-100">
                      {pet.isFull ? (
                        <span className="text-gray-300">—</span>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-sm text-gray-700 font-medium">{pet.logistics}</span>
                          <span className={`text-xs font-semibold ${pet.logisticsPctColor}`}>({pet.logisticsPct})</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center border-l border-gray-100">
                      {pet.isFull ? (
                        <span className="text-gray-300">—</span>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-sm text-gray-700 font-medium">{pet.eaten}</span>
                          <span className={`text-xs font-semibold ${pet.eatenPctColor}`}>({pet.eatenPct})</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Version0;
