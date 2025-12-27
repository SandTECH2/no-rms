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
import { api, Equipment as EquipmentItem, Warehouse } from "@/lib/api";

export default function Equipment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    quantity: "0",
    pricePer: "",
    warehouseId: "",
  });

  useEffect(() => {
    let isMounted = true;
    Promise.all([api.getEquipment(), api.getWarehouses()])
      .then(([equipmentData, warehouseData]) => {
        if (isMounted) {
          setEquipment(equipmentData);
          setWarehouses(warehouseData);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message ?? "Failed to load equipment");
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

  const filteredEquipment = useMemo(() => {
    if (!searchQuery) return equipment;
    const query = searchQuery.toLowerCase();
    return equipment.filter((item) =>
      [item.code, item.name, item.warehouse]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(query))
    );
  }, [equipment, searchQuery]);

  const handleCreate = async () => {
    const payload = {
      code: formData.code.trim(),
      name: formData.name.trim(),
      quantity: Number(formData.quantity),
      pricePer: formData.pricePer ? Number(formData.pricePer) : undefined,
      warehouseId: formData.warehouseId ? Number(formData.warehouseId) : undefined,
    };

    const created = await api.createEquipment(payload);
    setEquipment((prev) => [created, ...prev]);
    setFormData({ code: "", name: "", quantity: "0", pricePer: "", warehouseId: "" });
    setIsDialogOpen(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Equipment</h1>
        <p className="text-muted-foreground">Manage your rental and sales inventory</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Add Equipment</DialogTitle>
              <DialogDescription>Register new equipment in your inventory.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="equipment-code">Code</Label>
                <Input
                  id="equipment-code"
                  value={formData.code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipment-name">Name</Label>
                <Input
                  id="equipment-name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="equipment-quantity">Quantity</Label>
                  <Input
                    id="equipment-quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equipment-price">Price per day (NOK)</Label>
                  <Input
                    id="equipment-price"
                    type="number"
                    value={formData.pricePer}
                    onChange={(e) => setFormData((prev) => ({ ...prev, pricePer: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipment-warehouse">Warehouse</Label>
                <Select
                  value={formData.warehouseId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, warehouseId: value }))}
                >
                  <SelectTrigger id="equipment-warehouse">
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
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={!formData.code || !formData.name}>
                  Save Equipment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading equipment...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-card rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Code</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Quantity</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Available</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Total Quantity</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Price</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Warehouse Shelf</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Warehouse</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Serials</th>
            </tr>
          </thead>
          <tbody>
            {filteredEquipment.map((item) => (
              <tr
                key={item.id}
                className="border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-sm font-mono">{item.code}</td>
                <td className="px-6 py-4 text-sm font-medium">{item.name}</td>
                <td className="px-6 py-4 text-sm">{item.quantity}</td>
                <td className="px-6 py-4">
                  <span
                    className={
                      item.available > 0
                        ? "text-success font-medium"
                        : "text-destructive font-medium"
                    }
                  >
                    {item.available}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{item.totalQuantity}</td>
                <td className="px-6 py-4 text-sm font-medium">{item.price}</td>
                <td className="px-6 py-4 text-sm">{item.shelf}</td>
                <td className="px-6 py-4 text-sm">{item.warehouse}</td>
                <td className="px-6 py-4 text-sm">{item.serialCount ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
