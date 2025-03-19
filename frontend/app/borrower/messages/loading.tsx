import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-64px)] bg-background">
      {/* Conversations List */}
      <div className="w-full md:w-80 lg:w-96 border-r flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full mb-4" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="p-4 border-b">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Conversation Detail */}
      <div className="flex-1 flex flex-col h-full">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <Skeleton className="h-10 w-10 rounded-full mr-3" />
            <div>
              <Skeleton className="h-5 w-40 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex justify-center my-4">
            <Skeleton className="h-6 w-32" />
          </div>

          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                <div className={`flex max-w-[75%] ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                  {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full mr-2 self-end" />}
                  <div>
                    <Skeleton className={`h-20 w-64 rounded-lg`} />
                    <div className={`flex items-center mt-1 ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Skeleton className="h-[60px] w-full" />
            <Skeleton className="h-10 w-10 self-end" />
          </div>
        </div>
      </div>
    </div>
  )
}

