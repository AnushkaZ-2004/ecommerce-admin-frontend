import React from "react";

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-left">
        <h2>E-Commerce Admin</h2>
      </div>

      <div className="header-right">
        <div className="user-info">
          <span>
            Welcome, {user?.firstName} {user?.lastName}
          </span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
