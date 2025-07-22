import { TrainStatus } from "@shared/schema";
import { Train, ParkingCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatusPanelsProps {
  trains?: TrainStatus;
  isLoading?: boolean;
}

export function StatusPanels({ trains, isLoading }: StatusPanelsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <Card className="animate-pulse border-l-4 border-l-railway-accent">
          <CardHeader>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          </CardContent>
        </Card>
        
        <Card className="animate-pulse border-l-4 border-l-railway-success">
          <CardHeader>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!trains) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <Card className="border-red-200 dark:border-red-800 border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Status Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Unable to load train status
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Running Train Card */}
      <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-railway-accent">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-md">
            <span>Running Train</span>
            <Train className="h-5 w-5 text-railway-accent" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-railway-accent">
            {trains.running || 'None'}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {trains.running ? 'Currently at checkpoint' : 'No train detected'}
          </p>
        </CardContent>
      </Card>

      {/* Parked Trains Card */}
      <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-railway-success">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-md">
            <span>Parked Trains</span>
            <ParkingCircle className="h-5 w-5 text-railway-success" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-railway-success">
            {trains.parking.length > 0 ? trains.parking.join(', ') : 'None'}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {trains.parking.length > 0 
              ? `${trains.parking.length} train${trains.parking.length > 1 ? 's' : ''} parked`
              : 'No trains parked'
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
