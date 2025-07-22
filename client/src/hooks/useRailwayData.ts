import { useQuery } from "@tanstack/react-query";
import { getStatus, getSpeedData, getSpeedHistory } from "@/lib/api";

export function useRailwayStatus() {
  return useQuery({
    queryKey: ['/railway/status'],
    queryFn: getStatus,
    refetchInterval: 2000,
    staleTime: 1000,
    gcTime: 5000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useSpeedData() {
  return useQuery({
    queryKey: ['/railway/speed'],
    queryFn: () => getSpeedData(1),
    refetchInterval: 2000,
    staleTime: 1000,
    gcTime: 5000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useSpeedHistory() {
  return useQuery({
    queryKey: ['/railway/speed/history'],
    queryFn: () => getSpeedHistory(20),
    refetchInterval: 10000, // Less frequent updates for history
    staleTime: 5000,
    gcTime: 30000,
    retry: 2,
  });
}
