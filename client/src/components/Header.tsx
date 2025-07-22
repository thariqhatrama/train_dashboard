import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Train, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  lastUpdate?: string;
}

export function Header({ lastUpdate }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-railway-secondary shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Train className="h-8 w-8 text-railway-accent" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Railway Monitor
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-railway-success/10 dark:bg-railway-success/20 rounded-full">
              <div className="w-2 h-2 bg-railway-success rounded-full animate-pulse" />
              <span className="text-sm font-medium text-railway-success">Live</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              {theme === 'light' ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-blue-400" />
              )}
            </Button>
            
            {lastUpdate && (
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Wifi className="h-4 w-4" />
                <span>{lastUpdate}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
