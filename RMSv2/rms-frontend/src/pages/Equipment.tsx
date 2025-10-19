import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";

const equipment = [
  {
    code: "EQ001",
    name: "Martin Mac 250 Moving Head",
    quantity: 20,
    available: 20,
    totalQuantity: 20,
    price: "Kr 100/day",
    shelf: "A-12",
  },
  {
    code: "EQ002",
    name: "Shure SM58 Microphone",
    quantity: 16,
    available: 16,
    totalQuantity: 16,
    price: "$15/day",
    shelf: "B-05",
  },
  {
    code: "EQ003",
    name: "Yamaha MG16XU Mixer",
    quantity: 4,
    available: 2,
    totalQuantity: 4,
    price: "$85/day",
    shelf: "C-08",
  },
];

export default function Equipment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      <div className="bg-card rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Code
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Quantity
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Available
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Total Quantity
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Price
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Warehouse Shelf
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Warehouse
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Serial
              </th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((item) => (
              <tr
                key={item.code}
                className="border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-sm font-mono">{item.code}</td>
                <td className="px-6 py-4 text-sm font-medium">{item.name}</td>
                <td className="px-6 py-4 text-sm">{item.quantity}</td>
                <td className="px-6 py-4">
                  <span className={item.available > 0 ? "text-success font-medium" : "text-destructive font-medium"}>
                    {item.available}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{item.totalQuantity}</td>
                <td className="px-6 py-4 text-sm font-medium">{item.price}</td>
                <td className="px-6 py-4 text-sm">{item.shelf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
