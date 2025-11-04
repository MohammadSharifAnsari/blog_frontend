import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiFillCloseCircle } from "react-icons/ai";
import {
  Home,
  PlusSquare,
  User,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  FolderOpen,
  Hash,
  Bookmark,
  SquareChevronLeft,
} from "lucide-react";
import { logoutUser } from "../store/authSlice";

const BlogLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // When true, sidebar is hidden even on large screens (like drawer closed)
  const [forceHidden, setForceHidden] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const navigation = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Create Post", icon: PlusSquare, path: "/create-post" },
    { name: "Bookmarks", icon: Bookmark, path: "/bookmarks" },
  ];

  const adminNavigation =
    user?.role === "Admin"
      ? [
          { name: "Dashboard", icon: Settings, path: "/admin/dashboard" },
          { name: "Users", icon: Users, path: "/admin/users" },
          { name: "Categories", icon: FolderOpen, path: "/admin/categories" },
          { name: "Tags", icon: Hash, path: "/admin/tags" },
        ]
      : [];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className=" bg-black lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md  text-black shadow"
      >
        {sidebarOpen ? (
         
 
    // <SquareChevronLeft size={256} color="#000000" />
          <ChevronLeft size={12} color="#000000" />

         
          // <span className="bg-yellow-300">i am side bar</span>
        ) : (
          <Menu size={8} color="#000000" />
          // <span className="bg-yellow-300">i am side bar</span>
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-black text-white transform transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${(forceHidden || isCollapsed) ? "lg:-translate-x-full" : "lg:translate-x-0"} ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className=" flex items-center h-16 border-b border-gray-800 px-4 relative">
            {/* Collapse/expand (placed on the left) */}
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:inline-flex absolute left-2 top-3 items-center justify-center w-8 h-8 rounded-md hover:bg-gray-800 text-gray-300 hover:text-white"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <span className="border-10 border-black bg-black rounded-full p-0 m-0 text-white">
                  <ChevronRight size={30} />
                </span>
              ) : (
                <span className="border-10 border-black bg-black rounded-full p-0 m-0 text-white">
                  <ChevronLeft size={30} />
                </span>
              )}
            </button>

            {/* Logo (centered with left space reserved) */}
            <h2
              className={`mx-auto text-2xl font-bold text-white transition-opacity ${
                isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              BlogApp
            </h2>
            {/* Close button like drawer (desktop & mobile) */}
            {/* Close (placed on the right) */}
            {!isCollapsed&&<button
              type="button"
              onClick={() => {
                setSidebarOpen(false);
                setForceHidden(true);
              }}
              className="bg-black absolute right-2 top-3 inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-800 text-gray-300 hover:text-white  "
              title="Close sidebar"
            >
              <span className="  border-10 border-black bg-black rounded-full p-0 m-0 text-white">
                <AiFillCloseCircle size={30}  /> 
               
              </span>
              </button>}
            
            
          </div>

          {/* Navigation */}
          <nav
            className={`flex-1 overflow-y-auto p-4 space-y-2 ${
              isCollapsed ? "px-2" : "px-4"
            }`}
          >
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : "gap-3"
                } px-4 py-3 rounded-lg transition-colors hover:bg-gray-800`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={20} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            ))}

            {adminNavigation.length > 0 && (
              <>
                <div className="border-t border-gray-800 my-4"></div>
                {!isCollapsed && (
                  <h3 className="px-4 py-2 text-sm font-semibold text-gray-400 uppercase">
                    Admin
                  </h3>
                )}
                {adminNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center ${
                      isCollapsed ? "justify-center" : "gap-3"
                    } px-4 py-3 rounded-lg transition-colors hover:bg-gray-800`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon size={20} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* User section */}
          <div
            className={`border-t border-gray-800 p-4 ${
              isCollapsed ? "px-2" : "px-4"
            }`}
          >
            {isAuthenticated ? (
              <div className="space-y-3">
                <Link
                  to="/profile"
                  className={`flex items-center ${
                    isCollapsed ? "justify-center" : "gap-3"
                  } px-4 py-3 rounded-lg transition-colors hover:bg-gray-800`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <User size={20} />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  )}
                </Link>

                <button
                  onClick={handleLogout}
                  className={`flex items-center text-black ${
                    isCollapsed ? "justify-center" : " justify-center gap-5"
                  } w-full px-4 py-3 rounded-lg transition-colors hover:bg-gray-800 text-left`}
                  >
                    
                    <span className=" text-black">
                  <LogOut size={20} color="#000000" />
                  </span>
                  {!isCollapsed && <span>Logout</span>}
                </button>

              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className={`block w-full px-4 py-2 ${
                    isCollapsed ? "text-center" : "text-center"
                  } bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {isCollapsed ? (
                    <User size={18} className="mx-auto" />
                  ) : (
                    "Login"
                  )}
                </Link>
                <Link
                  to="/register"
                  className={`block w-full px-4 py-2 ${
                    isCollapsed ? "text-center" : "text-center"
                  } border border-white rounded-lg font-semibold hover:bg-gray-800 transition-colors`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {isCollapsed ? "+" : "Register"}
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          (isCollapsed || forceHidden) ? "lg:ml-0" : "lg:ml-64"
        }`}
      >
        <main className="p-4 lg:p-8">{children}</main>
      </div>

      {/* Expand button when collapsed on desktop */}
      {isCollapsed && (
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="hidden lg:flex fixed bottom-6 left-4 z-40 w-10 h-10 items-center justify-center rounded-full bg-black text-white shadow hover:bg-gray-900"
          title="Expand sidebar"
        >
          <span className="border-10 border-black bg-black rounded-full p-0 m-0 text-white">

          <ChevronRight size={18} color="#ffffff" />
          </span>
        </button>
      )}

      {/* Open button when sidebar is fully hidden (desktop) */}
      {forceHidden && (
        <button
          type="button"
          onClick={() => {
            setForceHidden(false);
            setSidebarOpen(true);
          }}
          className="hidden lg:flex fixed top-4 left-4 z-40 p-2 rounded-md bg-white text-black shadow hover:bg-gray-100"
          title="Open sidebar"
        >
          <Menu size={30} color="#000000" />
        </button>
      )}

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default BlogLayout;
