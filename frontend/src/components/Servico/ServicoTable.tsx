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
  Typography,
  Checkbox,
  Paper,
  Toolbar,
  Chip,
  Menu,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import type { Servico } from "../../types/servico";
import { useState, useMemo } from "react";

const getPriorityColor = (dataVencimento: string | Date | undefined): "default" | "warning" | "error" | "success" => {
  if (!dataVencimento) return "default";

  const dataAtual = new Date();
  const vencimento = new Date(dataVencimento); 
  
  const diffTime = vencimento.getTime() - dataAtual.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  if (diffDays <= 90 && diffDays > 0) return "warning";
  
  if (diffDays <= 0) return "error"; 
  
  if (diffDays <= 365) return "success"; 

  return "default";
};

const getPriorityLabel = (color: "default" | "warning" | "error" | "success"): string => {
  switch (color) {
    case "error":
      return "Vencido/Crítico (0 dias)";
    case "warning":
      return "3 Meses (Alto)";
    case "success":
      return "6-12 Meses (Médio)";
    default:
      return "Mais de 1 Ano (Baixo)";
  }
};

interface ServicoTableProps {
  servicos: Servico[];
  deletingId: number | null;
  onDelete: (id: number) => void;
  onEdit: (servico: Servico) => void;
  loading: boolean;
  onBatchAction: (ids: number[]) => void;
}

export const ServicoTable = ({
  servicos,
  deletingId,
  onDelete,
  onEdit,
  loading,
  onBatchAction,
}: ServicoTableProps) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
      setAnchorEl(null);
  };

  const handleBatchDelete = () => {
      handleMenuClose();
      onBatchAction(selectedIds); 
      setSelectedIds([]); 
  };

  const handleBatchMarkCompleted = () => {
      handleMenuClose();
      console.log("Ação: Marcar como Concluído para IDs:", selectedIds);
      setSelectedIds([]); 
  };

  const serviceIds: number[] = useMemo(
    () => servicos.map((s) => (s as any).id).filter(Boolean),
    [servicos]
  );

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(serviceIds);
      return;
    }
    setSelectedIds([]);
  };

  const handleClick = (id: number) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      );
    }
    setSelectedIds(newSelected);
  };

  const isSelected = (id: number) => selectedIds.indexOf(id) !== -1;

  const numSelected = selectedIds.length;
  const rowCount = serviceIds.length;
  const isAllSelected = rowCount > 0 && numSelected === rowCount;
  const isIndeterminate = numSelected > 0 && numSelected < rowCount;

  const BatchToolbar = () => (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            theme.palette.primary.light,
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selecionado(s)
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Lista de Serviços
        </Typography>
      )}

      {numSelected > 0 && (
        <>
        <Tooltip title="Opções em Lote">
            <IconButton 
                onClick={handleMenuOpen} 
                color="inherit"
                aria-label="Opções em Lote"
                aria-controls={isMenuOpen ? 'batch-menu' : undefined}
                aria-haspopup="true"
            >
                <MoreVertIcon />
            </IconButton>
        </Tooltip>
        <Menu
            id="batch-menu"
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            MenuListProps={{
                'aria-labelledby': 'batch-action-button',
            }}
        >
            <MenuItem onClick={handleBatchDelete} disabled={numSelected === 0}>
                <DeleteIcon sx={{ mr: 1 }} /> Excluir Múltiplas
            </MenuItem>
            <MenuItem onClick={handleBatchMarkCompleted} disabled={numSelected === 0}>
                <CheckCircleOutlineIcon sx={{ mr: 1 }} /> Marcar como Concluído
            </MenuItem>
        </Menu>
        </>
      )}
    </Toolbar>
  );

  return (
    <Paper elevation={3} className="rounded-lg overflow-hidden"> 
      <BatchToolbar />
      <TableContainer>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={handleSelectAllClick}
                    disabled={serviceIds.length === 0}
                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Dados (Descrição)</TableCell>
                <TableCell>Prioridade</TableCell> 
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servicos.map((s) => {
                const id = (s as any).id;
                const isItemDeleting = deletingId === id;
                const isItemSelected = isSelected(id);
                const dataVencimento = (s as any).data_vencimento; 
                const priorityColor = getPriorityColor(dataVencimento);
                const priorityLabel = getPriorityLabel(priorityColor);

                return (
                  <TableRow
                    hover
                    onClick={() => handleClick(id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={id ?? Math.random()}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onClick={(event) => event.stopPropagation()} 
                        onChange={() => handleClick(id)}
                      />
                    </TableCell>
                    <TableCell>{id ?? "-"}</TableCell>
                    <TableCell>
                      {(s as any).descricao ?? JSON.stringify(s)}
                    </TableCell>
                    <TableCell>
                      {dataVencimento ? (
                        <Tooltip title={`Vencimento: ${new Date(dataVencimento).toLocaleDateString()}`}>
                            <Chip 
                              label={priorityLabel}
                              color={priorityColor as any} 
                              variant="outlined"
                              size="small"
                            />
                        </Tooltip>
                      ) : (
                        <Chip label="Data Indefinida" variant="outlined" size="small"/>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton onClick={(e) => { e.stopPropagation(); onEdit(s); }}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <span>
                          <IconButton
                            onClick={(e) => { e.stopPropagation(); onDelete(id); }} 
                            disabled={isItemDeleting}
                          >
                            {isItemDeleting ? (
                              <CircularProgress size={24} />
                            ) : (
                              <DeleteIcon />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {servicos.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} align="center" sx={{py: 4}}>
                        <Typography color="text.secondary">
                            Nenhum serviço encontrado.
                        </Typography>
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Paper>
  );
};