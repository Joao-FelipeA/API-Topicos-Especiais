import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { Servico } from "../../types/servico";

interface ServicoTableProps {
    servicos: Servico[];
    deletingId: number | null;
    onDelete: (id: number)  => void;
    onEdit: (servico: Servico) => void;
    loading: boolean;
}

export const ServicoTable = ({
    servicos,
    deletingId,
    onDelete,
    onEdit,
    loading,
}: ServicoTableProps) => {
  return (
    <TableContainer>
      {loading ? (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Dados</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {servicos.map((s) => (
              <TableRow key={(s as any).id ?? Math.random()}>
                <TableCell>{(s as any).id ?? "-"}</TableCell>
                <TableCell>{(s as any).descricao ?? JSON.stringify(s)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton onClick={() => onEdit(s)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <span>
                      <IconButton
                        onClick={() => onDelete((s as any).id)}
                        disabled={deletingId === (s as any).id}
                      >
                        {deletingId === (s as any).id ? (
                          <CircularProgress size={24} />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};