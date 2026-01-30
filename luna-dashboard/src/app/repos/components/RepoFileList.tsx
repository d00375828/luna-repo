import { Card } from "@/components/ui/Card";
import type { DevRepo } from "@/data/dev/dashboardData";

type RepoFileListProps = {
  repo: DevRepo;
};

export function RepoFileList({ repo }: RepoFileListProps) {
  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Important files
      </h2>
      <ul className="space-y-3 text-sm">
        {repo.files.map((file) => (
          <li
            key={file.path}
            className="rounded-xl border border-dashed bg-slate-50/70 px-4 py-3"
          >
            <p className="font-mono text-xs text-slate-500">{file.path}</p>
            <p className="text-slate-700">{file.summary}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
