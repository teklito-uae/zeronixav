export default function SolutionsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[210px_210px_auto] gap-4 lg:gap-5 animate-pulse">
      <div className="rounded-xl lg:col-span-2 lg:row-span-2 min-h-[300px] bg-bg-surface" />
      <div className="rounded-xl min-h-[190px] bg-bg-surface" />
      <div className="rounded-xl min-h-[190px] bg-bg-surface" />
      <div className="rounded-xl min-h-[190px] bg-bg-surface" />
      <div className="rounded-xl min-h-[190px] bg-bg-surface" />
      <div className="rounded-xl lg:col-span-4 min-h-[150px] bg-bg-surface" />
    </div>
  )
}
