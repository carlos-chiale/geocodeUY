"use client";

import { GithubOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { ThemeToggle } from "../theme/ThemeToggle";

export function Header() {
  return (
    <header className="md:sticky md:top-0 z-[2000] bg-blue-600 dark:bg-blue-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex flex-row justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold truncate mr-4">
          Geocodificadores Uruguay
        </h1>
        <div className="flex gap-2 flex-shrink-0">
          <ThemeToggle />
          <Button
            type="primary"
            icon={<GithubOutlined />}
            href="https://github.com/carlos-chiale/geocodeUY"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="github-btn !bg-blue-500 dark:!bg-blue-600 !border-blue-500 dark:!border-blue-600 hover:!bg-blue-600 dark:hover:!bg-blue-700 !text-white flex items-center justify-center px-2 min-w-[32px] h-8"
            title="GitHub"
          >
            <span className="hidden sm:inline ml-2">Mira el código!!</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
