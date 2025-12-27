import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const warehouses = [
  {
    id: "WH001",
    name: "Main Warehouse",
    address: "Industriveien 12, Oslo",
    note: "Primary storage facility",
  },
  {
    id: "WH002",
    name: "East Storage",
    address: "Østveien 45, Bergen",
    note: "Regional depot",
  },
];

export default function Warehouses() {
  const [searchQuery, setSearchQuery] = useState("");

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

        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Warehouse
        </Button>
      </div>

      <div className="bg-card rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Address
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Internal Note
              </th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((warehouse) => (
              <tr
                key={warehouse.id}
                className="border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-sm font-mono">{warehouse.id}</td>
                <td className="px-6 py-4 text-sm font-medium">{warehouse.name}</td>
                <td className="px-6 py-4 text-sm">{warehouse.address}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{warehouse.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
