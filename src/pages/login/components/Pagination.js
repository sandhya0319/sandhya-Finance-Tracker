import React from 'react'

const Pagination = ({transactionPerPage,totaltransaction,paginate}) => {
    // console.log("tttt",totaltransaction)
    // console.log("perpage",transactionPerPage)
    const pageNumber=[];
    const pages=(totaltransaction/transactionPerPage)
    const p=pages.toFixed();
    for(let i=1;i<=p;i++)
    {
        pageNumber.push(i);
        // console.log(i);
    }
   
  return (
    <div>
     <table>
      <tr>
            {pageNumber.map(number=>(
                <td key={number}>
                    <a onClick={()=>paginate(number)} className="pages">{number}</a>
                </td>
            ))}
         </tr>
      </table>
    </div>
  )
}

export default Pagination
