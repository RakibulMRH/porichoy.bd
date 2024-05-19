// components/AdminLinks.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface AdminLinksProps {
  isAdmin: boolean;
}

const AdminLinks: React.FC<AdminLinksProps> = ({ isAdmin }) => {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const userRole = user.role;
  const isAdminUser = userRole === 'admin';

  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [showFinancialDropdown, setShowFinancialDropdown] = useState(false);
  const [showPrivilegeDropdown, setShowPrivilegeDropdown] = useState(false);

  return (
    <div>
      {isAdminUser && (
        <div>
          <div className="relative">
            <button
              className="group w-full text-left rounded-md px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-colors duration-300 flex items-center justify-between"
              onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
            >
              Employee Management
              <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
            </button>
            {showEmployeeDropdown && (
              <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg">
  <Link
    href="/employee/register"
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
  >
    Registration
  </Link>
  <Link
    href="/employee/searchemp"
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
  >
    Search an employee
  </Link>
  <Link
    href="/employee/epriv"
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
  >
    Privillege
  </Link>
  <Link
    href="/employee/empupdate"
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
  >
    Employee Info Update
  </Link>
  <Link
    href="/employee/empdel"
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
  >
    Delete an employee
  </Link>
  <Link
    href="/employee/empbonus"
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
  >
    Provide Bonus
  </Link>
  <Link
    href="/employee/empblock"
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
  >
    Block an Employee
  </Link>
</div>
            )}
          </div>

          <div className="relative">
            <button
              className="group w-full text-left rounded-md px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-colors duration-300 flex items-center justify-between"
              onClick={() => setShowFinancialDropdown(!showFinancialDropdown)}
            >
              Financial
              <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
            </button>
            {showFinancialDropdown && (
              <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg">
  <Link href="/financial" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
    Financial
  </Link>
  <Link href="/financial/createPayment" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
    createPayment
  </Link>
  <Link href="/financial/getAllPayments" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
    getAllPayments
  </Link>
  <Link href="/financial/getTotalPayments" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
    Total Payments
  </Link>
  <Link href="/financial/removeBonus" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
    removeBonus
  </Link>
  <Link href="/financial/setBonus" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
    setBonus
  </Link>
  <Link href="/financial/setSal" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
    setSal
  </Link>
  {/* Add more links as needed */}
</div>
            )}
          </div>

          <div className="relative">
            <button
              className="group w-full text-left rounded-md px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-colors duration-300 flex items-center justify-between"
              onClick={() => setShowPrivilegeDropdown(!showPrivilegeDropdown)}
            >
              Privilege
              <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
            </button>
            {showPrivilegeDropdown && (
              <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg">
  <Link
    href="/privilege"
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
  >
    Privilege
  </Link>
  <Link
    href="/privilege/createpriv"
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
  >
    Create privilege
  </Link>
  <Link
    href="/privilege/deletepriv"
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
  >
    Delete Privilege
  </Link>
  <Link
    href="/privilege/searchpriv"
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
  >
    Search Privilege
  </Link>
  <Link
    href="/privilege/showallpriv"
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
  >
    Show All Privilege
  </Link>
  <Link
    href="/privilege/updatepriv"
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
  >
    Update Privilege
  </Link>
</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLinks;