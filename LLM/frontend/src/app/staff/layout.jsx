export const metadata = {
    title: "WTS Travel - Staff Dashboard",
    description: "Staff dashboard for managing customer support tickets",
  }
  
  export default function StaffLayout({ children }) {
    return (
      <div className="min-h-screen bg-white">
        {/* Top Navigation Bar */}
        <header className="bg-white text-black py-4 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">WTS Travel Staff Portal</h1>
              <p className="text-sm text-gray-600">Staff Access</p>
              
              <nav className="mt-2">
                <ul className="flex space-x-6">
                  <li>
                    <a href="/staff" className="text-[#3eafdb] hover:underline">
                      Tickets
                    </a>
                  </li>
                  <li>
                    <a href="/" className="text-gray-700 hover:underline">
                      Chat Interface
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-700 hover:underline">
                      Staff Account
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main>
          {children}
        </main>
      </div>
    )
  }