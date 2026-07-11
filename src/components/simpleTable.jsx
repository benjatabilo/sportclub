import { Table, Spinner } from "react-bootstrap";

export const SimpleTable = ({ headers, data, loading }) => {
  if (loading) return <div className="text-center p-4"><Spinner animation="border" variant="primary" /></div>;

  return (
    <div className="table-responsive border rounded shadow-sm">
      <Table hover className="mb-0">
        <thead className="table-dark">
          <tr>
            {headers.map((h, i) => <th key={i} className="py-3 px-3">{h}</th>)}
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.length > 0 ? data.map((row, i) => (
            <tr key={i}>{row}</tr>
          )) : (
            <tr><td colSpan={headers.length} className="text-center p-4">Sin registros</td></tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};