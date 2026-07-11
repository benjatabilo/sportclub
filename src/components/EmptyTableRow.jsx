/**
 * Fila de "sin resultados" reutilizable para tablas vacías.
 */
function EmptyTableRow({ colSpan, message = "No hay registros." }) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center text-muted py-4">
        {message}
      </td>
    </tr>
  );
}

export default EmptyTableRow;