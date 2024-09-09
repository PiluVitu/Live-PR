import { Button } from './components/ui/button'
import { Skeleton } from './components/ui/skeleton'
import { SkeletonPrCard } from './components/skeleton-pr-card'
import { AuthButton } from './components/auth-button'
import { PrCard } from './components/pr-card'
import { RepositorySelector } from './components/repository-selector'
import { useAuth } from './hooks/useAuth'
import { usePullRequest } from './hooks/usePullRequest'
import { useRepository } from './hooks/useRepositorys'
import { SettingsButton } from './components/settings'

function App() {
  const [isLoged, setIsLoged] = useAuth()
  const pullRequest = usePullRequest(!!isLoged)
  const repository = useRepository(!!isLoged)

  if ((repository.isError || pullRequest.isError) && isLoged) {
    if (pullRequest.error?.response?.data.Error.Type === 'missing reviews') {
      return (
        <div className="mx-auto flex h-screen max-w-5xl flex-col items-center justify-center gap-2">
          <h1 className="text-2xl">Live Prs</h1>
          <nav className="flex w-3/5 items-center justify-between">
            <div></div>
            <SettingsButton>
              <></>
              <></>
            </SettingsButton>
          </nav>
          <section>
            <p className="w-64 text-justify">
              Poxa... parece que você selecionou um ou mais repoisitorios que
              não tem prs requisitando a sua revisão, por favor selecione outros
              repositorios que tenham solicitado seus reviews, para usar a
              aplicação
            </p>
          </section>
          <RepositorySelector
            pr={pullRequest}
            repositorys={
              Array.isArray(repository.data?.data) ? repository.data?.data : []
            }
          />
        </div>
      )
    }

    return (
      <div className="mx-auto flex h-screen max-w-5xl flex-col items-center justify-center gap-2">
        <h1 className="text-2xl">Live Prs</h1>
        <nav className="flex w-3/5 items-center justify-between">
          <div></div>
          <SettingsButton>
            <></>
            <></>
          </SettingsButton>
        </nav>
        <section>
          <p className="w-64 text-justify">
            Poxa... Parece que aconteceu um erro{' '}
            {pullRequest.error?.response?.data.Error.Type
              ? 'de ' + pullRequest.error?.response?.data.Error.Type
              : ''}{' '}
            na aplicação, geralmente ele se resolve reiniciando a extensão/site
            ou logando novamente, caso o erro persista entre em contato com o
            ADM
          </p>
        </section>
        <AuthButton type="login" />
      </div>
    )
  }

  if (repository.isSuccess && pullRequest.isError) {
    return (
      <div className="mx-auto flex h-screen max-w-5xl flex-col items-center justify-center gap-2">
        <h1 className="text-2xl">Live Prs</h1>
        <nav className="flex w-3/5 items-center justify-between">
          <div></div>
          <SettingsButton>
            <AuthButton type="logout" setIsLoged={setIsLoged} />
            <></>
          </SettingsButton>
        </nav>
        <section>
          <p className="w-64 text-justify">
            Poxa... parece que você ainda não selecionou nenhum repositório,
            selecione abaixo algum que você gostaria que aparecesse todos os PRs
            que requisitaram o seu review.
          </p>
        </section>
        <RepositorySelector
          pr={pullRequest}
          repositorys={
            Array.isArray(repository.data?.data) ? repository.data?.data : []
          }
        />
      </div>
    )
  }
  if (pullRequest.isLoading || repository.isLoading) {
    return (
      <div className="mx-auto flex h-screen max-w-5xl flex-col items-center justify-center gap-2">
        <h1 className="text-2xl">Live Prs</h1>
        <nav className="flex w-3/5 items-center justify-between">
          <span className="flex">
            User: {` `}
            <Skeleton className="ml-2 h-7 w-16" />
          </span>

          <SettingsButton>
            <AuthButton type="logout" setIsLoged={setIsLoged} />
            <></>
          </SettingsButton>
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

  if (pullRequest.isSuccess && isLoged) {
    return (
      <div className="mx-auto flex h-screen max-w-5xl flex-col items-center justify-center gap-2">
        <h1 className="text-2xl">Live Prs</h1>
        <nav className="flex w-3/5 items-center justify-between">
          <p>
            User: {` `}
            <Button variant="link" className="cursor-text p-0">
              {pullRequest?.data?.data?.UserLogin}
            </Button>
          </p>

          <div className="flex items-center gap-2">
            <SettingsButton>
              <AuthButton type="logout" setIsLoged={setIsLoged} />
              <RepositorySelector
                pr={pullRequest}
                repositorys={
                  Array.isArray(repository.data?.data)
                    ? repository.data?.data
                    : []
                }
              />
            </SettingsButton>
          </div>
        </nav>

        <ul className="mt-4 flex h-4/5 flex-col gap-3 overflow-auto p-3 px-6">
          {pullRequest?.data?.data?.Data?.map((pr) => {
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
    <div className="mx-auto flex h-screen max-w-5xl flex-col items-center justify-center gap-2">
      <h1 className="text-2xl">Live Prs</h1>
      <nav className="flex w-3/5 items-center justify-between">
        <div></div>
        <SettingsButton>
          <></>
          <></>
        </SettingsButton>
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
