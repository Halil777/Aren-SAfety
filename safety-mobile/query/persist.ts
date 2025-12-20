import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

export const REACT_QUERY_PERSIST_KEY = "safety-mobile-react-query-cache";

export const queryPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: REACT_QUERY_PERSIST_KEY,
  throttleTime: 1000,
});

export async function clearPersistedQueryCache() {
  await AsyncStorage.removeItem(REACT_QUERY_PERSIST_KEY);
}

