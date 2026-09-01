"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  Award,
  Bookmark,
  Briefcase,
  ExternalLink,
  FileText,
  Phone,
  PlusCircle,
  Send,
  X,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import {
  addApplicationStage,
  createApplication,
  listApplications,
  updateApplication,
} from "@/lib/application-api";
import type {
  ApplicationStage,
  ApplicationStatus,
  JobApplication,
  StageStatus,
} from "@/lib/application-types";
import {
  APPLIED_FROM_OPTIONS,
  APPLICATION_STATUSES,
  STAGE_STATUS_LABELS,
  STATUS_LABELS,
} from "@/lib/application-types";
import { listCvs } from "@/lib/cv-api";
import type { CvListItem } from "@/lib/cv-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const selectClassName =
  "rounded-md border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20";

const COLUMN_STYLES: Record<ApplicationStatus, string> = {
  SAVED: "border-t-[var(--muted)]",
  APPLIED: "border-t-[var(--accent)]",
  INTERVIEWING: "border-t-sky-600",
  REJECTED: "border-t-rose-600",
  OFFER: "border-t-emerald-600",
};

const STATUS_ICONS: Record<ApplicationStatus, LucideIcon> = {
  SAVED: Bookmark,
  APPLIED: Send,
  INTERVIEWING: Phone,
  REJECTED: XCircle,
  OFFER: Award,
};

const STATUS_ICON_CLASS: Record<ApplicationStatus, string> = {
  SAVED: "text-[var(--muted)]",
  APPLIED: "text-[var(--accent)]",
  INTERVIEWING: "text-sky-600",
  REJECTED: "text-rose-600",
  OFFER: "text-emerald-600",
};

const STAGE_BADGE_CLASS: Record<StageStatus, string> = {
  PENDING: "bg-sky-100 text-sky-800",
  PASSED: "bg-emerald-100 text-emerald-800",
  FAILED: "bg-rose-100 text-rose-800",
};

/** Failed round if any, else the next pending, else the latest logged stage. */
function currentStageIndex(stages: ApplicationStage[]) {
  const failed = stages.findIndex((stage) => stage.status === "FAILED");
  if (failed >= 0) return failed;
  const pending = stages.findIndex((stage) => stage.status === "PENDING");
  if (pending >= 0) return pending;
  return stages.length - 1;
}

function ApplicationStageHint({ application }: { application: JobApplication }) {
  const { stages, status } = application;
  if (stages.length > 0) {
    const index = currentStageIndex(stages);
    const stage = stages[index];
    if (!stage) return null;
    return (
      <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[var(--muted)]">
        <span
          className={cn(
            "flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-semibold",
            STAGE_BADGE_CLASS[stage.status]
          )}
        >
          {index + 1}
        </span>
        <span className="truncate">{stage.stageName}</span>
      </p>
    );
  }

  if (status === "INTERVIEWING") {
    return (
      <p className="mt-2 flex items-center gap-1.5 text-[11px] text-sky-700">
        <Phone className="h-3 w-3 shrink-0" aria-hidden />
        <span className="truncate">Got a callback</span>
      </p>
    );
  }

  return null;
}

function toDateInputValue(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return value.slice(0, 10);
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [cvs, setCvs] = useState<CvListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const selected = useMemo(
    () => applications.find((app) => app.id === selectedId) ?? null,
    [applications, selectedId]
  );

  async function refresh() {
    const [apps, cvList] = await Promise.all([listApplications(), listCvs()]);
    setApplications(apps);
    setCvs(cvList);
  }

  useEffect(() => {
    void (async () => {
      try {
        await refresh();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load applications"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function upsertLocal(updated: JobApplication) {
    setApplications((prev) => {
      const exists = prev.some((app) => app.id === updated.id);
      if (!exists) return [updated, ...prev];
      return prev.map((app) => (app.id === updated.id ? updated : app));
    });
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
            Job Applications
          </h2>
          <p className="mt-1 text-[var(--muted)]">
            Track status, interview stages, and feedback in one board.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <PlusCircle className="h-4 w-4" />
          New application
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--muted)]">Loading…</p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {!loading && applications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--paper)] px-6 py-16 text-center">
          <Briefcase className="mx-auto mb-3 h-8 w-8 text-[var(--muted)]" />
          <p className="text-sm text-[var(--muted)]">
            No applications yet. Add a role to start tracking.
          </p>
          <Button className="mt-4" onClick={() => setCreating(true)}>
            <PlusCircle className="h-4 w-4" />
            Add your first application
          </Button>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-5">
        {APPLICATION_STATUSES.map((status) => {
          const columnApps = applications.filter((app) => app.status === status);
          const StatusIcon = STATUS_ICONS[status];
          return (
            <section
              key={status}
              className={cn(
                "min-h-[280px] rounded-xl border border-[var(--line)] border-t-4 bg-[var(--paper)]/80",
                COLUMN_STYLES[status]
              )}
            >
              <header className="flex items-center justify-between border-b border-[var(--line)] px-3 py-3">
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-[var(--ink)]">
                  <StatusIcon
                    className={cn("h-3.5 w-3.5 shrink-0", STATUS_ICON_CLASS[status])}
                    aria-hidden
                  />
                  {STATUS_LABELS[status]}
                </h3>
                <span className="rounded-md bg-[var(--mist)] px-2 py-0.5 text-xs text-[var(--muted)]">
                  {columnApps.length}
                </span>
              </header>
              <div className="space-y-2 p-2">
                {columnApps.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setSelectedId(app.id)}
                    className={cn(
                      "w-full rounded-lg border border-[var(--line)] bg-[var(--paper)] px-3 py-3 text-left transition hover:border-[var(--accent)]/40 hover:bg-[var(--mist)]/50",
                      selectedId === app.id && "border-[var(--accent)] ring-2 ring-[var(--accent)]/15"
                    )}
                  >
                    <p className="truncate text-sm font-medium text-[var(--ink)]">
                      {app.jobTitle}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
                      {app.companyName}
                    </p>
                    {app.appliedFrom ? (
                      <p className="mt-1 truncate text-[11px] text-[var(--muted)]">
                        via {app.appliedFrom}
                      </p>
                    ) : null}
                    {app.cv ? (
                      <p className="mt-2 flex items-center gap-1 truncate text-[11px] text-[var(--muted)]">
                        <FileText className="h-3 w-3 shrink-0" aria-hidden />
                        <span className="truncate">{app.cv.title}</span>
                      </p>
                    ) : null}
                    <ApplicationStageHint application={app} />
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {creating ? (
        <CreateApplicationModal
          cvs={cvs}
          onClose={() => setCreating(false)}
          onCreated={(app) => {
            upsertLocal(app);
            setCreating(false);
            setSelectedId(app.id);
          }}
          onError={setError}
        />
      ) : null}

      {selected ? (
        <ApplicationDetailDrawer
          application={selected}
          cvs={cvs}
          onClose={() => setSelectedId(null)}
          onUpdated={(app) => {
            upsertLocal(app);
            setSelectedId(app.id);
          }}
          onError={setError}
        />
      ) : null}
    </div>
  );
}

function CvSelect({
  cvs,
  name = "cvId",
  value,
  onChange,
  id = "cvId",
}: {
  cvs: CvListItem[];
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
}) {
  const controlled = onChange !== undefined;

  return (
    <label className="flex flex-col gap-1.5 text-sm" htmlFor={id}>
      <span className="font-medium text-[var(--ink)]">CV used</span>
      <select
        id={id}
        name={name}
        className={selectClassName}
        {...(controlled
          ? {
              value: value ?? "",
              onChange: (e: ChangeEvent<HTMLSelectElement>) =>
                onChange(e.target.value),
            }
          : { defaultValue: "" })}
      >
        <option value="">No CV linked</option>
        {cvs.map((cv) => (
          <option key={cv.id} value={cv.id}>
            {cv.title}
          </option>
        ))}
      </select>
      {cvs.length === 0 ? (
        <span className="text-xs text-[var(--muted)]">
          No CVs yet.{" "}
          <Link href="/dashboard/cvs/new" className="text-[var(--accent)] hover:underline">
            Create one
          </Link>{" "}
          to link it here.
        </span>
      ) : null}
    </label>
  );
}

function AppliedFromSelect({
  value,
  onChange,
  id = "appliedFrom",
}: {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}) {
  const known = new Set<string>(APPLIED_FROM_OPTIONS);
  const derivedPreset = !value
    ? ""
    : known.has(value)
      ? value
      : "Other";
  const [preset, setPreset] = useState(derivedPreset);
  const [customValue, setCustomValue] = useState(
    derivedPreset === "Other" ? value : ""
  );

  useEffect(() => {
    const nextPreset = !value ? "" : known.has(value) ? value : "Other";
    setPreset(nextPreset);
    setCustomValue(nextPreset === "Other" ? value : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync from parent value
  }, [value]);

  return (
    <div className="space-y-2">
      <label className="flex flex-col gap-1.5 text-sm" htmlFor={id}>
        <span className="font-medium text-[var(--ink)]">Applied from</span>
        <select
          id={id}
          className={selectClassName}
          value={preset}
          onChange={(e) => {
            const next = e.target.value;
            setPreset(next);
            if (next === "Other") {
              onChange(customValue.trim());
              return;
            }
            setCustomValue("");
            onChange(next);
          }}
        >
          <option value="">Not specified</option>
          {APPLIED_FROM_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      {preset === "Other" ? (
        <Input
          label="Custom source"
          value={customValue}
          onChange={(e) => {
            setCustomValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder="e.g. Friend intro, AngelList…"
        />
      ) : null}
    </div>
  );
}

function CreateApplicationModal({
  cvs,
  onClose,
  onCreated,
  onError,
}: {
  cvs: CvListItem[];
  onClose: () => void;
  onCreated: (app: JobApplication) => void;
  onError: (message: string | null) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [appliedFrom, setAppliedFrom] = useState("");
  const [companyInfo, setCompanyInfo] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    onError(null);
    try {
      const cvId = String(form.get("cvId") ?? "");
      const app = await createApplication({
        companyName: String(form.get("companyName") ?? ""),
        companyInfo: companyInfo.trim() || null,
        jobTitle: String(form.get("jobTitle") ?? ""),
        jobUrl: String(form.get("jobUrl") ?? "") || null,
        appliedFrom: appliedFrom.trim() || null,
        cvId: cvId || null,
        status: "SAVED",
      });
      onCreated(app);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ink)]/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-xl">
              New application
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Save a role to start tracking.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-[var(--muted)] hover:bg-[var(--mist)]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form className="space-y-3" onSubmit={(e) => void handleSubmit(e)}>
          <Input name="companyName" label="Company" required />
          <Textarea
            label="Company info"
            value={companyInfo}
            onChange={(e) => setCompanyInfo(e.target.value)}
            placeholder="Product focus, team size, location, culture notes…"
          />
          <Input name="jobTitle" label="Job title" required />
          <Input name="jobUrl" label="Job URL" type="url" placeholder="https://" />
          <AppliedFromSelect value={appliedFrom} onChange={setAppliedFrom} />
          <CvSelect cvs={cvs} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ApplicationDetailDrawer({
  application,
  cvs,
  onClose,
  onUpdated,
  onError,
}: {
  application: JobApplication;
  cvs: CvListItem[];
  onClose: () => void;
  onUpdated: (app: JobApplication) => void;
  onError: (message: string | null) => void;
}) {
  const [status, setStatus] = useState<ApplicationStatus>(application.status);
  const [cvId, setCvId] = useState(application.cvId ?? "");
  const [companyInfo, setCompanyInfo] = useState(application.companyInfo ?? "");
  const [appliedFrom, setAppliedFrom] = useState(application.appliedFrom ?? "");
  const [rejectionReason, setRejectionReason] = useState(
    application.rejectionReason ?? ""
  );
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [addingStage, setAddingStage] = useState(false);
  const StatusIcon = STATUS_ICONS[application.status];
  const DraftStatusIcon = STATUS_ICONS[status];

  useEffect(() => {
    setStatus(application.status);
    setCvId(application.cvId ?? "");
    setCompanyInfo(application.companyInfo ?? "");
    setAppliedFrom(application.appliedFrom ?? "");
    setRejectionReason(application.rejectionReason ?? "");
  }, [application]);

  const detailsDirty =
    companyInfo !== (application.companyInfo ?? "") ||
    appliedFrom !== (application.appliedFrom ?? "") ||
    cvId !== (application.cvId ?? "");

  async function handleStatusSave() {
    setSavingStatus(true);
    onError(null);
    try {
      const updated = await updateApplication(application.id, {
        status,
        rejectionReason:
          status === "REJECTED" ? rejectionReason.trim() || null : null,
      });
      onUpdated(updated);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleDetailsSave() {
    setSavingDetails(true);
    onError(null);
    try {
      const updated = await updateApplication(application.id, {
        companyInfo: companyInfo.trim() || null,
        appliedFrom: appliedFrom.trim() || null,
        cvId: cvId || null,
      });
      onUpdated(updated);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to update details");
    } finally {
      setSavingDetails(false);
    }
  }

  async function handleAddStage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setAddingStage(true);
    onError(null);
    try {
      const updated = await addApplicationStage(application.id, {
        stageName: String(form.get("stageName") ?? ""),
        stageDate: String(form.get("stageDate") ?? ""),
        status: String(form.get("status") ?? "PENDING") as StageStatus,
        comments: String(form.get("comments") ?? "") || null,
      });
      onUpdated(updated);
      event.currentTarget.reset();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to add stage");
    } finally {
      setAddingStage(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[var(--ink)]/35 backdrop-blur-sm">
      <button
        type="button"
        className="h-full flex-1 cursor-default"
        aria-label="Close drawer"
        onClick={onClose}
      />
      <aside className="flex h-full w-full max-w-lg flex-col border-l border-[var(--line)] bg-[var(--paper)] shadow-2xl animate-rise">
        <header className="flex items-start justify-between gap-3 border-b border-[var(--line)] px-5 py-4">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
              <StatusIcon
                className={cn("h-3.5 w-3.5", STATUS_ICON_CLASS[application.status])}
                aria-hidden
              />
              {STATUS_LABELS[application.status]}
            </p>
            <h3 className="mt-1 truncate font-[family-name:var(--font-display)] text-2xl tracking-tight">
              {application.jobTitle}
            </h3>
            <p className="truncate text-sm text-[var(--muted)]">
              {application.companyName}
            </p>
            {application.appliedFrom ? (
              <p className="mt-1 text-xs text-[var(--muted)]">
                Applied via {application.appliedFrom}
              </p>
            ) : null}
            {application.jobUrl ? (
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:underline"
              >
                View posting
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-[var(--muted)] hover:bg-[var(--mist)]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <section className="space-y-3">
            <h4 className="text-sm font-semibold">Company & source</h4>
            <Textarea
              label="Company info"
              value={companyInfo}
              onChange={(e) => setCompanyInfo(e.target.value)}
              placeholder="Product focus, team size, location, culture notes…"
            />
            <AppliedFromSelect
              id="drawer-appliedFrom"
              value={appliedFrom}
              onChange={setAppliedFrom}
            />
            <CvSelect
              id="drawer-cvId"
              cvs={cvs}
              value={cvId}
              onChange={setCvId}
            />
            {application.cv ? (
              <Link
                href={`/dashboard/cvs/${application.cv.id}/edit`}
                className="inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:underline"
              >
                <FileText className="h-3.5 w-3.5" aria-hidden />
                Open “{application.cv.title}”
              </Link>
            ) : null}
            <Button
              variant="secondary"
              onClick={() => void handleDetailsSave()}
              disabled={savingDetails || !detailsDirty}
            >
              {savingDetails ? "Saving…" : "Save details"}
            </Button>
          </section>

          <section className="space-y-3">
            <h4 className="text-sm font-semibold">Status</h4>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-[var(--ink)]">Current status</span>
              <div className="flex items-center gap-2">
                <DraftStatusIcon
                  className={cn("h-4 w-4 shrink-0", STATUS_ICON_CLASS[status])}
                  aria-hidden
                />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                  className={cn(selectClassName, "flex-1")}
                >
                  {APPLICATION_STATUSES.map((value) => (
                    <option key={value} value={value}>
                      {STATUS_LABELS[value]}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            {status === "REJECTED" ? (
              <Textarea
                label="Rejection reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Role filled internally, insufficient backend experience…"
              />
            ) : null}

            {application.status === "REJECTED" && application.rejectionReason ? (
              <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800">
                Logged reason: {application.rejectionReason}
              </p>
            ) : null}

            <Button
              onClick={() => void handleStatusSave()}
              disabled={
                savingStatus ||
                (status === "REJECTED" && !rejectionReason.trim())
              }
            >
              {savingStatus ? "Saving…" : "Update status"}
            </Button>
          </section>

          <section className="space-y-3">
            <h4 className="text-sm font-semibold">Timeline stages</h4>
            {application.stages.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">
                {application.status === "INTERVIEWING"
                  ? "Got a callback — add the first round when you have a date."
                  : "No stages yet. Add an HR screen, tech interview, or assessment."}
              </p>
            ) : (
              <ol className="space-y-3">
                {application.stages.map((stage, index) => (
                  <li
                    key={stage.id}
                    className="rounded-lg border border-[var(--line)] bg-[var(--mist)]/40 px-3 py-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="flex items-center gap-2 text-sm font-medium">
                          <span
                            className={cn(
                              "flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1 text-[11px] font-semibold",
                              STAGE_BADGE_CLASS[stage.status]
                            )}
                          >
                            {index + 1}
                          </span>
                          {stage.stageName}
                        </p>
                        <p className="mt-0.5 ml-7 text-xs text-[var(--muted)]">
                          {new Date(stage.stageDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-xs font-medium",
                          stage.status === "PASSED" &&
                            "bg-emerald-100 text-emerald-800",
                          stage.status === "FAILED" &&
                            "bg-rose-100 text-rose-800",
                          stage.status === "PENDING" &&
                            "bg-[var(--mist)] text-[var(--muted)]"
                        )}
                      >
                        {STAGE_STATUS_LABELS[stage.status]}
                      </span>
                    </div>
                    {stage.comments ? (
                      <p className="mt-2 text-sm text-[var(--ink-soft)]">
                        {stage.comments}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ol>
            )}

            <form
              className="space-y-3 rounded-lg border border-dashed border-[var(--line)] p-3"
              onSubmit={(e) => void handleAddStage(e)}
            >
              <p className="text-sm font-medium">Add stage</p>
              <Input name="stageName" label="Stage name" required placeholder="Technical interview" />
              <Input
                name="stageDate"
                label="Stage date"
                type="date"
                required
                defaultValue={toDateInputValue()}
              />
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-[var(--ink)]">Outcome</span>
                <select
                  name="status"
                  defaultValue="PENDING"
                  className={selectClassName}
                >
                  <option value="PENDING">Pending</option>
                  <option value="PASSED">Passed</option>
                  <option value="FAILED">Failed</option>
                </select>
              </label>
              <Textarea
                name="comments"
                label="Notes / interview comments"
                placeholder="Feedback from interviewer, prep notes…"
              />
              <Button type="submit" variant="secondary" disabled={addingStage}>
                {addingStage ? "Adding…" : "Append stage"}
              </Button>
            </form>
          </section>
        </div>
      </aside>
    </div>
  );
}
