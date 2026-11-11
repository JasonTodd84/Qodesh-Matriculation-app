import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { Registration } from '../types';
import {
  FACULTIES_AND_PROGRAMS,
  ALL_PROGRAMS,
  ACADEMIC_LEVELS,
  HOSTEL_NAMES,
  PROXIMITY_OPTIONS,
  getHostelByName
} from '../data/constants';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: Omit<Registration, 'id' | 'registrationNumber' | 'createdAt' | 'status'>) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+233 ');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [dob, setDob] = useState('');
  const [level, setLevel] = useState('Level 100');
  const [program, setProgram] = useState(ALL_PROGRAMS[0]);
  const [hostel, setHostel] = useState(HOSTEL_NAMES[0]);
  const [block, setBlock] = useState('Block A');
  const [otherHostel, setOtherHostel] = useState('');
  const [otherLandmark, setOtherLandmark] = useState('');
  const [otherProximity, setOtherProximity] = useState('Short walk (5–10 mins)');
  const [otherNearby, setOtherNearby] = useState('');
  const [room, setRoom] = useState('');

  if (!isOpen) return null;

  const currentHostelInfo = getHostelByName(hostel);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !dob.trim()) return;

    let facultyName = '';
    for (const f of FACULTIES_AND_PROGRAMS) {
      if (f.programs.includes(program)) {
        facultyName = f.name;
        break;
      }
    }

    let finalHostel = hostel;
    let finalBlock: string | undefined;
    let landmark = currentHostelInfo?.landmark || '';
    let proximity = currentHostelInfo?.proximityBadge || '';
    let nearby = currentHostelInfo?.nearbySites || '';

    if (hostel === 'GT MAIN CAMPUS') {
      finalHostel = `GT MAIN CAMPUS (${block})`;
      finalBlock = block;
    } else if (hostel === 'Other') {
      finalHostel = otherHostel.trim() || 'Other Residence';
      landmark = otherLandmark.trim();
      proximity = otherProximity;
      nearby = otherNearby.trim();
    }

    onAdd({
      fullName: name.trim(),
      phone: phone.trim(),
      gender,
      dateOfBirth: dob.trim(),
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@gctu.edu.gh`,
      level,
      faculty: facultyName,
      program,
      hostelOrArea: finalHostel,
      hostelBlock: finalBlock,
      hostelLandmark: landmark || undefined,
      hostelProximity: proximity || undefined,
      nearbySites: nearby || undefined,
      roomNumber: room.trim() || undefined,
      registeredBy: 'Admin Manual Entry'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        <div className="bg-fuchsia-900 text-white p-4 flex items-center justify-between shrink-0">
          <h3 className="font-bold text-sm sm:text-base">Add Student Details</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 text-xs overflow-y-auto">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Samuel Osei"
              className="w-full px-3 py-2 min-h-[42px] bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+233 24 123 4567"
                className="w-full px-3 py-2 min-h-[42px] bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-xs font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                className="w-full px-3 py-2 min-h-[42px] bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-xs"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
            <input
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-3 py-2 min-h-[42px] bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-xs text-slate-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 min-h-[42px] bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-xs"
              >
                {ACADEMIC_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Program</label>
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full px-3 py-2 min-h-[42px] bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-xs"
              >
                {ALL_PROGRAMS.map((prog) => (
                  <option key={prog} value={prog}>
                    {prog}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Hostel / Location</label>
            <select
              value={hostel}
              onChange={(e) => setHostel(e.target.value)}
              className="w-full px-3 py-2 min-h-[42px] bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-xs"
            >
              {HOSTEL_NAMES.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
              <option value="Other">Other (Specify hostel, landmark & proximity)</option>
            </select>

            {hostel === 'GT MAIN CAMPUS' && (
              <div className="mt-2 p-2.5 bg-fuchsia-50 rounded-xl border border-fuchsia-200 space-y-1.5">
                <span className="block text-[11px] font-bold text-fuchsia-950">
                  Select Campus Block (Block A, B, or C):
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Block A', 'Block B', 'Block C'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBlock(b)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                        block === b
                          ? 'bg-fuchsia-800 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentHostelInfo && (
              <p className="mt-1 text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-fuchsia-600 shrink-0" />
                {currentHostelInfo.landmark} • {currentHostelInfo.proximityBadge}
              </p>
            )}

            {hostel === 'Other' && (
              <div className="mt-2 space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="text"
                  required
                  value={otherHostel}
                  onChange={(e) => setOtherHostel(e.target.value)}
                  placeholder="Specify hostel / residence name"
                  className="w-full px-2.5 py-2 min-h-[40px] bg-white border border-slate-300 rounded-lg text-base sm:text-xs"
                />
                <input
                  type="text"
                  required
                  value={otherLandmark}
                  onChange={(e) => setOtherLandmark(e.target.value)}
                  placeholder="Local landmark to help find hostel"
                  className="w-full px-2.5 py-2 min-h-[40px] bg-white border border-slate-300 rounded-lg text-base sm:text-xs"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={otherProximity}
                    onChange={(e) => setOtherProximity(e.target.value)}
                    className="w-full px-2 py-2 min-h-[40px] bg-white border border-slate-300 rounded-lg text-base sm:text-xs"
                  >
                    {PROXIMITY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.value}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={otherNearby}
                    onChange={(e) => setOtherNearby(e.target.value)}
                    placeholder="Nearby sites (e.g. Lapaz)"
                    className="w-full px-2.5 py-2 min-h-[40px] bg-white border border-slate-300 rounded-lg text-base sm:text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Room / Flat (optional)
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. Room 12"
              className="w-full px-3 py-2 min-h-[42px] bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 min-h-[42px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 min-h-[42px] bg-fuchsia-800 hover:bg-fuchsia-900 text-white rounded-xl font-bold cursor-pointer"
            >
              Save Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
