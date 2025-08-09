import { GithubOutlined } from "@ant-design/icons";
export function Footer() {
  return (
    <footer className="border-t bg-white/70 dark:bg-gray-900/70 backdrop-blur lg:fixed lg:inset-x-0 lg:bottom-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        <div className="truncate">
          <span className="mr-1">Contact:</span>
          <a
            href="mailto:carlos@chiale.dev"
            className="hover:underline break-all"
          >
            carlos@chiale.dev
          </a>
        </div>
        <nav className="flex items-center gap-4">
          <a
            href="https://carlos.chiale.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline whitespace-nowrap"
          >
            carlos.chiale.dev
          </a>
          <a
            href="https://github.com/carlos-chiale"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:underline whitespace-nowrap"
            title="GitHub"
          >
            <GithubOutlined className="text-base" />
            <span>GitHub</span>
          </a>
        </nav>
      </div>
    </footer>
  );
}
