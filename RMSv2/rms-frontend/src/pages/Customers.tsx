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
import { api, Customer } from "@/lib/api";

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    orgNumber: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    let isMounted = true;
    api
      .getCustomers()
      .then((data) => {
        if (isMounted) {
          setCustomers(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message ?? "Failed to load customers");
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

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    const query = searchQuery.toLowerCase();
    return customers.filter((customer) =>
      [customer.businessName, customer.orgNumber, customer.email, customer.phone, customer.address]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(query))
    );
  }, [customers, searchQuery]);

  const handleCreate = async () => {
    const payload = {
      businessName: formData.businessName.trim(),
      orgNumber: formData.orgNumber.trim() || undefined,
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      address: formData.address.trim() || undefined,
    };

    const created = await api.createCustomer(payload);
    setCustomers((prev) => [created, ...prev]);
    setFormData({ businessName: "", orgNumber: "", email: "", phone: "", address: "" });
    setIsDialogOpen(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Customers</h1>
        <p className="text-muted-foreground">Manage your client database</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Customer</DialogTitle>
              <DialogDescription>Create a new customer profile.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer-name">Business Name</Label>
                <Input
                  id="customer-name"
                  value={formData.businessName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, businessName: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-org">Org Number</Label>
                  <Input
                    id="customer-org"
                    value={formData.orgNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, orgNumber: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Email</Label>
                  <Input
                    id="customer-email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-phone">Phone</Label>
                  <Input
                    id="customer-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-address">Address</Label>
                  <Input
                    id="customer-address"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={!formData.businessName}>
                  Save Customer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading customers...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-card rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Business Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Org Number</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Email</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium">{customer.businessName}</td>
                <td className="px-6 py-4 text-sm font-mono">{customer.orgNumber ?? ""}</td>
                <td className="px-6 py-4 text-sm">{customer.email ?? ""}</td>
                <td className="px-6 py-4 text-sm">{customer.phone ?? ""}</td>
                <td className="px-6 py-4 text-sm">{customer.address ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
