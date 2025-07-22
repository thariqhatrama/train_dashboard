import { ActivityLog } from "@shared/schema";
import { History, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { Clock, Copy } from "lucide-react";

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
  // Memoize the filtered and sorted logs
  const recentLogs = React.useMemo(() => {
    return logs
      ?.slice(0, 10)
      ?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [logs]);

  if (isLoading) {
    return <ActivityLogSkeleton />;
  }

  if (!logs?.length) {
    return <EmptyActivityLog />;
  }

  return (
    <Card className="hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-md">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-railway-accent" />
            <span>Recent Activity</span>
          </div>
          <Badge variant="outline">{logs.length} Events</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3 pr-4">
            {recentLogs?.map((log, index) => (
              <ActivityLogItem key={`${log.checkpoint}-${log.timestamp}-${index}`} log={log} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Separated components for better organization and reusability
function ActivityLogSkeleton() {
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

function EmptyActivityLog() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-md">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-railway-gray" />
            <span>Recent Activity</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-8 text-center">
        <Clock className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No recent activity available
        </p>
      </CardContent>
    </Card>
  );
}

function ActivityLogItem({ log }: { log: ActivityLog }) {
  const statusColorClass = getStatusColor(log.status);
  const formattedTime = React.useMemo(() => formatTimestamp(log.timestamp), [log.timestamp]);
  
  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-railway-primary rounded-lg hover:bg-gray-100 dark:hover:bg-railway-primary/80 transition-colors group">
      <Circle className={`w-2 h-2 rounded-full mt-2 ${statusColorClass.split(' ')[0]}`} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900 dark:text-white">
              {log.checkpoint}
            </span>
            <span className={`px-2 py-1 ${statusColorClass}/10 dark:${statusColorClass}/20 ${statusColorClass.split(' ')[1]} text-xs font-medium rounded-full`}>
              {log.status}
            </span>
          </div>
          {/* <Tooltip content="Copy timestamp">
            <button 
              onClick={() => navigator.clipboard.writeText(formattedTime)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Copy className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          </Tooltip> */}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formattedTime}
        </p>
      </div>
    </div>
  );
}
