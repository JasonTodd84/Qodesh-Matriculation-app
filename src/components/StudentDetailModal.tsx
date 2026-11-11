import React, { useState } from 'react';
import {
  X,
  Trash2,
  MessageSquare,
  Phone,
  MapPin,
  Navigation
} from 'lucide-react';
import { Registration } from '../types';
import { getWhatsAppLink } from '../services/firebase';

interface StudentDetailModalProps {
  student: Registration | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  onSaveNotes: (id: string, notes: string, shepherd: string) => void;
  onDeleteRequest: (student: Registration) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onUpdateStatus,
  onSaveNotes,
  onDeleteRequest
}) => {
  if (!student) return null;

  const [notes, setNotes] = useState(student.adminNotes || '');
  const [shepherd, setShepherd] = useState(student.shepherdAssigned || '');

  const handleSave = () => {
    onSaveNotes(student.id, notes, shepherd);
  };

  const whatsappUrl = getWhatsAppLink(student.phone, student.fullName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[94vh] sm:max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-900 via-fuchsia-900 to-purple-950 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/20 text-fuchsia-200 font-bold">
                {student.registrationNumber}
              </span>
              <span className="text-xs text-purple-300 font-medium">Student Profile</span>
            </div>
            <h2 className="text-base sm:text-xl font-bold mt-1">{student.fullName}</h2>
            <p className="text-[11px] sm:text-xs text-purple-200">
              Registered: {new Date(student.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onDeleteRequest(student)}
              className="p-2 min-h-[40px] min-w-[40px] text-rose-300 hover:text-white rounded-lg hover:bg-white/10 flex items-center justify-center cursor-pointer"
              title="Delete this student"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 min-h-[40px] min-w-[40px] text-white/70 hover:text-white rounded-lg hover:bg-white/10 flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 min-h-[40px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp: {student.phone}</span>
              </a>
              {student.altPhone && (
                <a
                  href={`tel:${student.altPhone}`}
                  className="py-2 px-2.5 min-h-[40px] bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{student.altPhone}</span>
                </a>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Status:</span>
              <select
                value={student.status}
                onChange={(e) => onUpdateStatus(student.id, e.target.value)}
                className="py-1.5 px-2 min-h-[38px] font-semibold rounded-md border border-slate-300 bg-white"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Added to WhatsApp">Added to WhatsApp</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Course & Level
              </span>
              <p className="font-bold text-slate-800">{student.program}</p>
              <p className="text-fuchsia-800 font-semibold">{student.level}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Hostel / Location
              </span>
              <p className="font-bold text-slate-800">{student.hostelOrArea}</p>
              <p className="text-slate-500">
                Room: {student.roomNumber || 'Not specified'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Date of Birth
              </span>
              <p className="font-bold text-slate-800">
                {student.dateOfBirth
                  ? new Date(student.dateOfBirth).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'Not provided'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Gender & Nickname
              </span>
              <p className="font-bold text-slate-800">
                {student.gender}
                {student.preferredName ? ` (${student.preferredName})` : ''}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Email Address
              </span>
              <p className="font-medium text-slate-800 truncate" title={student.email}>
                {student.email}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Faculty
              </span>
              <p className="font-bold text-slate-800">{student.faculty || 'General'}</p>
            </div>
          </div>

          {/* Landmark & Proximity Info */}
          {(student.hostelLandmark || student.hostelProximity || student.nearbySites) && (
            <div className="p-3.5 bg-fuchsia-50/70 border border-fuchsia-200 rounded-xl space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-fuchsia-900 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-fuchsia-700" />
                Landmark & Proximity Info
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {student.hostelLandmark && (
                  <div>
                    <span className="font-semibold text-slate-800 block">Local Landmark:</span>
                    <span>{student.hostelLandmark}</span>
                  </div>
                )}
                {student.hostelProximity && (
                  <div>
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-fuchsia-700" />
                      Proximity Indicator:
                    </span>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded font-semibold bg-fuchsia-100 text-fuchsia-900 text-[10px]">
                      {student.hostelProximity}
                    </span>
                  </div>
                )}
                {student.nearbySites && (
                  <div className="sm:col-span-2">
                    <span className="font-semibold text-slate-800 block">
                      Nearby Sites / Area:
                    </span>
                    <span>{student.nearbySites}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Follow-Up Section */}
          <div className="border-t border-slate-200 pt-3 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Assigned Leader / Shepherd
                </label>
                <input
                  type="text"
                  value={shepherd}
                  onChange={(e) => setShepherd(e.target.value)}
                  placeholder="e.g. Leader Name"
                  className="w-full px-3 py-2 min-h-[40px] text-base sm:text-xs bg-slate-50 rounded-lg border border-slate-300 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Registration Source
                </label>
                <input
                  type="text"
                  disabled
                  value={student.registeredBy || 'Self'}
                  className="w-full px-3 py-2 min-h-[40px] text-base sm:text-xs bg-slate-100 rounded-lg border border-slate-200 text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Internal Follow-Up Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter notes about this student..."
                className="w-full px-3 py-2 text-base sm:text-xs bg-slate-50 rounded-lg border border-slate-300 focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => onDeleteRequest(student)}
                className="py-2.5 px-3 min-h-[42px] text-rose-600 hover:bg-rose-50 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="py-2.5 px-4 min-h-[42px] bg-fuchsia-800 hover:bg-fuchsia-900 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
