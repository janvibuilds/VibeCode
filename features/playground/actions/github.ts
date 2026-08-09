"use server";

import { currentUser } from "@/features/auth/actions";
import { db } from "@/lib/db";
import { TemplateFolder } from "@/features/playground/libs/path-to-json";

interface GitHubContent {
  name: string;
  path: string;
  type: string;
  size?: number;
  download_url?: string;
}

const IGNORED_FILES = [
  "package-lock.json",
  "yarn.lock",
  ".DS_Store",
  "thumbs.db",
  ".gitignore",
  ".npmrc",
  ".env",
  ".env.local",
];

const IGNORED_FOLDERS = [
  "node_modules",
  ".git",
  ".vscode",
  ".idea",
  "dist",
  "build",
  "coverage",
  "__pycache__",
  ".next",
];

async function fetchGitHubContents(
  owner: string,
  repo: string,
  path: string = ""
): Promise<GitHubContent[]> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch GitHub contents: ${res.status}`);
  }

  return res.json();
}

async function fetchFileContent(downloadUrl: string): Promise<string> {
  const res = await fetch(downloadUrl);
  if (!res.ok) {
    return `// Failed to fetch file content`;
  }
  return res.text();
}

async function buildTemplateFolder(
  owner: string,
  repo: string,
  path: string = ""
): Promise<TemplateFolder> {
  const contents = await fetchGitHubContents(owner, repo, path);
  const items: (TemplateFolder | { filename: string; fileExtension: string; content: string })[] = [];

  for (const item of contents) {
    // Skip ignored items
    if (IGNORED_FILES.includes(item.name)) continue;
    if (IGNORED_FOLDERS.includes(item.name)) continue;

    if (item.type === "dir") {
      const subFolder = await buildTemplateFolder(owner, repo, item.path);
      if (subFolder.items.length > 0) {
        items.push(subFolder);
      }
    } else if (item.type === "file" && item.download_url) {
      // Skip large files (> 1MB)
      if (item.size && item.size > 1024 * 1024) {
        const ext = item.name.split(".").pop() || "";
        const name = item.name.replace(/\.[^/.]+$/, "");
        items.push({
          filename: name,
          fileExtension: ext,
          content: `// File too large to display (${(item.size / 1024 / 1024).toFixed(1)}MB)`,
        });
        continue;
      }

      const content = await fetchFileContent(item.download_url);
      const ext = item.name.split(".").pop() || "";
      const name = item.name.replace(/\.[^/.]+$/, "");

      items.push({
        filename: name,
        fileExtension: ext,
        content,
      });
    }
  }

  const folderName = path ? path.split("/").pop() || "root" : repo;
  return { folderName, items };
}

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  // Handle various GitHub URL formats
  const patterns = [
    /github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/.*)?$/,
    /^([^/]+)\/([^/]+)$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
  }

  return null;
}

export async function importGitHubRepo(repoUrl: string) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const parsed = parseGitHubUrl(repoUrl.trim());
  if (!parsed) {
    throw new Error("Invalid GitHub URL. Use format: owner/repo or full GitHub URL");
  }

  const { owner, repo } = parsed;

  // Verify repo exists
  const repoCheck = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers: { Accept: "application/vnd.github.v3+json" } }
  );

  if (!repoCheck.ok) {
    throw new Error(`Repository not found: ${owner}/${repo}`);
  }

  const repoData = await repoCheck.json();

  // Build template from repo
  const templateData = await buildTemplateFolder(owner, repo);

  // Create playground
  const playground = await db.playground.create({
    data: {
      title: repoData.name || repo,
      description: repoData.description || `Imported from ${owner}/${repo}`,
      template: "REACT", // Default template type for imports
      userId: user.id,
    },
  });

  // Save template files
  await db.templateFile.create({
    data: {
      playgroundId: playground.id,
      content: JSON.stringify(templateData),
    },
  });

  return playground;
}
