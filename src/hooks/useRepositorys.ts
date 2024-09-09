import { Repository } from '@/types/repositorys-list'
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosPromise } from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

async function fetchData(): AxiosPromise<Repository> {
  const response = await instance.get('/github/repos', {
    params: {
      code: JSON.parse(localStorage.getItem('githubToken') ?? ''),
    },
  })

  return response
}

export function useRepository(isLoged: boolean) {
  const query = useQuery({
    queryKey: ['user-repositorys'],
    queryFn: fetchData,
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 5 * 1000,
    enabled: isLoged,
  })

  return query
}
