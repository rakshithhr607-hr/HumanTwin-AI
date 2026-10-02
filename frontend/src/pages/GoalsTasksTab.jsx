import React from "react";
import {
  CheckCircle,
  Clock,
  Target,
  AlertTriangle,
  Calendar,
  Circle,
} from "lucide-react";

export default function GoalsTasksTab({ overview }) {
  const goals = overview?.goals || [];
  const tasks = overview?.tasks || [];

  const completedTasks = tasks.filter(
    (task) =>
      task.status?.toLowerCase() === "completed" ||
      task.status?.toLowerCase() === "done"
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority?.toLowerCase() === "high"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Goals & Tasks
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your goals, priorities, deadlines, and current workload.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active Goals</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {goals.length}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Tasks Completed</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {completedTasks}/{tasks.length}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">High Priority</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {highPriorityTasks}
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Goals */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-2.5">
            <Target className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Current Goals
            </h2>
            <p className="text-sm text-slate-500">
              Track progress toward your personal objectives.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {goals.length === 0 ? (
            <p className="text-sm text-slate-500">
              No goals available yet.
            </p>
          ) : (
            goals.map((goal, index) => {
              const progress = Math.min(
                100,
                Math.max(0, Number(goal.progress_pct) || 0)
              );

              return (
                <div
                  key={goal.id || index}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">
                        {goal.title}
                      </h3>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>{goal.category}</span>

                        {goal.priority && (
                          <span className="rounded-full bg-slate-200 px-2 py-1">
                            {goal.priority} Priority
                          </span>
                        )}

                        {goal.target_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {goal.target_date}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-sm font-semibold text-blue-600">
                      {progress}%
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {goal.details && (
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {goal.details}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Tasks */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-50 p-2.5">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Current Tasks
            </h2>
            <p className="text-sm text-slate-500">
              Review deadlines, progress, and task priorities.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-sm text-slate-500">
              No tasks available yet.
            </p>
          ) : (
            tasks.map((task, index) => {
              const isCompleted =
                task.status?.toLowerCase() === "completed" ||
                task.status?.toLowerCase() === "done";

              const isHigh =
                task.priority?.toLowerCase() === "high";

              return (
                <div
                  key={task.id || index}
                  className="flex flex-col gap-4 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-300" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-slate-900">
                      {task.title}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      {task.subject && <span>{task.subject}</span>}

                      {task.deadline && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {task.deadline}
                        </span>
                      )}

                      {task.current_progress_pct !== undefined && (
                        <span>
                          {task.current_progress_pct}% complete
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isHigh && (
                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                        High
                      </span>
                    )}

                    {task.status && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {task.status}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}