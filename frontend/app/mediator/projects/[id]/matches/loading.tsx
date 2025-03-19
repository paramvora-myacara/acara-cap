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

      <div className="space-y-6">
        <div className="border rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="h-6 w-48 bg-muted rounded animate-pulse mb-2"></div>
              <div className="h-4 w-36 bg-muted rounded animate-pulse"></div>
            </div>

            <div className="flex gap-2">
              <div className="h-9 w-48 bg-muted rounded animate-pulse"></div>
              <div className="h-9 w-32 bg-muted rounded animate-pulse"></div>
              <div className="h-9 w-20 bg-muted rounded animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between">
                  <div>
                    <div className="h-5 w-36 bg-muted rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                  </div>
                  <div className="h-6 w-12 bg-muted rounded animate-pulse"></div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-8 bg-muted rounded animate-pulse"></div>
                  </div>
                  <div className="h-2 w-full bg-muted rounded animate-pulse"></div>
                </div>

                <div className="flex gap-2">
                  <div className="h-8 w-full bg-muted rounded animate-pulse"></div>
                  <div className="h-8 w-full bg-muted rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

