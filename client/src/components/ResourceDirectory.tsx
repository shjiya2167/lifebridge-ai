import React, { useState, useEffect } from 'react';
import {
  Building,
  Phone,
  ExternalLink,
  Search,
  Filter,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  HeartPulse,
  Car,
  CloudRain,
  ShieldAlert,
  Landmark
} from 'lucide-react';
import { PublicResource } from '../types';
import { fetchResources } from '../lib/api';

export const ResourceDirectory: React.FC = () => {
  const [resources, setResources] = useState<PublicResource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadResources();
  }, [selectedCategory]);

  const loadResources = async () => {
    setIsLoading(true);
    try {
      const data = await fetchResources(selectedCategory);
      setResources(data);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Services', icon: Building },
    { id: 'emergency', label: 'Emergency (112)', icon: ShieldAlert },
    { id: 'health', label: 'Health & Ambulance', icon: HeartPulse },
    { id: 'weather', label: 'Weather Alerts (IMD)', icon: CloudRain },
    { id: 'disaster', label: 'Disaster Relief (NDMA)', icon: ShieldCheck },
    { id: 'traffic', label: 'Traffic & Highways', icon: Car },
    { id: 'public_services', label: 'Citizen Schemes', icon: Landmark }
  ];

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.notes && res.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (res.contact && res.contact.includes(searchQuery));
    return matchesSearch;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Official Government Directories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Verified Public Services & Helplines
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Direct access to official civic services, disaster management authorities, and national emergency lines. Every listing links strictly to validated government portals.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, emergency number (e.g. 112, 108), or topic..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Directory Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading verified directories...</p>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
          <p className="font-semibold text-sm">No resources match your search.</p>
          <p className="text-xs mt-1">Try clearing filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map((res, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 hover:border-brand-300 rounded-2xl p-5 shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {res.category.replace('_', ' ')}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-1 leading-snug">
                      {res.name}
                    </h3>
                  </div>
                  {res.isOfficial && (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Official
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  {res.notes || 'Verified public service portal.'}
                </p>

                {res.coverage && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Coverage: {res.coverage}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                {res.contact && (
                  <a
                    href={`tel:${res.contact.split(' ')[0]}`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-sm active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5 fill-white" />
                    <span>Call {res.contact}</span>
                  </a>
                )}

                {res.url && (
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-2 px-4 rounded-xl transition-colors"
                  >
                    <span>Visit Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
