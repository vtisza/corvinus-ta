"use client"

import { useState, useEffect, useCallback } from "react"
import { Role } from "@/lib/types"

const ROLE_STORAGE_KEY = "corvinus_role"

export function useRole() {
  const [role, setRoleState] = useState<Role>("student")

  useEffect(() => {
    const stored = localStorage.getItem(ROLE_STORAGE_KEY) as Role | null
    if (stored && ["student", "instructor", "governance"].includes(stored)) {
      setRoleState(stored)
    }
  }, [])

  const setRole = useCallback((newRole: Role) => {
    localStorage.setItem(ROLE_STORAGE_KEY, newRole)
    setRoleState(newRole)
  }, [])

  return { role, setRole }
}
