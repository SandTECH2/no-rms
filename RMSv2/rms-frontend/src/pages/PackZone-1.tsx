import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { api, Project } from "@/lib/api";

export default function PackZoneOne() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let isMounted = true;
    api.getProjects().then((data) => {
      if (isMounted) {
        setProjects(data.filter((project) => ["confirmed", "on-location"].includes(project.status)));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">RPZ Display 1</h1>
        <p className="text-lg text-muted-foreground">Active project loadouts</p>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-card rounded-lg border p-8 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{project.name}</h2>
                  <StatusBadge status={project.status as never} />
                </div>
                <p className="text-lg text-muted-foreground font-mono">#{project.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Type</p>
                <p className="text-lg font-semibold">{project.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Project Manager</p>
                <p className="text-lg font-semibold">{project.projectManager ?? ""}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Warehouse</p>
                <p className="text-lg font-semibold">{project.warehouse ?? ""}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
