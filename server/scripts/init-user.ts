import { createUserWithPassword } from '../_core/auth.js';

const USERNAME = '@userCliente96';
const PASSWORD = '@passwordCliente96';

async function main() {
  try {
    await createUserWithPassword(USERNAME, PASSWORD, {
      name: 'Cliente 96',
      role: 'admin',
    });
  } catch (error: any) {
    if (error.message !== 'Usuário já existe') {
      process.exit(1);
    }
  }
}

main();

