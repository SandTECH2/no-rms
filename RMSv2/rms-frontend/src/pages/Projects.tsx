import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, Project } from "@/lib/api";

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    api
      .getProjects()
      .then((data) => {
        if (isMounted) {
          setProjects(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message ?? "Failed to load projects");
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

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    const query = searchQuery.toLowerCase();
    return projects.filter((project) =>
      [project.name, project.type, project.projectManager, project.warehouse]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(query))
    );
  }, [projects, searchQuery]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Projects</h1>
        <p className="text-muted-foreground">Manage your rental and sale projects</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Add a new rental or sale project to your system</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              <div className="space-y-4">
                <h3 className="font-semibold">General Information</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Production">Production</SelectItem>
                        <SelectItem value="Sale">Sale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manager">Project Manager</Label>
                    <Select
                      value={formData.projectManager}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, projectManager: value }))}
                    >
                      <SelectTrigger id="manager">
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent>
                        {crew.map((member) => (
                          <SelectItem
                            key={member.id}
                            value={`${member.firstName} ${member.lastName}`}
                          >
                            {member.firstName} {member.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="warehouse">Warehouse</Label>
                    <Select
                      value={formData.warehouseId}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, warehouseId: value }))}
                    >
                      <SelectTrigger id="warehouse">
                        <SelectValue placeholder="Select warehouse" />
                      </SelectTrigger>
                      <SelectContent>
                        {warehouses.map((warehouse) => (
                          <SelectItem key={warehouse.id} value={String(warehouse.id)}>
                            {warehouse.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer">Customer</Label>
                    <Select
                      value={formData.customerId}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, customerId: value }))}
                    >
                      <SelectTrigger id="customer">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={String(customer.id)}>
                            {customer.businessName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Select start date</Label>
                    <Input id="date" type="date" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Select end date</Label>
                    <Input id="date" type="date" className="w-full" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reference">External reference</Label>
                    <Input id="reference" placeholder="Optional" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reference">Extra notes</Label>
                    <Input id="reference" placeholder="Optional" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>Create Project</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading projects...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-card rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Project Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Project Manager
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Warehouse
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr
                key={project.id}
                className="border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium">{project.name}</td>
                <td className="px-6 py-4 text-sm">{project.type}</td>
                <td className="px-6 py-4 text-sm">
                  <StatusBadge status={project.status as never} />
                </td>
                <td className="px-6 py-4 text-sm">{project.projectManager ?? ""}</td>
                <td className="px-6 py-4 text-sm">{project.warehouse ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
