"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ResumeCard from "@/components/resumes/cards";
import { useGetResumes } from "../lib/queries";
import { useReorderResumes } from "../lib/mutations";
import { LayoutGrid, List, FilePlus, Upload, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const RESUMES_VIEW_KEY = "resumes-view";
const RECENT_IDS_KEY = "resumes-recent-ids";
const RECENT_MAX = 5;
const PAGE_SIZE = 12;
type ViewMode = "grid" | "list";
type SortOption = "name-a-z" | "name-z-a" | "date-new" | "date-old" | "custom";

const SKELETON_COUNT = 6;

function ResumeCardSkeleton() {
  return (
    <div className="flex min-h-[140px] w-full flex-col rounded-lg border border-gray-200 p-4">
      <div className="flex flex-row items-start gap-3">
        <Skeleton className="size-10 shrink-0 rounded-md" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-1/3" />
      </div>
      <div className="mt-auto flex justify-end pt-3">
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

function EmptyStateIllustration() {
  return (
    <svg
      className="mx-auto size-24 text-gray-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function sortResumes(resumes: Resume[], sortBy: SortOption): Resume[] {
  const bySort = (a: Resume, b: Resume): number => {
    switch (sortBy) {
      case "name-a-z":
        return (a.name ?? "").localeCompare(b.name ?? "", undefined, {
          sensitivity: "base",
        });
      case "name-z-a":
        return (b.name ?? "").localeCompare(a.name ?? "", undefined, {
          sensitivity: "base",
        });
      case "date-new":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "date-old":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "custom":
        return (a.position ?? 0) - (b.position ?? 0) ||
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  };
  const pinned = resumes.filter((r) => r.pinned);
  const unpinned = resumes.filter((r) => !r.pinned);
  return [
    ...pinned.sort(bySort),
    ...unpinned.sort(bySort),
  ];
}

export default function Resumes() {
  const router = useRouter();
  const { data: resumes, isLoading, isError } = useGetResumes();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("date-new");
  const [searchQuery, setSearchQuery] = useState("");
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const stored = localStorage.getItem(RESUMES_VIEW_KEY);
    if (stored === "grid" || stored === "list") {
      setViewMode(stored);
    }
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_IDS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setRecentIds(parsed.slice(0, RECENT_MAX));
        }
      }
    } catch {
      // ignore
    }
  }, [resumes]);

  const handleSetViewMode = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(RESUMES_VIEW_KEY, mode);
  }, []);

  const handleUpload = () => router.push("/app/resumes/upload");
  const handleCreateNew = () => router.push("/app/resumes/new");

  const allTags = Array.from(
    new Set(
      (resumes ?? []).flatMap((r) => r.tags ?? [])
    )
  ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const filteredAndSortedResumes = resumes
    ? sortResumes(
        resumes
          .filter((r) =>
            (r.name ?? "")
              .toLowerCase()
              .includes(searchQuery.trim().toLowerCase())
          )
          .filter((r) => {
            const resumeTags = r.tags ?? [];
            return selectedTags.every((t) => resumeTags.includes(t));
          }),
        sortBy
      )
    : [];

  const { mutate: reorderResumes, isPending: isReordering } = useReorderResumes();

  const fullOrderedIds =
    sortBy === "custom" && resumes
      ? sortResumes(
          resumes.filter((r) =>
            (r.name ?? "")
              .toLowerCase()
              .includes(searchQuery.trim().toLowerCase())
          ).filter((r) => {
            const resumeTags = r.tags ?? [];
            return selectedTags.every((t) => resumeTags.includes(t));
          }),
          "custom"
        ).map((r) => r.id)
      : [];

  const handleReorder = useCallback(
    (orderedIds: number[]) => {
      reorderResumes(orderedIds);
    },
    [reorderResumes]
  );

  const reorderProps =
    sortBy === "custom" && fullOrderedIds.length > 0
      ? {
          fullOrderedIds,
          onReorder: handleReorder,
          isReordering,
        }
      : undefined;

  const favoriteResumes = filteredAndSortedResumes.filter((r) => r.pinned);
  const nonPinnedResumes = filteredAndSortedResumes.filter((r) => !r.pinned);

  const recentResumes = recentIds
    .map((id) => nonPinnedResumes.find((r) => String(r.id) === id))
    .filter((r): r is Resume => Boolean(r))
    .slice(0, RECENT_MAX);

  const otherResumes =
    recentResumes.length > 0
      ? nonPinnedResumes.filter(
          (r) => !recentResumes.some((ro) => ro.id === r.id)
        )
      : nonPinnedResumes;

  const displayedOtherResumes = otherResumes.slice(0, visibleCount);
  const hasMore = otherResumes.length > visibleCount;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, selectedTags.length, sortBy]);

  if (isError) {
    return (
      <div className="mt-4 text-center text-red-400">
        An error occurred while loading your resumes
      </div>
    );
  }

  if ((!resumes && !isLoading) || resumes?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
        <EmptyStateIllustration />
        <h2 className="mt-6 text-xl font-semibold text-gray-800">
          No resumes yet
        </h2>
        <p className="mt-2 max-w-sm text-gray-500">
          Upload an existing resume or create one from scratch to get started.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={handleUpload}
            className="rounded-none bg-blue-800 font-bold text-white hover:bg-blue-900"
          >
            <Upload className="mr-2 size-4" aria-hidden />
            Upload resume
          </Button>
          <Button
            variant="outline"
            onClick={handleCreateNew}
            className="rounded-none border-blue-800 font-bold text-blue-800 hover:bg-blue-50"
          >
            <FilePlus className="mr-2 size-4" aria-hidden />
            Create new resume
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <ResumeCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-gray-600" aria-live="polite">
            {filteredAndSortedResumes.length} resume
            {filteredAndSortedResumes.length !== 1 ? "s" : ""}
          </p>
          <div className="relative">
            <Search
              className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400"
              aria-hidden
            />
            <Input
              type="search"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-[200px] pl-8 sm:w-[240px]"
              aria-label="Search resumes by name"
            />
          </div>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="h-9 w-[180px]" aria-label="Sort resumes">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-a-z">Name (A–Z)</SelectItem>
              <SelectItem value="name-z-a">Name (Z–A)</SelectItem>
              <SelectItem value="date-new">Date (Newest first)</SelectItem>
              <SelectItem value="date-old">Date (Oldest first)</SelectItem>
              <SelectItem value="custom">Custom order</SelectItem>
            </SelectContent>
          </Select>
          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-gray-500">Tags:</span>
              {allTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                    selectedTags.includes(tag)
                      ? "bg-blue-800 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                  aria-pressed={selectedTags.includes(tag)}
                  aria-label={`Filter by tag ${tag}`}
                >
                  {tag}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedTags([])}
                  className="text-xs text-gray-500 underline hover:text-gray-700"
                  aria-label="Clear tag filters"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
        <div
          className="flex rounded-md border border-gray-200 p-0.5"
          role="group"
          aria-label="View mode"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "size-8 rounded",
              viewMode === "grid" &&
                "bg-gray-100 text-blue-800 hover:bg-gray-100 hover:text-blue-800"
            )}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
            onClick={() => handleSetViewMode("grid")}
          >
            <LayoutGrid className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "size-8 rounded",
              viewMode === "list" &&
                "bg-gray-100 text-blue-800 hover:bg-gray-100 hover:text-blue-800"
            )}
            aria-label="List view"
            aria-pressed={viewMode === "list"}
            onClick={() => handleSetViewMode("list")}
          >
            <List className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
      {filteredAndSortedResumes.length === 0 ? (
        <p className="text-center text-gray-500">
          No resumes match your search. Try a different term or clear the search.
        </p>
      ) : (
        <div className="flex w-full flex-col gap-8">
          {favoriteResumes.length > 0 && (
            <section aria-labelledby="favorites-heading">
              <h2
                id="favorites-heading"
                className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500"
              >
                Favorites
              </h2>
              <div
                className={cn(
                  "w-full",
                  viewMode === "grid"
                    ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    : "flex flex-col gap-0"
                )}
              >
                {favoriteResumes.map((resume, i) => (
                  <ResumeCard
                    key={resume.id ?? i}
                    {...resume}
                    viewMode={viewMode}
                    reorderProps={reorderProps}
                  />
                ))}
              </div>
            </section>
          )}
          {recentResumes.length > 0 && (
            <section aria-labelledby="recent-heading">
              <h2
                id="recent-heading"
                className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500"
              >
                Recently opened
              </h2>
              <div
                className={cn(
                  "w-full",
                  viewMode === "grid"
                    ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    : "flex flex-col gap-0"
                )}
              >
                {recentResumes.map((resume, i) => (
                  <ResumeCard
                    key={resume.id ?? i}
                    {...resume}
                    viewMode={viewMode}
                    reorderProps={reorderProps}
                  />
                ))}
              </div>
            </section>
          )}
          <section aria-labelledby="all-heading">
            {(favoriteResumes.length > 0 || recentResumes.length > 0) && (
              <h2
                id="all-heading"
                className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500"
              >
                All resumes
              </h2>
            )}
            <div
              className={cn(
                "w-full",
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  : "flex flex-col gap-0"
              )}
            >
              {displayedOtherResumes.map((resume, i) => (
                <ResumeCard
                  key={resume.id ?? i}
                  {...resume}
                  viewMode={viewMode}
                  reorderProps={reorderProps}
                />
              ))}
            </div>
            {hasMore && (
              <div className="mt-4 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none border-blue-800 text-blue-800 hover:bg-blue-50"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  aria-label="Load more resumes"
                >
                  Load more
                </Button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
