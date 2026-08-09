import { useState, useEffect, useCallback, useRef } from 'react';
import { WebContainer } from '@webcontainer/api';
import { TemplateFolder } from '@/features/playground/libs/path-to-json';
import { transformToWebContainerFormat } from './transformer';

interface UseWebContainerProps {
  templateData: TemplateFolder;
}

interface UseWebContainerReturn {
  serverUrl: string | null;
  isLoading: boolean;
  error: string | null;
  instance: WebContainer | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
  destroy: () => void;
}

// Singleton: WebContainer only allows one instance per page
let globalInstance: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;

async function getOrCreateInstance(): Promise<WebContainer> {
  if (globalInstance) {
    return globalInstance;
  }

  if (bootPromise) {
    return bootPromise;
  }

  bootPromise = WebContainer.boot();
  globalInstance = await bootPromise;
  bootPromise = null;
  return globalInstance;
}

async function detectStartScript(instance: WebContainer): Promise<string> {
  try {
    const packageJson = await instance.fs.readFile('package.json', 'utf8');
    const pkg = JSON.parse(packageJson);
    const scripts = pkg.scripts || {};

    if (scripts.dev) return 'dev';
    if (scripts.start) return 'start';
    if (scripts.serve) return 'serve';
    return 'start';
  } catch {
    return 'start';
  }
}

export const useWebContainer = ({ templateData }: UseWebContainerProps): UseWebContainerReturn => {
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [instance, setInstance] = useState<WebContainer | null>(null);
  const setupDone = useRef(false);

  useEffect(() => {
    let mounted = true;

    async function initializeAndMount() {
      try {
        // Get or create singleton instance
        const webcontainerInstance = await getOrCreateInstance();

        if (!mounted) return;
        setInstance(webcontainerInstance);

        // Skip if already set up (singleton reuse)
        if (setupDone.current) {
          setIsLoading(false);
          return;
        }

        // Check if files already mounted
        try {
          await webcontainerInstance.fs.readFile('package.json', 'utf8');
          webcontainerInstance.on('server-ready', (port: number, url: string) => {
            if (mounted) setServerUrl(url);
          });
          setupDone.current = true;
          setIsLoading(false);
          return;
        } catch {
          // Files don't exist, proceed with mount
        }

        if (!templateData?.items?.length) {
          setIsLoading(false);
          return;
        }

        // Transform and mount files
        const files = transformToWebContainerFormat(templateData);
        await webcontainerInstance.mount(files);

        // Install dependencies
        const installProcess = await webcontainerInstance.spawn('npm', ['install']);
        await installProcess.exit;

        if (!mounted) return;

        // Detect and start dev server
        const startScript = await detectStartScript(webcontainerInstance);
        const startProcess = await webcontainerInstance.spawn('npm', ['run', startScript]);

        startProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              console.log('[WebContainer]', data);
            },
          })
        );

        // Listen for server ready
        webcontainerInstance.on('server-ready', (port: number, url: string) => {
          console.log(`[WebContainer] Server ready at ${url}`);
          if (mounted) setServerUrl(url);
        });

        setupDone.current = true;
        setIsLoading(false);
      } catch (err) {
        console.error('WebContainer error:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize WebContainer');
          setIsLoading(false);
        }
      }
    }

    initializeAndMount();

    return () => {
      mounted = false;
    };
  }, [templateData]);

  const writeFileSync = useCallback(async (path: string, content: string): Promise<void> => {
    if (!instance) {
      throw new Error('WebContainer instance is not available');
    }

    const pathParts = path.split('/');
    const folderPath = pathParts.slice(0, -1).join('/');

    if (folderPath) {
      await instance.fs.mkdir(folderPath, { recursive: true });
    }

    await instance.fs.writeFile(path, content);
  }, [instance]);

  const destroy = useCallback(() => {
    if (instance) {
      instance.teardown();
      globalInstance = null;
      setupDone.current = false;
      setInstance(null);
      setServerUrl(null);
    }
  }, [instance]);

  return { serverUrl, isLoading, error, instance, writeFileSync, destroy };
};