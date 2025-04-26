import axios from 'axios'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export function useAuth(): [boolean, Dispatch<SetStateAction<boolean>>] {
  const [isLoged, setIsLoged] = useState(!!localStorage.getItem('githubToken'))
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  })

  useEffect(() => {
    const location = window.location.search
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
  })

  return [isLoged, setIsLoged]
}
