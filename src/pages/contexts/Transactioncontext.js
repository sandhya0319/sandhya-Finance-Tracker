import React from 'react'
import { useState, useContext, createContext } from 'react'
import { DefaultJSON } from '../../utils/constants';


export const TableContext=createContext({});

//custom usecontext that we can use in any component
export const UseTransactionContext = () => useContext(TableContext);


export const Transactioncontext = ({children}) => {
    const [transactionvalue,setTransactionValue]=useState(DefaultJSON);
  return (
    <>
    <TableContext.Provider value={{transactionvalue,setTransactionValue}}>
        {children} 
    </TableContext.Provider>
    </>
  
  )
}


