import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Skeleton className="h-10 w-[300px] mb-2" />
        <Skeleton className="h-4 w-[250px]" />
      </div>

      <div className="mb-6">
        <Skeleton className="h-10 w-full max-w-[500px] mb-6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-[140px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[40px]" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[60px]" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-[80px]" />
                        <Skeleton className="h-3 w-[60px]" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[60px]" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-[80px]" />
                        <Skeleton className="h-3 w-[60px]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-[70px]" />
                    <Skeleton className="h-4 w-[50px]" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-[70px]" />
                    <Skeleton className="h-4 w-[50px]" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Skeleton className="h-9 w-full" />
                <div className="flex gap-2 w-full">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  )
}

