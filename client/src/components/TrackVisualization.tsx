import { StatusResponse } from "@shared/schema";
import { Building, Route } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrackVisualizationProps {
  status?: StatusResponse;
  isLoading?: boolean;
}

interface TrafficLightProps {
  state: { red: boolean; yellow: boolean; green: boolean };
}

function TrafficLight({ state }: TrafficLightProps) {
  const getActiveColor = () => {
    if (state.red) return 'bg-railway-danger shadow-lg';
    if (state.yellow) return 'bg-railway-warning shadow-lg';
    if (state.green) return 'bg-railway-success shadow-lg';
    return 'bg-gray-300 dark:bg-gray-600';
  };

  return (
    <div className="flex justify-center">
      <div className={`w-5 h-5 rounded-full ${getActiveColor()}`} />
    </div>
  );
}

interface TrainIndicatorProps {
  isRunning: boolean;
  isParked: boolean;
}

function TrainIndicator({ isRunning, isParked }: TrainIndicatorProps) {
  if (isRunning) {
    return (
      <div className="w-8 h-8 rounded-full bg-railway-accent border-2 border-white shadow-lg animate-pulse mx-auto" 
           title="Train Running" />
    );
  }
  
  if (isParked) {
    return (
      <div className="w-8 h-8 rounded-full bg-railway-success border-2 border-white shadow-lg mx-auto" 
           title="Train Parked" />
    );
  }
  
  return (
    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-gray-400 mx-auto" 
         title="No Train" />
  );
}

export function TrackVisualization({ status, isLoading }: TrackVisualizationProps) {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Track Status - Connection Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400">
            Unable to load track status. Please check your connection.
          </p>
        </CardContent>
      </Card>
    );
  }

  const checkpoints = ['CP1', 'CP2', 'CP3', 'CP4', 'CP5'];

  return (
    <Card className="hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Track Status</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Route className="h-4 w-4 text-railway-accent" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {status.route}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Station Section */}
        <div className="bg-gray-50 dark:bg-railway-primary rounded-xl p-4">
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 text-center">
            <Building className="inline mr-2" size={16} />
            STASIUN
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Peron Utama (SU) */}
            <div className="bg-blue-500 dark:bg-blue-600 rounded-lg p-4 text-white">
              <h4 className="font-medium mb-3">Peron Utama (SU)</h4>
              <div className="flex items-center justify-between">
                <TrafficLight state={status.lights.SU || { red: false, yellow: false, green: false }} />
                <TrainIndicator 
                  isRunning={status.trains.running === 'SU'}
                  isParked={status.trains.parking.includes('SU')}
                />
              </div>
            </div>

            {/* Peron Sekunder (SS) */}
            <div className="bg-orange-500 dark:bg-orange-600 rounded-lg p-4 text-white">
              <h4 className="font-medium mb-3">Peron Sekunder (SS)</h4>
              <div className="flex items-center justify-between">
                <TrafficLight state={status.lights.SS || { red: false, yellow: false, green: false }} />
                <TrainIndicator 
                  isRunning={status.trains.running === 'SS'}
                  isParked={status.trains.parking.includes('SS')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Track Checkpoints */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-900 dark:text-white text-center">
            <Route className="inline mr-2" size={16} />
            Track Checkpoints
          </h3>
          
          <div className="flex items-center space-x-2 overflow-x-auto pb-4">
            {checkpoints.map((checkpoint, index) => (
              <div key={checkpoint} className="flex items-center space-x-2">
                <div className="flex-shrink-0 bg-gray-50 dark:bg-railway-primary rounded-lg p-4 min-w-[140px] text-center">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">{checkpoint}</h4>
                  <div className="mb-2">
                    <TrafficLight state={status.lights[checkpoint] || { red: false, yellow: false, green: false }} />
                  </div>
                  <TrainIndicator 
                    isRunning={status.trains.running === checkpoint}
                    isParked={status.trains.parking.includes(checkpoint)}
                  />
                </div>
                
                {index < checkpoints.length - 1 && (
                  <div className="flex-shrink-0 w-8 h-2 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
