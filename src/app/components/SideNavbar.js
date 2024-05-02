"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoHome } from 'react-icons/io5';
import { GiArchiveRegister } from 'react-icons/gi';
import { FaRegHospital } from 'react-icons/fa';
import { FaHospitalUser } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
import { IoHelpCircleSharp } from 'react-icons/io5';
import { CiLogout } from 'react-icons/ci';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa'; // Import FaChevronDown for toggle

import Logo from '../../../public/logo.png';
import sideNav from './style/sideNav.module.css';

function SideNavbar() {
  const [showAttendanceMenu, setShowAttendanceMenu] = useState(false);

  const handleAttendanceMenuToggle = () => {
    setShowAttendanceMenu(!showAttendanceMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  return (
    <>
      <div className={sideNav.main}>
        <div className={sideNav.logo}>
          <Image src={Logo} alt="logo" />
        </div>

        <div className={sideNav.menuBar}>
          <ul>
            <li>
              <IoHome size={20} />
              <Link href={'/'}>
                Home
              </Link>
            </li>

            <li onClick={handleAttendanceMenuToggle} style={{ position: 'relative' }}>
              <GiArchiveRegister size={20} style={{ marginRight: '10px' }} />
              Attendance
              {showAttendanceMenu ? (
                <FaChevronDown
                  size={15}
                  style={{
                    position: 'absolute',
                    bottom: 15,
                    right: 20,
                    marginLeft: '10px',
                  }}
                />
              ) : (
                <FaChevronRight
                  size={15}
                  style={{
                    position: 'absolute',
                    bottom: 15,
                    right: 20,
                    marginLeft: '10px',
                  }}
                />
              )}
            </li>

            {showAttendanceMenu && (
              /* Render submenu only if showAttendanceMenu is true */
              <ul className={sideNav.subMenu}>
                <li>
                  <FaRegHospital size={20} />
                  <Link href={'/client'}>
                    Client
                  </Link>
                </li>
                <li>
                  <FaHospitalUser size={20} />
                  <Link href={'/employee'}>
                    Employee
                  </Link>
                </li>
                <li>
                  <GiArchiveRegister size={20} />
                  <Link href={'/attendance'}>
                    Attendance
                  </Link>
                </li>
              </ul>
            )}

            <li>
              <IoSettingsSharp size={23} />
              <Link href={'/setting'}>
                Setting
              </Link>
            </li>
            <li>
              <IoHelpCircleSharp size={25} />
              <Link href={'/help'}>
                Help & Support
              </Link>
            </li>
            <li onClick={handleLogout}>
              <CiLogout size={25} />
              <Link href={'/help'}>
                Log Out
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default SideNavbar;
