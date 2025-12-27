import { useState } from "react";
import { Plus, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const organizations = [
  {
    id: "ORG001",
    name: "Main Organization",
    users: 12,
    projects: 45,
  },
  {
    id: "ORG002",
    name: "Partner Network",
    users: 5,
    projects: 8,
  },
];

export default function Organizations() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Organizations</h1>
        <p className="text-muted-foreground">Manage multi-tenant environments and access</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Organization
        </Button>
      </div>

      <div className="grid gap-6">
        {organizations.map((org) => (
          <div key={org.id} className="bg-card rounded-lg border p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">{org.name}</h3>
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <span>{org.users} users</span>
                  <span>{org.projects} projects</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
