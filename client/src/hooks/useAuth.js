import { useQuery } from '@tanstack/react-query';
import { authKeys, fetchCurrentUser } from '../lib/auth';

export function useAuth() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: fetchCurrentUser,
    retry: false,
  });
}
