import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { path: '/dashboard-overview', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/add-transaction', label: 'Add Transaction', icon: 'Plus' },
    { path: '/analytics-dashboard', label: 'Analytics', icon: 'BarChart3' },
    { path: '/transaction-history', label: 'History', icon: 'History' },
  ];

  const isActivePath = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[1000] bg-card border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo */}
          <Link to="/dashboard-overview" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Icon name="DollarSign" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              ExpenseTracker Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-muted ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
          </Button>
        </div>
      </header>
      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[1050] bg-black/50 backdrop-blur-sm md:hidden"
            onClick={closeMobileMenu}
          />
          
          {/* Drawer */}
          <div className="fixed top-0 left-0 z-[1100] w-80 h-full bg-card border-r border-border transform transition-transform duration-300 ease-smooth md:hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Link 
                to="/dashboard-overview" 
                className="flex items-center space-x-2"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                  <Icon name="DollarSign" size={20} color="white" />
                </div>
                <span className="text-lg font-semibold text-foreground">
                  ExpenseTracker Pro
                </span>
              </Link>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMobileMenu}
                aria-label="Close mobile menu"
              >
                <Icon name="X" size={24} />
              </Button>
            </div>

            <nav className="p-4 space-y-2">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-muted ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span>{item?.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Header;