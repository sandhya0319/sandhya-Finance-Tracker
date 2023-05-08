import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from "react";
import { useParams} from "react-router-dom";
import { Link, useLocation } from "react-router-dom";

const FinanceForm = () => {

  const navigate=useNavigate();
  const { id } = useParams();
  console.log("id",id);
  // const history = useHistory();

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

  const [formErrors, setFormErrors] = useState({});
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);


  const handleImage = (e) => {
    const file = e.target.files[0];
    getBase64(file).then((base64) => {
      const imgdata = { ...formData, receipt: base64 };
      setFormData(imgdata);
      if ((file.type == "image/png") || (file.type == "image/jpeg") || (file.type == "image/jpg")) {
        return true;
      }
      else {
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

    const existingData = JSON.parse(localStorage.getItem("formDataList")) || [];
    if (id) {
      existingData[id - 1] = formData;
      localStorage.setItem("formDataList", JSON.stringify(existingData));
      alert("Records updated successfully!!!");
      navigate("/viewdata");

    } else {
      const id1=existingData.length+1;
      formData.id=id1;
      existingData.push(formData);
      localStorage.setItem("formDataList", JSON.stringify(existingData));
      
      alert("Records inserted successfully!!!");
      navigate("/viewdata");
    }
   
    
  
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

  const removefile=()=>{
    const imgdata=({...formData,receipt:""});
    setFormData(imgdata);
  }
  
  useEffect(() => {
    if (id) {
      const existingData = JSON.parse(localStorage.getItem("formDataList")) || [];

    //const editdata =JSON.parse(localStorage.getItem("formDataList")) || [];
      const dataToEdit = existingData[id - 1];
      console.log("de",dataToEdit)
      if (dataToEdit) {
        setFormData(dataToEdit);
      }
    }
  }, [id]);


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
            {formData.receipt==""?
            <input
              type="file"
              class="form-control"
              name="receipt"
              onChange={handleImage}/>:
              <div>
              <div onClick={removefile}>Remove</div>
            <img src={formData.receipt} /></div>}
            
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