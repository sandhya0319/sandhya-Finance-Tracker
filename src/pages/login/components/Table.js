import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Table = ({ data, handleDelete }) => {

    const [currentPageData, setCurrentPageData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(2);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");


    useEffect(() => {
        setCurrentPage(1);
    }, [data]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setCurrentPageData(getSortedData(data).slice(startIndex, endIndex));
    }, [data, currentPage, itemsPerPage, sortColumn, sortDirection]);

    // Handle sort
    const handleSort = (column, type) => {
        if (column === sortColumn) {
           
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            
            setSortColumn(column);
            setSortDirection(type === "string" ? "asc" : "desc");
        }
        setCurrentPage(1); 
    };

    const getSortedData = (data) => {
        if (!sortColumn) {
            return data;
        }

        const sortedData = [...data];

        sortedData.sort((a, b) => {
            const valueA = a[sortColumn];
            const valueB = b[sortColumn];
            if (typeof valueA === "string" && typeof valueB === "string") {
                return valueA.localeCompare(valueB);
            }
            return valueA - valueB;
        });
        if (sortDirection === "desc") {
            sortedData.reverse();
        }
        return sortedData;
    };

    // Pagination
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    className={i === currentPage ? "active btn btn-primary rounded-1 mx-2" : "btn"}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };


    // searching
    const [searchText, setSearch] = useState("");
    const handleSearch = (e) => {
        setSearch(e.target.value);
    }
    const getSearchData = (searchdata) => {
        return Object.values(searchdata).some(val => (((typeof val == "string") || (typeof val == "number")) && val.toString().toLowerCase().includes(searchText.toLowerCase())));
    }

    return <>
        {
            data.length > 0 ?
                <>
                    <input class="form-control mr-sm-2" type="search" placeholder="Search" onChange={handleSearch} />
                    <table className="table container">
                        <thead className="thead-light">
                            <tr>
                                <th onClick={() => handleSort("Transactiondate", 'date')}> Transaction Date</th>
                                <th onClick={() => handleSort("monthyear", 'string')}>Month Year</th>
                                <th onClick={() => handleSort("transactionType", 'string')}> Transaction Type</th>
                                <th onClick={() => handleSort("fromAccount", 'string')}>From Account</th>
                                <th onClick={() => handleSort("toAccount", 'string')}>To Account</th>
                                <th onClick={() => handleSort("amount", 'curruncy')}>Amount</th>
                                <th onClick={() => handleSort("notes", 'string')}>Notes</th>
                                <th onClick={() => handleSort("receipt", 'file')}>Receipt</th>
                                <th colSpan="3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageData.filter((searchdata) => getSearchData(searchdata)).map(row => <tr>
                                <td>{row['Transactiondate']}</td>
                                <td>{row['monthyear']}</td>
                                <td>{row['transactionType']}</td>
                                <td>{row['fromAccount']}</td>
                                <td>{row['toAccount']}</td>
                                <td>{row['amount']}</td>
                                <td>{row['notes']}</td>
                                <td><img src={row['image']} alt='receipt' /></td>
                                <td>
                                    <div>
                                        <Link to={`/viewsingledata`} state={{ Data: row }}>view</Link>
                                        {/* <Link to={`${row.id}`}>View</Link> */}
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <Link to={`/form/${row['id']}`}>Edit</Link>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <button className="btn btn-danger" onClick={() => handleDelete(row['id'])}>
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>)}
                        </tbody>
                    </table>

                    <div class="pagination-wrapper flex text-center justify-between">
                        <div class="pagination">
                            {renderPagination()}
                        </div>
                    </div>
                </>
                :
                <div className='flex justify-center'><h4>No Data Found</h4></div>}
    </>
}

export default Table;