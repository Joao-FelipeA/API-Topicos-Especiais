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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useState, useMemo } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
export interface Servico {
  id?: number;
  descricao?: string;
  data_vencimento?: string | null;
  motivo?: string | null;
  [key: string]: any;
}

export interface ServicoTableProps {
  servicos: Servico[];
  deletingId?: number | null;
  onDelete: (id?: number | null) => void;
  onEdit: (s: Servico) => void;
  loading?: boolean;
  onBatchAction?: (ids: number[]) => void;
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

  // novo estado para mostrar motivo
  const [motivoOpen, setMotivoOpen] = useState(false);
  const [openServico, setOpenServico] = useState<Servico | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
      setAnchorEl(null);
  };

  // removed unused handleBatchDelete; batch delete will be invoked from the menu below
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

  // abre modal de motivo ao clicar na linha
  const handleRowOpen = (s: Servico) => {
    setOpenServico(s);
    setMotivoOpen(true);
  };

  const handleMotivoClose = () => {
    setMotivoOpen(false);
    setOpenServico(null);
  };

  const BatchToolbar = () => {
    if (numSelected === 0) return null;

    return (
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1,
          bgcolor: (theme) => theme.palette.action.hover,
        }}
      >
        <Typography variant="subtitle1">{numSelected} selecionado(s)</Typography>

        <>
          <Button
            variant="outlined"
            size="small"
            onClick={handleMenuOpen}
            aria-controls={isMenuOpen ? "batch-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={isMenuOpen ? "true" : undefined}
          >
            Ações em lote
          </Button>

          <Menu
            id="batch-menu"
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                onBatchAction?.(selectedIds);
                setSelectedIds([]);
              }}
            >
              Excluir selecionados
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                handleBatchMarkCompleted();
              }}
            >
              Marcar como Concluído
            </MenuItem>
          </Menu>
        </>
      </Toolbar>
    );
  };

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
              {servicos.map((s, idx) => {
                const id = (s as any).id;
                const isItemDeleting = deletingId === id;
                const isItemSelected = isSelected(id);
                const dataVencimento = (s as any).data_vencimento; 
                const computePriorityColor = (date: any) => {
                  if (!date) return undefined;
                  const due = new Date(date);
                  const today = new Date();
                  // difference in days (due - today)
                  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  if (isNaN(diffDays)) return undefined;
                  if (diffDays < 0) return "error";
                  if (diffDays <= 3) return "warning";
                  return "success";
                };
                const computePriorityLabel = (color: string | undefined, date: any) => {
                  if (!date) return "Indefinida";
                  switch (color) {
                    case "error":
                      return "Vencido";
                    case "warning":
                      return "Próximo";
                    case "success":
                      return "OK";
                    default:
                      return "Pendente";
                  }
                };
                const priorityColor = computePriorityColor(dataVencimento);
                const priorityLabel = computePriorityLabel(priorityColor as any, dataVencimento);

                return (
                  <TableRow
                    hover
                    onClick={() => handleRowOpen(s)} // abre modal com motivo
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={id ?? `row-${idx}`}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        // evita que o clique no checkbox abra o modal (propagação)
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => {
                          // change event pode vir sem id válido; só altera seleção se id existir
                          event.stopPropagation();
                          if (typeof id === "number") handleClick(id);
                        }}
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

      {/* Modal que mostra o motivo do serviço */}
      <Dialog open={motivoOpen} onClose={handleMotivoClose}>
        <DialogTitle>Motivo</DialogTitle>
        <DialogContent dividers>
          <Typography>
            {openServico?.motivo ? openServico.motivo : "Sem motivo informado."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMotivoClose}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );}