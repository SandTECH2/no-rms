import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const crewMembers = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    role: "Project Manager",
    email: "john.doe@company.no",
    phone: "+47 111 11 111",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    role: "Technician",
    email: "jane.smith@company.no",
    phone: "+47 222 22 222",
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    role: "Project Manager",
    email: "mike.j@company.no",
    phone: "+47 333 33 333",
  },
];

export default function Crew() {
  const [searchQuery, setSearchQuery] = useState("");

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

        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Crew Member
        </Button>
      </div>

      <div className="bg-card rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                First Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Last Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Role
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Phone
              </th>
            </tr>
          </thead>
          <tbody>
            {crewMembers.map((member) => (
              <tr
                key={member.id}
                className="border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-sm">{member.firstName}</td>
                <td className="px-6 py-4 text-sm">{member.lastName}</td>
                <td className="px-6 py-4 text-sm font-medium">{member.role}</td>
                <td className="px-6 py-4 text-sm">{member.email}</td>
                <td className="px-6 py-4 text-sm">{member.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
