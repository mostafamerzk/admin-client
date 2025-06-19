/**
 * Dashboard API Tests
 * 
 * Tests for dashboard API transformations and response handling
 */

import { dashboardApi } from '../dashboardApi';
import type { 
  DashboardStatsResponse, 
  SalesDataResponse, 
  UserGrowthResponse, 
  CategoryDistributionResponse 
} from '../../types';

// Mock the API client
jest.mock('../../../../api', () => ({
  get: jest.fn(),
}));

import apiClient from '../../../../api';

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('Dashboard API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashboardStats', () => {
    it('should transform backend response to frontend format', async () => {
      const mockBackendResponse: DashboardStatsResponse = {
        totalUsers: 6,
        totalSuppliers: 19,
        totalOrders: 68,
        totalRevenue: 13485370,
        pendingVerifications: 9,
        activeUsers: 4,
        monthlyGrowth: {
          users: 0,
          orders: -8.7,
          revenue: -99.9
        }
      };

      mockApiClient.get.mockResolvedValue({ data: mockBackendResponse });

      const result = await dashboardApi.getDashboardStats();

      expect(result.summary).toEqual({
        totalUsers: 6,
        totalSuppliers: 19,
        totalOrders: 68,
        totalRevenue: 13485370,
        pendingVerifications: 9,
        activeUsers: 4,
      });

      expect(result.monthlyGrowth).toEqual({
        users: 0,
        orders: -8.7,
        revenue: -99.9
      });

      expect(result.revenueData).toBeDefined();
      expect(result.userGrowth).toBeDefined();
      expect(result.categoryDistribution).toBeDefined();
    });
  });

  describe('getSalesData', () => {
    it('should transform backend sales response to frontend format', async () => {
      const mockBackendResponse: SalesDataResponse = {
        period: "month",
        data: [
          {
            date: "2025-06-04",
            sales: 300,
            orders: 1
          },
          {
            date: "2025-06-16", 
            sales: 1100,
            orders: 2
          }
        ],
        total: 8200,
        growth: 0
      };

      mockApiClient.get.mockResolvedValue({ data: mockBackendResponse });

      const result = await dashboardApi.getSalesData('month');

      expect(result).toEqual([
        {
          date: "2025-06-04",
          amount: 300,
          orders: 1
        },
        {
          date: "2025-06-16",
          amount: 1100,
          orders: 2
        }
      ]);
    });
  });

  describe('getUserGrowth', () => {
    it('should transform backend user growth response to frontend format', async () => {
      const mockBackendResponse: UserGrowthResponse = {
        period: "month",
        data: [
          {
            date: "2025-06-04",
            newUsers: 1,
            totalUsers: 6
          }
        ],
        growth: 0
      };

      mockApiClient.get.mockResolvedValue({ data: mockBackendResponse });

      const result = await dashboardApi.getUserGrowth('month');

      expect(result).toEqual([
        {
          date: "2025-06-04",
          users: 6,
          newUsers: 1,
          totalUsers: 6
        }
      ]);
    });
  });

  describe('getCategoryDistribution', () => {
    it('should transform backend category response to chart format', async () => {
      const mockBackendResponse: CategoryDistributionResponse[] = [
        {
          category: "Test",
          count: 8,
          percentage: 66.7,
          revenue: 1900
        },
        {
          category: "Category for mohammed Alaa",
          count: 4,
          percentage: 33.3,
          revenue: 295400
        }
      ];

      mockApiClient.get.mockResolvedValue({ data: mockBackendResponse });

      const result = await dashboardApi.getCategoryDistribution();

      expect(result.labels).toEqual(["Test", "Category for mohammed Alaa"]);
      expect(result.datasets[0].data).toEqual([8, 4]);
      expect(result.datasets[0].backgroundColor).toHaveLength(2);
      expect(result.datasets[0].borderWidth).toBe(1);
    });
  });
});
