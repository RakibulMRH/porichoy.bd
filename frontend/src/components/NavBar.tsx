import Link from "next/link";

const NavBar = () => {
  let user, isAdmin = false;
  
  if (typeof window !== 'undefined') {
    user = window.sessionStorage.getItem("user");
    isAdmin = user ? JSON.parse(user).role === "admin" : false;
  }

  return ( <>
      {isAdmin && (
        <>
          <div className="dropdown">
            <button className="dropbtn">Employee Management</button>
            <div className="dropdown-content">
              <Link href="/employee/register">Registration</Link>
              <Link href="/employee/searchemp">Search an employee</Link>
              <Link href="/employee/epriv">Privilege</Link>
              <Link href="/employee/empupdate">Employee Info Update</Link>
              <Link href="/employee/empdel">Delete an employee</Link>
              <Link href="/employee/empbonus">Provide Bonus</Link>
              <Link href="/employee/empblock">Block an Employee</Link>
            </div>
          </div>

          <div className="dropdown">
            <button className="dropbtn">Financial</button>
            <div className="dropdown-content">
              <Link href="/financial/createPayment">createPayment</Link>
              <Link href="/financial/getAllPayments">getAllPayments</Link>
              <Link href="/financial/getPayments">getPayments</Link>
              <Link href="/financial/removeBonus">removeBonus</Link>
              <Link href="/financial/setBonus">setBonus</Link>
              <Link href="/financial/setSal">setSal</Link>
            </div>
          </div>

          <div className="dropdown">
            <button className="dropbtn">Privilege</button>
            <div className="dropdown-content">
              <Link href="/privilege/createpriv">createpriv</Link>
              <Link href="/privilege/deletepriv">deletepriv</Link>
              <Link href="/privilege/searchpriv">searchpriv</Link>
              <Link href="/privilege/showallpriv">showallpriv</Link>
              <Link href="/privilege/updatepriv">updatepriv</Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NavBar;