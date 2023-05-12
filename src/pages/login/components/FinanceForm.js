import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { useParams } from "react-router-dom";
import { monthYearOptions, transactionTypeOptions, toaccountOptions, fromaccountOptions } from '../../../utils/constants';
// import { TableContext } from '../../contexts/Transactioncontext';
import { UseTransactionContext } from '../../contexts/Transactioncontext';


const schema = yup.object().shape({
    Transactiondate: yup.string().required("Transactiondate is required"),
    monthyear: yup.string().required("monthyear is required"),
    transactionType: yup.string().required("transactionType is required"),
    fromAccount: yup.string().oneOf(
        ["personal-account", "real-living", "my-dream-home", "full-circle", "core-realors", "big-block"],
        "Please select a valid option"
    ).required(),
    toAccount: yup.string().oneOf(
        ["personal-account", "real-living", "my-dream-home", "full-circle", "core-realors", "big-block"],
        "Please select a valid option"
    ).notOneOf(
        [yup.ref("fromAccount")],
        "The 'To Account' and 'From Account' fields cannot have the same value"
    ).required(),
    // amount: yup.number().min(1).required("amount is required"),
    amount:yup.string().required("amount is required").test('len', 'Must greater than 0', (value) =>{
        return value.size>0;
    }),
    image: yup
        .mixed()
        .test("required","file is required",(value)=>{
            if(value.length>0)
            {
                return value;
            }
            return false;
        })
        .test("fileType", "Only JPG, JPEG and PNG images are allowed", (value) => {
            return value && value[0] && /^image\/(jpe?g|png)/.test(value[0].type);
        })
        .test("fileSize", "Image must be less than 1 MB", (value) => {
            return value && value[0] && value[0].size <= 1048576;
        }),
    notes: yup.string().required("notes is required"),
});

const FinanceForm = () => {

    const { transactionvalue, setTransactionValue } = UseTransactionContext();

    const { id } = useParams();

    const navigate = useNavigate();


    const [matchedData, setmatchedData] = useState({
        Transactiondate: "",
        monthyear: "",
        transactionType: "",
        fromAccount: "",
        toAccount: "",
        amount: "",
        image: "",
        notes: "",
    })

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        // defaultValues:formData,
        resolver: yupResolver(schema),
        
    });

    const [imagePreview, setImagePreview] = useState('');


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview('');
        }
    };

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const generateId = () => {
        const existingData = transactionvalue;
        return existingData.length + 1;

    }
    const removefile=()=>{
        const imgdata=({...matchedData,image:""});
        setmatchedData(imgdata);
      }

    const onSubmit = async (data) => {
        // if(typeof data.image!=="string")
        const imgpath = await getBase64(data.image[0]);
        data.image = imgpath;

        const val = { ...data };
        console.log("data", val);
        const newval = {
            ...matchedData, Transactiondate: val.Transactiondate,
            transactionType: val.transactionType,
            monthyear: val.monthyear,
            fromAccount: val.fromAccount,
            toAccount: val.toAccount,
            amount: val.amount,
            image: val.image,
            notes: val.notes
        }
        //console.log(val.image,"imgggggg");
        const existingData = transactionvalue;
        if (id) {
            existingData[id - 1] = newval;
            setTransactionValue(existingData);
            alert("Records updated successfully!!!");
            navigate("/viewdata");
        } else {
            // const imgpath = await getBase64(newval.image[0]);
            // newval.image = imgpath;
            newval.id = generateId();
            const existingData = transactionvalue;
            const newData = [...existingData, newval];
            setTransactionValue(newData);
            alert("Records inserted successfully!!!");
            navigate("/viewdata");
        }
    };

    useEffect(() => {
        if (!id) return
        let matched = transactionvalue.find(obj => obj.id == id);
        setmatchedData(matched);
        if (matchedData) {
        }
        Object.entries(matchedData).forEach(([key, value]) => {
            setValue(key, value)
        });
        setImagePreview(matchedData.image);
        //setmatchedData(matchedData.image);
        //setTransactionValue(matchedData.image)

    }, [matchedData, setValue]);

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
                                options={monthYearOptions}
                                {...register("monthyear")}
                            >

                                {monthYearOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
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
                                options={transactionTypeOptions}
                                {...register("transactionType")}
                            >
                                {transactionTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
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
                                option={fromaccountOptions}
                                {...register("fromAccount")}
                            >
                                {fromaccountOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
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
                                option={toaccountOptions}
                                {...register("toAccount")}
                            >
                                {toaccountOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
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
                                type="number"
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


                        {/* <div class="col-sm-10">
                {formData.receipt==""?
                <input
                  type="file"
                  class="form-control"
                  name="receipt"
                  onChange={handleImage}/>:
                  <div>
                  <div onClick={removefile}>Remove</div>
                <img src={formData.receipt} /></div>}
                
                <p>{errors.receipt?.message}</p>
              </div> */}

                        {/* <div class="col-sm-10">
                            {matchedData.image==""?
                             <input type="file" class="form-control" name="image" {...register("image")} onChange={handleImageChange} />:
                             <div>
                                <div onClick={removefile}>remove</div>
                                {errors.image && <p>{errors.image.message}</p>}
                                {imagePreview && <img src={matchedData.image} />}
                             </div>
                            
                            }
         
                        </div> */}

                        <div class="col-sm-10">
                            <input type="file" class="form-control" name="image" {...register("image")} onChange={handleImageChange} />
                            {errors.image && <p>{errors.image.message}</p>}
                            {imagePreview && <img src={imagePreview} />}
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
}

export default FinanceForm;