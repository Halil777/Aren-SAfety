import { API_CONFIG } from './api.config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string | null;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isSuperAdmin: boolean;
    tenants?: Array<{
      tenantId: string;
      tenantName: string;
      tenantSlug: string;
      role: 'employee' | 'tenant_admin';
      isActive: boolean;
      invitedAt: string;
    }>;
    currentTenantId?: string;
    position?: string;
    department?: string;
    safetyRole?: string;
    employeeNumber?: string;
    projectIds?: string[];
    createdAt: string;
    updatedAt: string;
  };
}

export class AuthService {
  private static TOKEN_KEY = '@safety_token';
  private static USER_KEY = '@safety_user';
  private static TENANT_ID_KEY = '@safety_tenant_id';

  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log('🔐 Login attempt for:', credentials.login);
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Login failed:', data.message);
        throw new Error(data.message || 'Неверные учетные данные');
      }

      console.log('✅ Login successful!');
      console.log('  User ID:', data.user?.id);
      console.log('  User Name:', `${data.user?.firstName} ${data.user?.lastName}`);
      console.log('  Current Tenant ID:', data.user?.currentTenantId);
      console.log('  Tenants:', data.user?.tenants?.map((t: any) => `${t.tenantName} (${t.tenantId})`));

      // Store token, user data, and tenant ID
      await this.storeToken(data.token);
      await this.storeUser(data.user);

      // Store tenant ID if available
      if (data.user.currentTenantId) {
        console.log('💾 Storing tenant ID:', data.user.currentTenantId);
        await this.storeTenantId(data.user.currentTenantId);
      } else {
        console.warn('⚠️ No currentTenantId in login response');
      }

      return data;
    } catch (error) {
      console.error('❌ Login error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Не удалось подключиться к серверу');
    }
  }

  static async storeToken(token: string): Promise<void> {
    await AsyncStorage.setItem(this.TOKEN_KEY, token);
  }

  static async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(this.TOKEN_KEY);
  }

  static async storeUser(user: any): Promise<void> {
    await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static async getUser(): Promise<any | null> {
    const userStr = await AsyncStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  static async storeTenantId(tenantId: string): Promise<void> {
    await AsyncStorage.setItem(this.TENANT_ID_KEY, tenantId);
  }

  static async getTenantId(): Promise<string | null> {
    return await AsyncStorage.getItem(this.TENANT_ID_KEY);
  }

  private static async ensureTenantIdFromUser(): Promise<string | null> {
    let tenantId = await this.getTenantId();
    if (tenantId) return tenantId;

    const user = await this.getUser();
    const candidate = user?.currentTenantId || user?.tenants?.[0]?.tenantId;
    if (candidate) {
      await this.storeTenantId(candidate);
      tenantId = candidate;
    }
    return tenantId;
  }

  static async getUserRole(): Promise<'employee' | 'tenant_admin' | null> {
    const user = await this.getUser();
    if (!user || !user.tenants || user.tenants.length === 0) {
      return null;
    }
    // Return the role from the first tenant (or current tenant if needed)
    return user.tenants[0].role;
  }

  static async logout(): Promise<void> {
    await AsyncStorage.removeItem(this.TOKEN_KEY);
    await AsyncStorage.removeItem(this.USER_KEY);
    await AsyncStorage.removeItem(this.TENANT_ID_KEY);
  }

  static async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  }

  static async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.getToken();
    const tenantId = await this.ensureTenantIdFromUser();

    console.log('🔑 Auth Headers Debug:');
    console.log('  Token:', token ? `${token.substring(0, 20)}...` : 'None');
    console.log('  Tenant ID:', tenantId || 'None');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (tenantId) {
      // Use same capitalization as admin panel
      headers['X-Tenant-Id'] = tenantId;
    }

    console.log('  Headers:', JSON.stringify(headers, null, 2));

    return headers;
  }
}
