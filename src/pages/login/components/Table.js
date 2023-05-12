import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { UseTransactionContext } from '../../contexts/Transactioncontext';

const Table = ({ data, handleDelete }) => {

    const { transactionvalue, setTransactionValue } = UseTransactionContext();

    // Main start
    const [currentPageData, setCurrentPageData] = useState([]);
    useEffect(() => {
        setCurrentPageData(data)
    }, [data])
    // Main End

    const [tableMeta, setTableMeta] = useState({
        search: '',
        perPage: 5,
        sort: {
            column: '',
            type: '', // string | number | date
            order: ''
        },
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState(data);

    // searching
    const [searchText, setSearch] = useState("");


    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    const getSearchData = (searchdata) => {
        return Object.values(searchdata).some(val => (((typeof val == "string") || (typeof val == "number")) && val.toString().toLowerCase().includes(searchText.toLowerCase())));
    }

    useEffect(() => {
        const { search, sort: { column, type, order } } = tableMeta;
        let searched = [...data];
        if (search) {
            searched = searched.filter(row => Object.values(row).some(cellValue => cellValue.includes(search)));
        }

        if (column) {
            switch (type) {
                case 'date':
                    switch (order) {
                        case 'ASC':
                            searched = searched.sort((a, b) => (new Date(a[column]).getTime()) > (new Date(b[column]).getTime()) ? 1 : -1);
                            break;
                        case 'DESC':
                            searched = searched.sort((a, b) => (new Date(a[column]).getTime()) < (new Date(b[column]).getTime()) ? 1 : -1);
                            break;
                        default:
                    }
                    break;
                case 'number':
                case 'currency':
                    switch (order) {
                        case 'ASC':
                            searched = searched.sort((a, b) => +a[column] > +b[column] ? 1 : -1);
                            break;
                        case 'DESC':
                            searched = searched.sort((a, b) => +a[column] < +b[column] ? 1 : -1);
                            break;
                        default:
                    }
                    break;
                default:
                    switch (order) {
                        case 'ASC':
                            searched = searched.sort((a, b) => a[column] > b[column] ? 1 : -1);
                            break;
                        case 'DESC':
                            searched = searched.sort((a, b) => a[column] < b[column] ? 1 : -1);
                            break;
                        default:
                    }
            }
        }
        setFilteredData(searched);
        onPageChange(1, searched);
        setCurrentPage(1);
        // eslint-disable-next-line
    }, [tableMeta]);

    const onPageChange = (newPage, freshFilteredData) => {
        const filtered = freshFilteredData ? freshFilteredData : [...filteredData];
        const start = (newPage - 1) * tableMeta.perPage;
        const end = newPage * tableMeta.perPage;
        setCurrentPage(newPage);
        setCurrentPageData(filtered.slice(start, end))
    }

    const handleSort = (column, type) => {
        const tempTableMeta = { ...tableMeta };
        const sortObj = tempTableMeta.sort;
        if (column === tempTableMeta.sort.column) {
            switch (tempTableMeta.sort.order) {
                case "":
                    sortObj.column = column;
                    sortObj.type = type;
                    sortObj.order = 'ASC';
                    break;
                case "ASC":
                    sortObj.order = 'DESC';
                    break;
                default:
                    sortObj.column = '';
                    sortObj.order = '';
            }
        } else {
            sortObj.column = column;
            sortObj.type = type;
            sortObj.order = 'ASC';
        }
        setTableMeta(tempTableMeta);
    }

    const totalPages = useMemo(() => {
        return Math.ceil(data.length / tableMeta.perPage)
        // eslint-disable-next-line
    }, [tableMeta.perPage]);

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
                                        {/* <Link to={`/viewdata/${row['id']}`}>Delete</Link> */}
                                        {/* <p onClick={() => handleDelete(row['id'])}>Delete</p> */}
                                    </div>
                                </td>
                            </tr>)}
                        </tbody>
                    </table>

                    <div class="pagination-wrapper flex text-center justify-between">
                        <div class="pagination">
                            {Array(totalPages)
                                .fill()
                                .map((item, index) =>
                                    <span className={`${index + 1 === currentPage ? 'active' : ''}`} onClick={() => onPageChange(index + 1)}>{index + 1}</span>
                                )
                            }
                        </div>
                    </div>
                </>
                :
                <div className='flex justify-center'><h4>No Data Found</h4></div>}
    </>
}

export default Table;