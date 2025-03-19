import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Skeleton className="h-4 w-[100px] mb-4" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Skeleton className="h-10 w-[300px] mb-2" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
          <Skeleton className="h-10 w-[200px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[40px]" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-[80px]" />
                        <Skeleton className="h-4 w-[30px]" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))}
              </div>

              <Skeleton className="h-[150px] w-full" />
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-[150px] mb-2" />
                <Skeleton className="h-4 w-[200px]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="space-y-1">
                          <Skeleton className="h-3 w-[100px]" />
                          <Skeleton className="h-5 w-[120px]" />
                        </div>
                      ))}
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-3 w-[100px]" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-[150px] mb-1" />
                  <Skeleton className="h-4 w-[180px]" />
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px] mb-2" />
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-[120px]" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-[300px] w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-[80px]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[100px]" />
            </CardHeader>
            <CardContent className="space-y-2">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

