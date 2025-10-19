import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Box, 
  Users, 
  UserCircle, 
  Warehouse, 
  Building2, 
  Monitor,
  ScanLine,
  Settings,
  CircleUserRound,
  LogOut,
  Newspaper,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";

const orgname = "Invison AS";

const navigation = [
  { name: "Projects", href: "/", icon: LayoutDashboard },
  { name: "Financial", href: "/invoces", icon: Wallet},
  { name: "Equipment", href: "/equipment", icon: Box },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Crew", href: "/crew", icon: UserCircle },
  { name: "Warehouses", href: "/warehouses", icon: Warehouse },
  { name: "Organizations", href: "/organizations", icon: Building2 },
  { name: "Pack Zone", href: "/pack-zone", icon: Monitor },
  { name: "Scan", href: "/scan", icon: ScanLine },
  { name: "Org Settiings", href: "/org-settings", icon: Settings},
  { name: "Profile", href: "/user-settings", icon: CircleUserRound},
  { name: "Logout", href: "/auth/logout", icon: LogOut},
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">{orgname}</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
