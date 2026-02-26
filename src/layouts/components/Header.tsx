import { Link } from 'react-router';
import { Dropdown } from 'react-bootstrap';
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, User } from 'lucide-react';
import { getUrl } from '@/utils/getUrl';
import ThemeSwitcher from './ThemeSwitcher';
import { useSettings } from '@/contexts/SettingsContext';
import { useNavigate } from 'react-router';

const Header = () => {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth/login');
  };

  const { isSidebarFolded, toggleSidebar, toggleMobileSidebar } = useSettings();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <a className="sidebar-toggler" onClick={toggleSidebar} aria-label="Toggle sidebar">
          {isSidebarFolded ? <PanelLeftOpen /> : <PanelLeftClose />}
        </a>

        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <ThemeSwitcher />
          </li>
          <li className="nav-item">
            <Dropdown>
              <Dropdown.Toggle className="nav-link">
                <img
                  className="w-30px h-30px ms-1 rounded-circle"
                  src={getUrl('/images/faces/face.jpg')}
                  alt="profile"
                />
              </Dropdown.Toggle>
              <Dropdown.Menu className="px-0" align="end">
                <div className="d-flex flex-column align-items-center border-bottom px-5 py-3">
                  <div className="mb-3">
                    <img className="w-80px h-80px rounded-circle" src={getUrl('/images/faces/face.jpg')} alt="" />
                  </div>
                  <div className="text-center">
                    <p className="fs-16px fw-bolder">Amiah Burton</p>
                    <p className="fs-12px text-secondary">amiahburton&#64;gmail.com</p>
                  </div>
                </div>
                <ul className="list-unstyled p-1">
                  <li>
                    <Dropdown.Item as={Link} to="/general/profile" className="py-2 d-flex ms-0">
                      <User className="me-2 icon-md" />
                      <span>Profile</span>
                    </Dropdown.Item>
                  </li>
                  <li>
                    <a href="#/" onClick={onLogout} className="dropdown-item py-2 d-flex ms-0">
                      <LogOut className="me-2 icon-md" />
                      <span>Log Out</span>
                    </a>
                  </li>
                </ul>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>

        <a className="sidebar-toggler-mobile" onClick={toggleMobileSidebar} aria-label="Open menu">
          <Menu />
        </a>
      </div>
    </nav>
  );
};

export default Header;
