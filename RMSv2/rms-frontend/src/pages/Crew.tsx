import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
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
import { api, CrewMember, Organization } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Crew() {
  const [searchQuery, setSearchQuery] = useState("");
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    phone: "",
    organizationId: "",
  });

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

    Promise.all([api.getCrew(), loadOrganizations()])
      .then(([crewData, orgData]) => {
        if (isMounted) {
          setCrewMembers(crewData);
          setOrganizations(orgData);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message ?? "Failed to load crew");
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

  const filteredCrew = useMemo(() => {
    if (!searchQuery) return crewMembers;
    const query = searchQuery.toLowerCase();
    return crewMembers.filter((member) =>
      [member.firstName, member.lastName, member.role, member.email]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(query))
    );
  }, [crewMembers, searchQuery]);

  const handleCreate = async () => {
    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      role: formData.role.trim(),
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      organizationId: formData.organizationId ? Number(formData.organizationId) : undefined,
    };

    if (typeof api.createCrew !== "function") {
      return;
    }
    const created = await api.createCrew(payload);
    setCrewMembers((prev) => [created, ...prev]);
    setFormData({ firstName: "", lastName: "", role: "", email: "", phone: "", organizationId: "" });
    setIsDialogOpen(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Crew Members</h1>
        <p className="text-muted-foreground">Manage your team and their roles</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search crew..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Crew Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Crew Member</DialogTitle>
              <DialogDescription>Create a new crew profile.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crew-first-name">First Name</Label>
                  <Input
                    id="crew-first-name"
                    value={formData.firstName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crew-last-name">Last Name</Label>
                  <Input
                    id="crew-last-name"
                    value={formData.lastName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="crew-role">Role</Label>
                <Input
                  id="crew-role"
                  value={formData.role}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crew-email">Email</Label>
                  <Input
                    id="crew-email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crew-phone">Phone</Label>
                  <Input
                    id="crew-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="crew-org">Organization</Label>
                <Select
                  value={formData.organizationId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, organizationId: value }))}
                >
                  <SelectTrigger id="crew-org">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={String(org.id)}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!formData.firstName || !formData.lastName || !formData.role}
                >
                  Save Crew Member
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading crew...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-card rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">First Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Last Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Role</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Email</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Phone</th>
            </tr>
          </thead>
          <tbody>
            {filteredCrew.map((member) => (
              <tr
                key={member.id}
                className="border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-sm">{member.firstName}</td>
                <td className="px-6 py-4 text-sm">{member.lastName}</td>
                <td className="px-6 py-4 text-sm font-medium">{member.role}</td>
                <td className="px-6 py-4 text-sm">{member.email ?? ""}</td>
                <td className="px-6 py-4 text-sm">{member.phone ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
