import { useEffect, useState } from "react";
import { ScanLine, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, Project } from "@/lib/api";

export default function Scan() {
  const [scanInput, setScanInput] = useState("");
  const [scanInInput, setScanInInput] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [scannedOut, setScannedOut] = useState<string[]>([]);
  const [scannedIn, setScannedIn] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    api.getProjects().then((data) => {
      if (isMounted) {
        setProjects(data.filter((project) => ["confirmed", "on-location"].includes(project.status)));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleScanOut = () => {
    if (!scanInput.trim()) return;
    setScannedOut((prev) => [scanInput.trim(), ...prev]);
    setScanInput("");
  };

  const handleScanIn = async () => {
    if (!scanInInput.trim()) return;
    await api.scanEquipment(scanInInput.trim());
    setScannedIn((prev) => [scanInInput.trim(), ...prev]);
    setScanInInput("");
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Equipment Scanner</h1>
        <p className="text-muted-foreground">Check-in/out equipment using barcode or QR codes</p>
      </div>

      <Tabs defaultValue="scan-out" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
          <TabsTrigger value="scan-out">Scan Out</TabsTrigger>
          <TabsTrigger value="scan-in">Scan In</TabsTrigger>
          <TabsTrigger value="set-status">Set Status</TabsTrigger>
        </TabsList>

        <TabsContent value="scan-out" className="space-y-6">
          <div className="bg-card rounded-lg border p-8 max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <ScanLine className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Scan Out Equipment</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="project-select">Select Project</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger id="project-select">
                    <SelectValue placeholder="Choose confirmed project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={String(project.id)}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scan-input">Scan Equipment</Label>
                <div className="flex gap-3">
                  <Input
                    id="scan-input"
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleScanOut} disabled={!scanInput.trim() || !selectedProject}>
                    Add
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-3">Scanned Items</h3>
                {scannedOut.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No items scanned yet</div>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {scannedOut.map((item, index) => (
                      <li key={`${item}-${index}`} className="rounded bg-muted px-3 py-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scan-in" className="space-y-6">
          <div className="bg-card rounded-lg border p-8 max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-6 w-6 text-success" />
              <h2 className="text-xl font-semibold">Scan In Equipment</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="scan-in-input">Scan Equipment</Label>
                <div className="flex gap-3">
                  <Input
                    id="scan-in-input"
                    value={scanInInput}
                    onChange={(e) => setScanInInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleScanIn} disabled={!scanInInput.trim()}>
                    Return
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-3">Returned Items</h3>
                {scannedIn.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No items returned yet</div>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {scannedIn.map((item, index) => (
                      <li key={`${item}-${index}`} className="rounded bg-muted px-3 py-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="set-status" className="space-y-6">
          <div className="bg-card rounded-lg border p-8 max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="h-6 w-6 text-warning" />
              <h2 className="text-xl font-semibold">Set Equipment Status</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="status-scan">Scan Serialized Item</Label>
                <Input
                  id="status-scan"
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-status">New Status</Label>
                <Select>
                  <SelectTrigger id="new-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="in-use">In Use</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" disabled={!statusInput.trim()}>
                Update Status
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
