import React from "react";
import { useTable } from "react-table";
import sortIcon from './sort.png';

const ReactTableComponent = (props) => {
  const { data, columns } = props;
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  return (
    <table {...getTableProps()} style={{ width: "100%", border: "1px solid black" }}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()} style={{ padding: "10px", border: "1px solid black" }}>
                {(column.render("Header") === "Expense Amount" || column.render("Header") === "Date") ?
                  (
                    <>
                      {column.render("Header")} <img src={sortIcon} alt="Sort Icon" onClick={() => props.handleSorting(column.render("Header"))} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                    </>
                  ) :
                  (
                    column.render("Header")
                  )
                }

              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()} style={{ padding: "10px", border: "1px solid black" }}>
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ReactTableComponent;
