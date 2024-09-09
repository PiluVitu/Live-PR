import { Button } from './ui/button'

export function AuthButton({
  type,
  setIsLoged,
}: {
  type: 'login' | 'logout'
  setIsLoged?: (arg0: boolean) => void
}) {
  if (type === 'logout' && setIsLoged) {
    return (
      <Button
        onClick={() => {
          localStorage.removeItem('githubToken')
          setIsLoged(false)
        }}
      >
        LogOut
      </Button>
    )
  }

  return (
    <Button asChild>
      <a
        href={`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_CLIENT_GITHUB}&scope=repo%20repo:status%20read:org`}
      >
        LogIn
      </a>
    </Button>
  )
}
