import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Repository } from '@/types/repositorys-list'
import { useState } from 'react'
import { usePullRequest } from '@/hooks/usePullRequest'
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer'
import { useMediaQuery } from '@/hooks/useMidiaQuery'
import { User } from '@/types/live-pr-response'
import { UseQueryResult } from '@tanstack/react-query'
import { AxiosResponse, AxiosError } from 'axios'

export function RepositorySelector({
  repositorys,
  pr,
}: {
  repositorys: Repository[]
  pr: UseQueryResult<AxiosResponse<User>, AxiosError<User>>
}) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string[]>(
    JSON.parse(localStorage.getItem('githubRepos') ?? '') ?? [],
  )

  const handleSetValue = (val: string) => {
    if (value.includes(val)) {
      value.splice(value.indexOf(val), 1)
      setValue(() => {
        const filteredValue = value.filter((item) => item !== val)
        localStorage.setItem('githubRepos', JSON.stringify(filteredValue))
        return filteredValue
      })
    } else {
      setValue((prevValue) => {
        const newValue = [...prevValue, val]
        localStorage.setItem('githubRepos', JSON.stringify(newValue))
        return newValue
      })
    }
  }

  if (isDesktop) {
    return (
      <Popover
        open={open}
        onOpenChange={() => {
          setOpen((prev) => !prev)
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="mt-5 flex h-max max-h-32 min-h-14 max-w-96"
          >
            <div className="flex max-h-32 flex-wrap items-center justify-start gap-2 overflow-y-auto py-2">
              {value?.length
                ? value.map((val: string, i: number) => (
                    <div
                      key={i}
                      className="rounded-xl border bg-secondary px-2 py-1 text-xs font-medium"
                    >
                      {
                        repositorys.find(
                          (repository) => repository.full_name === val,
                        )?.full_name
                      }
                    </div>
                  ))
                : 'Select a repository...'}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0">
          <Command>
            <CommandInput placeholder="Select a repository..." />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {repositorys.map((repository) => (
                  <CommandItem
                    key={repository.full_name}
                    value={repository.full_name}
                    onSelect={() => {
                      handleSetValue(repository.full_name)
                      pr.refetch()
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value.includes(repository.full_name)
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    {repository.full_name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex h-max max-h-32 min-h-14 max-w-96 overflow-auto"
        >
          <div className="flex h-full flex-wrap items-center justify-start gap-2 overflow-auto py-2">
            {value?.length
              ? value.map((val: string, i: number) => (
                  <div
                    key={i}
                    className="rounded-xl border bg-secondary px-2 py-1 text-xs font-medium"
                  >
                    {
                      repositorys.find(
                        (repository) => repository.full_name === val,
                      )?.full_name
                    }
                  </div>
                ))
              : 'Select a repository...'}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <Command>
            <CommandInput placeholder="Select a repository..." />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {repositorys.map((repository) => (
                  <CommandItem
                    key={repository.full_name}
                    value={repository.full_name}
                    onSelect={() => {
                      handleSetValue(repository.full_name)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value.includes(repository.full_name)
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    {repository.full_name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
