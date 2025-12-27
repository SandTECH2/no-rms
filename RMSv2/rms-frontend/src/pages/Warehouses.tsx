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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, Organization, Warehouse } from "@/lib/api";

export default function Warehouses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    internalNote: "",
    organizationId: "",
  });

  useEffect(() => {
    let isMounted = true;
    Promise.all([api.getWarehouses(), api.getOrganizations()])
      .then(([warehouseData, orgData]) => {
        if (isMounted) {
          setWarehouses(warehouseData);
          setOrganizations(orgData);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message ?? "Failed to load warehouses");
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

  const filteredWarehouses = useMemo(() => {
    if (!searchQuery) return warehouses;
    const query = searchQuery.toLowerCase();
    return warehouses.filter((warehouse) =>
      [warehouse.name, warehouse.address, warehouse.organization]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(query))
    );
  }, [warehouses, searchQuery]);

  const handleCreate = async () => {
    const payload = {
      name: formData.name.trim(),
      address: formData.address.trim() || undefined,
      internalNote: formData.internalNote.trim() || undefined,
      organizationId: Number(formData.organizationId),
    };

    const created = await api.createWarehouse(payload);
    setWarehouses((prev) => [created, ...prev]);
    setFormData({ name: "", address: "", internalNote: "", organizationId: "" });
    setIsDialogOpen(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Warehouses</h1>
        <p className="text-muted-foreground">Manage storage locations and zones</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search warehouses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Warehouse
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Warehouse</DialogTitle>
              <DialogDescription>Create a new storage location.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="warehouse-name">Name</Label>
                <Input
                  id="warehouse-name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warehouse-address">Address</Label>
                <Input
                  id="warehouse-address"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warehouse-note">Internal Note</Label>
                <Input
                  id="warehouse-note"
                  value={formData.internalNote}
                  onChange={(e) => setFormData((prev) => ({ ...prev, internalNote: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warehouse-org">Organization</Label>
                <Select
                  value={formData.organizationId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, organizationId: value }))}
                >
                  <SelectTrigger id="warehouse-org">
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
                <Button onClick={handleCreate} disabled={!formData.name || !formData.organizationId}>
                  Save Warehouse
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading warehouses...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-card rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">ID</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Address</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Internal Note</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Organization</th>
            </tr>
          </thead>
          <tbody>
            {filteredWarehouses.map((warehouse) => (
              <tr
                key={warehouse.id}
                className="border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-sm font-mono">{warehouse.id}</td>
                <td className="px-6 py-4 text-sm font-medium">{warehouse.name}</td>
                <td className="px-6 py-4 text-sm">{warehouse.address ?? ""}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {warehouse.internalNote ?? ""}
                </td>
                <td className="px-6 py-4 text-sm">{warehouse.organization ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
