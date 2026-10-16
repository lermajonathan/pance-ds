/* Pance · Dialogs — ConfirmDialog
   A Modal for decisions that are hard to undo. With `requireText` the person must type a phrase
   (usually the item's name) before the confirm button works, so a stray Enter cannot delete anything. */
import { useEffect, useState, type ReactNode } from 'react'
import { useLabels } from './labels'
import { IconTrash, type IconType } from '../icons'
import type { Severity } from './shared'
import { Modal } from './overlays'
import { Button } from './button'
import { Field, Input } from './forms'

export function ConfirmDialog({
  open, onClose, onConfirm, title, description, confirmLabel, cancelLabel, severity = 'danger', icon = IconTrash, requireText, loading, children,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  /** Text of the confirm button, as an action: "Delete stream". */
  confirmLabel: string
  /** Defaults to the translated "Cancel". */
  cancelLabel?: string
  severity?: Severity
  icon?: IconType
  /** Phrase to type before the confirm button is enabled. */
  requireText?: string
  loading?: boolean
  children?: ReactNode
}) {
  const l = useLabels()
  const [typed, setTyped] = useState('')
  useEffect(() => { if (!open) setTyped('') }, [open])
  const ok = !requireText || typed === requireText
  return (
    <Modal
      open={open} onClose={onClose} title={title} description={description} size="sm" icon={icon} iconSeverity={severity}
      footer={
        <>
          <Button severity="secondary" variant="outlined" onClick={onClose}>{cancelLabel ?? l.cancel}</Button>
          <Button severity={severity} loading={loading} disabled={!ok} onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    >
      {children}
      {requireText && (
        <Field label={l.typeToConfirm(requireText)}>
          <Input value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" spellCheck={false} />
        </Field>
      )}
    </Modal>
  )
}
