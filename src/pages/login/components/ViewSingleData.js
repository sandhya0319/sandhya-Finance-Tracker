import React from "react";
import { Link, useLocation } from "react-router-dom";

const ViewSingleData = () => {
  const location = useLocation();
  const data = location.state.Data;

  return (
    <div>
      <h1>View Single transaction</h1>
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Transaction Date</th>
            <th>Month Year</th>
            <th>Transaction Type</th>
            <th>From Account</th>
            <th>To Account</th>
            <th>Amount</th>
            <th>Notes</th>
            <th>Receipt</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data.Transactiondate}</td>
            <td>{data.monthyear}</td>
            <td>{data.transactionType}</td>
            <td>{data.fromAccount}</td>
            <td>{data.toAccount}</td>
            <td>{data.amount}</td>
            <td>{data.notes}</td>
            <td>
              <img src={data.image}></img>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ViewSingleData;
