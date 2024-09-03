import { useQuery } from '@tanstack/react-query'
import axios, { AxiosPromise } from 'axios'
import { useEffect, useState } from 'react'
import { ModeToggle } from './components/mode-toggle'
import { Button } from './components/ui/button'
import { Skeleton } from './components/ui/skeleton'
import { SkeletonPrCard } from './components/skeleton-pr-card'
import { AuthButton } from './components/auth-button'
import { PrCard } from './components/pr-card'

export type Data = {
  Repo: string
  Title: string
  ContributorType: string
  AuthorLogin: string
  CratedAt: string
  UpdatedAt: string
  Reviewers: string[]
  PrURL: string
}

type Error = {
  Type: string
  Messege: string
}

export type User = {
  UserLogin: string
  Data: Data[]
  Error: Error
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

async function fetchData(): AxiosPromise<User> {
  const response = await instance.get<User>('/github/pullrequests', {
    params: {
      code: JSON.parse(localStorage.getItem('githubToken') ?? ''),
    },
  })
  return response
}

function App() {
  const location = window.location.search

  const [isLoged, setIsLoged] = useState(!!localStorage.getItem('githubToken'))
  useEffect(() => {
    const params = new URLSearchParams(location)
    const codeValue = params.get('code')

    if (codeValue) {
      // Faça a requisição usando o Axios
      instance
        .get('/auth/github', {
          params: {
            code: codeValue,
          },
        })
        .then((response) => {
          localStorage.setItem('githubToken', JSON.stringify(response.data))
          window.location.replace('/')
        })
        .catch((error) => {
          console.error('Erro ao fazer a requisição:', error)
        })
    }
  }, [location])
  const { isLoading, isError, data, error, isSuccess } = useQuery({
    queryKey: ['user-pr'],
    queryFn: fetchData,
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 5 * 1000,
    enabled: isLoged,
  })

  if (isError) {
    return (
      <div className="mx-auto flex h-[600px] w-[728px] flex-col items-center justify-center gap-2">
        <h1 className="text-2xl">Live Prs</h1>
        <nav className="flex w-3/5 items-center justify-between">
          <div></div>
          <ModeToggle />
        </nav>
        <section>
          <p className="w-64 text-justify">
            Poxa... Parece que aconteceu um {error.message} na aplicação,
            geralmente ele se resolve reiniciando a extensão/site ou logando
            novamente, caso o erro persista entre em contato com o ADM
          </p>
        </section>
        <AuthButton type="login" />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex h-[600px] w-[728px] flex-col items-center justify-center gap-2">
        <h1 className="text-2xl">Live Prs</h1>
        <nav className="flex w-3/5 items-center justify-between">
          <span className="flex">
            User: {` `}
            <Skeleton className="ml-2 h-7 w-16" />
          </span>

          <div className="flex items-center gap-2">
            <AuthButton type="logout" setIsLoged={setIsLoged} />
            <ModeToggle />
          </div>
        </nav>
        <ul className="mt-4 flex h-2/3 flex-col gap-3 overflow-auto p-3 px-6">
          <SkeletonPrCard />
          <SkeletonPrCard />
          <SkeletonPrCard />
          <SkeletonPrCard />
          <SkeletonPrCard />
          <SkeletonPrCard />
          <SkeletonPrCard />
        </ul>
      </div>
    )
  }

  if (isSuccess && isLoged) {
    return (
      <div className="mx-auto flex h-[600px] w-[728px] flex-col items-center justify-center gap-2">
        <h1 className="text-2xl">Live Prs</h1>
        <nav className="flex w-3/5 items-center justify-between">
          <p>
            User: {` `}
            <Button asChild variant="link" className="p-0">
              {data.data.UserLogin}
            </Button>
          </p>

          <div className="flex items-center gap-2">
            <AuthButton type="logout" setIsLoged={setIsLoged} />
            <ModeToggle />
          </div>
        </nav>
        {!data.data.Data && (
          <h3 className="mt-6">Você ainda não tem prs para revisar</h3>
        )}
        <ul className="mt-4 flex h-2/3 flex-col gap-3 overflow-auto p-3 px-6">
          {data.data.Data?.map((pr) => {
            return (
              <li key={pr.Title}>
                <PrCard pr={pr} />
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
  return (
    <div className="mx-auto flex h-[600px] w-[728px] flex-col items-center justify-center gap-2">
      <h1 className="text-2xl">Live Prs</h1>
      <nav className="flex w-3/5 items-center justify-between">
        <div></div>
        <ModeToggle />
      </nav>
      <section>
        <p className="w-64 text-justify">
          Seja bem vindo ao <strong>LivePrs</strong> para exibir os pull
          requests que solicitaram sua revisão, clique no botão de login e entre
          com sua conta do github
        </p>
      </section>
      <AuthButton type="login" />
    </div>
  )
}

export default App
