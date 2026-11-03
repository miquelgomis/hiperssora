"use client"

import { ChevronDown, Lock, LogOut } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Modal, ModalClose, ModalTrigger } from "@/components/common"
import { getInitials } from "@/lib/strings"
import type { Cashier } from "@/types/pos"

import { CashierIdentity } from "./cashier-identity"

export type UserDialogProps = {
  cashier: Cashier
  onLock?: () => void
  onLogout?: () => void
  /** Abre el modal de inicio (útil para documentar). */
  defaultOpen?: boolean
}

/**
 * Botón del cajero en la cabecera. Abre un modal con las opciones de
 * bloquear la pantalla y cerrar sesión.
 */
export function UserDialog({
  cashier,
  onLock,
  onLogout,
  defaultOpen,
}: UserDialogProps) {
  const initials = getInitials(cashier.name)

  return (
    <Modal
      defaultOpen={defaultOpen}
      trigger={
        <ModalTrigger
          render={<Button variant="ghost" size="xl" className="px-2" />}
        >
          <CashierIdentity cashier={cashier} />
          <ChevronDown className="text-muted-foreground" aria-hidden />
        </ModalTrigger>
      }
      media={
        <Avatar size="lg" className="size-16 text-lg">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      }
      title={cashier.name}
      description={`Caja ${cashier.register}`}
      showCloseButton
    >
      <div className="grid gap-2">
        <ModalClose
          render={<Button variant="outline" size="xl" />}
          onClick={onLock}
        >
          <Lock aria-hidden />
          Bloquear pantalla
        </ModalClose>
        <ModalClose
          render={<Button variant="destructive" size="xl" />}
          onClick={onLogout}
        >
          <LogOut aria-hidden />
          Cerrar sesión
        </ModalClose>
      </div>
    </Modal>
  )
}
