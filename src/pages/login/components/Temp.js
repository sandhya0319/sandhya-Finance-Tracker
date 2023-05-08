 // if(formData.id==undefined)
      // {
        //const existingData = JSON.parse(localStorage.getItem("formDataList")) || [];
      //   const data=JSON.parse(localStorage.getItem("formDataList")) || [];
      //   const id=data.length+1;
      //   formData.id=id;
      //   console.log("idddddd",id)
      //   console.log("eeeee",formData);
      // // append new form data to existing data
      //    data.push(formData);

      // // save updated data to ls
      // localStorage.setItem("formDataList", JSON.stringify(data));
      // alert("Records inserted successfully!!!");



       // }
     
      // else{
      //   const editdata =JSON.parse(localStorage.getItem("formData")) || [];
      //   editdata[formData.id-1]=formData;
      //   setFormData(editdata)
      //   localStorage.setItem("formDataList", JSON.stringify(editdata));

      // }

(view)



import React, { useState, useEffect } from "react";
import { Link} from "react-router-dom";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";



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
  const [transactionPerPage, setTransactionPerPage] = useState(4);
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
  // const currentTransactiongroup = Object.entries(groupedData).slice(indexFirstTransaction, indexLastTransaction);
 // console.log("ccc",currentTransactiongroup)
 // console.log("ct",currentTransaction)
  // console.log(groupbyset)
  //console.log("fff",currentTransaction)
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

 
  return (
    <div>
      <div class="form-group row">
        <div class="col-sm-10 ser">
          <label for="" class="col-sm-2 col-form-label search">Search by Group</label>
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>


              {currentTransaction.map((formData, index) => (
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
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedData[data].slice(indexFirstTransaction, indexLastTransaction).map((item) => (
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
                        <td><Link to={`/form/${item.index}`} state={{ Data: item }}>Edit</Link></td>
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
  


(form)
  

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EditForm from "./EditForm";
import { Link, useLocation } from "react-router-dom";

const FinanceForm = () => {
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

  // const location = useLocation();
  // const updatedata = location.state.Data;
  // console.log("pppp",updatedata);
  const [formErrors, setFormErrors] = useState({});
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
 

  const handleImage = (e) => {
    const file = e.target.files[0];
    getBase64(file).then((base64) => {
      const imgdata = { ...formData, receipt: base64 };
      setFormData(imgdata);
      //console.debug("file stored",base64);
      //console.log(file.type);
      // if (file.type !== "image/png" || file.type !=="image/jpg"  || file.type!=="image/jpeg"){
      //     window.alert("File does not support. You must use .png or .jpg or .jpeg");
      //     return false;
      //  }
      if ((file.type == "image/png" ) || (file.type == "image/jpeg") ||  (file.type == "image/jpg")){
        return true;
      }
      else{
          window.alert("File does not support. You must use .png or .jpg or .jpeg");
          return false;
      }
      if (file.size > 1000000) {
        window.alert("Please upload a file smaller than 1 MB");
        return false;
      }
    });
  };
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  };

  //edit
  const { id} = useParams();
 console.log(id,"dddddddddddd");

 

  const handleSubmit = (event) => {
    event.preventDefault();
    const errors = {};
    // let file = event.target.receipt[0];
    if (!formData.Transactiondate) {
      errors.Transactiondate = "Transaction Date is required";
    }
    if (!formData.monthyear) {
      errors.monthyear = "Month Year is required";
    }
    if (!formData.transactionType) {
      errors.transactionType = "Transaction Type is required";
    }
    if (!formData.fromAccount) {
      errors.fromAccount = "From Account is required";
    } 
    if (!formData.toAccount) {
      errors.toAccount = "To Account is required";
    }
    else if (formData.fromAccount === formData.toAccount) {
      errors.fromAccount = "From and To account Should be different";
    }
    if (!formData.amount) {
      errors.amount = "Amount is required";
    } else if (isNaN(formData.amount)) {
      errors.amount = "Amount must be a number";
    } else if (formData.amount <= "0") {
      errors.amount = "Amount must be greater than 0";
    }
    if (!formData.receipt) {
      errors.receipt = "Receipt is required";
    }
    if (!formData.notes) {
      errors.notes = "Notes is required";
    } else if (formData.notes.length > 255) {
      errors.notes = "Notes length should be less than 255 character";
    }
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
     
        const existingData = JSON.parse(localStorage.getItem("formDataList")) || [];
        const id=existingData.length+1;
        formData.id=id;
        console.log("idddddd",id)
        // console.log("eeeee",formData);
      // append new form data to existing data
      existingData.push(formData);

      // save updated data to ls
      localStorage.setItem("formDataList", JSON.stringify(existingData));
      alert("Records inserted successfully!!!");
      //reset
      setFormData({
        Transactiondate: "",
        monthyear: "",
        transactionType: "",
        fromAccount: "",
        toAccount: "",
        amount: "",
        receipt: "",
        notes: "",
      });
     
      setFormErrors({});
      setIsFormSubmitted(true);
    }
  };
  useEffect(() => {
    if(id=="undefined")
    {
      console.log(id,"id");
    }
    else{
      const editdata =JSON.parse(localStorage.getItem("formDataList")) || [];
     
      setFormData(editdata[id-1])
      console.log("updatedata",editdata[id-1]);
    }
   
  }, []);
  

  return (
    <div>
      <div className="container">
        <h1>Add Transaction</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group row">
            <label
              htmlFor="Transactiondate"
              className="col-sm-2 col-form-label"
            >
              Transaction Date
            </label>
            <div className="col-sm-10">
              <input
                type="date"
                className="form-control"
                placeholder="Transactiondate"
                name="Transactiondate"
                value={formData.Transactiondate}
                onChange={handleChange}
              />
              <p style={{ color: "red" }}>{formErrors.Transactiondate}</p>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="monthyear" className="col-sm-2 col-form-label">
              Month Year
            </label>
            <div className="col-sm-10">
              <select
                id="monthyear"
                name="monthyear"
                className="form-control"
                value={formData.monthyear}
                onChange={handleChange}
              >
                <option value="">--Select Month Year--</option>
                <option>Jan 2023</option>
                <option>Feb 2023</option>
                <option>Mar 2023</option>
                <option>Apr 2023</option>
                <option>May 2023</option>
                <option>Jun 2023</option>
                <option>Jul 2023</option>
                <option>Aug 2023</option>
                <option>Sep 2023</option>
                <option>Oct 2023</option>
                <option>Nov 2023</option>
                <option>Dec 2023</option>
              </select>
              <p style={{ color: "red" }}>{formErrors.monthyear}</p>
            </div>
          </div>
          <div class="form-group row">
            <label for="inputPassword3" class="col-sm-2 col-form-label">
              Transaction Type
            </label>
            <div class="col-sm-10">
              <select
                id="transactionType"
                name="transactionType"
                className="form-control"
                value={formData.transactionType}
                onChange={handleChange}
              >
                <option value="">--Select Transaction type--</option>
                <option>Home expense</option>
                <option>Personal expense</option>
                <option>Income</option>
              </select>
              <p style={{ color: "red" }}>{formErrors.transactionType}</p>
            </div>
          </div>
          <div class="form-group row">
            <label for="inputPassword3" class="col-sm-2 col-form-label">
              From Account
            </label>
            <div class="col-sm-10">
              <select
                id="fromAccount"
                name="fromAccount"
                className="form-control"
                value={formData.fromAccount}
                onChange={handleChange}
              >
                <option value="">--Select From Account--</option>
                <option>Personal Account</option>
                <option>Real Living</option>
                <option>My Dream home</option>
                <option>Full circle</option>
                <option>Core Realtors</option>
                <option>Big Block</option>
              </select>
              <p style={{ color: "red" }}>{formErrors.fromAccount}</p>
            </div>
          </div>
          <div class="form-group row">
            <label for="inputPassword3" class="col-sm-2 col-form-label">
              To Account
            </label>
            <div class="col-sm-10">
              <select
                id="toAccount"
                name="toAccount"
                className="form-control"
                value={formData.toAccount}
                onChange={handleChange}
              >
                <option value="">--Select To Account--</option>
                <option>Personal Account</option>
                <option>Real Living</option>
                <option>My Dream home</option>
                <option>Full circle</option>
                <option>Core Realtors</option>
                <option>Big Block</option>
              </select>
              <p style={{ color: "red" }}>{formErrors.toAccount}</p>
            </div>
          </div>
          <div class="form-group row">
            <label for="inputEmail3" class="col-sm-2 col-form-label">
              Amount
            </label>
            <div class="col-sm-10">
              <input
                type="text"
                class="form-control"
                placeholder="Amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
              />
              <p style={{ color: "red" }}>{formErrors.amount}</p>
            </div>
          </div>
          <div class="form-group row">
            <label for="inputEmail3" class="col-sm-2 col-form-label">
              Receipt
            </label>
            <div class="col-sm-10">
              <input
                type="file"
                class="form-control"
                name="receipt"
                onChange={handleImage}
              />
              <p style={{ color: "red" }}>{formErrors.receipt}</p>
            </div>
          </div>
          <div class="form-group row">
            <label for="inputEmail3" class="col-sm-2 col-form-label">
              Notes
            </label>
            <div class="col-sm-10">
              <textarea
                class="form-control"
                placeholder="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
              <p style={{ color: "red" }}>{formErrors.notes}</p>
            </div>
          </div>
          <div class="form-group row">
            <div class="col-sm-10">
              <button type="submit" class="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
        {/* {isFormSubmitted && <ViewFinanceData />
                } */}
                {/* <EditForm /> */}
      </div>
    </div>
  );
};

export default FinanceForm;
