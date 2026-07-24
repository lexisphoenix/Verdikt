import { prisma } from "@/lib/db";
import { Shell, Card, Stat, Badge, Button } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [jobs, agents, completed] = await Promise.all([
    prisma.verificationJob.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { verdict: true, clientAgent: true, providerAgent: true },
    }),
    prisma.agent.count(),
    prisma.verificationJob.count({ where: { status: "completed" } }),
  ]);

  const passRate =
    jobs.filter((j) => j.verdict?.pass).length / Math.max(jobs.length, 1);

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-1 text-zinc-400">Verification jobs and audit status</p>
          </div>
          <Button href="/jobs/new">New verification</Button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Card><Stat label="Agents" value={agents} /></Card>
          <Card><Stat label="Jobs" value={jobs.length} hint="Recent 10 shown" /></Card>
          <Card><Stat label="Completed" value={completed} /></Card>
          <Card>
            <Stat
              label="Pass rate"
              value={`${Math.round(passRate * 100)}%`}
              hint="Recent sample"
            />
          </Card>
        </div>

        <Card className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Recent jobs</h2>
          {jobs.length === 0 ? (
            <p className="text-zinc-400">No jobs yet. Create your first verification.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-zinc-500">
                  <tr>
                    <th className="pb-3 pr-4">Title</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4">Score</th>
                    <th className="pb-3 pr-4">Client</th>
                    <th className="pb-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-t border-white/5">
                      <td className="py-3 pr-4">
                        <a href={`/jobs/${job.id}`} className="font-medium hover:text-indigo-300">
                          {job.title}
                        </a>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge
                          tone={
                            job.status === "completed"
                              ? "success"
                              : job.status === "failed"
                                ? "danger"
                                : "info"
                          }
                        >
                          {job.status}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4">
                        {job.verdict ? `${job.verdict.score}/100` : "—"}
                      </td>
                      <td className="py-3 pr-4 text-zinc-400">
                        {job.clientAgent.displayName}
                      </td>
                      <td className="py-3 text-zinc-500">
                        {new Date(job.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </Shell>
  );
}
