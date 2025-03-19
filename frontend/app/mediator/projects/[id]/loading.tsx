export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <div className="h-4 w-32 bg-muted rounded animate-pulse mb-4"></div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="h-8 w-64 bg-muted rounded animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-muted rounded animate-pulse"></div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
            <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="border rounded-lg p-6 space-y-4">
            <div className="h-6 w-48 bg-muted rounded animate-pulse mb-2"></div>
            <div className="h-4 w-full bg-muted rounded animate-pulse"></div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                  <div className="h-5 w-32 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <div className="h-6 w-48 bg-muted rounded animate-pulse mb-6"></div>

            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div>
                    <div>
                      <div className="h-5 w-48 bg-muted rounded animate-pulse mb-2"></div>
                      <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-6 space-y-4">
            <div className="h-6 w-36 bg-muted rounded animate-pulse mb-2"></div>

            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 w-full bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-6 space-y-4">
            <div className="h-6 w-36 bg-muted rounded animate-pulse mb-2"></div>
            <div className="h-32 w-full bg-muted rounded animate-pulse"></div>
            <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

