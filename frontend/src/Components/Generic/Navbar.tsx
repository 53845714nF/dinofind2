import logo from "../../Assets/Images/logo_transparent.png"

const Navbar = () => {
  return (
    <nav className="bg-white shadow pt-5 pb-3">
      <div className="max-w-7xl mx-auto px-7 flex items-center gap-x-28">
        <div className="flex items-center space-x-1">
          <img src={logo} alt="DinoFind Logo" className="h-10 w-10" />
          <span className="text-xl font-semibold text-gray-800">DinoFind</span>
        </div>
        <div className="flex space-x-6">
          <a href="/" className="text-blue-700 text-lg hover:underline">Search</a>
          <a href="/technology" className="text-blue-700 text-lg hover:underline">Technology</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;