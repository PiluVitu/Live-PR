import { User } from '@/types/live-pr-response'
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError, AxiosPromise, AxiosResponse } from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

async function fetchData(): AxiosPromise<User> {
  const response = await instance.post<User>(
    '/github/pullrequests',
    localStorage.getItem('githubRepos'),
    {
      params: {
        code: JSON.parse(localStorage.getItem('githubToken') ?? ''),
      },
    },
  )

  return response
}

export function usePullRequest(isLoged: boolean) {
  const query = useQuery<AxiosResponse<User>, AxiosError<User>>({
    queryKey: ['user-pr'],
    queryFn: fetchData,
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 5 * 1000,
    enabled: isLoged,
  })

  return query
}
