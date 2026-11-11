import React, { useState } from 'react';
import {
  UserPlus,
  Zap,
  Building2,
  MapPin,
  Navigation,
  Send,
  BookOpen,
  Info
} from 'lucide-react';
import { Registration } from '../types';
import {
  FACULTIES_AND_PROGRAMS,
  ALL_PROGRAMS,
  ACADEMIC_LEVELS,
  HOSTEL_NAMES,
  PROXIMITY_OPTIONS,
  getHostelByName
} from '../data/constants';

interface RegistrationFormProps {
  onSubmit: (data: Omit<Registration, 'id' | 'registrationNumber' | 'createdAt' | 'status'>) => Promise<void>;
  onOpenAdmin: () => void;
  isSubmitting?: boolean;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  onOpenAdmin,
  isSubmitting = false
}) => {
  const [isFastMode, setIsFastMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('+233 ');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('All');
  const [level, setLevel] = useState('Level 100');
  const [program, setProgram] = useState('');
  const [customProgram, setCustomProgram] = useState('');
  const [hostelOrArea, setHostelOrArea] = useState('');
  const [campusBlock, setCampusBlock] = useState('Block A');
  const [customHostelName, setCustomHostelName] = useState('');
  const [customHostelLandmark, setCustomHostelLandmark] = useState('');
  const [customHostelProximity, setCustomHostelProximity] = useState('Short walk (5–10 mins)');
  const [customHostelNearby, setCustomHostelNearby] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (errors.phone) setErrors({ ...errors, phone: '' });
  };

  const availablePrograms =
    selectedFaculty === 'All'
      ? ALL_PROGRAMS
      : FACULTIES_AND_PROGRAMS.find((f) => f.name === selectedFaculty)?.programs || ALL_PROGRAMS;

  const currentHostelInfo = getHostelByName(hostelOrArea);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Please enter your full name.';
    if (!dateOfBirth.trim()) newErrors.dateOfBirth = 'Please select your date of birth.';
    if (phone.replace(/[^0-9]/g, '').length < 8) {
      newErrors.phone = 'Please provide a valid phone number for contact.';
    }
    const finalProgram = program === 'Other' ? customProgram : program;
    if (!finalProgram.trim()) {
      newErrors.program = 'Please select your GCTU course of study.';
    }
    if (!hostelOrArea) {
      newErrors.hostelOrArea = 'Please select your hostel or residential location.';
    } else if (hostelOrArea === 'Other') {
      if (!customHostelName.trim()) {
        newErrors.otherHostelName = 'Please specify your hostel or residence name.';
      }
      if (!customHostelLandmark.trim()) {
        newErrors.otherHostelLandmark = 'Please enter a local landmark to help find the hostel.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    const finalProgram = program === 'Other' ? customProgram.trim() : program.trim();
    let facultyName = selectedFaculty === 'All' ? '' : selectedFaculty;
    if (!facultyName) {
      for (const f of FACULTIES_AND_PROGRAMS) {
        if (f.programs.includes(finalProgram)) {
          facultyName = f.name;
          break;
        }
      }
    }

    let finalHostel = hostelOrArea;
    let block: string | undefined;
    let landmark = currentHostelInfo?.landmark || '';
    let proximity = currentHostelInfo?.proximityBadge || currentHostelInfo?.proximity || '';
    let nearby = currentHostelInfo?.nearbySites || '';

    if (hostelOrArea === 'GT MAIN CAMPUS') {
      finalHostel = `GT MAIN CAMPUS (${campusBlock})`;
      block = campusBlock;
    } else if (hostelOrArea === 'Other') {
      finalHostel = customHostelName.trim();
      landmark = customHostelLandmark.trim();
      proximity = customHostelProximity;
      nearby = customHostelNearby.trim();
    }

    onSubmit({
      fullName: fullName.trim(),
      preferredName: preferredName.trim() || undefined,
      gender,
      dateOfBirth: dateOfBirth.trim(),
      phone: phone.trim(),
      altPhone: altPhone.trim() || undefined,
      email:
        email.trim() ||
        `${fullName.toLowerCase().replace(/\s+/g, '.') || 'fresher'}@gctu.edu.gh`,
      faculty: facultyName,
      program: finalProgram,
      level,
      hostelOrArea: finalHostel,
      hostelBlock: block,
      hostelLandmark: landmark || undefined,
      hostelProximity: proximity || undefined,
      nearbySites: nearby || undefined,
      roomNumber: roomNumber.trim() || undefined,
      registeredBy: isFastMode ? 'Fast Field Queue' : 'Self Registration'
    });
  };

  return (
    <div className="max-w-3xl lg:max-w-4xl mx-auto py-4 sm:py-8 px-3.5 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-5 sm:mb-8 transition-shadow">
        <div className="h-3 sm:h-3.5 bg-gradient-to-r from-purple-800 via-fuchsia-700 to-pink-600" />
        <div className="p-4 sm:p-7 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src="/assets/aistudio/Qodesh_Campus_Church_Logo_61946d9b.png"
                alt="Qodesh Campus Church"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-xs border border-purple-100 object-contain p-1 bg-white shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-[11px] sm:text-xs uppercase font-semibold text-fuchsia-800 tracking-wider block">
                  Ghana Communication Technology University
                </span>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Matriculation Photoshoot
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Qodesh Campus Church · Tesano
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsFastMode(!isFastMode)}
              className={`px-3.5 py-2 min-h-[42px] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer ${
                isFastMode
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Zap
                className={`w-3.5 h-3.5 ${
                  isFastMode ? 'text-amber-600 fill-amber-500' : 'text-slate-500'
                }`}
              />
              <span>{isFastMode ? 'Fast Queue' : 'Fast Mode'}</span>
            </button>
          </div>
          <div className="mt-3.5 text-xs sm:text-sm text-slate-600 space-y-1.5 leading-relaxed">
            <p>
              Welcome to <strong>Ghana Communication Technology University (GCTU)</strong>!
              Enter your student details below to reserve your official matriculation photoshoot
              spot.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {/* Section 1: Personal Contact Details */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xs border border-slate-200">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <UserPlus className="w-4 h-4 text-fuchsia-700 shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
              1. Personal Contact Details
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  placeholder="e.g. Kwaku Boateng / Abena Mensah"
                  autoComplete="name"
                  className={`w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm bg-slate-50 rounded-xl border focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-fuchsia-600 transition-all ${
                    errors.fullName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs text-rose-600 mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Preferred / Nickname{' '}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                  placeholder="e.g. Kwaku / Priscy"
                  className="w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-fuchsia-600 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('Male')}
                    className={`py-2 px-3 min-h-[44px] text-xs font-semibold rounded-xl border transition-all text-center cursor-pointer flex items-center justify-center ${
                      gender === 'Male'
                        ? 'bg-fuchsia-800 text-white border-fuchsia-800 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('Female')}
                    className={`py-2 px-3 min-h-[44px] text-xs font-semibold rounded-xl border transition-all text-center cursor-pointer flex items-center justify-center ${
                      gender === 'Female'
                        ? 'bg-fuchsia-800 text-white border-fuchsia-800 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => {
                    setDateOfBirth(e.target.value);
                    if (errors.dateOfBirth) setErrors({ ...errors, dateOfBirth: '' });
                  }}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm bg-slate-50 text-slate-700 rounded-xl border focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-fuchsia-600 transition-all ${
                    errors.dateOfBirth ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="text-xs text-rose-600 mt-1">{errors.dateOfBirth}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Phone Number (WhatsApp) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="+233 24 000 0000"
                  autoComplete="tel"
                  className={`w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm font-mono bg-slate-50 rounded-xl border focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-fuchsia-600 transition-all ${
                    errors.phone ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>
                )}
              </div>

              {!isFastMode && (
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Alternate Phone Line{' '}
                    <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    placeholder="e.g. 050 123 4567"
                    className="w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm font-mono bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-fuchsia-600 transition-all"
                  />
                </div>
              )}
            </div>

            {!isFastMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Email Address{' '}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@gctu.edu.gh"
                  autoComplete="email"
                  className="w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-fuchsia-600 transition-all"
                />
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Academic Level & Program (GCTU) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xs border border-slate-200">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <BookOpen className="w-4 h-4 text-fuchsia-700 shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
              2. Academic Level & Program (GCTU)
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Academic Level <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {ACADEMIC_LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`py-2 px-2 min-h-[44px] text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center ${
                      level === lvl
                        ? 'bg-fuchsia-800 text-white border-fuchsia-800 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Faculty
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {FACULTIES_AND_PROGRAMS.map((f) => (
                  <button
                    key={f.name}
                    type="button"
                    onClick={() => setSelectedFaculty(selectedFaculty === f.name ? 'All' : f.name)}
                    className={`py-2 px-3 min-h-[44px] text-xs font-medium rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-center ${
                      selectedFaculty === f.name
                        ? 'bg-fuchsia-50 border-fuchsia-400 text-fuchsia-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block font-semibold">{f.shortName}</span>
                    <span className="text-[10px] text-slate-400">
                      {f.programs.length} programs
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Course of Study at GCTU <span className="text-rose-500">*</span>
              </label>
              <select
                value={program}
                onChange={(e) => {
                  setProgram(e.target.value);
                  if (errors.program) setErrors({ ...errors, program: '' });
                }}
                className={`w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm bg-slate-50 rounded-xl border focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-fuchsia-600 transition-all ${
                  errors.program ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                }`}
              >
                <option value="">Select your course...</option>
                {availablePrograms.map((prog) => (
                  <option key={prog} value={prog}>
                    {prog}
                  </option>
                ))}
                <option value="Other">Other GCTU Program (Type below)</option>
              </select>
              {program === 'Other' && (
                <input
                  type="text"
                  value={customProgram}
                  onChange={(e) => setCustomProgram(e.target.value)}
                  placeholder="Type your program title..."
                  className="mt-2 w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-fuchsia-600 transition-all"
                  autoFocus
                />
              )}
              {errors.program && (
                <p className="text-xs text-rose-600 mt-1">{errors.program}</p>
              )}
            </div>

            {/* Hostel Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Hostel / Residential Location (Tesano / Accra){' '}
                <span className="text-rose-500">*</span>
              </label>
              <select
                value={hostelOrArea}
                onChange={(e) => {
                  setHostelOrArea(e.target.value);
                  if (errors.hostelOrArea) {
                    setErrors({
                      ...errors,
                      hostelOrArea: '',
                      otherHostelName: '',
                      otherHostelLandmark: ''
                    });
                  }
                }}
                className={`w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm bg-slate-50 rounded-xl border focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-fuchsia-600 transition-all ${
                  errors.hostelOrArea ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                }`}
              >
                <option value="">Select your hostel or residential area...</option>
                {HOSTEL_NAMES.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
                <option value="Other">
                  Other (Specify hostel name, landmark & proximity)
                </option>
              </select>
              {errors.hostelOrArea && (
                <p className="text-xs text-rose-600 mt-1">{errors.hostelOrArea}</p>
              )}

              {hostelOrArea === 'GT MAIN CAMPUS' && (
                <div className="mt-3 p-3.5 sm:p-4 bg-gradient-to-r from-purple-50/90 via-fuchsia-50/80 to-pink-50/60 rounded-xl sm:rounded-2xl border border-fuchsia-300 space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-bold text-fuchsia-950 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-fuchsia-700 shrink-0" />
                      Select Campus Residential Block{' '}
                      <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-fuchsia-800 font-bold bg-fuchsia-100 px-2 py-0.5 rounded-full border border-fuchsia-200">
                      3 Blocks
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    GT Main Campus has three residential blocks. Please select whether you stay
                    in <strong>Block A</strong>, <strong>Block B</strong>, or{' '}
                    <strong>Block C</strong>:
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-0.5">
                    {['Block A', 'Block B', 'Block C'].map((blk) => (
                      <button
                        key={blk}
                        type="button"
                        onClick={() => setCampusBlock(blk)}
                        className={`py-2.5 px-3 min-h-[46px] rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer flex flex-col items-center justify-center ${
                          campusBlock === blk
                            ? 'bg-fuchsia-800 text-white shadow-sm border border-fuchsia-800 ring-2 ring-fuchsia-300'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{blk}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentHostelInfo && (
                <div className="mt-3 p-3.5 sm:p-4 bg-gradient-to-r from-fuchsia-50/80 to-purple-50/60 rounded-xl border border-fuchsia-200/80 text-xs space-y-2 animate-in fade-in duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-fuchsia-950 flex items-center gap-1.5 text-xs sm:text-sm">
                      <MapPin className="w-3.5 h-3.5 text-fuchsia-700 shrink-0" />
                      {currentHostelInfo.name}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-fuchsia-200/70 text-fuchsia-900 border border-fuchsia-300/60">
                      <Navigation className="w-3 h-3 text-fuchsia-700 shrink-0" />
                      {currentHostelInfo.proximityBadge}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-slate-700">
                    <div>
                      <span className="font-semibold text-slate-900 block">
                        Local Landmark:
                      </span>
                      <span className="text-slate-600">
                        {currentHostelInfo.landmark}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 block">
                        Nearby Sites:
                      </span>
                      <span className="text-slate-600">
                        {currentHostelInfo.nearbySites}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {hostelOrArea === 'Other' && (
                <div className="mt-3 p-3.5 sm:p-4 bg-slate-50/90 rounded-xl border border-fuchsia-200 space-y-3.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-fuchsia-900 border-b border-fuchsia-100 pb-1.5">
                    <Building2 className="w-4 h-4 text-fuchsia-700 shrink-0" />
                    <span>Specify Custom Hostel & Location Details</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Hostel / Residence Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customHostelName}
                      onChange={(e) => {
                        setCustomHostelName(e.target.value);
                        if (errors.otherHostelName) setErrors({ ...errors, otherHostelName: '' });
                      }}
                      placeholder="e.g. St. Peter's Hostel / Blue Gate Hostel / Private House"
                      className={`w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm bg-white rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-fuchsia-600 transition-all ${
                        errors.otherHostelName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                      }`}
                      autoFocus
                    />
                    {errors.otherHostelName && (
                      <p className="text-xs text-rose-600 mt-1">{errors.otherHostelName}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-fuchsia-700 shrink-0" />
                        Local Landmark <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <Info className="w-3 h-3 shrink-0" />
                        Helps find your hostel
                      </span>
                    </div>
                    <input
                      type="text"
                      value={customHostelLandmark}
                      onChange={(e) => {
                        setCustomHostelLandmark(e.target.value);
                        if (errors.otherHostelLandmark) setErrors({ ...errors, otherHostelLandmark: '' });
                      }}
                      placeholder="e.g. Opposite TotalEnergies station / Near Peace FM / Behind church"
                      className={`w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm bg-white rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-fuchsia-600 transition-all ${
                        errors.otherHostelLandmark ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                      }`}
                    />
                    {errors.otherHostelLandmark && (
                      <p className="text-xs text-rose-600 mt-1">{errors.otherHostelLandmark}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1">
                        <Navigation className="w-3.5 h-3.5 text-fuchsia-700 shrink-0" />
                        Proximity Indicator
                      </label>
                      <select
                        value={customHostelProximity}
                        onChange={(e) => setCustomHostelProximity(e.target.value)}
                        className="w-full px-3 py-2.5 min-h-[44px] text-base sm:text-xs bg-white rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-fuchsia-600 font-medium"
                      >
                        {PROXIMITY_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        Nearby Sites / Neighborhood
                      </label>
                      <input
                        type="text"
                        value={customHostelNearby}
                        onChange={(e) => setCustomHostelNearby(e.target.value)}
                        placeholder="e.g. Tesano Club, Lapaz, Achimota, Abeka Junction"
                        className="w-full px-3 py-2.5 min-h-[44px] text-base sm:text-xs bg-white rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-fuchsia-600"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Room / Flat Number <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g. Room 204 / Flat B"
                className="w-full px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-fuchsia-600 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 min-h-[52px] text-base font-bold text-white bg-gradient-to-r from-purple-800 via-fuchsia-700 to-pink-600 hover:from-purple-900 hover:via-fuchsia-800 hover:to-pink-700 disabled:opacity-75 disabled:cursor-not-allowed rounded-2xl shadow-lg shadow-fuchsia-900/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-5 h-5 shrink-0" />
            <span>{isSubmitting ? 'Submitting Registration...' : 'Complete Registration'}</span>
          </button>
        </div>
      </form>

      {/* Footer Info */}
      <div className="mt-8 sm:mt-10 text-center text-xs text-slate-400 space-y-1">
        <p>Ghana Communication Technology University · Qodesh Campus Church</p>
        <button
          onClick={onOpenAdmin}
          className="text-slate-400 hover:text-slate-600 underline font-medium cursor-pointer"
        >
          Administrator Dashboard
        </button>
      </div>
    </div>
  );
};
