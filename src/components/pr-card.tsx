import { Data } from '@/App'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@radix-ui/react-tooltip'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card } from './ui/card'

export function PrCard({ pr }: { pr: Data }) {
  return (
    <Card className="h-28 p-3">
      <section className="flex flex-col items-start justify-center overflow-hidden">
        <div className="mb-1 flex w-full justify-between">
          <span className="capitalize">{pr.Repo}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="overflow-hidden">
                  <AvatarImage
                    className="w-5 rounded-full"
                    src={`https://github.com/${pr.AuthorLogin}.png`}
                  />
                  <AvatarFallback>{pr.AuthorLogin}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent className="rounded-md bg-secondary p-2 text-xs">
                <a
                  href={`https://github.com/${pr.AuthorLogin}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {pr.AuthorLogin}
                </a>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button asChild variant="link" className="h-fit p-0">
          <a
            href={pr.PrURL}
            className="truncate"
            target="_blank"
            rel="noreferrer"
          >
            {pr.Title}
          </a>
        </Button>
      </section>
      <Badge
        variant={
          pr.ContributorType === 'FIRST_TIME_CONTRIBUTOR'
            ? 'destructive'
            : 'default'
        }
        className="mt-3 capitalize"
      >
        {pr.ContributorType.toLowerCase().replace(/_/g, ' ')}
      </Badge>
    </Card>
  )
}
