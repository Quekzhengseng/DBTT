export default function Loading() {
    return (
      <div className="flex justify-center items-center h-64 mt-10">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-[#3eafdb] rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-[#3eafdb] rounded-full animate-bounce delay-75"></div>
          <div className="w-3 h-3 bg-[#3eafdb] rounded-full animate-bounce delay-150"></div>
        </div>
      </div>
    )
  }
  
  