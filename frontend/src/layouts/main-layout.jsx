// 37. import outlet from reacter-router-dom
import { Link, Outlet } from 'react-router-dom';

// 38. implement MainLayout component with navigation bar and outlet 
export default function MainLayout(){
  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Donezo</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><button className="btn btn-link">Logout</button></li>
          </ul>
        </div>
      </div>
      <Outlet />
    </>
  )
}