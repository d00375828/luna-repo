import { FormEvent } from "react";

import type { DevRepo } from "@/data/dev/dashboardData";
import type { TaskFormState } from "@/hooks/useDashboardTasks";

type TaskComposerProps = {
  form: TaskFormState;
  repos: DevRepo[];
  onChange: (updates: Partial<TaskFormState>) => void;
  onSubmit: () => void;
};

export function TaskComposer({
  form,
  repos,
  onChange,
  onSubmit,
}: TaskComposerProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={handleSubmit}
    >
      <TextField
        label="Task title"
        placeholder="Describe the next slice..."
        value={form.title}
        onChange={(value) => onChange({ title: value })}
        required
      />

      <TextField
        label="Owner"
        value={form.owner}
        onChange={(value) => onChange({ owner: value })}
      />

      <SelectField
        label="Repo"
        value={form.repoId}
        onChange={(value) => onChange({ repoId: value })}
        options={repos.map((repo) => ({ label: repo.name, value: repo.id }))}
      />

      <SelectField
        label="Status"
        value={form.status}
        onChange={(value) =>
          onChange({ status: value as TaskFormState["status"] })
        }
        options={[
          { label: "Backlog", value: "backlog" },
          { label: "In Progress", value: "in-progress" },
          { label: "In Review", value: "review" },
          { label: "Done", value: "done" },
        ]}
      />

      <SelectField
        label="Priority"
        value={form.priority}
        onChange={(value) =>
          onChange({ priority: value as TaskFormState["priority"] })
        }
        options={[
          { label: "Low", value: "low" },
          { label: "Medium", value: "medium" },
          { label: "High", value: "high" },
        ]}
      />

      <button
        type="submit"
        className="rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white"
      >
        Add task
      </button>
    </form>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
};

function TextField({
  label,
  value,
  onChange,
  placeholder,
  required,
}: TextFieldProps) {
  return (
    <label className="block space-y-2 text-sm font-medium">
      <span className="text-xs text-slate-500">{label}</span>
      <input
        className="rounded-lg border px-3 py-2 text-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
};

function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <label className="block space-y-2 text-sm font-medium">
      <span className="text-xs text-slate-500">{label}</span>
      <select
        className="rounded-lg border px-3 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
