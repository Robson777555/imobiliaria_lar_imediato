/**
 * Utilitário simples de autenticação usando Python serverless functions
 */

export async function checkAuth(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/check', {
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.authenticated === true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

export async function login(username: string, password: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    return {
      success: response.ok && data.success === true,
      message: data.message
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erro ao fazer login'
    };
  }
}

export function logout(): void {
  // Remover cookie
  document.cookie = 'auth_token=; Path=/; Max-Age=0;';
  window.location.href = '/login';
}

