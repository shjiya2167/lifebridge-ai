import React, { useState } from 'react';
import { Phone, ShieldAlert, MapPin, ChevronRight, AlertCircle, X } from 'lucide-react';
import { getTranslation } from '../lib/translations';

interface EmergencyBannerProps {
  currentLanguage: string;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ currentLanguage }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('');
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);

  const t = getTranslation(currentLanguage);

  const handleRequestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDetectedLocation(
            `Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)}`
          );
        },
        () => {
          setDetectedLocation('Location permission not granted. You can type your city or district manually.');
        }
      );
    }
  };

  if (isDismissed) return null;

  return (
    <>
      <div className="bg-red-600 text-white shadow-md border-b border-red-700 no-print">
        <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center gap-2.5">
            <span className="p-1 rounded-lg bg-red-700 text-white flex-shrink-0 animate-pulse">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <div>
              <span className="font-bold tracking-wide mr-1.5">{t.emergencyBannerTitle}</span>
              <span className="text-red-100 hidden md:inline">{t.emergencyBannerSubtitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1 text-[11px] bg-red-700 hover:bg-red-800 text-red-100 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <MapPin className="w-3 h-3" />
              <span>{userLocation ? `Location: ${userLocation}` : 'Set Location'}</span>
            </button>

            <a
              href="tel:112"
              className="flex items-center gap-1.5 bg-white text-red-600 hover:bg-red-50 font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
            >
              <Phone className="w-3.5 h-3.5 fill-red-600" />
              <span>{t.call112}</span>
            </a>

            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-md text-red-200 hover:text-white transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Location Confirmation Dialog */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Confirm Your Location</h3>
              </div>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Confirming your state, district, or city enables LifeBridge AI to provide specific district disaster control numbers (1077) and verify active local emergency protocols. Your location is kept strictly in local memory and is never transmitted to advertisers.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City, District, or State (e.g. Mumbai, Delhi, Pune, Kolkata):
                </label>
                <input
                  type="text"
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                  placeholder="Enter district or city name..."
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <button
                type="button"
                onClick={handleRequestLocation}
                className="w-full text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100/80 border border-brand-200 py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Use Device GPS</span>
              </button>

              {detectedLocation && (
                <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  {detectedLocation}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(false)}
                className="text-xs text-slate-600 hover:text-slate-800 px-3 py-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(false)}
                className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2 rounded-xl"
              >
                Save Location
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
