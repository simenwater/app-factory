"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useStore } from "@/store/useStore";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";

/**
 * @description 日历调度页面
 */
export default function CalendarPage() {
  const jobs = useStore((s) => s.jobs);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const jobsByDate = useMemo(() => {
    const map = new Map<string, typeof jobs>();
    jobs.forEach((job) => {
      const key = job.scheduledDate;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(job);
    });
    return map;
  }, [jobs]);

  const selectedDayJobs = selectedDate
    ? jobsByDate.get(format(selectedDate, "yyyy-MM-dd")) ?? []
    : [];

  return (
    <div className="px-4 pt-6">
      <h1 className="mb-6 text-2xl font-bold">Calendar</h1>

      {/* Month Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface shadow-sm dark:bg-surface-dark"
        >
          <ChevronLeft size={18} />
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface shadow-sm dark:bg-surface-dark"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-text-muted dark:text-text-muted-dark">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="mb-6 grid grid-cols-7 gap-px rounded-xl bg-border/50 overflow-hidden dark:bg-border-dark/50">
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayJobs = jobsByDate.get(dateKey) ?? [];
          const inMonth = isSameMonth(day, currentDate);
          const selected = selectedDate && isSameDay(day, selectedDate);
          const today = isToday(day);

          return (
            <button
              key={dateKey}
              onClick={() => setSelectedDate(day)}
              className={`relative flex min-h-[52px] flex-col items-center justify-start bg-surface py-1.5 transition-colors dark:bg-surface-dark ${
                !inMonth ? "opacity-30" : ""
              } ${selected ? "bg-primary/10 dark:bg-primary/20" : ""}`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                  today
                    ? "bg-primary font-bold text-white"
                    : selected
                      ? "font-semibold text-primary"
                      : ""
                }`}
              >
                {format(day, "d")}
              </span>
              {dayJobs.length > 0 && (
                <div className="mt-0.5 flex gap-0.5">
                  {dayJobs.slice(0, 3).map((j) => (
                    <div
                      key={j.id}
                      className={`h-1.5 w-1.5 rounded-full ${
                        j.status === "completed"
                          ? "bg-green-500"
                          : j.status === "in_progress"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                      }`}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Jobs */}
      {selectedDate && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
            {format(selectedDate, "EEEE, MMMM d")}
          </h3>
          {selectedDayJobs.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No Jobs"
              description="Nothing scheduled for this day."
              actionLabel="Create Job"
              actionHref="/jobs/new"
            />
          ) : (
            <div className="space-y-3">
              {selectedDayJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="block rounded-xl bg-surface p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <h4 className="font-medium">{job.title}</h4>
                    <StatusBadge status={job.status} />
                  </div>
                  <p className="text-sm text-text-muted dark:text-text-muted-dark">
                    {job.scheduledTime} &middot; {job.customer.name} &middot;{" "}
                    {job.estimatedDuration}min
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
