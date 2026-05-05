import { useState, useEffect } from 'react';
import authService from '../services/authService';

export interface UserPermissions {
  canViewDashboard: boolean;
  canManageUsers: boolean;
  canControlRobots: boolean;
  canConfigureSystem: boolean;
  canCreateJornadas: boolean;
  canEditJornadas: boolean;
  canDeleteJornadas: boolean;
  canManageTanques: boolean;
  canViewReports: boolean;
  canExportData: boolean;
  canViewLogs: boolean;
  canManageMalezas: boolean;
  canViewAllUsers: boolean;
  canEditOwnProfile: boolean;
  canEditAnyProfile: boolean;
}

export interface UserRole {
  role: 'admin' | 'viewer';
  permissions: UserPermissions;
  isAdmin: boolean;
  isViewer: boolean;
}

const getPermissionsByRole = (role: string, isSuperuser: boolean): UserPermissions => {
  const isAdmin = role === 'admin' || isSuperuser;
  
  if (isAdmin) {
    // Permisos completos para administradores
    return {
      canViewDashboard: true,
      canManageUsers: true,
      canControlRobots: true,
      canConfigureSystem: true,
      canCreateJornadas: true,
      canEditJornadas: true,
      canDeleteJornadas: true,
      canManageTanques: true,
      canViewReports: true,
      canExportData: true,
      canViewLogs: true,
      canManageMalezas: true,
      canViewAllUsers: true,
      canEditOwnProfile: true,
      canEditAnyProfile: true,
    };
  } else {
    // Permisos limitados para usuarios normales
    return {
      canViewDashboard: true,
      canManageUsers: false,
      canControlRobots: false,
      canConfigureSystem: false,
      canCreateJornadas: false,
      canEditJornadas: false,
      canDeleteJornadas: false,
      canManageTanques: false,
      canViewReports: true, // Solo reportes básicos
      canExportData: false,
      canViewLogs: false,
      canManageMalezas: false,
      canViewAllUsers: false,
      canEditOwnProfile: true,
      canEditAnyProfile: false,
    };
  }
};

export const usePermissions = (): UserRole | null => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = async () => {
      // Intentar cargar desde localStorage primero para rapidez
      const cachedUserStr = localStorage.getItem('user');
      if (cachedUserStr) {
        try {
          const cachedUser = JSON.parse(cachedUserStr);
          if (cachedUser.role) {
            const permissions = getPermissionsByRole(cachedUser.role, cachedUser.isAdmin || false);
            const isAdmin = cachedUser.role === 'admin' || cachedUser.isAdmin;
            
            setUserRole({
              role: isAdmin ? 'admin' : 'viewer',
              permissions,
              isAdmin,
              isViewer: !isAdmin
            });
            setLoading(false);
            // No retornamos aquí, seguimos para validar con el perfil real en segundo plano
          }
        } catch (e) {
          console.warn('Error parsing cached user:', e);
        }
      }

      try {
        const profile = await authService.obtenerPerfil();
        const permissions = getPermissionsByRole(profile.rol, profile.is_superuser);
        const isAdmin = profile.rol === 'admin' || profile.is_superuser;
        
        setUserRole({
          role: isAdmin ? 'admin' : 'viewer',
          permissions,
          isAdmin,
          isViewer: !isAdmin
        });
      } catch (error) {
        console.error('Error loading permissions:', error);
        // Si no hay cache y falla la API, entonces null
        if (!userRole) setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, []);

  return loading ? null : userRole;
};

export const useHasPermission = (permission: keyof UserPermissions): boolean => {
  const userRole = usePermissions();
  return userRole?.permissions[permission] || false;
};
