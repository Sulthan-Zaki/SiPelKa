"use client";

import { useEffect, useState, useMemo } from "react";
import { userApi } from "@/lib/userApi";
import type { UserResponse, CreateUserPayload, UpdateUserPayload } from "@/types/user";

export default function AccountsPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  const getAvatarUrl = (photoUrl?: string) => {
    if (!photoUrl) return null;
    if (photoUrl.startsWith("http")) return photoUrl;
    return `${baseUrl}${photoUrl}`;
  };

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserPayload>({
    name: "",
    email: "",
    nip: "",
    password: "",
    role: "RESEARCHER",
    isActivated: false,
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // Edit State
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    nip: "",
    password: "",
    role: "RESEARCHER" as "ADMIN" | "RESEARCHER" | "REVIEWER",
    isActivated: false,
  });
  const [editError, setEditError] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete State
  const [deletingUser, setDeletingUser] = useState<UserResponse | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Success Notification state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load Users from Backend
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load user accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Show a success message for 4 seconds
  const triggerSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage((prev) => (prev === message ? null : prev));
    }, 4000);
  };

  // Quick Account Activation
  const handleQuickActivate = async (id: string, name: string) => {
    try {
      await userApi.activateUser(id);
      triggerSuccess(`Account for ${name} has been successfully activated.`);
      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to activate user");
    }
  };

  // Create User Handler
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.email || !createForm.nip || !createForm.password) {
      setCreateError("All fields are required to create a new account.");
      return;
    }
    try {
      setCreateSubmitting(true);
      setCreateError(null);
      await userApi.createUser(createForm);
      setIsCreateOpen(false);
      setCreateForm({
        name: "",
        email: "",
        nip: "",
        password: "",
        role: "RESEARCHER",
        isActivated: false,
      });
      triggerSuccess(`Account for ${createForm.name} created successfully.`);
      loadUsers();
    } catch (err: any) {
      setCreateError(err.response?.data?.message || "Failed to create user account.");
    } finally {
      setCreateSubmitting(false);
    }
  };

  // Edit Form Pre-fill
  const handleStartEdit = (user: UserResponse) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      nip: user.nip,
      password: "", // Leave blank unless changing
      role: user.role,
      isActivated: user.isActivated,
    });
    setEditError(null);
  };

  // Edit User Handler
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!editForm.name || !editForm.email || !editForm.nip) {
      setEditError("Name, Email, and NIP are required.");
      return;
    }
    try {
      setEditSubmitting(true);
      setEditError(null);
      await userApi.updateUser(editingUser.id, editForm as UpdateUserPayload);
      setEditingUser(null);
      triggerSuccess(`Account for ${editForm.name} updated successfully.`);
      loadUsers();
    } catch (err: any) {
      setEditError(err.response?.data?.message || "Failed to update user account.");
    } finally {
      setEditSubmitting(false);
    }
  };

  // Delete User Handler
  const handleDeleteSubmit = async () => {
    if (!deletingUser) return;
    try {
      setDeleteSubmitting(true);
      await userApi.deleteUser(deletingUser.id);
      triggerSuccess(`Account for ${deletingUser.name} deleted successfully.`);
      setDeletingUser(null);
      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete user account.");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  // Calculate Key Stats
  const stats = useMemo(() => {
    const total = users.length;
    const pending = users.filter((u) => !u.isActivated).length;
    const admins = users.filter((u) => u.role === "ADMIN" && u.isActivated).length;
    const activeMembers = users.filter((u) => u.role !== "ADMIN" && u.isActivated).length;
    return { total, pending, admins, activeMembers };
  }, [users]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Search Match
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.nip.includes(searchQuery);

      // Role Match
      const matchesRole = filterRole === "ALL" || u.role === filterRole;

      // Status Match
      const matchesStatus =
        filterStatus === "ALL" ||
        (filterStatus === "ACTIVE" && u.isActivated) ||
        (filterStatus === "PENDING" && !u.isActivated);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, filterRole, filterStatus]);

  return (
    <>
      {/* Title & Add Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-headline text-3xl font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl">manage_accounts</span>
            Account Management
          </h2>
          <p className="text-on-surface-variant font-body text-sm">
            Configure system roles, manage credentials, and authorize researcher/reviewer accounts.
          </p>
        </div>
        <button
          onClick={() => {
            setIsCreateOpen(true);
            setCreateError(null);
          }}
          className="gradient-primary text-on-primary py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-label text-sm font-semibold cursor-pointer shadow-sm shadow-primary/10 self-start"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>Add User Account</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl flex items-start gap-3 animate-fade-in shadow-sm">
          <span className="material-symbols-outlined text-emerald-600">check_circle</span>
          <div className="flex-1 text-sm font-medium">{successMessage}</div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-500 hover:text-emerald-700 cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-error-container/20 border border-error/20 text-error p-4 rounded-xl flex items-start gap-3">
          <span className="material-symbols-outlined">error</span>
          <div className="flex-1 text-sm font-medium">{error}</div>
          <button onClick={loadUsers} className="text-primary font-semibold hover:underline text-xs flex items-center gap-1 cursor-pointer">
            <span className="material-symbols-outlined text-[14px]">refresh</span> Retry
          </button>
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: "group",
            bg: "bg-primary/10 text-primary",
            label: "Total Registered",
            value: stats.total,
            filterValue: "ALL",
            isActive: filterStatus === "ALL" && filterRole === "ALL",
            onClick: () => {
              setFilterStatus("ALL");
              setFilterRole("ALL");
            },
          },
          {
            icon: "pending",
            bg: "bg-secondary-container/40 text-on-secondary-container",
            label: "Pending Activation",
            value: stats.pending,
            filterValue: "PENDING",
            isActive: filterStatus === "PENDING",
            onClick: () => {
              setFilterStatus("PENDING");
              setFilterRole("ALL");
            },
          },
          {
            icon: "admin_panel_settings",
            bg: "bg-tertiary/10 text-tertiary",
            label: "Administrators",
            value: stats.admins,
            filterValue: "ADMIN",
            isActive: filterRole === "ADMIN",
            onClick: () => {
              setFilterStatus("ALL");
              setFilterRole("ADMIN");
            },
          },
          {
            icon: "verified_user",
            bg: "bg-emerald-500/10 text-emerald-700",
            label: "Active Members",
            value: stats.activeMembers,
            filterValue: "ACTIVE",
            isActive: filterStatus === "ACTIVE" && filterRole !== "ADMIN",
            onClick: () => {
              setFilterStatus("ACTIVE");
              setFilterRole("ALL");
            },
          },
        ].map((card) => (
          <button
            key={card.label}
            onClick={card.onClick}
            className={`text-left bg-surface-container-lowest p-5 rounded-xl border flex items-center justify-between transition-all hover:-translate-y-0.5 cursor-pointer select-none ${card.isActive
              ? "border-primary shadow-sm bg-primary/5 ring-1 ring-primary/20"
              : "border-outline-variant/15 ambient-shadow"
              }`}
          >
            <div className="space-y-1">
              <p className="text-xs font-label text-on-surface-variant font-bold uppercase tracking-wider">
                {card.label}
              </p>
              <h3 className="text-3xl font-headline font-extrabold text-primary">
                {card.value}
              </h3>
            </div>
            <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center shrink-0`}>
              <span className="material-symbols-outlined text-[24px]">
                {card.icon}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Main Table & Filters */}
      <div className="bg-surface-container-lowest rounded-xl ambient-shadow border border-outline-variant/15 overflow-hidden">
        {/* Table Filters Header */}
        <div className="p-6 border-b border-surface-container-low flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full lg:max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-full text-on-surface-variant text-sm outline-none focus:ring-1 focus:ring-primary/20 font-body border border-transparent focus:border-outline-variant/50 transition-colors"
              placeholder="Search by name, email, or NIP..."
              type="text"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Quick Select Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            {/* Filter by Role */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-label font-semibold text-on-surface-variant">Role:</span>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="text-xs font-label border border-outline-variant/30 bg-surface-container-low rounded-lg outline-none p-2 text-on-surface-variant focus:ring-1 focus:ring-primary/10 cursor-pointer"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Administrator</option>
                <option value="RESEARCHER">Researcher</option>
                <option value="REVIEWER">Reviewer</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-label font-semibold text-on-surface-variant">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs font-label border border-outline-variant/30 bg-surface-container-low rounded-lg outline-none p-2 text-on-surface-variant focus:ring-1 focus:ring-primary/10 cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending Activation</option>
              </select>
            </div>

            {(filterRole !== "ALL" || filterStatus !== "ALL" || searchQuery) && (
              <button
                onClick={() => {
                  setFilterRole("ALL");
                  setFilterStatus("ALL");
                  setSearchQuery("");
                }}
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer ml-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          {loading ? (
            /* Loading Skeleton */
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 bg-surface-container rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface-container rounded w-1/4"></div>
                    <div className="h-3 bg-surface-container rounded w-1/3"></div>
                  </div>
                  <div className="w-20 h-6 bg-surface-container rounded-full"></div>
                  <div className="w-16 h-6 bg-surface-container rounded-full"></div>
                  <div className="w-24 h-8 bg-surface-container rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-primary/40 text-4xl">no_accounts</span>
              </div>
              <div>
                <h4 className="font-headline text-lg font-bold text-primary">No User Accounts Found</h4>
                <p className="text-sm text-on-surface-variant font-body mt-1">
                  We couldn't find any accounts matching your search filters.
                </p>
              </div>
              <button
                onClick={() => {
                  setFilterRole("ALL");
                  setFilterStatus("ALL");
                  setSearchQuery("");
                }}
                className="text-xs font-label bg-surface-container hover:bg-surface-container-high text-primary font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            /* Table Data */
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-widest font-bold font-label border-b border-surface-container-low select-none">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">NIP</th>
                  <th className="px-6 py-4">System Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {filteredUsers.map((user) => {
                  // Custom initials & colors for avatars
                  const initials = user.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  let avatarBg = "bg-primary/10 text-primary";
                  if (user.role === "REVIEWER") {
                    avatarBg = "bg-tertiary/10 text-tertiary";
                  } else if (user.role === "ADMIN") {
                    avatarBg = "bg-secondary-container/40 text-on-secondary-container";
                  }

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-surface-container-low/30 transition-colors"
                    >
                      {/* Name & Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${avatarBg} flex items-center justify-center text-xs font-bold font-label shrink-0 overflow-hidden`}>
                            {getAvatarUrl(user.profilePhotoUrl) ? (
                              <img
                                src={getAvatarUrl(user.profilePhotoUrl)!}
                                alt={user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              initials
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-primary font-headline">
                              {user.name}
                            </p>
                            <p className="text-xs text-on-surface-variant font-body">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* NIP */}
                      <td className="px-6 py-4 text-sm font-medium font-body text-on-surface">
                        {user.nip || <span className="text-on-surface-variant/40">—</span>}
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${user.role === "ADMIN"
                            ? "bg-primary/10 text-primary"
                            : user.role === "REVIEWER"
                              ? "bg-tertiary/15 text-tertiary"
                              : "bg-surface-container-high text-on-surface"
                            }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {user.role === "ADMIN"
                              ? "admin_panel_settings"
                              : user.role === "REVIEWER"
                                ? "rate_review"
                                : "school"}
                          </span>
                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider ${user.isActivated
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {user.isActivated ? "Active" : "Pending Activation"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Pending Activation Quick Action */}
                          {!user.isActivated && (
                            <button
                              onClick={() => handleQuickActivate(user.id, user.name)}
                              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-on-primary py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer font-semibold"
                              title="Approve & Activate Account"
                            >
                              <span className="material-symbols-outlined text-[14px]">check_circle</span>
                              Activate
                            </button>
                          )}

                          {/* Edit Button */}
                          <button
                            onClick={() => handleStartEdit(user)}
                            className="w-8 h-8 rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center cursor-pointer"
                            title="Edit Account Details"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>

                          {/* Delete Button */}
                          {user.role !== "ADMIN" && (
                            <button
                              onClick={() => setDeletingUser(user)}
                              className="w-8 h-8 rounded-lg hover:bg-error-container/10 text-on-surface-variant hover:text-error transition-colors flex items-center justify-center cursor-pointer"
                              title="Delete Account"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full border border-outline-variant/20 overflow-hidden shadow-2xl animate-scale-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-surface-container-low flex items-center justify-between">
              <h3 className="font-headline text-xl font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">person_add</span>
                Create User Account
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-on-surface-variant hover:text-primary cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSubmit}>
              <div className="p-6 space-y-4">
                {createError && (
                  <div className="bg-error-container/20 border border-error/20 text-error p-3 rounded-lg text-xs font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    {createError}
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant font-label">Full Name</label>
                  <input
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full border border-outline-variant/30 bg-surface-container-low text-on-surface p-2.5 rounded-lg outline-none text-sm focus:border-primary/50"
                    placeholder="e.g. Dr. Jane Doe"
                    type="text"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant font-label">Email Address</label>
                  <input
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full border border-outline-variant/30 bg-surface-container-low text-on-surface p-2.5 rounded-lg outline-none text-sm focus:border-primary/50"
                    placeholder="e.g. janedoe@university.ac.id"
                    type="email"
                    required
                  />
                </div>

                {/* NIP */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant font-label">NIP (Employee ID)</label>
                  <input
                    value={createForm.nip}
                    onChange={(e) => setCreateForm({ ...createForm, nip: e.target.value })}
                    className="w-full border border-outline-variant/30 bg-surface-container-low text-on-surface p-2.5 rounded-lg outline-none text-sm focus:border-primary/50"
                    placeholder="e.g. 198804022015041002"
                    type="text"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant font-label">Password</label>
                  <input
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    className="w-full border border-outline-variant/30 bg-surface-container-low text-on-surface p-2.5 rounded-lg outline-none text-sm focus:border-primary/50"
                    placeholder="Set temporary secure password"
                    type="password"
                    required
                  />
                </div>

                {/* Grid for Role & Activation Status */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Role */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface-variant font-label">System Role</label>
                    <select
                      value={createForm.role}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          role: e.target.value as "ADMIN" | "RESEARCHER" | "REVIEWER",
                        })
                      }
                      className="w-full border border-outline-variant/30 bg-surface-container-low text-on-surface p-2.5 rounded-lg outline-none text-sm focus:border-primary/50 cursor-pointer"
                    >
                      <option value="RESEARCHER">Researcher</option>
                      <option value="REVIEWER">Reviewer</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>

                  {/* Activation Status */}
                  <div className="space-y-1 flex flex-col justify-end pb-1.5">
                    <div className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        id="create_active"
                        checked={createForm.isActivated}
                        onChange={(e) => setCreateForm({ ...createForm, isActivated: e.target.checked })}
                        className="w-4 h-4 text-primary accent-primary rounded cursor-pointer"
                        type="checkbox"
                      />
                      <label htmlFor="create_active" className="text-xs font-semibold text-on-surface-variant cursor-pointer">
                        Auto-Activate
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-surface-container-low border-t border-surface-container flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/20 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="gradient-primary text-on-primary px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {createSubmitting ? "Creating..." : "Save Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER DRAWER / MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full border border-outline-variant/20 overflow-hidden shadow-2xl animate-scale-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-surface-container-low flex items-center justify-between">
              <h3 className="font-headline text-xl font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">edit</span>
                Edit User Account
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-on-surface-variant hover:text-primary cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit}>
              <div className="p-6 space-y-4">
                {editError && (
                  <div className="bg-error-container/20 border border-error/20 text-error p-3 rounded-lg text-xs font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    {editError}
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant font-label">Full Name</label>
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full border border-outline-variant/30 bg-surface-container-low text-on-surface p-2.5 rounded-lg outline-none text-sm focus:border-primary/50"
                    type="text"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant font-label">Email Address</label>
                  <input
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full border border-outline-variant/30 bg-surface-container-low text-on-surface p-2.5 rounded-lg outline-none text-sm focus:border-primary/50"
                    type="email"
                    required
                  />
                </div>

                {/* NIP */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant font-label">NIP (Employee ID)</label>
                  <input
                    value={editForm.nip}
                    onChange={(e) => setEditForm({ ...editForm, nip: e.target.value })}
                    className="w-full border border-outline-variant/30 bg-surface-container-low text-on-surface p-2.5 rounded-lg outline-none text-sm focus:border-primary/50"
                    type="text"
                    required
                  />
                </div>

                {/* Password (Optional) */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant font-label">
                    New Password <span className="text-on-surface-variant/40 font-normal">(Optional)</span>
                  </label>
                  <input
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    className="w-full border border-outline-variant/30 bg-surface-container-low text-on-surface p-2.5 rounded-lg outline-none text-sm focus:border-primary/50"
                    placeholder="Leave blank to keep current password"
                    type="password"
                  />
                </div>

                {/* Grid for Role & Activation Status */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Role (Disable changing admin's role here unless there are multiple admins) */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface-variant font-label">System Role</label>
                    <select
                      value={editForm.role}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          role: e.target.value as "ADMIN" | "RESEARCHER" | "REVIEWER",
                        })
                      }
                      className="w-full border border-outline-variant/30 bg-surface-container-low text-on-surface p-2.5 rounded-lg outline-none text-sm focus:border-primary/50 cursor-pointer"
                      disabled={editingUser.role === "ADMIN"}
                    >
                      <option value="RESEARCHER">Researcher</option>
                      <option value="REVIEWER">Reviewer</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>

                  {/* Activation Status */}
                  <div className="space-y-1 flex flex-col justify-end pb-1.5">
                    <div className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        id="edit_active"
                        checked={editForm.isActivated}
                        onChange={(e) => setEditForm({ ...editForm, isActivated: e.target.checked })}
                        className="w-4 h-4 text-primary accent-primary rounded cursor-pointer"
                        type="checkbox"
                        disabled={editingUser.role === "ADMIN"} // Can't deactivate primary admin
                      />
                      <label htmlFor="edit_active" className="text-xs font-semibold text-on-surface-variant cursor-pointer">
                        Account Activated
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-surface-container-low border-t border-surface-container flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/20 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="gradient-primary text-on-primary px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {editSubmitting ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-xl max-w-sm w-full border border-outline-variant/20 overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 text-center space-y-4">
              {/* Warning Icon */}
              <div className="w-12 h-12 rounded-full bg-error-container/20 text-error flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[30px]">warning</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-headline text-lg font-bold text-primary">Delete User Account?</h4>
                <p className="text-sm text-on-surface-variant font-body">
                  Are you sure you want to permanently delete the account for <strong className="text-on-surface">{deletingUser.name}</strong>? This action is irreversible.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-surface-container-low border-t border-surface-container flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/20 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                No, Keep it
              </button>
              <button
                onClick={handleDeleteSubmit}
                disabled={deleteSubmitting}
                className="bg-error hover:bg-error/95 text-on-error px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {deleteSubmitting ? "Deleting..." : "Yes, Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
