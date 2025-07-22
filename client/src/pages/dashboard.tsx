import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { TrackVisualization } from "@/components/TrackVisualization";
import { StatusPanels } from "@/components/StatusPanels";
import { SpeedPanel } from "@/components/SpeedPanel";
import { ActivityLogComponent } from "@/components/ActivityLog";
import { useRailwayStatus, useSpeedData, useSpeedHistory } from "@/hooks/useRailwayData";
import { Card, CardContent } from "@/components/ui/card";
import { Signal, Database, Shield } from "lucide-react";

export default function Dashboard() {
  const [lastUpdate, setLastUpdate] = useState<string>("");
  
  const { 
    data: statusData, 
    isLoading: statusLoading, 
    error: statusError,
    isError: statusHasError
  } = useRailwayStatus();
  
  const { 
    data: speedData, 
    isLoading: speedLoading,
    error: speedError,
    isError: speedHasError
  } = useSpeedData();
  
  const { 
    data: speedHistory, 
    isLoading: historyLoading 
  } = useSpeedHistory();

  // Update timestamp when data changes
  useEffect(() => {
    if (statusData || speedData) {
      setLastUpdate(new Date().toLocaleString('id-ID'));
    }
  }, [statusData, speedData]);

  const currentSpeedData = speedData?.[0];
  const isLoading = statusLoading || speedLoading;

  return (
    <div className="min-h-screen bg-railway-light dark:bg-railway-primary transition-colors duration-300">
      <Header lastUpdate={lastUpdate} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error States */}
        {(statusHasError || speedHasError) && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h3 className="text-red-800 dark:text-red-200 font-medium mb-2">Connection Issues</h3>
            <div className="space-y-1 text-sm text-red-700 dark:text-red-300">
              {statusHasError && (
                <p>• Status data: {statusError?.message || 'Unknown error'}</p>
              )}
              {speedHasError && (
                <p>• Speed data: {speedError?.message || 'Unknown error'}</p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Track Visualization */}
          <div className="lg:col-span-8">
            <TrackVisualization 
              status={statusData} 
              isLoading={statusLoading}
            />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Status Panels */}
            <StatusPanels 
              trains={statusData?.trains} 
              isLoading={statusLoading}
            />

            {/* Speed Panel */}
            <SpeedPanel 
              speedData={currentSpeedData}
              speedHistory={speedHistory}
              isLoading={speedLoading || historyLoading}
            />
          </div>
        </div>

        {/* Recent Activity - Full Width Below Track Status */}
        <div className="mt-6">
          <ActivityLogComponent 
            logs={statusData?.logs} 
            isLoading={statusLoading}
          />
        </div>

        {/* System Info Footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Signal className="h-8 w-8 text-railway-success mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">System Status</h4>
              <span className="px-3 py-1 bg-railway-success/10 dark:bg-railway-success/20 text-railway-success text-sm font-medium rounded-full">
                {statusHasError ? 'Offline' : 'Online'}
              </span>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Database className="h-8 w-8 text-railway-accent mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Data Sync</h4>
              <span className="px-3 py-1 bg-railway-accent/10 dark:bg-railway-accent/20 text-railway-accent text-sm font-medium rounded-full">
                {isLoading ? 'Syncing...' : 'Real-time'}
              </span>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Shield className="h-8 w-8 text-railway-warning mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Security</h4>
              <span className="px-3 py-1 bg-railway-warning/10 dark:bg-railway-warning/20 text-railway-warning text-sm font-medium rounded-full">
                Secured
              </span>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
