import { Link, NavLink } from "react-router-dom";
import { currentUser } from "../api/authentication";
import LoginLogoutButton from "./LoginLogoutButton";

export default function HeaderUser() {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/news">
                        <img
                            src="/logo-top.png"
                            alt="Logo SV5T Khoa CNTT"
                            width=""
                            height="85"
                            className="d-inline-block align-text-top"
                        />
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav container-fluid">
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link"
                                    activeClassName="active"
                                    exact
                                    to="/news"
                                >
                                    News
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link"
                                    activeClassName="active"
                                    exact
                                    to="/register-activity"
                                >
                                    Hoạt động của tôi
                                </NavLink>
                            </li>
                        </ul>
                        <div className="btn-group">
                            <button
                                type="button"
                                className="btn btn-secondary dropdown-toggle"
                                data-bs-toggle="dropdown"
                                data-bs-display="static"
                                aria-expanded="false"
                            >
                                {currentUser()?.displayName}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-lg-end">
                                <li>
                                    <button
                                        className="dropdown-item"
                                        type="button"
                                    >
                                        Hồ sơ
                                    </button>
                                </li>
                                <li>
                                    <LoginLogoutButton />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
