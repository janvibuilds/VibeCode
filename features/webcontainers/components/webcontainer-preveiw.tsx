"use client";

import React, { useRef } from "react";
import type { TemplateFolder } from "@/features/playground/libs/path-to-json";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import TerminalComponent from "./terminal";
import { WebContainer } from "@webcontainer/api";

interface WebContainerPreviewProps {
  templateData: TemplateFolder;
  serverUrl: string;
  isLoading: boolean;
  error: string | null;
  instance: WebContainer | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
  forceResetup?: boolean;
}

const WebContainerPreview: React.FC<WebContainerPreviewProps> = ({
  templateData,
  error,
  instance,
  isLoading,
  serverUrl,
  writeFileSync,
  forceResetup = false,
}) => {
  const terminalRef = useRef<any>(null);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-6 rounded-lg bg-gray-50 dark:bg-gray-900">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <h3 className="text-lg font-medium">Setting up WebContainer</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mounting files, installing dependencies, and starting dev server...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg max-w-md">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="h-5 w-5" />
            <h3 className="font-semibold">Error</h3>
          </div>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (serverUrl) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1">
          <iframe
            src={serverUrl}
            className="w-full h-full border-none"
            title="WebContainer Preview"
          />
        </div>
        <div className="h-64 border-t">
          <TerminalComponent
            ref={terminalRef}
            webContainerInstance={instance}
            theme="dark"
            className="h-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center space-y-4 max-w-md p-6 rounded-lg bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
        <h3 className="text-lg font-medium">Waiting for server...</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Dev server is starting up
        </p>
      </div>
    </div>
  );
};

export default WebContainerPreview;