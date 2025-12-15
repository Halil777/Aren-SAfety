import type React from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  FileDown,
  FileSpreadsheet,
  FileText,
  Printer,
  ChevronDown,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { PageHeader } from '@/shared/ui/page-header'
import { useProjectsQuery } from '@/features/projects/api/hooks'
import { useDepartmentsQuery } from '@/features/departments/api/hooks'
import { useCompaniesQuery } from '@/features/companies/api/hooks'
import {
  useCreateMobileUserMutation,
  useDeleteMobileUserMutation,
  useMobileUsersQuery,
  useUpdateMobileUserMutation,
} from '../api/hooks'
import {
  useCreateSupervisorMutation,
  useDeleteSupervisorMutation,
  useSupervisorsQuery,
  useUpdateSupervisorMutation,
} from '@/features/supervisors/api/hooks'
import type { Supervisor, SupervisorInput } from '@/features/supervisors/types/supervisor'
import type { MobileUser, MobileUserInput } from '../types/mobile-user'

export function UsersListPage() {
  const { t } = useTranslation()
  const projectsQuery = useProjectsQuery()
  const departmentsQuery = useDepartmentsQuery()
  const companiesQuery = useCompaniesQuery()
  const usersQuery = useMobileUsersQuery()
  const supervisorsQuery = useSupervisorsQuery()
  const createUserMutation = useCreateMobileUserMutation()
  const deleteUserMutation = useDeleteMobileUserMutation()
  const updateUserMutation = useUpdateMobileUserMutation()
  const createSupervisorMutation = useCreateSupervisorMutation()
  const deleteSupervisorMutation = useDeleteSupervisorMutation()
  const updateSupervisorMutation = useUpdateSupervisorMutation()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [activeRole, setActiveRole] = useState<'USER' | 'SUPERVISOR'>('USER')
  const [searchTerm, setSearchTerm] = useState('')
  const [exportOpen, setExportOpen] = useState(false)
  const [formState, setFormState] = useState<UserForm>({
    fullName: '',
    phoneNumber: '',
    email: '',
    profession: '',
    login: '',
    password: '',
    projectIds: [],
    isActive: true,
    departmentId: '',
    companyId: '',
  })

  const isUsersTab = activeRole === 'USER'
  const rows = isUsersTab ? usersQuery.data ?? [] : supervisorsQuery.data ?? []
  const isLoading = isUsersTab ? usersQuery.isLoading : supervisorsQuery.isLoading
  const error = (isUsersTab ? usersQuery.error : supervisorsQuery.error) as
    | Error
    | null
    | undefined
  const isSaving =
    createUserMutation.isPending ||
    updateUserMutation.isPending ||
    createSupervisorMutation.isPending ||
    updateSupervisorMutation.isPending
  const isDeleting = deleteUserMutation.isPending || deleteSupervisorMutation.isPending
  const colSpan = activeRole === 'SUPERVISOR' ? 7 : 5

  const filteredRows = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase()
    if (!needle) return rows

    return rows.filter(row => {
      const nameMatch = row.fullName?.toLowerCase().includes(needle)
      const statusLabel = row.isActive
        ? t('common.active', { defaultValue: 'Active' })
        : t('common.inactive', { defaultValue: 'Inactive' })
      const statusMatch = statusLabel.toLowerCase().includes(needle)
      const projectNames =
        (row.projects && row.projects.length > 0
          ? row.projects
          : projectsQuery.data?.filter(p => row.projectIds?.includes(p.id)))?.map(p => p.name) ??
        []
      const projectMatch = projectNames.some(name => name?.toLowerCase().includes(needle))

      return Boolean(nameMatch || statusMatch || projectMatch)
    })
  }, [rows, searchTerm, projectsQuery.data, t])

  const exportColumns = useMemo(() => {
    const base = [
      t('users.table.name', { defaultValue: 'Name' }),
      t('users.table.login', { defaultValue: 'Login' }),
      t('users.table.projects', { defaultValue: 'Projects' }),
    ]
    if (activeRole === 'SUPERVISOR') {
      base.push(
        t('supervisors.table.department', { defaultValue: 'Department' }),
        t('supervisors.table.company', { defaultValue: 'Company' }),
      )
    }
    base.push(t('users.table.status', { defaultValue: 'Status' }))
    return base
  }, [activeRole, t])

  const exportRows = useMemo(() => {
    return filteredRows.map(row => {
      const statusText = row.isActive
        ? t('common.active', { defaultValue: 'Active' })
        : t('common.inactive', { defaultValue: 'Inactive' })

      const projectNames =
        (row.projects && row.projects.length > 0
          ? row.projects
          : projectsQuery.data?.filter(p => row.projectIds?.includes(p.id)))?.map(p => p.name) ?? []
      const projectsValue =
        projectNames.length > 0 ? projectNames.join(', ') : t('common.noData', { defaultValue: 'N/A' })

      const rowCells: string[] = [row.fullName || '', row.login || '', projectsValue]

      if (activeRole === 'SUPERVISOR') {
        const dept =
          'department' in row
            ? row.department?.name ||
              departmentsQuery.data?.find(d => d.id === row.departmentId)?.name ||
              t('common.noData', { defaultValue: 'N/A' })
            : t('common.noData', { defaultValue: 'N/A' })

        const company =
          'company' in row
            ? row.company?.companyName ||
              companiesQuery.data?.find(c => c.id === row.companyId)?.companyName ||
              t('common.noData', { defaultValue: 'N/A' })
            : t('common.noData', { defaultValue: 'N/A' })

        rowCells.push(dept || '', company || '')
      }

      rowCells.push(statusText)
      return rowCells
    })
  }, [
    activeRole,
    filteredRows,
    t,
    projectsQuery.data,
    departmentsQuery.data,
    companiesQuery.data,
  ])

  const headTitle = useMemo(() => {
    const base = t('pages.users.title', { defaultValue: 'Users' })
    const suffix =
      activeRole === 'SUPERVISOR'
        ? t('nav.supervisors', { defaultValue: 'Supervisors' })
        : t('nav.users', { defaultValue: 'Users' })
    return `${suffix || base} | Safety Tenant Admin`
  }, [activeRole, t])

  const handleExportExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([exportColumns, ...exportRows])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Users')
    XLSX.writeFile(wb, `users-${activeRole.toLowerCase()}.xlsx`)
    setExportOpen(false)
  }

  const handleExportPdf = () => {
    const doc = new jsPDF()
    doc.setFontSize(14)
    doc.text(headTitle, 14, 16)
    autoTable(doc, {
      head: [exportColumns],
      body: exportRows,
      startY: 22,
    })
    doc.save(`users-${activeRole.toLowerCase()}.pdf`)
    setExportOpen(false)
  }

  const handlePrint = () => {
    const headersHtml = exportColumns.map(col => `<th style="text-align:left;padding:8px;">${col}</th>`).join('')
    const bodyHtml = exportRows
      .map(
        row =>
          `<tr>${row
            .map(cell => `<td style="padding:8px;border-top:1px solid #e5e7eb;">${cell ?? ''}</td>`)
            .join('')}</tr>`,
      )
      .join('')

    const printWindow = window.open('', '', 'width=900,height=650')
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>${headTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 16px; color: #111827; }
            table { border-collapse: collapse; width: 100%; }
            th { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
            td { font-size: 13px; color: #111827; }
          </style>
        </head>
        <body>
          <h3 style="margin-bottom: 12px;">${headTitle}</h3>
          <table>
            <thead><tr>${headersHtml}</tr></thead>
            <tbody>${bodyHtml}</tbody>
          </table>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
    setExportOpen(false)
  }

  const handleOpenDrawer = (row?: MobileUser | Supervisor) => {
    if (row) {
      setEditingId(row.id)
      setFormState({
        fullName: row.fullName,
        phoneNumber: row.phoneNumber,
        email: row.email ?? '',
        profession: row.profession ?? '',
        login: row.login,
        password: '',
        projectIds: row.projects?.map(p => p.id) ?? row.projectIds ?? [],
        isActive: row.isActive,
        departmentId: 'departmentId' in row ? row.departmentId ?? '' : '',
        companyId: 'companyId' in row ? row.companyId ?? '' : '',
      })
      setActiveRole('SUPERVISOR')
    } else {
      setEditingId(null)
      setFormState({
        fullName: '',
        phoneNumber: '',
        email: '',
        profession: '',
        login: '',
        password: '',
        projectIds: [],
        isActive: true,
        departmentId: '',
        companyId: '',
      })
    }
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      t('common.confirmDelete', { defaultValue: 'Are you sure you want to delete?' }),
    )
    if (!confirmed) return

    if (activeRole === 'USER') {
      deleteUserMutation.mutate(id)
    } else {
      deleteSupervisorMutation.mutate(id)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload: MobileUserInput = {
      fullName: formState.fullName,
      phoneNumber: formState.phoneNumber,
      email: formState.email || undefined,
      profession: formState.profession || undefined,
      login: formState.login,
      password: formState.password || undefined,
      projectIds: formState.projectIds,
      isActive: formState.isActive,
    }

    if (activeRole === 'USER') {
      if (editingId) {
        await updateUserMutation.mutateAsync({ id: editingId, data: payload })
      } else {
        await createUserMutation.mutateAsync(payload)
      }
    } else {
      const supervisorPayload: SupervisorInput = {
        ...payload,
        departmentId: formState.departmentId || undefined,
        companyId: formState.companyId || undefined,
      }
      if (editingId) {
        await updateSupervisorMutation.mutateAsync({ id: editingId, data: supervisorPayload })
      } else {
        await createSupervisorMutation.mutateAsync(supervisorPayload)
      }
    }
    handleCloseDrawer()
  }

  const toggleProject = (id: string) => {
    setFormState(s => ({
      ...s,
      projectIds: s.projectIds.includes(id)
        ? s.projectIds.filter(pid => pid !== id)
        : [...s.projectIds, id],
    }))
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>{headTitle}</title>
      </Helmet>
      <PageHeader
        title={t('pages.users.title')}
        description={t('pages.users.description')}
        actions={
          <Button type="button" variant="outline" onClick={() => handleOpenDrawer()}>
            <Plus className="mr-2 h-4 w-4" />
            {t('nav.users')}
          </Button>
        }
      />
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <Button
            variant={activeRole === 'USER' ? 'default' : 'outline'}
            onClick={() => setActiveRole('USER')}
          >
            {t('nav.users')}
          </Button>
          <Button
            variant={activeRole === 'SUPERVISOR' ? 'default' : 'outline'}
            onClick={() => setActiveRole('SUPERVISOR')}
          >
            {t('nav.supervisors')}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t('users.table.searchPlaceholder', {
              defaultValue: 'Search by name, project, or status',
            })}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:w-72"
          />
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => setExportOpen(o => !o)}
            >
              <FileDown className="h-4 w-4" />
              {t('common.export', { defaultValue: 'Export' })}
              <ChevronDown className="h-4 w-4" />
            </Button>
            {exportOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-48 rounded-md border border-border bg-background shadow-lg">
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  <FileSpreadsheet className="h-4 w-4 text-primary" />
                  <span>{t('common.exportExcel', { defaultValue: 'Export Excel' })}</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportPdf}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  <FileText className="h-4 w-4 text-primary" />
                  <span>{t('common.exportPdf', { defaultValue: 'Export PDF' })}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  <Printer className="h-4 w-4 text-primary" />
                  <span>{t('common.print', { defaultValue: 'Print table' })}</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Card>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <Th>{t('users.table.name', { defaultValue: 'Name' })}</Th>
                  <Th>{t('users.table.login', { defaultValue: 'Login' })}</Th>
                  <Th>{t('users.table.projects', { defaultValue: 'Projects' })}</Th>
                  {activeRole === 'SUPERVISOR' ? (
                    <>
                      <Th>{t('supervisors.table.department', { defaultValue: 'Department' })}</Th>
                      <Th>{t('supervisors.table.company', { defaultValue: 'Company' })}</Th>
                    </>
                  ) : null}
                  <Th>{t('users.table.status', { defaultValue: 'Status' })}</Th>
                  <Th className="w-24 text-center">
                    {t('users.table.actions', { defaultValue: 'Actions' })}
                  </Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={colSpan}
                      className="px-4 py-6 text-center text-sm text-muted-foreground"
                    >
                      {t('common.loading', { defaultValue: 'Loading...' })}
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={colSpan}
                      className="px-4 py-6 text-center text-sm text-destructive"
                    >
                      {error.message}
                    </td>
                  </tr>
                ) : filteredRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={colSpan}
                      className="px-4 py-6 text-center text-sm text-muted-foreground"
                    >
                      {searchTerm.trim()
                        ? t('common.noResults', {
                            defaultValue: 'No matching results.',
                          })
                        : activeRole === 'USER'
                        ? t('users.table.empty', { defaultValue: 'No users yet.' })
                        : t('supervisors.table.empty', { defaultValue: 'No supervisors yet.' })}
                    </td>
                  </tr>
                ) : (
                  filteredRows.map(row => (
                    <tr key={row.id} className="hover:bg-muted/40">
                      <Td>{row.fullName}</Td>
                      <Td>{row.login}</Td>
                      <Td>
                        <div className="flex flex-wrap gap-1">
                          {(row.projects && row.projects.length > 0
                            ? row.projects
                            : projectsQuery.data?.filter(p => row.projectIds?.includes(p.id)))?.map(
                              project => (
                                <span
                                  key={project.id}
                                  className="rounded-full bg-muted px-2 py-0.5 text-xs text-foreground"
                                >
                                  {project.name}
                                </span>
                              ),
                            ) || t('common.noData', { defaultValue: 'N/A' })}
                        </div>
                      </Td>
                      {activeRole === 'SUPERVISOR' ? (
                        <>
                          <Td>
                            {'department' in row
                              ? row.department?.name ||
                                departmentsQuery.data?.find(d => d.id === row.departmentId)?.name ||
                                t('common.noData', { defaultValue: 'N/A' })
                              : t('common.noData', { defaultValue: 'N/A' })}
                          </Td>
                          <Td>
                            {'company' in row
                              ? row.company?.companyName ||
                                companiesQuery.data?.find(c => c.id === row.companyId)?.companyName ||
                                t('common.noData', { defaultValue: 'N/A' })
                              : t('common.noData', { defaultValue: 'N/A' })}
                          </Td>
                        </>
                      ) : null}
                      <Td>
                        {row.isActive
                          ? t('common.active', { defaultValue: 'Active' })
                          : t('common.inactive', { defaultValue: 'Inactive' })}
                      </Td>
                      <Td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            aria-label={t('common.edit', { defaultValue: 'Edit' })}
                            onClick={() => handleOpenDrawer(row)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            aria-label={t('common.delete', { defaultValue: 'Delete' })}
                            onClick={() => handleDelete(row.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {drawerOpen ? (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="h-screen w-full bg-background shadow-2xl md:w-[36%]">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingId
                    ? t('users.form.editTitle', { defaultValue: 'Edit User' })
                    : t('users.form.createTitle', { defaultValue: 'Add User' })}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('users.form.subtitle', { defaultValue: 'User details' })}
                </p>
              </div>
              <Button variant="ghost" onClick={handleCloseDrawer}>
                {t('common.cancel', { defaultValue: 'Cancel' })}
              </Button>
            </div>
            <div className="relative h-[calc(100vh-64px)] overflow-y-auto p-4">
              {isSaving ? (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
                    {t('common.loading', { defaultValue: 'Saving...' })}
                  </div>
                </div>
              ) : null}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <TwoCol>
                  <Field
                    label={
                      activeRole === 'USER'
                        ? t('users.form.name', { defaultValue: 'Full name' })
                        : t('supervisors.form.name', { defaultValue: 'Full name' })
                    }
                    required
                  >
                    <input
                      required
                      type="text"
                      value={formState.fullName}
                      onChange={e => setFormState(s => ({ ...s, fullName: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </Field>
                  <Field
                    label={t('users.form.login', { defaultValue: 'Login' })}
                    required
                  >
                    <input
                      required
                      type="text"
                      value={formState.login}
                      onChange={e => setFormState(s => ({ ...s, login: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </Field>
                </TwoCol>

                <TwoCol>
                  <Field
                    label={t('users.form.phone', { defaultValue: 'Phone number' })}
                    required
                  >
                    <input
                      required
                      type="tel"
                      value={formState.phoneNumber}
                      onChange={e => setFormState(s => ({ ...s, phoneNumber: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </Field>
                  <Field label={t('users.form.email', { defaultValue: 'Email' })}>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </Field>
                </TwoCol>

                  <Field
                    label={
                      activeRole === 'USER'
                        ? t('users.form.profession', { defaultValue: 'Profession' })
                        : t('supervisors.form.profession', { defaultValue: 'Profession' })
                    }
                  >
                  <input
                    type="text"
                    value={formState.profession}
                    onChange={e => setFormState(s => ({ ...s, profession: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </Field>

                <Field label={t('users.form.password', { defaultValue: 'Password' })}>
                  <input
                    type="password"
                    value={formState.password}
                    placeholder={
                      editingId
                        ? t('users.form.passwordPlaceholderEdit', {
                            defaultValue: 'Leave blank to keep current',
                          })
                        : t('users.form.passwordPlaceholder', {
                            defaultValue: 'Set initial password',
                          })
                    }
                    onChange={e => setFormState(s => ({ ...s, password: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </Field>

                <Field label={t('users.form.projects', { defaultValue: 'Projects' })} required>
                    <div className="flex flex-wrap gap-2">
                      {projectsQuery.data?.map(project => {
                        const selected = formState.projectIds.includes(project.id)
                        return (
                          <button
                            type="button"
                            key={project.id}
                          onClick={() => toggleProject(project.id)}
                          className={
                            'rounded-full border px-3 py-1 text-sm transition ' +
                            (selected
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border text-foreground')
                          }
                        >
                          {project.name}
                        </button>
                      )
                    })}
                    {!projectsQuery.data?.length
                      ? t('common.noData', { defaultValue: 'N/A' })
                      : null}
                  </div>
                </Field>

                {activeRole === 'SUPERVISOR' ? (
                  <>
                    <Field
                      label={t('supervisors.form.department', { defaultValue: 'Department' })}
                    >
                      <select
                        value={formState.departmentId}
                        onChange={e => setFormState(s => ({ ...s, departmentId: e.target.value }))}
                        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      >
                        <option value="">
                          {t('supervisors.form.departmentPlaceholder', {
                            defaultValue: 'Select department',
                          })}
                        </option>
                        {departmentsQuery.data?.map(department => (
                          <option key={department.id} value={department.id}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label={t('supervisors.form.company', { defaultValue: 'Company' })}>
                      <select
                        value={formState.companyId}
                        onChange={e => setFormState(s => ({ ...s, companyId: e.target.value }))}
                        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      >
                        <option value="">
                          {t('supervisors.form.companyPlaceholder', {
                            defaultValue: 'Select company',
                          })}
                        </option>
                        {companiesQuery.data?.map(company => (
                          <option key={company.id} value={company.id}>
                            {company.companyName}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </>
                ) : null}

                <Field label={t('users.form.status', { defaultValue: 'Status' })}>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formState.isActive}
                      onChange={e => setFormState(s => ({ ...s, isActive: e.target.checked }))}
                      className="h-4 w-4 rounded border-border"
                    />
                    <span className="text-sm">
                      {formState.isActive
                        ? t('common.active', { defaultValue: 'Active' })
                        : t('common.inactive', { defaultValue: 'Inactive' })}
                    </span>
                  </div>
                </Field>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDrawer}>
                    {t('common.cancel', { defaultValue: 'Cancel' })}
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      !formState.fullName ||
                      !formState.login ||
                      !formState.phoneNumber ||
                      formState.projectIds.length === 0 ||
                      (!editingId && !formState.password) ||
                      isSaving
                    }
                  >
                    {editingId
                      ? t('common.save', { defaultValue: 'Save' })
                      : t('users.actions.add', { defaultValue: 'Add User' })}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

type UserForm = {
  fullName: string
  phoneNumber: string
  email: string
  profession: string
  login: string
  password: string
  projectIds: string[]
  isActive: boolean
  departmentId: string
  companyId: string
}

const TwoCol = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{children}</div>
)

const Field = ({
  label,
  children,
  required,
}: {
  label: string
  children: React.ReactNode
  required?: boolean
}) => (
  <label className="space-y-1 text-sm font-medium text-foreground">
    <span>
      {label}
      {required ? <span className="text-destructive">*</span> : null}
    </span>
    {children}
  </label>
)

const Th = (props: React.HTMLAttributes<HTMLTableCellElement>) => (
  <th
    className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
    {...props}
  />
)

const Td = (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className="px-4 py-3 text-sm text-foreground align-middle" {...props} />
)
