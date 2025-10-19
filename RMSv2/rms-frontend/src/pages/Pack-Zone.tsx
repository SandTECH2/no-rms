import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function PackZone() {
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Chose display</h1>
        <p className="text-lg text-muted-foreground"></p>
      </div>

      <div className="space-x-4">
        <a href="/pack-zone-1">
          <Button>
            <ExternalLink />
            Packzone 1
          </Button>
        </a>
        <a href="/pack-zone-2">
          <Button>
            <ExternalLink/>
            Packzone 2
          </Button>
        </a>
        <a href="/pack-zone-3">
          <Button>
            <ExternalLink />
            Packzone 3
          </Button>
        </a>
      </div>
    </div>
  );
}
