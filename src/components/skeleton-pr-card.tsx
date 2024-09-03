import { Card } from './ui/card'
import { Skeleton } from './ui/skeleton'

export function SkeletonPrCard() {
  return (
    <li>
      <Card className="h-28 w-80 p-3">
        <section className="flex flex-col items-start justify-center gap-3 overflow-hidden">
          <div className="mb-1 flex w-full justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-5" />
          </div>
          <Skeleton className="h-5 w-40" />
        </section>
        <Skeleton className="mt-3 h-5 w-40" />
      </Card>
    </li>
  )
}
