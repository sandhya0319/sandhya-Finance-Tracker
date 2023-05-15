import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState, useContext } from 'react';
import { useForm, errors } from 'react-hook-form';
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
    fromAccount: yup.string().required('FromAccount is required').oneOf(
        ["personal-account", "real-living", "my-dream-home", "full-circle", "core-realors", "big-block"],
        "FromAccount is required"
    ),
    toAccount: yup.string().required('ToAccount is required').oneOf(
        ["personal-account", "real-living", "my-dream-home", "full-circle", "core-realors", "big-block"],
        "ToAccount is required"
    ).notOneOf(
        [yup.ref("fromAccount")],
        "The 'To Account' and 'From Account' fields cannot have the same value"
    ),
    amount: yup.number().typeError("amount is required").required("amount is required").min(1),
    image: yup
        .mixed()
        .test("required", "file is required", (value) => {
            if (value.length > 0) {
                return value;
            }
            return false;
        })
        .test("fileType", "Only JPG, JPEG and PNG images are allowed", (value) => {

            if (value && value[0] && /^image\/(jpe?g|png)/.test(value[0].type)) {
                return true;
            }
           
            if (typeof value === 'string' && value.startsWith('data:image')) {
                return true;
            }
            return false;
        })
        .test("fileSize", "Image must be less than 1 MB", (value) => {

            if (value && value[0] && value[0].size <= 1048576) {
                return true;
            }
            if (typeof value === 'string' && value.startsWith('data:image')) {
                return true;
            }
            return false;
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

    const { register, setError, handleSubmit, setValue, formState: { errors } } = useForm({
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
                setError("image", {
                    type: "manual",
                    message: "",
                });
                
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
    const removefile = () => {
        setImagePreview(matchedData.image = null);
        setValue('image', '')
    }

    const onSubmit = async (data) => {
        const imgIsBase64 = typeof data.image === 'string';

        if (!imgIsBase64) {
            const imgPath = await getBase64(data.image[0]);
            data.image = imgPath;
        }

        //console.log(data);

        const val = { ...data };
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
        Object.entries(matchedData).forEach(([key, value]) => {
            setValue(key, value)
        });
        setImagePreview(matchedData.image);
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
                        <div class="col-sm-10">
                            <input type="file" class="form-control" name="image" {...register("image")} onChange={handleImageChange} />
                            {imagePreview && <div onClick={removefile}>remove</div>}
                            {imagePreview && <img src={imagePreview} />}
                            {errors.image && <p>{errors.image.message}</p>}
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