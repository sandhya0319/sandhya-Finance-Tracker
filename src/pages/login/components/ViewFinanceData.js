import userEvent from "@testing-library/user-event";
import React, { useState, useEffect } from "react";
import { Link,useNavigate, useResolvedPath} from 'react-router-dom';
import Pagination from "./Pagination";




const ViewFinanceData = () => {
  const [formData, setFormData] = useState({
    Transactiondate: "",
    monthyear: "",
    transactionType: "",
    fromAccount: "",
    toAccount: "",
    amount: "",
    receipt: "",
    notes: "",
  });
  const navigate = useNavigate();

  const [currentpage, setCurrentPage] = useState(1);
  const [transactionPerPage, setTransactionPerPage] = useState(10);
  const [formDataList, setFormDataList] = useState([]);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState(1);

  const [groupbyset, setGroupBySet] = useState(false);


  useEffect(() => {
    const storedFormData = localStorage.getItem("formData");
    if (storedFormData) {
      setFormData(JSON.parse(storedFormData));
    }
    // retrieve saved data from ls
    const savedData =
      JSON.parse(localStorage.getItem("formDataList")) || [];
    setFormDataList(savedData);
  }, []);

  const handleSort = (column) => {
    // setGroupBySet(false)
    if (sortColumn === column) {
      setSortDirection(sortDirection === 1 ? -1 : 1);
    } else {
      setSortColumn(column);
      setSortDirection(1);
    }
  };

  const sortedData = [...formDataList].sort((a, b) => {
    if (sortColumn == "amount") {
      return sortDirection == 1 ? a[sortColumn] - b[sortColumn] : b[sortColumn] - a[sortColumn];
    }
    else if (sortColumn === "monthyear") {
      const dateA = new Date(a[sortColumn]);
      const dateB = new Date(b[sortColumn]);
      if (dateA < dateB) {
        return -1 * sortDirection;
      }
      if (dateA > dateB) {
        return 1 * sortDirection;
      }
    }
    else {
      //desc
      if (a[sortColumn] < b[sortColumn]) {
        return -1 * sortDirection;
      }
      //asc
      if (a[sortColumn] > b[sortColumn]) {
        return 1 * sortDirection;
      }
    }
    return 0;
  });

  const groupedData = sortedData.reduce((groups, data) => {
    const key = data[sortColumn];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(data);
    return groups;
  }, {});

  function handleEdit(id){
    navigate(`/form/${id}`);
    // console.log("hhhhh",id);
  }

  const handleDropdown = (e) => {
    const val = e.target.value;
    setSortColumn(val)
    setGroupBySet(true)
  }
  // paginationn

  const indexLastTransaction = currentpage * transactionPerPage;
  const indexFirstTransaction = indexLastTransaction - transactionPerPage;
  const currentTransaction = sortedData.slice(indexFirstTransaction, indexLastTransaction);

  //console.log("fff",currentTransaction)
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  

  const handleLogout=()=>{
   
    //let token = existingtokens.find(elem => elem.token);

    localStorage.removeItem("loggedintoken");
    navigate("/login"); 
  }
 

  // searching
  const [searchText,setSearch]=useState("");


  const handleSearch=(e)=>{
    setSearch(e.target.value);
  }

  const getSearchData=(searchdata)=>{
    return Object.values(searchdata).some(val=>typeof val=="string" && val.toLowerCase().includes(searchText.toLowerCase()));

  }

  // const[users,setUsers]=useState("");
  // const existsusers = JSON.parse(localStorage.getItem("users")) || [];
  // localStorage.setItem("users", JSON.stringify(existsusers));
  // setUsers(existsusers);


  return (
    <div className="container">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
          <a class="navbar-brand" href="#">Navbar</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
                <Link to="/form" class="nav-item nav-link active">Add Transaction</Link>
                <Link to="/viewdata" class="nav-item nav-link active">View All Transactions</Link>
                <Link to="/login"  class="nav-item nav-link active">Login</Link>
                <Link to="/register" class="nav-item nav-link active">Register</Link>
                <button type="button" class="btn btn-outline-primary" onClick={handleLogout}>Logout</button>
                <input class="form-control mr-sm-2" type="search" onChange={handleSearch} placeholder="Search"/>
                
  
               {/* <p>(Welcome {} )</p>; */}
            </div>
            </div>
          </nav>
      <div class="form-group row">
        <div class="col-sm-10 ser">
          <label for="" class="col-sm-2 col-form-label search">Group by:</label>
          <select
            id="selectg"
            className="form-control"
            name="selectedValues"
            onChange={handleDropdown}
          >
            <option value="none">None</option>
            <option value="transactionType">Transaction Type</option>
            <option value="monthyear">Month Year</option>
            <option value="fromAccount">From Account</option>
            <option value="toAccount">To account</option>
          </select>
        </div>
      </div>
      {
        !groupbyset ?
          <table className="table container">
            <thead className="thead-light">
              <tr>
                <th onClick={() => handleSort("Transactiondate")}> Transaction Date</th>
                <th onClick={() => handleSort("monthyear")}>Month Year</th>
                <th onClick={() => handleSort("transactionType")}> Transaction Type</th>
                <th onClick={() => handleSort("fromAccount")}>From Account</th>
                <th onClick={() => handleSort("toAccount")}>To Account</th>
                <th onClick={() => handleSort("amount")}>Amount</th>
                <th onClick={() => handleSort("notes")}>Notes</th>
                <th onClick={() => handleSort("receipt")}>Receipt</th>
                <th colSpan="2">Action</th>
              </tr>
            </thead>
            <tbody>
           

              {currentTransaction.filter((searchdata)=> getSearchData(searchdata)).map((formData, index) => (
                <tr key={index}>
                  <td>{formData.Transactiondate}</td>
                  <td>{formData.monthyear}</td>
                  <td>{formData.transactionType}</td>
                  <td>{formData.fromAccount}</td>
                  <td>{formData.toAccount}</td>
                  <td><span style={{ fontfamily: "Arial" }}>&#8377; {Number(formData.amount).toLocaleString('en-IN')}</span></td>
                  <td>{formData.notes}</td>
                  <td><img src={formData.receipt}></img></td>
                  <td><Link to={`/viewsingledata`} state={{ Data: formData }}>view</Link></td>
                  {/* <td><Link to={`/form/${formData.id}`}>Edit</Link></td> */}
                  <td onClick={()=>handleEdit(formData.id)}>Edit</td>
                </tr>
              ))}
              <Pagination transactionPerPage={transactionPerPage} totaltransaction={sortedData.length} paginate={paginate} />
            </tbody>
          </table> :
          <div>
            {Object.keys(groupedData).map((data) => (
              <div key={data}>
                <table className="table container">
                  <thead className="thead-light">
                    <tr>
                      <th onClick={() => handleSort("Transactiondate")}> Transaction Date</th>
                      <th onClick={() => handleSort("monthyear")}>Month Year</th>
                      <th onClick={() => handleSort("transactionType")}> Transaction Type</th>
                      <th onClick={() => handleSort("fromAccount")}>From Account</th>
                      <th onClick={() => handleSort("toAccount")}>To Account</th>
                      <th onClick={() => handleSort("amount")}>Amount</th>
                      <th onClick={() => handleSort("notes")}>Notes</th>
                      <th onClick={() => handleSort("receipt")}>Receipt</th>
                      <th colSpan="2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedData[data].slice(indexFirstTransaction, indexLastTransaction).filter((searchdata)=> getSearchData(searchdata)).map((item) => (
                      <tr key={item.transactionType}>
                        <td>{item.Transactiondate}</td>
                        <td>{item.monthyear}</td>
                        <td>{item.transactionType}</td>
                        <td>{item.fromAccount}</td>
                        <td>{item.toAccount}</td>
                        <td><span style={{ fontfamily: "Arial" }}>&#8377; {Number(item.amount).toLocaleString('en-IN')}</span></td>
                        <td>{item.notes}</td>
                        <td><img src={item.receipt}></img></td>
                        <td><Link to={`/viewsingledata`} state={{ Data: item }}>view</Link></td>
                        <td onClick={()=>handleEdit(item.id)}>Edit</td>
                      </tr>
                    ))}
                    <Pagination transactionPerPage={transactionPerPage} totaltransaction={groupedData[data].length} paginate={paginate} />
                  </tbody>
                </table>
              </div>
            ))}
          </div>
      }
    </div >
  );
};

export default ViewFinanceData;