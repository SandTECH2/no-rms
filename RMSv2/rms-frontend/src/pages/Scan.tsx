import { useState } from "react";
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

export default function Scan() {
  const [scanInput, setScanInput] = useState("");

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
                <Select>
                  <SelectTrigger id="project-select">
                    <SelectValue placeholder="Choose confirmed project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12345">Summer Festival 2024</SelectItem>
                    <SelectItem value="12346">Tech Summit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scan-input">Scan Equipment</Label>
                <div className="flex gap-3">
                  <Input
                    id="scan-input"
                    placeholder="Scan barcode or QR code"
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button>Add</Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-3">Scanned Items</h3>
                <div className="text-sm text-muted-foreground">No items scanned yet</div>
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
                    placeholder="Scan barcode or QR code"
                    className="flex-1"
                  />
                  <Button variant="outline">Return</Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-3">Returned Items</h3>
                <div className="text-sm text-muted-foreground">No items returned yet</div>
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
                  placeholder="Scan barcode or QR code"
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

              <Button className="w-full">Update Status</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
