import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from "react";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useParams } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";

const FinanceForm = () => {


  const navigate = useNavigate();
  const { id } = useParams();
  console.log("id", id);


  const [formData, setFormData] = useState({
    Transactiondate: "",
    monthyear: "",
    transactionType: "",
    fromAccount: "",
    toAccount: "",
    amount: "",
    receipt: "",
    notes: "",
  })
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);


  // const MAX_FILE_SIZE = 102400; //100KB

  // const validFileExtensions = { image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] };

  // function isValidFileType(fileName, fileType) {
  //   return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
  // }

  const schema = yup.object().shape({
    Transactiondate: yup.string().required("Transactiondate is required"),
    monthyear: yup.string().required("monthyear is required"),
    transactionType: yup.string().required("transactionType is required"),
    fromAccount: yup.string().required("fromAccount is required"),
    toAccount: yup.string().required("toAccount is required"),
    amount: yup.string().required("amount is required"),
    notes: yup.string().required("notes is required"),
    // receipt: yup.mixed().required("Required")
    // .test("is-valid-type", "Not a valid image type",
    //   value => isValidFileType(value && value.name.toLowerCase(), "image"))
    // .test("is-valid-size", "Max allowed size is 100KB",
    //   value => value && value.size <= MAX_FILE_SIZE)
    receipt: yup.mixed().test("fileSize", "The file cant be empty", (value) => {
      console.log(value, "vallll");
      if ((value.name === "undefined") || (value.size >= 10000)) {
        return "file cant be empty";

      }
      return value;

    })
    // .test("type","only jpeg support",(value)=>{
    //   return value && value[0].type==="image/jpeg";
    // })

  });
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  const onSubmit = async (data) => {
    const imgpath = await getBase64(data.receipt[0]);
    data.receipt = imgpath;
    console.log(data);
    setFormData(data);
    setIsFormSubmitted(true);

  };

  const preloadedvalues = {
    Transactiondate: "aaaa",
    monthyear: formData.monthyear,
    transactionType: formData.transactionType,
    fromAccount: formData.fromAccount,
    toAccount: formData.toAccount,
    amount: formData.amount,
    receipt: formData.receipt,
    notes: formData.notes,
  }

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: preloadedvalues
  });



  const removefile = () => {
    const imgdata = ({ ...formData, receipt: "" });
    setFormData(imgdata);
  }

  useEffect(() => {
    if (isFormSubmitted == true) {

      const existingData = JSON.parse(localStorage.getItem("formDataList")) || [];
      if (id) {
        existingData[id - 1] = formData;
        localStorage.setItem("formDataList", JSON.stringify(existingData));
        alert("Records updated successfully!!!");
        navigate("/viewdata");
        //console.log(formData,"fff");

      } else {
        const id1 = existingData.length + 1;
        formData.id = id1;
        existingData.push(formData);
        localStorage.setItem("formDataList", JSON.stringify(existingData));

        alert("Records inserted successfully!!!");
        navigate("/viewdata");
      };
    }
  }, [formData]);



  // console.log(formData,"tyrtur---------------------------------")


  return (
    <div>
      <div className="container">
        <h1>Add Transaction</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                {...register("Transactiondate")}

              />
              <p>{errors.Transactiondate?.message}</p>
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
                {...register("monthyear")}
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
              <p>{errors.monthyear?.message}</p>
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
                {...register("transactionType")}
              >
                <option value="">--Select Transaction type--</option>
                <option>Home expense</option>
                <option>Personal expense</option>
                <option>Income</option>
              </select>
              <p>{errors.transactionType?.message}</p>
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
                {...register("fromAccount")}
              >
                <option value="">--Select From Account--</option>
                <option>Personal Account</option>
                <option>Real Living</option>
                <option>My Dream home</option>
                <option>Full circle</option>
                <option>Core Realtors</option>
                <option>Big Block</option>
              </select>
              <p>{errors.fromAccount?.message}</p>
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
                {...register("toAccount")}
              >
                <option value="">--Select To Account--</option>
                <option>Personal Account</option>
                <option>Real Living</option>
                <option>My Dream home</option>
                <option>Full circle</option>
                <option>Core Realtors</option>
                <option>Big Block</option>
              </select>
              <p>{errors.toAccount?.message}</p>
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
                {...register("amount")}
              />
              <p>{errors.amount?.message}</p>
            </div>
          </div>
          <div class="form-group row">
            <label for="inputEmail3" class="col-sm-2 col-form-label">
              Receipt
            </label>
            <div class="col-sm-10">
              {formData.receipt == "" ?
                <input
                  type="file"
                  class="form-control"
                  name="receipt"
                  {...register("receipt")}
                /> :
                <div>
                  <div onClick={removefile}>Remove</div>
                  <img src={formData.receipt} /></div>}

              <p>{errors.receipt?.message}</p>
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
                {...register("notes")}
              />
              <p>{errors.notes?.message}</p>
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
      </div>
    </div>
  );

};

export default FinanceForm;