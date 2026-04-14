import { Loader2 } from 'lucide-react'

export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
      <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
    </div>
  )
}
