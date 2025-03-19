import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Skeleton className="h-10 w-32 mb-4" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-48" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="lender">Lender</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-72" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Skeleton className="h-6 w-36 mb-4" />
                      <div className="space-y-4">
                        {Array(6)
                          .fill(0)
                          .map((_, i) => (
                            <div key={i}>
                              <Skeleton className="h-4 w-24 mb-1" />
                              <Skeleton className="h-5 w-48" />
                            </div>
                          ))}
                      </div>
                    </div>
                    <div>
                      <Skeleton className="h-6 w-36 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-2 w-full mb-6" />

                      <div className="space-y-6">
                        {Array(4)
                          .fill(0)
                          .map((_, i) => (
                            <div key={i}>
                              <Skeleton className="h-4 w-32 mb-1" />
                              <Skeleton className="h-2 w-full mb-1" />
                              <Skeleton className="h-3 w-3/4" />
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6 mt-1" />
                    <Skeleton className="h-4 w-4/6 mt-1" />
                  </div>

                  <div className="mt-6">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Array(2)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton key={i} className="h-48 w-full" />
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-36" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex">
                      <Skeleton className="h-10 w-10 rounded-full mr-4" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-48 mb-1" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-start">
                      <Skeleton className="h-6 w-6 rounded-full mr-3 mt-0.5" />
                      <div>
                        <Skeleton className="h-5 w-40 mb-1" />
                        <Skeleton className="h-4 w-64" />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

