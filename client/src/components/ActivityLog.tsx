import { ActivityLog } from "@shared/schema";
import { History, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityLogProps {
  logs?: ActivityLog[];
  isLoading?: boolean;
}

function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'DETECTING':
      return 'bg-railway-success text-railway-success';
    case 'CLEAR':
      return 'bg-railway-accent text-railway-accent';
    default:
      return 'bg-railway-warning text-railway-warning';
  }
}

function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch {
    return timestamp;
  }
}

export function ActivityLogComponent({ logs, isLoading }: ActivityLogProps) {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-railway-primary rounded-lg">
                <div className="w-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-md">
            <span>Recent Activity</span>
            <History className="h-5 w-5 text-railway-gray" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No recent activity available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-md">
          <span>Recent Activity</span>
          <History className="h-5 w-5 text-railway-gray" />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {logs.slice(0, 10).map((log, index) => {
            const statusColorClass = getStatusColor(log.status);
            
            return (
              <div
                key={`${log.checkpoint}-${log.timestamp}-${index}`}
                className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-railway-primary rounded-lg hover:bg-gray-100 dark:hover:bg-railway-primary/80 transition-colors"
              >
                <Circle className={`w-2 h-2 rounded-full mt-2 ${statusColorClass.split(' ')[0]}`} />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {log.checkpoint}
                    </span>
                    <span className={`px-2 py-1 ${statusColorClass}/10 dark:${statusColorClass}/20 ${statusColorClass.split(' ')[1]} text-xs font-medium rounded-full`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatTimestamp(log.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
