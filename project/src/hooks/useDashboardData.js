import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import {
  setStats, setPerformanceTrends, setDepartmentPerformance,
  setRecentActivities, setUpcomingTasks, setEmployeeRankings,
  setDashboardStatus,
} from '@/redux/slices/dashboardSlice';
import {
  getDashboardStats, getPerformanceTrends, getDepartmentPerformance,
  getRecentActivities, getUpcomingTasks, getEmployeeRankings,
} from '@/services/dashboardService';

export function useDashboardData(role) {
  const dispatch = useAppDispatch();
  const d = useAppSelector((s) => s.dashboard);

  useEffect(() => {
    let active = true;
    dispatch(setDashboardStatus('loading'));
    Promise.allSettled([
      getDashboardStats(role),
      getPerformanceTrends('weekly'),
      getDepartmentPerformance(),
      getRecentActivities(6),
      getUpcomingTasks(),
      getEmployeeRankings(),
    ]).then(([stats, trends, dept, acts, upcoming, rankings]) => {
      if (!active) return;
      if (stats.status === 'fulfilled') dispatch(setStats(stats.value.data));
      if (trends.status === 'fulfilled') dispatch(setPerformanceTrends(trends.value.data));
      if (dept.status === 'fulfilled') dispatch(setDepartmentPerformance(dept.value.data));
      if (acts.status === 'fulfilled') dispatch(setRecentActivities(acts.value.data));
      if (upcoming.status === 'fulfilled') dispatch(setUpcomingTasks(upcoming.value.data));
      if (rankings.status === 'fulfilled') dispatch(setEmployeeRankings(rankings.value.data));
      dispatch(setDashboardStatus('succeeded'));
    });
    return () => { active = false; };
  }, [dispatch, role]);

  return d;
}
