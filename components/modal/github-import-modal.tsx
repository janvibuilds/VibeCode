"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Github, Loader2, ArrowRight } from "lucide-react";
import { importGitHubRepo } from "@/features/playground/actions/github";

interface GitHubImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GitHubImportModal = ({ isOpen, onClose }: GitHubImportModalProps) => {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleImport = async () => {
    if (!repoUrl.trim()) {
      toast.error("Please enter a GitHub repository URL");
      return;
    }

    setIsLoading(true);
    try {
      const playground = await importGitHubRepo(repoUrl);
      toast.success("Repository imported successfully!");
      onClose();
      setRepoUrl("");
      router.push(`/playground/${playground.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to import repository";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setRepoUrl("");
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#e93f3f] flex items-center gap-2">
            <Github size={24} />
            Import GitHub Repository
          </DialogTitle>
          <DialogDescription>
            Import a public GitHub repository into the editor
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="repo-url">Repository URL</Label>
            <Input
              id="repo-url"
              placeholder="owner/repo or https://github.com/owner/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  handleImport();
                }
              }}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Supports formats:{" "}
              <span className="font-mono">owner/repo</span>,{" "}
              <span className="font-mono">github.com/owner/repo</span>
            </p>
          </div>

          <div className="p-3 rounded-lg bg-muted text-sm">
            <p className="font-medium mb-1">How it works:</p>
            <ul className="text-muted-foreground text-xs space-y-1">
              <li>1. Fetches all files from the repository</li>
              <li>2. Skips node_modules, .git, and lock files</li>
              <li>3. Creates a new playground with the files</li>
              <li>4. Opens the editor with the imported code</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            className="bg-[#E93F3F] hover:bg-[#d03636]"
            onClick={handleImport}
            disabled={!repoUrl.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                Import
                <ArrowRight size={16} className="ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GitHubImportModal;
