import React, { useState, useMemo } from 'react';
import {
  Users,
  Laptop,
  Cpu,
  Briefcase,
  Search,
  X,
  SlidersHorizontal,
  FileSpreadsheet,
  Plus,
  Eye,
  Trash2,
  MessageSquare,
  MapPin,
  Navigation,
  Info
} from 'lucide-react';
import { Registration, RegistrationStatus } from '../types';
import { HOSTEL_NAMES } from '../data/constants';
import {
  getWhatsAppLink,
  exportRegistrationsToCSV
} from '../services/firebase';
import { StudentDetailModal } from './StudentDetailModal';
import { AddStudentModal } from './AddStudentModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface AdminDashboardProps {
  registrations: Registration[];
  onUpdateRegistration: (id: string, updates: Partial<Registration>) => void;
  onDeleteRegistration: (id: string) => void;
  onAddRegistration: (data: Omit<Registration, 'id' | 'registrationNumber' | 'createdAt' | 'status'>) => void;
  onClearAll: () => void;
  onLogout: () => void;
  onSwitchToForm: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  registrations,
  onUpdateRegistration,
  onDeleteRegistration,
  onAddRegistration,
  onClearAll,
  onSwitchToForm
}) => {
  const [search, setSearch] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [hostelFilter, setHostelFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [activeStudent, setActiveStudent] = useState<Registration | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Registration | null>(null);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);

  const metrics = useMemo(
    () => ({
      total: registrations.length,
      males: registrations.filter((r) => r.gender === 'Male').length,
      females: registrations.filter((r) => r.gender === 'Female').length,
      focis: registrations.filter(
        (r) =>
          (r.faculty && r.faculty.includes('Computing')) ||
          r.program.includes('Computer Science') ||
          r.program.includes('Information Technology') ||
          r.program.includes('Cyber Security') ||
          r.program.includes('Software') ||
          r.program.includes('Data')
      ).length,
      foe: registrations.filter(
        (r) =>
          (r.faculty && r.faculty.includes('Engineering')) ||
          r.program.includes('Engineering')
      ).length,
      gbs: registrations.filter(
        (r) =>
          (r.faculty && r.faculty.includes('Business')) ||
          r.program.includes('Business') ||
          r.program.includes('Accounting') ||
          r.program.includes('Procurement') ||
          r.program.includes('Economics')
      ).length
    }),
    [registrations]
  );

  const filteredRegistrations = useMemo(
    () =>
      registrations.filter((r) => {
        const query = search.toLowerCase().trim();
        const matchesQuery =
          !query ||
          r.fullName.toLowerCase().includes(query) ||
          r.phone.toLowerCase().includes(query) ||
          r.registrationNumber.toLowerCase().includes(query) ||
          r.program.toLowerCase().includes(query) ||
          r.hostelOrArea.toLowerCase().includes(query) ||
          (r.hostelLandmark && r.hostelLandmark.toLowerCase().includes(query)) ||
          (r.nearbySites && r.nearbySites.toLowerCase().includes(query)) ||
          r.email.toLowerCase().includes(query) ||
          (r.preferredName && r.preferredName.toLowerCase().includes(query));

        const matchesFaculty =
          facultyFilter === 'All' || (r.faculty && r.faculty.includes(facultyFilter));
        const matchesLevel = levelFilter === 'All' || r.level === levelFilter;
        const matchesHostel =
          hostelFilter === 'All' ||
          (hostelFilter === 'Other'
            ? !HOSTEL_NAMES.includes(r.hostelOrArea)
            : r.hostelOrArea === hostelFilter);
        const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
        const matchesGender = genderFilter === 'All' || r.gender === genderFilter;

        return (
          matchesQuery &&
          matchesFaculty &&
          matchesLevel &&
          matchesHostel &&
          matchesStatus &&
          matchesGender
        );
      }),
    [registrations, search, facultyFilter, levelFilter, hostelFilter, statusFilter, genderFilter]
  );

  const hasActiveFilters =
    search ||
    facultyFilter !== 'All' ||
    levelFilter !== 'All' ||
    hostelFilter !== 'All' ||
    statusFilter !== 'All' ||
    genderFilter !== 'All';

  const resetFilters = () => {
    setSearch('');
    setFacultyFilter('All');
    setLevelFilter('All');
    setHostelFilter('All');
    setStatusFilter('All');
    setGenderFilter('All');
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    onUpdateRegistration(id, { status: newStatus as RegistrationStatus });
    if (activeStudent && activeStudent.id === id) {
      setActiveStudent({ ...activeStudent, status: newStatus as RegistrationStatus });
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-6 px-3.5 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
      {/* Top Banner & Actions */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-fuchsia-800 mb-1">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Cloud Sync
            </span>
            <span className="text-slate-400">·</span>
            <span>Administrator Portal · GCTU Registry</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Matriculation Photoshoot Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ghana Communication Technology University (GCTU) · Live synced across all student devices
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <button
            onClick={() => exportRegistrationsToCSV(filteredRegistrations)}
            disabled={registrations.length === 0}
            className="flex-1 sm:flex-none py-2.5 px-3.5 sm:px-4 min-h-[40px] bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            title="Download CSV spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 shrink-0" />
            <span>Export CSV ({filteredRegistrations.length})</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="py-2.5 px-3.5 min-h-[40px] bg-fuchsia-800 hover:bg-fuchsia-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Registered</span>
            <Users className="w-4 h-4 text-fuchsia-600 shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono tabular-nums mt-1">
            {metrics.total}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {metrics.males} Male · {metrics.females} Female
          </p>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="truncate">Computing (FoCIS)</span>
            <Laptop className="w-4 h-4 text-blue-600 shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-blue-700 font-mono tabular-nums mt-1">
            {metrics.focis}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">Computer Science & IT</p>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="truncate">Engineering (FoE)</span>
            <Cpu className="w-4 h-4 text-purple-600 shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-purple-700 font-mono tabular-nums mt-1">
            {metrics.foe}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">Telecom & Electrical</p>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="truncate">Business (GBS)</span>
            <Briefcase className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 font-mono tabular-nums mt-1">
            {metrics.gbs}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">BBA & Procurement</p>
        </div>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, phone, course, hostel..."
              className="w-full pl-10 pr-9 py-2.5 min-h-[44px] text-base sm:text-sm bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-fuchsia-600 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-slate-500">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="sm:hidden px-3 py-2 min-h-[40px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-fuchsia-700" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-fuchsia-600 inline-block ml-0.5" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <span>
                <strong className="text-slate-900 font-mono">{filteredRegistrations.length}</strong>{' '}
                of {registrations.length}
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-fuchsia-700 hover:underline font-semibold cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        <div
          className={`grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs ${
            showMobileFilters ? 'grid' : 'hidden sm:grid'
          }`}
        >
          <div>
            <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
              Academic Level
            </label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full py-2 px-2.5 min-h-[42px] bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-xs focus:outline-hidden focus:ring-1 focus:ring-fuchsia-600"
            >
              <option value="All">All Levels</option>
              <option value="Level 100">Level 100</option>
              <option value="Level 200">Level 200</option>
              <option value="Level 300">Level 300</option>
              <option value="Level 400">Level 400</option>
              <option value="Diploma">Diploma</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
              Faculty
            </label>
            <select
              value={facultyFilter}
              onChange={(e) => setFacultyFilter(e.target.value)}
              className="w-full py-2 px-2.5 min-h-[42px] bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-xs focus:outline-hidden focus:ring-1 focus:ring-fuchsia-600"
            >
              <option value="All">All Faculties</option>
              <option value="Computing">Computing (FoCIS)</option>
              <option value="Engineering">Engineering (FoE)</option>
              <option value="Business">Business (GBS)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
              Hostel / Location
            </label>
            <select
              value={hostelFilter}
              onChange={(e) => setHostelFilter(e.target.value)}
              className="w-full py-2 px-2.5 min-h-[42px] bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-xs focus:outline-hidden focus:ring-1 focus:ring-fuchsia-600"
            >
              <option value="All">All Locations</option>
              {HOSTEL_NAMES.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
              <option value="Other">Other / Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-2.5 min-h-[42px] bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-xs focus:outline-hidden focus:ring-1 focus:ring-fuchsia-600"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Added to WhatsApp">Added to WhatsApp</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
              Gender
            </label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full py-2 px-2.5 min-h-[42px] bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-xs focus:outline-hidden focus:ring-1 focus:ring-fuchsia-600"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table & List */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {registrations.length === 0 ? (
          <div className="p-10 sm:p-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-fuchsia-50 text-fuchsia-700 flex items-center justify-center mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">No Registrations Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                The registry is synced with the cloud. When students register on their phones,
                they will appear here live.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onSwitchToForm}
                className="py-2.5 px-4 min-h-[42px] bg-fuchsia-800 hover:bg-fuchsia-900 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Open Registration Form
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="py-2.5 px-4 min-h-[42px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Add Student Manually
              </button>
            </div>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="p-10 sm:p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Matching Students</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No registered students match your current search or filter criteria.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card List */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredRegistrations.map((r) => {
                const whatsappUrl = getWhatsAppLink(r.phone, r.fullName);
                return (
                  <div key={r.id} className="p-4 space-y-3 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-snug">
                          {r.fullName}
                          {r.preferredName ? ` (${r.preferredName})` : ''}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-mono text-fuchsia-900 font-bold bg-fuchsia-50 px-1.5 py-0.5 rounded">
                            {r.registrationNumber}
                          </span>
                          <span>·</span>
                          <span>{r.gender}</span>
                          <span>·</span>
                          <span className="text-fuchsia-800 font-semibold">{r.level}</span>
                        </div>
                      </div>

                      <select
                        value={r.status}
                        onChange={(e) => handleStatusChange(r.id, e.target.value)}
                        className={`text-[10px] font-bold py-1 px-2 rounded-lg border ${
                          r.status === 'New'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : r.status === 'Contacted'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : r.status === 'Added to WhatsApp'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-purple-100 text-purple-900 border-purple-300'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Added to WhatsApp">WhatsApp</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div className="bg-slate-50/90 rounded-xl p-2.5 text-xs space-y-1.5 border border-slate-100">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                          Course:
                        </span>
                        <p className="font-semibold text-slate-800">{r.program}</p>
                      </div>
                      <div className="border-t border-slate-200/60 pt-1.5">
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                          Location:
                        </span>
                        <p className="font-bold text-slate-800">{r.hostelOrArea}</p>
                        {r.hostelLandmark && (
                          <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-fuchsia-700 shrink-0" />
                            <span>{r.hostelLandmark}</span>
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px]">
                          {r.hostelProximity && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-semibold bg-fuchsia-100 text-fuchsia-900">
                              <Navigation className="w-2.5 h-2.5 text-fuchsia-700 shrink-0" />
                              {r.hostelProximity}
                            </span>
                          )}
                          {r.roomNumber && (
                            <span className="text-slate-500 font-medium">
                              Room: {r.roomNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 min-h-[42px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                        <span>Chat WhatsApp ({r.phone})</span>
                      </a>
                      <button
                        onClick={() => setActiveStudent(r)}
                        className="p-2 min-h-[42px] min-w-[42px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center cursor-pointer"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setStudentToDelete(r)}
                        className="p-2 min-h-[42px] min-w-[42px] bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center cursor-pointer"
                        title="Delete Student Details"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                    <th className="py-3 px-4">Student & ID</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Course & Level</th>
                    <th className="py-3 px-4">Hostel / Location</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Delete / View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRegistrations.map((r) => {
                    const whatsappUrl = getWhatsAppLink(r.phone, r.fullName);
                    return (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-sm">
                              {r.fullName}
                            </span>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                              <span className="font-mono text-fuchsia-900 font-semibold">
                                {r.registrationNumber}
                              </span>
                              <span>·</span>
                              <span>{r.gender}</span>
                              {r.preferredName && (
                                <>
                                  <span>·</span>
                                  <span>"{r.preferredName}"</span>
                                </>
                              )}
                            </div>
                            {r.dateOfBirth && (
                              <span className="text-[10px] text-slate-400 mt-0.5">
                                DOB: {new Date(r.dateOfBirth).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-800 font-medium">
                              {r.phone}
                            </span>
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                              title="Open WhatsApp Chat"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          </div>
                          {r.email && (
                            <span
                              className="text-[11px] text-slate-400 block truncate max-w-[160px]"
                              title={r.email}
                            >
                              {r.email}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 max-w-[200px]">
                          <p className="font-semibold text-slate-800 truncate" title={r.program}>
                            {r.program}
                          </p>
                          <span className="text-[11px] font-medium text-fuchsia-800 bg-fuchsia-50 px-1.5 py-0.2 rounded border border-fuchsia-100">
                            {r.level}
                          </span>
                        </td>

                        <td className="py-3 px-4 max-w-[220px]">
                          <p
                            className="font-semibold text-slate-800 truncate"
                            title={r.hostelOrArea}
                          >
                            {r.hostelOrArea}
                          </p>
                          {r.hostelLandmark && (
                            <p
                              className="text-[11px] text-slate-500 flex items-center gap-1 truncate"
                              title={r.hostelLandmark}
                            >
                              <MapPin className="w-2.5 h-2.5 text-fuchsia-700 shrink-0" />
                              <span className="truncate">{r.hostelLandmark}</span>
                            </p>
                          )}
                          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
                            {r.hostelProximity && (
                              <span className="inline-flex items-center gap-0.5 font-medium text-fuchsia-900 bg-fuchsia-50 px-1 rounded">
                                <Navigation className="w-2.5 h-2.5 text-fuchsia-700 shrink-0" />
                                {r.hostelProximity}
                              </span>
                            )}
                            {r.roomNumber && <span>Room: {r.roomNumber}</span>}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <select
                            value={r.status}
                            onChange={(e) => handleStatusChange(r.id, e.target.value)}
                            className={`text-[11px] font-semibold py-1 px-2 rounded-lg border transition-colors ${
                              r.status === 'New'
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : r.status === 'Contacted'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : r.status === 'Added to WhatsApp'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-purple-100 text-purple-900 border-purple-300'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Added to WhatsApp">Added to WhatsApp</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setActiveStudent(r)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                              title="View Full Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setStudentToDelete(r)}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Student Details"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Footer bar */}
        {registrations.length > 0 && (
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-400" />
              <span>{registrations.length} student registrations in cloud registry.</span>
            </div>
            <div>
              <button
                onClick={() => setIsDeleteAllOpen(true)}
                className="text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete All Details</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail / Profile Modal */}
      <StudentDetailModal
        student={activeStudent}
        onClose={() => setActiveStudent(null)}
        onUpdateStatus={handleStatusChange}
        onSaveNotes={(id, notes, shepherd) => {
          onUpdateRegistration(id, { adminNotes: notes, shepherdAssigned: shepherd });
          if (activeStudent && activeStudent.id === id) {
            setActiveStudent({ ...activeStudent, adminNotes: notes, shepherdAssigned: shepherd });
          }
        }}
        onDeleteRequest={(student) => {
          setActiveStudent(null);
          setStudentToDelete(student);
        }}
      />

      {/* Manual Add Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAddRegistration}
      />

      {/* Confirm Single Delete Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(studentToDelete)}
        title="Delete Student Details?"
        message={
          studentToDelete ? (
            <p>
              Are you sure you want to permanently delete registration details for{' '}
              <strong>{studentToDelete.fullName}</strong> ({studentToDelete.registrationNumber})?
            </p>
          ) : null
        }
        onConfirm={() => {
          if (studentToDelete) {
            onDeleteRegistration(studentToDelete.id);
            setStudentToDelete(null);
          }
        }}
        onCancel={() => setStudentToDelete(null)}
      />

      {/* Confirm Delete All Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteAllOpen}
        title="Delete All Registrations?"
        message={
          <p className="text-rose-600 font-semibold">
            Warning: Are you sure you want to permanently clear the entire registration database? This action cannot be undone.
          </p>
        }
        onConfirm={() => {
          onClearAll();
          setIsDeleteAllOpen(false);
        }}
        onCancel={() => setIsDeleteAllOpen(false)}
      />
    </div>
  );
};
