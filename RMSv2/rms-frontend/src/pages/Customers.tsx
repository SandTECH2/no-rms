import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const customers = [
  {
    id: "1",
    businessName: "TechCorp AS",
    orgNumber: "123456789",
    email: "contact@techcorp.no",
    phone: "+47 123 45 678",
    address: "Oslo, Norway",
  },
  {
    id: "2",
    businessName: "EventPro Solutions",
    orgNumber: "987654321",
    email: "info@eventpro.no",
    phone: "+47 987 65 432",
    address: "Bergen, Norway",
  },
];

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");

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
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium">{customer.businessName}</td>
                <td className="px-6 py-4 text-sm font-mono">{customer.orgNumber}</td>
                <td className="px-6 py-4 text-sm">{customer.email}</td>
                <td className="px-6 py-4 text-sm">{customer.phone}</td>
                <td className="px-6 py-4 text-sm">{customer.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
