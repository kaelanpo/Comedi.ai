import { CalendarIcon } from "lucide-react"

export function HoverCardDemo() {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg w-full max-w-xl mx-auto">
      <div className="text-lg text-gray-800 mb-4">
        I'm reading a book on anti-gravity.
        <br />
        It's impossible to put down!
      </div>
      <div className="flex justify-between w-full">
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Regenerate
        </button>
        <div className="text-gray-500 self-center">
          Too wakty
        </div>
      </div>
    </div>
  )
} 