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
        href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_GITHUB}`}
        target="_blank"
        rel="noreferrer"
      >
        LogIn
      </a>
    </Button>
  )
}
