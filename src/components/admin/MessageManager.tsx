'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Divider,
  Grid,
  TextField,
  InputAdornment,
  Snackbar,
} from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { toggleMessageRead, deleteMessage } from '@/lib/admin-actions';

interface MessageData {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export default function MessageManager({ initialMessages }: { initialMessages: MessageData[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState<MessageData[]>(initialMessages);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<MessageData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MessageData | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const unreadCount = messages.filter((m) => !m.isRead).length;
  const readCount = messages.length - unreadCount;

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (filter === 'UNREAD' && m.isRead) return false;
      if (filter === 'READ' && !m.isRead) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          (m.subject && m.subject.toLowerCase().includes(q)) ||
          m.message.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [messages, filter, searchQuery]);

  const handleOpenDetail = async (msg: MessageData) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      await toggleMessageRead(msg.id, true);
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m)));
      router.refresh();
    }
  };

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    await toggleMessageRead(id, !currentStatus);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: !currentStatus } : m)));
    setToast(!currentStatus ? 'Marked as read.' : 'Marked as unread.');
    router.refresh();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteMessage(deleteTarget.id);
    setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    if (selectedMessage?.id === deleteTarget.id) {
      setSelectedMessage(null);
    }
    setToast(`Deleted transmission from ${deleteTarget.name}.`);
    setDeleteTarget(null);
    router.refresh();
  };

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'flex-end' }, mb: 3.5 }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'var(--font-mono), monospace',
              color: unreadCount > 0 ? '#F59E0B' : '#10B981',
              fontWeight: 700,
              letterSpacing: '0.1em',
            }}
          >
            MODULE 06 // CLIENT COMMUNICATIONS
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, mt: 0.5 }}>
            Inbound Dispatch Queue ({messages.length})
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'TOTAL TRANSMISSIONS', value: messages.length, color: '#F8FAFC' },
          { label: 'UNREAD ACTION QUEUE', value: unreadCount, color: unreadCount > 0 ? '#F59E0B' : '#10B981' },
          { label: 'REVIEWED / ARCHIVED', value: readCount, color: '#38BDF8' },
        ].map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: '#0B0E17',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: '10px',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.65rem',
                  color: '#64748B',
                  display: 'block',
                  mb: 0.5,
                }}
              >
                {stat.label}
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: stat.color,
                  lineHeight: 1,
                }}
              >
                {String(stat.value).padStart(2, '0')}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Filter & Search Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2.5,
          bgcolor: '#0B0E17',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '10px',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: { md: 'center' } }}
        >
          <Stack direction="row" spacing={0.75}>
            {(['ALL', 'UNREAD', 'READ'] as const).map((mode) => {
              const active = filter === mode;
              return (
                <Button
                  key={mode}
                  size="small"
                  onClick={() => setFilter(mode)}
                  sx={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.72rem',
                    px: 1.5,
                    py: 0.5,
                    bgcolor: active ? 'rgba(99, 102, 241, 0.14)' : 'transparent',
                    color: active ? 'primary.main' : '#94A3B8',
                    border: active
                      ? '1px solid rgba(99, 102, 241, 0.35)'
                      : '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  {mode}
                </Button>
              );
            })}
          </Stack>

          <TextField
            size="small"
            placeholder="Search sender, email, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: { xs: '100%', md: 280 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 17, color: '#64748B' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          bgcolor: '#0B0E17',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 100 }}>State</TableCell>
                <TableCell>Sender Identity</TableCell>
                <TableCell>Subject & Payload</TableCell>
                <TableCell>Received At</TableCell>
                <TableCell align="right">Operations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMessages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 7, color: 'text.secondary' }}>
                    No inbound dispatches match the current filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMessages.map((m) => (
                  <TableRow
                    key={m.id}
                    onClick={() => handleOpenDetail(m)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: m.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.03)',
                      transition: 'background-color 0.15s ease',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.025)' },
                    }}
                  >
                    <TableCell>
                      <Chip
                        label={m.isRead ? 'READ' : 'NEW'}
                        size="small"
                        sx={{
                          height: 21,
                          fontFamily: 'var(--font-mono), monospace',
                          bgcolor: m.isRead
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(99, 102, 241, 0.15)',
                          color: m.isRead ? '#64748B' : 'primary.main',
                          fontWeight: 700,
                          fontSize: '0.66rem',
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: m.isRead ? 600 : 800, color: '#F8FAFC' }}
                      >
                        {m.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ fontFamily: 'var(--font-mono), monospace', color: '#64748B' }}
                      >
                        {m.email}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: m.isRead ? 500 : 700, color: '#E2E8F0' }}
                      >
                        {m.subject || '(No Subject)'}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          maxWidth: 420,
                        }}
                      >
                        {m.message}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="caption"
                        sx={{ fontFamily: 'var(--font-mono), monospace', color: '#94A3B8' }}
                      >
                        {formatDate(m.createdAt)}
                      </Typography>
                    </TableCell>

                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDetail(m)}
                          sx={{ color: '#94A3B8', '&:hover': { color: 'primary.main' } }}
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleRead(m.id, m.isRead)}
                          sx={{ color: '#94A3B8', '&:hover': { color: 'primary.main' } }}
                        >
                          {m.isRead ? (
                            <MarkEmailUnreadOutlinedIcon fontSize="small" />
                          ) : (
                            <MarkEmailReadOutlinedIcon fontSize="small" />
                          )}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => setDeleteTarget(m)}
                          sx={{ color: '#94A3B8', '&:hover': { color: '#FB7185' } }}
                        >
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Message Inspector Modal */}
      <Dialog
        open={Boolean(selectedMessage)}
        onClose={() => setSelectedMessage(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedMessage && (
          <Box>
            <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              Inbound Dispatch Inspector
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
              <Stack spacing={2.5}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '10px',
                      bgcolor: 'rgba(99, 102, 241, 0.14)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono), monospace',
                      fontWeight: 800,
                    }}
                  >
                    {selectedMessage.name.slice(0, 2).toUpperCase()}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {selectedMessage.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontFamily: 'var(--font-mono), monospace', color: 'primary.main' }}
                    >
                      {selectedMessage.email}
                    </Typography>
                  </Box>
                </Stack>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{ fontFamily: 'var(--font-mono), monospace', color: '#64748B' }}
                  >
                    SUBJECT // TIMESTAMP
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 0.25 }}>
                    {selectedMessage.subject || '(No Subject)'}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontFamily: 'var(--font-mono), monospace', color: '#94A3B8' }}
                  >
                    {formatDate(selectedMessage.createdAt)}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'var(--font-mono), monospace',
                      color: '#64748B',
                      mb: 1,
                      display: 'block',
                    }}
                  >
                    MESSAGE PAYLOAD
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      bgcolor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '10px',
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                      {selectedMessage.message}
                    </Typography>
                  </Paper>
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions
              sx={{
                p: 2.5,
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                justifyContent: 'space-between',
              }}
            >
              <Button
                component="a"
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                  selectedMessage.subject || 'Portfolio Inquiry'
                )}`}
                variant="outlined"
                startIcon={<EmailOutlinedIcon />}
              >
                Reply via Email Client
              </Button>
              <Button onClick={() => setSelectedMessage(null)} variant="contained">
                Close
              </Button>
            </DialogActions>
          </Box>
        )}
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Transmission</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Permanently remove the message from{' '}
            <Box component="span" sx={{ color: '#F8FAFC', fontWeight: 700 }}>
              {deleteTarget?.name}
            </Box>
            ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDeleteTarget(null)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            sx={{ bgcolor: '#F43F5E', color: '#FFFFFF', '&:hover': { bgcolor: '#E11D48' } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(toast)} autoHideDuration={3500} onClose={() => setToast(null)} message={toast} />
    </Box>
  );
}
