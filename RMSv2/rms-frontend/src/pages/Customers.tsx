import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, Customer } from "@/lib/api";

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading customers...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-card rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Business Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Org Number
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Address
              </th>
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
