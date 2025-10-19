import { StatusBadge } from "@/components/StatusBadge";

const activeProjects = [
  {
    id: "12345",
    name: "Summer Festival 2024",
    startDate: "2024-06-15",
    returnDate: "2024-06-20",
    projectManager: "John Doe",
    status: "confirmed" as const,
  },
];

export default function PackZone2() {
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">RPZ Display 2</h1>
        <p className="text-lg text-muted-foreground">Active project loadouts</p>
      </div>

      <div className="grid gap-6">
        {activeProjects.map((project) => (
          <div key={project.id} className="bg-card rounded-lg border p-8 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{project.name}</h2>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-lg text-muted-foreground font-mono">#{project.id}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                <p className="text-lg font-semibold">{new Date(project.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Return Date</p>
                <p className="text-lg font-semibold">{new Date(project.returnDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Project Manager</p>
                <p className="text-lg font-semibold">{project.projectManager}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
