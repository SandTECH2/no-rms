import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api, Organization } from "@/lib/api";

export default function Organizations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orgName, setOrgName] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadOrganizations = async () => {
      if (typeof api.getOrganizations === "function") {
        return api.getOrganizations();
      }
      const response = await fetch("/api/organizations");
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      return response.json() as Promise<Organization[]>;
    };

    loadOrganizations()
      .then((data) => {
        if (isMounted) {
          setOrganizations(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message ?? "Failed to load organizations");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredOrganizations = useMemo(() => {
    if (!searchQuery) return organizations;
    const query = searchQuery.toLowerCase();
    return organizations.filter((org) => org.name.toLowerCase().includes(query));
  }, [organizations, searchQuery]);

  const handleCreate = async () => {
    if (typeof api.createOrganization !== "function") {
      return;
    }
    const created = await api.createOrganization({ name: orgName.trim() });
    setOrganizations((prev) => [created, ...prev]);
    setOrgName("");
    setIsDialogOpen(false);
  };

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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Organization</DialogTitle>
              <DialogDescription>Add a new tenant organization.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input
                  id="org-name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={!orgName.trim()}>
                  Save Organization
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading organizations...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid gap-6">
        {filteredOrganizations.map((org) => (
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
