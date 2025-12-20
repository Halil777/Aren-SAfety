import { API_CONFIG } from './api.config';
import { AuthService } from './auth.service';

export interface Category {
  id: string;
  projectCode: string;
  title_ru: string;
  title_en?: string;
  title_tr?: string;
}

export interface Branch {
  id: string;
  projectCode: string;
  title_ru: string;
  title_en?: string;
  title_tr?: string;
}

export interface Employee {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'manager' | 'user' | 'viewer';
  department?: string;
  position?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ObservationPayload {
  projectCode: string;
  nameSurname: string;
  department: string;
  nonconformityType: string;
  observationDate: string;
  riskLevel: number;
  status: string;
  deadline: string;
  task?: string;
  upperCategory?: string;
  lowerCategory?: string;
  description_en?: string;
  description_ru?: string;
  description_tr?: string;
  supervisorId?: string;
  createdBy?: string;
  createdById?: string;
  images?: string[];
  videos?: string[];
}

export interface ObservationRecord extends ObservationPayload {
  id: string;
}

const withAuthHeaders = async () => {
  const headers = await AuthService.getAuthHeaders();
  return {
    ...API_CONFIG.HEADERS,
    ...headers,
  };
};

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    let message = 'Не удалось выполнить запрос';
    try {
      const errorData = await res.text();
      console.error('❌ API Error Response:', errorData);
      console.error('❌ Status:', res.status);
      console.error('❌ Status Text:', res.statusText);
      message = errorData || message;
    } catch (e) {
      console.error('Failed to parse error response:', e);
    }
    throw new Error(`${res.status}: ${message}`);
  }
  const data = await res.json();
  console.log('✅ API Response received:', Array.isArray(data) ? `Array with ${data.length} items` : 'Object');
  return data;
};

export const ObservationsService = {
  async fetchCategories(): Promise<Category[]> {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORIES}`;
      console.log('📂 Fetching categories from:', url);
      const headers = await withAuthHeaders();
      console.log('📂 With headers:', headers);
      const res = await fetch(url, { headers });
      return handleResponse(res);
    } catch (error) {
      console.error('❌ fetchCategories error:', error);
      throw error;
    }
  },

  async fetchBranches(): Promise<Branch[]> {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BRANCHES}`;
      console.log('🌿 Fetching branches from:', url);
      const headers = await withAuthHeaders();
      console.log('🌿 With headers:', headers);
      const res = await fetch(url, { headers });
      return handleResponse(res);
    } catch (error) {
      console.error('❌ fetchBranches error:', error);
      throw error;
    }
  },

  async fetchSupervisors(): Promise<Employee[]> {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`;
      console.log('👥 Fetching users from:', url);
      const headers = await withAuthHeaders();
      console.log('👥 With headers:', headers);
      const res = await fetch(url, { headers });
      const data: Employee[] = await handleResponse(res);
      console.log('👥 Total users fetched:', data.length);

      // Filter for supervisors based on position field
      const supervisors = data.filter((user) => {
        const pos = user.position || '';
        const posLower = pos.toLowerCase();
        return posLower === 'supervisor' || posLower.includes('supervisor');
      });
      console.log('👥 Filtered supervisors:', supervisors.length);

      if (supervisors.length > 0) {
        console.log('👥 Supervisors found:');
        supervisors.forEach(sup => {
          console.log(`  - ${sup.firstName} ${sup.lastName} (${sup.position})`);
        });
      }

      return supervisors;
    } catch (error) {
      console.error('❌ fetchSupervisors error:', error);
      throw error;
    }
  },

  async fetchObservations(): Promise<ObservationRecord[]> {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.OBSERVATIONS}`;
      console.log('Fetching observations from:', url);
      const res = await fetch(url, {
        headers: await withAuthHeaders(),
      });
      return handleResponse(res);
    } catch (error) {
      console.error('fetchObservations error:', error);
      throw error;
    }
  },

  async createObservation(payload: ObservationPayload): Promise<ObservationRecord> {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.OBSERVATIONS}`;
      console.log('Creating observation at:', url);
      const res = await fetch(url, {
        method: 'POST',
        headers: await withAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    } catch (error) {
      console.error('createObservation error:', error);
      throw error;
    }
  },
};
