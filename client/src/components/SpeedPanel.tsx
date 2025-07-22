import { SpeedData } from "@shared/schema";
import { Gauge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SpeedPanelProps {
  speedData?: SpeedData;
  speedHistory?: SpeedData[];
  isLoading?: boolean;
}

function getSpeedText(rawSpeed: number): string {
  switch (rawSpeed) {
    case 255: return 'Kecepatan Penuh';
    case 200: return 'Kecepatan Tinggi';
    case 128: return 'Kecepatan Sedang';
    case 100: return 'Kecepatan Rendah';
    case 0: return 'Berhenti';
    default: return `Kecepatan: ${rawSpeed}`;
  }
}

function SpeedChart({ history }: { history: SpeedData[] }) {
  if (!history || history.length === 0) {
    return (
      <div className="h-20 bg-gray-50 dark:bg-railway-primary rounded-lg p-2 flex items-center justify-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">No data available</span>
      </div>
    );
  }

  const maxSpeed = Math.max(...history.map(h => h.kecepatan), 1);
  
  return (
    <div className="h-20 bg-gray-50 dark:bg-railway-primary rounded-lg p-2 flex items-end space-x-1">
      {history.slice(-8).map((entry, index) => {
        const height = (entry.kecepatan / maxSpeed) * 100;
        const opacity = 0.3 + (index / 7) * 0.7; // Fade from old to new
        
        return (
          <div
            key={entry.created_at || index}
            className="flex-1 bg-railway-accent rounded-t min-h-[4px]"
            style={{ 
              height: `${Math.max(height, 5)}%`,
              opacity: opacity
            }}
            title={`Speed: ${entry.kecepatan} (${entry.mode})`}
          />
        );
      })}
    </div>
  );
}

export function SpeedPanel({ speedData, speedHistory, isLoading }: SpeedPanelProps) {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!speedData) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Speed Monitor - Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Unable to load speed data
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-md">
          <span>Speed Monitor</span>
          <Gauge className="h-5 w-5 text-railway-warning" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Speed */}
        <div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {speedData.kecepatan}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">units</span>
          </div>
          <p className="text-sm font-medium text-railway-warning">
            {getSpeedText(speedData.kecepatan)}
          </p>
        </div>

        {/* Mode */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Mode:</span>
          <span className="px-2 py-1 bg-railway-accent/10 dark:bg-railway-accent/20 text-railway-accent text-sm font-medium rounded-full capitalize">
            {speedData.mode}
          </span>
        </div>

        {/* Speed Chart */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Speed Trend (Last 8 readings)
          </h4>
          <SpeedChart history={speedHistory || []} />
        </div>
      </CardContent>
    </Card>
  );
}
