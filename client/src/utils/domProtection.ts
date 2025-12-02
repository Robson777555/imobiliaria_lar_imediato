/**
 * Proteção global contra erros de DOM, especialmente removeChild
 * Este é um workaround para problemas conhecidos do React 19 com portais
 */

if (typeof window !== 'undefined') {
  // Salvar a implementação original
  const originalRemoveChild = Node.prototype.removeChild;
  
  // Sobrescrever removeChild com proteção
  Node.prototype.removeChild = function<T extends Node>(child: T): T {
    try {
      // Verificar se o nó é realmente filho antes de remover
      if (this.contains(child)) {
        return originalRemoveChild.call(this, child);
      } else {
        // Se não é filho, apenas retornar sem erro (silenciosamente)
        console.warn('[DOM Protection] Tentativa de remover nó que não é filho. Ignorando...', {
          parent: this,
          child: child,
        });
        return child;
      }
    } catch (error) {
      // Capturar qualquer erro e logar, mas não quebrar a aplicação
      console.warn('[DOM Protection] Erro ao remover nó. Ignorando...', error);
      return child;
    }
  };

  // Proteção adicional para replaceChild
  const originalReplaceChild = Node.prototype.replaceChild;
  Node.prototype.replaceChild = function<T extends Node>(newChild: Node, oldChild: T): T {
    try {
      if (this.contains(oldChild)) {
        return originalReplaceChild.call(this, newChild, oldChild);
      } else {
        console.warn('[DOM Protection] Tentativa de substituir nó que não é filho. Ignorando...');
        return oldChild;
      }
    } catch (error) {
      console.warn('[DOM Protection] Erro ao substituir nó. Ignorando...', error);
      return oldChild;
    }
  };
}

